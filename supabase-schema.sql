-- FocusQuest Database Schema for Supabase
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Users can only read their own data
create policy "Users can view own data"
  on public.users for select
  using (auth.uid() = id);

-- Users can insert their own data
create policy "Users can insert own data"
  on public.users for insert
  with check (auth.uid() = id);

-- Quests table
create table public.quests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  category text,
  xp_reward integer default 50,
  completed boolean default false,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

alter table public.quests enable row level security;

create policy "Users can view own quests"
  on public.quests for select
  using (auth.uid() = user_id);

create policy "Users can insert own quests"
  on public.quests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quests"
  on public.quests for update
  using (auth.uid() = user_id);

create policy "Users can delete own quests"
  on public.quests for delete
  using (auth.uid() = user_id);

-- User Progress table
create table public.user_progress (
  user_id uuid primary key references public.users(id) on delete cascade,
  level integer default 1,
  xp integer default 0,
  total_quests_completed integer default 0,
  updated_at timestamp with time zone default now()
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Focus Sessions table
create table public.focus_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  duration_minutes integer not null,
  category text,
  created_at timestamp with time zone default now()
);

alter table public.focus_sessions enable row level security;

create policy "Users can view own sessions"
  on public.focus_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.focus_sessions for insert
  with check (auth.uid() = user_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  
  insert into public.user_progress (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
