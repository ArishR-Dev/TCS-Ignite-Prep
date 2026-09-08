import React, { useState } from 'react';
import {
  MANDATORY_CHECKLIST_ITEMS,
  MANDATORY_IMPORTANT_NOTES
} from '../data/mandatoryDocumentsSlide';
import {
  Check,
  Lock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface MandatoryDocumentsChecklistProps {
  onComplete: () => void;
  onAttemptIncomplete?: () => void;
  isMobile?: boolean;
}

export const MandatoryDocumentsChecklist: React.FC<MandatoryDocumentsChecklistProps> = ({
  onComplete,
  onAttemptIncomplete,
  isMobile = false
}) => {
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const totalItems = MANDATORY_CHECKLIST_ITEMS.length;
  const isAllChecked = checkedIndices.length === totalItems;
  const progressPercent = Math.round((checkedIndices.length / totalItems) * 100);

  const handleToggle = (index: number) => {
    setShowWarning(false);
    setCheckedIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleContinue = () => {
    if (!isAllChecked) {
      setShowWarning(true);
      onAttemptIncomplete?.();
      // Auto-dismiss warning message after 3 seconds
      setTimeout(() => setShowWarning(false), 3200);
      return;
    }

    try {
      localStorage.setItem('tcs_documents_slide_completed', 'true');
    } catch (e) {
      console.warn('Unable to write to localStorage', e);
    }
    onComplete();
  };

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-6">
      {/* Header Info & Progress Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isAllChecked ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60'
            } transition-all duration-300`}>
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                <span>Mandatory Physical Verification</span>
                <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                  {checkedIndices.length}/{totalItems} Checked
                </span>
              </span>
              <p className="text-[10px] sm:text-xs text-slate-400">
                All 7 items must be physically verified before the interview presentation unlocks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isAllChecked ? (
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/50 animate-in fade-in">
                <ShieldCheck className="w-3.5 h-3.5" />
                All 7 Ready
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400">
                {totalItems - checkedIndices.length} remaining
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1.5 sm:h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isAllChecked
                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 shadow-sm shadow-cyan-400/50'
                : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 7 Interactive Checkboxes List */}
      <div className="space-y-2 sm:space-y-2.5">
        {MANDATORY_CHECKLIST_ITEMS.map((itemText, idx) => {
          const isChecked = checkedIndices.includes(idx);
          return (
            <div
              key={idx}
              id={`mandatory-checklist-item-${idx + 1}`}
              onClick={() => handleToggle(idx)}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start sm:items-center gap-3 select-none group active:scale-[0.99] ${
                isChecked
                  ? 'border-cyan-500/70 bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-slate-900/90 shadow-md shadow-cyan-950/40 text-white'
                  : 'border-slate-800/90 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 text-slate-300'
              }`}
            >
              {/* Custom Interactive Checkbox */}
              <button
                type="button"
                aria-checked={isChecked}
                role="checkbox"
                aria-label={itemText}
                onClick={e => {
                  e.stopPropagation();
                  handleToggle(idx);
                }}
                className={`w-6 h-6 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-0.5 sm:mt-0 ${
                  isChecked
                    ? 'bg-gradient-to-br from-cyan-400 to-teal-400 text-slate-950 border border-cyan-300 shadow-md shadow-cyan-500/40 scale-105'
                    : 'border-2 border-slate-600 bg-slate-950/80 group-hover:border-cyan-400/80 group-hover:bg-slate-900'
                }`}
              >
                {isChecked && (
                  <Check className="w-4 h-4 stroke-[3] animate-in zoom-in-50 duration-150" />
                )}
              </button>

              {/* Item Text Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                  isChecked ? 'text-cyan-50 font-medium' : 'text-slate-300 group-hover:text-slate-200'
                }`}>
                  {itemText}
                </p>
              </div>

              {/* Item Status Indicator Pill */}
              <div className="hidden sm:flex items-center flex-shrink-0">
                {isChecked ? (
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    VERIFIED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/60">
                    #{idx + 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Important Notes */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Important Facility Regulations</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {MANDATORY_IMPORTANT_NOTES.map((noteText, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/15 text-amber-200 text-xs sm:text-xs leading-relaxed flex items-start gap-2.5 backdrop-blur-sm"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-slate-200 text-xs leading-relaxed">
                {noteText}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Message & Action Area */}
      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80">
        {/* Subtle Validation Toast Message */}
        <div className="min-h-[24px] flex items-center">
          {showWarning && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>Please check all items before continuing.</span>
            </div>
          )}
          {!showWarning && !isAllChecked && (
            <p className="text-[11px] sm:text-xs text-slate-500 font-mono">
              Tick all 7 checkboxes to unlock the complete TCS Ignite handbook.
            </p>
          )}
          {!showWarning && isAllChecked && (
            <p className="text-[11px] sm:text-xs text-emerald-400 font-mono font-medium flex items-center gap-1 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>All 7 documents verified. Ready to proceed!</span>
            </p>
          )}
        </div>

        {/* Next Slide / Continue Action Button */}
        <button
          id="documents-checklist-continue-btn"
          type="button"
          onClick={handleContinue}
          className={`px-6 py-3 rounded-xl font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 min-h-[46px] cursor-pointer shadow-lg active:scale-[0.98] ${
            isAllChecked
              ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 text-slate-950 shadow-cyan-500/40 hover:brightness-110 hover:shadow-cyan-400/50'
              : 'bg-slate-800/90 text-slate-400 border border-slate-700/80 hover:border-slate-600 hover:text-slate-300 shadow-slate-950/50'
          }`}
          title={isAllChecked ? 'Continue to Slide 3' : 'Please check all 7 items to continue'}
        >
          {isAllChecked ? (
            <>
              <span>Everything Ready →</span>
              <Sparkles className="w-4 h-4 text-slate-950" />
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Continue ({checkedIndices.length}/7 Verified)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
