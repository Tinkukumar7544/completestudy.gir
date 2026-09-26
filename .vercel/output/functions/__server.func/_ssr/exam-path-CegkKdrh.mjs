import { s as defaultExamPath, x as normalizeExamPath } from "./types-XZVWHhWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exam-path-CegkKdrh.js
function pathDayKey(now = Date.now(), dayStartHour = 4) {
	const d = new Date(now);
	if (d.getHours() < dayStartHour) d.setDate(d.getDate() - 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function pathWeekKey(now = Date.now(), dayStartHour = 4) {
	const d = new Date(now);
	if (d.getHours() < dayStartHour) d.setDate(d.getDate() - 1);
	const day = d.getDay();
	const mondayOffset = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + mondayOffset);
	return `${d.getFullYear()}-W${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function yesterdayKey(day) {
	const [y, m, d] = day.split("-").map(Number);
	const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
	dt.setDate(dt.getDate() - 1);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function rolloverPath(path, dayStartHour = 4, now = Date.now()) {
	const day = pathDayKey(now, dayStartHour);
	const week = pathWeekKey(now, dayStartHour);
	let progress = path.progress;
	if (progress.dayKey !== day) progress = {
		...progress,
		todayMarks: 0,
		dayKey: day
	};
	if (progress.weekKey !== week) progress = {
		...progress,
		weekMarks: 0,
		weekKey: week
	};
	return progress === path.progress ? path : {
		...path,
		progress
	};
}
function folderName(folders, id) {
	if (!id) return "";
	return folders.find((f) => f.id === id)?.name ?? "";
}
function matchesSubject(text, subject) {
	const a = text.trim().toLowerCase();
	const b = subject.trim().toLowerCase();
	if (!a || !b) return false;
	return a.includes(b) || b.includes(a);
}
function intakeReady(intake) {
	if (!intake.examName.trim()) return false;
	if (!intake.startDate || !intake.examDate) return false;
	if (intake.examDate < intake.startDate) return false;
	return intake.subjects.length + intake.noteIds.length + intake.deckIds.length + intake.extraItems.length > 0;
}
function buildExamPath(intake, notes, decks, folders, existing) {
	const subjects = intake.subjects.length ? intake.subjects : ["Core paper"];
	const selectedNotes = notes.filter((n) => intake.noteIds.includes(n.id));
	const selectedDecks = decks.filter((d) => intake.deckIds.includes(d.id));
	const usedNotes = /* @__PURE__ */ new Set();
	const usedDecks = /* @__PURE__ */ new Set();
	const nodes = [];
	subjects.forEach((subject, index) => {
		const unit = index + 1;
		const last = index === subjects.length - 1;
		const unitNotes = selectedNotes.filter((n) => {
			if (usedNotes.has(n.id)) return false;
			const hay = `${n.title} ${folderName(folders, n.folderId)}`;
			if (matchesSubject(hay, subject) || last && !subjects.some((s) => s !== subject && matchesSubject(hay, s))) {
				usedNotes.add(n.id);
				return true;
			}
			return false;
		});
		const unitDecks = selectedDecks.filter((d) => {
			if (usedDecks.has(d.id)) return false;
			if (matchesSubject(d.name, subject) || last && !subjects.some((s) => s !== subject && matchesSubject(d.name, s))) {
				usedDecks.add(d.id);
				return true;
			}
			return false;
		});
		for (const note of unitNotes) nodes.push({
			id: `note:${note.id}:u${unit}`,
			kind: "note",
			title: note.title.trim() || "Untitled note",
			unit,
			unitTitle: subject,
			noteId: note.id,
			deckId: null,
			extra: null
		});
		for (const deck of unitDecks) nodes.push({
			id: `test:${deck.id}:u${unit}`,
			kind: "test",
			title: deck.name.split("::").pop() || deck.name,
			unit,
			unitTitle: subject,
			noteId: null,
			deckId: deck.id,
			extra: null
		});
		if (intake.weeklyTests) nodes.push({
			id: `weekly:u${unit}`,
			kind: "weekly",
			title: `Weekly check · ${subject}`,
			unit,
			unitTitle: subject,
			noteId: null,
			deckId: unitDecks[0]?.id ?? selectedDecks[0]?.id ?? null,
			extra: null
		});
	});
	if (intake.extraItems.length) {
		const unit = (nodes.at(-1)?.unit ?? 0) + 1;
		intake.extraItems.forEach((item, i) => {
			nodes.push({
				id: `extra:${i}:${item.slice(0, 24)}`,
				kind: "extra",
				title: item,
				unit,
				unitTitle: "Added to the target",
				noteId: null,
				deckId: null,
				extra: item
			});
		});
	}
	if (!nodes.length) {
		nodes.push({
			id: "extra:open-notes",
			kind: "extra",
			title: "Open Notes and add a reading",
			unit: 1,
			unitTitle: "Get started",
			noteId: null,
			deckId: null,
			extra: "notes"
		});
		nodes.push({
			id: "extra:open-tests",
			kind: "extra",
			title: "Open Tests and add a paper",
			unit: 1,
			unitTitle: "Get started",
			noteId: null,
			deckId: null,
			extra: "tests"
		});
	}
	const prev = existing ? normalizeExamPath(existing) : defaultExamPath();
	const keepDone = prev.progress.doneIds.filter((id) => nodes.some((n) => n.id === id));
	return {
		intake: {
			...intake,
			completed: true,
			examName: intake.examName.trim().slice(0, 80)
		},
		nodes,
		progress: {
			...prev.progress,
			doneIds: keepDone
		}
	};
}
function pathStarted(path, now = Date.now()) {
	if (!path.intake.startDate) return true;
	const start = new Date(path.intake.startDate);
	start.setHours(0, 0, 0, 0);
	return now >= start.getTime();
}
function currentNodeIndex(path) {
	const done = new Set(path.progress.doneIds);
	return path.nodes.findIndex((n) => !done.has(n.id));
}
function pathNodeState(path, index) {
	const node = path.nodes[index];
	if (!node) return "locked";
	if (path.progress.doneIds.includes(node.id)) return "done";
	const current = currentNodeIndex(path);
	if (current === -1) return "done";
	if (index === current) return "current";
	return "locked";
}
function todayStepCount(path, dayStartHour = 4, now = Date.now()) {
	const day = pathDayKey(now, dayStartHour);
	if (path.progress.lastActiveDay !== day) return 0;
	return Math.min(path.intake.dailyGoal, Math.ceil(path.progress.todayMarks / 10));
}
function dailyGoalMet(path, dayStartHour = 4, now = Date.now()) {
	return todayStepCount(path, dayStartHour, now) >= path.intake.dailyGoal;
}
function pathOverallPercent(path) {
	if (!path.nodes.length) return 0;
	return Math.round(path.progress.doneIds.length / path.nodes.length * 100);
}
function noteReadPercent(path, noteId) {
	if (!noteId) return 0;
	return Math.min(100, Math.max(0, path.progress.noteReads[noteId] ?? 0));
}
function testScoreOf(path, deckId) {
	if (!deckId) return null;
	const row = path.progress.testScores[deckId];
	return row ? row.percent : null;
}
function addMarks(path, amount, dayStartHour, now) {
	const rolled = rolloverPath(path, dayStartHour, now);
	const day = pathDayKey(now, dayStartHour);
	const yesterday = yesterdayKey(day);
	let streak = rolled.progress.streak;
	if (rolled.progress.lastActiveDay !== day) streak = rolled.progress.lastActiveDay === yesterday ? streak + 1 : 1;
	return {
		...rolled,
		progress: {
			...rolled.progress,
			marks: rolled.progress.marks + amount,
			todayMarks: rolled.progress.todayMarks + amount,
			weekMarks: rolled.progress.weekMarks + amount,
			lastActiveDay: day,
			streak
		}
	};
}
function completePathNode(path, nodeId, dayStartHour = 4, now = Date.now()) {
	if (path.progress.doneIds.includes(nodeId)) return path;
	const node = path.nodes.find((n) => n.id === nodeId);
	if (!node) return path;
	if (pathNodeState(path, path.nodes.findIndex((n) => n.id === nodeId)) === "locked") return path;
	const next = addMarks(path, node.kind === "weekly" ? 25 : node.kind === "test" ? 15 : 10, dayStartHour, now);
	return {
		...next,
		progress: {
			...next.progress,
			doneIds: [...next.progress.doneIds, nodeId]
		}
	};
}
function bumpNoteRead(path, noteId, delta, dayStartHour = 4, now = Date.now()) {
	const prev = noteReadPercent(path, noteId);
	const nextRead = Math.min(100, prev + Math.max(0, delta));
	if (nextRead === prev) return path;
	let next = {
		...path,
		progress: {
			...path.progress,
			noteReads: {
				...path.progress.noteReads,
				[noteId]: nextRead
			}
		}
	};
	if (nextRead >= 80) {
		const node = next.nodes.find((n) => n.kind === "note" && n.noteId === noteId && !next.progress.doneIds.includes(n.id));
		if (node && pathNodeState(next, next.nodes.indexOf(node)) !== "locked") next = completePathNode(next, node.id, dayStartHour, now);
	}
	return next;
}
function applySessionToPath(path, session, dayStartHour = 4) {
	if (!session || !session.deckId || !session.total) return path;
	const percent = Math.round(session.correct / session.total * 100);
	if (path.progress.testScores[session.deckId]?.sessionId === session.id) return path;
	let next = {
		...path,
		progress: {
			...path.progress,
			testScores: {
				...path.progress.testScores,
				[session.deckId]: {
					percent,
					at: session.at,
					sessionId: session.id
				}
			}
		}
	};
	const candidates = next.nodes.filter((n) => (n.kind === "test" || n.kind === "weekly") && n.deckId === session.deckId && !next.progress.doneIds.includes(n.id));
	for (const node of candidates) {
		if (pathNodeState(next, next.nodes.indexOf(node)) === "locked") continue;
		next = completePathNode(next, node.id, dayStartHour, session.at);
		break;
	}
	return next;
}
function formatPathDate(ts) {
	if (!ts) return "Not set";
	return new Date(ts).toLocaleDateString(void 0, {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function daysLeftLabel(examDate, now = Date.now()) {
	if (!examDate) return "No finish date";
	const days = Math.ceil((examDate - now) / 864e5);
	if (days < 0) return "Past the goal date";
	if (days === 0) return "Goal day is today";
	if (days === 1) return "1 day left";
	return `${days} days left`;
}
var DAILY_GOAL_OPTIONS = [
	{
		value: 1,
		label: "Easy",
		hint: "1 step a day"
	},
	{
		value: 2,
		label: "Steady",
		hint: "2 steps a day"
	},
	{
		value: 3,
		label: "Serious",
		hint: "3 steps a day"
	},
	{
		value: 5,
		label: "Sprint",
		hint: "5 steps a day"
	}
];
//#endregion
export { todayStepCount as _, completePathNode as a, daysLeftLabel as c, noteReadPercent as d, pathNodeState as f, testScoreOf as g, rolloverPath as h, bumpNoteRead as i, formatPathDate as l, pathStarted as m, applySessionToPath as n, currentNodeIndex as o, pathOverallPercent as p, buildExamPath as r, dailyGoalMet as s, DAILY_GOAL_OPTIONS as t, intakeReady as u };
