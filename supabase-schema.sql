-- ─── ARTWORKS ─────────────────────────────────────────────────────────────────

create table if not exists public.artworks (
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

alter table public.artworks enable row level security;
create policy if not exists "Allow public read access on artworks"   on public.artworks for select using (true);
create policy if not exists "Allow public insert on artworks"        on public.artworks for insert with check (true);
create policy if not exists "Allow public update on artworks"        on public.artworks for update using (true);
create policy if not exists "Allow public delete on artworks"        on public.artworks for delete using (true);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────

create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    order_id text,                                              -- human-readable e.g. CHK-2026-0042
    artwork_id uuid references public.artworks(id) on delete restrict,
    artwork_title text not null,
    buyer_name text not null,
    buyer_email text not null,
    buyer_phone text not null,
    buyer_whatsapp text,
    buyer_address text,
    buyer_pincode text,
    order_type text not null,                                   -- 'reservation' | 'purchase'
    amount text not null,
    status text default 'pending'::text not null,               -- see OrderStatus in artworks.ts
    reserved_until timestamp with time zone,
    upi_transaction_id text,
    payment_verified boolean default false,
    tracking_id text,
    day_reminder_sent integer default 0 not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;
create policy if not exists "Allow public read access on orders"  on public.orders for select using (true);
create policy if not exists "Allow public insert on orders"       on public.orders for insert with check (true);
create policy if not exists "Allow public update on orders"       on public.orders for update using (true);
create policy if not exists "Allow public delete on orders"       on public.orders for delete using (true);

-- Add any missing columns to an existing orders table (safe to run multiple times)
alter table public.orders
  add column if not exists order_id              text,
  add column if not exists buyer_whatsapp        text,
  add column if not exists buyer_pincode         text,
  add column if not exists upi_transaction_id    text,
  add column if not exists payment_verified      boolean default false,
  add column if not exists tracking_id           text;

-- ─── DOODLES ──────────────────────────────────────────────────────────────────

create table if not exists public.doodles (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    image_url text,
    price text not null,
    price_number numeric default 0,
    status text default 'available'::text not null,             -- 'available' | 'sold'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.doodles enable row level security;
create policy if not exists "Allow public read access on doodles"  on public.doodles for select using (true);
create policy if not exists "Allow public insert on doodles"       on public.doodles for insert with check (true);
create policy if not exists "Allow public update on doodles"       on public.doodles for update using (true);
create policy if not exists "Allow public delete on doodles"       on public.doodles for delete using (true);

-- ─── BIDS ─────────────────────────────────────────────────────────────────────

create table if not exists public.bids (
    id uuid default gen_random_uuid() primary key,
    artwork_id uuid references public.artworks(id) on delete cascade,
    artwork_title text not null,
    bid_amount text not null,                   -- display string e.g. "₹3,500"
    bid_amount_number numeric not null,         -- numeric for sorting / comparison
    buyer_name text not null,
    buyer_email text not null,
    buyer_phone text not null,
    buyer_whatsapp text,
    message text,                               -- optional buyer message to artist
    status text default 'pending'::text not null
        check (status in ('pending','accepted','countered','declined')),
    artist_counter_amount text,                 -- artist counter-offer amount
    artist_message text,                        -- artist response message
    read boolean default false,                 -- has the artist viewed this bid?
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bids enable row level security;
create policy if not exists "Allow public read access on bids"  on public.bids for select using (true);
create policy if not exists "Allow public insert on bids"       on public.bids for insert with check (true);
create policy if not exists "Allow public update on bids"       on public.bids for update using (true);
create policy if not exists "Allow public delete on bids"       on public.bids for delete using (true);
