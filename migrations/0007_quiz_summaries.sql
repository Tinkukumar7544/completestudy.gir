-- Live-test extras: test day, folder, section picks on the room;
-- per-player answers, view codes, and swapped summary assignment.
-- Access is still the unguessable room code. Cap 20 is enforced in the
-- server function, not here.
alter table quiz_rooms add column if not exists test_day date;
alter table quiz_rooms add column if not exists folder text not null default '';
alter table quiz_rooms add column if not exists section_picks jsonb;

alter table quiz_players add column if not exists items jsonb;
alter table quiz_players add column if not exists view_code text;
alter table quiz_players add column if not exists assigned_player_id text;
