import {
  defaultLudoRules,
  LUDO_COLORS,
  LUDO_HOME_STEPS,
  type LudoBoard,
  type LudoCellKind,
  type LudoCellNote,
  type LudoChallenge,
  type LudoColor,
  type LudoColumn,
  type LudoCustomRule,
  type LudoPlayerMode,
  type LudoToken,
  type Note,
  type SessionSummary,
} from "./types";

export type Cell = { r: number; c: number };

export type LudoMove = {
  tokenId: string;
  fromSteps: number;
  toSteps: number;
  capture: boolean;
  home: boolean;
  enter: boolean;
};

export const TURN_ORDER: LudoColor[] = ["red", "green", "yellow", "blue"];

export const LUDO_COLOR_LABEL: Record<LudoColor, string> = {
  blue: "Blue",
  yellow: "Yellow",
  red: "Red",
  green: "Green",
};

export function oppositeColor(color: LudoColor): LudoColor {
  if (color === "red") return "yellow";
  if (color === "yellow") return "red";
  if (color === "green") return "blue";
  return "green";
}

export function activeColorsOf(board: LudoBoard): LudoColor[] {
  if (board.playerMode === "four") return [...LUDO_COLORS];
  if (board.playerMode === "two") {
    const pair = [board.playerColor, oppositeColor(board.playerColor)];
    return LUDO_COLORS.filter((c) => pair.includes(c));
  }
  const listed = (board.activeColors ?? []).filter((c) => LUDO_COLORS.includes(c));
  return listed.length ? listed : [...LUDO_COLORS];
}

export function isActiveSeat(board: LudoBoard, color: LudoColor): boolean {
  return activeColorsOf(board).includes(color);
}

export function inferPlayerMode(colors: LudoColor[]): LudoPlayerMode {
  if (colors.length === 4) return "four";
  if (colors.length === 2) return "two";
  return "custom";
}

function syncTurnToActive(board: LudoBoard): LudoBoard {
  const active = activeColorsOf(board);
  if (!active.length) return board;
  if (active.includes(board.turnColor)) return { ...board, bots: false };
  const turnColor = active.includes(board.playerColor) ? board.playerColor : active[0]!;
  return { ...board, turnColor, bots: false };
}

export function applyPlayerMode(board: LudoBoard, mode: LudoPlayerMode): LudoBoard {
  const pair = [board.playerColor, oppositeColor(board.playerColor)];
  const activeColors =
    mode === "two" ? LUDO_COLORS.filter((c) => pair.includes(c)) : mode === "four" ? [...LUDO_COLORS] : activeColorsOf({ ...board, playerMode: "custom" });
  return syncTurnToActive({ ...board, playerMode: mode, activeColors, bots: false });
}

export function applyActiveColors(board: LudoBoard, colors: LudoColor[]): LudoBoard {
  const activeColors = LUDO_COLORS.filter((c) => colors.includes(c));
  if (!activeColors.length) return board;
  return syncTurnToActive({
    ...board,
    activeColors,
    playerMode: inferPlayerMode(activeColors),
    bots: false,
  });
}

/** Classic 15×15 Ludo path, clockwise from Blue's start square. */
export const BLUE_PATH: Cell[] = [
  { r: 6, c: 1 },
  { r: 6, c: 2 },
  { r: 6, c: 3 },
  { r: 6, c: 4 },
  { r: 6, c: 5 },
  { r: 5, c: 6 },
  { r: 4, c: 6 },
  { r: 3, c: 6 },
  { r: 2, c: 6 },
  { r: 1, c: 6 },
  { r: 0, c: 6 },
  { r: 0, c: 7 },
  { r: 0, c: 8 },
  { r: 1, c: 8 },
  { r: 2, c: 8 },
  { r: 3, c: 8 },
  { r: 4, c: 8 },
  { r: 5, c: 8 },
  { r: 6, c: 9 },
  { r: 6, c: 10 },
  { r: 6, c: 11 },
  { r: 6, c: 12 },
  { r: 6, c: 13 },
  { r: 6, c: 14 },
  { r: 7, c: 14 },
  { r: 8, c: 14 },
  { r: 8, c: 13 },
  { r: 8, c: 12 },
  { r: 8, c: 11 },
  { r: 8, c: 10 },
  { r: 8, c: 9 },
  { r: 9, c: 8 },
  { r: 10, c: 8 },
  { r: 11, c: 8 },
  { r: 12, c: 8 },
  { r: 13, c: 8 },
  { r: 14, c: 8 },
  { r: 14, c: 7 },
  { r: 14, c: 6 },
  { r: 13, c: 6 },
  { r: 12, c: 6 },
  { r: 11, c: 6 },
  { r: 10, c: 6 },
  { r: 9, c: 6 },
  { r: 8, c: 5 },
  { r: 8, c: 4 },
  { r: 8, c: 3 },
  { r: 8, c: 2 },
  { r: 8, c: 1 },
  { r: 8, c: 0 },
  { r: 7, c: 0 },
  { r: 6, c: 0 },
];

