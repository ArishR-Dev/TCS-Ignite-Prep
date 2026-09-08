import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../types';
import { ChatMessage, NiKiService } from '../services/niKiService';
import { NiKiMarkdownRenderer } from './NiKiMarkdownRenderer';
import { EunchaeLogo } from './EunchaeLogo';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  BookOpen,
  Mic,
  Brain,
  MessageSquare,
  ChevronDown,
  Layers,
  HelpCircle,
  CheckCircle2,
  Bot,
  Activity,
  Zap
} from 'lucide-react';

interface NiKiChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: Slide | null;
  onOpenSlide?: (slideNumber: number) => void;
  externalTriggerPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

const QUICK_SUGGESTIONS = [
  'Explain OOP in simple words',
  'What should I prepare for HR?',
  'Explain SQL Joins',
  'Quiz me',
  "Explain this like I'm 5",
  'What documents should I carry?'
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting-msg',
  role: 'assistant',
  text: `Hi! I'm **Eunchae** 👋\nAsk me anything about your interview preparation.`,
  timestamp: Date.now(),
  mode: 'chat'
};

export const NiKiChat: React.FC<NiKiChatProps> = ({
  isOpen,
  onClose,
  currentSlide,
  onOpenSlide,
  externalTriggerPrompt,
  onClearExternalPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('eunchae_chat_history_v1') || localStorage.getItem('niki_chat_history_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [INITIAL_GREETING];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'generating'>('idle');
  const [showDevDebug, setShowDevDebug] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'interview' | 'quiz'>('chat');
  const [includeSlideContext, setIncludeSlideContext] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('eunchae_chat_history_v1', JSON.stringify(messages.slice(-30)));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Handle external triggers (like "Ask Eunchae about this ✦" button on a slide)
  useEffect(() => {
    if (externalTriggerPrompt && isOpen) {
      handleSendMessage(externalTriggerPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalTriggerPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now(),
      slideRef: currentSlide?.slideNumber,
      mode: activeMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);
    setSearchStatus('searching');

    try {
      const response = await NiKiService.askNiKi({
        message: query,
        history: [...messages, userMessage],
        currentSlide: includeSlideContext ? currentSlide : null,
        mode: activeMode,
        onSearchStatusChange: setSearchStatus
      });

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: response.reply,
        timestamp: Date.now(),
        slideRef: currentSlide?.slideNumber,
        mode: response.mode,
        debugMeta: response.meta ? {
          ...response.meta,
          source: response.source
        } : undefined
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `I couldn't complete that request right now. Please try asking again or select one of the suggested topics!`,
        timestamp: Date.now(),
        mode: activeMode
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setSearchStatus('idle');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation history with Eunchae?')) {
      setMessages([INITIAL_GREETING]);
      localStorage.removeItem('eunchae_chat_history_v1');
      localStorage.removeItem('niki_chat_history_v1');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="eunchae-chat-header"
      className="fixed z-50 inset-0 sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 sm:w-[460px] sm:max-w-[calc(100vw-32px)] sm:h-[680px] sm:max-h-[calc(100vh-48px)] flex flex-col bg-slate-950/95 border border-cyan-500/40 sm:rounded-2xl shadow-2xl shadow-cyan-950/60 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
    >
      {/* Radiant ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none blur-2xl" />

      {/* Header */}
      <div className="relative z-10 px-4 py-3 border-b border-slate-800/80 bg-slate-900/95 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          {/* Eunchae Logo Avatar with Cloudinary URL */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-500 shadow-md shadow-cyan-950/80 ring-1 ring-cyan-400/40">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/rmhgrc2t/image/upload/f_auto,q_auto/f28cc299-7070-41fb-8a03-b708197c4e37"
                  alt="Eunchae AI Assistant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                />
              </div>
            </div>
            {/* Live active companion indicator */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-sm flex items-center justify-center"
              title="Online & Ready"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
            </span>
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2">
              <h2 id="eunchae-chat-header" className="text-sm sm:text-base font-bold text-white font-['Plus_Jakarta_Sans'] leading-tight flex items-center gap-1.5 truncate">
                Eunchae <span className="text-cyan-400 font-normal">✦</span>
              </h2>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 leading-none">
                AI Coach
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-sans leading-tight mt-0.5 truncate">
              Your Interview Prep Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowDevDebug(prev => !prev)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showDevDebug
                ? 'text-cyan-300 bg-cyan-950 border border-cyan-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Dev Performance Stats"
            aria-label="Toggle Dev Performance Stats"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear conversation history"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Eunchae (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="relative z-10 px-3 py-2 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between gap-1 flex-shrink-0">
        <div className="grid grid-cols-3 gap-1 w-full text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveMode('chat')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('interview');
              handleSendMessage('Start an interview question for me!');
            }}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'interview'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
            title="Practice realistic technical & HR interview questions"
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span>Interview Me</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('quiz');
              handleSendMessage('Quiz me');
            }}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'quiz'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
            title="Multiple choice quiz challenge from the website material"
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>Quiz Me</span>
          </button>
        </div>
      </div>

      {/* Active Slide Context Banner */}
      {currentSlide && (
        <div className="px-3 py-1.5 bg-slate-900/40 border-b border-slate-800/50 flex items-center justify-between text-[11px] text-slate-300 flex-shrink-0">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <span className="text-slate-400">Context:</span>
            <span className="text-cyan-300 font-semibold truncate font-mono">
              #{currentSlide.slideNumber} {currentSlide.slideTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIncludeSlideContext(prev => !prev)}
            className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer flex-shrink-0 ${
              includeSlideContext
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800/60'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title={includeSlideContext ? 'Slide context attached to queries' : 'Slide context ignored'}
          >
            {includeSlideContext ? 'Active' : 'Muted'}
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 relative z-10 custom-scrollbar">
        {messages.map(message => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-tl-sm shadow-md'
                }`}
              >
                {!isUser ? (
                  <NiKiMarkdownRenderer content={message.text} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                )}
              </div>

              {/* Timestamp and metadata */}
              <div className="flex flex-col items-start gap-1 px-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!isUser && (
                    <span className="text-cyan-500/80 font-sans font-medium">• Eunchae ✦</span>
                  )}
                </div>

                {/* Optional Development / Performance Diagnostics */}
                {showDevDebug && !isUser && message.debugMeta && (
                  <div className="text-[10px] font-mono text-cyan-300/90 bg-slate-900/90 border border-cyan-800/50 rounded-lg px-2.5 py-1.5 space-y-0.5 shadow-sm max-w-full">
                    <div className="text-cyan-400 font-semibold text-[10px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Eunchae Performance Metrics</span>
                    </div>
                    <div>Search time: <span className="text-white">{message.debugMeta.searchTimeMs} ms</span></div>
                    <div>Relevant chunks: <span className="text-white">{message.debugMeta.hitsCount}</span></div>
                    {message.debugMeta.currentSlide && (
                      <div className="truncate">Current slide: <span className="text-white">{message.debugMeta.currentSlide}</span></div>
                    )}
                    <div>AI response time: <span className="text-white">{message.debugMeta.aiResponseTimeMs ?? 0} ms</span></div>
                    <div>Total latency: <span className="text-white">{message.debugMeta.totalTimeMs} ms</span> {message.debugMeta.cacheHit && <span className="text-emerald-400 font-bold ml-1">(Cache Hit)</span>}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Dual-Stage Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 text-xs text-cyan-400 animate-in fade-in duration-150">
            <EunchaeLogo size={28} showSparkle={false} glow={true} className="mt-0.5" />
            <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-900/90 border border-cyan-500/30 flex items-center gap-2.5 shadow-lg shadow-cyan-950/40">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-slate-200 text-xs font-sans font-medium">
                {searchStatus === 'searching'
                  ? 'Searching your preparation material... 🔎'
                  : 'Eunchae is thinking... ✦'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-3 sm:px-4 py-2 bg-slate-900/40 border-t border-slate-800/40 flex-shrink-0">
          <div className="text-[10px] uppercase font-mono text-slate-500 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 border border-slate-700/70 hover:border-cyan-500/40 transition-all cursor-pointer text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-2.5 sm:p-3 bg-slate-900/90 border-t border-slate-800/80 relative z-10 flex-shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeMode === 'interview'
                  ? 'Type your interview response here...'
                  : activeMode === 'quiz'
                  ? 'Type A, B, C, D or your quiz answer...'
                  : currentSlide
                  ? `Ask about "${currentSlide.slideTitle}" or anything...`
                  : 'Ask Eunchae anything about the interview material...'
              }
              rows={2}
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none resize-none transition-colors max-h-24 custom-scrollbar"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="h-[46px] w-[46px] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-cyan-950 flex-shrink-0 active:scale-95"
            title="Send Message"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>Grounded strictly on website preparation material</span>
          <span className="hidden sm:inline font-mono">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

// Named aliases for clean modern imports
export const EunchaeChat = NiKiChat;
export type { NiKiChatProps as EunchaeChatProps };
