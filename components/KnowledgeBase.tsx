
import React, { useState } from 'react';
import { IT_CATEGORIES } from '../constants';

const KnowledgeBase: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCategories = IT_CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(search.toLowerCase()) ||
    cat.complaints.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    cat.solutions.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopy = (id: string, text: string[]) => {
    const fullText = `IT SOLUTION: ${id}\n\nSteps:\n${text.map((t, i) => `${i+1}. ${t}`).join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="p-4 md:p-8 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto w-full space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Enterprise Knowledge Base</h3>
              <p className="text-slate-500 text-sm font-medium italic">Validated IT solutions for Ghanaian office environments</p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search issues, apps, or errors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 w-full md:w-80 outline-none"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {cat.id === 1 && <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                      {cat.id === 2 && <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                      {cat.id === 3 && <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />}
                      {cat.id === 4 && <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                      {cat.id === 5 && <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />}
                    </svg>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                    cat.frequency === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {cat.frequency} Volume
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-slate-800 mb-2">{cat.title}</h4>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Affected Users describe as</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.complaints.map((c, i) => (
                        <span key={i} className="text-xs bg-slate-50 border px-2.5 py-1 rounded-lg text-slate-600 font-medium">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Fix Instructions</p>
                      <button 
                        onClick={() => handleCopy(cat.title, cat.solutions)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                          copiedId === cat.title ? 'bg-green-600 border-green-600 text-white' : 'text-slate-400 hover:text-blue-600 border-slate-200'
                        }`}
                      >
                        {copiedId === cat.title ? 'COPIED!' : 'COPY STEPS'}
                      </button>
                    </div>
                    <ul className="space-y-3">
                      {cat.solutions.map((sol, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {i+1}
                          </div>
                          <span className="text-sm text-slate-700 font-semibold leading-tight">{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-800 font-bold text-lg">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
