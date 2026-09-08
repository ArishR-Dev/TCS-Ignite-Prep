import { Slide } from '../types';

export const slidesBasicSQL: Slide[] = [
  {
    id: 'basic-sql-divider',
    slideNumber: 23,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideSubtitle: 'Theory → Real-life Example → SQL Code → Ready-to-say Interview Answer',
    isDivider: true,
    content: {
      paragraphs: [
        'Core relational database query fundamentals designed for TCS Ignite technical interviews.',
        'Covers SQL definitions, SELECT, WHERE with all operators, JOIN fundamentals, Sample Employee & Department tables, Quick Revision Table, Cheat-sheet, and Follow-Up questions.'
      ],
      keyNotes: [
        'Sample database state reused throughout this guide',
        'Includes set operation diagrams for joins and common operators reference'
      ]
    },
    tags: ['sql', 'select', 'where', 'join', 'database']
  },
  {
    id: 'basic-sql-intro',
    slideNumber: 24,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '1. What is SQL? & Sample Tables',
    slideSubtitle: 'Structured Query Language & Filing Cabinet Analogy',
    content: {
      paragraphs: [
        'Theory: SQL (Structured Query Language) is used to create, read, update, and delete data in a relational database.',
        'In simple words: SQL is how you ask a database questions, or tell it to change something.'
      ],
      callouts: [
        {
          type: 'analogy',
          label: 'Real-life analogy',
          content: 'Think of a database as a filing cabinet full of spreadsheets (tables). SQL is the language you use to ask it things like "show me every customer from Chennai," or to update a record.'
        }
      ],
      tables: [
        {
          title: 'employees',
          headers: ['emp_id', 'name', 'dept_id', 'salary'],
          rows: [
            ['1', 'Arun', '1', '45000'],
            ['2', 'Priya', '2', '38000'],
            ['3', 'Kumar', '1', '52000'],
            ['4', 'Divya', '3', '41000']
          ]
        },
        {
          title: 'departments',
          headers: ['dept_id', 'dept_name'],
          rows: [
            ['1', 'IT'],
            ['2', 'HR'],
            ['3', 'Sales']
          ]
        }
      ]
    },
    tags: ['sql', 'database', 'employees', 'departments']
  },
  {
    id: 'basic-sql-select',
    slideNumber: 25,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '2. SELECT 📥',
    slideSubtitle: 'Retrieving Rows, All Columns vs Specific Columns',
    content: {
      paragraphs: [
        'Theory: SELECT retrieves (fetches) data from one or more tables. * means "all columns."'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'Fetching all columns',
          code: `SELECT * FROM employees;`,
          output: '→ returns all 4 rows, every column.'
        },
        {
          language: 'sql',
          title: 'Fetching specific columns',
          code: `SELECT name, salary FROM employees;`,
          output: '→ returns just the name and salary columns, for every row.'
        }
      ],
      callouts: [
        {
          type: 'analogy',
          label: 'Real-life example',
          content: 'Like opening a spreadsheet and either viewing every column, or hiding all but the two you care about.'
        },
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“SELECT is used to fetch data from a database table. SELECT * fetches all columns, while naming specific columns fetches only those.”'
        }
      ]
    },
    tags: ['select', 'columns', 'fetch']
  },
  {
    id: 'basic-sql-where',
    slideNumber: 26,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '3. WHERE 🔍',
    slideSubtitle: 'Row Filtering & Common Operators Reference',
    content: {
      paragraphs: [
        'Theory: WHERE filters rows — only rows that satisfy the condition are returned.',
        'SELECT * FROM employees WHERE dept_id = 1;\n→ returns only Arun and Kumar (IT department).'
      ],
      tables: [
        {
          title: 'Common operators used with WHERE',
          headers: ['Operator', 'Meaning'],
          rows: [
            ['= , !=', 'equal to, not equal to'],
            ['>, <, >=, <=', 'comparison'],
            ['AND, OR, NOT', 'combine conditions'],
            ['BETWEEN ... AND ...', 'value within a range'],
            ['IN (...)', 'matches any value in a list'],
            ['LIKE', 'pattern match (% = any characters, _ = one character)'],
            ['IS NULL / IS NOT NULL', 'checks for missing values']
          ]
        }
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'WHERE Example Queries',
          code: `SELECT * FROM employees WHERE salary > 40000;
SELECT * FROM employees WHERE dept_id = 1 AND salary > 45000;
SELECT * FROM employees WHERE dept_id IN (1, 2);
SELECT * FROM employees WHERE name LIKE 'A%';   -- starts with A`
        }
      ],
      callouts: [
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“WHERE filters records based on a specified condition — only rows that satisfy the condition are included in the result.”'
        }
      ]
    },
    tags: ['where', 'operators', 'filter', 'like']
  },
  {
    id: 'basic-sql-join',
    slideNumber: 27,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '4. JOIN 🔗',
    slideSubtitle: 'Combining Tables via Keys & Core Join Types',
    content: {
      paragraphs: [
        'Theory: JOIN combines rows from two or more tables using a related column between them — usually a foreign key in one table matching a primary key in another.',
        'Why it\'s needed: Real databases split related data across multiple tables instead of repeating it everywhere. JOIN brings it back together when you need it — e.g. showing each employee alongside their department name, even though employees only stores a dept_id.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'INNER JOIN Query',
          code: `SELECT e.name, d.dept_name, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;`
        }
      ],
      tables: [
        {
          title: 'Result',
          headers: ['name', 'dept_name', 'salary'],
          rows: [
            ['Arun', 'IT', '45000'],
            ['Priya', 'HR', '38000'],
            ['Kumar', 'IT', '52000'],
            ['Divya', 'Sales', '41000']
          ]
        },
        {
          title: 'Types of JOIN',
          headers: ['Type', 'Returns'],
          rows: [
            ['INNER JOIN', 'Only rows with a match in both tables'],
            ['LEFT JOIN', 'All rows from the left table + matches from the right (NULL where there\'s no match)'],
            ['RIGHT JOIN', 'All rows from the right table + matches from the left (NULL where there\'s no match)'],
            ['FULL JOIN', 'All rows from both tables, matched wherever possible']
          ]
        }
      ],
      diagram: `INNER JOIN  →  A ∩ B     (only the overlap)
LEFT JOIN   →  all of A + overlap
RIGHT JOIN  →  overlap + all of B
FULL JOIN   →  A ∪ B     (everything)`,
      callouts: [
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“A JOIN combines rows from two or more tables based on a related column — usually a foreign key matching a primary key. INNER JOIN returns only matching rows, while LEFT, RIGHT, and FULL JOIN also include unmatched rows from one or both sides.”'
        }
      ]
    },
    tags: ['join', 'inner join', 'left join', 'foreign key']
  },
  {
    id: 'basic-sql-revision-cheat-sheet',
    slideNumber: 28,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '5. Quick Revision Table & 6. Cheat-Sheet',
    slideSubtitle: 'Fast Recall Matrix & Standard Interview Verbal Answers',
    content: {
      tables: [
        {
          title: 'Quick Revision Table 🔥',
          headers: ['Topic', 'One-line Theory'],
          rows: [
            ['SQL', 'Language used to query and manage data in a relational database'],
            ['SELECT', 'Retrieves data from a table'],
            ['SELECT *', 'Retrieves all columns'],
            ['WHERE', 'Filters rows based on a condition'],
            ['JOIN', 'Combines rows from two+ tables using a related column'],
            ['INNER JOIN', 'Only matching rows from both tables'],
            ['LEFT JOIN', 'All left-table rows + matches from the right']
          ]
        }
      ],
      callouts: [
        {
          type: 'interview',
          label: '“What is SQL?”',
          content: '“SQL (Structured Query Language) is used to create, read, update, and delete data in a relational database.”'
        },
        {
          type: 'interview',
          label: '“What does SELECT * do?”',
          content: '“It retrieves every column from a table. Naming specific columns instead retrieves only those.”'
        },
        {
          type: 'interview',
          label: '“What is the purpose of the WHERE clause?”',
          content: '“WHERE filters records based on a condition — only rows that satisfy it appear in the result.”'
        },
        {
          type: 'remember',
          label: '🧠 One-line revision',
          content: 'SELECT → Fetch data     📥\nWHERE  → Filter rows    🔍\nJOIN   → Combine tables 🔗'
        }
      ]
    },
    tags: ['revision', 'cheat sheet', 'verbal answers']
  },
  {
    id: 'basic-sql-follow-ups',
    slideNumber: 29,
    sectionId: 'basic_sql',
    sectionTitle: '03 — BASIC SQL INTERVIEW STUDY GUIDE',
    slideTitle: '7. Bonus: Likely Follow-Up Questions',
    slideSubtitle: 'High-Frequency Questions Immediately Following Basic SQL Queries',
    content: {
      paragraphs: [
        'Not asked directly, but these tend to follow right after SELECT / WHERE / JOIN — worth a one-liner each:'
      ],
      callouts: [
        {
          type: 'interview',
          label: '• WHERE vs HAVING?',
          content: 'WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY.'
        },
        {
          type: 'interview',
          label: '• Primary key vs Foreign key?',
          content: 'A primary key uniquely identifies each row in its own table; a foreign key is a column that references a primary key in another table — that relationship is exactly what makes JOIN possible.'
        },
        {
          type: 'interview',
          label: '• What does DISTINCT do?',
          content: 'Removes duplicate rows from the result.'
        },
        {
          type: 'interview',
          label: '• What does ORDER BY do?',
          content: 'Sorts the result set — ascending (ASC, default) or descending (DESC).'
        },
        {
          type: 'interview',
          label: '• Can you JOIN more than two tables?',
          content: 'Yes — chain multiple JOIN clauses in a single query.'
        }
      ]
    },
    tags: ['follow-up', 'distinct', 'order by', 'having', 'primary key']
  }
];
