
export enum AppView {
  CHAT = 'chat',
  KNOWLEDGE_BASE = 'knowledge_base',
  ANALYTICS = 'analytics',
  SECURITY = 'security',
  TICKETS = 'tickets',
  RECORDS = 'records'
}

export type TicketStatus = 'Escalated' | 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: GroundingSource[];
}

export interface ITProblemCategory {
  id: number;
  title: string;
  complaints: string[];
  causes: string[];
  solutions: string[];
  frequency: 'High' | 'Medium' | 'Low';
}

export interface SessionStats {
  access: number;
  apps: number;
  network: number;
  email: number;
  hardware: number;
}

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'Emergency' | 'Normal';
  status: TicketStatus;
  createdAt: Date;
  description?: string;
  escalationReason?: string;
  userName?: string;
  staffId?: string;
  contact?: string;
  department?: string;
  closeReason?: string;
}
