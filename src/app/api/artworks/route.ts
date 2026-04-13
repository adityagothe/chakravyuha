import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/artworks — list all artworks
export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/artworks — create a new artwork
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const {
    title, description, image_url, price, price_number,
    status, medium, dimensions,
  } = body;

  if (!title || !price || !medium || !dimensions) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('artworks')
    .insert([{
      title, description, image_url: image_url ?? null,
      price, price_number: price_number ?? 0,
      status: status ?? 'available', medium, dimensions,
      reserved_until: null, reserved_by_name: null, reserved_by_email: null,
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
