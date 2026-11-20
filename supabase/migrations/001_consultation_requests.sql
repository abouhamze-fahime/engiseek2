-- Run in your Supabase SQL Editor once you create the project.
create table if not exists public.consultation_requests (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 120),
  role text not null check (char_length(role) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) between 6 and 40),
  interest text not null check (interest in ('Asset inspection','Bridge inspection','Aerodrome compliance','Electrical inspection','AI-powered forecasts','Data integration','Lab 55000','Airspace Lab','Aerowash','L33T','EngiFlow','Not sure yet')),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed','not_configured'))
);
create index if not exists consultation_requests_created_at_idx on public.consultation_requests(created_at desc);
alter table public.consultation_requests enable row level security;
-- Visitors cannot read, insert, update or delete request records directly.
-- Only the server-side service role writes after validation.
revoke all on public.consultation_requests from anon, authenticated;
grant select, insert, update on public.consultation_requests to service_role;
comment on table public.consultation_requests is 'Private consultation enquiries. Access through the validated server route only.';
