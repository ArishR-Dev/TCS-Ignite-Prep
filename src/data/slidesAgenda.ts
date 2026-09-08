import { Slide } from '../types';

export const slidesAgenda: Slide[] = [
  {
    id: 'agenda-divider',
    slideNumber: 3,
    sectionId: 'agenda',
    sectionTitle: '01 — TCS IGNITE INTERVIEW ROUND AGENDA',
    slideTitle: '01 — TCS IGNITE INTERVIEW ROUND AGENDA',
    slideSubtitle: 'On-Campus / Walk-in Step-by-Step Walkthrough',
    isDivider: true,
    content: {
      paragraphs: [
        'Complete overview of the arrival, document check, technical interview, managerial review, HR round, and final steps for the TCS B.Sc Ignite drive at Tower B, TCS Yeshwanthpur.'
      ],
      keyNotes: [
        'Venue: Tower B, TCS Yeshwanthpur (Official Reporting: 09:00 AM | Recommended Arrival: 08:45 AM)',
        'Key dynamic: In many cases TR, MR and HR are merged into one conversation'
      ]
    },
    tags: ['agenda', 'schedule', 'yeshwanthpur', 'rounds']
  },
  {
    id: 'agenda-arrival-doc-check',
    slideNumber: 4,
    sectionId: 'agenda',
    sectionTitle: '01 — TCS IGNITE INTERVIEW ROUND AGENDA',
    slideTitle: '1. Arrival & Registration & 2. Document Verification',
    slideSubtitle: 'Morning Protocol & Initial Verification Steps',
    content: {
      paragraphs: [
        '1. Arrival & registration (before 09:00 AM)',
        'Reach Tower B, TCS Yeshwanthpur by 08:45 AM (15 minutes early as instructed).',
        'Show your email / call letter and Aadhar at security / reception.',
        'You’ll be directed to a registration desk where they may:',
        '• Note your name, reference ID, reporting time',
        '• Collect a copy of your TCS application form and resume (if asked)',
        '2. Document verification (initial check)',
        'HR / recruitment team quickly checks that you’ve brought all original documents listed in your email:',
        '• Aadhar (original)',
        '• TCS Application Form',
        '• Updated Resume',
        '• 10th, 12th/Diploma, all graduation marksheets + degree/provisional, etc.....',
        'They may stamp/initial your file or note “documents verified” before calling you for rounds...'
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Round Structure Note',
          content: 'In many cases TR, MR and HR are merged into one conversation...'
        }
      ]
    },
    tags: ['arrival', 'registration', 'documents', 'aadhar', 'tower b']
  },
  {
    id: 'agenda-technical-round',
    slideNumber: 5,
    sectionId: 'agenda',
    sectionTitle: '01 — TCS IGNITE INTERVIEW ROUND AGENDA',
    slideTitle: '3. Technical Round (TR)',
    slideSubtitle: 'Duration, Core Focus Areas & Expectations',
    content: {
      paragraphs: [
        'For Ignite, many candidates report a technical interview before HR:',
        'Duration: ( based on your luck )',
        'Focus areas:',
        '• Programming fundamentals (loops, functions, OOPs basics)',
        '• One or two logic / coding questions (explain approach or write pseudo-code / small code)',
        '• Basic SQL (simple query: SELECT, WHERE, JOIN * concept)',
        '• DML , DDL , DCL ,TCL ( focus on DML DDL, if u have time then go for all..... DCL , TCL uhh easy dhaa )',
        '• Discussion on your projects (what you built, tech stack, your role, inspiration , why you built this )*',
        'Not every candidate gets a separate technical round on the same day, but for Ignite it’s common....'
      ],
      callouts: [
        {
          type: 'interview',
          label: '🎯 Technical Round — Resume Questions',
          content: '“Walk me through your resume.”\nHighlight academics, any internships/projects, certifications, and any relevant tech skills.\n\n“What have you learned from your college projects?”\nMention one project, your role, tech stack, and one key learning (teamwork, debugging, deployment, etc.).'
        }
      ]
    },
    tags: ['technical round', 'tr', 'resume', 'projects', 'ddl', 'dml']
  },
  {
    id: 'agenda-mr-hr-overview',
    slideNumber: 6,
    sectionId: 'agenda',
    sectionTitle: '01 — TCS IGNITE INTERVIEW ROUND AGENDA',
    slideTitle: '4. Managerial / MR & 5. HR Round Overview',
    slideSubtitle: 'Fit, Flexibility, Documents, and Pressure Handling',
    content: {
      paragraphs: [
        '4. Managerial / MR (Mostely they wont ask these.....but prepare it for good)',
        'In some drives, there’s a short managerial round:',
        'Duration: ( based on your luck )',
        'Focus:',
        '• How you handle pressure, deadlines, teamwork',
        '• Willingness to learn new tech, adapt to projects',
        '• Basic fit for team / project',
        '5. HR round (fit, flexibility, documents, process)',
        'This is almost certain for your slot:',
        'Duration: ( based on your luck )'
      ],
      callouts: [
        {
          type: 'priority',
          label: '⭐ Important HR Questions',
          content: '“Tell me about yourself.”\n“Why TCS?”\n“Are you open to relocation / any location?”\n“Are you comfortable with shifts (including night shifts)?”\n“Do you have any other offers?”hiring'
        }
      ]
    },
    tags: ['managerial', 'mr', 'hr', 'relocation', 'shifts']
  },
  {
    id: 'agenda-hr-typical-final-steps',
    slideNumber: 7,
    sectionId: 'agenda',
    sectionTitle: '01 — TCS IGNITE INTERVIEW ROUND AGENDA',
    slideTitle: '5. Typical HR Questions, Reconfirmation & 6. Final Steps',
    slideSubtitle: 'Comprehensive Question Checklist & Post-Interview Timeline',
    content: {
      paragraphs: [
        'Typical questions:',
        '• Why do you want to join TCS?',
        '• What do you know about TCS / TCS Ignite?',
        '• Why TCS over other companies?',
        '• “Any higher studies plans?”',
        '• Which type of role are you interested in – development, testing, support, etc.?',
        '• Are you comfortable with TCS service agreement / bond terms if applicable?',
        '• What are your strengths? / What is your biggest weakness?',
        '• Where do you see yourself in 5 years at TCS?',
        '• How do you handle pressure or tight deadlines?',
        '• Tell me about a time you handled a deadline / team conflict.',
        '• How quickly can you learn a new technology?',
        '• If a client is unhappy with your deliverable, what would you do?',
        'They reconfirm:',
        '• Your documents are complete and match your application',
        '• Your eligibility (no discrepancies in marks, backlogs, etc.)',
        '• Your readiness to join as per their timelinehirestepx+1',
        '6. Final steps on the day (if selected)',
        'If you clear all rounds:',
        'They may inform you on the spot or within a few days via email/portal.',
        'Next steps (usually after the interview day):',
        '• Offer letter generation (few days)',
        '• Acceptance on TCS portal (iBegin / NextStep)',
        '• Detailed document upload and background verification process'
      ]
    },
    tags: ['hr questions', 'eligibility', 'final steps', 'offer letter', 'nextstep']
  }
];
