import { f as defaultLudoRules, r as LUDO_COLORS } from "./types-XZVWHhWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ludo-path-Bs2aZvF5.js
var TURN_ORDER = [
	"red",
	"green",
	"yellow",
	"blue"
];
var LUDO_COLOR_LABEL = {
	blue: "Blue",
	yellow: "Yellow",
	red: "Red",
	green: "Green"
};
function oppositeColor(color) {
	if (color === "red") return "yellow";
	if (color === "yellow") return "red";
	if (color === "green") return "blue";
	return "green";
}
function activeColorsOf(board) {
	if (board.playerMode === "four") return [...LUDO_COLORS];
	if (board.playerMode === "two") {
		const pair = [board.playerColor, oppositeColor(board.playerColor)];
		return LUDO_COLORS.filter((c) => pair.includes(c));
	}
	const listed = (board.activeColors ?? []).filter((c) => LUDO_COLORS.includes(c));
	return listed.length ? listed : [...LUDO_COLORS];
}
function isActiveSeat(board, color) {
	return activeColorsOf(board).includes(color);
}
function inferPlayerMode(colors) {
	if (colors.length === 4) return "four";
	if (colors.length === 2) return "two";
	return "custom";
}
function syncTurnToActive(board) {
	const active = activeColorsOf(board);
	if (!active.length) return board;
	if (active.includes(board.turnColor)) return {
		...board,
		bots: false
	};
	const turnColor = active.includes(board.playerColor) ? board.playerColor : active[0];
	return {
		...board,
		turnColor,
		bots: false
	};
}
function applyPlayerMode(board, mode) {
	const pair = [board.playerColor, oppositeColor(board.playerColor)];
	const activeColors = mode === "two" ? LUDO_COLORS.filter((c) => pair.includes(c)) : mode === "four" ? [...LUDO_COLORS] : activeColorsOf({
		...board,
		playerMode: "custom"
	});
	return syncTurnToActive({
		...board,
		playerMode: mode,
		activeColors,
		bots: false
	});
}
function applyActiveColors(board, colors) {
	const activeColors = LUDO_COLORS.filter((c) => colors.includes(c));
	if (!activeColors.length) return board;
	return syncTurnToActive({
		...board,
		activeColors,
		playerMode: inferPlayerMode(activeColors),
		bots: false
	});
}
/** Classic 15×15 Ludo path, clockwise from Blue's start square. */
var BLUE_PATH = [
	{
		r: 6,
		c: 1
	},
	{
		r: 6,
		c: 2
	},
	{
		r: 6,
		c: 3
	},
	{
		r: 6,
		c: 4
	},
	{
		r: 6,
		c: 5
	},
	{
		r: 5,
		c: 6
	},
	{
		r: 4,
		c: 6
	},
	{
		r: 3,
		c: 6
	},
	{
		r: 2,
		c: 6
	},
	{
		r: 1,
		c: 6
	},
	{
		r: 0,
		c: 6
	},
	{
		r: 0,
		c: 7
	},
	{
		r: 0,
		c: 8
	},
	{
		r: 1,
		c: 8
	},
	{
		r: 2,
		c: 8
	},
	{
		r: 3,
		c: 8
	},
	{
		r: 4,
		c: 8
	},
	{
		r: 5,
		c: 8
	},
	{
		r: 6,
		c: 9
	},
	{
		r: 6,
		c: 10
	},
	{
		r: 6,
		c: 11
	},
	{
		r: 6,
		c: 12
	},
	{
		r: 6,
		c: 13
	},
	{
		r: 6,
		c: 14
	},
	{
		r: 7,
		c: 14
	},
	{
		r: 8,
		c: 14
	},
	{
		r: 8,
		c: 13
	},
	{
		r: 8,
		c: 12
	},
	{
		r: 8,
		c: 11
	},
	{
		r: 8,
		c: 10
	},
	{
		r: 8,
		c: 9
	},
	{
		r: 9,
		c: 8
	},
	{
		r: 10,
		c: 8
	},
	{
		r: 11,
		c: 8
	},
	{
		r: 12,
		c: 8
	},
	{
		r: 13,
		c: 8
	},
	{
		r: 14,
		c: 8
	},
	{
		r: 14,
		c: 7
	},
	{
		r: 14,
		c: 6
	},
	{
		r: 13,
		c: 6
	},
	{
		r: 12,
		c: 6
	},
	{
		r: 11,
		c: 6
	},
	{
		r: 10,
		c: 6
	},
	{
		r: 9,
		c: 6
	},
	{
		r: 8,
		c: 5
	},
	{
		r: 8,
		c: 4
	},
	{
		r: 8,
		c: 3
	},
	{
		r: 8,
		c: 2
	},
	{
		r: 8,
		c: 1
	},
	{
		r: 8,
		c: 0
	},
	{
		r: 7,
		c: 0
	},
	{
		r: 6,
		c: 0
	}
];
var COLOR_OFFSET = {
	blue: 0,
	yellow: 13,
	green: 26,
	red: 39
};
var HOME_STRETCH = {
	blue: [
		{
			r: 7,
			c: 1
		},
		{
			r: 7,
			c: 2
		},
		{
			r: 7,
			c: 3
		},
		{
			r: 7,
			c: 4
		},
		{
			r: 7,
			c: 5
		}
	],
	yellow: [
		{
			r: 1,
			c: 7
		},
		{
			r: 2,
			c: 7
		},
		{
			r: 3,
			c: 7
		},
		{
			r: 4,
			c: 7
		},
		{
			r: 5,
			c: 7
		}
	],
	green: [
		{
			r: 7,
			c: 13
		},
		{
			r: 7,
			c: 12
		},
		{
			r: 7,
			c: 11
		},
		{
			r: 7,
			c: 10
		},
		{
			r: 7,
			c: 9
		}
	],
	red: [
		{
			r: 13,
			c: 7
		},
		{
			r: 12,
			c: 7
		},
		{
			r: 11,
			c: 7
		},
		{
			r: 10,
			c: 7
		},
		{
			r: 9,
			c: 7
		}
	]
};
var YARD_ORIGIN = {
	blue: {
		r: 0,
		c: 0
	},
	yellow: {
		r: 0,
		c: 9
	},
	green: {
		r: 9,
		c: 9
	},
	red: {
		r: 9,
		c: 0
	}
};
var HOME_SPOT = {
	blue: {
		r: 7,
		c: 6.35
	},
	yellow: {
		r: 6.35,
		c: 7
	},
	green: {
		r: 7,
		c: 7.65
	},
	red: {
		r: 7.65,
		c: 7
	}
};
var ARROW_DIR = {
	blue: "right",
	yellow: "down",
	green: "left",
	red: "up"
};
/** Path indices that are safe (starts + extra stars). */
var SAFE_INDICES = /* @__PURE__ */ new Set([
	0,
	8,
	13,
	21,
	26,
	34,
	39,
	47
]);
function pathIndex(color, steps) {
	return (COLOR_OFFSET[color] + steps) % 52;
}
function isSafeCell(color, steps) {
	if (steps < 0 || steps > 51) return true;
	return SAFE_INDICES.has(pathIndex(color, steps));
}
function cellKey(cell) {
	return `${Math.round(cell.r * 100) / 100},${Math.round(cell.c * 100) / 100}`;
}
function stretchOwner(r, c) {
	for (const color of LUDO_COLORS) if (HOME_STRETCH[color].some((p) => p.r === r && p.c === c)) return color;
	return null;
}
function startOwner(r, c) {
	for (const color of LUDO_COLORS) {
		const start = BLUE_PATH[COLOR_OFFSET[color]];
		if (start.r === r && start.c === c) return color;
	}
	return null;
}
function isSafeBoardCell(r, c) {
	return BLUE_PATH.some((p, i) => SAFE_INDICES.has(i) && p.r === r && p.c === c);
}
function inYard(r, c) {
	if (r < 6 && c < 6) return "blue";
	if (r < 6 && c > 8) return "yellow";
	if (r > 8 && c > 8) return "green";
	if (r > 8 && c < 6) return "red";
	return null;
}
function inHomeCenter(r, c) {
	return r >= 6 && r <= 8 && c >= 6 && c <= 8;
}
function onCross(r, c) {
	return r >= 6 && r <= 8 || c >= 6 && c <= 8;
}
function startCell(color) {
	return BLUE_PATH[COLOR_OFFSET[color]];
}
/** Exact 2×2 stump pads inside each yard, matching classic Ludo King. */
var YARD_PADS = [
	{
		r: 1.7,
		c: 1.7
	},
	{
		r: 1.7,
		c: 3.7
	},
	{
		r: 3.7,
		c: 1.7
	},
	{
		r: 3.7,
		c: 3.7
	}
];
function yardPad(color, index, count) {
	const origin = YARD_ORIGIN[color];
	if (count <= 4) {
		const pad = YARD_PADS[index] ?? YARD_PADS[0];
		return {
			r: origin.r + pad.r,
			c: origin.c + pad.c
		};
	}
	const n = Math.max(1, count);
	const cols = n <= 6 ? 3 : n <= 9 ? 3 : 4;
	const rows = Math.ceil(n / cols);
	const col = index % cols;
	const row = Math.floor(index / cols);
	const pad = 1.15;
	const span = 3.7;
	const x = pad + (col + .5) / cols * span;
	const y = pad + (row + .5) / rows * span;
	return {
		r: origin.r + y,
		c: origin.c + x
	};
}
function tokenCell(color, token, index, count) {
	if (token.steps < 0) return yardPad(color, index, count);
	if (token.steps >= 57) return HOME_SPOT[color];
	if (token.steps >= 52) return HOME_STRETCH[color][token.steps - 52] ?? HOME_SPOT[color];
	return BLUE_PATH[pathIndex(color, token.steps)] ?? yardPad(color, index, count);
}
function columnFinished(col) {
	return col.tokens.length > 0 && col.tokens.every((t) => t.steps >= 57);
}
var DAY_MS = 864e5;
function ludoTodayKey(now = Date.now()) {
	const d = new Date(now);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
var DAY_NAME_DOW = {
	sun: 0,
	sunday: 0,
	mon: 1,
	monday: 1,
	tue: 2,
	tues: 2,
	tuesday: 2,
	wed: 3,
	wednesday: 3,
	thu: 4,
	thur: 4,
	thursday: 4,
	fri: 5,
	friday: 5,
	sat: 6,
	saturday: 6
};
function dayNameToDow(name) {
	const key = name.trim().toLowerCase();
	if (key in DAY_NAME_DOW) return DAY_NAME_DOW[key];
	const short = key.slice(0, 3);
	return short in DAY_NAME_DOW ? DAY_NAME_DOW[short] : null;
}
function nextDateForDow(dow, now = Date.now()) {
	const d = new Date(now);
	let add = (dow - d.getDay() + 7) % 7;
	if (add === 0) add = 7;
	d.setDate(d.getDate() + add);
	return ludoTodayKey(d.getTime());
}
function addRestDate(board, dateKey) {
	if (board.restDates.includes(dateKey)) return board;
	return {
		...board,
		restDates: [...board.restDates, dateKey].slice(-60)
	};
}
function ludoIsResting(board, now = Date.now()) {
	if (board.startedAt != null && now < board.startedAt) return true;
	const today = ludoTodayKey(now);
	if ((board.restDates ?? []).includes(today)) return true;
	const dow = new Date(now).getDay();
	return (board.restDays ?? []).includes(dow);
}
function ludoHasStarted(board, now = Date.now()) {
	if (board.startedAt == null) return false;
	return now >= board.startedAt;
}
function canLand(steps, pips) {
	if (steps + pips > 57) return false;
	return true;
}
function rulesOf(board) {
	return board.rules ?? defaultLudoRules();
}
function canEnterYard(board, color, pips) {
	const col = board.columns.find((c) => c.color === color);
	if (!col) return false;
	if (rulesOf(board).enterOnOneOrSix) return pips === 1 || pips === 6;
	return pips === col.entryTurn;
}
function wouldCapture(board, color, destSteps) {
	if (destSteps < 0 || destSteps > 51) return false;
	if (isSafeCell(color, destSteps)) return false;
	const dest = BLUE_PATH[pathIndex(color, destSteps)];
	if (!dest) return false;
	return board.columns.some((col) => {
		if (col.color === color) return false;
		return col.tokens.some((t) => {
			if (t.steps < 0 || t.steps > 51) return false;
			const cell = BLUE_PATH[pathIndex(col.color, t.steps)];
			return cell && cell.r === dest.r && cell.c === dest.c;
		});
	});
}
function captureHits(board, color, destSteps) {
	if (destSteps < 0 || destSteps > 51) return [];
	if (isSafeCell(color, destSteps)) return [];
	const dest = BLUE_PATH[pathIndex(color, destSteps)];
	if (!dest) return [];
	const hits = [];
	for (const col of board.columns) {
		if (col.color === color) continue;
		for (const t of col.tokens) {
			if (t.steps < 0 || t.steps > 51) continue;
			const cell = BLUE_PATH[pathIndex(col.color, t.steps)];
			if (cell && cell.r === dest.r && cell.c === dest.c) hits.push({
				color: col.color,
				token: t
			});
		}
	}
	return hits;
}
function sendHomeIfCaptured(board, color, destSteps) {
	if (destSteps < 0 || destSteps > 51) return board;
	if (isSafeCell(color, destSteps)) return board;
	const dest = BLUE_PATH[pathIndex(color, destSteps)];
	if (!dest) return board;
	return {
		...board,
		columns: board.columns.map((col) => {
			if (col.color === color) return col;
			return {
				...col,
				tokens: col.tokens.map((t) => {
					if (t.steps < 0 || t.steps > 51) return t;
					const cell = BLUE_PATH[pathIndex(col.color, t.steps)];
					if (cell && cell.r === dest.r && cell.c === dest.c) return {
						...t,
						steps: -1
					};
					return t;
				})
			};
		})
	};
}
function setTokenSteps(board, color, tokenId, steps) {
	return {
		...board,
		columns: board.columns.map((col) => col.color === color ? {
			...col,
			tokens: col.tokens.map((t) => t.id === tokenId ? {
				...t,
				steps
			} : t)
		} : col)
	};
}
function boardCellKey(color, steps) {
	const cell = tokenCell(color, { steps }, 0, 1);
	return cellKey({
		r: Math.round(cell.r),
		c: Math.round(cell.c)
	});
}
function restDateForToken(token, now = Date.now()) {
	const dow = dayNameToDow(token.dayName);
	if (dow != null) return nextDateForDow(dow, now);
	const d = new Date(now);
	d.setDate(d.getDate() + 1);
	return ludoTodayKey(d.getTime());
}
function applyLandingEffects(board, color, tokenId, now = Date.now()) {
	const token = board.columns.find((c) => c.color === color)?.tokens.find((t) => t.id === tokenId);
	if (!token || token.steps < 0 || token.steps >= 57) return board;
	let steps = token.steps;
	let next = board;
	const sundayKey = rulesOf(board).sundayBoxes ? token.sundayKey : null;
	const here = boardCellKey(color, steps);
	const hereNote = next.cells[here];
	const onSunday = Boolean(sundayKey && sundayKey === here) || hereNote?.kind === "sunday";
	if (rulesOf(board).sundayBoxes && onSunday) {
		next = addRestDate(next, nextDateForDow(0, now));
		if (canLand(steps, 1)) {
			steps += 1;
			next = setTokenSteps(next, color, tokenId, steps);
		}
	}
	const after = boardCellKey(color, steps);
	const arrayNote = next.cells[after];
	if (rulesOf(board).skipArray && arrayNote?.kind === "array") {
		const hop = arrayNote.skip > 0 ? arrayNote.skip : rulesOf(next).skipSteps;
		if (canLand(steps, hop)) {
			steps += hop;
			next = setTokenSteps(next, color, tokenId, steps);
			next = addRestDate(next, restDateForToken(token, now));
		}
	}
	return next;
}
function legalMoves(board, color, pips) {
	const col = board.columns.find((c) => c.color === color);
	if (!col || pips <= 0) return [];
	const out = [];
	col.tokens.forEach((token) => {
		if (token.steps < 0) {
			if (!canEnterYard(board, color, pips)) return;
			const toSteps = 0;
			out.push({
				tokenId: token.id,
				fromSteps: -1,
				toSteps,
				capture: wouldCapture(board, color, toSteps),
				home: false,
				enter: true
			});
			return;
		}
		if (token.steps >= 57) return;
		if (!canLand(token.steps, pips)) return;
		const toSteps = token.steps + pips;
		out.push({
			tokenId: token.id,
			fromSteps: token.steps,
			toSteps,
			capture: wouldCapture(board, color, toSteps),
			home: toSteps >= 57,
			enter: false
		});
	});
	return out;
}
function rollDie() {
	return 1 + Math.floor(Math.random() * 6);
}
function rolledToday(board, color, now = Date.now()) {
	return (board.studentRolls ?? {})[color] === ludoTodayKey(now);
}
function nextTurnColor(board, from, now = Date.now()) {
	const start = TURN_ORDER.indexOf(from);
	let fallback = from;
	for (let i = 1; i <= TURN_ORDER.length; i++) {
		const color = TURN_ORDER[(start + i) % TURN_ORDER.length];
		const col = board.columns.find((c) => c.color === color);
		if (!col || columnFinished(col)) continue;
		if (!isActiveSeat(board, color)) continue;
		fallback = color;
		if (rulesOf(board).oncePerDay && rolledToday(board, color, now)) continue;
		return color;
	}
	return fallback;
}
function stampTime(board, patch) {
	return {
		...board,
		...patch,
		lastMoveAt: Date.now()
	};
}
function passTurn(board, now = Date.now()) {
	if (board.phase === "won") return board;
	if (board.phase === "challenge") return board;
	if (board.extraTurns > 0) return stampTime(board, {
		extraTurns: board.extraTurns - 1,
		phase: "roll",
		pendingCell: null
	});
	const today = ludoTodayKey(now);
	const studentRolls = rulesOf(board).oncePerDay ? {
		...board.studentRolls ?? {},
		[board.turnColor]: today
	} : board.studentRolls ?? {};
	const stamped = {
		...board,
		studentRolls
	};
	return stampTime(stamped, {
		turnColor: nextTurnColor(stamped, board.turnColor, now),
		phase: "roll",
		pendingCell: null,
		consecutiveSixes: 0
	});
}
function applyRoll(board, pips) {
	if (board.phase === "won" || board.phase === "challenge") return board;
	const value = Math.min(6, Math.max(1, pips));
	let sixes = board.consecutiveSixes;
	if (rulesOf(board).standardLudo && value === 6) {
		sixes += 1;
		if (sixes >= 3) return passTurn({
			...board,
			lastPips: value,
			consecutiveSixes: 0
		});
	} else sixes = 0;
	if (!legalMoves(board, board.turnColor, value).length) {
		const next = stampTime(board, {
			lastPips: value,
			consecutiveSixes: sixes,
			phase: "roll"
		});
		if (rulesOf(board).standardLudo && value === 6) return next;
		return passTurn(next);
	}
	return stampTime(board, {
		lastPips: value,
		consecutiveSixes: sixes,
		phase: "move",
		pendingCell: null
	});
}
function commitMove(board, color, move, _pips) {
	const col = board.columns.find((c) => c.color === color);
	if (!col) return {
		board,
		capture: false,
		home: false,
		hit: null
	};
	const hits = move.capture ? captureHits(board, color, move.toSteps) : [];
	const tokens = col.tokens.map((t) => t.id === move.tokenId ? {
		...t,
		steps: move.toSteps
	} : t);
	let next = {
		...board,
		columns: board.columns.map((c) => c.color === color ? {
			...c,
			tokens
		} : c)
	};
	if (move.capture) next = sendHomeIfCaptured(next, color, move.toSteps);
	next = applyLandingEffects(next, color, move.tokenId);
	const finished = next.columns.find((c) => c.color === color);
	if (finished ? columnFinished(finished) : false) {
		next = stampTime(next, {
			winner: color,
			phase: "won",
			pendingCell: null
		});
		return {
			board: next,
			capture: move.capture,
			home: move.home,
			hit: hits[0] ?? null
		};
	}
	return {
		board: next,
		capture: move.capture,
		home: move.home,
		hit: hits[0] ?? null
	};
}
function cellNote(board, key) {
	const note = board.cells[key];
	if (!note) return null;
	if (!note.label.trim() && !note.content.trim() && note.kind === "note") return null;
	return note;
}
function playMove(board, color, tokenId, pips) {
	const move = legalMoves(board, color, pips).find((m) => m.tokenId === tokenId);
	if (!move) return board;
	const result = commitMove(board, color, move, pips);
	if (result.board.phase === "won") return result.board;
	if (result.capture && result.hit && rulesOf(board).captureTest) {
		const challenge = {
			id: `cap-${Date.now()}`,
			capturerColor: color,
			capturedColor: result.hit.color,
			tokenId: result.hit.token.id,
			tokenName: result.hit.token.name || result.hit.token.dayName || "subject",
			deckId: result.hit.token.deckId,
			passingScore: rulesOf(board).passingScore,
			status: "pending-set",
			createdAt: Date.now(),
			sessionId: null
		};
		return stampTime(result.board, {
			challenge,
			phase: "challenge",
			pendingCell: null
		});
	}
	const destToken = result.board.columns.find((c) => c.color === color)?.tokens.find((t) => t.id === tokenId);
	const destCell = destToken ? tokenCell(color, destToken, 0, 1) : startCell(color);
	const key = cellKey({
		r: Math.round(destCell.r),
		c: Math.round(destCell.c)
	});
	const note = destToken && destToken.steps >= 0 && destToken.steps < 57 ? cellNote(result.board, key) : null;
	const showStudy = Boolean(note && note.kind !== "array" && (note.label.trim() || note.content.trim()));
	let extra = 0;
	if (rulesOf(board).standardLudo) {
		if (pips === 6) extra += 1;
		if (result.capture) extra += 1;
		if (result.home) extra += 1;
	}
	let next = stampTime(result.board, {
		extraTurns: result.board.extraTurns + extra,
		pendingCell: showStudy ? key : null,
		phase: showStudy ? "study" : "roll"
	});
	if (next.phase === "study") return next;
	return passTurn({
		...next,
		extraTurns: extra > 0 ? next.extraTurns : next.extraTurns
	});
}
function dismissStudy(board) {
	if (board.phase !== "study") return board;
	return passTurn({
		...board,
		phase: "roll",
		pendingCell: null
	});
}
function setChallengeTest(board, deckId, passingScore) {
	if (!board.challenge || board.challenge.status !== "pending-set") return board;
	const score = passingScore ?? board.challenge.passingScore;
	return passTurn({
		...board,
		challenge: {
			...board.challenge,
			deckId,
			passingScore: Math.min(100, Math.max(1, score)),
			status: "pending-take"
		},
		phase: "roll"
	});
}
function sessionPercent(session) {
	if (!session.total) return 0;
	return Math.round(session.correct / session.total * 100);
}
function resolveChallengeFromSession(board, session) {
	const ch = board.challenge;
	if (!ch || ch.status !== "pending-take") return board;
	if (!ch.deckId || session.deckId !== ch.deckId) return board;
	if (ch.sessionId === session.id) return board;
	const passed = sessionPercent(session) >= ch.passingScore;
	let next = {
		...board,
		lastTestId: session.id,
		challenge: passed ? null : {
			...ch,
			sessionId: session.id,
			status: "pending-take"
		}
	};
	if (!passed) {
		const skipDay = nextDateForDow((/* @__PURE__ */ new Date()).getDay() === 0 ? 1 : (/* @__PURE__ */ new Date()).getDay(), Date.now());
		next = addRestDate(next, skipDay);
	}
	return stampTime(next, {});
}
function dismissChallenge(board) {
	if (!board.challenge) return board;
	const next = {
		...board,
		challenge: null,
		phase: board.phase === "challenge" ? "roll" : board.phase
	};
	if (board.phase === "challenge") return passTurn(next);
	return next;
}
function pickBotMove(board, color, pips) {
	const moves = legalMoves(board, color, pips);
	if (!moves.length) return null;
	const rank = (m) => (m.capture ? 400 : 0) + (m.home ? 300 : 0) + (m.enter ? 200 : 0) + m.toSteps;
	return [...moves].sort((a, b) => rank(b) - rank(a))[0] ?? null;
}
function isBotColumn(_board, _color, _humanColor) {
	return false;
}
function ludoSeatName(board, color, myColor = board.playerColor) {
	const named = board.columns.find((c) => c.color === color)?.studentName.trim();
	if (named) return named;
	if (color === myColor) return "You";
	return LUDO_COLOR_LABEL[color];
}
function ludoSeatInitial(name) {
	const t = name.trim();
	if (!t) return "?";
	const parts = t.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
	return t.slice(0, 1).toUpperCase();
}
function homeCount(board, color) {
	return board.columns.find((c) => c.color === color)?.tokens.filter((t) => t.steps >= 57).length ?? 0;
}
function capturedRival(prev, next) {
	for (const col of prev.columns) {
		const after = next.columns.find((c) => c.color === col.color);
		if (!after) continue;
		for (const t of col.tokens) {
			if (t.steps < 0) continue;
			const n = after.tokens.find((x) => x.id === t.id);
			if (n && n.steps < 0) return col.color;
		}
	}
	return null;
}
function flashesFromBoards(prev, next) {
	if (prev === next) return [];
	const out = [];
	if (next.phase === "won" && next.winner && prev.phase !== "won") {
		out.push({
			kind: "win",
			actor: next.winner
		});
		return out;
	}
	const actor = prev.turnColor;
	if (next.lastPips > 0 && next.lastPips !== prev.lastPips && prev.phase === "roll") {
		if (next.phase === "move") out.push({
			kind: "roll",
			actor,
			pips: next.lastPips
		});
		else if (prev.consecutiveSixes >= 2 && next.lastPips === 6) out.push({
			kind: "threeSix",
			actor,
			pips: 6
		});
		else if (next.turnColor !== prev.turnColor) out.push({
			kind: "skip",
			actor,
			pips: next.lastPips
		});
		else out.push({
			kind: "roll",
			actor,
			pips: next.lastPips
		});
	}
	const captured = next.challenge && next.challenge.id !== prev.challenge?.id ? next.challenge.capturedColor : capturedRival(prev, next);
	if (captured) {
		const capturer = next.challenge?.capturerColor ?? actor;
		out.push({
			kind: "capture",
			actor: capturer,
			other: captured
		});
	}
	if (homeCount(next, actor) > homeCount(prev, actor)) out.push({
		kind: "home",
		actor
	});
	if (next.turnColor === prev.turnColor && next.phase === "roll" && (prev.phase === "move" || prev.phase === "study") && !next.challenge) out.push({
		kind: "extra",
		actor: next.turnColor,
		pips: next.lastPips
	});
	if (next.turnColor !== prev.turnColor && next.phase === "roll") out.push({
		kind: "turn",
		actor: next.turnColor
	});
	return out;
}
function popupCopy(flash, board, myColor) {
	const name = ludoSeatName(board, flash.actor, myColor);
	const mine = flash.actor === myColor;
	switch (flash.kind) {
		case "turn": return {
			title: mine ? "Your Turn" : `${name}'s Turn`,
			detail: mine ? "Tap the die to roll" : `${name} is playing`
		};
		case "roll": return {
			title: `${name} rolled ${flash.pips}`,
			detail: mine ? "Tap a glowing piece" : `${name} is moving`
		};
		case "skip": return {
			title: `${name} rolled ${flash.pips}`,
			detail: "Need a 1 or 6 to leave the yard"
		};
		case "capture": {
			const other = flash.other ? ludoSeatName(board, flash.other, myColor) : "a rival";
			return {
				title: `${name} captured ${other}`,
				detail: board.rules.captureTest ? `${other} must pass a test` : `${other} goes back to the yard`
			};
		}
		case "extra": return {
			title: mine ? "Extra roll" : `${name} rolls again`,
			detail: flash.pips === 6 ? "Rolled a 6" : "Bonus turn"
		};
		case "home": return {
			title: `${name} reached home`,
			detail: "Subject is in"
		};
		case "threeSix": return {
			title: "Three sixes",
			detail: `${name} forfeits the turn`
		};
		case "win": return {
			title: mine ? "You win" : `${name} wins`,
			detail: "Exam target cleared"
		};
	}
}
function canColorRoll(board, color, now = Date.now()) {
	if (board.phase === "won" || board.phase === "challenge") return false;
	if (board.phase !== "roll") return false;
	if (!ludoHasStarted(board, now) || ludoIsResting(board, now)) return false;
	if (!isActiveSeat(board, color)) return false;
	if (board.turnColor !== color) return false;
	if (board.challenge?.status === "pending-take" && board.challenge.capturedColor === color) return false;
	if (board.extraTurns > 0) return true;
	if (rulesOf(board).oncePerDay && rolledToday(board, color, now)) return false;
	return true;
}
function whyCantRoll(board, color, now = Date.now()) {
	if (board.phase === "won") return "This match is over. Start a new match to roll again.";
	if (board.phase === "challenge") return "Finish the capture test before rolling.";
	if (board.phase === "study") return "Review the notebook box, then continue.";
	if (board.phase === "move") return "Tap a glowing piece, or tap the die again to move.";
	if (!ludoHasStarted(board, now)) return "The target has not started yet.";
	if (ludoIsResting(board, now)) return "Rest day — the die waits.";
	if (board.challenge?.status === "pending-take" && board.challenge.capturedColor === color) return "Pass the capture test before you roll.";
	if (!isActiveSeat(board, color)) return "This column is not in the target.";
	if (board.turnColor !== color) return `Waiting for ${ludoSeatName(board, board.turnColor, color)}.`;
	if (rulesOf(board).oncePerDay && rolledToday(board, color, now) && board.extraTurns === 0) return "You already rolled today. Come back tomorrow.";
	return null;
}
function setCellNote(board, key, note) {
	const label = note.label.trim().slice(0, 24);
	const content = note.content.trim().slice(0, 2e3);
	const kind = note.kind === "array" || note.kind === "sunday" ? note.kind : "note";
	const skip = Math.min(12, Math.max(0, Number(note.skip) || 0));
	const sundayTokenId = note.sundayTokenId ?? null;
	const sundayColor = note.sundayColor ?? null;
	const cells = { ...board.cells };
	if (!label && !content && kind === "note" && !sundayTokenId) delete cells[key];
	else cells[key] = {
		label,
		content,
		kind,
		skip,
		sundayTokenId,
		sundayColor
	};
	let columns = board.columns;
	if (kind === "sunday" && sundayTokenId && sundayColor) columns = board.columns.map((col) => col.color === sundayColor ? {
		...col,
		tokens: col.tokens.map((t) => t.id === sundayTokenId ? {
			...t,
			sundayKey: key
		} : t.sundayKey === key ? {
			...t,
			sundayKey: null
		} : t)
	} : {
		...col,
		tokens: col.tokens.map((t) => t.sundayKey === key ? {
			...t,
			sundayKey: null
		} : t)
	});
	return {
		...board,
		cells,
		columns
	};
}
function placeSundayBox(board, color, tokenId, key) {
	const prev = (board.columns.find((c) => c.color === color)?.tokens.find((t) => t.id === tokenId))?.sundayKey;
	const cells = { ...board.cells };
	if (prev && cells[prev]?.kind === "sunday" && cells[prev]?.sundayTokenId === tokenId) {
		const leftover = cells[prev];
		if (!leftover.label && !leftover.content) delete cells[prev];
		else cells[prev] = {
			...leftover,
			kind: "note",
			sundayTokenId: null,
			sundayColor: null
		};
	}
	const existing = cells[key];
	cells[key] = {
		label: existing?.label || "Sun",
		content: existing?.content || "Sunday rest box for this subject.",
		kind: "sunday",
		skip: existing?.skip ?? 0,
		sundayTokenId: tokenId,
		sundayColor: color
	};
	return {
		...board,
		cells,
		columns: board.columns.map((col) => ({
			...col,
			tokens: col.tokens.map((t) => {
				if (t.id === tokenId) return {
					...t,
					sundayKey: key
				};
				if (t.sundayKey === key) return {
					...t,
					sundayKey: null
				};
				return t;
			})
		}))
	};
}
function placeArrayBox(board, key, skip = rulesOf(board).skipSteps) {
	const existing = board.cells[key];
	return {
		...board,
		cells: {
			...board.cells,
			[key]: {
				label: existing?.label || "Array",
				content: existing?.content || "Landing here skips the subject ahead. The skipped study day becomes rest.",
				kind: "array",
				skip: Math.min(12, Math.max(1, skip)),
				sundayTokenId: existing?.sundayTokenId ?? null,
				sundayColor: existing?.sundayColor ?? null
			}
		}
	};
}
function addCustomRule(board, title, detail) {
	const clean = title.trim().slice(0, 80);
	if (!clean) return board;
	const rule = {
		id: `custom-${Date.now()}`,
		title: clean,
		detail: detail.trim().slice(0, 800),
		enabled: true
	};
	return {
		...board,
		customRules: [...board.customRules, rule].slice(0, 24)
	};
}
function patchCustomRule(board, id, patch) {
	return {
		...board,
		customRules: board.customRules.map((r) => r.id === id ? {
			...r,
			title: patch.title != null ? patch.title.trim().slice(0, 80) || r.title : r.title,
			detail: patch.detail != null ? patch.detail.trim().slice(0, 800) : r.detail,
			enabled: patch.enabled ?? r.enabled
		} : r)
	};
}
function removeCustomRule(board, id) {
	return {
		...board,
		customRules: board.customRules.filter((r) => r.id !== id)
	};
}
function resetMatch(board) {
	const active = activeColorsOf(board);
	const turnColor = active.includes(board.playerColor) ? board.playerColor : active[0] ?? board.playerColor;
	return {
		...board,
		turnColor,
		phase: "roll",
		consecutiveSixes: 0,
		extraTurns: 0,
		winner: null,
		pendingCell: null,
		lastPips: 6,
		lastMoveAt: Date.now(),
		challenge: null,
		studentRolls: {},
		bots: false,
		columns: board.columns.map((c) => ({
			...c,
			tokens: c.tokens.map((t) => ({
				...t,
				steps: -1
			}))
		}))
	};
}
function tickLudoFromActivity(board, lastSession, notes, now = Date.now()) {
	const maxNote = notes.reduce((m, n) => Math.max(m, n.modifiedAt || 0), 0);
	let next = board;
	if (next.lastMoveAt == null) next = {
		...next,
		lastNoteAt: Math.max(next.lastNoteAt || 0, maxNote),
		lastMoveAt: 0
	};
	if (next.phase === "won") return {
		board: next,
		moved: false,
		reason: "wait"
	};
	if (lastSession && next.challenge?.status === "pending-take") {
		const resolved = resolveChallengeFromSession(next, lastSession);
		if (resolved !== next && resolved.challenge !== next.challenge) return {
			board: resolved,
			moved: true,
			reason: "challenge"
		};
		if (resolved.lastTestId === lastSession.id && next.lastTestId !== lastSession.id) return {
			board: resolved,
			moved: false,
			reason: "challenge"
		};
	}
	if (!ludoHasStarted(next, now) || ludoIsResting(next, now)) {
		if (lastSession?.id && lastSession.id !== next.lastTestId) next = {
			...next,
			lastTestId: lastSession.id
		};
		if (maxNote > (next.lastNoteAt || 0)) next = {
			...next,
			lastNoteAt: maxNote
		};
		return {
			board: next,
			moved: false,
			reason: "rest"
		};
	}
	if (lastSession?.id && lastSession.id !== next.lastTestId) {
		if (next.challenge?.deckId === lastSession.deckId && next.challenge.status === "pending-take") return {
			board: {
				...next,
				lastTestId: lastSession.id
			},
			moved: false,
			reason: "challenge"
		};
		return {
			board: {
				...next,
				lastTestId: lastSession.id,
				extraTurns: next.extraTurns + (next.fastMode ? 2 : 1),
				turnColor: next.playerColor,
				phase: "roll",
				pendingCell: null,
				lastPips: 6,
				lastMoveAt: now
			},
			moved: true,
			reason: "test"
		};
	}
	if (maxNote > (next.lastNoteAt || 0) && maxNote >= (next.startedAt || 0)) return {
		board: {
			...next,
			lastNoteAt: maxNote,
			extraTurns: next.extraTurns + 1,
			turnColor: next.playerColor,
			phase: "roll",
			pendingCell: null,
			lastPips: Math.min(6, next.fastMode ? 4 : 2),
			lastMoveAt: now
		},
		moved: true,
		reason: "note"
	};
	return {
		board: next,
		moved: false,
		reason: "wait"
	};
}
function daysToLudoExam(examDate, now = Date.now()) {
	if (!examDate) return null;
	return (examDate - now) / DAY_MS;
}
//#endregion
export { placeSundayBox as A, stretchOwner as B, ludoSeatInitial as C, patchCustomRule as D, passTurn as E, rollDie as F, tokenCell as H, rolledToday as I, setCellNote as L, popupCopy as M, removeCustomRule as N, pickBotMove as O, resetMatch as P, setChallengeTest as R, ludoIsResting as S, onCross as T, whyCantRoll as U, tickLudoFromActivity as V, yardPad as W, isActiveSeat as _, applyActiveColors as a, legalMoves as b, canColorRoll as c, daysToLudoExam as d, dismissChallenge as f, inYard as g, inHomeCenter as h, addCustomRule as i, playMove as j, placeArrayBox as k, cellKey as l, flashesFromBoards as m, LUDO_COLOR_LABEL as n, applyPlayerMode as o, dismissStudy as p, YARD_ORIGIN as r, applyRoll as s, ARROW_DIR as t, cellNote as u, isBotColumn as v, ludoSeatName as w, ludoHasStarted as x, isSafeBoardCell as y, startOwner as z };
