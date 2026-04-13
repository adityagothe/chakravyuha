-- Create artworks table
create table public.artworks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    image_url text,
    price text not null,
    price_number numeric default 0,
    status text default 'available'::text not null, -- 'available', 'sold', 'reserved', 'coming_soon'
    medium text not null,
    dimensions text not null,
    reserved_until timestamp with time zone,
    reserved_by_name text,
    reserved_by_email text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) but allow public access since we guard via the frontend dashboard
alter table public.artworks enable row level security;
create policy "Allow public read access on artworks" on public.artworks for select using (true);
create policy "Allow public insert on artworks" on public.artworks for insert with check (true);
create policy "Allow public update on artworks" on public.artworks for update using (true);
create policy "Allow public delete on artworks" on public.artworks for delete using (true);

-- Create orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    artwork_id uuid references public.artworks(id) on delete restrict,
    artwork_title text not null,
    buyer_name text not null,
    buyer_email text not null,
    buyer_phone text not null,
    buyer_address text,
    order_type text not null, -- 'reservation', 'purchase'
    amount text not null,
    status text default 'pending'::text not null, -- 'pending', 'confirmed', 'completed', 'expired', 'cancelled'
    reserved_until timestamp with time zone,
    day_reminder_sent integer default 0 not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and public access for orders
alter table public.orders enable row level security;
create policy "Allow public read access on orders" on public.orders for select using (true);
create policy "Allow public insert on orders" on public.orders for insert with check (true);
create policy "Allow public update on orders" on public.orders for update using (true);
create policy "Allow public delete on orders" on public.orders for delete using (true);
