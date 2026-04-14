
import React from 'react';

interface LandingPageProps {
  onSelectAdmin: () => void;
  onSelectUser: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectAdmin, onSelectUser }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full z-10">
        <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-3">
            <span className="text-blue-500">FixChat</span>
          </h1>
          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto px-2">
            Your intelligent companion for workplace IT support.
            Select your access level to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* User Card */}
          <button
            onClick={onSelectUser}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 p-6 md:p-8 rounded-3xl transition-all duration-300 text-left overflow-hidden animate-in fade-in slide-in-from-left duration-700"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Login as User</h2>
            <p className="text-slate-400 mb-6">
              Get instant help with your IT issues, access the knowledge base, and chat with our AI assistant.
            </p>
            <div className="flex items-center text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
              Start Support Session
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={onSelectAdmin}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 p-6 md:p-8 rounded-3xl transition-all duration-300 text-left overflow-hidden animate-in fade-in slide-in-from-right duration-700"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Login as Admin</h2>
            <p className="text-slate-400 mb-6">
              Access system analytics, manage emergency tickets, and configure security settings. Requires 2FA.
            </p>
            <div className="flex items-center text-emerald-400 font-bold group-hover:translate-x-2 transition-transform">
              Admin Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          &copy; 2026 FixChat. All rights reserved. Secure Enterprise Support.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
