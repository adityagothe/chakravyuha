import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/artworks/[id] — fetch single artwork
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();
  const { id } = await params;

  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}

// PATCH /api/artworks/[id] — update artwork
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from('artworks')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE /api/artworks/[id] — delete artwork
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();
  const { id } = await params;

  // First cascade-delete any related orders to prevent foreign key errors
  await supabase
    .from('orders')
    .delete()
    .eq('artwork_id', id);

  // Then delete the artwork
  const { error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
