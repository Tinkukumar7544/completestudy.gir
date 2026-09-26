import { r as createServerFn } from "./ssr.mjs";
import { G as createSsrRpc } from "./router-B0Z9kZGU2.mjs";
import { i as compactQuizItems, m as parseIsoDate, r as clampTimeLimitMin } from "./quiz-assign-i7C7lqvX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-DNF-wQMz.js
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
}).handler(createSsrRpc("61ee887380ac04a054480bccbeebac3a0e2ae9100838ba2f1df3800f6ab630ce"));
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
}).handler(createSsrRpc("57824e609e259cccaa7aee9b98687b811e993c37d5cf933b4261cc1f662078f2"));
var getQuizPaper = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid room code");
	return v;
}).handler(createSsrRpc("b78ed361bb074532f13ea274b30a0223a8e852b29a8037980934d5a1f46d1553"));
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
}).handler(createSsrRpc("b5deaff44d8a9ee33a2d0992564bbadc314e7136b1286dcd86e1047bed394d03"));
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
}).handler(createSsrRpc("ee6026d546fb4b23bf82cf7660112dad724729349d62115673bea7f3da582e87"));
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
}).handler(createSsrRpc("dd66e0369dfe577499147608024c281a885c8bb559e0509a8455a5d75500a9e9"));
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
}).handler(createSsrRpc("76f6b38bae55766900b238cecd12aa6519ca1ec6b21fd3893ac9365d9c33d218"));
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
}).handler(createSsrRpc("d61809e689ae8ad4e23cb5304040c3bf9089f8a42d33f14b6e2581c35536ff6d"));
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
}).handler(createSsrRpc("ef058709822a8e3bdebf1ad0c251489fbb67ea201608634dc9cc78274df710e5"));
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
}).handler(createSsrRpc("eb1840fb2bae0ce1ec83b96c0e099188705e24df73feea607e21b2707f279a37"));
//#endregion
export { joinQuiz as a, readyQuiz as c, getQuizSummary as i, sendQuizChat as l, endQuiz as n, leaveQuiz as o, getQuizPaper as r, listQuiz as s, createQuiz as t, submitQuizScore as u };
