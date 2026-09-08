import { Slide } from '../types';

export const slidesJoins: Slide[] = [
  {
    id: 'joins-divider',
    slideNumber: 30,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '04 — SQL JOINS — THE COMPLETE GUIDE 🗄️',
    slideSubtitle: 'Theory, Syntax, Runnable Examples & Outputs for All 12 Join Types',
    isDivider: true,
    content: {
      paragraphs: [
        'A JOIN combines rows from two or more tables based on a related column.',
        'This guide covers all major JOIN types — the theory behind each, the syntax, a runnable example, and the output it produces — plus a cheat sheet and visual summary for quick recall.',
        'What\'s covered:\n• Basic Joins: Inner · Left · Right · Full Outer · Cross · Self\n• Condition-Based Joins: Equi · Non-Equi\n• Special Joins: Natural · Semi · Anti\n• Advanced: Lateral'
      ]
    },
    tags: ['joins', 'complete guide', 'inner', 'left', 'outer', 'cheat sheet']
  },
  {
    id: 'joins-tables-taxonomy',
    slideNumber: 31,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: 'Example Tables & JOIN Taxonomy Tree',
    slideSubtitle: 'Base Data for Examples & Structural Category Breakdown',
    content: {
      tables: [
        {
          title: 'Employees',
          headers: ['EmpID', 'Name', 'DeptID', 'Salary', 'ManagerID'],
          rows: [
            ['1', 'Alice', '10', '50000', 'NULL'],
            ['2', 'Bob', '20', '60000', '1'],
            ['3', 'Charlie', '30', '45000', '1'],
            ['4', 'David', '50', '40000', '2']
          ]
        },
        {
          title: 'Departments',
          headers: ['DeptID', 'DeptName'],
          rows: [
            ['10', 'HR'],
            ['20', 'IT'],
            ['30', 'Sales'],
            ['40', 'Finance']
          ]
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Two things to notice, since they drive every JOIN\'s behavior below',
          content: '• David has DeptID = 50, which doesn\'t exist in Departments.\n• Finance (DeptID = 40) has no employee assigned to it.'
        }
      ],
      diagram: `SQL JOINS
│
├── Common Joins (INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF)
│
├── Condition-based Joins (EQUI, NON-EQUI)
│
├── Special Joins (NATURAL, SEMI, ANTI)
│
└── Advanced (LATERAL)`
    },
    tags: ['join taxonomy', 'employees', 'departments', 'setup']
  },
  {
    id: 'joins-inner',
    slideNumber: 32,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '1. INNER JOIN ⭐',
    slideSubtitle: 'Matching Records Only — Intersection of Both Tables',
    content: {
      paragraphs: [
        'Theory: Returns only the rows that have a matching value in both tables. If a record in one table has no corresponding record in the other, it\'s excluded from the result — only the overlap comes back.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'Syntax & Example',
          code: `-- Syntax:
SELECT columns
FROM table1
INNER JOIN table2
ON table1.column = table2.column;

-- Example:
SELECT e.EmpID, e.Name, d.DeptName
FROM Employees e
INNER JOIN Departments d
ON e.DeptID = d.DeptID;`
        }
      ],
      tables: [
        {
          title: 'Output',
          headers: ['EmpID', 'Name', 'DeptName'],
          rows: [
            ['1', 'Alice', 'HR'],
            ['2', 'Bob', 'IT'],
            ['3', 'Charlie', 'Sales']
          ],
          caption: 'David is excluded (DeptID 50 doesn\'t exist in Departments), and Finance is excluded too (no employee belongs to DeptID 40).'
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: 'INNER = matching records only.'
        }
      ]
    },
    tags: ['inner join', 'match', 'overlap']
  },
  {
    id: 'joins-left',
    slideNumber: 33,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '2. LEFT JOIN ⭐ (LEFT OUTER JOIN)',
    slideSubtitle: 'Preserve All Left Rows, NULL Fill for Unmatched Right Rows',
    content: {
      paragraphs: [
        'Also called LEFT OUTER JOIN.',
        'Theory: Returns all records from the left table, plus the matching records from the right. Where there\'s no match on the right, those columns come back as NULL. Nothing from the left table is ever dropped.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'Syntax & Example',
          code: `-- Syntax:
SELECT columns
FROM table1
LEFT JOIN table2
ON table1.column = table2.column;

-- Example:
SELECT e.EmpID, e.Name, d.DeptName
FROM Employees e
LEFT JOIN Departments d
ON e.DeptID = d.DeptID;`
        }
      ],
      tables: [
        {
          title: 'Output',
          headers: ['EmpID', 'Name', 'DeptName'],
          rows: [
            ['1', 'Alice', 'HR'],
            ['2', 'Bob', 'IT'],
            ['3', 'Charlie', 'Sales'],
            ['4', 'David', 'NULL']
          ],
          caption: 'David is included because Employees is the LEFT table — even though he has no matching department.'
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: 'LEFT = everything from the left.'
        }
      ]
    },
    tags: ['left join', 'left outer join', 'null']
  },
  {
    id: 'joins-right',
    slideNumber: 34,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '3. RIGHT JOIN (RIGHT OUTER JOIN)',
    slideSubtitle: 'Preserve All Right Rows, NULL Fill for Unmatched Left Rows',
    content: {
      paragraphs: [
        'Also called RIGHT OUTER JOIN.',
        'Theory: The mirror image of LEFT JOIN — returns all records from the right table, plus matching records from the left. Where there\'s no match on the left, those columns come back NULL.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'Syntax & Example',
          code: `-- Syntax:
SELECT columns
FROM table1
RIGHT JOIN table2
ON table1.column = table2.column;

-- Example:
SELECT e.EmpID, e.Name, d.DeptName
FROM Employees e
RIGHT JOIN Departments d
ON e.DeptID = d.DeptID;`
        }
      ],
      tables: [
        {
          title: 'Output',
          headers: ['EmpID', 'Name', 'DeptName'],
          rows: [
            ['1', 'Alice', 'HR'],
            ['2', 'Bob', 'IT'],
            ['3', 'Charlie', 'Sales'],
            ['NULL', 'NULL', 'Finance']
          ],
          caption: 'Finance is included because Departments is the RIGHT table.'
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: 'RIGHT = everything from the right.'
        },
        {
          type: 'tip',
          label: '💡 Practice Note',
          content: 'In practice, many developers avoid RIGHT JOIN entirely and just swap the table order to use LEFT JOIN instead — it tends to read more naturally.'
        }
      ]
    },
    tags: ['right join', 'right outer join', 'mirror']
  },
  {
    id: 'joins-full-outer',
    slideNumber: 35,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '4. FULL OUTER JOIN',
    slideSubtitle: 'Union of Both Tables & MySQL Workaround with UNION',
    content: {
      paragraphs: [
        'Theory: Returns everything from both tables. Matching rows are combined into a single row; unmatched rows from either side still appear, with NULL filling the columns that have no counterpart.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'Syntax & Example',
          code: `-- Syntax:
SELECT columns
FROM table1
FULL OUTER JOIN table2
ON table1.column = table2.column;

-- Example:
SELECT e.EmpID, e.Name, d.DeptName
FROM Employees e
FULL OUTER JOIN Departments d
ON e.DeptID = d.DeptID;`
        }
      ],
      tables: [
        {
          title: 'Output',
          headers: ['EmpID', 'Name', 'DeptName'],
          rows: [
            ['1', 'Alice', 'HR'],
            ['2', 'Bob', 'IT'],
            ['3', 'Charlie', 'Sales'],
            ['4', 'David', 'NULL'],
            ['NULL', 'NULL', 'Finance']
          ]
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: 'FULL = everything from both tables.'
        },
        {
          type: 'warning',
          label: '⚠️ MySQL Note & Workaround',
          content: 'MySQL doesn\'t support FULL OUTER JOIN directly. Emulate it by combining a LEFT and RIGHT JOIN with UNION:\n\nSELECT e.EmpID, e.Name, d.DeptName\nFROM Employees e\nLEFT JOIN Departments d ON e.DeptID = d.DeptID\nUNION\nSELECT e.EmpID, e.Name, d.DeptName\nFROM Employees e\nRIGHT JOIN Departments d ON e.DeptID = d.DeptID;'
        }
      ]
    },
    tags: ['full outer join', 'mysql', 'union']
  },
  {
    id: 'joins-cross-self',
    slideNumber: 36,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '5. CROSS JOIN & 6. SELF JOIN',
    slideSubtitle: 'Cartesian Product (m × n) & Hierarchical Self-Referencing',
    content: {
      paragraphs: [
        '5. CROSS JOIN',
        'Theory: Produces the Cartesian product of the two tables — every row in Table A paired with every row in Table B. If Table A has m rows and Table B has n rows, the result has m × n rows.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: '5. CROSS JOIN Example (4 × 4 = 16 rows)',
          code: `SELECT e.Name, d.DeptName
FROM Employees e
CROSS JOIN Departments d;`
        },
        {
          language: 'sql',
          title: '6. SELF JOIN Example (Employee & Manager)',
          code: `SELECT 
    e.Name AS Employee,
    m.Name AS Manager
FROM Employees e
LEFT JOIN Employees m
ON e.ManagerID = m.EmpID;`
        }
      ],
      tables: [
        {
          title: 'SELF JOIN Output',
          headers: ['Employee', 'Manager'],
          rows: [
            ['Alice', 'NULL'],
            ['Bob', 'Alice'],
            ['Charlie', 'Alice'],
            ['David', 'Bob']
          ],
          caption: 'e and m are the same physical table (Employees) — just aliased once as "employee" and once as "manager."'
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: '• CROSS = every possible combination.\n• SELF = a table joins itself.'
        },
        {
          type: 'warning',
          label: '⚠️ Warning on CROSS JOIN',
          content: 'Be careful with large tables — the result size grows multiplicatively and can get huge fast.'
        }
      ]
    },
    tags: ['cross join', 'self join', 'cartesian', 'manager']
  },
  {
    id: 'joins-equi-non-equi',
    slideNumber: 37,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '7. EQUI JOIN & 8. NON-EQUI JOIN',
    slideSubtitle: 'Condition-Based Joins: Equality vs Range/Comparison Operators',
    content: {
      paragraphs: [
        '7. EQUI JOIN: Any join whose condition uses the equality operator (=) to match column values between tables. Defining condition: e.DeptID = d.DeptID.',
        '8. NON-EQUI JOIN: Uses a comparison operator other than = — >, <, >=, <=, <>, or BETWEEN — to relate tables.'
      ],
      tables: [
        {
          title: 'SalaryGrades Sample Table',
          headers: ['Grade', 'MinSalary', 'MaxSalary'],
          rows: [
            ['A', '60000', '100000'],
            ['B', '50000', '59999'],
            ['C', '0', '49999']
          ]
        },
        {
          title: 'NON-EQUI JOIN Output',
          headers: ['Name', 'Salary', 'Grade'],
          rows: [
            ['Alice', '50000', 'B'],
            ['Bob', '60000', 'A'],
            ['Charlie', '45000', 'C']
          ]
        }
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'NON-EQUI JOIN Query',
          code: `SELECT 
    e.Name,
    e.Salary,
    g.Grade
FROM Employees e
JOIN SalaryGrades g
ON e.Salary BETWEEN g.MinSalary AND g.MaxSalary;`
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: '• EQUI = =\n• NON-EQUI = comparison other than ='
        }
      ]
    },
    tags: ['equi join', 'non-equi join', 'between']
  },
  {
    id: 'joins-natural-semi',
    slideNumber: 38,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '9. NATURAL JOIN & 10. SEMI JOIN',
    slideSubtitle: 'Inferred Column Matches & Existence Verification (EXISTS)',
    content: {
      paragraphs: [
        '9. NATURAL JOIN: Automatically joins two tables using every column that shares the same name and compatible type — no explicit ON condition needed.',
        '10. SEMI JOIN: Returns rows from the left table when a matching row exists in the right table — but unlike a normal join, it never pulls in columns from the right table. Typically written with EXISTS.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: '9. NATURAL JOIN Query & 10. SEMI JOIN Query',
          code: `-- 9. NATURAL JOIN:
SELECT * FROM Employees NATURAL JOIN Departments;

-- 10. SEMI JOIN:
SELECT e.*
FROM Employees e
WHERE EXISTS (
    SELECT 1
    FROM Departments d
    WHERE d.DeptID = e.DeptID
);`
        }
      ],
      tables: [
        {
          title: 'SEMI JOIN Output (Departments columns excluded)',
          headers: ['EmpID', 'Name', 'DeptID', 'Salary'],
          rows: [
            ['1', 'Alice', '10', '50000'],
            ['2', 'Bob', '20', '60000'],
            ['3', 'Charlie', '30', '45000']
          ],
          caption: 'David isn\'t returned, since his department doesn\'t exist. Only Employees columns are returned.'
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ NATURAL JOIN Production Warning',
          content: 'Generally avoided in production. If a new column with a matching name gets added to either table later, the join condition — and the query\'s behavior — can silently change. Prefer being explicit with ON.'
        },
        {
          type: 'remember',
          label: '🧠 Remember',
          content: '• NATURAL = automatically matches same-named columns.\n• SEMI = left rows where a match EXISTS.'
        }
      ]
    },
    tags: ['natural join', 'semi join', 'exists']
  },
  {
    id: 'joins-anti-lateral',
    slideNumber: 39,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '11. ANTI JOIN & 12. LATERAL JOIN 🚀',
    slideSubtitle: 'Missing Match Filter (NOT EXISTS) & Row-Dependent Subqueries',
    content: {
      paragraphs: [
        '11. ANTI JOIN: Mirror image of semi join — returns rows from the left table where NO matching row exists in the right table. Written with NOT EXISTS, useful for finding orphaned or missing records.',
        '12. LATERAL JOIN: Lets a subquery on the right side reference columns from the row on the left side, evaluated row by row. Pulls top or row-dependent related records.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: '11. ANTI JOIN Query & 12. LATERAL JOIN (PostgreSQL)',
          code: `-- 11. ANTI JOIN:
SELECT e.*
FROM Employees e
WHERE NOT EXISTS (
    SELECT 1 FROM Departments d WHERE d.DeptID = e.DeptID
);

-- 12. LATERAL JOIN (Find each employee's most recent salary):
SELECT e.Name, s.Salary
FROM Employees e
CROSS JOIN LATERAL (
    SELECT Salary FROM EmployeeSalaryHistory s
    WHERE s.EmpID = e.EmpID
    ORDER BY s.Date DESC LIMIT 1
) s;`
        }
      ],
      tables: [
        {
          title: 'ANTI JOIN Output',
          headers: ['EmpID', 'Name', 'DeptID', 'Salary'],
          rows: [
            ['4', 'David', '50', '40000']
          ],
          caption: 'David\'s DeptID = 50 has no matching row in Departments, so he\'s the only one returned.'
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Remember',
          content: '• ANTI = rows where a match does NOT EXIST.\n• LATERAL = the right-side subquery can use left-side columns.'
        },
        {
          type: 'tip',
          label: '⚠️ Interview Context',
          content: 'LATERAL JOIN is an advanced/interview-bonus topic — useful to know exists, but not something to prioritize as a beginner.'
        }
      ]
    },
    tags: ['anti join', 'lateral join', 'not exists']
  },
  {
    id: 'joins-cheat-sheet-part-1',
    slideNumber: 40,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: 'Complete JOIN Cheat Sheet (Part 1: Basic & Condition Joins)',
    slideSubtitle: 'Master Reference: Returns, Key Idea & One-Line Summary',
    content: {
      tables: [
        {
          headers: ['JOIN', 'Returns', 'Key Idea', 'In one line'],
          rows: [
            ['INNER', 'Matching rows only', '🤝 Match', 'Returns only matching records from both tables'],
            ['LEFT', 'All left + matching right', '⬅️ Left everything', 'Returns all left-table records and matching right-table records'],
            ['RIGHT', 'All right + matching left', '➡️ Right everything', 'Returns all right-table records and matching left-table records'],
            ['FULL OUTER', 'Everything from both', '🌎 All', 'Returns all records from both tables, matching or not'],
            ['CROSS', 'Every combination', '✖️ Cartesian', 'Returns every possible combination of rows from both tables'],
            ['SELF', 'Table joined to itself', '🔄 Same table', 'Joins a table with itself'],
            ['EQUI', 'Join using =', '=', 'Joins tables using the = operator'],
            ['NON-EQUI', 'Join using comparisons', '>, <, BETWEEN', 'Joins tables using comparison operators other than =']
          ]
        }
      ]
    },
    tags: ['cheat sheet', 'reference table', 'summary']
  },
  {
    id: 'joins-cheat-sheet-part-2-difference',
    slideNumber: 41,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: 'Complete JOIN Cheat Sheet (Part 2) & The Most Important Difference',
    slideSubtitle: 'Special Joins & Instant Visual Relationship Matrix',
    content: {
      tables: [
        {
          title: 'Special & Advanced Joins Cheat Sheet',
          headers: ['JOIN', 'Returns', 'Key Idea', 'In one line'],
          rows: [
            ['NATURAL', 'Auto-joins same-named columns', 'Automatic', 'Automatically joins tables using common column names'],
            ['SEMI', 'Left rows where match exists', 'EXISTS', 'Returns rows when a matching row exists in another table'],
            ['ANTI', 'Left rows where match doesn\'t exist', 'NOT EXISTS', 'Returns rows when no matching row exists in another table'],
            ['LATERAL', 'Subquery can reference left table', 'Advanced', 'Allows a right-side subquery to reference the left-side row']
          ]
        },
        {
          title: '🔥 The Most Important Difference',
          headers: ['Join', 'Rows returned'],
          rows: [
            ['INNER JOIN', 'Alice, Bob, Charlie'],
            ['LEFT JOIN', 'Alice, Bob, Charlie, David'],
            ['RIGHT JOIN', 'Alice, Bob, Charlie, Finance'],
            ['FULL JOIN', 'Alice, Bob, Charlie, David, Finance'],
            ['CROSS JOIN', 'Every employee × every department (16 rows)']
          ],
          caption: 'That single table is usually enough to reconstruct every basic JOIN type from memory.'
        }
      ],
      diagram: `Employees                 Departments

Alice ─────── HR
Bob   ─────── IT
Charlie ───── Sales
David ─────── ❌
                Finance ───── ❌`
    },
    tags: ['difference', 'most important difference', 'reconstruct']
  },
  {
    id: 'joins-one-line-revision',
    slideNumber: 42,
    sectionId: 'joins',
    sectionTitle: '04 — SQL JOINS COMPLETE GUIDE',
    slideTitle: '🧠 One-Line Revision (All 12 Joins)',
    slideSubtitle: 'Instant Comprehensive Recall Guide',
    content: {
      tables: [
        {
          headers: ['Join', 'Theory in one line'],
          rows: [
            ['INNER JOIN', 'Returns only matching records from both tables.'],
            ['LEFT JOIN', 'Returns all left-table records and matching right-table records.'],
            ['RIGHT JOIN', 'Returns all right-table records and matching left-table records.'],
            ['FULL OUTER JOIN', 'Returns all records from both tables, matching or not.'],
            ['CROSS JOIN', 'Returns every possible combination of rows from both tables.'],
            ['SELF JOIN', 'Joins a table with itself.'],
            ['EQUI JOIN', 'Joins tables using the = operator.'],
            ['NON-EQUI JOIN', 'Joins tables using comparison operators other than =.'],
            ['NATURAL JOIN', 'Automatically joins tables using common column names.'],
            ['SEMI JOIN', 'Returns rows when a matching row exists in another table.'],
            ['ANTI JOIN', 'Returns rows when no matching row exists in another table.'],
            ['LATERAL JOIN', 'Allows a right-side subquery to reference the left-side row.']
          ]
        }
      ]
    },
    tags: ['one-line revision', 'revision', 'summary']
  }
];
