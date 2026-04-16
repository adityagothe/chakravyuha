import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/bids — list all bids (artist dashboard)
export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/bids — buyer submits a new bid
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const {
    artwork_id,
    artwork_title,
    bid_amount,
    bid_amount_number,
    buyer_name,
    buyer_email,
    buyer_phone,
    buyer_whatsapp,
    message,
  } = body;

  if (!artwork_id || !artwork_title || !bid_amount || !bid_amount_number || !buyer_name || !buyer_email || !buyer_phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('bids')
    .insert([{
      artwork_id,
      artwork_title,
      bid_amount,
      bid_amount_number,
      buyer_name,
      buyer_email,
      buyer_phone,
      buyer_whatsapp: buyer_whatsapp ?? null,
      message: message ?? null,
      status: 'pending',
      read: false,
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
