import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Database, 
  BookOpen, 
  ShieldCheck, 
  Lightbulb, 
  CornerDownLeft,
  Copy,
  Check
} from 'lucide-react';
import { Course, Student, CoAttainmentResult, PoAttainmentResult, AtRiskStudent } from '../types';
import { handleRagChatQuery, ChatMessage } from '../services/ragChat';

interface AiAssistantProps {
  course: Course;
  coResults: CoAttainmentResult[];
  poResults: PoAttainmentResult[];
  students: Student[];
  atRiskStudents: AtRiskStudent[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  course,
  coResults,
  poResults,
  students,
  atRiskStudents
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I am **OutcomeIQ RAG Assistant**, grounded in your **${course.code} (${course.title})** marksheet database, syllabus objectives, and NBA Criterion 3 rules.

Ask me anything about Course Outcomes, question bottlenecks, at-risk students, remedial plans, or accreditation formulas. All responses are verified against live course data without hallucination.`,
      sources: [`${course.code} Marksheet DB`, 'NBA Tier-1 Criteria', 'Syllabus L1-L4 Mapping'],
      suggestedFollowUps: [
        'Why is CO3 low in Operating Systems?',
        'Which students need help in CS301?',
        'Make me a study plan for my weakest CO',
        'Which PO is weakest in the department?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = handleRagChatQuery(
        textToSend,
        course,
        coResults,
        poResults,
        students,
        atRiskStudents
      );
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden text-slate-200">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-white text-base">OutcomeIQ RAG Conversational Assistant</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                Grounded • Zero Hallucination
              </span>
            </div>
            <p className="text-xs text-slate-400">Context: {course.code} ({course.totalStudents} Students, 5 COs, 12 POs)</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>SQLite</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>ChromaDB RAG</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isBot = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-500/40 text-sky-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 shadow-md'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 pb-1 border-b border-slate-700/50">
                  <span className="font-semibold">{isBot ? 'OutcomeIQ Engine' : 'You'}</span>
                  <div className="flex items-center space-x-2">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-white"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Text with simple Markdown rendering */}
                <div className="space-y-2 whitespace-pre-line text-xs sm:text-sm">
                  {msg.text}
                </div>

                {/* Evidence Tag */}
                {msg.evidenceData && (
                  <div className="mt-3 p-2 bg-slate-900/80 rounded-lg border border-slate-700/60 text-[11px] text-emerald-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span><strong>Based on Data:</strong> {msg.evidenceData}</span>
                  </div>
                )}

                {/* Sources Pill Tags */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Sources:</span>
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-slate-900 text-sky-300 text-[10px] font-mono border border-slate-700"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}

                {/* Follow-up Chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span>Suggested Follow-up Questions:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors text-left"
                        >
                          {chip} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-lg bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-500/40 text-sky-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-200"></span>
              <span>Querying course SQL records & RAG documents...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex items-center space-x-2 text-xs">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Quick Queries:</span>
        <button
          onClick={() => handleSend('Why is CO3 low in Operating Systems?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
        >
          🔍 Why is CO3 low?
        </button>
        <button
          onClick={() => handleSend('Which students need help in CS301?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
        >
          ⚠️ At-Risk Students
        </button>
        <button
          onClick={() => handleSend('Make me a study plan for my weakest CO')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
        >
          📅 2-Week Study Plan
        </button>
        <button
          onClick={() => handleSend('Which PO is weakest in the department?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
        >
          📊 Weakest Program Outcome
        </button>
        <button
          onClick={() => handleSend('Explain the formula for CO and PO attainment')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700"
        >
          📐 Formula Explainer
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask OutcomeIQ: 'Why did Midterm Q7 fail?', 'Which students missed target?'..."
            className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <span>Ask</span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
