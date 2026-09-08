import { Slide, SectionMeta, SectionId } from '../types';
import { slidesCover } from './slidesCover';
import { slidesAgenda } from './slidesAgenda';
import { slidesOOP } from './slidesOOP';
import { slidesBasicSQL } from './slidesBasicSQL';
import { slidesJoins } from './slidesJoins';
import { slidesCommands } from './slidesCommands';
import { slidesCoding } from './slidesCoding';
import { slidesHR } from './slidesHR';
import { mandatoryDocumentsSlide } from './mandatoryDocumentsSlide';

export const SECTIONS: SectionMeta[] = [
  {
    id: 'agenda',
    number: '01',
    title: 'Interview Agenda & Rounds',
    subtitle: 'Tower B, TCS Yeshwanthpur Protocol',
    badge: 'Logistics & Process',
    color: 'from-blue-500/20 to-cyan-500/20',
    accent: 'text-cyan-400 border-cyan-500/30',
    icon: 'Calendar'
  },
  {
    id: 'oop',
    number: '02',
    title: 'OOP Interview Study Guide',
    subtitle: 'Theory, Analogies, Python & Answers',
    badge: 'Core Programming',
    color: 'from-emerald-500/20 to-teal-500/20',
    accent: 'text-emerald-400 border-emerald-500/30',
    icon: 'Code'
  },
  {
    id: 'basic_sql',
    number: '03',
    title: 'Basic SQL Study Guide',
    subtitle: 'SELECT, WHERE, JOIN & Operators',
    badge: 'Database Basics',
    color: 'from-amber-500/20 to-yellow-500/20',
    accent: 'text-amber-400 border-amber-500/30',
    icon: 'Database'
  },
  {
    id: 'joins',
    number: '04',
    title: 'SQL JOINs Complete Guide',
    subtitle: 'All 12 Joins, Venn Sets & Cheat Sheet',
    badge: 'Relational Queries',
    color: 'from-indigo-500/20 to-purple-500/20',
    accent: 'text-indigo-400 border-indigo-500/30',
    icon: 'Network'
  },
  {
    id: 'commands',
    number: '05',
    title: 'SQL Command Types',
    subtitle: 'DDL, DML, DCL, TCL & Transactions',
    badge: 'SQL Architecture',
    color: 'from-pink-500/20 to-rose-500/20',
    accent: 'text-rose-400 border-rose-500/30',
    icon: 'Terminal'
  },
  {
    id: 'coding_dsa',
    number: '06',
    title: 'Coding, DSA & SQL Answers',
    subtitle: '25 High-Priority Problems & Normalization',
    badge: 'Technical Practice',
    color: 'from-cyan-500/20 to-blue-500/20',
    accent: 'text-cyan-400 border-cyan-500/30',
    icon: 'Cpu'
  },
  {
    id: 'hr',
    number: '07',
    title: 'HR Round Quick Answers',
    subtitle: '17 Word-for-Word Behavioral Responses',
    badge: 'HR & Fit',
    color: 'from-purple-500/20 to-pink-500/20',
    accent: 'text-purple-400 border-purple-500/30',
    icon: 'Users'
  }
];

// Standard interview slides without the mandatory checklist (73 slides)
const standardRawSlides: Slide[] = [
  ...slidesCover,
  ...slidesAgenda,
  ...slidesOOP,
  ...slidesBasicSQL,
  ...slidesJoins,
  ...slidesCommands,
  ...slidesCoding,
  ...slidesHR
];

// Full master presentation slides including Slide #2 Mandatory Documents Checklist (74 slides)
const masterRawSlidesWithChecklist: Slide[] = [
  slidesCover[0], // Slide 1: Cover
  mandatoryDocumentsSlide, // Slide 2: Mandatory Checklist
  ...slidesCover.slice(1), // Slide 3: Preparation Roadmap & Table of Contents
  ...slidesAgenda,
  ...slidesOOP,
  ...slidesBasicSQL,
  ...slidesJoins,
  ...slidesCommands,
  ...slidesCoding,
  ...slidesHR
];

export const allSlides: Slide[] = standardRawSlides.map((slide, index) => ({
  ...slide,
  slideNumber: index + 1
}));

export const allSlidesWithoutChecklist: Slide[] = allSlides;
export const allSlidesWithChecklist: Slide[] = allSlides;

/**
 * Returns the standard 73 interview presentation slides.
 */
export const getAllSlides = (_isCompleted?: boolean): Slide[] => {
  return allSlides;
};

export const getSectionMeta = (sectionId: SectionId): SectionMeta | undefined => {
  return SECTIONS.find(s => s.id === sectionId);
};