export const COLOR_OFFSET: Record<LudoColor, number> = {
  blue: 0,
  yellow: 13,
  green: 26,
  red: 39,
};

export const HOME_STRETCH: Record<LudoColor, Cell[]> = {
  blue: [
    { r: 7, c: 1 },
    { r: 7, c: 2 },
    { r: 7, c: 3 },
    { r: 7, c: 4 },
    { r: 7, c: 5 },
  ],
  yellow: [
    { r: 1, c: 7 },
    { r: 2, c: 7 },
    { r: 3, c: 7 },
    { r: 4, c: 7 },
    { r: 5, c: 7 },
  ],
  green: [
    { r: 7, c: 13 },
    { r: 7, c: 12 },
    { r: 7, c: 11 },
    { r: 7, c: 10 },
    { r: 7, c: 9 },
  ],
  red: [
    { r: 13, c: 7 },
    { r: 12, c: 7 },
    { r: 11, c: 7 },
    { r: 10, c: 7 },
    { r: 9, c: 7 },
  ],
};

export const YARD_ORIGIN: Record<LudoColor, Cell> = {
  blue: { r: 0, c: 0 },
  yellow: { r: 0, c: 9 },
  green: { r: 9, c: 9 },
  red: { r: 9, c: 0 },
};

export const HOME_SPOT: Record<LudoColor, Cell> = {
  blue: { r: 7, c: 6.35 },
  yellow: { r: 6.35, c: 7 },
  green: { r: 7, c: 7.65 },
  red: { r: 7.65, c: 7 },
};

export const ARROW_DIR: Record<LudoColor, "right" | "down" | "left" | "up"> = {
  blue: "right",
  yellow: "down",
  green: "left",
  red: "up",
};

/** Path indices that are safe (starts + extra stars). */
export const SAFE_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export function pathIndex(color: LudoColor, steps: number): number {
  return (COLOR_OFFSET[color] + steps) % 52;
}

export function isSafeCell(color: LudoColor, steps: number): boolean {
  if (steps < 0 || steps > 51) return true;
  return SAFE_INDICES.has(pathIndex(color, steps));
}

export function cellKey(cell: Cell): string {
  return `${Math.round(cell.r * 100) / 100},${Math.round(cell.c * 100) / 100}`;
}

export function parseCellKey(key: string): Cell | null {
  const [r, c] = key.split(",").map(Number);
  if (!Number.isFinite(r) || !Number.isFinite(c)) return null;
  return { r, c };
}

export function stretchOwner(r: number, c: number): LudoColor | null {
  for (const color of LUDO_COLORS) {
    if (HOME_STRETCH[color].some((p) => p.r === r && p.c === c)) return color;
  }
  return null;
}

export function startOwner(r: number, c: number): LudoColor | null {
  for (const color of LUDO_COLORS) {
    const start = BLUE_PATH[COLOR_OFFSET[color]]!;
    if (start.r === r && start.c === c) return color;
  }
  return null;
}

export function isSafeBoardCell(r: number, c: number): boolean {
  return BLUE_PATH.some((p, i) => SAFE_INDICES.has(i) && p.r === r && p.c === c);
}

export function inYard(r: number, c: number): LudoColor | null {
  if (r < 6 && c < 6) return "blue";
  if (r < 6 && c > 8) return "yellow";
  if (r > 8 && c > 8) return "green";
  if (r > 8 && c < 6) return "red";
  return null;
}

export function inHomeCenter(r: number, c: number): boolean {
  return r >= 6 && r <= 8 && c >= 6 && c <= 8;
}

export function onCross(r: number, c: number): boolean {
  return r >= 6 && r <= 8 || c >= 6 && c <= 8;
}

export function startCell(color: LudoColor): Cell {
  return BLUE_PATH[COLOR_OFFSET[color]]!;
}

/** Exact 2×2 stump pads inside each yard, matching classic Ludo King. */
export const YARD_PADS: Cell[] = [
  { r: 1.7, c: 1.7 },
  { r: 1.7, c: 3.7 },
  { r: 3.7, c: 1.7 },
  { r: 3.7, c: 3.7 },
];

export function yardPad(color: LudoColor, index: number, count: number): Cell {
  const origin = YARD_ORIGIN[color];
  if (count <= 4) {
    const pad = YARD_PADS[index] ?? YARD_PADS[0]!;
    return { r: origin.r + pad.r, c: origin.c + pad.c };
  }
  const n = Math.max(1, count);
  const cols = n <= 6 ? 3 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const col = index % cols;
  const row = Math.floor(index / cols);
  const pad = 1.15;
  const span = 3.7;
  const x = pad + ((col + 0.5) / cols) * span;
  const y = pad + ((row + 0.5) / rows) * span;
  return { r: origin.r + y, c: origin.c + x };
}

