export type SectionId = 
  | 'agenda' 
  | 'oop' 
  | 'basic_sql' 
  | 'joins' 
  | 'commands' 
  | 'coding_dsa' 
  | 'hr';

export interface SectionMeta {
  id: SectionId;
  number: string;
  title: string;
  shortTitle?: string;
  subtitle: string;
  badge: string;
  color: string;
  accent: string;
  icon: string;
}

export interface TableColumn {
  header: string;
  key: string;
}

export interface TableData {
  title?: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface CodeBlockData {
  language: 'python' | 'sql' | 'text';
  code: string;
  title?: string;
  output?: string;
}

export interface CalloutItem {
  type: 'interview' | 'remember' | 'warning' | 'tip' | 'priority' | 'analogy' | 'output';
  label: string;
  content: string;
}

export interface SlideContent {
  paragraphs?: string[];
  bullets?: string[];
  tables?: TableData[];
  codeBlocks?: CodeBlockData[];
  callouts?: CalloutItem[];
  diagram?: string;
  keyNotes?: string[];
}

export interface Slide {
  id: string;
  slideNumber: number;
  sectionId: SectionId;
  sectionTitle: string;
  slideTitle: string;
  slideSubtitle?: string;
  badge?: string;
  isDivider?: boolean;
  isMandatoryChecklist?: boolean;
  content: SlideContent;
  tags?: string[];
}

export type EunchaeSourceType = 'current_website' | 'study_material' | 'web_research';

export interface GroundingSource {
  title: string;
  url?: string;
  snippet?: string;
}

export interface DynamicWebsiteContext {
  currentPage: string;
  currentSlideId: string;
  currentSlideTitle: string;
  currentSection: string;
  currentSlideContent: string;
  visibleText: string;
  nearbySlideContent: string;
}

export interface KnowledgeChunk {
  id: string;
  slideId: string;
  title: string;
  section: string;
  content: string;
  keywords: string[];
  topic: string;
}
