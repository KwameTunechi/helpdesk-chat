
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

type AuthState = 'landing' | 'login' | 'user-login' | 'authenticated';

const CHAT_STORAGE_KEY = (username: string) => `fixchat_chat_${username}`;
const TICKETS_STORAGE_KEY = 'fixchat_tickets';

const DEFAULT_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Akwaaba! I am your IT Helpdesk Assistant. Please select a category or describe your IT problem to begin.",
  timestamp: new Date()
};

const loadMessages = (username: string): Message[] => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY(username));
    if (!stored) return [DEFAULT_MESSAGE];
    const parsed = JSON.parse(stored);
    return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [DEFAULT_MESSAGE];
  }
};

const loadTickets = (): Ticket[] => {
  try {
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    return [];
  }
};

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE]);
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets);
  const isAuthenticated = useRef(false);
  const [stats, setStats] = useState<SessionStats>({
    access: 0,
    apps: 0,
    network: 0,
    email: 0,
    hardware: 0
  });
  const [activeUserCount] = useState(1);

  // Persist chat messages to localStorage whenever they change (only after login)
  useEffect(() => {
    if (isAuthenticated.current && user) {
      localStorage.setItem(CHAT_STORAGE_KEY(user), JSON.stringify(messages));
    }
  }, [messages, user]);

  // Persist tickets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const handleAdminLogin = (username: string) => {
    isAuthenticated.current = true;
    setAuthState('authenticated');
    setUserRole('admin');
    setUser(username);
    setMessages(loadMessages(username));
    setCurrentView(AppView.ANALYTICS);
  };

  const handleUserLogin = (username: string) => {
    isAuthenticated.current = true;
    setAuthState('authenticated');
    setUserRole('user');
    setUser(username);
    setMessages(loadMessages(username));
    setCurrentView(AppView.CHAT);
  };

  const handleLogout = () => {
    isAuthenticated.current = false;
    setAuthState('landing');
    setUserRole(null);
    setUser(null);
    setMessages([DEFAULT_MESSAGE]);
    setCurrentView(AppView.CHAT);
  };

  const updateStats = (category: keyof SessionStats) => {
    setStats(prev => ({
      ...prev,
      [category]: prev[category] + 1
    }));
  };

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(),
      status: 'Escalated'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: Ticket['status'], closeReason?: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, closeReason } : t));
  };

  if (authState === 'landing') {
    return <LandingPage onSelectAdmin={() => setAuthState('login')} onSelectUser={() => setAuthState('user-login')} />;
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
          />
        );
      case AppView.KNOWLEDGE_BASE:
        return <KnowledgeBase />;
      case AppView.ANALYTICS:
        return <Analytics stats={stats} tickets={tickets} activeUserCount={activeUserCount} />;
      case AppView.SECURITY:
        return <SecurityPrivacy />;
      case AppView.TICKETS:
        return <TicketList tickets={tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed')} onUpdateStatus={updateTicketStatus} />;
      case AppView.RECORDS:
        return <TicketList tickets={tickets} onUpdateStatus={updateTicketStatus} isReadOnly={true} />;
      default:
        return userRole === 'admin' ? <Analytics stats={stats} tickets={tickets} activeUserCount={activeUserCount} /> : (
          <ChatWindow 
            messages={messages} 
            setMessages={setMessages} 
            onUpdateStats={updateStats}
            onCreateTicket={createTicket}
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
