import { Slide } from '../types';
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
