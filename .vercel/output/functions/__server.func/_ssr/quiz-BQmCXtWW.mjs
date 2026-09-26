import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { g as quizEndsAtMs, i as compactQuizItems, m as parseIsoDate, o as derangeIds, p as paperSubmitLocked, r as clampTimeLimitMin, t as buildSummaryItems, y as skippedQuizItems } from "./quiz-assign-i7C7lqvX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-BQmCXtWW.js
var MAX_QUIZ_FRIENDS = 20;
var CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode() {
	let out = "";
	for (let i = 0; i < 6; i++) out += CODE_CHARS[Math.floor(Math.random() * 32)];
	return out;
}
function normalizeCode(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
function compactQuestions(raw) {
	if (!Array.isArray(raw)) throw new Error("Quiz needs a question list");
	const out = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const q = item;
		const text = String(q.question ?? "").trim();
		if (!text) continue;
		const source = String(q.sourceSection ?? "").trim();
		out.push({
			id: String(q.id || `q-${out.length + 1}`),
			type: q.type === "msq" || q.type === "numerical" ? q.type : "mcq",
			rule: String(q.rule || "General"),
			question: text,
			options: Array.isArray(q.options) ? q.options.map(String) : [],
			correct: q.correct ?? 0,
			explanation: String(q.explanation ?? ""),
			...source ? { sourceSection: source } : {}
		});
	}
	if (!out.length) throw new Error("Quiz needs at least one question");
	return out;
}
function compactSectionPicks(raw) {
	let parsed = raw;
	if (typeof raw === "string") try {
		parsed = JSON.parse(raw);
	} catch {
		parsed = raw;
	}
	if (!Array.isArray(parsed)) return [];
	const out = [];
	for (const item of parsed) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		const name = String(row.name ?? "").trim();
		const count = Math.max(0, Math.floor(Number(row.count) || 0));
		if (!name || count <= 0) continue;
		out.push({
			name: name.slice(0, 160),
			count
		});
	}
	return out;
}
function asIso(value) {
	if (!value) return null;
	if (typeof value === "string") return value;
	return value.toISOString();
}
function mapPlayers(rows) {
	return rows.map((r) => ({
		playerId: r.player_id,
		name: r.name,
		joinedAt: asIso(r.joined_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		submittedAt: asIso(r.submitted_at),
		readyAt: asIso(r.ready_at),
		leftAt: asIso(r.left_at),
		correct: r.correct,
		wrong: r.wrong,
		notAttempted: r.not_attempted,
		marked: r.marked,
		total: r.total,
		score: r.score
	}));
}
function summaryFromRow(row, questions) {
	if (!row.submitted_at || !row.view_code) return null;
	const items = buildSummaryItems(questions, compactQuizItems(row.items));
	return {
		playerId: row.player_id,
		name: row.name,
		viewCode: row.view_code,
		correct: row.correct ?? 0,
		wrong: row.wrong ?? 0,
		notAttempted: row.not_attempted ?? 0,
		marked: row.marked ?? 0,
		total: row.total ?? items.length,
		score: row.score ?? row.correct ?? 0,
		items
	};
}
async function uniqueViewCode(sql, roomCode) {
	for (let i = 0; i < 12; i++) {
		const code = makeCode();
		if (!(await sql`
      select view_code from quiz_players where room_code = ${roomCode} and view_code = ${code} limit 1
    `)[0]) return code;
	}
	return `${makeCode()}${CODE_CHARS[Math.floor(Math.random() * 32)]}`;
}
async function reassignSummaries(sql, roomCode) {
	const ids = (await sql`
    select player_id from quiz_players
    where room_code = ${roomCode} and submitted_at is not null
    order by submitted_at, player_id
  `).map((r) => r.player_id);
	const map = derangeIds(ids);
	if (ids.length < 2) {
		await sql`
      update quiz_players set assigned_player_id = null where room_code = ${roomCode}
    `;
		return;
	}
	for (const id of ids) await sql`
      update quiz_players set assigned_player_id = ${map[id] ?? null}
      where room_code = ${roomCode} and player_id = ${id}
    `;
}
async function loadMessages(sql, code) {
	return (await sql`
    select id, player_id, name, body, sent_at
    from quiz_messages
    where room_code = ${code}
    order by sent_at desc
    limit 80
  `).slice().reverse().map((m) => ({
		id: m.id,
		playerId: m.player_id,
		name: m.name,
		body: m.body,
		sentAt: asIso(m.sent_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	}));
}
async function recordSkipped(sql, code, playerId, name, questions) {
	const items = skippedQuizItems(questions);
	const rawItems = JSON.stringify(items);
	const viewCode = await uniqueViewCode(sql, code);
	const total = questions.length;
	await sql`
    update quiz_players set
      name = ${name},
      submitted_at = now(),
      correct = 0,
      wrong = 0,
      not_attempted = ${total},
      marked = 0,
      total = ${total},
      score = 0,
      items = cast(${rawItems} as jsonb),
      view_code = coalesce(view_code, ${viewCode})
    where room_code = ${code} and player_id = ${playerId} and submitted_at is null
  `;
}
async function settleExpired(sql, code) {
	const room = (await sql`
    select questions, time_limit_sec, started_at, ended_at from quiz_rooms where code = ${code} limit 1
  `)[0];
	if (!room?.started_at || room.ended_at) return;
	const timeLimitSec = Number(room.time_limit_sec) || 0;
	if (timeLimitSec <= 0) return;
	const startedAt = asIso(room.started_at);
	const endsAt = quizEndsAtMs(startedAt, timeLimitSec);
	if (!endsAt) return;
	if (Date.now() < endsAt + 3e3) return;
	const questions = compactQuestions(typeof room.questions === "string" ? JSON.parse(room.questions) : room.questions);
	const pending = await sql`
    select player_id, name from quiz_players
    where room_code = ${code} and submitted_at is null
  `;
	for (const p of pending) await recordSkipped(sql, code, p.player_id, p.name, questions);
	await sql`update quiz_rooms set ended_at = coalesce(ended_at, now()) where code = ${code}`;
	if (pending.length) await reassignSummaries(sql, code);
}
async function maybeStartRoom(sql, code) {
	const waiting = await sql`
    select count(*)::int as n from quiz_players
    where room_code = ${code} and ready_at is null and left_at is null
  `;
	const present = await sql`
    select count(*)::int as n from quiz_players
    where room_code = ${code} and left_at is null
  `;
	if ((waiting[0]?.n ?? 1) > 0) return;
	if ((present[0]?.n ?? 0) < 1) return;
	await sql`
    update quiz_rooms set started_at = coalesce(started_at, now())
    where code = ${code} and ended_at is null
  `;
}
async function loadQuestions(sql, code) {
	const rooms = await sql`
    select questions from quiz_rooms where code = ${code} limit 1
  `;
	if (!rooms[0]) throw new Error("No quiz with that code");
	return compactQuestions(typeof rooms[0].questions === "string" ? JSON.parse(rooms[0].questions) : rooms[0].questions);
}
async function loadRoom(code, viewerId) {
	const sql = await getSql();
	await settleExpired(sql, code);
	const room = (await sql`
    select code, title, host_id, questions, test_day, folder, section_picks, time_limit_sec, started_at, ended_at
    from quiz_rooms where code = ${code} limit 1
  `)[0];
	if (!room) throw new Error("No quiz with that code");
	const rows = await sql`
    select player_id, name, joined_at, submitted_at, ready_at, left_at, correct, wrong, not_attempted, marked, total, score,
           view_code, assigned_player_id, items
    from quiz_players where room_code = ${code} order by joined_at
  `;
	const questions = compactQuestions(typeof room.questions === "string" ? JSON.parse(room.questions) : room.questions);
	const players = mapPlayers(rows);
	const me = viewerId ? rows.find((r) => r.player_id === viewerId) : void 0;
	const hasSubmitted = Boolean(me?.submitted_at);
	let assigned = null;
	if (hasSubmitted && me?.assigned_player_id) {
		const other = rows.find((r) => r.player_id === me.assigned_player_id);
		if (other && other.player_id !== me.player_id) assigned = summaryFromRow(other, questions);
	}
	const testDay = room.test_day ? typeof room.test_day === "string" ? room.test_day.slice(0, 10) : asIso(room.test_day)?.slice(0, 10) ?? null : null;
	const timeLimitSec = Number(room.time_limit_sec) || 0;
	const startedAt = asIso(room.started_at);
	const endedAt = asIso(room.ended_at);
	return {
		code: room.code,
		title: room.title,
		hostId: room.host_id,
		questionCount: questions.length,
		testDay,
		folder: String(room.folder ?? ""),
		sectionPicks: compactSectionPicks(typeof room.section_picks === "string" ? JSON.parse(room.section_picks) : room.section_picks),
		timeLimitSec,
		startedAt,
		endedAt,
		serverNow: (/* @__PURE__ */ new Date()).toISOString(),
		players,
		messages: await loadMessages(sql, code),
		myViewCode: hasSubmitted ? me?.view_code ?? null : null,
		hasSubmitted,
		isHost: Boolean(viewerId && viewerId === room.host_id),
		assigned
	};
}
var createQuiz_createServerFn_handler = createServerRpc({
	id: "61ee887380ac04a054480bccbeebac3a0e2ae9100838ba2f1df3800f6ab630ce",
	name: "createQuiz",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => createQuiz.__executeServer(opts));
var createQuiz = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "Friends quiz").trim().slice(0, 120) || "Friends quiz";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
	if (!hostId) throw new Error("Missing player");
	const testDay = parseIsoDate(String(data.testDay || "")) ?? null;
	const folder = String(data.folder || "").trim().slice(0, 120);
	return {
		title,
		hostId,
		hostName,
		questions: compactQuestions(data.questions),
		testDay,
		folder,
		sectionPicks: compactSectionPicks(data.sectionPicks),
		timeLimitSec: clampTimeLimitMin(data.timeLimitMin) * 60
	};
}).handler(createQuiz_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let code = makeCode();
	for (let i = 0; i < 8; i++) {
		if (!(await sql`select code from quiz_rooms where code = ${code} limit 1`)[0]) break;
		code = makeCode();
	}
	const raw = JSON.stringify(data.questions);
	const picks = JSON.stringify(data.sectionPicks);
	await sql`
      insert into quiz_rooms (code, title, host_id, questions, test_day, folder, section_picks, time_limit_sec)
      values (
        ${code}, ${data.title}, ${data.hostId}, cast(${raw} as jsonb),
        ${data.testDay}, ${data.folder}, cast(${picks} as jsonb), ${data.timeLimitSec}
      )
    `;
	await sql`
      insert into quiz_players (room_code, player_id, name)
      values (${code}, ${data.hostId}, ${data.hostName})
    `;
	return loadRoom(code, data.hostId);
});
var joinQuiz_createServerFn_handler = createServerRpc({
	id: "57824e609e259cccaa7aee9b98687b811e993c37d5cf933b4261cc1f662078f2",
	name: "joinQuiz",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => joinQuiz.__executeServer(opts));
var joinQuiz = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(joinQuiz_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const room = (await sql`
      select code, started_at, ended_at from quiz_rooms where code = ${data.code} limit 1
    `)[0];
	if (!room) throw new Error("No quiz with that code");
	if (room.ended_at) throw new Error("This test has ended");
	const existing = await sql`
      select player_id, left_at from quiz_players where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!existing[0]) {
		if (room.started_at) throw new Error("This test has already started");
		if (((await sql`select count(*)::int as n from quiz_players where room_code = ${data.code}`)[0]?.n ?? 0) >= MAX_QUIZ_FRIENDS) throw new Error(`This quiz is full (${MAX_QUIZ_FRIENDS} friends)`);
		await sql`
        insert into quiz_players (room_code, player_id, name)
        values (${data.code}, ${data.playerId}, ${data.name})
      `;
	} else {
		if (existing[0].left_at && room.started_at) throw new Error("You already left this test");
		await sql`
        update quiz_players set name = ${data.name}, left_at = null
        where room_code = ${data.code} and player_id = ${data.playerId} and submitted_at is null
      `;
	}
	return loadRoom(data.code, data.playerId);
});
var getQuizPaper_createServerFn_handler = createServerRpc({
	id: "b78ed361bb074532f13ea274b30a0223a8e852b29a8037980934d5a1f46d1553",
	name: "getQuizPaper",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => getQuizPaper.__executeServer(opts));
var getQuizPaper = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid room code");
	return v;
}).handler(getQuizPaper_createServerFn_handler, async ({ data: code }) => {
	const sql = await getSql();
	await settleExpired(sql, code);
	const room = (await sql`
      select title, questions, time_limit_sec, started_at, ended_at from quiz_rooms where code = ${code} limit 1
    `)[0];
	if (!room) throw new Error("No quiz with that code");
	if (room.ended_at) throw new Error("This test has ended");
	if (!room.started_at) throw new Error("Everyone needs to tap Start first");
	const questions = compactQuestions(typeof room.questions === "string" ? JSON.parse(room.questions) : room.questions);
	return {
		title: room.title,
		questions,
		timeLimitSec: Number(room.time_limit_sec) || 0,
		startedAt: asIso(room.started_at),
		endedAt: asIso(room.ended_at),
		serverNow: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var listQuiz_createServerFn_handler = createServerRpc({
	id: "b5deaff44d8a9ee33a2d0992564bbadc314e7136b1286dcd86e1047bed394d03",
	name: "listQuiz",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => listQuiz.__executeServer(opts));
var listQuiz = createServerFn({ method: "GET" }).validator((data) => {
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
}).handler(listQuiz_createServerFn_handler, async ({ data }) => loadRoom(data.code, data.playerId || void 0));
var getQuizSummary_createServerFn_handler = createServerRpc({
	id: "ee6026d546fb4b23bf82cf7660112dad724729349d62115673bea7f3da582e87",
	name: "getQuizSummary",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => getQuizSummary.__executeServer(opts));
var getQuizSummary = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const viewCode = normalizeCode(data.viewCode);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	if (viewCode.length < 4) throw new Error("Enter a view code");
	return {
		code,
		playerId,
		viewCode
	};
}).handler(getQuizSummary_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select questions from quiz_rooms where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No quiz with that code");
	const viewer = await sql`
      select player_id, submitted_at, view_code from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!viewer[0]) throw new Error("Join this quiz first");
	if (!viewer[0].submitted_at) throw new Error("Submit your paper first to open summaries");
	if (viewer[0].view_code && viewer[0].view_code === data.viewCode) throw new Error("Summaries stay swapped — enter a friend’s view code");
	const row = (await sql`
      select player_id, name, joined_at, submitted_at, ready_at, left_at, correct, wrong, not_attempted, marked, total, score,
             view_code, assigned_player_id, items
      from quiz_players
      where room_code = ${data.code} and view_code = ${data.viewCode} limit 1
    `)[0];
	if (!row?.submitted_at) throw new Error("No summary with that code in this room");
	if (row.player_id === data.playerId) throw new Error("Summaries stay swapped — enter a friend’s view code");
	const summary = summaryFromRow(row, compactQuestions(typeof rooms[0].questions === "string" ? JSON.parse(rooms[0].questions) : rooms[0].questions));
	if (!summary) throw new Error("That summary is not ready yet");
	return summary;
});
var submitQuizScore_createServerFn_handler = createServerRpc({
	id: "dd66e0369dfe577499147608024c281a885c8bb559e0509a8455a5d75500a9e9",
	name: "submitQuizScore",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => submitQuizScore.__executeServer(opts));
var submitQuizScore = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId,
		name,
		correct: Math.max(0, Number(data.correct) || 0),
		wrong: Math.max(0, Number(data.wrong) || 0),
		notAttempted: Math.max(0, Number(data.notAttempted) || 0),
		marked: Math.max(0, Number(data.marked) || 0),
		total: Math.max(0, Number(data.total) || 0),
		score: Math.max(0, Number(data.score) || 0),
		items: compactQuizItems(data.items)
	};
}).handler(submitQuizScore_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const room = (await sql`
      select code, started_at, ended_at, time_limit_sec from quiz_rooms where code = ${data.code} limit 1
    `)[0];
	if (!room) throw new Error("No quiz with that code");
	const endsAt = quizEndsAtMs(asIso(room.started_at), Number(room.time_limit_sec) || 0);
	if (paperSubmitLocked(endsAt, Date.now() + 1500)) throw new Error("The paper stays open until time is up");
	const existing = await sql`
      select submitted_at, view_code from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (existing[0]?.submitted_at) throw new Error("This paper is already submitted and cannot be changed");
	const viewCode = existing[0]?.view_code || await uniqueViewCode(sql, data.code);
	const rawItems = JSON.stringify(data.items);
	if (existing[0]) await sql`
        update quiz_players set
          name = ${data.name},
          submitted_at = now(),
          correct = ${data.correct},
          wrong = ${data.wrong},
          not_attempted = ${data.notAttempted},
          marked = ${data.marked},
          total = ${data.total},
          score = ${data.score},
          items = cast(${rawItems} as jsonb),
          view_code = ${viewCode}
        where room_code = ${data.code} and player_id = ${data.playerId} and submitted_at is null
      `;
	else {
		if (((await sql`select count(*)::int as n from quiz_players where room_code = ${data.code}`)[0]?.n ?? 0) >= MAX_QUIZ_FRIENDS) throw new Error(`This quiz is full (${MAX_QUIZ_FRIENDS} friends)`);
		await sql`
        insert into quiz_players (
          room_code, player_id, name, submitted_at, correct, wrong, not_attempted, marked, total, score, items, view_code
        ) values (
          ${data.code}, ${data.playerId}, ${data.name}, now(),
          ${data.correct}, ${data.wrong}, ${data.notAttempted}, ${data.marked}, ${data.total}, ${data.score},
          cast(${rawItems} as jsonb), ${viewCode}
        )
      `;
	}
	if (((await sql`
      select count(*)::int as n from quiz_players
      where room_code = ${data.code} and submitted_at is null and left_at is null
    `)[0]?.n ?? 0) === 0) await sql`update quiz_rooms set ended_at = coalesce(ended_at, now()) where code = ${data.code}`;
	await reassignSummaries(sql, data.code);
	return loadRoom(data.code, data.playerId);
});
var readyQuiz_createServerFn_handler = createServerRpc({
	id: "76f6b38bae55766900b238cecd12aa6519ca1ec6b21fd3893ac9365d9c33d218",
	name: "readyQuiz",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => readyQuiz.__executeServer(opts));
var readyQuiz = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(readyQuiz_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No quiz with that code");
	if (rooms[0].ended_at) throw new Error("This test has ended");
	const mine = await sql`
      select player_id, left_at from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!mine[0] || mine[0].left_at) throw new Error("Join this quiz first");
	await sql`
      update quiz_players set name = ${data.name}, ready_at = coalesce(ready_at, now())
      where room_code = ${data.code} and player_id = ${data.playerId} and left_at is null
    `;
	await maybeStartRoom(sql, data.code);
	return loadRoom(data.code, data.playerId);
});
var sendQuizChat_createServerFn_handler = createServerRpc({
	id: "d61809e689ae8ad4e23cb5304040c3bf9089f8a42d33f14b6e2581c35536ff6d",
	name: "sendQuizChat",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => sendQuizChat.__executeServer(opts));
var sendQuizChat = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	const body = String(data.body || "").trim().slice(0, 400);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	if (!body) throw new Error("Write a message");
	return {
		code,
		playerId,
		name,
		body
	};
}).handler(sendQuizChat_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const mine = await sql`
      select player_id, left_at from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (!mine[0] || mine[0].left_at) throw new Error("Join this quiz first");
	await sql`
      insert into quiz_messages (id, room_code, player_id, name, body)
      values (${`${Date.now().toString(36)}-${makeCode()}`}, ${data.code}, ${data.playerId}, ${data.name}, ${data.body})
    `;
	return loadRoom(data.code, data.playerId);
});
var leaveQuiz_createServerFn_handler = createServerRpc({
	id: "ef058709822a8e3bdebf1ad0c251489fbb67ea201608634dc9cc78274df710e5",
	name: "leaveQuiz",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => leaveQuiz.__executeServer(opts));
var leaveQuiz = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(leaveQuiz_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select started_at, ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No quiz with that code");
	const mine = await sql`
      select submitted_at from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
	if (rooms[0].started_at && !rooms[0].ended_at && mine[0] && !mine[0].submitted_at) {
		const questions = await loadQuestions(sql, data.code);
		await recordSkipped(sql, data.code, data.playerId, data.name, questions);
		await reassignSummaries(sql, data.code);
	}
	await sql`
      update quiz_players set left_at = coalesce(left_at, now())
      where room_code = ${data.code} and player_id = ${data.playerId}
    `;
	if (!rooms[0].started_at) await maybeStartRoom(sql, data.code);
	return { ok: true };
});
var endQuiz_createServerFn_handler = createServerRpc({
	id: "eb1840fb2bae0ce1ec83b96c0e099188705e24df73feea607e21b2707f279a37",
	name: "endQuiz",
	filename: "src/lib/exam/quiz.ts"
}, (opts) => endQuiz.__executeServer(opts));
var endQuiz = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(endQuiz_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rooms = await sql`
      select started_at, ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
	if (!rooms[0]) throw new Error("No quiz with that code");
	if (!(await sql`
      select player_id from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `)[0]) throw new Error("Join this quiz first");
	if (rooms[0].started_at && !rooms[0].ended_at) {
		const questions = await loadQuestions(sql, data.code);
		const pending = await sql`
        select player_id, name from quiz_players
        where room_code = ${data.code} and submitted_at is null
      `;
		for (const p of pending) await recordSkipped(sql, data.code, p.player_id, p.name, questions);
		if (pending.length) await reassignSummaries(sql, data.code);
	}
	await sql`update quiz_rooms set ended_at = coalesce(ended_at, now()) where code = ${data.code}`;
	return loadRoom(data.code, data.playerId);
});
//#endregion
export { createQuiz_createServerFn_handler, endQuiz_createServerFn_handler, getQuizPaper_createServerFn_handler, getQuizSummary_createServerFn_handler, joinQuiz_createServerFn_handler, leaveQuiz_createServerFn_handler, listQuiz_createServerFn_handler, readyQuiz_createServerFn_handler, sendQuizChat_createServerFn_handler, submitQuizScore_createServerFn_handler };
