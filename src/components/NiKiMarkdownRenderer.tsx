import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';

interface NiKiMarkdownRendererProps {
  content: string;
}

export const NiKiMarkdownRenderer: React.FC<NiKiMarkdownRendererProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Split content by code blocks ```...```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const segments: Array<{ type: 'text' | 'code'; text: string; language?: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        text: content.substring(lastIndex, match.index)
      });
    }
    segments.push({
      type: 'code',
      language: match[1] || 'text',
      text: match[2].trimEnd()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      text: content.substring(lastIndex)
    });
  }

  let codeBlockCounter = 0;

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-200">
      {segments.map((segment, segIdx) => {
        if (segment.type === 'code') {
          const codeIdx = codeBlockCounter++;
          const isCopied = copiedCodeIndex === codeIdx;

          return (
            <div key={segIdx} className="my-2 rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-md">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase">
                  <Terminal className="w-3 h-3" />
                  {segment.language || 'code'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(segment.text, codeIdx)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-sans text-[10px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span className="font-sans text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 font-mono text-[11px] sm:text-xs text-cyan-200 overflow-x-auto selection:bg-cyan-900">
                <code>{segment.text}</code>
              </pre>
            </div>
          );
        }

        // Render formatted text lines
        const lines = segment.text.split('\n');
        return (
          <div key={segIdx} className="space-y-1.5">
            {lines.map((rawLine, lineIdx) => {
              const line = rawLine.trim();
              if (!line) return <div key={lineIdx} className="h-1" />;

              // Level 3 Heading
              if (line.startsWith('### ')) {
                return (
                  <h3 key={lineIdx} className="text-sm sm:text-base font-bold text-white pt-1 flex items-center gap-1.5 text-cyan-300 border-b border-slate-800/80 pb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{formatInlineMarkdown(line.replace(/^###\s+/, ''))}</span>
                  </h3>
                );
              }

              // Level 4 Heading
              if (line.startsWith('#### ')) {
                return (
                  <h4 key={lineIdx} className="text-xs sm:text-sm font-semibold text-cyan-400 pt-1">
                    {formatInlineMarkdown(line.replace(/^####\s+/, ''))}
                  </h4>
                );
              }

              // Interview Tip callout
              if (line.includes('💡') || line.startsWith('Interview Tip:')) {
                return (
                  <div key={lineIdx} className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-2 my-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      {formatInlineMarkdown(line.replace(/^[💡\s]+/, ''))}
                    </div>
                  </div>
                );
              }

              // Warning / Strict rule callout
              if (line.includes('⚠️') || line.startsWith('Important Note:')) {
                return (
                  <div key={lineIdx} className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-200 flex items-start gap-2 my-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      {formatInlineMarkdown(line.replace(/^[⚠️\s]+/, ''))}
                    </div>
                  </div>
                );
              }

              // Blockquote
              if (line.startsWith('> ')) {
                return (
                  <blockquote key={lineIdx} className="pl-3 border-l-2 border-cyan-500/70 text-slate-300 italic my-1">
                    {formatInlineMarkdown(line.replace(/^>\s+/, ''))}
                  </blockquote>
                );
              }

              // Bullet item
              if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
                const bulletContent = line.replace(/^[•\-\*]\s+/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5">
                    <span className="text-cyan-400 font-bold mt-1 text-[10px] leading-none">●</span>
                    <div className="flex-1 text-slate-200 leading-snug">
                      {formatInlineMarkdown(bulletContent)}
                    </div>
                  </div>
                );
              }

              // Numbered item
              const numMatch = line.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5">
                    <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/40 flex-shrink-0 mt-0.5">
                      {numMatch[1]}
                    </span>
                    <div className="flex-1 text-slate-200 leading-snug">
                      {formatInlineMarkdown(numMatch[2])}
                    </div>
                  </div>
                );
              }

              // Standard paragraph
              return (
                <p key={lineIdx} className="text-slate-200 leading-relaxed">
                  {formatInlineMarkdown(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Parses bold (**text**), italics (*text*), and inline code (`code`)
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-bold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[4]) {
      // Inline Code
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[11px] sm:text-xs bg-slate-800/90 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700/60"
        >
          {match[4]}
        </code>
      );
    } else if (match[6]) {
      // Italics
      parts.push(
        <em key={match.index} className="italic text-slate-300">
          {match[6]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
