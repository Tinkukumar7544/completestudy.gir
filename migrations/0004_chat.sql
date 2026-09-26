-- 1-1 chat rooms. Access is the unguessable room code, not a user id —
-- friends can join without signing in. Cap 2 is enforced in the server
-- function, not here.
create table if not exists chat_rooms (
  code       text primary key,
  title      text not null,
  host_id    text not null,
  created_at timestamptz not null default now()
);

create table if not exists chat_members (
  room_code  text not null references chat_rooms (code) on delete cascade,
  player_id  text not null,
  name       text not null,
  joined_at  timestamptz not null default now(),
  primary key (room_code, player_id)
);

create table if not exists chat_messages (
  id         text primary key,
  room_code  text not null references chat_rooms (code) on delete cascade,
  player_id  text not null,
  name       text not null,
  body       text not null,
  sent_at    timestamptz not null default now()
);

create index if not exists chat_members_room_idx on chat_members (room_code);
create index if not exists chat_messages_room_idx on chat_messages (room_code, sent_at);
