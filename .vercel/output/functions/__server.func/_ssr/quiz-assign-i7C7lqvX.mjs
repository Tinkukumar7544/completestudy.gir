//#region node_modules/.nitro/vite/services/ssr/assets/quiz-assign-i7C7lqvX.js
/** Sattolo shuffle: a cyclic permutation, so nobody keeps their own id. */
function derangeIds(ids) {
	const unique = [...new Set(ids.filter(Boolean))];
	if (unique.length < 2) return {};
	const dest = unique.slice();
	for (let i = dest.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const a = dest[i];
		dest[i] = dest[j];
		dest[j] = a;
	}
	const map = {};
	for (let i = 0; i < unique.length; i++) map[unique[i]] = dest[i];
	return map;
}
function parseJson(raw) {
	if (typeof raw !== "string") return raw;
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}
function normalizeUserAns(raw) {
	if (raw === void 0 || raw === null || raw === "") return null;
	if (typeof raw === "number" && Number.isFinite(raw)) return raw;
	if (typeof raw === "string") return raw;
	if (Array.isArray(raw)) return raw.map(Number).filter((n) => Number.isFinite(n));
	return null;
}
function compactQuizItems(raw) {
	const parsed = parseJson(raw);
	if (!Array.isArray(parsed)) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of parsed) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		const bankId = String(row.bankId ?? row.id ?? "").trim();
		if (!bankId || seen.has(bankId)) continue;
		seen.add(bankId);
		out.push({
			bankId,
			userAns: normalizeUserAns(row.userAns),
			isAttempted: Boolean(row.isAttempted),
			isCorrect: Boolean(row.isCorrect),
			isMarked: Boolean(row.isMarked)
		});
	}
	return out;
}
function asSummaryItem(q, item) {
	return {
		...item,
		bankId: q.id,
		type: q.type,
		question: q.question,
		options: q.options,
		correct: q.correct,
		explanation: q.explanation,
		rule: q.rule
	};
}
function buildSummaryItems(questions, items) {
	const qmap = new Map(questions.map((q) => [q.id, q]));
	const out = [];
	for (const item of items) {
		const q = qmap.get(item.bankId) ?? questions.find((row) => String(row.id) === String(item.bankId));
		if (!q) continue;
		out.push(asSummaryItem(q, item));
	}
	if (!out.length && items.length && questions.length) {
		const n = Math.min(items.length, questions.length);
		for (let i = 0; i < n; i++) out.push(asSummaryItem(questions[i], items[i]));
	}
	if (!out.length && questions.length) for (const q of questions) out.push(asSummaryItem(q, {
		bankId: q.id,
		userAns: null,
		isAttempted: false,
		isCorrect: false,
		isMarked: false
	}));
	return out;
}
function groupQuizSections(cards) {
	if (!cards.length) return [];
	if (cards.some((c) => Boolean(c.sourceSection?.trim()))) {
		const order = [];
		const byName = /* @__PURE__ */ new Map();
		for (const card of cards) {
			const name = card.sourceSection?.trim() || card.rule || "General";
			if (!byName.has(name)) {
				byName.set(name, []);
				order.push(name);
			}
			byName.get(name).push(card);
		}
		return order.map((name) => ({
			name,
			cards: byName.get(name)
		}));
	}
	const rules = [];
	const byRule = /* @__PURE__ */ new Map();
	for (const card of cards) {
		const name = card.rule || "General";
		if (!byRule.has(name)) {
			byRule.set(name, []);
			rules.push(name);
		}
		byRule.get(name).push(card);
	}
	if (rules.length > 1) return rules.map((name) => ({
		name,
		cards: byRule.get(name)
	}));
	const size = 25;
	const groups = [];
	for (let i = 0; i < cards.length; i += size) {
		const chunk = cards.slice(i, i + size);
		groups.push({
			name: `Section ${groups.length + 1} (Q${i + 1}–Q${i + chunk.length})`,
			cards: chunk
		});
	}
	return groups;
}
function pickSectionCards(groups, picks) {
	const out = [];
	for (const pick of picks) {
		if (pick.count <= 0) continue;
		const group = groups.find((g) => g.name === pick.name);
		if (!group) continue;
		out.push(...group.cards.slice(0, Math.min(pick.count, group.cards.length)));
	}
	return out;
}
function quizFolderOptions(decks, cards, folders) {
	const counts = /* @__PURE__ */ new Map();
	for (const c of cards) counts.set(c.deckId, (counts.get(c.deckId) ?? 0) + 1);
	const out = decks.map((d) => ({
		id: `deck:${d.id}`,
		label: d.name.split("::").pop() || d.name,
		kind: "deck",
		count: counts.get(d.id) ?? 0
	}));
	for (const f of folders) out.push({
		id: `notes:${f.id}`,
		label: f.name,
		kind: "notes",
		count: 0
	});
	return out;
}
function cardsForQuizFolder(folderId, decks, cards, folders) {
	if (folderId.startsWith("notes:")) {
		const id = folderId.slice(6);
		const folder = folders.find((f) => f.id === id);
		const deck = decks[0];
		return {
			cards: deck ? cards.filter((c) => c.deckId === deck.id) : [],
			label: folder?.name ?? "Notes"
		};
	}
	const id = folderId.startsWith("deck:") ? folderId.slice(5) : folderId;
	const deck = decks.find((d) => d.id === id);
	if (!deck) return {
		cards: [],
		label: "Folder"
	};
	const childIds = new Set(decks.filter((d) => d.id === deck.id || d.name.startsWith(`${deck.name}::`)).map((d) => d.id));
	return {
		cards: cards.filter((c) => childIds.has(c.deckId)),
		label: deck.name.split("::").pop() || deck.name
	};
}
function todayIsoDate(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function parseIsoDate(raw) {
	const v = String(raw || "").trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
	const t = Date.parse(`${v}T00:00:00`);
	if (!Number.isFinite(t)) return null;
	return v;
}
function formatIsoDate(raw) {
	if (!raw) return "";
	const t = Date.parse(`${raw}T00:00:00`);
	if (!Number.isFinite(t)) return raw;
	return new Date(t).toLocaleDateString(void 0, { dateStyle: "medium" });
}
function quizEndsAtMs(startedAt, timeLimitSec) {
	if (!startedAt || timeLimitSec <= 0) return null;
	const start = Date.parse(startedAt);
	if (!Number.isFinite(start)) return null;
	return start + timeLimitSec * 1e3;
}
function remainingMs(endsAt, now = Date.now()) {
	if (!endsAt) return 0;
	return Math.max(0, endsAt - now);
}
function formatCountdown(ms) {
	const total = Math.max(0, Math.ceil(ms / 1e3));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function paperSubmitLocked(endsAt, now = Date.now()) {
	return Boolean(endsAt && now < endsAt);
}
function lockUntilMs(startedAt, timeLimitSec, serverNow, now = Date.now()) {
	const ends = quizEndsAtMs(startedAt, timeLimitSec);
	if (!ends) return 0;
	const server = Date.parse(serverNow);
	if (!Number.isFinite(server)) return ends;
	return now + (ends - server);
}
function skippedQuizItems(questions) {
	return questions.map((q) => ({
		bankId: q.id,
		userAns: null,
		isAttempted: false,
		isCorrect: false,
		isMarked: false
	}));
}
function clampTimeLimitMin(raw) {
	const n = Math.floor(Number(raw) || 0);
	if (!Number.isFinite(n) || n <= 0) return 20;
	return Math.min(180, Math.max(1, n));
}
function optionLetter(index) {
	return String.fromCharCode(65 + index);
}
function formatAnswer(ans, options) {
	if (ans === void 0 || ans === null || ans === "") return "Not answered";
	if (typeof ans === "number") {
		const text = options[ans];
		return text ? `${optionLetter(ans)}. ${text}` : optionLetter(ans);
	}
	if (Array.isArray(ans)) return ans.map((i) => optionLetter(Number(i))).join(", ") || "Not answered";
	return String(ans);
}
function correctIndexes(correct, options) {
	if (typeof correct === "number") return Number.isFinite(correct) ? [correct] : [];
	if (Array.isArray(correct)) return correct.map(Number).filter((n) => Number.isFinite(n));
	const text = String(correct).trim().toLowerCase();
	const idx = options.findIndex((o) => o.toLowerCase() === text);
	return idx >= 0 ? [idx] : [];
}
//#endregion
export { quizFolderOptions as _, correctIndexes as a, todayIsoDate as b, formatCountdown as c, lockUntilMs as d, optionLetter as f, quizEndsAtMs as g, pickSectionCards as h, compactQuizItems as i, formatIsoDate as l, parseIsoDate as m, cardsForQuizFolder as n, derangeIds as o, paperSubmitLocked as p, clampTimeLimitMin as r, formatAnswer as s, buildSummaryItems as t, groupQuizSections as u, remainingMs as v, skippedQuizItems as y };
