/**
 * KCE Connect — Ticket Service (Phase 7)
 * Frontend proxy for all /api/tickets middleware routes.
 */
import apiClient from './apiClient';

/* ── Request / Response types ────────────────────────────── */
export interface CreateTicketPayload {
  requestType: string;
  name?: string;      // Optional — backend extracts from JWT when user is authenticated
  phoneNumber: string;
  category: string;
  block: string;
  room?: string;
  description: string;
}

export interface CreateTicketResponse {
  success: boolean;
  incidentId: string;
  message: string;
  meta: {
    assignedTo: string;
    estimatedResponse: string;
    category: string;
    location: string;
    createdAt: string;
    snowUrl: string;
  };
}

/** Normalised ticket shape returned by GET /api/tickets */
export interface TicketItem {
  sys_id:      string;
  number:      string;
  category:    string;
  description: string;
  /** Human-readable label, e.g. "Open", "In Progress", "Resolved" */
  state:       string;
  /** Raw ServiceNow state code, e.g. "1", "2", "6" */
  stateCode:   string;
  createdAt:   string;
  name:        string;
  requestType: string;
}

/* ── Service ─────────────────────────────────────────────── */
export const ticketService = {
  /** Submit a new campus issue ticket to ServiceNow via middleware. */
  async create(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
    const { data } = await apiClient.post<CreateTicketResponse>('/tickets', payload);
    return data;
  },

  /** Phase 7 — Fetch all tickets from ServiceNow. */
  async getUserTickets(): Promise<TicketItem[]> {
    const { data } = await apiClient.get<{ success: boolean; tickets: TicketItem[] }>('/tickets');
    return data.tickets ?? [];
  },

  /** Phase 7 — Fetch a single ticket by sys_id or number. */
  async getById(id: string): Promise<TicketItem> {
    const { data } = await apiClient.get<{ success: boolean; ticket: TicketItem }>(`/tickets/${id}`);
    return data.ticket;
  },
};
