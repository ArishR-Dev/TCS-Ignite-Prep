import React, { useState, useEffect } from 'react';
import { Slide } from '../types';
import { exportToPPTX } from '../utils/pptxExport';
import { Download, Printer, CheckCircle, FileText, AlertCircle, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  slides: Slide[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ slides, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparing PowerPoint...');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadPPTX = async () => {
    try {
      setIsExporting(true);
      setDownloadSuccess(false);
      setProgress(0);
      setStatusMessage('Preparing PowerPoint...');

      await exportToPPTX(slides, ({ percent, message }) => {
        setProgress(percent);
        setStatusMessage(message);
      });

      setDownloadSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('PPTX Export failed:', err);
      alert('Could not generate PPTX directly in browser. Please try Print / Save to PDF instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0e1424] border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">Export Presentation Handbook</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Prepared for Subashini • TCS B.Sc Ignite</p>
          </div>
        </div>

        <div className="space-y-4 my-6">
          {/* PowerPoint (.pptx) Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Primary Format
                </span>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Microsoft PowerPoint Presentation (.pptx)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Generates an authentic {slides.length}-slide pixel-perfect 16:9 widescreen PowerPoint (.pptx) file with all dark themes, code blocks, tables, and typography intact.
                </p>
              </div>
            </div>

            {isExporting ? (
              <div className="space-y-3 mt-2 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="font-semibold flex items-center gap-2 truncate pr-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block flex-shrink-0" />
                    <span className="truncate">{statusMessage}</span>
                  </span>
                  <span className="font-bold font-mono text-cyan-400 flex-shrink-0">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Capturing pixel-perfect slides at 1920×1080. Please keep this tab open...
                </p>
              </div>
            ) : downloadSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 font-medium flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>PowerPoint ready</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Downloaded <span className="text-cyan-300 font-mono">TCS_Ignite_Interview_Handbook.pptx</span> ({slides.length} slides). Check your downloads folder!
                </p>
              </div>
            ) : (
              <button
                onClick={handleDownloadPPTX}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Complete PowerPoint (.pptx)
              </button>
            )}
          </div>

          {/* Print / Save as PDF Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-purple-400" />
                Print / Save Current Slide as PDF
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Use browser print to save or print the active slide or pages.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            Tip: You can also use this web application on a phone or laptop in presentation mode by clicking <kbd className="font-mono text-cyan-300">Fullscreen</kbd> or pressing <kbd className="font-mono text-cyan-300">F</kbd>.
          </span>
        </div>
      </div>
    </div>
  );
};
