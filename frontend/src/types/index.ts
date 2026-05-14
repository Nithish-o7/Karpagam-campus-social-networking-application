/**
 * KCE Connect — Core TypeScript Data Models
 * Based on data model specifications in claude.md
 */

// ── User ─────────────────────────────────────────────────────
export type UserRole = 'student' | 'faculty' | 'staff' | 'alumni';

export interface User {
  id: number;
  name: string;
  email: string;         // Must be @kce.ac.in
  role: UserRole;
  department: string;
  rollNumber: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  createdAt: string;     // ISO timestamp
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}

// ── Post (Social Feed) ────────────────────────────────────────
export interface Post {
  id: string;
  authorId: string;
  author?: User;         // Populated via join/fetch
  content: string;
  mediaUrl: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;     // Frontend-tracked state
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: string;
}

// ── ServiceNow Integration ────────────────────────────────────
export type IssueCategory =
  | 'Wifi Issues'
  | 'Lab Issues'
  | 'Electricity Issues'
  | 'Hostel Issues'
  | 'Transport Issues'
  | 'Classroom Issues';

export interface ServiceRequestPayload {
  requester_email: string;
  service_category: IssueCategory;
  block: string;
  room_number: string;
  short_description: string;
  source: 'KCE Mobile App';
  attachment_url?: string | null;
}

export type TicketState = 'New' | 'In Progress' | 'Resolved';

export interface Ticket {
  ticket_id: string;     // e.g. INC0010023
  sys_id: string;
  category: IssueCategory;
  assignment_group: string;
  state: TicketState;
  sla_breach_time: string | null;   // ISO timestamp
  resolution_notes: string | null;
  short_description?: string;
  created_at?: string;
}

// ── API Responses ─────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
