import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/doodles — list all doodles
export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('doodles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/doodles — create a new doodle
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { title, image_url, price, price_number, status } = body;

  if (!title || !price) {
    return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('doodles')
    .insert([{
      title,
      image_url: image_url ?? null,
      price,
      price_number: price_number ?? 0,
      status: status ?? 'available',
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
