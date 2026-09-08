import { Slide } from '../types';
import { allSlidesWithChecklist, SECTIONS } from '../data/allSlides';
import { searchKnowledge, SearchHit } from './eunchaeEngine';

export interface SearchResult {
  slide: Slide;
  relevanceScore: number;
  snippet: string;
}

/**
 * Strips and compiles all text from a slide into a searchable string representation
 */
export const extractSlideText = (slide: Slide): string => {
  const parts: string[] = [
    slide.slideTitle,
    slide.slideSubtitle || '',
    slide.sectionTitle,
    slide.badge || '',
    ...(slide.tags || [])
  ];

  if (slide.content.paragraphs) {
    parts.push(...slide.content.paragraphs);
  }
  if (slide.content.bullets) {
    parts.push(...slide.content.bullets);
  }
  if (slide.content.keyNotes) {
    parts.push(...slide.content.keyNotes);
  }
  if (slide.content.callouts) {
    slide.content.callouts.forEach(c => parts.push(`${c.label}: ${c.content}`));
  }
  if (slide.content.codeBlocks) {
    slide.content.codeBlocks.forEach(cb => {
      if (cb.title) parts.push(cb.title);
      parts.push(cb.code);
      if (cb.output) parts.push(cb.output);
    });
  }
  if (slide.content.tables) {
    slide.content.tables.forEach(t => {
      if (t.title) parts.push(t.title);
      parts.push(t.headers.join(' '));
      t.rows.forEach(r => parts.push(r.join(' ')));
    });
  }

  return parts.filter(Boolean).join(' ');
};

/**
 * Searches the website's slides dynamically using the high-performance Eunchae Search Engine
 */
export const searchWebsiteKnowledge = (
  query: string,
  currentSlide?: Slide | null,
  limit: number = 4
): SearchResult[] => {
  const { hits } = searchKnowledge(query, currentSlide, limit);
  return hits.map(hit => ({
    slide: hit.slide,
    relevanceScore: hit.score,
    snippet: hit.snippet
  }));
};

/**
 * Formats full textual context for the currently active slide
 */
