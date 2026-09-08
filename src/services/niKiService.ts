import { Slide } from '../types';
import {
  searchKnowledge,
  retrieveContext,
  buildCurrentSlideContext,
  getCachedAnswer,
  setCachedAnswer,
  computeCacheKey,
  SearchPerformanceMeta,
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
  options?: string[];
  answeredOptionIndex?: number;
  debugMeta?: {
    searchTimeMs: number;
    hitsCount: number;
    currentSlide?: string;
    aiResponseTimeMs?: number;
    totalTimeMs: number;
    cacheHit: boolean;
    source: 'gemini' | 'local_knowledge' | 'cache';
  };
}

export interface AskNiKiParams {
  message: string;
  history: ChatMessage[];
  currentSlide?: Slide | null;
  mode?: 'chat' | 'interview' | 'quiz';
  onSearchStatusChange?: (status: 'idle' | 'searching' | 'generating') => void;
}

export interface NiKiResponse {
  reply: string;
  mode: 'chat' | 'interview' | 'quiz';
  source: 'gemini' | 'local_knowledge' | 'cache';
  options?: string[];
  meta?: {
    searchTimeMs: number;
    hitsCount: number;
    currentSlide?: string;
    aiResponseTimeMs?: number;
    totalTimeMs: number;
    cacheHit: boolean;
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
   */
  static async askNiKi({
    message,
    history,
    currentSlide,
    mode = 'chat',
    onSearchStatusChange
  }: AskNiKiParams): Promise<NiKiResponse> {
    const overallStartTime = performance.now();
    const cacheKey = computeCacheKey(message, currentSlide?.id, mode);

    // 1. Check Fast Session LRU Cache
    const cachedReply = getCachedAnswer(cacheKey);
    if (cachedReply) {
      const elapsed = Number((performance.now() - overallStartTime).toFixed(1));
      return {
        reply: cachedReply,
        mode,
        source: 'cache',
        meta: {
          searchTimeMs: 0.1,
          hitsCount: 1,
          currentSlide: currentSlide?.slideTitle,
          aiResponseTimeMs: 0,
          totalTimeMs: elapsed,
          cacheHit: true
        }
      };
    }

    // 2. Fast multi-stage search engine
    onSearchStatusChange?.('searching');
    const { hits, meta: searchMeta } = searchKnowledge(message, currentSlide, 4);
    const retrievedContext = retrieveContext(hits);
    const currentSlideContext = buildCurrentSlideContext(currentSlide);

    onSearchStatusChange?.('generating');

    // Format recent sliding conversation window (last 12 turns)
    const formattedHistory = history.slice(-12).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const response = await fetch('/api/niki/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          history: formattedHistory,
          currentSlideContext,
          currentSlideTitle: currentSlide?.slideTitle,
          currentSlideNumber: currentSlide?.slideNumber,
          retrievedContext,
          mode
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply && !data.fallback) {
          const totalTimeMs = Number((performance.now() - overallStartTime).toFixed(1));

          // Save to session cache
          setCachedAnswer(cacheKey, data.reply);

          return {
            reply: data.reply,
            mode: data.mode || mode,
            source: 'gemini',
            meta: {
              searchTimeMs: searchMeta.searchTimeMs,
              hitsCount: searchMeta.hitsCount,
              currentSlide: currentSlide?.slideTitle,
              aiResponseTimeMs: data.aiResponseTimeMs || 0,
              totalTimeMs,
              cacheHit: false
            }
          };
        }
      }
    } catch (err) {
      console.log('[Eunchae Engine] Backend request failed, utilizing local knowledge engine:', err);
    }

    // 3. High-precision local fallback engine (ensures 100% reliability)
    const localReply = synthesizeLocalResponse(message, currentSlide, mode);
    const totalTimeMs = Number((performance.now() - overallStartTime).toFixed(1));

    setCachedAnswer(cacheKey, localReply);

    return {
      reply: localReply,
      mode,
      source: 'local_knowledge',
      meta: {
        searchTimeMs: searchMeta.searchTimeMs,
        hitsCount: searchMeta.hitsCount,
        currentSlide: currentSlide?.slideTitle,
        aiResponseTimeMs: 0,
        totalTimeMs,
        cacheHit: false
      }
    };
  }
}

// Named alias for clean modern code
export const EunchaeService = NiKiService;
