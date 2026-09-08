import { Slide } from '../types';

export const slidesCommands: Slide[] = [
  {
    id: 'commands-divider',
    slideNumber: 43,
    sectionId: 'commands',
    sectionTitle: '05 — SQL COMMAND TYPES',
    slideTitle: '05 — SQL COMMAND TYPES — DDL, DML, DCL & TCL 🗄️',
    slideSubtitle: 'Four Core Categories Based on What Database Objects They Act On',
    isDivider: true,
    content: {
      paragraphs: [
        'SQL commands are commonly grouped into four categories, based on what they act on.',
        'What\'s covered: DDL (structure) · DML (data) · DCL (permissions) · TCL (transactions)'
      ],
      diagram: `                         SQL Commands
                              │
        ┌───────────┬─────────┴─────────┬───────────┐
        ↓           ↓                   ↓           ↓
       DDL         DML                 DCL         TCL
    Structure      Data             Permissions  Transactions`
    },
    tags: ['commands', 'ddl', 'dml', 'dcl', 'tcl']
  },
  {
    id: 'commands-ddl',
    slideNumber: 44,
    sectionId: 'commands',
    sectionTitle: '05 — SQL COMMAND TYPES',
    slideTitle: '1. DDL — Data Definition Language 🏗️',
    slideSubtitle: 'Table Structure Modification: CREATE, ALTER, DROP, TRUNCATE',
    content: {
      paragraphs: [
        'What it does: DDL defines and modifies the structure of database objects, such as tables — not the data inside them.'
      ],
      tables: [
        {
          title: 'Main DDL Commands',
          headers: ['Command', 'Purpose'],
          rows: [
            ['CREATE', 'Creates a database object'],
            ['ALTER', 'Modifies the structure'],
            ['DROP', 'Deletes an object completely'],
            ['TRUNCATE', 'Removes all rows from a table']
          ]
        }
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'CREATE & ALTER & DROP & TRUNCATE',
          code: `-- CREATE: Creates a new table
CREATE TABLE Employees (
    EmpID INT,
    Name VARCHAR(50),
    Salary INT
);

-- ALTER: Changes the structure of an existing table
ALTER TABLE Employees
ADD Email VARCHAR(100);

-- DROP: Deletes the table itself — structure and data both go
DROP TABLE Employees;

-- TRUNCATE: Removes all records, but keeps table structure intact
TRUNCATE TABLE Employees;`
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: 'After DROP vs After TRUNCATE',
          content: 'After DROP:\nTable: ❌ | Data: ❌ | Structure: ❌\n\nAfter TRUNCATE:\nTable: ✅ | Structure: ✅ | Data: ❌\n\n🧠 Remember: DDL = defines the structure.'
        }
      ]
    },
    tags: ['ddl', 'create', 'alter', 'drop', 'truncate']
  },
  {
    id: 'commands-dml',
    slideNumber: 45,
    sectionId: 'commands',
    sectionTitle: '05 — SQL COMMAND TYPES',
    slideTitle: '2. DML — Data Manipulation Language 📝',
    slideSubtitle: 'Data Rows Manipulation: INSERT, UPDATE, DELETE',
    content: {
      paragraphs: [
        'What it does: DML manipulates the data stored inside tables — the structure stays untouched.'
      ],
      tables: [
        {
          title: 'Main DML Commands',
          headers: ['Command', 'Purpose'],
          rows: [
            ['INSERT', 'Adds data'],
            ['UPDATE', 'Modifies existing data'],
            ['DELETE', 'Removes data']
          ]
        }
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'DML Queries',
          code: `-- INSERT: Adds new records
INSERT INTO Employees
VALUES (1, 'Alice', 50000);

-- UPDATE: Modifies existing records
UPDATE Employees
SET Salary = 55000
WHERE EmpID = 1;

-- DELETE: Removes records
DELETE FROM Employees
WHERE EmpID = 1;`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Crucial UPDATE Warning',
          content: 'Always be careful with UPDATE without a WHERE clause — it silently updates every row:\n\nUPDATE Employees\nSET Salary = 55000;\n\nThis raises every employee\'s salary to 55000, not just one.'
        },
        {
          type: 'remember',
          label: '🧠 Remember',
          content: 'DML = manipulates data.'
        }
      ]
    },
    tags: ['dml', 'insert', 'update', 'delete']
  },
  {
    id: 'commands-dcl-tcl',
    slideNumber: 46,
    sectionId: 'commands',
    sectionTitle: '05 — SQL COMMAND TYPES',
    slideTitle: '3. DCL 🔐 & 4. TCL 🔄',
    slideSubtitle: 'Data Control (Permissions) & Transaction Management',
    content: {
      paragraphs: [
        '3. DCL — Data Control Language: Controls access and permissions to database objects.',
        '4. TCL — Transaction Control Language: Manages transactions — a group of SQL operations treated as a single unit.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: '3. DCL: GRANT & REVOKE',
          code: `-- GRANT: Gives privileges to a user
GRANT SELECT
ON Employees
TO user1;

-- REVOKE: Removes previously granted permissions
REVOKE SELECT
ON Employees
FROM user1;`
        },
        {
          language: 'sql',
          title: '4. TCL: COMMIT, ROLLBACK & SAVEPOINT',
          code: `-- COMMIT: Permanently saves changes
INSERT INTO Employees VALUES (5, 'David', 40000);
COMMIT;

-- ROLLBACK: Undoes uncommitted changes
DELETE FROM Employees WHERE EmpID = 5;
ROLLBACK;

-- SAVEPOINT: Creates a checkpoint inside a transaction
INSERT INTO Employees VALUES (5, 'David', 40000);
SAVEPOINT point1;
INSERT INTO Employees VALUES (6, 'John', 45000);
ROLLBACK TO point1;  -- John undone, David kept!`
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Key TCL & DCL Mantras',
          content: '• DCL controls access: GRANT (give ✅), REVOKE (take away ❌)\n• COMMIT = save permanently\n• ROLLBACK = undo\n• SAVEPOINT = create a checkpoint'
        }
      ]
    },
    tags: ['dcl', 'tcl', 'grant', 'revoke', 'commit', 'rollback', 'savepoint']
  },
  {
    id: 'commands-comparison-memory-trick',
    slideNumber: 47,
    sectionId: 'commands',
    sectionTitle: '05 — SQL COMMAND TYPES',
    slideTitle: '🔥 DDL vs DML vs DCL vs TCL & Memory Trick',
    slideSubtitle: 'Comprehensive Comparison Table & Super Easy Memory Trick',
    content: {
      tables: [
        {
          headers: ['Type', 'Full Form', 'Main Purpose', 'Commands'],
          rows: [
            ['DDL', 'Data Definition Language', 'Structure', 'CREATE, ALTER, DROP, TRUNCATE'],
            ['DML', 'Data Manipulation Language', 'Data', 'INSERT, UPDATE, DELETE'],
            ['DCL', 'Data Control Language', 'Permissions', 'GRANT, REVOKE'],
            ['TCL', 'Transaction Control Language', 'Transactions', 'COMMIT, ROLLBACK, SAVEPOINT']
          ]
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Super Easy Memory Trick',
          content: '• DDL → Structure 🏗️ — define the database structure: CREATE, ALTER, DROP, TRUNCATE\n• DML → Data 📝 — manipulate data: INSERT, UPDATE, DELETE\n• DCL → Control 🔐 — control access: GRANT, REVOKE\n• TCL → Transaction 🔄 — control transactions: COMMIT, ROLLBACK, SAVEPOINT'
        }
      ]
    },
    tags: ['comparison', 'memory trick', 'ddl vs dml']
  }
];
