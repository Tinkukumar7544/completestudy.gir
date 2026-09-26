import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as asDiscMode, r as asDiscKind } from "./discussion-room-C9rESxG8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discussion-DwmjVcvG.js
var CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode() {
	let out = "";
	for (let i = 0; i < 6; i++) out += CODE_CHARS[Math.floor(Math.random() * 32)];
	return out;
}
function normalizeCode(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
function asIso(value) {
	if (!value) return null;
	if (value instanceof Date) return value.toISOString();
	const t = Date.parse(String(value));
	return Number.isFinite(t) ? new Date(t).toISOString() : String(value);
}
async function maybeStartRoom(sql, code) {
	const waiting = await sql`
    select count(*)::int as n from coaching_disc_players
    where code = ${code} and ready_at is null and left_at is null
  `;
	const present = await sql`
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
async function loadRoom(code, viewerId) {
	const sql = await getSql();
	const row = (await sql`
    select code, host_id, title, prompt, mode, max_players, started_at, ended_at
    from coaching_disc where code = ${code} limit 1
  `)[0];
	if (!row) throw new Error("No discussion with that code");
	const players = await sql`
    select player_id, name, joined_at, ready_at, left_at, hand_at
    from coaching_disc_players where code = ${code} order by joined_at
  `;
	const messages = await sql`
    select id, player_id, name, kind, body, sent_at
    from coaching_disc_messages where code = ${code} order by sent_at
  `;
	return {
		code: row.code,
		title: row.title,
		prompt: row.prompt ?? "",
		mode: asDiscMode(row.mode),
		hostId: row.host_id,
		maxPlayers: Math.min(20, Math.max(2, Number(row.max_players) || 20)),
		startedAt: asIso(row.started_at),
		endedAt: asIso(row.ended_at),
		serverNow: (/* @__PURE__ */ new Date()).toISOString(),
		players: players.map((p) => ({
			playerId: p.player_id,
			name: p.name,
			joinedAt: asIso(p.joined_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
			readyAt: asIso(p.ready_at),
			leftAt: asIso(p.left_at),
			handAt: asIso(p.hand_at)
		})),
		messages: messages.map((m) => ({
			id: m.id,
			playerId: m.player_id,
			name: m.name,
			kind: asDiscKind(m.kind),
			body: m.body,
			sentAt: asIso(m.sent_at) ?? (/* @__PURE__ */ new Date()).toISOString()
		})),
		isHost: Boolean(viewerId && viewerId === row.host_id)
	};
}
var createDiscussion_createServerFn_handler = createServerRpc({
	id: "6ef1923e1a8bc068a04f8d4153573aa96954cde15d41eb75680ee675fe62c715",
	name: "createDiscussion",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => createDiscussion.__executeServer(opts));
var createDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "You").trim().slice(0, 40) || "You";
	const title = String(data.title || "").trim().slice(0, 80);
	const prompt = String(data.prompt || "").trim().slice(0, 600);
	const mode = asDiscMode(data.mode);
	if (!hostId) throw new Error("Missing player");
	if (!title) throw new Error("Give the topic a title");
	return {
		hostId,
		hostName,
		title,
		prompt,
		mode
	};
}).handler(createDiscussion_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let code = makeCode();
	for (let i = 0; i < 8; i++) {
		if (!(await sql`select code from coaching_disc where code = ${code} limit 1`)[0]) break;
		code = makeCode();
	}
	await sql`
      insert into coaching_disc (code, host_id, title, prompt, mode, max_players)
      values (${code}, ${data.hostId}, ${data.title}, ${data.prompt}, ${data.mode}, ${20})
    `;
	await sql`
      insert into coaching_disc_players (code, player_id, name)
      values (${code}, ${data.hostId}, ${data.hostName})
    `;
	return loadRoom(code, data.hostId);
});
var joinDiscussion_createServerFn_handler = createServerRpc({
	id: "f2dc5701ea5a91963fe522a4e9139c72f3de2555a0c5e1187d32cb2643a49c57",
	name: "joinDiscussion",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => joinDiscussion.__executeServer(opts));
var joinDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId,
		name
	};
}).handler(joinDiscussion_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const room = (await sql`
      select code, started_at, ended_at from coaching_disc where code = ${data.code} limit 1
    `)[0];
	if (!room) throw new Error("No discussion with that code");
	if (room.ended_at) throw new Error("This discussion has ended");
	const existing = await sql`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!existing[0]) {
		if (room.started_at) throw new Error("This discussion has already started");
		if (((await sql`
        select count(*)::int as n from coaching_disc_players where code = ${data.code} and left_at is null
      `)[0]?.n ?? 0) >= 20) throw new Error(`This discussion is full (20)`);
		await sql`
        insert into coaching_disc_players (code, player_id, name)
        values (${data.code}, ${data.playerId}, ${data.name})
      `;
	} else {
		if (existing[0].left_at && room.started_at) throw new Error("You already left this discussion");
		await sql`
        update coaching_disc_players set name = ${data.name}, left_at = null
        where code = ${data.code} and player_id = ${data.playerId}
      `;
	}
	return loadRoom(data.code, data.playerId);
});
var listDiscussion_createServerFn_handler = createServerRpc({
	id: "217a9f815342fb7ab70c923f19be6f97232ba6c88530ce1d62ac0b6038170b77",
	name: "listDiscussion",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => listDiscussion.__executeServer(opts));
var listDiscussion = createServerFn({ method: "GET" }).validator((data) => {
	if (typeof data === "string") {
		const code = normalizeCode(data);
		if (code.length < 4) throw new Error("Enter a valid room code");
		return {
			code,
			playerId: ""
		};
	}
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	return {
		code,
		playerId
	};
}).handler(listDiscussion_createServerFn_handler, async ({ data }) => loadRoom(data.code, data.playerId || void 0));
var readyDiscussion_createServerFn_handler = createServerRpc({
	id: "ccfd23e09591fc84200e84c3de4f6e1cc924a9d67b0ad87757c77dbb84c2adab",
	name: "readyDiscussion",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => readyDiscussion.__executeServer(opts));
var readyDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId,
		name
	};
}).handler(readyDiscussion_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select ended_at from coaching_disc where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No discussion with that code");
	if (rooms[0].ended_at) throw new Error("This discussion has ended");
	const mine = await sql`
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
var sendDiscussionChat_createServerFn_handler = createServerRpc({
	id: "e41416aea670b5804f8a4484452ad49f79250bf674a67fc2d7adcaae8cd81d2f",
	name: "sendDiscussionChat",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => sendDiscussionChat.__executeServer(opts));
var sendDiscussionChat = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	const body = String(data.body || "").trim().slice(0, 400);
	const kind = asDiscKind(data.kind);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	if (!body) throw new Error("Write a message");
	return {
		code,
		playerId,
		name,
		body,
		kind
	};
}).handler(sendDiscussionChat_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const mine = await sql`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!mine[0] || mine[0].left_at) throw new Error("Join this discussion first");
	await sql`
      insert into coaching_disc_messages (id, code, player_id, name, kind, body)
      values (${`${Date.now().toString(36)}-${makeCode()}`}, ${data.code}, ${data.playerId}, ${data.name}, ${data.kind}, ${data.body})
    `;
	return loadRoom(data.code, data.playerId);
});
var raiseDiscussionHand_createServerFn_handler = createServerRpc({
	id: "8ac760beac63927f974c2fdc38f633b6507af7c82d9cddde918607671a04a32a",
	name: "raiseDiscussionHand",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => raiseDiscussionHand.__executeServer(opts));
var raiseDiscussionHand = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId,
		on: Boolean(data.on)
	};
}).handler(raiseDiscussionHand_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const mine = await sql`
      select player_id, left_at from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!mine[0] || mine[0].left_at) throw new Error("Join this discussion first");
	if (data.on) await sql`
        update coaching_disc_players set hand_at = coalesce(hand_at, now())
        where code = ${data.code} and player_id = ${data.playerId}
      `;
	else await sql`
        update coaching_disc_players set hand_at = null
        where code = ${data.code} and player_id = ${data.playerId}
      `;
	return loadRoom(data.code, data.playerId);
});
var leaveDiscussion_createServerFn_handler = createServerRpc({
	id: "aed36f9d23b858f9c41305bcbe7e3a87743fc8a0fdcc48c6958ce4e68b9d7aef",
	name: "leaveDiscussion",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => leaveDiscussion.__executeServer(opts));
var leaveDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId
	};
}).handler(leaveDiscussion_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select started_at, ended_at from coaching_disc where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No discussion with that code");
	await sql`
      update coaching_disc_players set left_at = coalesce(left_at, now()), hand_at = null
      where code = ${data.code} and player_id = ${data.playerId}
    `;
	if (!rooms[0].started_at) await maybeStartRoom(sql, data.code);
	return { ok: true };
});
var endDiscussion_createServerFn_handler = createServerRpc({
	id: "0b8b267680df959d800acfb35f7331fceddc43563a68c337a7f4526ad68c23a8",
	name: "endDiscussion",
	filename: "src/lib/exam/discussion.ts"
}, (opts) => endDiscussion.__executeServer(opts));
var endDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId
	};
}).handler(endDiscussion_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!(await sql`
      select player_id from coaching_disc_players
      where code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) throw new Error("Join this discussion first");
	await sql`
      update coaching_disc set ended_at = coalesce(ended_at, now())
      where code = ${data.code}
    `;
	return loadRoom(data.code, data.playerId);
});
//#endregion
export { createDiscussion_createServerFn_handler, endDiscussion_createServerFn_handler, joinDiscussion_createServerFn_handler, leaveDiscussion_createServerFn_handler, listDiscussion_createServerFn_handler, raiseDiscussionHand_createServerFn_handler, readyDiscussion_createServerFn_handler, sendDiscussionChat_createServerFn_handler };
