import React from 'react';

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

const SQL_KEYWORDS = [
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
];

const PYTHON_KEYWORDS = [
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
];

function tokenizeCode(code: string, language: string): Token[] {
  if (language === 'text' || !code) {
    return [{ type: 'plain', value: code }];
  }

  const tokens: Token[] = [];
  let i = 0;
  const isSql = language === 'sql';
  const keywords = (isSql ? SQL_KEYWORDS : PYTHON_KEYWORDS).slice().sort((a, b) => b.length - a.length);

  const push = (type: TokenKind, value: string) => {
    if (!value) return;
    const last = tokens[tokens.length - 1];
    if (last && last.type === type) {
      last.value += value;
    } else {
      tokens.push({ type, value });
    }
  };

  while (i < code.length) {
    if (isSql && code.startsWith('--', i)) {
      const end = code.indexOf('\n', i);
      const stop = end === -1 ? code.length : end;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    if (!isSql && code[i] === '#') {
      const end = code.indexOf('\n', i);
      const stop = end === -1 ? code.length : end;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    const quote = code[i] === '"' || code[i] === "'" ? code[i] : null;
    if (quote) {
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\' && j + 1 < code.length) j += 2;
        else j += 1;
      }
      push('string', code.slice(i, Math.min(j + 1, code.length)));
      i = Math.min(j + 1, code.length);
      continue;
    }

    let matchedKeyword = false;
    for (const kw of keywords) {
      if (code.length - i < kw.length) continue;
      const slice = code.slice(i, i + kw.length);
      const matches = isSql ? slice.toUpperCase() === kw : slice === kw;
      if (!matches) continue;
      const before = i === 0 ? '' : code[i - 1];
      const after = code[i + kw.length] ?? '';
      const boundaryBefore = i === 0 || /[^A-Za-z0-9_]/.test(before);
      const boundaryAfter = /[^A-Za-z0-9_]/.test(after) || after === '';
      if (boundaryBefore && boundaryAfter) {
        push('keyword', code.slice(i, i + kw.length));
        i += kw.length;
        matchedKeyword = true;
        break;
      }
    }
    if (matchedKeyword) continue;

    if (/[0-9]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[0-9.]/.test(code[j])) j += 1;
      push('number', code.slice(i, j));
      i = j;
      continue;
    }

    push('plain', code[i]);
    i += 1;
  }

  return tokens;
}

export const CodeSyntax: React.FC<{ code: string; language: string }> = React.memo(({ code, language }) => {
  const tokens = React.useMemo(() => tokenizeCode(code, language), [code, language]);
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