export function tokenCell(color: LudoColor, token: LudoToken, index: number, count: number): Cell {
  if (token.steps < 0) return yardPad(color, index, count);
  if (token.steps >= LUDO_HOME_STEPS) return HOME_SPOT[color];
  if (token.steps >= 52) return HOME_STRETCH[color][token.steps - 52] ?? HOME_SPOT[color];
  return BLUE_PATH[pathIndex(color, token.steps)] ?? yardPad(color, index, count);
}

export function columnProgress(col: LudoColumn): number {
  if (!col.tokens.length) return 0;
  const sum = col.tokens.reduce((s, t) => s + Math.max(0, t.steps + 1), 0);
  return sum / (col.tokens.length * (LUDO_HOME_STEPS + 1));
}

export function namedStudentCount(board: LudoBoard): number {
  return board.columns.filter((c) => c.studentName.trim()).length;
}

export function columnFinished(col: LudoColumn): boolean {
  return col.tokens.length > 0 && col.tokens.every((t) => t.steps >= LUDO_HOME_STEPS);
}

const DAY_MS = 864e5;

export function ludoTodayKey(now = Date.now()): string {
  const d = new Date(now);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DAY_NAME_DOW: Record<string, number> = {
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
  saturday: 6,
};

export function dayNameToDow(name: string): number | null {
  const key = name.trim().toLowerCase();
  if (key in DAY_NAME_DOW) return DAY_NAME_DOW[key]!;
  const short = key.slice(0, 3);
  return short in DAY_NAME_DOW ? DAY_NAME_DOW[short]! : null;
}

export function nextDateForDow(dow: number, now = Date.now()): string {
  const d = new Date(now);
  const cur = d.getDay();
  let add = (dow - cur + 7) % 7;
  if (add === 0) add = 7;
  d.setDate(d.getDate() + add);
  return ludoTodayKey(d.getTime());
}

export function addRestDate(board: LudoBoard, dateKey: string): LudoBoard {
  if (board.restDates.includes(dateKey)) return board;
  return { ...board, restDates: [...board.restDates, dateKey].slice(-60) };
}

export function ludoIsResting(board: LudoBoard, now = Date.now()): boolean {
  if (board.startedAt != null && now < board.startedAt) return true;
  const today = ludoTodayKey(now);
  if ((board.restDates ?? []).includes(today)) return true;
  const dow = new Date(now).getDay();
  return (board.restDays ?? []).includes(dow);
}

export function ludoHasStarted(board: LudoBoard, now = Date.now()): boolean {
  if (board.startedAt == null) return false;
  return now >= board.startedAt;
}

function canLand(steps: number, pips: number): boolean {
  const dest = steps + pips;
  if (dest > LUDO_HOME_STEPS) return false;
  return true;
}

export function rulesOf(board: LudoBoard) {
  return board.rules ?? defaultLudoRules();
}

export function canEnterYard(board: LudoBoard, color: LudoColor, pips: number): boolean {
  const col = board.columns.find((c) => c.color === color);
  if (!col) return false;
  if (rulesOf(board).enterOnOneOrSix) return pips === 1 || pips === 6;
  return pips === col.entryTurn;
}

function wouldCapture(board: LudoBoard, color: LudoColor, destSteps: number): boolean {
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

function captureHits(board: LudoBoard, color: LudoColor, destSteps: number): Array<{ color: LudoColor; token: LudoToken }> {
  if (destSteps < 0 || destSteps > 51) return [];
  if (isSafeCell(color, destSteps)) return [];
  const dest = BLUE_PATH[pathIndex(color, destSteps)];
  if (!dest) return [];
  const hits: Array<{ color: LudoColor; token: LudoToken }> = [];
  for (const col of board.columns) {
    if (col.color === color) continue;
    for (const t of col.tokens) {
      if (t.steps < 0 || t.steps > 51) continue;
      const cell = BLUE_PATH[pathIndex(col.color, t.steps)];
      if (cell && cell.r === dest.r && cell.c === dest.c) hits.push({ color: col.color, token: t });
    }
  }
  return hits;
}

function sendHomeIfCaptured(board: LudoBoard, color: LudoColor, destSteps: number): LudoBoard {
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
          if (cell && cell.r === dest.r && cell.c === dest.c) return { ...t, steps: -1 };
          return t;
        }),
      };
    }),
  };
}

