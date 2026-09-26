-- Friend quiz rooms (Telegram-style). Access is the unguessable room code,
-- not a user id — friends can join without signing in. Cap 100 is enforced
-- in the server function, not here.
create table if not exists quiz_rooms (
  code       text primary key,
  title      text not null,
  host_id    text not null,
  questions  jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_players (
  room_code     text not null references quiz_rooms (code) on delete cascade,
  player_id     text not null,
  name          text not null,
  joined_at     timestamptz not null default now(),
  submitted_at  timestamptz,
  correct       integer,
  wrong         integer,
  not_attempted integer,
  marked        integer,
  total         integer,
  score         integer,
  primary key (room_code, player_id)
);

create index if not exists quiz_players_room_idx on quiz_players (room_code);
