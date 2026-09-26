import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import {
  MAX_CLASS_PLAYERS,
  MAX_DISC_PLAYERS,
  asDiscKind,
  asDiscMode,
  asFloorKind,
  asRoomKind,
  clampClassTimeout,
  type DiscMode,
  type DiscMsgKind,
  type FloorKind,
  type RoomKind,
} from "./discussion-room.ts";

export {
  MAX_CLASS_PLAYERS,
  MAX_DISC_PLAYERS,
  asDiscMode,
  discModeHint,
  discModeLabel,
  allowsVideo,
  autoMic,
  clampClassTimeout,
  floorRemainingMs,
  formatFloorLeft,
} from "./discussion-room.ts";
export type { DiscMode, DiscMsgKind, FloorKind, RoomKind } from "./discussion-room.ts";

export type DiscPlayer = {
  playerId: string;
  name: string;
  joinedAt: string;
  readyAt: string | null;
  leftAt: string | null;
  handAt: string | null;
};

export type DiscMessage = {
  id: string;
  playerId: string;
  name: string;
  kind: DiscMsgKind;
  body: string;
  sentAt: string;
};

export type DiscRoom = {
  code: string;
  title: string;
  prompt: string;
  mode: DiscMode;
  kind: RoomKind;
  hostId: string;
  maxPlayers: number;
  timeoutSec: number;
  startedAt: string | null;
  endedAt: string | null;
  serverNow: string;
  players: DiscPlayer[];
  messages: DiscMessage[];
  isHost: boolean;
  floorPlayerId: string | null;
  floorKind: FloorKind | null;
  floorUntil: string | null;
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

function asIso(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const t = Date.parse(String(value));
  return Number.isFinite(t) ? new Date(t).toISOString() : String(value);
}

type RoomRow = {
  code: string;
  host_id: string;
  title: string;
  prompt: string;
  mode: string;
  kind: string | null;
  max_players: number | null;
  timeout_sec: number | null;
  started_at: string | Date | null;
  ended_at: string | Date | null;
  floor_player_id: string | null;
  floor_until: string | Date | null;
  floor_kind: string | null;
};

type PlayerRow = {
  player_id: string;
  name: string;
  joined_at: string | Date;
  ready_at: string | Date | null;
  left_at: string | Date | null;
  hand_at: string | Date | null;
};

type MsgRow = {
  id: string;
  player_id: string;
  name: string;
  kind: string;
  body: string;
  sent_at: string | Date;
};

async function maybeStartRoom(sql: Awaited<ReturnType<typeof getSql>>, code: string) {
  const waiting = await sql<{ n: number }>`
    select count(*)::int as n from coaching_disc_players
    where code = ${code} and ready_at is null and left_at is null
  `;
  const present = await sql<{ n: number }>`
    select count(*)::int as n from coaching_disc_players
    where code = ${code} and left_at is null
  `;
  if ((waiting[0]?.n ?? 1) > 0) return;
  if ((present[0]?.n ?? 0) < 1) return;
  await sql`
    update coaching_disc set started_at = coalesce(started_at, now())
    where code = ${code} and ended_at is null
  `;
}

async function expireFloor(sql: Awaited<ReturnType<typeof getSql>>, code: string) {
  await sql`
    update coaching_disc
    set floor_player_id = null, floor_until = null, floor_kind = null
    where code = ${code} and floor_until is not null and floor_until < now()
  `;
}

async function loadRoom(code: string, viewerId?: string): Promise<DiscRoom> {
  const sql = await getSql();
  await expireFloor(sql, code);
  const rooms = await sql<RoomRow>`
    select code, host_id, title, prompt, mode, kind, max_players, timeout_sec, started_at, ended_at,
           floor_player_id, floor_until, floor_kind
    from coaching_disc where code = ${code} limit 1
  `;
  const row = rooms[0];
  if (!row) throw new Error("No room with that code");
  const kind = asRoomKind(row.kind);
  const players = await sql<PlayerRow>`
    select player_id, name, joined_at, ready_at, left_at, hand_at
    from coaching_disc_players where code = ${code} order by joined_at
  `;
  const messages = await sql<MsgRow>`
    select id, player_id, name, kind, body, sent_at
    from coaching_disc_messages where code = ${code} order by sent_at
  `;
  return {
    code: row.code,
    title: row.title,
    prompt: row.prompt ?? "",
    mode: asDiscMode(row.mode),
    kind,
    hostId: row.host_id,
    maxPlayers: kind === "class" ? 0 : Math.min(MAX_DISC_PLAYERS, Math.max(2, Number(row.max_players) || MAX_DISC_PLAYERS)),
    timeoutSec: clampClassTimeout(row.timeout_sec),
    startedAt: asIso(row.started_at),
    endedAt: asIso(row.ended_at),
    serverNow: new Date().toISOString(),
    players: players.map((p) => ({
      playerId: p.player_id,
      name: p.name,
      joinedAt: asIso(p.joined_at) ?? new Date().toISOString(),
      readyAt: asIso(p.ready_at),
      leftAt: asIso(p.left_at),
      handAt: asIso(p.hand_at),
    })),
    messages: messages.map((m) => ({
      id: m.id,
      playerId: m.player_id,
      name: m.name,
      kind: asDiscKind(m.kind),
      body: m.body,
      sentAt: asIso(m.sent_at) ?? new Date().toISOString(),
    })),
    isHost: Boolean(viewerId && viewerId === row.host_id),
    floorPlayerId: row.floor_player_id,
    floorKind: asFloorKind(row.floor_kind),
    floorUntil: asIso(row.floor_until),
  };
}

export const createDiscussion = createServerFn({ method: "POST" })
  .validator((data: { hostId: string; hostName: string; title: string; prompt: string; mode: string }) => {
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    const hostName = String(data.hostName || "You").trim().slice(0, 40) || "You";
    const title = String(data.title || "").trim().slice(0, 80);
    const prompt = String(data.prompt || "").trim().slice(0, 600);
    const mode = asDiscMode(data.mode);
    if (!hostId) throw new Error("Missing player");
    if (!title) throw new Error("Give the topic a title");
    return { hostId, hostName, title, prompt, mode };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    let code = makeCode();
    for (let i = 0; i < 8; i++) {
      const exists = await sql<{ code: string }>`select code from coaching_disc where code = ${code} limit 1`;
      if (!exists[0]) break;
      code = makeCode();
    }
    await sql`
      insert into coaching_disc (code, host_id, title, prompt, mode, max_players, kind)
      values (${code}, ${data.hostId}, ${data.title}, ${data.prompt}, ${data.mode}, ${MAX_DISC_PLAYERS}, ${"disc"})
    `;
    await sql`
      insert into coaching_disc_players (code, player_id, name)
      values (${code}, ${data.hostId}, ${data.hostName})
    `;
    return loadRoom(code, data.hostId);
  });

export const joinDiscussion = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ code: string; started_at: string | Date | null; ended_at: string | Date | null; kind: string | null }>`
      select code, started_at, ended_at, kind from coaching_disc where code = ${data.code} limit 1
    `;
    const room = rooms[0];
    if (!room) throw new Error("No room with that code");
    if (room.ended_at) throw new Error("This room has ended");
    const kind = asRoomKind(room.kind);
    const cap = kind === "class" ? MAX_CLASS_PLAYERS : MAX_DISC_PLAYERS;
    const existing = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!existing[0]) {
      if (room.started_at && kind !== "class") throw new Error("This discussion has already started");
      if (kind !== "class") {
        const counts = await sql<{ n: number }>`
          select count(*)::int as n from coaching_disc_players where code = ${data.code} and left_at is null
        `;
        if ((counts[0]?.n ?? 0) >= MAX_DISC_PLAYERS) {
          throw new Error(`This discussion is full (${MAX_DISC_PLAYERS})`);
        }
      }
      await sql`
        insert into coaching_disc_players (code, player_id, name)
        values (${data.code}, ${data.playerId}, ${data.name})
      `;
    } else {
      if (existing[0].left_at && room.started_at && kind !== "class") throw new Error("You already left this discussion");
      await sql`
        update coaching_disc_players set name = ${data.name}, left_at = null
        where code = ${data.code} and player_id = ${data.playerId}
      `;
    }
    return loadRoom(data.code, data.playerId);
  });

