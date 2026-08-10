-- {Code}·Desk — Thought (blog) + visitor stats
-- Static-export site with no server, so every write goes through Supabase directly
-- from the browser. There's exactly one admin, so RLS just checks "signed in or not".

create extension if not exists pgcrypto;

create table thoughts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  -- English versions are optional — the site falls back to the Korean
  -- title/body above when a post has no translation yet.
  title_en      text,
  body_en       text,
  thumbnail_url text,
  created_at    timestamptz not null default now()
);
create index thoughts_created_at_idx on thoughts (created_at desc);

create table page_views (
  id          bigint generated always as identity primary key,
  path        text not null,
  -- Full document.referrer URL the visitor arrived from, null for direct/
  -- typed-in visits. Never contains search *keywords* — browsers/search
  -- engines stopped forwarding those over HTTPS years ago; that data only
  -- lives in Google Search Console, not in referrer headers.
  referrer    text,
  visitor_id  uuid not null,
  created_at  timestamptz not null default now()
);
create index page_views_created_at_idx on page_views (created_at desc);
create index page_views_visitor_idx    on page_views (visitor_id);

-- ---------------------------------------------------------------- RLS

alter table thoughts    enable row level security;
alter table page_views  enable row level security;

create policy "anyone can read thoughts" on thoughts
  for select using (true);
create policy "signed-in admin can write thoughts" on thoughts
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "anyone can log a page view" on page_views
  for insert with check (true);
create policy "signed-in admin can read stats" on page_views
  for select using (auth.uid() is not null);

-- ---------------------------------------------------------------- storage
-- Run after creating a public bucket named `thought-photos` (Storage → New bucket).

create policy "public read thought photos" on storage.objects
  for select using (bucket_id = 'thought-photos');
create policy "signed-in admin can upload thought photos" on storage.objects
  for insert with check (bucket_id = 'thought-photos' and auth.uid() is not null);

-- ---------------------------------------------------------------- admin account
-- RLS above only checks "is anyone signed in", since there's exactly one admin.
-- Create that one account by hand in Supabase Studio:
--   Authentication → Users → Add user → email: admin@codedesk-studio.com
--   Set a password that meets your project's minimum length (Studio default
--   is 6 characters — "1234" alone won't pass unless you lower that policy).
-- The site's login form always shows the username as "code"; that's a label
-- only, not part of the credential — the password above is the real secret.
