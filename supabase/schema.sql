-- MOTION — Supabase schema. Run in Supabase Dashboard > SQL Editor.
-- Public can READ the storefront. Only users listed in admin_users can WRITE.

create table if not exists categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  sort_order int default 0
);

create table if not exists collections (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  description text default '',
  cover_image text default '',
  sort_order int default 0
);

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric not null check (price >= 0),
  category_id text references categories(id) on delete set null,
  images text[] default '{}',
  sizes text[] default '{}',
  colors jsonb default '[]',
  stock int default 0 check (stock >= 0),
  is_new boolean default false,
  collection_ids text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists site_content (
  key text primary key,
  value jsonb not null
);

create table if not exists newsletter_subscribers (
  email text primary key,
  created_at timestamptz default now()
);

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- helper
create or replace function is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

alter table categories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table site_content enable row level security;
alter table newsletter_subscribers enable row level security;
alter table admin_users enable row level security;

-- public read
create policy "public read categories" on categories for select using (true);
create policy "public read collections" on collections for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read content" on site_content for select using (true);

-- admin write
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());
create policy "admin write collections" on collections for all using (is_admin()) with check (is_admin());
create policy "admin write products" on products for all using (is_admin()) with check (is_admin());
create policy "admin write content" on site_content for all using (is_admin()) with check (is_admin());

-- newsletter: anyone can subscribe, only admin can read
create policy "anyone subscribe" on newsletter_subscribers for insert with check (true);
create policy "admin read subscribers" on newsletter_subscribers for select using (is_admin());

-- admin_users: a user may only see their own row (used for the admin check)
create policy "read own admin row" on admin_users for select using (user_id = auth.uid());

-- storage bucket for images
insert into storage.buckets (id, name, public) values ('motion-media', 'motion-media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'motion-media');
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'motion-media' and is_admin());
create policy "admin update media" on storage.objects for update using (bucket_id = 'motion-media' and is_admin());
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'motion-media' and is_admin());

-- ---------------------------------------------------------------
-- CREATE YOUR ADMIN:
-- 1. Supabase > Authentication > Users > Add user (email + password).
-- 2. Run (replace email):
--    insert into admin_users (user_id) select id from auth.users where email = 'you@example.com';
-- ---------------------------------------------------------------

