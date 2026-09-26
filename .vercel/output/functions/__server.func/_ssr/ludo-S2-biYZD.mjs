import { r as createServerFn } from "./ssr.mjs";
import { E as normalizeLudo, r as LUDO_COLORS } from "./types-XZVWHhWz.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ludo-S2-biYZD.js
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
function asColor(raw) {
	return LUDO_COLORS.includes(raw) ? raw : "red";
}
function asBoard(raw) {
	const data = typeof raw === "string" ? JSON.parse(raw) : raw;
	return normalizeLudo(data);
}
async function loadRoom(code) {
	const sql = await getSql();
	const room = (await sql`
    select code, title, host_id, board from ludo_rooms where code = ${code} limit 1
  `)[0];
	if (!room) throw new Error("No Ludo board with that code");
	const board = asBoard(room.board);
	const rows = await sql`
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
			joinedAt: iso(r.joined_at)
		}))
	};
}
function nextFreeColor(used, prefer) {
	if (prefer && !used.has(prefer)) return prefer;
	return LUDO_COLORS.find((c) => !used.has(c)) ?? "red";
}
var createLudo_createServerFn_handler = createServerRpc({
	id: "d404acc9d0b75afc158bfa5469e01b7f1ade5293f1ee9347cab70876792b38c6",
	name: "createLudo",
	filename: "src/lib/exam/ludo.ts"
}, (opts) => createLudo.__executeServer(opts));
var createLudo = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "Ludo target").trim().slice(0, 120) || "Ludo target";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
	if (!hostId) throw new Error("Missing student");
	return {
		title,
		hostId,
		hostName,
		board: normalizeLudo(data.board)
	};
}).handler(createLudo_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let code = makeCode();
	for (let i = 0; i < 8; i++) {
		if (!(await sql`select code from ludo_rooms where code = ${code} limit 1`)[0]) break;
		code = makeCode();
	}
	const color = data.board.playerColor;
	const columns = data.board.columns.map((c) => c.color === color ? {
		...c,
		studentName: data.hostName
	} : c);
	const board = {
		...data.board,
		columns
	};
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
		students: [{
			playerId: data.hostId,
			name: data.hostName,
			color,
			joinedAt: (/* @__PURE__ */ new Date()).toISOString()
		}]
	};
});
var joinLudo_createServerFn_handler = createServerRpc({
	id: "2f1a4f2dd367cf218acea8d9fbd78cbac7d62224c493d7f6a40a7154c9ad26fc",
	name: "joinLudo",
	filename: "src/lib/exam/ludo.ts"
}, (opts) => joinLudo.__executeServer(opts));
var joinLudo = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid Ludo code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name
	};
}).handler(joinLudo_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`select board from ludo_rooms where code = ${data.code} limit 1`;
	if (!rooms[0]) throw new Error("No Ludo board with that code");
	if (!(await sql`
      select player_id, color from ludo_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) {
		if (((await sql`select count(*)::int as n from ludo_students where room_code = ${data.code}`)[0]?.n ?? 0) >= 4) throw new Error(`This board is full (4 students)`);
		const taken = await sql`select color from ludo_students where room_code = ${data.code}`;
		const color = nextFreeColor(new Set(taken.map((r) => asColor(r.color))));
		await sql`
        insert into ludo_students (room_code, player_id, name, color)
        values (${data.code}, ${data.playerId}, ${data.name}, ${color})
      `;
		const board = asBoard(rooms[0].board);
		const next = {
			...board,
			columns: board.columns.map((c) => c.color === color ? {
				...c,
				studentName: data.name
			} : c)
		};
		await sql`update ludo_rooms set board = cast(${JSON.stringify(next)} as jsonb) where code = ${data.code}`;
	} else await sql`
        update ludo_students set name = ${data.name}, updated_at = now()
        where room_code = ${data.code} and player_id = ${data.playerId}
      `;
	return loadRoom(data.code);
});
var listLudo_createServerFn_handler = createServerRpc({
	id: "b40089e4cb262f016cd83bd1eb174aa08142065d790c96e8b156407233dad175",
	name: "listLudo",
	filename: "src/lib/exam/ludo.ts"
}, (opts) => listLudo.__executeServer(opts));
var listLudo = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid Ludo code");
	return v;
}).handler(listLudo_createServerFn_handler, async ({ data: code }) => loadRoom(code));
var pushLudoBoard_createServerFn_handler = createServerRpc({
	id: "433c7c74314c88fafede667f48c978a074e81cf662534e25bba2f6998e8e9dce",
	name: "pushLudoBoard",
	filename: "src/lib/exam/ludo.ts"
}, (opts) => pushLudoBoard.__executeServer(opts));
var pushLudoBoard = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid Ludo code");
	if (!hostId) throw new Error("Missing host");
	return {
		code,
		hostId,
		board: normalizeLudo(data.board)
	};
}).handler(pushLudoBoard_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`select host_id from ludo_rooms where code = ${data.code} limit 1`;
	if (!rooms[0]) throw new Error("No Ludo board with that code");
	if (rooms[0].host_id !== data.hostId) throw new Error("Only the host can change this board");
	await sql`update ludo_rooms set board = cast(${JSON.stringify(data.board)} as jsonb) where code = ${data.code}`;
	return loadRoom(data.code);
});
var pushLudoColumn_createServerFn_handler = createServerRpc({
	id: "f401e1a40226730fc2a1ac2bd9a187165f94c66140d8607c0a2df6a82635de6d",
	name: "pushLudoColumn",
	filename: "src/lib/exam/ludo.ts"
}, (opts) => pushLudoColumn.__executeServer(opts));
var pushLudoColumn = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid Ludo code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name,
		board: normalizeLudo(data.board)
	};
}).handler(pushLudoColumn_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select board, host_id from ludo_rooms where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No Ludo board with that code");
	const me = await sql`
      select color from ludo_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!me[0]) throw new Error("Join this board first");
	const color = asColor(me[0].color);
	const current = asBoard(rooms[0].board);
	const incoming = data.board.columns.find((c) => c.color === color);
	if (!incoming) throw new Error("Missing column");
	const next = {
		...current,
		lastPips: data.board.lastPips,
		lastMoveAt: data.board.lastMoveAt,
		columns: current.columns.map((c) => c.color === color ? {
			...incoming,
			studentName: data.name
		} : c)
	};
	await sql`update ludo_rooms set board = cast(${JSON.stringify(next)} as jsonb) where code = ${data.code}`;
	await sql`
      update ludo_students set name = ${data.name}, updated_at = now()
      where room_code = ${data.code} and player_id = ${data.playerId}
    `;
	return loadRoom(data.code);
});
//#endregion
export { createLudo_createServerFn_handler, joinLudo_createServerFn_handler, listLudo_createServerFn_handler, pushLudoBoard_createServerFn_handler, pushLudoColumn_createServerFn_handler };
