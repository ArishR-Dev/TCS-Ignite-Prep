import React, { useMemo } from 'react';

type TokenKind = 'plain' | 'keyword' | 'string' | 'comment' | 'number';

interface Token {
  type: TokenKind;
  value: string;
}

const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: 'text-sky-200',
  keyword: 'text-cyan-300 font-semibold',
  string: 'text-emerald-300',
  comment: 'text-slate-500 italic',
  number: 'text-amber-300/90',
};

const SQL_PATTERN =
  /(\/\*[\s\S]*?\*\/|--[^\n]*|'(?:''|[^'])*'|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:LEFT OUTER JOIN|RIGHT OUTER JOIN|FULL OUTER JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|SELF JOIN|NATURAL JOIN|GROUP BY|ORDER BY|INSERT INTO|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|TRUNCATE TABLE|PRIMARY KEY|FOREIGN KEY|NOT NULL|SELECT|FROM|WHERE|JOIN|HAVING|DISTINCT|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|VALUES|INTO|SET|AND|OR|NOT|NULL|AS|ON|IN|LIKE|BETWEEN|EXISTS|LIMIT|ASC|DESC|INT|VARCHAR|COMMIT|ROLLBACK|SAVEPOINT|GRANT|REVOKE|TABLE|ADD)\b|\b\d+(?:\.\d+)?\b)/gi;

const PYTHON_PATTERN =
  /(#.*$|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|elif|else|except|finally|for|from|global|if|import|in|is|lambda|not|or|pass|raise|return|try|while|with|yield|self|print)\b|\b\d+(?:\.\d+)?\b)/gm;

const SQL_KEYWORDS = new Set([
  'LEFT OUTER JOIN',
  'RIGHT OUTER JOIN',
  'FULL OUTER JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'SELF JOIN',
  'NATURAL JOIN',
  'GROUP BY',
  'ORDER BY',
  'INSERT INTO',
  'DELETE FROM',
  'CREATE TABLE',
  'ALTER TABLE',
  'DROP TABLE',
  'TRUNCATE TABLE',
  'PRIMARY KEY',
  'FOREIGN KEY',
  'NOT NULL',
  'SELECT',
  'FROM',
  'WHERE',
  'JOIN',
  'HAVING',
  'DISTINCT',
  'UNION',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'ALTER',
  'DROP',
  'TRUNCATE',
  'VALUES',
  'INTO',
  'SET',
  'AND',
  'OR',
  'NOT',
  'NULL',
  'AS',
  'ON',
  'IN',
  'LIKE',
  'BETWEEN',
  'EXISTS',
  'LIMIT',
  'ASC',
  'DESC',
  'INT',
  'VARCHAR',
  'COMMIT',
  'ROLLBACK',
  'SAVEPOINT',
  'GRANT',
  'REVOKE',
  'TABLE',
  'ADD',
]);

const PYTHON_KEYWORDS = new Set([
  'False',
  'None',
  'True',
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'class',
  'continue',
  'def',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield',
  'self',
  'print',
]);

function classify(raw: string, language: string): TokenKind {
  if (language === 'sql') {
    if (raw.startsWith('--') || raw.startsWith('/*')) return 'comment';
    if (raw.startsWith("'") || raw.startsWith('"')) return 'string';
    if (/^\d/.test(raw)) return 'number';
    if (SQL_KEYWORDS.has(raw.toUpperCase())) return 'keyword';
    return 'plain';
  }
  if (raw.startsWith('#')) return 'comment';
  if (raw.startsWith('"""') || raw.startsWith("'''") || raw.startsWith('"') || raw.startsWith("'")) return 'string';
  if (/^\d/.test(raw)) return 'number';
  if (PYTHON_KEYWORDS.has(raw)) return 'keyword';
  return 'plain';
}

function tokenizeCode(code: string, language: string): Token[] {
  if (language === 'text' || !code) {
    return [{ type: 'plain', value: code }];
  }

  const pattern = new RegExp(
    language === 'sql' ? SQL_PATTERN.source : PYTHON_PATTERN.source,
    language === 'sql' ? 'gi' : 'gm'
  );
  const tokens: Token[] = [];
  let last = 0;
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > last) {
      tokens.push({ type: 'plain', value: code.slice(last, match.index) });
    }
    tokens.push({ type: classify(match[0], language), value: match[0] });
    last = match.index + match[0].length;
  }

  if (last < code.length) {
    tokens.push({ type: 'plain', value: code.slice(last) });
  }

  return tokens;
}

export const CodeSyntax: React.FC<{ code: string; language: string }> = React.memo(({ code, language }) => {
  const tokens = useMemo(() => tokenizeCode(code, language), [code, language]);
  return (
    <>
      {tokens.map((token, idx) => (
        <span key={idx} className={TOKEN_CLASS[token.type]}>
          {token.value}
        </span>
      ))}
    </>
  );
});
