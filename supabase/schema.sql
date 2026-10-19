-- Snapshot of the database used by TaskFlow AI.
-- Run once in the Supabase SQL Editor of a NEW project. Do not re-run on an existing one.

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 100),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  due_date date,
  created_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks (user_id);

alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
  on public.tasks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own tasks"
  on public.tasks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete to authenticated
  using ((select auth.uid()) = user_id);

create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index ai_requests_user_created_idx
  on public.ai_requests (user_id, created_at desc);

alter table public.ai_requests enable row level security;

create policy "Users can view their own AI requests"
  on public.ai_requests for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can log their own AI requests"
  on public.ai_requests for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- Per-user rate limit: 5 AI summaries per 10 minutes.
-- The advisory lock makes check-then-insert safe when requests arrive together.
create or replace function public.reserve_ai_summary_request()
returns table(allowed boolean)
language plpgsql
set search_path to ''
as $function$
declare
  current_user_id uuid;
  request_count bigint;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(current_user_id::text, 0)
  );

  select count(*)
  into request_count
  from public.ai_requests
  where user_id = current_user_id
    and created_at >= now() - interval '10 minutes';

  if request_count >= 5 then
    return query select false;
    return;
  end if;

  insert into public.ai_requests (user_id)
  values (current_user_id);

  return query select true;
end;
$function$;

revoke execute on function public.reserve_ai_summary_request() from public, anon;
grant execute on function public.reserve_ai_summary_request() to authenticated;