function setTokenSteps(board: LudoBoard, color: LudoColor, tokenId: string, steps: number): LudoBoard {
  return {
    ...board,
    columns: board.columns.map((col) =>
      col.color === color
        ? { ...col, tokens: col.tokens.map((t) => (t.id === tokenId ? { ...t, steps } : t)) }
        : col,
    ),
  };
}

function boardCellKey(color: LudoColor, steps: number): string {
  const cell = tokenCell(color, { steps } as LudoToken, 0, 1);
  return cellKey({ r: Math.round(cell.r), c: Math.round(cell.c) });
}

export function cellKind(board: LudoBoard, key: string): LudoCellKind {
  const note = board.cells[key];
  if (note?.kind === "array" || note?.kind === "sunday") return note.kind;
  const sunday = board.columns.some((col) => col.tokens.some((t) => t.sundayKey === key));
  return sunday ? "sunday" : "note";
}

function restDateForToken(token: LudoToken, now = Date.now()): string {
  const dow = dayNameToDow(token.dayName);
  if (dow != null) return nextDateForDow(dow, now);
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  return ludoTodayKey(d.getTime());
}

export function applyLandingEffects(board: LudoBoard, color: LudoColor, tokenId: string, now = Date.now()): LudoBoard {
  const col = board.columns.find((c) => c.color === color);
  const token = col?.tokens.find((t) => t.id === tokenId);
  if (!token || token.steps < 0 || token.steps >= LUDO_HOME_STEPS) return board;
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

export function applyPips(board: LudoBoard, color: LudoColor, pips: number): { board: LudoBoard; moved: boolean; tokenId: string | null } {
  const moves = legalMoves(board, color, pips);
  const pick = moves[0];
  if (!pick) return { board, moved: false, tokenId: null };
  return { board: commitMove(board, color, pick, pips).board, moved: true, tokenId: pick.tokenId };
}

export function legalMoves(board: LudoBoard, color: LudoColor, pips: number): LudoMove[] {
  const col = board.columns.find((c) => c.color === color);
  if (!col || pips <= 0) return [];
  const out: LudoMove[] = [];
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
        enter: true,
      });
      return;
    }
    if (token.steps >= LUDO_HOME_STEPS) return;
    if (!canLand(token.steps, pips)) return;
    const toSteps = token.steps + pips;
    out.push({
      tokenId: token.id,
      fromSteps: token.steps,
      toSteps,
      capture: wouldCapture(board, color, toSteps),
      home: toSteps >= LUDO_HOME_STEPS,
      enter: false,
    });
  });
  return out;
}

export function rollDie(): number {
  return 1 + Math.floor(Math.random() * 6);
}

export function isStudentSeat(board: LudoBoard, color: LudoColor, humanColor: LudoColor): boolean {
  if (color === humanColor) return true;
  const col = board.columns.find((c) => c.color === color);
  return Boolean(col?.studentName.trim());
}

export function rolledToday(board: LudoBoard, color: LudoColor, now = Date.now()): boolean {
  return (board.studentRolls ?? {})[color] === ludoTodayKey(now);
}

export function nextTurnColor(board: LudoBoard, from: LudoColor, now = Date.now()): LudoColor {
  const start = TURN_ORDER.indexOf(from);
  let fallback = from;
  for (let i = 1; i <= TURN_ORDER.length; i++) {
    const color = TURN_ORDER[(start + i) % TURN_ORDER.length]!;
    const col = board.columns.find((c) => c.color === color);
    if (!col || columnFinished(col)) continue;
    if (!isActiveSeat(board, color)) continue;
    fallback = color;
    if (rulesOf(board).oncePerDay && rolledToday(board, color, now)) continue;
    return color;
  }
  return fallback;
}

export function everyonePlayedToday(board: LudoBoard, now = Date.now()): boolean {
  if (!rulesOf(board).oncePerDay) return false;
  return board.columns.every((col) => {
    if (!isActiveSeat(board, col.color)) return true;
    if (columnFinished(col)) return true;
    return rolledToday(board, col.color, now);
  });
}

function stampTime(board: LudoBoard, patch: Partial<LudoBoard>): LudoBoard {
  return { ...board, ...patch, lastMoveAt: Date.now() };
}

export function passTurn(board: LudoBoard, now = Date.now()): LudoBoard {
  if (board.phase === "won") return board;
  if (board.phase === "challenge") return board;
  if (board.extraTurns > 0) {
    return stampTime(board, { extraTurns: board.extraTurns - 1, phase: "roll", pendingCell: null });
  }
  const today = ludoTodayKey(now);
  const studentRolls = rulesOf(board).oncePerDay
    ? { ...(board.studentRolls ?? {}), [board.turnColor]: today }
    : (board.studentRolls ?? {});
  const stamped = { ...board, studentRolls };
  return stampTime(stamped, {
    turnColor: nextTurnColor(stamped, board.turnColor, now),
    phase: "roll",
    pendingCell: null,
    consecutiveSixes: 0,
  });
}

