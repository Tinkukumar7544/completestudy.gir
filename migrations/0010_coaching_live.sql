-- Live classes: teacher host goes live immediately, students join by code,
-- one-to-one floor with a timeout (hand-raise audio or a live question).

alter table coaching_disc add column if not exists kind text not null default 'disc';
alter table coaching_disc add column if not exists timeout_sec integer not null default 60;
alter table coaching_disc add column if not exists duration_min integer not null default 45;
alter table coaching_disc add column if not exists floor_player_id text;
alter table coaching_disc add column if not exists floor_until timestamptz;
alter table coaching_disc add column if not exists floor_kind text;

create index if not exists coaching_disc_kind_idx on coaching_disc (kind, started_at);
