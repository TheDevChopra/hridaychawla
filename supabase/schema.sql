-- Phase 9: Admin & Database Schemas for Hriday Chawla Personality Hub

-- 1. Profiles Table (Extended user data)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text not null,
  bio text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Settings Table (User preferences)
create table public.settings (
  id uuid references auth.users on delete cascade not null primary key,
  theme text default 'attack-titan' not null,
  push_notifications boolean default true not null
);

-- 3. Games Table (Gaming Hub)
create table public.games (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  genre text[],
  rating numeric(3,1),
  category text not null -- e.g., 'favorite', 'action', 'anime', 'adventure'
);

-- 4. Anime Table (Anime Hub)
create table public.anime (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  tags text[],
  rating numeric(3,1),
  status text default 'plan_to_watch' -- e.g., 'completed', 'watching'
);

-- 5. Playlists Table (Playlist Manager)
create table public.playlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Songs Table
create table public.songs (
  id uuid default gen_random_uuid() primary key,
  playlist_id uuid references public.playlists on delete cascade not null,
  title text not null,
  artist text
);

-- 7. Vault Entries Table (Password Manager)
-- IMPORTANT: 'encrypted_data' must be encrypted client-side using AES-256 before insertion.
create table public.vault_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  username text not null,
  encrypted_data text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.playlists enable row level security;
alter table public.songs enable row level security;
alter table public.vault_entries enable row level security;

-- Policies
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can manage their own settings" on public.settings for all using (auth.uid() = id);
create policy "Users can manage their own playlists" on public.playlists for all using (auth.uid() = user_id);
create policy "Users can manage their own vault" on public.vault_entries for all using (auth.uid() = user_id);