export function applyRoll(board: LudoBoard, pips: number): LudoBoard {
  if (board.phase === "won" || board.phase === "challenge") return board;
  const value = Math.min(6, Math.max(1, pips));
  let sixes = board.consecutiveSixes;
  if (rulesOf(board).standardLudo && value === 6) {
    sixes += 1;
    if (sixes >= 3) {
      return passTurn({ ...board, lastPips: value, consecutiveSixes: 0 });
    }
  } else {
    sixes = 0;
  }
  const moves = legalMoves(board, board.turnColor, value);
  if (!moves.length) {
    const next = stampTime(board, { lastPips: value, consecutiveSixes: sixes, phase: "roll" });
    if (rulesOf(board).standardLudo && value === 6) return next;
    return passTurn(next);
  }
  return stampTime(board, { lastPips: value, consecutiveSixes: sixes, phase: "move", pendingCell: null });
}

function commitMove(board: LudoBoard, color: LudoColor, move: LudoMove, _pips: number): { board: LudoBoard; capture: boolean; home: boolean; hit: { color: LudoColor; token: LudoToken } | null } {
  const col = board.columns.find((c) => c.color === color);
  if (!col) return { board, capture: false, home: false, hit: null };
  const hits = move.capture ? captureHits(board, color, move.toSteps) : [];
  const tokens = col.tokens.map((t) => (t.id === move.tokenId ? { ...t, steps: move.toSteps } : t));
  let next: LudoBoard = {
    ...board,
    columns: board.columns.map((c) => (c.color === color ? { ...c, tokens } : c)),
  };
  if (move.capture) next = sendHomeIfCaptured(next, color, move.toSteps);
  next = applyLandingEffects(next, color, move.tokenId);
  const finished = next.columns.find((c) => c.color === color);
  const won = finished ? columnFinished(finished) : false;
  if (won) {
    next = stampTime(next, { winner: color, phase: "won", pendingCell: null });
    return { board: next, capture: move.capture, home: move.home, hit: hits[0] ?? null };
  }
  return { board: next, capture: move.capture, home: move.home, hit: hits[0] ?? null };
}

export function cellNote(board: LudoBoard, key: string): LudoCellNote | null {
  const note = board.cells[key];
  if (!note) return null;
  if (!note.label.trim() && !note.content.trim() && note.kind === "note") return null;
  return note;
}

export function playMove(board: LudoBoard, color: LudoColor, tokenId: string, pips: number): LudoBoard {
  const move = legalMoves(board, color, pips).find((m) => m.tokenId === tokenId);
  if (!move) return board;
  const result = commitMove(board, color, move, pips);
  if (result.board.phase === "won") return result.board;

  if (result.capture && result.hit && rulesOf(board).captureTest) {
    const challenge: LudoChallenge = {
      id: `cap-${Date.now()}`,
      capturerColor: color,
      capturedColor: result.hit.color,
      tokenId: result.hit.token.id,
      tokenName: result.hit.token.name || result.hit.token.dayName || "subject",
      deckId: result.hit.token.deckId,
      passingScore: rulesOf(board).passingScore,
      status: "pending-set",
      createdAt: Date.now(),
      sessionId: null,
    };
    return stampTime(result.board, {
      challenge,
      phase: "challenge",
      pendingCell: null,
    });
  }

  const destToken = result.board.columns.find((c) => c.color === color)?.tokens.find((t) => t.id === tokenId);
  const destCell = destToken ? tokenCell(color, destToken, 0, 1) : startCell(color);
  const key = cellKey({ r: Math.round(destCell.r), c: Math.round(destCell.c) });
  const note = destToken && destToken.steps >= 0 && destToken.steps < LUDO_HOME_STEPS ? cellNote(result.board, key) : null;
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
    phase: showStudy ? "study" : "roll",
  });
  if (next.phase === "study") return next;
  return passTurn({ ...next, extraTurns: extra > 0 ? next.extraTurns : next.extraTurns });
}

export function dismissStudy(board: LudoBoard): LudoBoard {
  if (board.phase !== "study") return board;
  return passTurn({ ...board, phase: "roll", pendingCell: null });
}

export function setChallengeTest(board: LudoBoard, deckId: string | null, passingScore?: number): LudoBoard {
  if (!board.challenge || board.challenge.status !== "pending-set") return board;
  const score = passingScore ?? board.challenge.passingScore;
  const next: LudoBoard = {
    ...board,
    challenge: {
      ...board.challenge,
      deckId,
      passingScore: Math.min(100, Math.max(1, score)),
      status: "pending-take",
    },
    phase: "roll",
  };
  return passTurn(next);
}

