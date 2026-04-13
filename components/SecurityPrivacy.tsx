
import React from 'react';

const SecurityPrivacy: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-12 pb-32">
        <section className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Data Privacy & Security</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Operating in banking and government sectors (GRA/Health) requires strict adherence to Ghana's Data Protection Act (Act 843).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold">Confidentiality</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                All interactions are end-to-end encrypted. Sensitive information like passwords and tokens are never stored in plain text or logged in AI training datasets.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800">Compliance</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                System logic follows ISO 27001 standards. Access controls are role-based (RBAC) to ensure employees only receive help for authorized systems.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 p-6 md:p-8 rounded-3xl border border-blue-100 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-blue-900">Risk Assessment</h4>
          </div>
          
          <div className="grid grid-cols-1 gap-4 text-blue-800">
            <div className="p-4 bg-white/60 rounded-xl border border-blue-200">
              <p className="font-bold text-sm mb-1">Hallucination Mitigation</p>
              <p className="text-xs leading-relaxed opacity-80">The model is strictly grounded to our knowledge base and live search results, reducing unverified outputs.</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl border border-blue-200">
              <p className="font-bold text-sm mb-1">PII Masking</p>
              <p className="text-xs leading-relaxed opacity-80">Personally Identifiable Information is filtered before being processed by the AI engine.</p>
            </div>
            <div className="p-4 bg-white/60 rounded-xl border border-blue-200">
              <p className="font-bold text-sm mb-1">Human-in-the-Loop</p>
              <p className="text-xs leading-relaxed opacity-80">Multi-factor authentication and account recovery always require manual IT approval via Tickets.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
