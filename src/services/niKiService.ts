import { Slide, EunchaeSourceType, GroundingSource, DynamicWebsiteContext, KnowledgeChunk } from '../types';
import {
  searchKnowledge,
  retrieveContext,
  buildCurrentSlideContext,
  buildDynamicWebsiteContext,
  convertToKnowledgeChunks,
  analyzeQuestionRouting,
  RoutingAnalysis,
  getCachedAnswer,
  setCachedAnswer,
  computeCacheKey,
  initializeContentIndex
} from '../utils/eunchaeEngine';
import { synthesizeLocalResponse } from '../utils/nikiKnowledge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  slideRef?: number;
  mode?: 'chat' | 'interview' | 'quiz';
  source?: EunchaeSourceType;
  webSources?: GroundingSource[];
  routingCase?: string;
  options?: string[];
  answeredOptionIndex?: number;
  debugMeta?: {
    searchTimeMs: number;
    hitsCount: number;
    currentSlide?: string;
    aiResponseTimeMs?: number;
    totalTimeMs: number;
    cacheHit: boolean;
    source: EunchaeSourceType | 'cache';
    routingCase?: string;
    needsWebSearch?: boolean;
    memoryCount?: number;
  };
}

export interface AskNiKiParams {
  message: string;
  history: ChatMessage[];
  currentSlide?: Slide | null;
  allSlides?: Slide[];
  currentSlideIndex?: number;
  mode?: 'chat' | 'interview' | 'quiz';
  onSearchStatusChange?: (status: 'idle' | 'searching' | 'web_research' | 'generating') => void;
}

export interface NiKiResponse {
  reply: string;
  mode: 'chat' | 'interview' | 'quiz';
  source: EunchaeSourceType;
  webSources?: GroundingSource[];
  routingCase?: string;
  options?: string[];
  meta?: {
    searchTimeMs: number;
    hitsCount: number;
    currentSlide?: string;
    aiResponseTimeMs?: number;
    totalTimeMs: number;
    cacheHit: boolean;
    source: EunchaeSourceType | 'cache';
    routingCase?: string;
    needsWebSearch?: boolean;
    memoryCount?: number;
  };
}

export class NiKiService {
  /**
   * Pre-warm and index all slide content on startup
   */
  static preloadIndex(): void {
    initializeContentIndex();
  }

  /**
   * Primary entry point to ask Eunchae a question
   * Executes the strict priority routing:
   * Current Website Content -> Website Knowledge Base -> Web Search
   */
  static async askNiKi({
    message,
    history,
    currentSlide,
    allSlides,
    currentSlideIndex,
    mode = 'chat',
    onSearchStatusChange
  }: AskNiKiParams): Promise<NiKiResponse> {
    const overallStartTime = performance.now();
    const cacheKey = computeCacheKey(message, currentSlide?.id, mode);

    // 1. Dynamic Website Context Builder
    const dynamicContext = buildDynamicWebsiteContext(currentSlide, allSlides, currentSlideIndex);

    // 2. Hybrid RAG Retrieval (exact, phrase, fuzzy keywords, current-slide relevance)
    onSearchStatusChange?.('searching');
    const { hits, meta: searchMeta } = searchKnowledge(message, currentSlide, 4);
    const retrievedChunks = convertToKnowledgeChunks(hits);
    const retrievedContext = retrieveContext(hits);

    // 3. Question Analyzer and Smart Routing
    const routing = analyzeQuestionRouting(message, currentSlide, hits, history.length);

    if (routing.needsWebSearch) {
      onSearchStatusChange?.('web_research');
    } else {
      onSearchStatusChange?.('generating');
    }

    // 4. Check Fast Session LRU Cache for exact repeated queries
    const cachedReply = getCachedAnswer(cacheKey);
    if (cachedReply) {
      const elapsed = Number((performance.now() - overallStartTime).toFixed(1));
      return {
        reply: cachedReply,
        mode,
        source: routing.primarySource,
        routingCase: routing.routingCase,
        meta: {
          searchTimeMs: 0.1,
          hitsCount: 1,
          currentSlide: currentSlide?.slideTitle,
          aiResponseTimeMs: 0,
          totalTimeMs: elapsed,
          cacheHit: true,
          source: 'cache',
          routingCase: routing.routingCase,
          needsWebSearch: routing.needsWebSearch,
          memoryCount: history.length
        }
      };
    }

    // 5. Build memory sliding window (last 14 messages)
    const formattedHistory = history.slice(-14).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text
    }));

    // 6. Dispatch to server-side Gemini & Web Research endpoint
    try {
      const response = await fetch('/api/niki/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          history: formattedHistory,
          dynamicContext,
          retrievedChunks,
          retrievedContext,
          routingDecision: routing,
          mode
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply && !data.fallback) {
          const totalTimeMs = Number((performance.now() - overallStartTime).toFixed(1));

          setCachedAnswer(cacheKey, data.reply);

          const finalSource: EunchaeSourceType = data.source || routing.primarySource;

          return {
            reply: data.reply,
            mode: data.mode || mode,
            source: finalSource,
            webSources: data.webSources,
            routingCase: data.routingCase || routing.routingCase,
            meta: {
              searchTimeMs: searchMeta.searchTimeMs,
              hitsCount: searchMeta.hitsCount,
              currentSlide: currentSlide?.slideTitle,
              aiResponseTimeMs: data.aiResponseTimeMs || 0,
              totalTimeMs,
              cacheHit: false,
              source: finalSource,
              routingCase: data.routingCase || routing.routingCase,
              needsWebSearch: routing.needsWebSearch,
              memoryCount: history.length
            }
          };
        }
      }
    } catch (err) {
      console.log('[Eunchae Engine] Server request failed, engaging local handbook engine:', err);
    }

    // 7. High-precision local fallback engine ensuring 100% uptime
    const localReply = synthesizeLocalResponse(message, currentSlide, mode);
    const totalTimeMs = Number((performance.now() - overallStartTime).toFixed(1));

    setCachedAnswer(cacheKey, localReply);

    return {
      reply: localReply,
      mode,
      source: routing.primarySource,
      routingCase: routing.routingCase,
      meta: {
        searchTimeMs: searchMeta.searchTimeMs,
        hitsCount: searchMeta.hitsCount,
        currentSlide: currentSlide?.slideTitle,
        aiResponseTimeMs: 0,
        totalTimeMs,
        cacheHit: false,
        source: routing.primarySource,
        routingCase: routing.routingCase,
        needsWebSearch: routing.needsWebSearch,
        memoryCount: history.length
      }
    };
  }
}

// Named alias for clean modern code
export const EunchaeService = NiKiService;
