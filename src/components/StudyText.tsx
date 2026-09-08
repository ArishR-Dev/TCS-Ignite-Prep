import React from 'react';

/**
 * Display-only emphasis for existing study wording.
 * Never mutates source strings — only wraps matching terms in spans.
 */

const HIGHLIGHT_TERMS = [
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
  'PRIMARY KEY',
  'FOREIGN KEY',
  'Encapsulation',
  'Inheritance',
  'Polymorphism',
  'Abstraction',
  'Overloading',
  'Overriding',
  'Normalization',
  'TRUNCATE',
  'SAVEPOINT',
  'ROLLBACK',
  'COMMIT',
  'SELECT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'ALTER',
  'DROP',
  'WHERE',
  'HAVING',
  'DISTINCT',
  'UNION',
  'GRANT',
  'REVOKE',
  'DDL',
  'DML',
  'DCL',
  'TCL',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const HIGHLIGHT_SOURCE = `\\b(${HIGHLIGHT_TERMS.map(escapeRegExp).join('|')})\\b|O\\([^)]+\\)`;

export const StudyText: React.FC<{ text: string; className?: string }> = React.memo(({ text, className }) => {
  if (!text) return null;

  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  const highlightRegex = new RegExp(HIGHLIGHT_SOURCE, 'g');
  let match: RegExpExecArray | null;

  while ((match = highlightRegex.exec(text)) !== null) {
    if (match.index > cursor) {
      pieces.push(text.slice(cursor, match.index));
    }
    const token = match[0];
    const isComplexity = token.startsWith('O(');
    pieces.push(
      <span
        key={`${match.index}-${token}`}
        className={
          isComplexity
            ? 'font-mono text-amber-300/90 bg-amber-950/40 px-1 py-px rounded'
            : 'text-cyan-300 font-semibold'
        }
      >
        {token}
      </span>
    );
    cursor = match.index + token.length;
  }

  if (cursor < text.length) {
    pieces.push(text.slice(cursor));
  }

  return <span className={className}>{pieces}</span>;
});

export const StudyMultiline: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const lines = text.split('\n');
  return (
    <div className={className}>
      {lines.map((line, idx) => {
        const bullet = /^[•✓★⚠◆→❌✅]\s*/.exec(line);
        if (bullet) {
          const marker = bullet[0].trim();
          const rest = line.slice(bullet[0].length);
          return (
            <div key={idx} className="flex items-start gap-2 min-w-0">
              <span className="text-cyan-400 font-semibold flex-shrink-0 w-4 text-center leading-relaxed">{marker}</span>
              <span className="min-w-0 break-words leading-relaxed">
                <StudyText text={rest} />
              </span>
            </div>
          );
        }
        if (line === '') {
          return <div key={idx} className="h-2" />;
        }
        return (
          <div key={idx} className="break-words leading-relaxed">
            <StudyText text={line} />
          </div>
        );
      })}
    </div>
  );
};
