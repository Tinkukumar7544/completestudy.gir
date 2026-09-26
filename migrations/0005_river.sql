-- Target Exam river rooms. Access is the unguessable room code, not a user id —
-- classmates can float on the same river without signing in. Cap 20 is enforced
-- in the server function, not here.
create table if not exists river_rooms (
  code       text primary key,
  title      text not null,
  host_id    text not null,
  journey    jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists river_students (
  room_code  text not null references river_rooms (code) on delete cascade,
  player_id  text not null,
  name       text not null,
  hue        integer not null default 0,
  progress   real not null default 0,
  done_ids   jsonb not null default '[]'::jsonb,
  joined_at  timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (room_code, player_id)
);

create index if not exists river_students_room_idx on river_students (room_code);
