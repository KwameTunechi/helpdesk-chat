
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Layout from './components/Layout';
import ChatWindow from './components/ChatWindow';
import KnowledgeBase from './components/KnowledgeBase';
import Analytics from './components/Analytics';
import SecurityPrivacy from './components/SecurityPrivacy';
import TicketList from './components/TicketList';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { AppView, SessionStats, Message, Ticket } from './types';

type AuthState = 'landing' | 'login' | 'authenticated';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Akwaaba! I am your IT Helpdesk Assistant. Please select a category or describe your IT problem to begin.",
      timestamp: new Date()
    }
  ]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    access: 0,
    apps: 0,
    network: 0,
    email: 0,
    hardware: 0
  });
  const [activeUserCount, setActiveUserCount] = useState(1);

  useEffect(() => {
    const socket = io();
    socket.on('user_count', (count: number) => {
      setActiveUserCount(count);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAdminLogin = (username: string) => {
    setAuthState('authenticated');
    setUserRole('admin');
    setUser(username);
    setCurrentView(AppView.ANALYTICS);
  };

  const handleUserLogin = () => {
    setAuthState('authenticated');
    setUserRole('user');
    setUser('Guest User');
    setCurrentView(AppView.CHAT);
  };

  const handleLogout = () => {
    setAuthState('landing');
    setUserRole(null);
    setUser(null);
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
    return <LandingPage onSelectAdmin={() => setAuthState('login')} onSelectUser={handleUserLogin} />;
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
