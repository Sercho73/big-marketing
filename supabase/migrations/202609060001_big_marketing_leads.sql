-- Big Marketing: contacts are private. Only the server may call this function.
create table if not exists public.big_marketing_leads (
  id uuid primary key,
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  company text not null check (char_length(company) between 2 and 160),
  service text not null check (service in ('publicaciones','chatbot','captacion','creatividad','automatizacion','analitica','estrategia')),
  message text not null check (char_length(message) between 10 and 3000),
  consent boolean not null check (consent = true),
  privacy_version text not null default '2026-09-06',
  created_at timestamptz not null default now()
);
alter table public.big_marketing_leads enable row level security;
revoke all on public.big_marketing_leads from anon, authenticated;
create index if not exists big_marketing_leads_email_created_idx on public.big_marketing_leads (email, created_at desc);

create or replace function public.submit_marketing_lead(p_lead jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_lead->>'email'));
  v_id uuid := (p_lead->>'requestId')::uuid;
  v_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(v_email, 0));
  if exists (select 1 from public.big_marketing_leads where id=v_id and email=v_email) then
    return jsonb_build_object('ok',true);
  end if;
  select count(*) into v_count from public.big_marketing_leads where email=v_email and created_at > now()-interval '1 hour';
  if v_count >= 3 then return jsonb_build_object('ok',false,'rateLimited',true); end if;
  insert into public.big_marketing_leads(id,name,email,company,service,message,consent)
  values(v_id,trim(p_lead->>'name'),v_email,trim(p_lead->>'company'),p_lead->>'service',trim(p_lead->>'message'),(p_lead->>'consent')::boolean);
  return jsonb_build_object('ok',true);
end;
$$;
revoke all on function public.submit_marketing_lead(jsonb) from public, anon, authenticated;
grant execute on function public.submit_marketing_lead(jsonb) to service_role;
