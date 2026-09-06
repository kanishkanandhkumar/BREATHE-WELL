create table public.symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  breathlessness smallint not null check (breathlessness between 0 and 5),
  coughing smallint not null check (coughing between 0 and 5),
  wheezing smallint not null check (wheezing between 0 and 5),
  chest_tightness smallint not null check (chest_tightness between 0 and 5),
  peak_flow integer,
  triggers text[] not null default '{}',
  medications text[] not null default '{}',
  notes text check (char_length(notes) <= 2000),
  feeling text,
  created_at timestamptz not null default now()
);

create table public.exercise_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text,
  duration integer not null check (duration >= 0),
  completed boolean not null default false,
  date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.symptoms enable row level security;
alter table public.exercise_sessions enable row level security;

create policy "Users can read their symptoms"
  on public.symptoms for select using (auth.uid() = user_id);
create policy "Users can create their symptoms"
  on public.symptoms for insert with check (auth.uid() = user_id);
create policy "Users can read their exercise sessions"
  on public.exercise_sessions for select using (auth.uid() = user_id);
create policy "Users can create their exercise sessions"
  on public.exercise_sessions for insert with check (auth.uid() = user_id);

create index symptoms_user_date_idx on public.symptoms(user_id, date desc);
create index exercise_sessions_user_date_idx on public.exercise_sessions(user_id, date desc);
