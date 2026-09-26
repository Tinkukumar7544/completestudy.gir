-- Coaching group discussions: topic rooms, connect-then-start, chat, hands.
-- Access is the unguessable room code. Cap 20 is enforced in the server function.

create table if not exists coaching_disc (
  code         text primary key,
  host_id      text not null,
  title        text not null,
  prompt       text not null default '',
  mode         text not null default 'video',
  max_players  integer not null default 20,
  created_at   timestamptz not null default now(),
  started_at   timestamptz,
  ended_at     timestamptz
);

create table if not exists coaching_disc_players (
  code        text not null references coaching_disc (code) on delete cascade,
  player_id   text not null,
  name        text not null,
  joined_at   timestamptz not null default now(),
  ready_at    timestamptz,
  left_at     timestamptz,
  hand_at     timestamptz,
  primary key (code, player_id)
);

create table if not exists coaching_disc_messages (
  id         text primary key,
  code       text not null references coaching_disc (code) on delete cascade,
  player_id  text not null,
  name       text not null,
  kind       text not null default 'chat',
  body       text not null,
  sent_at    timestamptz not null default now()
);

create index if not exists coaching_disc_messages_code_idx on coaching_disc_messages (code, sent_at);
