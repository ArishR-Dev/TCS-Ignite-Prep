import { Slide, DynamicWebsiteContext, KnowledgeChunk, EunchaeSourceType } from '../types';
import { allSlidesWithChecklist } from '../data/allSlides';

/**
 * Normalized content index entry for high-speed retrieval
 */
export interface ContentIndexEntry {
  id: string;
  slideId: string;
  slideNumber: number;
  title: string;
  subtitle: string;
  section: string;
  sectionId: string;
  badge?: string;
  tags: string[];
  normalizedTitle: string;
  normalizedSubtitle: string;
  normalizedSection: string;
  normalizedContent: string;
  rawContent: string;
  keywords: Set<string>;
  tokens: string[];
  bullets: string[];
  keyNotes: string[];
  callouts: string[];
  codeSnippets: string[];
}

export interface SearchHit {
  entry: ContentIndexEntry;
  slide: Slide;
  score: number;
  matchStage: 'exact_title' | 'phrase' | 'keywords' | 'synonyms' | 'context';
  matchedTerms: string[];
  snippet: string;
}

export interface SearchPerformanceMeta {
  searchTimeMs: number;
  totalIndexed: number;
  hitsCount: number;
  topSlideNumber?: number;
  topSlideTitle?: string;
  cacheHit?: boolean;
}

// Synonym and domain vocabulary dictionary for TCS interview prep
const SYNONYM_MAP: Record<string, string[]> = {
  // OOP
  'oop': ['object', 'oriented', 'programming', 'class', 'objects', 'encapsulation', 'inheritance', 'polymorphism', 'abstraction'],
  'oops': ['oop', 'object', 'oriented', 'programming', 'class', 'inheritance', 'polymorphism'],
  'class': ['blueprint', 'object', 'instance', 'attributes', 'methods'],
  'object': ['instance', 'class', 'state', 'behavior'],
  'inheritance': ['inherit', 'parent', 'child', 'subclass', 'superclass', 'base', 'derived', 'extends', 'hierarchical', 'multilevel', 'single'],
  'inherit': ['inheritance', 'parent', 'child'],
  'polymorphism': ['poly', 'overloading', 'overriding', 'compile time', 'runtime', 'dynamic binding', 'shapes', 'area'],
  'poly': ['polymorphism', 'overloading', 'overriding'],
  'encapsulation': ['encap', 'data hiding', 'private', 'protected', 'getter', 'setter', 'wrapping', 'bank account'],
  'encap': ['encapsulation', 'data hiding'],
  'abstraction': ['abstract', 'interface', 'pure virtual', 'hiding implementation', 'blueprint', 'car accelerator'],
  'abstract': ['abstraction', 'interface'],
  'interface': ['abstraction', 'contract', 'methods'],
  'constructor': ['init', '__init__', 'instantiation', 'default constructor', 'parameterized'],
  
  // Database / SQL
  'db': ['database', 'dbms', 'rdbms', 'sql', 'tables'],
  'dbms': ['database', 'management', 'system', 'rdbms', 'sql', 'tables', 'schema'],
  'rdbms': ['relational', 'database', 'sql', 'tables', 'keys'],
  'sql': ['query', 'select', 'insert', 'update', 'delete', 'database'],
  'join': ['joins', 'inner join', 'left join', 'right join', 'full join', 'cross join', 'self join', 'natural join', 'outer join'],
  'joins': ['join', 'inner', 'left', 'right', 'full', 'cross', 'outer'],
  'inner join': ['matching rows', 'intersection', 'common records'],
  'left join': ['left outer join', 'all from left', 'null matches'],
  'right join': ['right outer join', 'all from right'],
  'full join': ['full outer join', 'all records', 'union join'],
  'cross join': ['cartesian product', 'every combination'],
  'self join': ['unary relationship', 'hierarchical table', 'employee manager'],
  'ddl': ['data definition language', 'create', 'alter', 'drop', 'truncate', 'rename'],
  'dml': ['data manipulation language', 'select', 'insert', 'update', 'delete'],
  'dcl': ['data control language', 'grant', 'revoke'],
  'tcl': ['transaction control language', 'commit', 'rollback', 'savepoint'],
  'acid': ['atomicity', 'consistency', 'isolation', 'durability', 'transactions'],
  'normalization': ['1nf', '2nf', '3nf', 'bcnf', 'redundancy', 'normal form', 'anomalies'],
  'primary key': ['unique identifier', 'not null', 'candidate key', 'composite key'],
  'foreign key': ['referential integrity', 'parent table', 'relationship'],
  'index': ['b-tree', 'indexing', 'fast search', 'performance', 'clustered', 'non-clustered'],
  'group by': ['aggregation', 'count', 'sum', 'avg', 'having'],
  'having': ['group by', 'aggregate condition', 'where vs having'],

  // OS & Networking
  'os': ['operating system', 'process', 'thread', 'deadlock', 'scheduling', 'memory', 'paging'],
  'deadlock': ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait'],
  'thread': ['multithreading', 'process vs thread', 'concurrency'],
  'network': ['osi', 'tcp/ip', 'ip address', 'router', 'protocol', 'dns', 'http', 'https'],

  // HR & Interview Process
  'hr': ['behavioral', 'interview', 'salary', 'strengths', 'weaknesses', 'why tcs', 'tcs ignite', 'relocation', 'night shifts', 'gap in education'],
  'behavioral': ['star method', 'conflict resolution', 'teamwork', 'leadership'],
  'docs': ['documents', 'verification', 'checklist', 'mark sheets', 'id proof', 'aadhaar', 'pan card', 'call letter'],
  'document': ['documents', 'verification', 'mandatory', 'certificates', 'aadhaar', 'photos'],
  'documents': ['docs', 'verification', 'mandatory', 'certificates', 'aadhaar', 'passport', 'photos', 'degrees'],
  'checklist': ['mandatory documents', 'verification', 'eligibility', 'originals'],
  'location': ['yeshwanthpur', 'tower b', 'bangalore', 'reporting time', 'venue'],
  'tcs': ['tata consultancy services', 'ignite', 'smart hiring', 'b.sc ignite', 'yeshwanthpur'],
  'dress code': ['formal attire', 'grooming', 'professional appearance']
};