export function sessionPercent(session: SessionSummary): number {
  if (!session.total) return 0;
  return Math.round((session.correct / session.total) * 100);
}

export function resolveChallengeFromSession(board: LudoBoard, session: SessionSummary): LudoBoard {
  const ch = board.challenge;
  if (!ch || ch.status !== "pending-take") return board;
  if (!ch.deckId || session.deckId !== ch.deckId) return board;
  if (ch.sessionId === session.id) return board;
  const pct = sessionPercent(session);
  const passed = pct >= ch.passingScore;
  let next: LudoBoard = {
    ...board,
    lastTestId: session.id,
    challenge: passed ? null : { ...ch, sessionId: session.id, status: "pending-take" },
  };
  if (!passed) {
    const skipDay = nextDateForDow(new Date().getDay() === 0 ? 1 : new Date().getDay(), Date.now());
    next = addRestDate(next, skipDay);
  }
  return stampTime(next, {});
}

export function dismissChallenge(board: LudoBoard): LudoBoard {
  if (!board.challenge) return board;
  const next = { ...board, challenge: null, phase: board.phase === "challenge" ? "roll" : board.phase };
  if (board.phase === "challenge") return passTurn(next);
  return next;
}

export function pickBotMove(board: LudoBoard, color: LudoColor, pips: number): LudoMove | null {
  const moves = legalMoves(board, color, pips);
  if (!moves.length) return null;
  const rank = (m: LudoMove) =>
    (m.capture ? 400 : 0) + (m.home ? 300 : 0) + (m.enter ? 200 : 0) + m.toSteps;
  return [...moves].sort((a, b) => rank(b) - rank(a))[0] ?? null;
}

export function isBotColumn(_board: LudoBoard, _color: LudoColor, _humanColor: LudoColor): boolean {
  return false;
}

export function ludoSeatName(board: LudoBoard, color: LudoColor, myColor: LudoColor = board.playerColor): string {
  const col = board.columns.find((c) => c.color === color);
  const named = col?.studentName.trim();
  if (named) return named;
  if (color === myColor) return "You";
  return LUDO_COLOR_LABEL[color];
}

export function ludoSeatInitial(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  return t.slice(0, 1).toUpperCase();
}

export type LudoFlashKind = "turn" | "roll" | "capture" | "extra" | "win" | "skip" | "home" | "threeSix";

export interface LudoFlash {
  kind: LudoFlashKind;
  actor: LudoColor;
  other?: LudoColor;
  pips?: number;
}

function homeCount(board: LudoBoard, color: LudoColor): number {
  return board.columns.find((c) => c.color === color)?.tokens.filter((t) => t.steps >= LUDO_HOME_STEPS).length ?? 0;
}

