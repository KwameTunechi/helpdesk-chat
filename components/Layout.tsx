
import React, { useState } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  user: string | null;
  userRole: 'admin' | 'user' | null;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, onLogout, user, userRole, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewChange = (view: AppView) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const userBottomNav = [
    {
      view: AppView.CHAT,
      label: 'Chat',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    },
    {
      view: AppView.KNOWLEDGE_BASE,
      label: 'Knowledge',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    },
  ];

  const adminBottomNav = [
    {
      view: AppView.TICKETS,
      label: 'Tickets',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
    },
    {
      view: AppView.ANALYTICS,
      label: 'Analytics',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    },
    {
      view: AppView.RECORDS,
      label: 'Records',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    },
    {
      view: AppView.KNOWLEDGE_BASE,
      label: 'KB',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    },
    {
      view: AppView.SECURITY,
      label: 'Security',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    },
  ];

  const bottomNav = userRole === 'admin' ? adminBottomNav : userBottomNav;

  return (
    <div className="flex bg-slate-50 overflow-hidden" style={{ height: '100dvh' }}>
      {/* Sidebar — Desktop only */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden lg:flex shrink-0">
        <SidebarContent currentView={currentView} onViewChange={handleViewChange} onLogout={onLogout} user={user} userRole={userRole} />
      </aside>

      {/* Sidebar — Mobile full-screen overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col animate-in slide-in-from-left duration-200 z-10 shadow-2xl">
            <SidebarContent currentView={currentView} onViewChange={handleViewChange} onLogout={onLogout} user={user} userRole={userRole} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 md:h-16 border-b bg-white flex items-center justify-between px-3 md:px-6 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0 active:bg-slate-200"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="lg:hidden text-base font-black text-blue-600 shrink-0">FixChat</span>
            <h2 className="hidden lg:block text-lg font-bold text-slate-800 capitalize truncate">
              {currentView.replace('_', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                {user ? user.substring(0, 2).toUpperCase() : 'IT'}
              </div>
              <span className="hidden sm:block text-xs font-bold text-slate-700 max-w-[120px] truncate">{user}</span>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                AI ACTIVE
              </span>
            </div>
          </div>
        </header>

        {/* Page Content — shrinks above bottom nav on mobile */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 lg:pb-0 pb-16">
          {children}
        </div>
      </main>

      {/* Bottom Navigation — Mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-inset-bottom">
        <div className="flex items-stretch justify-around h-16">
          {bottomNav.map(({ view, label, icon }) => {
            const active = currentView === view;
            return (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors active:bg-slate-50 ${
                  active ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <svg className={`w-5 h-5 shrink-0 transition-transform ${active ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
                <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                  {label}
                </span>
                {active && <span className="absolute bottom-0 w-8 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            );
          })}
          {/* Logout button in bottom nav */}
          <button
            onClick={onLogout}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-400 active:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[10px] font-bold tracking-wide">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

const SidebarContent: React.FC<{
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  user: string | null;
  userRole: 'admin' | 'user' | null;
}> = ({ currentView, onViewChange, onLogout, user, userRole }) => (
  <>
    <div className="p-5 border-b border-slate-800 shrink-0">
      <h1 className="text-xl font-black">
        <span className="text-blue-400">FixChat</span>
      </h1>
      <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-black">
        {userRole === 'admin' ? 'Enterprise Admin' : 'Employee Support'}
      </p>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {userRole !== 'admin' && (
        <NavItem
          active={currentView === AppView.CHAT}
          onClick={() => onViewChange(AppView.CHAT)}
          icon={<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
          label="AI Support Chat"
        />
      )}
      <NavItem
        active={currentView === AppView.KNOWLEDGE_BASE}
        onClick={() => onViewChange(AppView.KNOWLEDGE_BASE)}
        icon={<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
        label="Knowledge Base"
      />

      {userRole === 'admin' && (
        <>
          <NavItem
            active={currentView === AppView.TICKETS}
            onClick={() => onViewChange(AppView.TICKETS)}
            icon={<path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />}
            label="Emergency Tickets"
          />
          <NavItem
            active={currentView === AppView.RECORDS}
            onClick={() => onViewChange(AppView.RECORDS)}
            icon={<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
            label="Ticket Records"
          />
          <div className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Insights</div>
          <NavItem
            active={currentView === AppView.ANALYTICS}
            onClick={() => onViewChange(AppView.ANALYTICS)}
            icon={<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
            label="System Analytics"
          />
          <NavItem
            active={currentView === AppView.SECURITY}
            onClick={() => onViewChange(AppView.SECURITY)}
            icon={<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
            label="Privacy Center"
          />
        </>
      )}
    </nav>

    <div className="p-3 border-t border-slate-800 space-y-2 shrink-0">
      <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shrink-0">
          {user ? user.substring(0, 2).toUpperCase() : 'IT'}
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <p className="text-sm font-bold truncate text-white">{user || 'IT Admin'}</p>
          <p className="text-[10px] text-slate-400 font-medium capitalize">{userRole} License</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  </>
);

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
    <span className="font-semibold text-sm truncate">{label}</span>
  </button>
);

export default Layout;