/**
 * Standard text normalizer: lowercase, strip punctuation, collapse whitespace
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize string into meaningful alphanumeric search words (minimum 2 chars)
 */
export function tokenizeText(text: string): string[] {
  const norm = normalizeText(text);
  if (!norm) return [];
  return norm.split(/\s+/).filter(t => t.length >= 2);
}

// Global In-Memory Singleton Content Index
let cachedContentIndex: ContentIndexEntry[] | null = null;
let slideMapById: Map<string, Slide> = new Map();

/**
 * Compiles rich slide data into an indexed representation
 */
function compileSlideToEntry(slide: Slide): ContentIndexEntry {
  const title = slide.slideTitle || '';
  const subtitle = slide.slideSubtitle || '';
  const section = slide.sectionTitle || '';
  const sectionId = slide.sectionId || '';
  const badge = slide.badge || '';
  const tags = slide.tags || [];

  const bullets: string[] = slide.content.bullets || [];
  const keyNotes: string[] = slide.content.keyNotes || [];
  const callouts: string[] = (slide.content.callouts || []).map(c => `${c.label}: ${c.content}`);
  const codeSnippets: string[] = (slide.content.codeBlocks || []).map(cb => {
    let s = `${cb.language}: ${cb.code}`;
    if (cb.title) s = `${cb.title} - ${s}`;
    if (cb.output) s = `${s} -> Output: ${cb.output}`;
    return s;
  });
  const tables: string[] = (slide.content.tables || []).map(t => {
    return `${t.title || 'Table'}: ${t.headers.join(' | ')} | ${t.rows.map(r => r.join(' , ')).join(' ; ')}`;
  });
  const paragraphs: string[] = slide.content.paragraphs || [];

  const rawTextParts: string[] = [
    `Title: ${title}`,
    subtitle ? `Subtitle: ${subtitle}` : '',
    `Section: ${section} (#${slide.slideNumber})`,
    badge ? `Badge: ${badge}` : '',
    tags.length > 0 ? `Tags: ${tags.join(', ')}` : '',
    ...paragraphs,
    ...bullets.map(b => `• ${b}`),
    ...keyNotes.map(kn => `Keynote: ${kn}`),
    ...callouts,
    ...codeSnippets,
    ...tables
  ].filter(Boolean);

  const rawContent = rawTextParts.join('\n');
  const normalizedTitle = normalizeText(title);
  const normalizedSubtitle = normalizeText(subtitle);
  const normalizedSection = normalizeText(section);
  const normalizedContent = normalizeText(rawContent);

  const tokenSet = new Set<string>();
  tokenizeText(title).forEach(t => tokenSet.add(t));
  tokenizeText(subtitle).forEach(t => tokenSet.add(t));
  tokenizeText(section).forEach(t => tokenSet.add(t));
  tags.forEach(tag => tokenizeText(tag).forEach(t => tokenSet.add(t)));
  bullets.forEach(b => tokenizeText(b).forEach(t => tokenSet.add(t)));
  keyNotes.forEach(kn => tokenizeText(kn).forEach(t => tokenSet.add(t)));

  return {
    id: `idx-${slide.id}`,
    slideId: slide.id,
    slideNumber: slide.slideNumber,
    title,
    subtitle,
    section,
    sectionId,
    badge,
    tags,
    normalizedTitle,
    normalizedSubtitle,
    normalizedSection,
    normalizedContent,
    rawContent,
    keywords: tokenSet,
    tokens: Array.from(tokenSet),
    bullets,
    keyNotes,
    callouts,
    codeSnippets
  };
}