function capturedRival(prev: LudoBoard, next: LudoBoard): LudoColor | null {
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

export function flashesFromBoards(prev: LudoBoard, next: LudoBoard): LudoFlash[] {
  if (prev === next) return [];
  const out: LudoFlash[] = [];
  if (next.phase === "won" && next.winner && prev.phase !== "won") {
    out.push({ kind: "win", actor: next.winner });
    return out;
  }

  const actor = prev.turnColor;
  const pipsChanged = next.lastPips > 0 && next.lastPips !== prev.lastPips;

  if (pipsChanged && prev.phase === "roll") {
    if (next.phase === "move") {
      out.push({ kind: "roll", actor, pips: next.lastPips });
    } else if (prev.consecutiveSixes >= 2 && next.lastPips === 6) {
      out.push({ kind: "threeSix", actor, pips: 6 });
    } else if (next.turnColor !== prev.turnColor) {
      out.push({ kind: "skip", actor, pips: next.lastPips });
    } else {
      out.push({ kind: "roll", actor, pips: next.lastPips });
    }
  }

  const captured =
    next.challenge && next.challenge.id !== prev.challenge?.id
      ? next.challenge.capturedColor
      : capturedRival(prev, next);
  if (captured) {
    const capturer = next.challenge?.capturerColor ?? actor;
    out.push({ kind: "capture", actor: capturer, other: captured });
  }

  if (homeCount(next, actor) > homeCount(prev, actor)) {
    out.push({ kind: "home", actor });
  }

  const extraTurn =
    next.turnColor === prev.turnColor &&
    next.phase === "roll" &&
    (prev.phase === "move" || prev.phase === "study") &&
    !next.challenge;
  if (extraTurn) {
    out.push({ kind: "extra", actor: next.turnColor, pips: next.lastPips });
  }

  if (next.turnColor !== prev.turnColor && next.phase === "roll") {
    out.push({ kind: "turn", actor: next.turnColor });
  }

  return out;
}

export function popupCopy(flash: LudoFlash, board: LudoBoard, myColor: LudoColor): { title: string; detail: string } {
  const name = ludoSeatName(board, flash.actor, myColor);
  const mine = flash.actor === myColor;
  switch (flash.kind) {
    case "turn":
      return {
        title: mine ? "Your Turn" : `${name}'s Turn`,
        detail: mine ? "Tap the die to roll" : `${name} is playing`,
      };
    case "roll":
      return {
        title: `${name} rolled ${flash.pips}`,
        detail: mine ? "Tap a glowing piece" : `${name} is moving`,
      };
    case "skip":
      return {
        title: `${name} rolled ${flash.pips}`,
        detail: "Need a 1 or 6 to leave the yard",
      };
    case "capture": {
      const other = flash.other ? ludoSeatName(board, flash.other, myColor) : "a rival";
      return {
        title: `${name} captured ${other}`,
        detail: board.rules.captureTest ? `${other} must pass a test` : `${other} goes back to the yard`,
      };
    }
    case "extra":
      return {
        title: mine ? "Extra roll" : `${name} rolls again`,
        detail: flash.pips === 6 ? "Rolled a 6" : "Bonus turn",
      };
    case "home":
      return { title: `${name} reached home`, detail: "Subject is in" };
    case "threeSix":
      return { title: "Three sixes", detail: `${name} forfeits the turn` };
    case "win":
      return { title: mine ? "You win" : `${name} wins`, detail: "Exam target cleared" };
  }
}

export function canColorRoll(board: LudoBoard, color: LudoColor, now = Date.now()): boolean {
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

export function whyCantRoll(board: LudoBoard, color: LudoColor, now = Date.now()): string | null {
  if (board.phase === "won") return "This match is over. Start a new match to roll again.";
  if (board.phase === "challenge") return "Finish the capture test before rolling.";
  if (board.phase === "study") return "Review the notebook box, then continue.";
  if (board.phase === "move") return "Tap a glowing piece, or tap the die again to move.";
  if (!ludoHasStarted(board, now)) return "The target has not started yet.";
  if (ludoIsResting(board, now)) return "Rest day — the die waits.";
  if (board.challenge?.status === "pending-take" && board.challenge.capturedColor === color) {
    return "Pass the capture test before you roll.";
  }
  if (!isActiveSeat(board, color)) return "This column is not in the target.";
  if (board.turnColor !== color) {
    return `Waiting for ${ludoSeatName(board, board.turnColor, color)}.`;
  }
  if (rulesOf(board).oncePerDay && rolledToday(board, color, now) && board.extraTurns === 0) {
    return "You already rolled today. Come back tomorrow.";
  }
  return null;
}

export function setCellNote(board: LudoBoard, key: string, note: Partial<LudoCellNote> & { label: string; content: string }): LudoBoard {
  const label = note.label.trim().slice(0, 24);
  const content = note.content.trim().slice(0, 2000);
  const kind: LudoCellKind = note.kind === "array" || note.kind === "sunday" ? note.kind : "note";
  const skip = Math.min(12, Math.max(0, Number(note.skip) || 0));
  const sundayTokenId = note.sundayTokenId ?? null;
  const sundayColor = note.sundayColor ?? null;
  const cells = { ...board.cells };
  if (!label && !content && kind === "note" && !sundayTokenId) delete cells[key];
  else cells[key] = { label, content, kind, skip, sundayTokenId, sundayColor };
  let columns = board.columns;
  if (kind === "sunday" && sundayTokenId && sundayColor) {
    columns = board.columns.map((col) =>
      col.color === sundayColor
        ? {
            ...col,
            tokens: col.tokens.map((t) => (t.id === sundayTokenId ? { ...t, sundayKey: key } : t.sundayKey === key ? { ...t, sundayKey: null } : t)),
          }
        : {
            ...col,
            tokens: col.tokens.map((t) => (t.sundayKey === key ? { ...t, sundayKey: null } : t)),
          },
    );
  }
  return { ...board, cells, columns };
}

export function placeSundayBox(board: LudoBoard, color: LudoColor, tokenId: string, key: string): LudoBoard {
  const token = board.columns.find((c) => c.color === color)?.tokens.find((t) => t.id === tokenId);
  const prev = token?.sundayKey;
  const cells = { ...board.cells };
  if (prev && cells[prev]?.kind === "sunday" && cells[prev]?.sundayTokenId === tokenId) {
    const leftover = cells[prev];
    if (!leftover.label && !leftover.content) delete cells[prev];
    else cells[prev] = { ...leftover, kind: "note", sundayTokenId: null, sundayColor: null };
  }
  const existing = cells[key];
  cells[key] = {
    label: existing?.label || "Sun",
    content: existing?.content || "Sunday rest box for this subject.",
    kind: "sunday",
    skip: existing?.skip ?? 0,
    sundayTokenId: tokenId,
    sundayColor: color,
  };
  return {
    ...board,
    cells,
    columns: board.columns.map((col) => ({
      ...col,
      tokens: col.tokens.map((t) => {
        if (t.id === tokenId) return { ...t, sundayKey: key };
        if (t.sundayKey === key) return { ...t, sundayKey: null };
        return t;
      }),
    })),
  };
}

export function placeArrayBox(board: LudoBoard, key: string, skip = rulesOf(board).skipSteps): LudoBoard {
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
        sundayColor: existing?.sundayColor ?? null,
      },
    },
  };
}

