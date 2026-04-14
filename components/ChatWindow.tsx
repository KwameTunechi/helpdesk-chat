
import React, { useState, useRef, useEffect } from 'react';
import { Message, SessionStats, Ticket, GroundingSource } from '../types';
import { geminiService } from '../services/geminiService';
import { IT_CATEGORIES } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onUpdateStats: (category: keyof SessionStats) => void;
  onCreateTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => string;
  isLoading?: boolean;
}

const QUICK_ACTIONS = [
  "Reset System Password",
  "Office Wi-Fi Code",
  "Printer Paper Jam",
  "Email Storage Full",
  "System is slow"
];

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, setMessages, onUpdateStats, onCreateTicket, isLoading }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationForm, setEscalationForm] = useState({
    subject: '',
    description: '',
    reason: '',
    userName: '',
    staffId: '',
    contact: '',
    department: ''
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const detectCategory = (text: string) => {
    const lowText = text.toLowerCase();
    if (lowText.includes('1') || lowText.includes('login') || lowText.includes('password') || lowText.includes('access')) onUpdateStats('access');
    if (lowText.includes('2') || lowText.includes('software') || lowText.includes('stargroup') || lowText.includes('slow') || lowText.includes('frozen')) onUpdateStats('apps');
    if (lowText.includes('3') || lowText.includes('internet') || lowText.includes('wi-fi') || lowText.includes('wifi') || lowText.includes('network')) onUpdateStats('network');
    if (lowText.includes('4') || lowText.includes('email') || lowText.includes('mail') || lowText.includes('outlook')) onUpdateStats('email');
    if (lowText.includes('5') || lowText.includes('printer') || lowText.includes('computer') || lowText.includes('screen') || lowText.includes('hardware')) onUpdateStats('hardware');
  };

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    detectCategory(textToSend);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = [...messages, userMsg].map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    let fullResponse = '';
    let extractedSources: GroundingSource[] = [];

    try {
      const stream = geminiService.sendMessageStream(history, userMsg.content);
      for await (const chunk of stream) {
        const cleanedChunk = chunk.text.replace(/\*/g, '');
        fullResponse += cleanedChunk;

        // Extract grounding chunks if available
        if (chunk.groundingMetadata?.groundingChunks) {
          const sources = chunk.groundingMetadata.groundingChunks
            .filter((c: any) => c.web)
            .map((c: any) => ({
              title: c.web.title || 'Source',
              uri: c.web.uri
            }));
          if (sources.length > 0) extractedSources = sources;
        }

        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: fullResponse, sources: extractedSources.length > 0 ? extractedSources : m.sources } : m
        ));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, content: "Sorry, I had a problem connecting. Please try again." } : m
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = onCreateTicket({
      subject: escalationForm.subject || "Manual Escalation from Chat",
      category: "Escalated",
      priority: "Emergency",
      description: escalationForm.description,
      escalationReason: escalationForm.reason,
      userName: escalationForm.userName,
      staffId: escalationForm.staffId,
      contact: escalationForm.contact,
      department: escalationForm.department
    });

    const assistMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I have opened an Emergency Ticket (ID: ${ticketId}) for you.\n\nDetails Submitted:\n- Subject: ${escalationForm.subject}\n- User: ${escalationForm.userName}\n- Department: ${escalationForm.department}\n\nOur human IT team has been notified and will contact you at ${escalationForm.contact} shortly.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistMsg]);
    setShowEscalationModal(false);
    setEscalationForm({
      subject: '',
      description: '',
      reason: '',
      userName: '',
      staffId: '',
      contact: '',
      department: ''
    });
  };

  const downloadTranscript = () => {
    const text = messages.map(m => `${m.role.toUpperCase()} (${m.timestamp.toLocaleTimeString()}): ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `it-helpdesk-transcript-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col bg-slate-50 overflow-hidden relative" style={{ height: '100%', minHeight: 0 }} onFocus={() => { setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 300); }}>
      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="p-4 md:p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800">Escalate to IT Human Support</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Emergency Ticket Creation</p>
              </div>
              <button onClick={() => setShowEscalationModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEscalationSubmit} className="p-4 md:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={escalationForm.userName}
                    onChange={(e) => setEscalationForm({...escalationForm, userName: e.target.value})}
                    placeholder="e.g. Kofi Mensah"
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff ID</label>
                  <input 
                    required
                    type="text" 
                    value={escalationForm.staffId}
                    onChange={(e) => setEscalationForm({...escalationForm, staffId: e.target.value})}
                    placeholder="e.g. STF-9021"
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                  <input 
                    required
                    type="tel" 
                    value={escalationForm.contact}
                    onChange={(e) => setEscalationForm({...escalationForm, contact: e.target.value})}
                    placeholder="e.g. 024 123 4567"
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                  <input 
                    required
                    type="text" 
                    value={escalationForm.department}
                    onChange={(e) => setEscalationForm({...escalationForm, department: e.target.value})}
                    placeholder="e.g. Finance"
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject of Issue</label>
                <input 
                  required
                  type="text" 
                  value={escalationForm.subject}
                  onChange={(e) => setEscalationForm({...escalationForm, subject: e.target.value})}
                  placeholder="e.g. Cannot access Enterprise portal"
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                <textarea 
                  required
                  rows={3}
                  value={escalationForm.description}
                  onChange={(e) => setEscalationForm({...escalationForm, description: e.target.value})}
                  placeholder="Explain exactly what happened..."
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Escalation</label>
                <select 
                  required
                  value={escalationForm.reason}
                  onChange={(e) => setEscalationForm({...escalationForm, reason: e.target.value})}
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a reason...</option>
                  <option value="AI could not solve it">AI could not solve it</option>
                  <option value="Critical system outage">Critical system outage</option>
                  <option value="Urgent business requirement">Urgent business requirement</option>
                  <option value="Security concern">Security concern</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-sm"
              >
                Submit Emergency Ticket
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white border-b px-6 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Secured Chat</span>
        </div>
        <button onClick={downloadTranscript} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save Transcript
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6 scroll-smooth bg-slate-50 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
            <svg className="w-8 h-8 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm font-bold">Loading your chat history...</p>
          </div>
        ) : null}
        {!isLoading && messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
            }`}>
              {msg.role === 'user' ? 'ME' : 'AI'}
            </div>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm relative ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'
            }`}>
              <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {msg.content}
                {msg.id === '1' && msg.role === 'assistant' && (
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {IT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleSend(cat.title)}
                        className="text-left px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-between group"
                      >
                        <span>{cat.id}. {cat.title}</span>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
                {msg.role === 'assistant' && !msg.content && (
                  <div className="flex gap-1 py-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-slate-50 hover:bg-slate-100 border px-2 py-1 rounded-lg text-blue-600 font-bold flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[10px] mt-2 font-bold opacity-60 flex items-center gap-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 border-t bg-white shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_ACTIONS.map((action, i) => (
              <button 
                key={i}
                onClick={() => handleSend(action)}
                className="whitespace-nowrap bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200"
              >
                {action}
              </button>
            ))}
            <button 
              onClick={() => setShowEscalationModal(true)}
              className="whitespace-nowrap bg-red-50 hover:bg-red-100 text-red-600 transition-colors px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Escalate
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 bg-white shrink-0 border-t shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex gap-2 items-center">
          <div className="flex-1 relative flex items-center bg-slate-100 rounded-2xl px-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your IT problem..."
              className="flex-1 bg-transparent border-none py-3 focus:ring-0 outline-none font-medium text-sm text-slate-700"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 text-white p-3 md:p-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0"
          >
            {isTyping ? (
              <svg className="w-5 h-5 md:w-6 md:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 md:w-6 md:h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