export const listDiscussion = createServerFn({ method: "GET" })
  .validator((data: { code: string; playerId?: string } | string) => {
    if (typeof data === "string") {
      const code = normalizeCode(data);
      if (code.length < 4) throw new Error("Enter a valid room code");
      return { code, playerId: "" };
    }
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid room code");
    return { code, playerId };
  })
  .handler(async ({ data }): Promise<DiscRoom> => loadRoom(data.code, data.playerId || undefined));

export const readyDiscussion = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ ended_at: string | Date | null }>`
      select ended_at from coaching_disc where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No discussion with that code");
    if (rooms[0].ended_at) throw new Error("This discussion has ended");
    const mine = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!mine[0] || mine[0].left_at) throw new Error("Join this discussion first");
    await sql`
      update coaching_disc_players set name = ${data.name}, ready_at = coalesce(ready_at, now())
      where code = ${data.code} and player_id = ${data.playerId} and left_at is null
    `;
    await maybeStartRoom(sql, data.code);
    return loadRoom(data.code, data.playerId);
  });

export const sendDiscussionChat = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string; body: string; kind?: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    const body = String(data.body || "").trim().slice(0, 400);
    const kind = asDiscKind(data.kind);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    if (!body) throw new Error("Write a message");
    return { code, playerId, name, body, kind };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const mine = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!mine[0] || mine[0].left_at) throw new Error("Join this discussion first");
    const id = `${Date.now().toString(36)}-${makeCode()}`;
    await sql`
      insert into coaching_disc_messages (id, code, player_id, name, kind, body)
      values (${id}, ${data.code}, ${data.playerId}, ${data.name}, ${data.kind}, ${data.body})
    `;
    return loadRoom(data.code, data.playerId);
  });

export const raiseDiscussionHand = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; on: boolean }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, on: Boolean(data.on) };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const mine = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!mine[0] || mine[0].left_at) throw new Error("Join this discussion first");
    if (data.on) {
      await sql`
        update coaching_disc_players set hand_at = coalesce(hand_at, now())
        where code = ${data.code} and player_id = ${data.playerId}
      `;
    } else {
      await sql`
        update coaching_disc_players set hand_at = null
        where code = ${data.code} and player_id = ${data.playerId}
      `;
    }
    return loadRoom(data.code, data.playerId);
  });

export const leaveDiscussion = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const sql = await getSql();
    const rooms = await sql<{ started_at: string | Date | null; ended_at: string | Date | null; host_id: string; kind: string | null; floor_player_id: string | null }>`
      select started_at, ended_at, host_id, kind, floor_player_id from coaching_disc where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No room with that code");
    await sql`
      update coaching_disc_players set left_at = coalesce(left_at, now()), hand_at = null
      where code = ${data.code} and player_id = ${data.playerId}
    `;
    if (rooms[0].floor_player_id === data.playerId) {
      await sql`
        update coaching_disc
        set floor_player_id = null, floor_until = null, floor_kind = null
        where code = ${data.code}
      `;
    }
    if (rooms[0].host_id === data.playerId && asRoomKind(rooms[0].kind) === "class") {
      await sql`update coaching_disc set ended_at = coalesce(ended_at, now()) where code = ${data.code}`;
    } else if (!rooms[0].started_at) {
      await maybeStartRoom(sql, data.code);
    }
    return { ok: true };
  });

