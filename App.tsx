
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import ChatWindow from './components/ChatWindow';
import KnowledgeBase from './components/KnowledgeBase';
import Analytics from './components/Analytics';
import SecurityPrivacy from './components/SecurityPrivacy';
import TicketList from './components/TicketList';
import LoginPage from './components/LoginPage';
import UserLoginPage from './components/UserLoginPage';
import LandingPage from './components/LandingPage';
import { AppView, SessionStats, Message, Ticket } from './types';
import {
  DEFAULT_MESSAGE,
  loadUserMessages,
  saveUserMessages,
  loadAllTickets,
  insertTicket,
  patchTicket,
} from './services/db';

type AuthState = 'landing' | 'login' | 'user-login' | 'authenticated';

const LS_TICKETS = 'fixchat_tickets';
const SESSION_KEY = 'fixchat_session';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE]);
  const [chatLoading, setChatLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    access: 0,
    apps: 0,
    network: 0,
    email: 0,
    hardware: 0,
  });
  const [activeUserCount] = useState(1);
  const isAuthenticated = useRef(false);
  const messagesLoaded = useRef(false);

  // Load all tickets on first mount
  useEffect(() => {
    loadAllTickets().then(setTickets);
  }, []);

  // Restore session after page refresh
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;
    try {
      const { username, role } = JSON.parse(saved);
      if (role === 'admin') handleAdminLogin(username);
      else handleUserLogin(username);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save messages whenever they change (only after initial load)
  useEffect(() => {
    if (isAuthenticated.current && user && messagesLoaded.current) {
      saveUserMessages(user, messages);
    }
  }, [messages, user]);

  // Keep localStorage ticket backup in sync
  useEffect(() => {
    localStorage.setItem(LS_TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  const handleAdminLogin = async (username: string) => {
    isAuthenticated.current = true;
    messagesLoaded.current = false;
    setChatLoading(true);
    setAuthState('authenticated');
    setUserRole('admin');
    setUser(username);
    setCurrentView(AppView.ANALYTICS);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username, role: 'admin' }));
    loadAllTickets().then(setTickets);
    const msgs = await loadUserMessages(username);
    messagesLoaded.current = true;
    setChatLoading(false);
    setMessages(msgs);
  };

  const handleUserLogin = async (username: string) => {
    isAuthenticated.current = true;
    messagesLoaded.current = false;
    setChatLoading(true);
    setAuthState('authenticated');
    setUserRole('user');
    setUser(username);
    setCurrentView(AppView.CHAT);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username, role: 'user' }));
    const msgs = await loadUserMessages(username);
    messagesLoaded.current = true;
    setChatLoading(false);
    setMessages(msgs);
  };

  const handleLogout = () => {
    isAuthenticated.current = false;
    messagesLoaded.current = false;
    sessionStorage.removeItem(SESSION_KEY);
    setAuthState('landing');
    setUserRole(null);
    setUser(null);
    setMessages([DEFAULT_MESSAGE]);
    setCurrentView(AppView.CHAT);
  };

  const updateStats = (category: keyof SessionStats) => {
    setStats((prev) => ({ ...prev, [category]: prev[category] + 1 }));
  };

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>): string => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(),
      status: 'Escalated',
    };
    setTickets((prev) => [newTicket, ...prev]);
    insertTicket(newTicket);
    return newTicket.id;
  };

  const updateTicketStatus = (id: string, status: Ticket['status'], closeReason?: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, closeReason } : t))
    );
    patchTicket(id, status, closeReason);
  };

  if (authState === 'landing') {
    return (
      <LandingPage
        onSelectAdmin={() => setAuthState('login')}
        onSelectUser={() => setAuthState('user-login')}
      />
    );
  }

  if (authState === 'user-login') {
    return <UserLoginPage onLogin={handleUserLogin} onBack={() => setAuthState('landing')} />;
  }

  if (authState === 'login') {
    return <LoginPage onLogin={handleAdminLogin} onBack={() => setAuthState('landing')} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.CHAT:
        return (
          <ChatWindow
            messages={messages}
            setMessages={setMessages}
            onUpdateStats={updateStats}
            onCreateTicket={createTicket}
            isLoading={chatLoading}
          />
        );
      case AppView.KNOWLEDGE_BASE:
        return <KnowledgeBase />;
      case AppView.ANALYTICS:
        return <Analytics stats={stats} tickets={tickets} activeUserCount={activeUserCount} />;
      case AppView.SECURITY:
        return <SecurityPrivacy />;
      case AppView.TICKETS:
        return (
          <TicketList
            tickets={tickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed')}
            onUpdateStatus={updateTicketStatus}
            onRefresh={() => loadAllTickets().then(setTickets)}
          />
        );
      case AppView.RECORDS:
        return (
          <TicketList
            tickets={tickets}
            onUpdateStatus={updateTicketStatus}
            isReadOnly={true}
            onRefresh={() => loadAllTickets().then(setTickets)}
          />
        );
      default:
        return userRole === 'admin' ? (
          <Analytics stats={stats} tickets={tickets} activeUserCount={activeUserCount} />
        ) : (
          <ChatWindow
            messages={messages}
            setMessages={setMessages}
            onUpdateStats={updateStats}
            onCreateTicket={createTicket}
            isLoading={chatLoading}
          />
        );
    }
  };

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={handleLogout}
      user={user}
      userRole={userRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