export function addCustomRule(board: LudoBoard, title: string, detail: string): LudoBoard {
  const clean = title.trim().slice(0, 80);
  if (!clean) return board;
  const rule: LudoCustomRule = {
    id: `custom-${Date.now()}`,
    title: clean,
    detail: detail.trim().slice(0, 800),
    enabled: true,
  };
  return { ...board, customRules: [...board.customRules, rule].slice(0, 24) };
}

export function patchCustomRule(board: LudoBoard, id: string, patch: Partial<LudoCustomRule>): LudoBoard {
  return {
    ...board,
    customRules: board.customRules.map((r) =>
      r.id === id
        ? {
            ...r,
            title: patch.title != null ? patch.title.trim().slice(0, 80) || r.title : r.title,
            detail: patch.detail != null ? patch.detail.trim().slice(0, 800) : r.detail,
            enabled: patch.enabled ?? r.enabled,
          }
        : r,
    ),
  };
}

export function removeCustomRule(board: LudoBoard, id: string): LudoBoard {
  return { ...board, customRules: board.customRules.filter((r) => r.id !== id) };
}

export function resetMatch(board: LudoBoard): LudoBoard {
  const active = activeColorsOf(board);
  const turnColor = active.includes(board.playerColor) ? board.playerColor : (active[0] ?? board.playerColor);
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
      tokens: c.tokens.map((t) => ({ ...t, steps: -1 })),
    })),
  };
}

export function tickLudoFromActivity(
  board: LudoBoard,
  lastSession: SessionSummary | null,
  notes: Note[],
  now = Date.now(),
): { board: LudoBoard; moved: boolean; reason: "test" | "note" | "rest" | "wait" | "challenge" } {
  const maxNote = notes.reduce((m, n) => Math.max(m, n.modifiedAt || 0), 0);
  let next = board;
  if (next.lastMoveAt == null) {
    next = { ...next, lastNoteAt: Math.max(next.lastNoteAt || 0, maxNote), lastMoveAt: 0 };
  }

  if (next.phase === "won") {
    return { board: next, moved: false, reason: "wait" };
  }

  if (lastSession && next.challenge?.status === "pending-take") {
    const resolved = resolveChallengeFromSession(next, lastSession);
    if (resolved !== next && resolved.challenge !== next.challenge) {
      return { board: resolved, moved: true, reason: "challenge" };
    }
    if (resolved.lastTestId === lastSession.id && next.lastTestId !== lastSession.id) {
      return { board: resolved, moved: false, reason: "challenge" };
    }
  }

  if (!ludoHasStarted(next, now) || ludoIsResting(next, now)) {
    if (lastSession?.id && lastSession.id !== next.lastTestId) {
      next = { ...next, lastTestId: lastSession.id };
    }
    if (maxNote > (next.lastNoteAt || 0)) {
      next = { ...next, lastNoteAt: maxNote };
    }
    return { board: next, moved: false, reason: "rest" };
  }

  if (lastSession?.id && lastSession.id !== next.lastTestId) {
    if (next.challenge?.deckId === lastSession.deckId && next.challenge.status === "pending-take") {
      return { board: { ...next, lastTestId: lastSession.id }, moved: false, reason: "challenge" };
    }
    return {
      board: {
        ...next,
        lastTestId: lastSession.id,
        extraTurns: next.extraTurns + (next.fastMode ? 2 : 1),
        turnColor: next.playerColor,
        phase: "roll",
        pendingCell: null,
        lastPips: 6,
        lastMoveAt: now,
      },
      moved: true,
      reason: "test",
    };
  }

  if (maxNote > (next.lastNoteAt || 0) && maxNote >= (next.startedAt || 0)) {
    return {
      board: {
        ...next,
        lastNoteAt: maxNote,
        extraTurns: next.extraTurns + 1,
        turnColor: next.playerColor,
        phase: "roll",
        pendingCell: null,
        lastPips: Math.min(6, next.fastMode ? 4 : 2),
        lastMoveAt: now,
      },
      moved: true,
      reason: "note",
    };
  }

  return { board: next, moved: false, reason: "wait" };
}

export function daysToLudoExam(examDate: number | null, now = Date.now()): number | null {
  if (!examDate) return null;
  return (examDate - now) / DAY_MS;
}
