-- Per-user study collection blob. Identity is the verified session user_id
-- (never a client-sent email). Email is stored only for display on restore.
create table if not exists collections (
  user_id    text primary key,
  email      text not null,
  payload    jsonb not null,
  revision   integer not null default 1,
  updated_at timestamptz not null default now()
);
