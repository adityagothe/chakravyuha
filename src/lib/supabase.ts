import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  artworks: ArtworkRow;
  orders: OrderRow;
};

export interface ArtworkRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price: string;
  price_number: number;
  status: 'available' | 'sold' | 'reserved' | 'coming_soon';
  medium: string;
  dimensions: string;
  reserved_until: string | null;
  reserved_by_name: string | null;
  reserved_by_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  artwork_id: string;
  artwork_title: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_address: string | null;
  order_type: 'reservation' | 'purchase';
  amount: string;
  status: 'pending' | 'confirmed' | 'completed' | 'expired' | 'cancelled';
  reserved_until: string | null;
  day_reminder_sent: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
