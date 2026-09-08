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
  Globe,
  Monitor,
  ExternalLink
} from 'lucide-react';

interface NiKiChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: Slide | null;
  allSlides?: Slide[];
  currentSlideIndex?: number;
  onOpenSlide?: (slideNumber: number) => void;
  externalTriggerPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export interface ConversationStarter {
  id: string;
  icon: string;
  title: string;
  badge: string;
  prompt: string;
  gradient: string;
  border: string;
}

export const CONVERSATION_STARTERS: ConversationStarter[] = [
  {
    id: 'starter-revision',
    icon: '⚡',
    title: 'Last-Minute Revision',
    badge: 'Master Review',
    prompt: 'Give me a complete last-minute TCS Ignite interview revision.',
    gradient: 'from-amber-950/40 to-slate-900/80',
    border: 'border-amber-500/40 hover:border-amber-400'
  },
  {
    id: 'starter-hiring',
    icon: '🌐',
    title: 'Latest Ignite Hiring Info',
    badge: 'Live Research',
    prompt: 'Search the current TCS website and tell me the latest Ignite hiring information.',
    gradient: 'from-blue-950/40 to-slate-900/80',
    border: 'border-blue-500/40 hover:border-blue-400'
  },
  {
    id: 'starter-sql',
    icon: '💾',
    title: 'SQL & DBMS Test',
    badge: 'Practice Drill',
    prompt: 'Test me on SQL and DBMS for the TCS interview.',
    gradient: 'from-emerald-950/40 to-slate-900/80',
    border: 'border-emerald-500/40 hover:border-emerald-400'
  },
  {
    id: 'starter-explain',
    icon: '🐣',
    title: 'Beginner to Interview-Ready',
    badge: 'Slide Context',
    prompt: "Explain this topic like I'm a complete beginner, then give me an interview-ready answer.",
    gradient: 'from-cyan-950/40 to-slate-900/80',
    border: 'border-cyan-500/40 hover:border-cyan-400'
  },
  {
    id: 'starter-hr',
    icon: '💼',
    title: 'Top TCS Ignite HR Questions',
    badge: 'HR Round',
    prompt: 'Give me the most important TCS Ignite HR questions with natural answers.',
    gradient: 'from-purple-950/40 to-slate-900/80',
    border: 'border-purple-500/40 hover:border-purple-400'
  }
];

const getDynamicSuggestions = (slide: Slide | null): string[] => {
  if (!slide) {
    return [
      'Explain OOP in simple words',
      'What should I prepare for HR?',
      'Explain SQL Joins',
      'Quiz me',
      'What documents should I carry?'
    ];
  }

  const base = [
    'Explain this simply',
    'Give me an example',
    'What can interviewer ask from this?',
    'Quiz me on this'
  ];

  if (slide.sectionId === 'oop') {
    base.push('Real-life analogy for this');
  } else if (slide.sectionId === 'joins' || slide.sectionId === 'basic_sql' || slide.sectionId === 'commands') {
    base.push('Show example SQL query');
  } else if (slide.sectionId === 'hr') {
    base.push('What should I answer for this?');
  } else if (slide.sectionId === 'agenda') {
    base.push('What is the reporting procedure?');
  }

  return base.slice(0, 5);
};

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting-msg',
  role: 'assistant',
  text: `Hi! I'm **Eunchae ✦** — your AI companion 👋\n\nYou can ask me **any question, doubt, coding query, or interview concept** — whether it's on your current slide, elsewhere in the handbook, or any general technical topic!\n\nType any question below or choose a starter to begin.`,
  timestamp: Date.now(),
  mode: 'chat',
  source: 'current_website'
};

