-- Live-test lobby: shared timer, ready-up, chat, and leave/end.
-- Access is still the unguessable room code. Cap 20 is enforced in the
-- server function, not here.
alter table quiz_rooms add column if not exists time_limit_sec integer not null default 0;
alter table quiz_rooms add column if not exists started_at timestamptz;
alter table quiz_rooms add column if not exists ended_at timestamptz;

alter table quiz_players add column if not exists ready_at timestamptz;
alter table quiz_players add column if not exists left_at timestamptz;

create table if not exists quiz_messages (
  id         text primary key,
  room_code  text not null references quiz_rooms (code) on delete cascade,
  player_id  text not null,
  name       text not null,
  body       text not null,
  sent_at    timestamptz not null default now()
);

create index if not exists quiz_messages_room_idx on quiz_messages (room_code, sent_at);
