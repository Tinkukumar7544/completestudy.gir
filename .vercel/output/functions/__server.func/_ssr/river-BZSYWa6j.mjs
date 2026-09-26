import { r as createServerFn } from "./ssr.mjs";
import { _ as journeyProgress, w as normalizeJourney } from "./types-XZVWHhWz.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/river-BZSYWa6j.js
var MAX_RIVER_STUDENTS = 20;
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
function asDoneIds(raw) {
	const list = typeof raw === "string" ? JSON.parse(raw) : raw;
	if (!Array.isArray(list)) return [];
	return list.map((id) => String(id)).filter(Boolean).slice(0, 40);
}
function asJourney(raw) {
	const data = typeof raw === "string" ? JSON.parse(raw) : raw;
	return normalizeJourney(data);
}
async function loadRoom(code) {
	const sql = await getSql();
	const room = (await sql`
    select code, title, host_id, journey from river_rooms where code = ${code} limit 1
  `)[0];
	if (!room) throw new Error("No river with that code");
	const journey = asJourney(room.journey);
	const rows = await sql`
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
				joinedAt: iso(r.joined_at)
			};
		})
	};
}
var createRiver_createServerFn_handler = createServerRpc({
	id: "f88e11abf94b0c420dbda27a888b78ade73215f2f7bd965546aef59d414f23d2",
	name: "createRiver",
	filename: "src/lib/exam/river.ts"
}, (opts) => createRiver.__executeServer(opts));
var createRiver = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "Class river").trim().slice(0, 120) || "Class river";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
	if (!hostId) throw new Error("Missing student");
	return {
		title,
		hostId,
		hostName,
		journey: normalizeJourney(data.journey)
	};
}).handler(createRiver_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let code = makeCode();
	for (let i = 0; i < 8; i++) {
		if (!(await sql`select code from river_rooms where code = ${code} limit 1`)[0]) break;
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
		students: [{
			playerId: data.hostId,
			name: data.hostName,
			hue: 0,
			progress,
			doneIds,
			joinedAt: (/* @__PURE__ */ new Date()).toISOString()
		}]
	};
});
var joinRiver_createServerFn_handler = createServerRpc({
	id: "69dcb7669bd8261fd8e953ce0dad6bed345c60e7d52dfb9367ba6eba9f1e6a2d",
	name: "joinRiver",
	filename: "src/lib/exam/river.ts"
}, (opts) => joinRiver.__executeServer(opts));
var joinRiver = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid river code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name
	};
}).handler(joinRiver_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!(await sql`select code from river_rooms where code = ${data.code} limit 1`)[0]) throw new Error("No river with that code");
	if (!(await sql`
      select player_id from river_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) {
		if (((await sql`select count(*)::int as n from river_students where room_code = ${data.code}`)[0]?.n ?? 0) >= MAX_RIVER_STUDENTS) throw new Error(`This river is full (${MAX_RIVER_STUDENTS} students)`);
		const hues = await sql`select hue from river_students where room_code = ${data.code}`;
		const used = new Set(hues.map((h) => Number(h.hue)));
		let hue = 0;
		while (used.has(hue) && hue < MAX_RIVER_STUDENTS) hue += 1;
		await sql`
        insert into river_students (room_code, player_id, name, hue)
        values (${data.code}, ${data.playerId}, ${data.name}, ${hue})
      `;
	} else await sql`
        update river_students set name = ${data.name}, updated_at = now()
        where room_code = ${data.code} and player_id = ${data.playerId}
      `;
	return loadRoom(data.code);
});
var listRiver_createServerFn_handler = createServerRpc({
	id: "c16b0eaecbcebcbf6a1f757b6feeb2f49ae569417499ee3ac4ff3d04877dcd50",
	name: "listRiver",
	filename: "src/lib/exam/river.ts"
}, (opts) => listRiver.__executeServer(opts));
var listRiver = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid river code");
	return v;
}).handler(listRiver_createServerFn_handler, async ({ data: code }) => loadRoom(code));
var pushRiverJourney_createServerFn_handler = createServerRpc({
	id: "67f350380a5764c9d4a197d6050af8e68ef6a1f94f43da90e4da42a698fe4f46",
	name: "pushRiverJourney",
	filename: "src/lib/exam/river.ts"
}, (opts) => pushRiverJourney.__executeServer(opts));
var pushRiverJourney = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid river code");
	if (!hostId) throw new Error("Missing host");
	return {
		code,
		hostId,
		journey: normalizeJourney(data.journey)
	};
}).handler(pushRiverJourney_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`select host_id from river_rooms where code = ${data.code} limit 1`;
	if (!rooms[0]) throw new Error("No river with that code");
	if (rooms[0].host_id !== data.hostId) throw new Error("Only the host can change this river");
	await sql`update river_rooms set journey = cast(${JSON.stringify(data.journey)} as jsonb) where code = ${data.code}`;
	return loadRoom(data.code);
});
var pushRiverProgress_createServerFn_handler = createServerRpc({
	id: "49e4a7c4628dfba9c501a76daa05955036817251bc971c2be0066368002b95c5",
	name: "pushRiverProgress",
	filename: "src/lib/exam/river.ts"
}, (opts) => pushRiverProgress.__executeServer(opts));
var pushRiverProgress = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid river code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name,
		doneIds: Array.isArray(data.doneIds) ? data.doneIds.map(String).filter(Boolean).slice(0, 40) : []
	};
}).handler(pushRiverProgress_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`select journey from river_rooms where code = ${data.code} limit 1`;
	if (!rooms[0]) throw new Error("No river with that code");
	const journey = asJourney(rooms[0].journey);
	const progress = journeyProgress(journey.nodes, data.doneIds);
	const doneRaw = JSON.stringify(data.doneIds);
	if (!(await sql`
      select player_id from river_students where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) throw new Error("Join this river first");
	await sql`
      update river_students
      set name = ${data.name}, progress = ${progress}, done_ids = cast(${doneRaw} as jsonb), updated_at = now()
      where room_code = ${data.code} and player_id = ${data.playerId}
    `;
	return loadRoom(data.code);
});
//#endregion
export { createRiver_createServerFn_handler, joinRiver_createServerFn_handler, listRiver_createServerFn_handler, pushRiverJourney_createServerFn_handler, pushRiverProgress_createServerFn_handler };
