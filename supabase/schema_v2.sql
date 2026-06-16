-- Unified Hub Items Table (Powers Gaming, Anime, Marvel, and Football)
create table public.hub_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  hub text not null,      -- 'gaming', 'anime', 'marvel', 'football'
  section text not null,  -- 'favorites', 'characters', 'mcuEras', etc.
  title text not null,
  subtitle text,
  tags text[],
  rating numeric(3,1),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hub_items enable row level security;
create policy "Users manage their own hub items" on public.hub_items for all using (auth.uid() = user_id);

-- Storage Bucket for Uploads (Cards and Profiles)
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true) on conflict do nothing;

create policy "Uploads are publicly accessible" on storage.objects for select using ( bucket_id = 'uploads' );
create policy "Users can upload their own files" on storage.objects for insert with check ( bucket_id = 'uploads' and auth.uid() = owner );
create policy "Users can update their own files" on storage.objects for update using ( bucket_id = 'uploads' and auth.uid() = owner );
create policy "Users can delete their own files" on storage.objects for delete using ( bucket_id = 'uploads' and auth.uid() = owner );