export const endDiscussion = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ host_id: string }>`
      select host_id from coaching_disc where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No room with that code");
    if (rooms[0].host_id !== data.playerId) throw new Error("Only the host can end this");
    await sql`
      update coaching_disc set ended_at = coalesce(ended_at, now()),
        floor_player_id = null, floor_until = null, floor_kind = null
      where code = ${data.code}
    `;
    return loadRoom(data.code, data.playerId);
  });

async function allocateCode(sql: Awaited<ReturnType<typeof getSql>>): Promise<string> {
  let code = makeCode();
  for (let i = 0; i < 8; i++) {
    const exists = await sql<{ code: string }>`select code from coaching_disc where code = ${code} limit 1`;
    if (!exists[0]) break;
    code = makeCode();
  }
  return code;
}

export const createLiveClass = createServerFn({ method: "POST" })
  .validator((data: { hostId: string; hostName: string; title: string; subject?: string; mode?: string; durationMin?: number; timeoutSec?: number }) => {
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    const hostName = String(data.hostName || "Teacher").trim().slice(0, 40) || "Teacher";
    const title = String(data.title || "").trim().slice(0, 80);
    const subject = String(data.subject || "").trim().slice(0, 80);
    const mode = asDiscMode(data.mode);
    const durationMin = Math.max(1, Math.min(240, Math.floor(Number(data.durationMin) || 45)));
    const timeoutSec = clampClassTimeout(data.timeoutSec);
    if (!hostId) throw new Error("Missing player");
    if (!title) throw new Error("Give the class a title");
    return { hostId, hostName, title, subject, mode, durationMin, timeoutSec };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const code = await allocateCode(sql);
    await sql`
      insert into coaching_disc (code, host_id, title, prompt, mode, max_players, kind, timeout_sec, duration_min, started_at)
      values (${code}, ${data.hostId}, ${data.title}, ${data.subject}, ${data.mode}, ${MAX_CLASS_PLAYERS}, ${"class"}, ${data.timeoutSec}, ${data.durationMin}, now())
    `;
    await sql`
      insert into coaching_disc_players (code, player_id, name, ready_at)
      values (${code}, ${data.hostId}, ${data.hostName}, now())
    `;
    return loadRoom(code, data.hostId);
  });

export const grantFloor = createServerFn({ method: "POST" })
  .validator((data: { code: string; hostId: string; playerId: string; kind?: string }) => {
    const code = normalizeCode(data.code);
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const kind = asFloorKind(data.kind) ?? "audio";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!hostId || !playerId) throw new Error("Missing player");
    return { code, hostId, playerId, kind };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ host_id: string; ended_at: string | Date | null; timeout_sec: number | null }>`
      select host_id, ended_at, timeout_sec from coaching_disc where code = ${data.code} limit 1
    `;
    const row = rooms[0];
    if (!row) throw new Error("No room with that code");
    if (row.ended_at) throw new Error("This class has ended");
    if (row.host_id !== data.hostId) throw new Error("Only the teacher can open a one-to-one");
    if (data.playerId === row.host_id) throw new Error("Pick a student");
    const student = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!student[0] || student[0].left_at) throw new Error("That student is not connected");
    const until = new Date(Date.now() + clampClassTimeout(row.timeout_sec) * 1000);
    await sql`
      update coaching_disc
      set floor_player_id = ${data.playerId}, floor_kind = ${data.kind}, floor_until = ${until}
      where code = ${data.code}
    `;
    await sql`
      update coaching_disc_players set hand_at = null
      where code = ${data.code} and player_id = ${data.playerId}
    `;
    return loadRoom(data.code, data.hostId);
  });

export const releaseFloor = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId };
  })
  .handler(async ({ data }): Promise<DiscRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ host_id: string; floor_player_id: string | null }>`
      select host_id, floor_player_id from coaching_disc where code = ${data.code} limit 1
    `;
    const row = rooms[0];
    if (!row) throw new Error("No room with that code");
    if (data.playerId !== row.host_id && data.playerId !== row.floor_player_id) {
      throw new Error("Only the teacher or the student on the floor can end this turn");
    }
    await sql`
      update coaching_disc
      set floor_player_id = null, floor_until = null, floor_kind = null
      where code = ${data.code}
    `;
    return loadRoom(data.code, data.playerId);
  });

