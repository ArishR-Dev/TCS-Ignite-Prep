import { Slide } from '../types';

export const slidesCover: Slide[] = [
  {
    id: 'cover',
    slideNumber: 1,
    sectionId: 'agenda',
    sectionTitle: 'COVER',
    slideTitle: 'TCS B.Sc IGNITE',
    slideSubtitle: 'INTERVIEW PREPARATION',
    isDivider: true,
    content: {
      paragraphs: [
        'Technical • SQL • OOP • Coding • DSA • HR',
        'Comprehensive Personal Interview-Preparation Handbook',
        'Prepared for: SUBASHINI',
        'Student Name: ARISH',
        'Venue Focus: Tower B, TCS Yeshwanthpur'
      ],
      keyNotes: [
        'Organized into 7 Master Sections with 100% faithful source content',
        'Complete with Python algorithms, SQL queries, outputs, memory tricks, and HR verbal responses'
      ]
    },
    tags: ['cover', 'tcs ignite', 'subashini', 'arish', 'handbook']
  },
  {
    id: 'contents-roadmap',
    slideNumber: 2,
    sectionId: 'agenda',
    sectionTitle: 'CONTENTS & ROADMAP',
    slideTitle: 'Preparation Roadmap & Table of Contents',
    slideSubtitle: '7 Comprehensive Modules Designed for Complete Interview Mastery',
    content: {
      tables: [
        {
          headers: ['#', 'Section', 'Coverage Details', 'Focus'],
          rows: [
            ['01', 'TCS Ignite Interview Agenda', 'Arrival, Doc Verification, TR, MR, HR, Resume walkthrough', 'Process & Logistics'],
            ['02', 'OOP Interview Study Guide', 'Classes, 4 Pillars, Overloading vs Overriding, Constructor, ABC, Follow-ups', 'Core Concepts & Python'],
            ['03', 'Basic SQL Study Guide', 'SELECT, WHERE, JOINs, Operators table, Common queries, Follow-ups', 'RDBMS Query Basics'],
            ['04', 'SQL JOINs Complete Guide', 'All 12 Joins: Inner, Outer, Cross, Self, Equi, Natural, Semi, Anti, Lateral', 'Relational Operations'],
            ['05', 'SQL Command Types', 'DDL, DML, DCL, TCL with rollback, savepoints, comparison matrix', 'Database Commands'],
            ['06', 'Coding, DSA & SQL Answers', 'Project Qs, Strings, Arrays, Kadane, Prefix Sum, Sorts, Salary, 1NF-3NF', 'High-Priority Technical'],
            ['07', 'HR & Behavioral Answers', '17 Word-for-Word Verbal Responses for TCS Ignite HR & Fit Round', 'Behavioral & Fit']
          ]
        }
      ],
      callouts: [
        {
          type: 'tip',
          label: 'Study Tip for Subashini',
          content: 'Use the navigation bar or press "G" to open the slide grid, "/" to search any topic instantly, and use the Presentation Mode to practice speaking answers out loud.'
        }
      ]
    },
    tags: ['roadmap', 'contents', 'agenda', 'navigation']
  }
];
