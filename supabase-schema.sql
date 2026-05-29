-- Supabase schema for "99 ночей в лесу: Лето Андрея".
-- Main idea:
-- 1. Current editable cards live in their own tables.
-- 2. Every completed/undone/spent action is also written to day_actions.
-- 3. Day summary and all-time summary are calculated from day_actions.

create extension if not exists pgcrypto;

create table if not exists family_profiles (
  id uuid primary key default gen_random_uuid(),
  child_name text not null default 'Андрей',
  adventure_title text not null default '99 ночей в лесу',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  daily_goal integer not null default 40,
  soft_mode boolean not null default true,
  reading_goal_books integer not null default 6,
  reading_goal_pages integer not null default 1200,
  discovery_goal_items integer not null default 20,
  parent_comment text,
  updated_at timestamptz not null default now()
);

create table if not exists adventure_state (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  total_diamonds integer not null default 0,
  today_diamonds integer not null default 0,
  current_night integer not null default 1,
  survived_nights integer not null default 0,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  manual_survived boolean not null default false,
  day_not_counted boolean not null default false,
  returned_to_trail boolean not null default false,
  selected_calendar_date date,
  updated_at timestamptz not null default now()
);

create table if not exists day_statuses (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  status_date date not null,
  night_number integer,
  status text not null default 'planned',
  diamonds integer not null default 0,
  survived boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (family_id, status_date)
);

create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  event_date date not null,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists daily_missions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  mission_key text not null,
  title text not null,
  icon text,
  diamonds integer not null default 0,
  done_date date not null default current_date,
  done boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (family_id, mission_key, done_date)
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  author text,
  pages integer not null default 0,
  status text not null default 'читаю',
  start_date date,
  end_date date,
  diary_done boolean not null default false,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  name text not null,
  goal text,
  practice_done boolean not null default false,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists hard_things (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  effort_done boolean not null default false,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists home_tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  diamonds integer not null default 5,
  done_today boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists discovery_sources (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists discoveries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  source_id uuid references discovery_sources(id) on delete set null,
  source_text text,
  type text not null default 'видео',
  status text not null default 'запланировано',
  insight text,
  insight_recorded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  cost integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists reward_history (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  reward_id uuid references rewards(id) on delete set null,
  reward_title text not null,
  cost integer not null,
  returned boolean not null default false,
  redeemed_at timestamptz not null default now(),
  returned_at timestamptz
);

create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  opened_at timestamptz not null default now(),
  unique (family_id, title)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  title text not null,
  description text,
  why text,
  status text,
  next_step text,
  final_demo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists project_steps (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- This is the most important table for history, "Итог дня", and "Итог за всё время".
-- Every button press that changes progress should create or update a row here.
create table if not exists day_actions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  action_date date not null,
  action_type text not null,
  title text not null,
  entity_table text,
  entity_id uuid,
  diamonds integer not null default 0,
  counts_for_daily_goal boolean not null default true,
  undone boolean not null default false,
  undone_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Optional safety net: full JSON snapshots before/after bigger changes.
-- Useful while the app is still a prototype.
create table if not exists state_snapshots (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references family_profiles(id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

-- Practical sync table for the prototype.
-- It stores the full app state as one JSON document, so every field is preserved:
-- calendar, parent settings, current day, missions, books, skills, rewards, and UI state.
create table if not exists app_state_documents (
  family_key text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table app_state_documents enable row level security;

drop policy if exists "Family app can read state" on app_state_documents;
drop policy if exists "Family app can insert state" on app_state_documents;
drop policy if exists "Family app can update state" on app_state_documents;

create policy "Family app can read state"
on app_state_documents
for select
to anon, authenticated
using (family_key = 'andrey-family');

create policy "Family app can insert state"
on app_state_documents
for insert
to anon, authenticated
with check (family_key = 'andrey-family');

create policy "Family app can update state"
on app_state_documents
for update
to anon, authenticated
using (family_key = 'andrey-family')
with check (family_key = 'andrey-family');

create index if not exists idx_day_actions_family_date on day_actions(family_id, action_date);
create index if not exists idx_day_actions_type on day_actions(action_type);
create index if not exists idx_calendar_events_family_date on calendar_events(family_id, event_date) where deleted_at is null;
create index if not exists idx_books_family_active on books(family_id) where deleted_at is null;
create index if not exists idx_skills_family_active on skills(family_id) where deleted_at is null;
create index if not exists idx_hard_things_family_active on hard_things(family_id) where deleted_at is null;
create index if not exists idx_home_tasks_family_active on home_tasks(family_id) where deleted_at is null;
create index if not exists idx_discoveries_family_active on discoveries(family_id) where deleted_at is null;
create index if not exists idx_rewards_family_active on rewards(family_id) where deleted_at is null;