/**
 * Initialize and pre-cache the website content index on app load.
 * This runs once, memoizes in memory, and prevents redundant scanning.
 */
export function initializeContentIndex(slidesSource: Slide[] = allSlidesWithChecklist): ContentIndexEntry[] {
  if (cachedContentIndex && cachedContentIndex.length === slidesSource.length) {
    return cachedContentIndex;
  }

  const startTime = performance.now();
  slideMapById.clear();
  const entries: ContentIndexEntry[] = [];

  for (const slide of slidesSource) {
    slideMapById.set(slide.id, slide);
    entries.push(compileSlideToEntry(slide));
  }

  cachedContentIndex = entries;
  const elapsed = (performance.now() - startTime).toFixed(2);
  console.log(`[Eunchae Search Engine] Preloaded & indexed ${entries.length} slides in ${elapsed}ms`);
  return cachedContentIndex;
}

/**
 * Get the loaded content index (ensuring it is initialized)
 */
export function getContentIndex(): ContentIndexEntry[] {
  if (!cachedContentIndex) {
    return initializeContentIndex();
  }
  return cachedContentIndex;
}

/**
 * Expand query tokens with relevant domain synonyms
 */
function expandQueryTokens(tokens: string[]): { originalTokens: string[]; expandedTokens: Set<string> } {
  const expanded = new Set<string>();

  for (const token of tokens) {
    expanded.add(token);
    // Check direct match in synonym map
    if (SYNONYM_MAP[token]) {
      for (const syn of SYNONYM_MAP[token]) {
        tokenizeText(syn).forEach(t => expanded.add(t));
      }
    }
  }

  return {
    originalTokens: tokens,
    expandedTokens: expanded
  };
}

/**
 * Multi-Stage Fast Search Engine across the complete indexed knowledge base.
 *
 * Stage 1: Exact Title & Phrase Matching
 * Stage 2: Token & Keyword Frequency Matching
 * Stage 3: Domain Synonyms & Related Variations
 * Stage 4: Current Slide Context Boost & Dynamic Ranking
 */