export const NiKiChat: React.FC<NiKiChatProps> = ({
  isOpen,
  onClose,
  currentSlide,
  allSlides,
  currentSlideIndex,
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
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'web_research' | 'generating'>('idle');
  const [activeMode, setActiveMode] = useState<'chat' | 'interview' | 'quiz'>('chat');
  const [includeSlideContext, setIncludeSlideContext] = useState(true);
  const [showAllStarters, setShowAllStarters] = useState(false);
  const [isHistoryCleared, setIsHistoryCleared] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const dynamicSuggestions = getDynamicSuggestions(currentSlide);

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
        allSlides,
        currentSlideIndex,
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
        source: response.source,
        webSources: response.webSources,
        routingCase: response.routingCase,
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
    setMessages([INITIAL_GREETING]);
    setInputPrompt('');
    setIsLoading(false);
    setSearchStatus('idle');
    try {
      localStorage.removeItem('eunchae_chat_history_v1');
      localStorage.removeItem('niki_chat_history_v1');
    } catch (e) {
      console.error(e);
    }
    setIsHistoryCleared(true);
    setTimeout(() => {
      setIsHistoryCleared(false);
    }, 1500);
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
            <h2 id="eunchae-chat-header" className="text-sm sm:text-base font-bold text-white font-['Plus_Jakarta_Sans'] leading-tight flex items-center gap-1.5 truncate">
              Eunchae <span className="text-cyan-400 font-normal">✦</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-sans leading-tight mt-0.5 truncate">
              Your Interview Prep Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClearHistory}
            className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              isHistoryCleared
                ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Clear conversation history"
            aria-label="Clear conversation history"
          >
            {isHistoryCleared ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-medium text-emerald-400 hidden sm:inline">Cleared</span>
              </>
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Eunchae (Esc)"
            aria-label="Close Eunchae (Esc)"
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
        <div className="px-3.5 py-2 bg-slate-900/60 border-b border-cyan-500/20 flex items-center justify-between text-[11px] text-slate-300 flex-shrink-0">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="text-cyan-400 font-semibold flex items-center gap-1.5 flex-shrink-0">
              <span>📖</span>
              <span className="text-slate-400 font-normal">Current topic:</span>
            </span>
            <span className="text-white font-medium truncate">
              {currentSlide.slideTitle} <span className="text-slate-500 text-[10px]">({currentSlide.sectionTitle})</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIncludeSlideContext(prev => !prev)}
            className={`text-[10px] px-2 py-0.5 rounded-full border font-mono transition-colors cursor-pointer flex-shrink-0 ${
              includeSlideContext
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 shadow-xs'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title={includeSlideContext ? 'Slide context is attached to queries' : 'Slide context ignored'}
          >
            {includeSlideContext ? 'Screen Context: ON' : 'Screen Context: OFF'}
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
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {message.source === 'current_website' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 shadow-xs">
                        <Monitor className="w-3 h-3 text-cyan-400" />
                        <span>Current Website</span>
                      </span>
                    )}
                    {message.source === 'study_material' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 shadow-xs">
                        <BookOpen className="w-3 h-3 text-emerald-400" />
                        <span>Study Material</span>
                      </span>
                    )}
                    {message.source === 'web_research' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/60 shadow-xs">
                        <Globe className="w-3 h-3 text-amber-400" />
                        <span>Web Research</span>
                      </span>
                    )}
                    {message.routingCase && (
                      <span className="text-[9px] font-mono text-slate-400">
                        {message.routingCase === 'case_a' || message.routingCase === 'case_e' ? '• Screen Context' : message.routingCase === 'case_b' ? '• Handbook RAG' : message.routingCase === 'case_c' || message.routingCase === 'case_d' ? '• Web Grounding' : '• Memory'}
                      </span>
                    )}
                  </div>
                )}

                {!isUser ? (
                  <>
                    <NiKiMarkdownRenderer content={message.text} />
                    {message.webSources && message.webSources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                        <div className="font-semibold text-amber-300/90 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-amber-400" />
                          <span>Web Research Citations:</span>
                        </div>
                        <div className="space-y-1 pl-1">
                          {message.webSources.map((src, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-500">•</span>
                              {src.url ? (
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 truncate"
                                >
                                  <span className="truncate">{src.title || src.url}</span>
                                  <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                </a>
                              ) : (
                                <span className="text-slate-300 truncate">{src.title}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
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
              </div>
            </div>
          );
        })}

        {/* Loading / Multi-Stage Typing Indicator */}
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
                {searchStatus === 'web_research'
                  ? 'Researching the web for live facts... 🌐'
                  : searchStatus === 'searching'
                  ? 'Reading screen & searching study material... 🔎'
                  : 'Eunchae is crafting your explanation... ✦'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Conversation Starters & Suggestions Bar */}
      <div className="px-3 sm:px-4 py-2 bg-slate-900/70 border-t border-slate-800/70 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] uppercase font-mono text-slate-400 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-slate-300 font-semibold">TCS Ignite Starters:</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAllStarters(prev => !prev)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-sans"
          >
            {showAllStarters ? 'Collapse ▴' : 'View All (5) ▾'}
          </button>
        </div>

        {/* 5 Conversation Starters */}
        <div className={`flex ${showAllStarters ? 'flex-col' : 'overflow-x-auto custom-scrollbar no-scrollbar'} gap-1.5 pb-1`}>
          {CONVERSATION_STARTERS.map(starter => (
            <button
              key={starter.id}
              type="button"
              onClick={() => handleSendMessage(starter.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-cyan-950 text-slate-200 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap text-left shadow-xs active:scale-[0.98]"
              title={starter.prompt}
            >
              <span className="text-xs">{starter.icon}</span>
              <span className="font-medium">{starter.title}</span>
            </button>
          ))}
        </div>

        {/* Slide-Specific Suggestions when available and when collapsed */}
        {!showAllStarters && currentSlide && dynamicSuggestions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 mt-1 border-t border-slate-800/50">
            <span className="text-[9px] font-mono text-slate-500 flex-shrink-0">Slide:</span>
            {dynamicSuggestions.slice(0, 3).map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

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
                  ? `Ask about "${currentSlide.slideTitle}" or any other topic...`
                  : 'Ask Eunchae any question, coding query, or concept...'
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
          <span>Ask any question • Grounded on handbook & live AI</span>
          <span className="hidden sm:inline font-mono">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

// Named aliases for clean modern imports
export const EunchaeChat = NiKiChat;
export type { NiKiChatProps as EunchaeChatProps };
