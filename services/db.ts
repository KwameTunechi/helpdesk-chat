
/**
 * Persistence layer — tries Supabase first, falls back to localStorage.
 * Swap out only this file if the storage backend ever changes.
 */
import { supabase } from './supabaseClient';
import { Message, Ticket } from '../types';

const LS_CHAT = (u: string) => `fixchat_chat_${u}`;
const LS_TICKETS = 'fixchat_tickets';

export const DEFAULT_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content:
    'Akwaaba! I am your IT Helpdesk Assistant. Please select a category or describe your IT problem to begin.',
  timestamp: new Date(),
};

// ── Messages ────────────────────────────────────────────────────────────────

export async function loadUserMessages(username: string): Promise<Message[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('user_chats')
      .select('messages')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('[db] loadUserMessages error:', error);
    } else if (data?.messages?.length) {
      return (data.messages as any[]).map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    } else {
      return [DEFAULT_MESSAGE];
    }
  }

  // localStorage fallback
  try {
    const stored = localStorage.getItem(LS_CHAT(username));
    if (!stored) return [DEFAULT_MESSAGE];
    return (JSON.parse(stored) as any[]).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [DEFAULT_MESSAGE];
  }
}

export async function saveUserMessages(
  username: string,
  messages: Message[]
): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('user_chats').upsert(
      { username, messages, updated_at: new Date().toISOString() },
      { onConflict: 'username' }
    );
    if (error) {
      console.error('[db] saveUserMessages error:', error);
      // fall through to localStorage backup
    } else {
      return;
    }
  }
  localStorage.setItem(LS_CHAT(username), JSON.stringify(messages));
}

// ── Tickets ─────────────────────────────────────────────────────────────────

export async function loadAllTickets(): Promise<Ticket[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[db] loadAllTickets error:', error);
    } else if (data) {
      return data.map(rowToTicket);
    }
  }

  try {
    const stored = localStorage.getItem(LS_TICKETS);
    if (!stored) return [];
    return (JSON.parse(stored) as any[]).map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  } catch {
    return [];
  }
}

export async function insertTicket(ticket: Ticket): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('tickets').insert(ticketToRow(ticket));
    if (error) {
      console.error('[db] insertTicket error:', error);
    }
  }
}

export async function patchTicket(
  id: string,
  status: Ticket['status'],
  closeReason?: string
): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from('tickets')
      .update({ status, close_reason: closeReason ?? null })
      .eq('id', id);
    if (error) {
      console.error('[db] patchTicket error:', error);
    }
  }
}

// ── Mappers ─────────────────────────────────────────────────────────────────

function rowToTicket(row: any): Ticket {
  return {
    id: row.id,
    subject: row.subject,
    category: row.category,
    priority: row.priority,
    status: row.status,
    createdAt: new Date(row.created_at),
    description: row.description,
    escalationReason: row.escalation_reason,
    userName: row.user_name,
    staffId: row.staff_id,
    contact: row.contact,
    department: row.department,
    closeReason: row.close_reason,
  };
}

function ticketToRow(t: Ticket) {
  return {
    id: t.id,
    subject: t.subject,
    category: t.category,
    priority: t.priority,
    status: t.status,
    created_at: t.createdAt.toISOString(),
    description: t.description ?? null,
    escalation_reason: t.escalationReason ?? null,
    user_name: t.userName ?? null,
    staff_id: t.staffId ?? null,
    contact: t.contact ?? null,
    department: t.department ?? null,
    close_reason: t.closeReason ?? null,
  };
}