export function searchKnowledge(
  query: string,
  currentSlide?: Slide | null,
  limit: number = 4
): { hits: SearchHit[]; meta: SearchPerformanceMeta } {
  const startTime = performance.now();
  const index = getContentIndex();

  if (!query || !query.trim()) {
    return {
      hits: [],
      meta: {
        searchTimeMs: Number((performance.now() - startTime).toFixed(2)),
        totalIndexed: index.length,
        hitsCount: 0
      }
    };
  }

  const normQuery = normalizeText(query);
  const queryTokens = tokenizeText(query);

  // Check if query is referencing the current slide context
  const isDeicticReference = /^(explain this|what is this|tell me about this|this slide|this topic|give me an example|summarize this|explain like i'm 5|simplify this|details on this)/i.test(query.trim());

  const { originalTokens, expandedTokens } = expandQueryTokens(queryTokens);
  const scoredHits: SearchHit[] = [];

  for (const entry of index) {
    const slide = slideMapById.get(entry.slideId) || allSlidesWithChecklist.find(s => s.id === entry.slideId);
    if (!slide) continue;

    let score = 0;
    let matchStage: SearchHit['matchStage'] = 'keywords';
    const matchedTerms: string[] = [];

    // --- STAGE 1: Exact Phrase & Title Match ---
    if (entry.normalizedTitle === normQuery) {
      score += 150;
      matchStage = 'exact_title';
      matchedTerms.push(entry.title);
    } else if (entry.normalizedTitle.includes(normQuery)) {
      score += 100;
      matchStage = 'exact_title';
      matchedTerms.push(entry.title);
    } else if (entry.normalizedContent.includes(normQuery)) {
      score += 45;
      matchStage = 'phrase';
      matchedTerms.push(normQuery);
    }

    // Check 2-word phrase matches if query has multiple tokens
    if (queryTokens.length >= 2) {
      for (let i = 0; i < queryTokens.length - 1; i++) {
        const biGram = `${queryTokens[i]} ${queryTokens[i + 1]}`;
        if (entry.normalizedTitle.includes(biGram)) {
          score += 40;
          matchedTerms.push(biGram);
        } else if (entry.normalizedContent.includes(biGram)) {
          score += 18;
          matchedTerms.push(biGram);
        }
      }
    }

    // --- STAGE 2: Keyword Match (Title, Subtitle, Tags, Section) ---
    for (const token of originalTokens) {
      if (entry.normalizedTitle.includes(token)) {
        score += 25;
        matchedTerms.push(token);
      }
      if (entry.normalizedSubtitle.includes(token)) {
        score += 12;
      }
      if (entry.normalizedSection.includes(token)) {
        score += 8;
      }
      if (entry.tags.some(t => normalizeText(t).includes(token))) {
        score += 20;
        matchedTerms.push(token);
      }

      // Keyword frequency in body content
      if (entry.keywords.has(token)) {
        score += 10;
      }
    }

    // --- STAGE 3: Related Keyword / Synonym Matching ---
    for (const synToken of expandedTokens) {
      if (!originalTokens.includes(synToken)) {
        if (entry.keywords.has(synToken)) {
          score += 8;
          matchedTerms.push(synToken);
        } else if (entry.normalizedTitle.includes(synToken)) {
          score += 15;
          matchedTerms.push(synToken);
        }
      }
    }

    // --- STAGE 4: Current Slide Context Boost ---
    if (currentSlide && entry.slideId === currentSlide.id) {
      if (isDeicticReference) {
        // Massive boost if user explicitly refers to current slide
        score += 200;
        matchStage = 'context';
        matchedTerms.push('active-slide');
      } else {
        // Mild contextual affinity
        score += 15;
      }
    }

    // Minimum relevance threshold
    if (score >= 12) {
      // Build an optimized, high-density snippet
      const snippetLines: string[] = [
        `[Slide #${entry.slideNumber}: ${entry.title} (${entry.section})]`,
        entry.subtitle ? `Subtitle: ${entry.subtitle}` : '',
        entry.bullets.length > 0 ? `Key Points: ${entry.bullets.slice(0, 3).join('; ')}` : '',
        entry.callouts.length > 0 ? `Callout: ${entry.callouts[0]}` : '',
        entry.codeSnippets.length > 0 ? `Code Sample: ${entry.codeSnippets[0].slice(0, 200)}...` : ''
      ].filter(Boolean);

      scoredHits.push({
        entry,
        slide,
        score,
        matchStage,
        matchedTerms: Array.from(new Set(matchedTerms)),
        snippet: snippetLines.join('\n')
      });
    }
  }

  // Sort strictly by relevance score descending
  scoredHits.sort((a, b) => b.score - a.score);
  const finalHits = scoredHits.slice(0, limit);

  const searchTimeMs = Number((performance.now() - startTime).toFixed(2));

  return {
    hits: finalHits,
    meta: {
      searchTimeMs,
      totalIndexed: index.length,
      hitsCount: finalHits.length,
      topSlideNumber: finalHits[0]?.entry.slideNumber,
      topSlideTitle: finalHits[0]?.entry.title
    }
  };
}

/**
 * Retrieve clean, focused context chunks for the AI prompt
 */
export function retrieveContext(hits: SearchHit[]): string {
  if (hits.length === 0) return '';
  return hits.map(hit => hit.snippet).join('\n---\n');
}

/**
 * Formats full textual context for the currently active slide
 */
export function buildCurrentSlideContext(slide?: Slide | null): string {
  if (!slide) return '';

  const parts: string[] = [
    `Title: ${slide.slideTitle}`,
    `Section: ${slide.sectionTitle} (Slide #${slide.slideNumber})`
  ];
  if (slide.slideSubtitle) parts.push(`Subtitle: ${slide.slideSubtitle}`);

  if (slide.content.paragraphs?.length) {
    parts.push(`Overview:\n${slide.content.paragraphs.join('\n\n')}`);
  }
  if (slide.content.bullets?.length) {
    parts.push(`Key Bullets:\n${slide.content.bullets.map(b => `- ${b}`).join('\n')}`);
  }
  if (slide.content.callouts?.length) {
    parts.push(`Tips & Rules:\n${slide.content.callouts.map(c => `[${c.type.toUpperCase()}] ${c.label}: ${c.content}`).join('\n')}`);
  }
  if (slide.content.codeBlocks?.length) {
    parts.push(`Code Examples:\n${slide.content.codeBlocks.map(cb => `\`\`\`${cb.language}\n${cb.code}\n\`\`\`${cb.output ? `\nOutput:\n${cb.output}` : ''}`).join('\n\n')}`);
  }
  if (slide.content.tables?.length) {
    parts.push(`Comparison Tables:\n${slide.content.tables.map(t => `${t.title || 'Table'}:\nHeaders: ${t.headers.join(' | ')}\nRows:\n${t.rows.map(r => r.join(' | ')).join('\n')}`).join('\n\n')}`);
  }

  return parts.join('\n');
}

// Session-based LRU Cache to achieve instant response speed for repeated questions
const SESSION_ANSWER_CACHE = new Map<string, { answer: string; timestamp: number }>();
const MAX_CACHE_SIZE = 100;

export function getCachedAnswer(cacheKey: string): string | null {
  const hit = SESSION_ANSWER_CACHE.get(cacheKey);
  if (hit) {
    // 30 minute valid cache window
    if (Date.now() - hit.timestamp < 30 * 60 * 1000) {
      return hit.answer;
    }
    SESSION_ANSWER_CACHE.delete(cacheKey);
  }
  return null;
}

export function setCachedAnswer(cacheKey: string, answer: string): void {
  if (SESSION_ANSWER_CACHE.size >= MAX_CACHE_SIZE) {
    const oldestKey = SESSION_ANSWER_CACHE.keys().next().value;
    if (oldestKey) SESSION_ANSWER_CACHE.delete(oldestKey);
  }
  SESSION_ANSWER_CACHE.set(cacheKey, {
    answer,
    timestamp: Date.now()
  });
}

export function computeCacheKey(message: string, currentSlideId?: string, mode?: string): string {
  return `${normalizeText(message)}::${currentSlideId || 'none'}::${mode || 'chat'}`;
}

/**
 * Builds the comprehensive dynamic website context object for Eunchae.
 * Provides the AI with direct awareness of the currently active screen,
 * visible text, section metadata, and spatial continuity with adjacent slides.
 */
export function buildDynamicWebsiteContext(
  currentSlide: Slide | null | undefined,
  allSlides: Slide[] = allSlidesWithChecklist,
  currentSlideIndex?: number
): DynamicWebsiteContext {
  if (!currentSlide) {
    return {
      currentPage: 'Cover Slide (Handbook Overview)',
      currentSlideId: 'cover',
      currentSlideTitle: 'TCS Ignite Interview Preparation Handbook',
      currentSection: 'Introduction & Logistics',
      currentSlideContent: 'Welcome to the TCS Ignite Interview Preparation Handbook for Tower B, Yeshwanthpur.',
      visibleText: 'TCS Ignite Interview Preparation Handbook. Select any slide or ask Eunchae a question to start studying.',
      nearbySlideContent: ''
    };
  }

  const resolvedIndex = currentSlideIndex !== undefined && currentSlideIndex >= 0
    ? currentSlideIndex
    : allSlides.findIndex(s => s.id === currentSlide.id);

  const total = allSlides.length;
  const pageNumber = resolvedIndex >= 0 ? resolvedIndex + 1 : currentSlide.slideNumber;
  const currentPage = `Slide ${pageNumber} of ${total} (${currentSlide.sectionTitle})`;

  const currentSlideContent = buildCurrentSlideContext(currentSlide);

  // High-density visible text (the core information visible on the user's screen right now)
  const visibleParts: string[] = [
    `TITLE: ${currentSlide.slideTitle}`,
    currentSlide.slideSubtitle ? `SUBTITLE: ${currentSlide.slideSubtitle}` : '',
    ...(currentSlide.content.paragraphs || []),
    ...(currentSlide.content.bullets || []).map(b => `• ${b}`),
    ...(currentSlide.content.keyNotes || []).map(k => `Note: ${k}`),
    ...(currentSlide.content.callouts || []).map(c => `[${c.type.toUpperCase()}] ${c.label}: ${c.content}`),
    ...(currentSlide.content.codeBlocks || []).map(cb => `Code (${cb.language}):\n${cb.code}${cb.output ? `\nOutput: ${cb.output}` : ''}`)
  ].filter(Boolean);

  const visibleText = visibleParts.join('\n');

  // Nearby slide context (spatial continuity: 1 slide before, 1 slide after)
  const nearbyParts: string[] = [];
  if (resolvedIndex > 0) {
    const prev = allSlides[resolvedIndex - 1];
    nearbyParts.push(`[Previous Slide #${prev.slideNumber}: "${prev.slideTitle}" (${prev.sectionTitle}) - Tags: ${(prev.tags || []).slice(0, 3).join(', ')}]`);
  }
  if (resolvedIndex >= 0 && resolvedIndex < total - 1) {
    const next = allSlides[resolvedIndex + 1];
    nearbyParts.push(`[Next Slide #${next.slideNumber}: "${next.slideTitle}" (${next.sectionTitle}) - Tags: ${(next.tags || []).slice(0, 3).join(', ')}]`);
  }

  const nearbySlideContent = nearbyParts.join('\n');

  return {
    currentPage,
    currentSlideId: currentSlide.id,
    currentSlideTitle: currentSlide.slideTitle,
    currentSection: currentSlide.sectionTitle,
    currentSlideContent,
    visibleText,
    nearbySlideContent
  };
}

/**
 * Converts search hits into standardized KnowledgeChunks for the RAG architecture
 */
export function convertToKnowledgeChunks(hits: SearchHit[]): KnowledgeChunk[] {
  return hits.map(hit => ({
    id: `chunk-${hit.entry.slideId}`,
    slideId: hit.entry.slideId,
    title: hit.entry.title,
    section: hit.entry.section,
    content: hit.snippet,
    keywords: Array.from(hit.entry.keywords).slice(0, 8),
    topic: hit.entry.tags?.[0] || hit.entry.section
  }));
}

export interface RoutingAnalysis {
  routingCase: 'case_a' | 'case_b' | 'case_c' | 'case_d' | 'case_e' | 'case_f';
  primarySource: EunchaeSourceType;
  needsWebSearch: boolean;
  isDeictic: boolean;
  isFollowUp: boolean;
  reasoning: string;
  topScore: number;
}

/**
 * Smart Question Routing Engine
 * Flow:
 * USER QUESTION -> QUESTION ANALYZER -> CURRENT WEBSITE CONTENT -> ENTIRE WEBSITE KNOWLEDGE -> WEB SEARCH IF REQUIRED -> CONTEXT BUILDER -> EUNCHAE
 *
 * Case A: Current content answers it (Current Website Content)
 * Case B: Current content doesn't answer it, but website knowledge base does (Study Material)
 * Case C: Website doesn't contain the answer (Web Search Fallback)
 * Case D: User explicitly asks for web/current/external information (Web Search)
 * Case E: User asks about "this" / deictic reference (Current Website Content)
 * Case F: User asks a follow-up (Conversation Memory + Current Website Context)
 */
export function analyzeQuestionRouting(
  query: string,
  currentSlide: Slide | null | undefined,
  topHits: SearchHit[],
  historyLength: number = 0
): RoutingAnalysis {
  const normQuery = normalizeText(query);
  const topScore = topHits[0]?.score || 0;

  // Case D: User explicitly asks for web research, current year/live info, or outside knowledge
  const isExplicitWebRequest = /(search (the )?(web|internet|online|current tcs website|tcs website|website)|look up online|google this|latest ignite|ignite hiring|latest version|in 2026|current ceo|who is the ceo|current market|latest news|current trend|latest release)/i.test(query);
  if (isExplicitWebRequest) {
    return {
      routingCase: 'case_d',
      primarySource: 'web_research',
      needsWebSearch: true,
      isDeictic: false,
      isFollowUp: false,
      reasoning: 'User explicitly requested live, current, or web-based information.',
      topScore
    };
  }

  // Case E: User asks about "this" or refers to the currently visible screen ("Look at the website" behavior)
  const isDeictic = /^(explain this|what is this|what does this mean|why(\?|$)|give an example|i don't understand this|explain the above|what should i remember|is this important|what can interviewer ask from this|explain simply|summarize this|simplify this|tell me about this)/i.test(query.trim())
    || query.toLowerCase().includes('this slide')
    || query.toLowerCase().includes('this topic')
    || query.toLowerCase().includes('this concept');

  if (isDeictic && currentSlide) {
    return {
      routingCase: 'case_e',
      primarySource: 'current_website',
      needsWebSearch: false,
      isDeictic: true,
      isFollowUp: false,
      reasoning: 'Query contains deictic reference to currently visible slide content.',
      topScore
    };
  }

  // Case F: User asks a short follow-up in ongoing conversation
  const isFollowUp = historyLength >= 2 && /^(can you give another|give another example|why is that|and what about|how does it differ|what else|continue|elaborate|can you show code|more examples)/i.test(query.trim());
  if (isFollowUp) {
    return {
      routingCase: 'case_f',
      primarySource: currentSlide ? 'current_website' : 'study_material',
      needsWebSearch: false,
      isDeictic: false,
      isFollowUp: true,
      reasoning: 'Query is a follow-up relying on short-term conversation memory.',
      topScore
    };
  }

  // Case A: Current slide content directly answers the question
  if (currentSlide) {
    const currentSlideTitleNorm = normalizeText(currentSlide.slideTitle);
    const queryTokens = tokenizeText(query);
    const slideMatches = queryTokens.some(t => currentSlideTitleNorm.includes(t)) || (topHits[0]?.entry.slideId === currentSlide.id && topScore >= 18);

    if (slideMatches) {
      return {
        routingCase: 'case_a',
        primarySource: 'current_website',
        needsWebSearch: false,
        isDeictic: false,
        isFollowUp: false,
        reasoning: 'Question is directly addressed by currently active slide content.',
        topScore
      };
    }
  }

  // Case B: Current slide does not answer it, but website study material does
  if (topHits.length > 0 && topScore >= 20) {
    return {
      routingCase: 'case_b',
      primarySource: 'study_material',
      needsWebSearch: false,
      isDeictic: false,
      isFollowUp: false,
      reasoning: 'Question matched relevant study material in the indexed website knowledge base.',
      topScore
    };
  }

  // Case C: Question is outside the website's study material -> Trigger Web Search
  return {
    routingCase: 'case_c',
    primarySource: 'web_research',
    needsWebSearch: true,
    isDeictic: false,
    isFollowUp: false,
    reasoning: 'Question is outside the handbook material. Engaging authoritative web search fallback.',
    topScore
  };
}
