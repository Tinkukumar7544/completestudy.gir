import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export const MAX_CHAT_PEOPLE = 2;

export type ChatMember = {
  playerId: string;
  name: string;
  joinedAt: string;
};

export type ChatMessage = {
  id: string;
  playerId: string;
  name: string;
  body: string;
  sentAt: string;
};

export type ChatRoom = {
  code: string;
  title: string;
  hostId: string;
  members: ChatMember[];
  messages: ChatMessage[];
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

async function loadRoom(code: string): Promise<ChatRoom> {
  const sql = await getSql();
  const rooms = await sql<{ code: string; title: string; host_id: string }>`
    select code, title, host_id from chat_rooms where code = ${code} limit 1
  `;
  const room = rooms[0];
  if (!room) throw new Error("No chat with that code");
  const members = await sql<{ player_id: string; name: string; joined_at: string | Date }>`
    select player_id, name, joined_at from chat_members where room_code = ${code} order by joined_at
  `;
  const messages = await sql<{
    id: string;
    player_id: string;
    name: string;
    body: string;
    sent_at: string | Date;
  }>`
    select id, player_id, name, body, sent_at
    from chat_messages
    where room_code = ${code}
    order by sent_at desc
    limit 80
  `;
  return {
    code: room.code,
    title: room.title,
    hostId: room.host_id,
    members: members.map((m) => ({
      playerId: m.player_id,
      name: m.name,
      joinedAt: iso(m.joined_at),
    })),
    messages: messages
      .slice()
      .reverse()
      .map((m) => ({
        id: m.id,
        playerId: m.player_id,
        name: m.name,
        body: m.body,
        sentAt: iso(m.sent_at),
      })),
  };
}

export const createChat = createServerFn({ method: "POST" })
  .validator((data: { title?: string; hostId: string; hostName: string }) => {
    const title = String(data.title || "1-1 chat").trim().slice(0, 80) || "1-1 chat";
    const hostId = String(data.hostId || "").trim().slice(0, 64);
    const hostName = String(data.hostName || "You").trim().slice(0, 40) || "You";
    if (!hostId) throw new Error("Missing player");
    return { title, hostId, hostName };
  })
  .handler(async ({ data }): Promise<ChatRoom> => {
    const sql = await getSql();
    let code = makeCode();
    for (let i = 0; i < 8; i++) {
      const exists = await sql<{ code: string }>`select code from chat_rooms where code = ${code} limit 1`;
      if (!exists[0]) break;
      code = makeCode();
    }
    await sql`
      insert into chat_rooms (code, title, host_id)
      values (${code}, ${data.title}, ${data.hostId})
    `;
    await sql`
      insert into chat_members (room_code, player_id, name)
      values (${code}, ${data.hostId}, ${data.hostName})
    `;
    return {
      code,
      title: data.title,
      hostId: data.hostId,
      members: [
        {
          playerId: data.hostId,
          name: data.hostName,
          joinedAt: new Date().toISOString(),
        },
      ],
      messages: [],
    };
  });

export const joinChat = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<ChatRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ code: string }>`select code from chat_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No chat with that code");
    const existing = await sql<{ player_id: string }>`
      select player_id from chat_members where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!existing[0]) {
      const counts = await sql<{ n: number }>`select count(*)::int as n from chat_members where room_code = ${data.code}`;
      if ((counts[0]?.n ?? 0) >= MAX_CHAT_PEOPLE) {
        throw new Error("This chat is full (2 people)");
      }
      await sql`
        insert into chat_members (room_code, player_id, name)
        values (${data.code}, ${data.playerId}, ${data.name})
      `;
    } else {
      await sql`
        update chat_members set name = ${data.name}
        where room_code = ${data.code} and player_id = ${data.playerId}
      `;
    }
    return loadRoom(data.code);
  });

export const listChat = createServerFn({ method: "GET" })
  .validator((code: string) => {
    const v = normalizeCode(code);
    if (v.length < 4) throw new Error("Enter a valid room code");
    return v;
  })
  .handler(async ({ data: code }): Promise<ChatRoom> => loadRoom(code));

export const sendChat = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string; body: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    const body = String(data.body || "").trim().slice(0, 8000);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    if (!body) throw new Error("Type a message");
    return { code, playerId, name, body };
  })
  .handler(async ({ data }): Promise<ChatRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ code: string }>`select code from chat_rooms where code = ${data.code} limit 1`;
    if (!rooms[0]) throw new Error("No chat with that code");
    const member = await sql<{ player_id: string }>`
      select player_id from chat_members where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!member[0]) throw new Error("Join this chat first");
    const id = crypto.randomUUID();
    await sql`
      insert into chat_messages (id, room_code, player_id, name, body)
      values (${id}, ${data.code}, ${data.playerId}, ${data.name}, ${data.body})
    `;
    return loadRoom(data.code);
  });