export const buildCurrentSlideContext = (slide?: Slide | null): string => {
  if (!slide) return '';

  const lines: string[] = [
    `Title: ${slide.slideTitle}`,
    `Section: ${slide.sectionTitle} (#${slide.slideNumber})`,
  ];
  if (slide.slideSubtitle) lines.push(`Subtitle: ${slide.slideSubtitle}`);

  if (slide.content.paragraphs?.length) {
    lines.push(`Content:\n${slide.content.paragraphs.join('\n\n')}`);
  }
  if (slide.content.bullets?.length) {
    lines.push(`Bullets:\n${slide.content.bullets.map(b => `- ${b}`).join('\n')}`);
  }
  if (slide.content.callouts?.length) {
    lines.push(`Callouts:\n${slide.content.callouts.map(c => `[${c.type.toUpperCase()}] ${c.label}: ${c.content}`).join('\n')}`);
  }
  if (slide.content.codeBlocks?.length) {
    lines.push(
      `Code Snippets:\n${slide.content.codeBlocks.map(cb => `\`\`\`${cb.language}\n${cb.code}\n\`\`\`${cb.output ? `\nOutput: ${cb.output}` : ''}`).join('\n\n')}`
    );
  }
  if (slide.content.tables?.length) {
    lines.push(
      `Tables:\n${slide.content.tables.map(t => `${t.title || 'Table'}: Headers: ${t.headers.join(' | ')}\nRows:\n${t.rows.map(r => r.join(' | ')).join('\n')}`).join('\n\n')}`
    );
  }

  return lines.join('\n');
};

/**
 * Curated Quiz items sourced strictly from the website material
 */
export interface QuizItem {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  slideRef: number;
}

export const WEBSITE_QUIZ_BANK: QuizItem[] = [
  {
    id: 'quiz-oop-1',
    topic: 'OOP Concepts',
    question: 'Which OOP concept allows a child class to acquire properties and methods from a parent class?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correctIndex: 1,
    explanation: 'Inheritance allows a child class to inherit attributes and methods from a base class, promoting code reusability (DRY principle).',
    slideRef: 12
  },
  {
    id: 'quiz-oop-2',
    topic: 'OOP Concepts',
    question: 'Which OOP principle is demonstrated by bundling data attributes and methods that manipulate them together while restricting direct access?',
    options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Aggregation'],
    correctIndex: 1,
    explanation: 'Encapsulation bundles data and methods inside a class and protects internal state via access modifiers or getter/setter methods.',
    slideRef: 11
  },
  {
    id: 'quiz-sql-1',
    topic: 'SQL Joins',
    question: 'Which SQL JOIN returns all rows from the Left table, and matched rows from the Right table (filling NULLs when no match exists)?',
    options: ['INNER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
    correctIndex: 1,
    explanation: 'LEFT JOIN retains every record from the primary (left) table and supplements matching records from the secondary (right) table, substituting NULLs when no match is found.',
    slideRef: 29
  },
  {
    id: 'quiz-sql-2',
    topic: 'SQL Commands',
    question: 'Under which SQL command category do CREATE, ALTER, DROP, and TRUNCATE fall?',
    options: ['DML (Data Manipulation)', 'DDL (Data Definition)', 'DCL (Data Control)', 'TCL (Transaction Control)'],
    correctIndex: 1,
    explanation: 'DDL (Data Definition Language) commands define and alter the structure/schema of database objects (tables, indexes, views).',
    slideRef: 43
  },
  {
    id: 'quiz-sql-3',
    topic: 'SQL Commands',
    question: 'What is the key difference between DROP and TRUNCATE in SQL?',
    options: [
      'TRUNCATE deletes the table schema; DROP removes rows only',
      'DROP deletes data and table structure; TRUNCATE empties all rows but keeps the table schema intact',
      'DROP can be rolled back; TRUNCATE cannot',
      'There is no difference'
    ],
    correctIndex: 1,
    explanation: 'DROP removes the table completely from the database (schema and data). TRUNCATE removes all rows quickly while retaining the table definition for future inserts.',
    slideRef: 44
  },
  {
    id: 'quiz-dbms-1',
    topic: 'Database Normalization',
    question: 'What is the primary requirement for a relation to be in 1st Normal Form (1NF)?',
    options: [
      'No partial dependency on composite key',
      'All column values must be atomic (no multi-valued attributes or repeating groups)',
      'No transitive functional dependency',
      'Every determinant must be a candidate key'
    ],
    correctIndex: 1,
    explanation: '1NF mandates atomic values in every column—no comma-separated lists, arrays, or repeated groups.',
    slideRef: 54
  },
  {
    id: 'quiz-hr-1',
    topic: 'HR Protocol & Verification',
    question: 'For the TCS interview drive, which format of documents is strictly mandated?',
    options: [
      'Digital soft copies on mobile phone',
      'Physical printouts / hard copies only',
      'Scanned copies in Google Drive',
      'Only WhatsApp screenshots'
    ],
    correctIndex: 1,
    explanation: 'Slide #2 specifically states: "Strict Rule: Soft copies on mobile phones are NOT accepted. Carry physical hard copies and an extra set of photocopies/xerox."',
    slideRef: 2
  },
  {
    id: 'quiz-hr-2',
    topic: 'HR Round',
    question: 'When asked "Are you comfortable with night shifts and relocation?", what is the recommended TCS answer?',
    options: [
      'Decline immediately to avoid travel',
      'Show positive flexibility and enthusiasm to relocate to any delivery center across India',
      'Ask for work-from-home permanently',
      'Say you only prefer Bangalore'
    ],
    correctIndex: 1,
    explanation: 'TCS places high value on corporate mobility and 24/7 project readiness. Enthusiastically confirm willingness to work anywhere and across project shifts.',
    slideRef: 68
  }
];

/**
 * Curated Interview practice questions from website content
 */
export interface InterviewQuestion {
  id: string;
  category: 'OOP' | 'SQL' | 'DSA' | 'HR' | 'DBMS' | 'General';
  question: string;
  expectedKeyPoints: string[];
  idealAnswer: string;
  interviewTip: string;
}

export const WEBSITE_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int-oop-1',
    category: 'OOP',
    question: 'What is Inheritance in Object-Oriented Programming, and why is it used?',
    expectedKeyPoints: ['Parent/child hierarchy', 'Code reusability (DRY)', 'extends/derives', 'method overriding'],
    idealAnswer: 'Inheritance is an OOP mechanism where a new class (child/derived) inherits fields and methods from an existing class (parent/base). It promotes code reusability and establishes an "IS-A" relationship between entities.',
    interviewTip: 'Keep your definition concise, cite an intuitive hierarchy like Vehicle → Car, and mention that it prevents code duplication.'
  },
  {
    id: 'int-oop-2',
    category: 'OOP',
    question: 'Explain the difference between Compile-Time and Run-Time Polymorphism.',
    expectedKeyPoints: ['Method Overloading vs Overriding', 'Static binding vs Dynamic binding', 'Resolved during compilation vs execution'],
    idealAnswer: 'Compile-Time polymorphism is achieved through Method Overloading (same method name, different signatures), resolved by the compiler. Run-Time polymorphism is achieved through Method Overriding (subclass overrides superclass method), resolved dynamically at runtime using virtual tables or dynamic dispatch.',
    interviewTip: 'Mention that in Python, method overloading is simulated via default arguments or *args, whereas overriding is native.'
  },
  {
    id: 'int-sql-1',
    category: 'SQL',
    question: 'What is the difference between WHERE and HAVING clauses in SQL?',
    expectedKeyPoints: ['Row-level vs Aggregate filter', 'Executes before GROUP BY vs after GROUP BY', 'HAVING used with COUNT(), AVG(), SUM()'],
    idealAnswer: 'The WHERE clause filters individual rows before grouping or aggregation takes place. The HAVING clause filters entire groups created by GROUP BY, allowing conditions on aggregate functions like COUNT(), SUM(), or AVG().',
    interviewTip: 'Remember this sequence: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.'
  },
  {
    id: 'int-sql-2',
    category: 'SQL',
    question: 'Explain the difference between DELETE, TRUNCATE, and DROP.',
    expectedKeyPoints: ['DML vs DDL', 'Row-by-row vs Deallocates pages', 'Preserves table structure vs removes table definition', 'Rollback capability'],
    idealAnswer: 'DELETE is a DML command that removes specific rows matching a condition and can be rolled back. TRUNCATE is a DDL command that quickly removes all rows by deallocating storage pages while keeping the schema intact. DROP removes both data and the entire table schema from the database.',
    interviewTip: 'Highlight that TRUNCATE is significantly faster than DELETE for large tables because it does not log individual row deletions.'
  },
  {
    id: 'int-hr-1',
    category: 'HR',
    question: 'Tell me about yourself and why you want to join TCS.',
    expectedKeyPoints: ['Educational background', 'Technical skills & projects', 'TCS culture/growth', 'Eagerness to learn in enterprise tech'],
    idealAnswer: 'I have a strong foundation in Computer Science with a focus on OOP, relational databases, and problem solving. I want to join TCS because of its global scale, structured learning culture, and diverse enterprise projects where I can apply my skills and build a long-term technology career.',
    interviewTip: 'Structure your answer in 3 parts: Present (who you are & current degree), Past (key project or achievement), Future (why TCS fits your career goals).'
  },
  {
    id: 'int-hr-2',
    category: 'HR',
    question: 'Are you ready to relocate and work in rotational or night shifts?',
    expectedKeyPoints: ['Unconditional affirmative', 'Excitement to adapt', 'Understanding of 24/7 global client support'],
    idealAnswer: 'Yes, absolutely! I am 100% open to relocating to any TCS delivery center across India and comfortable working in rotational or night shifts based on client and project requirements.',
    interviewTip: 'Do not hesitate or give conditional answers here. Clear, prompt enthusiasm demonstrates corporate readiness.'
  }
];

/**
 * Generates an intelligent, grounded response using local knowledge synthesis
 * (used when offline, without API key, or as an instantaneous local engine)
 */
export const synthesizeLocalResponse = (
  query: string,
  currentSlide?: Slide | null,
  mode: 'chat' | 'interview' | 'quiz' = 'chat'
): string => {
  const cleanQuery = query.toLowerCase().trim();

  // Mode: Quiz
  if (mode === 'quiz' || cleanQuery.includes('quiz me') || cleanQuery === 'quiz') {
    const randomIndex = Math.floor(Math.random() * WEBSITE_QUIZ_BANK.length);
    const item = WEBSITE_QUIZ_BANK[randomIndex];
    return `### 🧠 Eunchae Quiz Challenge: ${item.topic}\n\n**${item.question}**\n\n${item.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n\n*Reply with A, B, C, or D to check your answer!*`;
  }

  // Quiz Option Answer check
  const singleOptionMatch = cleanQuery.match(/^[a-d]$/i) || cleanQuery.match(/^(option\s*)?([a-d])\b/i);
  if (singleOptionMatch) {
    const letter = (singleOptionMatch[2] || singleOptionMatch[0]).toUpperCase();
    const chosenIndex = letter.charCodeAt(0) - 65;
    
    // Find matched question if any or pick first
    const q = WEBSITE_QUIZ_BANK[0];
    const isCorrect = chosenIndex === q.correctIndex;

    return isCorrect
      ? `✅ **Correct! Excellent job!**\n\n**Explanation:** ${q.explanation}\n\n💡 **Interview Tip:** Review Slide #${q.slideRef} in your deck for deeper review.\n\n*Type **"quiz me"** for another question, or ask any question!*`
      : `❌ **Not quite!** You selected **${letter}**, but the correct answer is **${String.fromCharCode(65 + q.correctIndex)}**.\n\n**Why?** ${q.explanation}\n\n💡 **Quick Note:** Check out Slide #${q.slideRef} to reinforce this concept.\n\n*Type **"quiz me"** to try another one!*`;
  }

  // Mode: Interview Practice
  if (mode === 'interview' || cleanQuery.includes('interview me') || cleanQuery === 'interview') {
    const randomQuestion = WEBSITE_INTERVIEW_QUESTIONS[Math.floor(Math.random() * WEBSITE_INTERVIEW_QUESTIONS.length)];
    return `### 🎤 Eunchae Mock Interview Drill: [${randomQuestion.category}]\n\n**Question:**\n> "${randomQuestion.question}"\n\nTake a deep breath and type your answer below. I will evaluate what you did well, what could be improved, and give you an ideal interview response!`;
  }

  // Check if user is asking about "this" / "this slide"
  if (
    currentSlide &&
    (cleanQuery === 'explain this' ||
      cleanQuery.includes('explain this') ||
      cleanQuery.includes('what is this') ||
      cleanQuery.includes('give me an example') ||
      cleanQuery.includes('summarize this') ||
      cleanQuery.includes('about this'))
  ) {
    const bullets = currentSlide.content.bullets?.map(b => `• ${b}`).join('\n') || '';
    const codeBlock = currentSlide.content.codeBlocks?.[0];
    const tip = currentSlide.content.callouts?.[0];

    return `### ✦ About Slide #${currentSlide.slideNumber}: ${currentSlide.slideTitle}

${currentSlide.slideSubtitle ? `*${currentSlide.slideSubtitle}*\n\n` : ''}${currentSlide.content.paragraphs?.[0] || 'Here is the breakdown for this topic:'}

${bullets ? `**Core Takeaways:**\n${bullets}\n` : ''}
${codeBlock ? `**Code Example:**\n\`\`\`${codeBlock.language}\n${codeBlock.code}\n\`\`\`${codeBlock.output ? `\n*Expected Output:* \`${codeBlock.output}\`\n` : ''}` : ''}
${tip ? `💡 **Interview Tip:** ${tip.content}\n` : ''}
*Ask me anything specific about this slide, or type "quiz me" to test your recall!*`;
  }

  // Specific high-frequency topics
  if (cleanQuery.includes('oop') || cleanQuery.includes('object oriented')) {
    return `### 🏛️ Object-Oriented Programming (OOP) Core Concepts

OOP organizes software around **objects** (data + behaviors) rather than pure actions and logic.

#### The 4 Pillars of OOP:
1. **Encapsulation:** Bundling data and methods into a single unit (class) while restricting unauthorized direct access.
2. **Inheritance:** Enabling a child class to inherit properties and methods from a parent class (promoting DRY code reuse).
3. **Polymorphism:** Ability to present the same interface for differing underlying data types ("Many Forms" - overloading & overriding).
4. **Abstraction:** Hiding internal complex implementation details and exposing only essential interface operations.

💡 **Interview Tip:**
When asked "What is OOP?", define it in one sentence, name the 4 pillars immediately, and provide an analogy like *Vehicle (Parent) → ElectricCar (Child)*. (Check Slide #10–#16).`;
  }

  if (cleanQuery.includes('inherit')) {
    return `### 🔗 Inheritance in Simple Terms

**Inheritance** allows a class (the *child* or *derived* class) to automatically acquire attributes and methods from an existing class (the *parent* or *base* class).

\`\`\`
Parent Class (Base)
     ↓
Child Class (Derived) -> Gets all parent features + adds its own
\`\`\`

#### Example in Python:
\`\`\`python
class Employee:
    def __init__(self, name, emp_id):
        self.name = name
        self.emp_id = emp_id

class Developer(Employee):
    def code(self):
        return f"{self.name} is writing clean code."
\`\`\`

💡 **Interview Tip:**
Mention that inheritance promotes **code reusability** and prevents boilerplate repetition. Mention the \`super()\` function in Python or Java when calling parent constructors!`;
  }

  if (cleanQuery.includes('encapsulat')) {
    return `### 🔒 Encapsulation Explained

**Encapsulation** is the practice of wrapping data (variables) and methods (functions) together in a single class, while restricting direct access to internal components.

#### Real-World Analogy:
Think of a **medical capsule**—medicine is safely sealed inside so it cannot be tampered with directly. You access or modify it only through authorized interfaces (getters & setters).

💡 **Interview Tip:**
State clearly: *"Encapsulation ensures data hiding, prevents accidental corruption, and enhances security."* In Python, prefixing an attribute with double underscores (\`__private_var\`) activates name mangling.`;
  }

  if (cleanQuery.includes('polymorph')) {
    return `### 🎭 Polymorphism Explained

**Polymorphism** translates literally to *"many forms"*. It allows an entity (like a function, operator, or method) to behave differently depending on the object triggering it.

#### Two Key Types:
1. **Compile-Time Polymorphism (Method Overloading):** Methods share the same name with different parameter signatures.
2. **Run-Time Polymorphism (Method Overriding):** A child class provides a custom implementation of a method defined in its parent.

#### Quick Example:
\`\`\`python
class Dog:
    def speak(self): return "Woof!"

class Cat:
    def speak(self): return "Meow!"

for animal in [Dog(), Cat()]:
    print(animal.speak()) # Same method call, different behaviors!
\`\`\`

💡 **Interview Tip:**
Point out that Python uses *Duck Typing* ("If it walks like a duck and quacks like a duck, it is a duck"), making polymorphism natural and dynamic.`;
  }

  if (cleanQuery.includes('join') || cleanQuery.includes('sql join')) {
    return `### 🔀 SQL JOINs Cheat Sheet

A **JOIN** combines rows from two or more tables based on a related column between them.

1. **INNER JOIN:** Returns records with matching values in *both* tables.
2. **LEFT JOIN (LEFT OUTER):** Returns *all* rows from the left table, plus matched rows from the right table (unmatched right rows become NULL).
3. **RIGHT JOIN (RIGHT OUTER):** Returns *all* rows from the right table, plus matched rows from the left table.
4. **FULL OUTER JOIN:** Returns all records when there is a match in either left or right table.
5. **CROSS JOIN:** Produces the Cartesian product ($M \\times N$ rows).
6. **SELF JOIN:** Joins a table to itself (useful for hierarchical structures like employee-manager relationships).

💡 **Interview Tip:**
Interviewers love asking: *"What does an anti-join do?"* Answer: An anti-join (e.g. \`LEFT JOIN ... WHERE right.id IS NULL\`) extracts records from the left table that have NO corresponding match in the right table! (Slide #27–#38).`;
  }

  if (cleanQuery.includes('normaliz') || cleanQuery.includes('1nf') || cleanQuery.includes('2nf') || cleanQuery.includes('3nf')) {
    return `### 📐 Database Normalization

**Normalization** is the systematic process of organizing data in a relational database to minimize redundancy and avoid insertion, update, and deletion anomalies.

- **1NF (First Normal Form):** Every column must contain atomic (indivisible) values. No multi-valued lists or repeating groups.
- **2NF (Second Normal Form):** Must be in 1NF **AND** eliminate all partial dependencies (every non-prime attribute must depend on the full composite primary key).
- **3NF (Third Normal Form):** Must be in 2NF **AND** eliminate transitive dependencies ($A \\rightarrow B \\rightarrow C$).
- **BCNF (Boyce-Codd NF):** Stricter version of 3NF where for every functional dependency $X \\rightarrow Y$, $X$ must be a super key.

💡 **Interview Tip:**
Remember the classic motto: *"The key, the whole key, and nothing but the key, so help me Codd."* (Slide #54).`;
  }

  if (cleanQuery.includes('document') || cleanQuery.includes('carry') || cleanQuery.includes('what should i bring')) {
    return `### 📋 Mandatory Documents Checklist for TCS Drive

According to Slide #2 (Verification Gatekeeper), here are the **7 mandatory documents** you must carry:

1. **TCS Interview Invite Mail Printout**
2. **TCS Application Form** (filled and printed)
3. **Updated Resume** (hard copy)
4. **PAN Card** (original government ID)
5. **E-Aadhar Card** (unmasked, without password, downloaded freshly from portal, printed)
6. **10th & 12th Marksheets** (originals)
7. **College Marksheets till 4th Semester** (original or attested copies from college)

⚠️ **Strict Rules:**
- **Physical Hard Copies Only:** Soft copies on phones are strictly NOT accepted!
- **Photocopies:** Bring one complete extra set of xerox copies for all documents.`;
  }

  if (cleanQuery.includes('hr') || cleanQuery.includes('behavioral') || cleanQuery.includes('introduce yourself')) {
    return `### 🤝 TCS HR Round Essentials

The HR round at TCS tests your cultural fit, communication clarity, and corporate commitment.

#### Top Questions & Strategy:
1. **"Tell me about yourself":** Keep it under 90 seconds. Cover your degree, technical projects, problem-solving passion, and why TCS.
2. **"Relocation & Night Shifts":** Give an immediate and enthusiastic **YES**. Confirm flexibility across all Indian delivery centers and rotational shifts.
3. **"Why TCS?":** Highlight its enterprise reputation, structured learning (Ignite/Elevate programs), ethical Tata heritage, and long-term career stability.
4. **"Where do you see yourself in 5 years?":** State your goal to master full-stack/cloud technologies, contribute to mission-critical client solutions, and mentor junior developers.

💡 **Interview Tip:**
Check Slide #65–#73 for 17 word-for-word behavioral interview scripts!`;
  }

  if (cleanQuery.includes('ddl') || cleanQuery.includes('dml') || cleanQuery.includes('dcl') || cleanQuery.includes('tcl')) {
    return `### ⚡ SQL Command Classifications

SQL commands are grouped into 4 primary sub-languages:

- **DDL (Data Definition Language):** \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`, \`RENAME\` (Defines structure/schema).
- **DML (Data Manipulation Language):** \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\` (Manipulates row data).
- **DCL (Data Control Language):** \`GRANT\`, \`REVOKE\` (Manages database permissions).
- **TCL (Transaction Control Language):** \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\` (Controls transactional integrity).

💡 **Interview Tip:**
Remember that DDL commands auto-commit immediately, whereas DML operations can be rolled back within a transaction. (Slide #42–#47).`;
  }

  // Dynamic search through all slides
  const searchHits = searchWebsiteKnowledge(query, currentSlide, 3);
  if (searchHits.length > 0) {
    const primary = searchHits[0].slide;
    const bullets = primary.content.bullets?.slice(0, 4).map(b => `• ${b}`).join('\n');
    const paragraph = primary.content.paragraphs?.[0] || '';
    const tip = primary.content.callouts?.[0];

    return `### ✦ ${primary.slideTitle} (Slide #${primary.slideNumber})

${primary.slideSubtitle ? `*${primary.slideSubtitle}*\n\n` : ''}${paragraph}

${bullets ? `\n**Key Takeaways from the Handbook:**\n${bullets}\n` : ''}
${tip ? `\n💡 **Interview Tip:** ${tip.content}\n` : ''}
*(Related Section: **${primary.sectionTitle}** • Slide #${primary.slideNumber})*

Would you like me to quiz you on this topic, give you a code example, or explain it with a beginner-friendly analogy?`;
  }

  // Fallback when not found
  return `I couldn't find that in your interview-preparation material. Try asking me about one of the topics covered on this website:

• **Object-Oriented Programming (OOP)** (Inheritance, Polymorphism, Encapsulation, Abstraction)
• **SQL Queries & Commands** (SELECT, WHERE, HAVING, DDL, DML, DCL, TCL)
• **SQL JOINs Complete Guide** (INNER, LEFT, RIGHT, FULL, SELF, ANTI-JOIN)
• **Database Normalization & DBMS** (1NF, 2NF, 3NF, BCNF, ACID properties)
• **Coding & DSA Interview Questions** (Strings, arrays, recursion, sorting)
• **Mandatory Verification Documents Checklist** (7 documents to carry)
• **HR Round Behavioral Questions & Answers** (Relocation, shifts, introduction)

You can also click **"Quiz Me 🧠"** or **"Interview Me 🎤"** to practice!`;
};
