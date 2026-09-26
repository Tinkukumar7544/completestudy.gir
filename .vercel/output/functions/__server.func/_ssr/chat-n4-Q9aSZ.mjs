import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-n4-Q9aSZ.js
var MAX_CHAT_PEOPLE = 2;
var CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode() {
	let out = "";
	for (let i = 0; i < 6; i++) out += CODE_CHARS[Math.floor(Math.random() * 32)];
	return out;
}
function normalizeCode(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
function iso(value) {
	return typeof value === "string" ? value : new Date(value).toISOString();
}
async function loadRoom(code) {
	const sql = await getSql();
	const room = (await sql`
    select code, title, host_id from chat_rooms where code = ${code} limit 1
  `)[0];
	if (!room) throw new Error("No chat with that code");
	const members = await sql`
    select player_id, name, joined_at from chat_members where room_code = ${code} order by joined_at
  `;
	const messages = await sql`
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
			joinedAt: iso(m.joined_at)
		})),
		messages: messages.slice().reverse().map((m) => ({
			id: m.id,
			playerId: m.player_id,
			name: m.name,
			body: m.body,
			sentAt: iso(m.sent_at)
		}))
	};
}
var createChat_createServerFn_handler = createServerRpc({
	id: "de0d3401d71676f2d18f61afb5b0ce9f38209d2c9e7edae2cfa6c3e90b2baac9",
	name: "createChat",
	filename: "src/lib/exam/chat.ts"
}, (opts) => createChat.__executeServer(opts));
var createChat = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "1-1 chat").trim().slice(0, 80) || "1-1 chat";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "You").trim().slice(0, 40) || "You";
	if (!hostId) throw new Error("Missing player");
	return {
		title,
		hostId,
		hostName
	};
}).handler(createChat_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let code = makeCode();
	for (let i = 0; i < 8; i++) {
		if (!(await sql`select code from chat_rooms where code = ${code} limit 1`)[0]) break;
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
		members: [{
			playerId: data.hostId,
			name: data.hostName,
			joinedAt: (/* @__PURE__ */ new Date()).toISOString()
		}],
		messages: []
	};
});
var joinChat_createServerFn_handler = createServerRpc({
	id: "1d0d4ebce5fb1f2bdda24db3a1d1a9d57bbf5bb574bad11219ad4632ddfc6a10",
	name: "joinChat",
	filename: "src/lib/exam/chat.ts"
}, (opts) => joinChat.__executeServer(opts));
var joinChat = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(joinChat_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!(await sql`select code from chat_rooms where code = ${data.code} limit 1`)[0]) throw new Error("No chat with that code");
	if (!(await sql`
      select player_id from chat_members where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) {
		if (((await sql`select count(*)::int as n from chat_members where room_code = ${data.code}`)[0]?.n ?? 0) >= MAX_CHAT_PEOPLE) throw new Error("This chat is full (2 people)");
		await sql`
        insert into chat_members (room_code, player_id, name)
        values (${data.code}, ${data.playerId}, ${data.name})
      `;
	} else await sql`
        update chat_members set name = ${data.name}
        where room_code = ${data.code} and player_id = ${data.playerId}
      `;
	return loadRoom(data.code);
});
var listChat_createServerFn_handler = createServerRpc({
	id: "92155fbd47ad964f895ca833a1254f27da7fb059cb45281df08f9bb6eb832815",
	name: "listChat",
	filename: "src/lib/exam/chat.ts"
}, (opts) => listChat.__executeServer(opts));
var listChat = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid room code");
	return v;
}).handler(listChat_createServerFn_handler, async ({ data: code }) => loadRoom(code));
var sendChat_createServerFn_handler = createServerRpc({
	id: "9ba1a226f119be34034b134ce842f0e9ba22350d61d7855675b871bd063a13e7",
	name: "sendChat",
	filename: "src/lib/exam/chat.ts"
}, (opts) => sendChat.__executeServer(opts));
var sendChat = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	const body = String(data.body || "").trim().slice(0, 8e3);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	if (!body) throw new Error("Type a message");
	return {
		code,
		playerId,
		name,
		body
	};
}).handler(sendChat_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!(await sql`select code from chat_rooms where code = ${data.code} limit 1`)[0]) throw new Error("No chat with that code");
	if (!(await sql`
      select player_id from chat_members where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) throw new Error("Join this chat first");
	await sql`
      insert into chat_messages (id, room_code, player_id, name, body)
      values (${crypto.randomUUID()}, ${data.code}, ${data.playerId}, ${data.name}, ${data.body})
    `;
	return loadRoom(data.code);
});
//#endregion
export { createChat_createServerFn_handler, joinChat_createServerFn_handler, listChat_createServerFn_handler, sendChat_createServerFn_handler };
