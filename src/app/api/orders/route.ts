import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/orders — list all orders (artist dashboard)
export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/orders — create a new order/reservation
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const {
    artwork_id, artwork_title, buyer_name, buyer_email,
    buyer_phone, buyer_address, order_type, amount,
  } = body;

  if (!artwork_id || !buyer_name || !buyer_email || !buyer_phone || !order_type || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // For reservations: set a 7-day window
  const reserved_until =
    order_type === 'reservation'
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : null;

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      artwork_id, artwork_title, buyer_name, buyer_email,
      buyer_phone, buyer_address: buyer_address ?? null,
      order_type, amount, status: 'pending',
      reserved_until, day_reminder_sent: 0, notes: null,
    }])
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // Update artwork status
  const newStatus = order_type === 'reservation' ? 'reserved' : 'sold';
  const artworkUpdate: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };
  if (order_type === 'reservation') {
    artworkUpdate.reserved_until = reserved_until;
    artworkUpdate.reserved_by_name = buyer_name;
    artworkUpdate.reserved_by_email = buyer_email;
  }

  await supabase.from('artworks').update(artworkUpdate).eq('id', artwork_id);

  return NextResponse.json(order, { status: 201 });
}
