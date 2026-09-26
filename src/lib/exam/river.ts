import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { journeyProgress, normalizeJourney, type TargetJourney } from "./types";

export const MAX_RIVER_STUDENTS = 20;

export type RiverStudent = {
  playerId: string;
  name: string;
  hue: number;
  progress: number;
  doneIds: string[];
  joinedAt: string;
};

export type RiverRoom = {
  code: string;
  title: string;
  hostId: string;
  journey: TargetJourney;
  students: RiverStudent[];
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]!;
  return out;
}

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function iso(value: string | Date): string {
  return typeof value === "string" ? value : new Date(value).toISOString();
}

function asDoneIds(raw: unknown): string[] {
  const list = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
  if (!Array.isArray(list)) return [];
  return list.map((id) => String(id)).filter(Boolean).slice(0, 40);
}

function asJourney(raw: unknown): TargetJourney {
  const data = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
  return normalizeJourney(data);
}

async function loadRoom(code: string): Promise<RiverRoom> {
  const sql = await getSql();
  const rooms = await sql<{ code: string; title: string; host_id: string; journey: unknown }>`
    select code, title, host_id, journey from river_rooms where code = ${code} limit 1
  `;
  const room = rooms[0];
  if (!room) throw new Error("No river with that code");
  const journey = asJourney(room.journey);
  const rows = await sql<{
    player_id: string;
    name: string;
    hue: number;
    progress: number;
    done_ids: unknown;
    joined_at: string | Date;
  }>`
    select player_id, name, hue, progress, done_ids, joined_at
    from river_students where room_code = ${code} order by joined_at
  `;
  return {
    code: room.code,
    title: room.title,
    hostId: room.host_id,
    journey,
    students: rows.map((r) => {
      const doneIds = asDoneIds(r.done_ids);
      return {
        playerId: r.player_id,
        name: r.name,
        hue: Number(r.hue) || 0,
        progress: journeyProgress(journey.nodes, doneIds),
        doneIds,
        joinedAt: iso(r.joined_at),
      };
    }),
  };
}

export const createRiver = createServerFn({ method: "POST" })
  .validator((data: { title: string; hostId: string; hostName: string; journey: unknown }) => {
    const title = String(data.title || "Class river").trim().slice(0, 120) || "Class river";
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
    if (!hostId) throw new Error("Missing student");
    return { title, hostId, hostName, journey: normalizeJourney(data.journey) };
  })
  .handler(async ({ data }): Promise<RiverRoom> => {
    const sql = await getSql();
    let code = makeCode();
    for (let i = 0; i < 8; i++) {
      const exists = await sql<{ code: string }>`select code from river_rooms where code = ${code} limit 1`;
      if (!exists[0]) break;
      code = makeCode();
    }
    const raw = JSON.stringify(data.journey);
    await sql`
      insert into river_rooms (code, title, host_id, journey)
      values (${code}, ${data.title}, ${data.hostId}, cast(${raw} as jsonb))
    `;
    const doneIds = data.journey.nodes.filter((n) => n.done).map((n) => n.id);
    const doneRaw = JSON.stringify(doneIds);
    const progress = journeyProgress(data.journey.nodes, doneIds);
    await sql`
      insert into river_students (room_code, player_id, name, hue, progress, done_ids)
      values (${code}, ${data.hostId}, ${data.hostName}, 0, ${progress}, cast(${doneRaw} as jsonb))
    `;
    return {
      code,
      title: data.title,
      hostId: data.hostId,
      journey: data.journey,
      students: [
        {
          playerId: data.hostId,
          name: data.hostName,
          hue: 0,
          progress,
          doneIds,
          joinedAt: new Date().toISOString(),
        },
      ],
    };
  });

export const joinRiver = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
    if (code.length < 4) throw new Error("Enter a valid river code");
    if (!playerId) throw new Error("Missing student");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<RiverRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ code: string }>`select code from river_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No river with that code");
    const existing = await sql<{ player_id: string }>`
      select player_id from river_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!existing[0]) {
      const counts = await sql<{ n: number }>`select count(*)::int as n from river_students where room_code = ${data.code}`;
      if ((counts[0]?.n ?? 0) >= MAX_RIVER_STUDENTS) {
        throw new Error(`This river is full (${MAX_RIVER_STUDENTS} students)`);
      }
      const hues = await sql<{ hue: number }>`select hue from river_students where room_code = ${data.code}`;
      const used = new Set(hues.map((h) => Number(h.hue)));
      let hue = 0;
      while (used.has(hue) && hue < MAX_RIVER_STUDENTS) hue += 1;
      await sql`
        insert into river_students (room_code, player_id, name, hue)
        values (${data.code}, ${data.playerId}, ${data.name}, ${hue})
      `;
    } else {
      await sql`
        update river_students set name = ${data.name}, updated_at = now()
        where room_code = ${data.code} and player_id = ${data.playerId}
      `;
    }
    return loadRoom(data.code);
  });

export const listRiver = createServerFn({ method: "GET" })
  .validator((code: string) => {
    const v = normalizeCode(code);
    if (v.length < 4) throw new Error("Enter a valid river code");
    return v;
  })
  .handler(async ({ data: code }): Promise<RiverRoom> => loadRoom(code));

export const pushRiverJourney = createServerFn({ method: "POST" })
  .validator((data: { code: string; hostId: string; journey: unknown }) => {
    const code = normalizeCode(data.code);
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid river code");
    if (!hostId) throw new Error("Missing host");
    return { code, hostId, journey: normalizeJourney(data.journey) };
  })
  .handler(async ({ data }): Promise<RiverRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ host_id: string }>`select host_id from river_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No river with that code");
    if (rooms[0].host_id !== data.hostId) throw new Error("Only the host can change this river");
    const raw = JSON.stringify(data.journey);
    await sql`update river_rooms set journey = cast(${raw} as jsonb) where code = ${data.code}`;
    return loadRoom(data.code);
  });

export const pushRiverProgress = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string; doneIds: string[] }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
    if (code.length < 4) throw new Error("Enter a valid river code");
    if (!playerId) throw new Error("Missing student");
    const doneIds = Array.isArray(data.doneIds) ? data.doneIds.map(String).filter(Boolean).slice(0, 40) : [];
    return { code, playerId, name, doneIds };
  })
  .handler(async ({ data }): Promise<RiverRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ journey: unknown }>`select journey from river_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No river with that code");
    const journey = asJourney(rooms[0].journey);
    const progress = journeyProgress(journey.nodes, data.doneIds);
    const doneRaw = JSON.stringify(data.doneIds);
    const existing = await sql<{ player_id: string }>`
      select player_id from river_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!existing[0]) throw new Error("Join this river first");
    await sql`
      update river_students
      set name = ${data.name}, progress = ${progress}, done_ids = cast(${doneRaw} as jsonb), updated_at = now()
      where room_code = ${data.code} and player_id = ${data.playerId}
    `;
    return loadRoom(data.code);
  });
