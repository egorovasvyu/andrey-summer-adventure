create table if not exists public.app_state_documents (
  family_key text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state_documents enable row level security;

drop policy if exists "Family app can read state" on public.app_state_documents;
drop policy if exists "Family app can insert state" on public.app_state_documents;
drop policy if exists "Family app can update state" on public.app_state_documents;

create policy "Family app can read state"
on public.app_state_documents
for select
to anon, authenticated
using (family_key = 'andrey-family');

create policy "Family app can insert state"
on public.app_state_documents
for insert
to anon, authenticated
with check (family_key = 'andrey-family');

create policy "Family app can update state"
on public.app_state_documents
for update
to anon, authenticated
using (family_key = 'andrey-family')
with check (family_key = 'andrey-family');
