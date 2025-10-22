export interface Category {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  events_count?: number;
}

export interface EventItem {
  id: number;
  title: string;
  description?: string | null;
  location?: string | null;
  start_time: string;
  end_time?: string | null;
  category_id?: number | null;
  category?: Category;
  tickets_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type TicketStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Ticket {
  id: number;
  event_id: number;
  user_id: number;
  status: TicketStatus;
  price?: number | null;
  event?: EventItem;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'user';
  };
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  events?: T[]; // for events
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
