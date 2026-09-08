import React from 'react';
import { CalloutItem } from '../types';
import { StudyMultiline, StudyText } from './StudyText';
import {
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Star,
} from 'lucide-react';
import { ResponsiveSlideScale } from '../hooks/useResponsiveSlideScale';

export interface StudySkin {
  typography: ResponsiveSlideScale['typography'];
  spacing: ResponsiveSlideScale['spacing'];
}

const PREFIX_RULES: Array<{
  test: RegExp;
  kind: 'definition' | 'remember' | 'example';
  label: string;
}> = [
  { test: /^Theory:\s*/i, kind: 'definition', label: 'DEFINITION' },
  { test: /^What it does:\s*/i, kind: 'definition', label: 'DEFINITION' },
  { test: /^In simple words:\s*/i, kind: 'remember', label: 'REMEMBER' },
  { test: /^Example:\s*/i, kind: 'example', label: 'EXAMPLE' },
];

function looksLikeSqlLine(text: string): boolean {
  return /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|WITH)\b/i.test(text.trim());
}

function isSubheading(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length > 90) return false;
  if (/^\d+\.\s/.test(trimmed) && (trimmed.endsWith(':') || trimmed.length < 72)) return true;
  if (/^[A-Za-z][^.]{0,40}:\s*$/.test(trimmed)) return true;
  if (/^(Focus areas|Duration|What's covered|What it does):/i.test(trimmed) && trimmed.length < 80) return true;
  return false;
}

const Box: React.FC<{
  tone: 'definition' | 'remember' | 'example' | 'formula';
  label: string;
  children: React.ReactNode;
  padding: string;
  bodyClass: string;
}> = ({ tone, label, children, padding, bodyClass }) => {
  const tones = {
    definition: 'border-cyan-500/35 bg-cyan-950/15',
    remember: 'border-blue-500/35 bg-blue-950/15',
    example: 'border-slate-600/50 bg-slate-900/40',
    formula: 'border-amber-500/30 bg-amber-950/15',
  };
  const labels = {
    definition: 'text-cyan-300 bg-cyan-500/15',
    remember: 'text-blue-300 bg-blue-500/15',
    example: 'text-slate-300 bg-slate-700/40',
    formula: 'text-amber-300 bg-amber-500/15',
  };

  return (
    <div className={`rounded-xl border ${tones[tone]} ${padding} min-w-0 max-w-full`}>
      <div className={`inline-flex items-center gap-1 mb-1.5 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider uppercase ${labels[tone]}`}>
        {label}
      </div>
      <div className={`${bodyClass} text-slate-200 min-w-0`}>{children}</div>
    </div>
  );
};

export const StudyParagraphs: React.FC<{
  paragraphs: string[];
  skin: StudySkin;
}> = React.memo(({ paragraphs, skin }) => {
  const items: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    const captured = bullets;
    bullets = [];
    items.push(
      <ul key={key} className="space-y-1 min-w-0 pl-0 list-none">
        {captured.map((line, idx) => {
          const rest = line.replace(/^•\s*/, '');
          return (
            <li key={idx} className="flex items-start gap-2 min-w-0">
              <span className="text-cyan-400 flex-shrink-0 leading-relaxed">•</span>
              <span className={`${skin.typography.body} text-slate-200 min-w-0 break-words`}>
                <StudyText text={rest} />
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  paragraphs.forEach((raw, idx) => {
    const text = raw;
    if (text.startsWith('•')) {
      bullets.push(text);
      return;
    }

    flushBullets(`b-${idx}`);

    const prefix = PREFIX_RULES.find(rule => rule.test.test(text));
    if (prefix) {
      const body = text.replace(prefix.test, '');
      items.push(
        <Box
          key={`p-${idx}`}
          tone={prefix.kind}
          label={prefix.label}
          padding={skin.spacing.cardPadding}
          bodyClass={skin.typography.body}
        >
          <StudyText text={body} />
        </Box>
      );
      return;
    }

    if (text.includes('\n')) {
      const [first, ...rest] = text.split('\n');
      if (looksLikeSqlLine(first) || rest.some(line => line.trim().startsWith('→'))) {
        items.push(
          <Box
            key={`p-${idx}`}
            tone="example"
            label="EXAMPLE"
            padding={skin.spacing.cardPadding}
            bodyClass={skin.typography.body}
          >
            <div className="font-mono text-[11px] sm:text-xs text-sky-200 break-words whitespace-pre-wrap">
              {first}
            </div>
            {rest.map((line, lineIdx) => (
              <div key={lineIdx} className="mt-1.5 text-slate-300 break-words">
                <StudyText text={line} />
              </div>
            ))}
          </Box>
        );
        return;
      }
    }

    if (looksLikeSqlLine(text) && text.length < 180) {
      items.push(
        <Box
          key={`p-${idx}`}
          tone="formula"
          label="SQL"
          padding={skin.spacing.cardPadding}
          bodyClass={skin.typography.body}
        >
          <div className="font-mono text-[11px] sm:text-xs text-sky-200 break-words">{text}</div>
        </Box>
      );
      return;
    }

    if (isSubheading(text)) {
      items.push(
        <div
          key={`p-${idx}`}
          className="text-[11px] sm:text-xs font-semibold tracking-wide text-cyan-300/90 pt-1 min-w-0 break-words"
        >
          <StudyText text={text} />
        </div>
      );
      return;
    }

    items.push(
      <p key={`p-${idx}`} className={`${skin.typography.body} text-slate-200 break-words min-w-0`}>
        <StudyText text={text} />
      </p>
    );
  });

  flushBullets('b-end');
  return <div className="space-y-1.5 sm:space-y-2 min-w-0">{items}</div>;
});

export const StudyKeyNotes: React.FC<{ notes: string[]; skin: StudySkin }> = React.memo(({ notes, skin }) => {
  if (!notes.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 mt-1 min-w-0">
      {notes.map((note, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-2 ${skin.spacing.cardPadding} rounded-lg bg-slate-800/40 border border-slate-700/50 min-w-0`}
        >
          <Star className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
          <span className={`${skin.typography.body} text-slate-300 font-medium break-words min-w-0`}>
            <StudyText text={note} />
          </span>
        </div>
      ))}
    </div>
  );
});

function interviewLayout(label: string): 'qa' | 'question' | 'answer' | 'block' {
  if (/interview answer/i.test(label)) return 'answer';
  if (/^question\s+\d+/i.test(label)) return 'question';
  if (/^\d+\.\s/.test(label) || (label.includes('?') && !/resume questions/i.test(label))) return 'qa';
  return 'block';
}

export const StudyCallout: React.FC<{
  callout: CalloutItem;
  skin: StudySkin;
}> = React.memo(({ callout, skin }) => {
  let borderClass = 'border-cyan-500/40 bg-cyan-950/20';
  let badgeClass = 'bg-cyan-500/20 text-cyan-300';
  let Icon = Sparkles;

  if (callout.type === 'interview') {
    borderClass = 'border-emerald-500/40 bg-emerald-950/20';
    badgeClass = 'bg-emerald-500/20 text-emerald-300';
    Icon = HelpCircle;
  } else if (callout.type === 'warning') {
    borderClass = 'border-amber-500/40 bg-amber-950/20';
    badgeClass = 'bg-amber-500/20 text-amber-300';
    Icon = AlertTriangle;
  } else if (callout.type === 'remember') {
    borderClass = 'border-blue-500/40 bg-blue-950/20';
    badgeClass = 'bg-blue-500/20 text-blue-300';
    Icon = Lightbulb;
  } else if (callout.type === 'priority') {
    borderClass = 'border-cyan-500/40 bg-cyan-950/20';
    badgeClass = 'bg-cyan-500/20 text-cyan-300';
    Icon = Star;
  } else if (callout.type === 'tip') {
    borderClass = 'border-cyan-500/40 bg-cyan-950/20';
    badgeClass = 'bg-cyan-500/20 text-cyan-300';
    Icon = Sparkles;
  } else if (callout.type === 'analogy') {
    borderClass = 'border-slate-600/50 bg-slate-900/35';
    badgeClass = 'bg-slate-700/40 text-slate-300';
    Icon = BookOpen;
  } else if (callout.type === 'output') {
    borderClass = 'border-emerald-500/30 bg-emerald-950/15';
    badgeClass = 'bg-emerald-500/15 text-emerald-300';
    Icon = Sparkles;
  }

  const layout = callout.type === 'interview' ? interviewLayout(callout.label) : 'block';

  return (
    <div className={`${skin.spacing.cardPadding} rounded-xl border ${borderClass} shadow-sm backdrop-blur-sm min-w-0 max-w-full`}>
      {layout === 'qa' ? (
        <>
          <div className="flex items-start gap-1.5 mb-1.5 min-w-0">
            <span className={`px-1.5 py-0.5 rounded ${skin.typography.badge} font-semibold uppercase tracking-wider flex items-center gap-1 ${badgeClass} flex-shrink-0`}>
              <HelpCircle className="w-3 h-3 flex-shrink-0" />
              <span>Interview</span>
            </span>
            <span className={`${skin.typography.callout} text-emerald-100 font-semibold break-words min-w-0`}>
              {callout.label}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <MessageCircle className="w-3 h-3" />
            Answer
          </div>
          <div className={`${skin.typography.callout} text-slate-200 min-w-0`}>
            <StudyMultiline text={callout.content} />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5 min-w-0">
            <span className={`px-1.5 py-0.5 rounded ${skin.typography.badge} font-semibold uppercase tracking-wider flex items-center gap-1 ${badgeClass} min-w-0`}>
              <Icon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{callout.label}</span>
            </span>
          </div>
          <div className={`${skin.typography.callout} text-slate-200 min-w-0`}>
            <StudyMultiline text={callout.content} />
          </div>
        </>
      )}
    </div>
  );
});
