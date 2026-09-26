-- Target Exam Ludo rooms. Access is the unguessable room code, not a user id.
-- Cap 4 is enforced in the server function, not here.
create table if not exists ludo_rooms (
  code       text primary key,
  title      text not null,
  host_id    text not null,
  board      jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists ludo_students (
  room_code  text not null references ludo_rooms (code) on delete cascade,
  player_id  text not null,
  name       text not null,
  color      text not null,
  joined_at  timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (room_code, player_id)
);

create index if not exists ludo_students_room_idx on ludo_students (room_code);
