import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { LUDO_COLORS, MAX_LUDO_STUDENTS, normalizeLudo, type LudoBoard, type LudoColor } from "./types";

export { MAX_LUDO_STUDENTS };

export type LudoStudent = {
  playerId: string;
  name: string;
  color: LudoColor;
  joinedAt: string;
};

export type LudoRoom = {
  code: string;
  title: string;
  hostId: string;
  board: LudoBoard;
  students: LudoStudent[];
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

function asColor(raw: unknown): LudoColor {
  return LUDO_COLORS.includes(raw as LudoColor) ? (raw as LudoColor) : "red";
}

function asBoard(raw: unknown): LudoBoard {
  const data = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
  return normalizeLudo(data);
}

async function loadRoom(code: string): Promise<LudoRoom> {
  const sql = await getSql();
  const rooms = await sql<{ code: string; title: string; host_id: string; board: unknown }>`
    select code, title, host_id, board from ludo_rooms where code = ${code} limit 1
  `;
  const room = rooms[0];
  if (!room) throw new Error("No Ludo board with that code");
  const board = asBoard(room.board);
  const rows = await sql<{
    player_id: string;
    name: string;
    color: string;
    joined_at: string | Date;
  }>`
    select player_id, name, color, joined_at
    from ludo_students where room_code = ${code} order by joined_at
  `;
  return {
    code: room.code,
    title: room.title,
    hostId: room.host_id,
    board,
    students: rows.map((r) => ({
      playerId: r.player_id,
      name: r.name,
      color: asColor(r.color),
      joinedAt: iso(r.joined_at),
    })),
  };
}

function nextFreeColor(used: Set<LudoColor>, prefer?: LudoColor): LudoColor {
  if (prefer && !used.has(prefer)) return prefer;
  return LUDO_COLORS.find((c) => !used.has(c)) ?? "red";
}

export const createLudo = createServerFn({ method: "POST" })
  .validator((data: { title: string; hostId: string; hostName: string; board: unknown }) => {
    const title = String(data.title || "Ludo target").trim().slice(0, 120) || "Ludo target";
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
    if (!hostId) throw new Error("Missing student");
    return { title, hostId, hostName, board: normalizeLudo(data.board) };
  })
  .handler(async ({ data }): Promise<LudoRoom> => {
    const sql = await getSql();
    let code = makeCode();
    for (let i = 0; i < 8; i++) {
      const exists = await sql<{ code: string }>`select code from ludo_rooms where code = ${code} limit 1`;
      if (!exists[0]) break;
      code = makeCode();
    }
    const color = data.board.playerColor;
    const columns = data.board.columns.map((c) =>
      c.color === color ? { ...c, studentName: data.hostName } : c,
    );
    const board = { ...data.board, columns };
    const raw = JSON.stringify(board);
    await sql`
      insert into ludo_rooms (code, title, host_id, board)
      values (${code}, ${data.title}, ${data.hostId}, cast(${raw} as jsonb))
    `;
    await sql`
      insert into ludo_students (room_code, player_id, name, color)
      values (${code}, ${data.hostId}, ${data.hostName}, ${color})
    `;
    return {
      code,
      title: data.title,
      hostId: data.hostId,
      board,
      students: [
        {
          playerId: data.hostId,
          name: data.hostName,
          color,
          joinedAt: new Date().toISOString(),
        },
      ],
    };
  });

export const joinLudo = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
    if (code.length < 4) throw new Error("Enter a valid Ludo code");
    if (!playerId) throw new Error("Missing student");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<LudoRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ board: unknown }>`select board from ludo_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No Ludo board with that code");
    const existing = await sql<{ player_id: string; color: string }>`
      select player_id, color from ludo_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!existing[0]) {
      const counts = await sql<{ n: number }>`select count(*)::int as n from ludo_students where room_code = ${data.code}`;
      if ((counts[0]?.n ?? 0) >= MAX_LUDO_STUDENTS) {
        throw new Error(`This board is full (${MAX_LUDO_STUDENTS} students)`);
      }
      const taken = await sql<{ color: string }>`select color from ludo_students where room_code = ${data.code}`;
      const used = new Set(taken.map((r) => asColor(r.color)));
      const color = nextFreeColor(used);
      await sql`
        insert into ludo_students (room_code, player_id, name, color)
        values (${data.code}, ${data.playerId}, ${data.name}, ${color})
      `;
      const board = asBoard(rooms[0].board);
      const next = {
        ...board,
        columns: board.columns.map((c) => (c.color === color ? { ...c, studentName: data.name } : c)),
      };
      const raw = JSON.stringify(next);
      await sql`update ludo_rooms set board = cast(${raw} as jsonb) where code = ${data.code}`;
    } else {
      await sql`
        update ludo_students set name = ${data.name}, updated_at = now()
        where room_code = ${data.code} and player_id = ${data.playerId}
      `;
    }
    return loadRoom(data.code);
  });

export const listLudo = createServerFn({ method: "GET" })
  .validator((code: string) => {
    const v = normalizeCode(code);
    if (v.length < 4) throw new Error("Enter a valid Ludo code");
    return v;
  })
  .handler(async ({ data: code }): Promise<LudoRoom> => loadRoom(code));

export const pushLudoBoard = createServerFn({ method: "POST" })
  .validator((data: { code: string; hostId: string; board: unknown }) => {
    const code = normalizeCode(data.code);
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid Ludo code");
    if (!hostId) throw new Error("Missing host");
    return { code, hostId, board: normalizeLudo(data.board) };
  })
  .handler(async ({ data }): Promise<LudoRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ host_id: string }>`select host_id from ludo_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No Ludo board with that code");
    if (rooms[0].host_id !== data.hostId) throw new Error("Only the host can change this board");
    const raw = JSON.stringify(data.board);
    await sql`update ludo_rooms set board = cast(${raw} as jsonb) where code = ${data.code}`;
    return loadRoom(data.code);
  });

export const pushLudoColumn = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string; board: unknown }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
    if (code.length < 4) throw new Error("Enter a valid Ludo code");
    if (!playerId) throw new Error("Missing student");
    return { code, playerId, name, board: normalizeLudo(data.board) };
  })
  .handler(async ({ data }): Promise<LudoRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ board: unknown; host_id: string }>`
      select board, host_id from ludo_rooms where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No Ludo board with that code");
    const me = await sql<{ color: string }>`
      select color from ludo_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!me[0]) throw new Error("Join this board first");
    const color = asColor(me[0].color);
    const current = asBoard(rooms[0].board);
    const incoming = data.board.columns.find((c) => c.color === color);
    if (!incoming) throw new Error("Missing column");
    const next: LudoBoard = {
      ...current,
      lastPips: data.board.lastPips,
      lastMoveAt: data.board.lastMoveAt,
      columns: current.columns.map((c) => (c.color === color ? { ...incoming, studentName: data.name } : c)),
    };
    const raw = JSON.stringify(next);
    await sql`update ludo_rooms set board = cast(${raw} as jsonb) where code = ${data.code}`;
    await sql`
      update ludo_students set name = ${data.name}, updated_at = now()
      where room_code = ${data.code} and player_id = ${data.playerId}
    `;
    return loadRoom(data.code);
  });
