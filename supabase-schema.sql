create table if not exists day_actions (
  id uuid primary key default gen_random_uuid(),
  action_date date not null,
  action_type text not null,
  title text not null,
  diamonds integer not null default 0,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists day_statuses (
  id uuid primary key default gen_random_uuid(),
  status_date date not null unique,
  status text not null default 'planned',
  diamonds integer not null default 0,
  survived boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  pages integer not null default 0,
  status text not null default 'читаю',
  start_date date,
  end_date date,
  diary_done boolean not null default false,
  completed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text,
  practice_done boolean not null default false,
  completed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists hard_things (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  effort_done boolean not null default false,
  completed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists home_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  diamonds integer not null default 5,
  done_today boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists discoveries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  type text not null default 'видео',
  status text not null default 'запланировано',
  insight text,
  insight_recorded boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cost integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists reward_history (
  id uuid primary key default gen_random_uuid(),
  reward_title text not null,
  cost integer not null,
  returned boolean not null default false,
  created_at timestamptz not null default now()
);
