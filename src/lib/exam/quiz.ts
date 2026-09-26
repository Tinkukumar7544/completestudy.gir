import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import type { Question } from "./types";
import {
  buildSummaryItems,
  clampTimeLimitMin,
  compactQuizItems,
  derangeIds,
  paperSubmitLocked,
  parseIsoDate,
  quizEndsAtMs,
  skippedQuizItems,
  type QuizSectionPick,
  type QuizSummaryView,
} from "./quiz-assign.ts";

export const MAX_QUIZ_FRIENDS = 20;

export type QuizPlayer = {
  playerId: string;
  name: string;
  joinedAt: string;
  submittedAt: string | null;
  readyAt: string | null;
  leftAt: string | null;
  correct: number | null;
  wrong: number | null;
  notAttempted: number | null;
  marked: number | null;
  total: number | null;
  score: number | null;
};

export type QuizChatMessage = {
  id: string;
  playerId: string;
  name: string;
  body: string;
  sentAt: string;
};

export type QuizRoom = {
  code: string;
  title: string;
  hostId: string;
  questionCount: number;
  testDay: string | null;
  folder: string;
  sectionPicks: QuizSectionPick[];
  timeLimitSec: number;
  startedAt: string | null;
  endedAt: string | null;
  serverNow: string;
  players: QuizPlayer[];
  messages: QuizChatMessage[];
  myViewCode: string | null;
  hasSubmitted: boolean;
  isHost: boolean;
  assigned: QuizSummaryView | null;
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]!;
  return out;
}

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function compactQuestions(raw: unknown): Question[] {
  if (!Array.isArray(raw)) throw new Error("Quiz needs a question list");
  const out: Question[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const q = item as Question;
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
      ...(source ? { sourceSection: source } : {}),
    });
  }
  if (!out.length) throw new Error("Quiz needs at least one question");
  return out;
}

function compactSectionPicks(raw: unknown): QuizSectionPick[] {
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }
  }
  if (!Array.isArray(parsed)) return [];
  const out: QuizSectionPick[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const row = item as { name?: unknown; count?: unknown };
    const name = String(row.name ?? "").trim();
    const count = Math.max(0, Math.floor(Number(row.count) || 0));
    if (!name || count <= 0) continue;
    out.push({ name: name.slice(0, 160), count });
  }
  return out;
}

function asIso(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.toISOString();
}

type PlayerRow = {
  player_id: string;
  name: string;
  joined_at: string | Date;
  submitted_at: string | Date | null;
  ready_at: string | Date | null;
  left_at: string | Date | null;
  correct: number | null;
  wrong: number | null;
  not_attempted: number | null;
  marked: number | null;
  total: number | null;
  score: number | null;
  view_code: string | null;
  assigned_player_id: string | null;
  items: unknown;
};

function mapPlayers(rows: PlayerRow[]): QuizPlayer[] {
  return rows.map((r) => ({
    playerId: r.player_id,
    name: r.name,
    joinedAt: asIso(r.joined_at) ?? new Date().toISOString(),
    submittedAt: asIso(r.submitted_at),
    readyAt: asIso(r.ready_at),
    leftAt: asIso(r.left_at),
    correct: r.correct,
    wrong: r.wrong,
    notAttempted: r.not_attempted,
    marked: r.marked,
    total: r.total,
    score: r.score,
  }));
}

function summaryFromRow(row: PlayerRow, questions: Question[]): QuizSummaryView | null {
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
    items,
  };
}

async function uniqueViewCode(sql: Awaited<ReturnType<typeof getSql>>, roomCode: string): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = makeCode();
    const exists = await sql<{ view_code: string }>`
      select view_code from quiz_players where room_code = ${roomCode} and view_code = ${code} limit 1
    `;
    if (!exists[0]) return code;
  }
  return `${makeCode()}${CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]}`;
}

async function reassignSummaries(sql: Awaited<ReturnType<typeof getSql>>, roomCode: string) {
  const submitted = await sql<{ player_id: string }>`
    select player_id from quiz_players
    where room_code = ${roomCode} and submitted_at is not null
    order by submitted_at, player_id
  `;
  const ids = submitted.map((r) => r.player_id);
  const map = derangeIds(ids);
  if (ids.length < 2) {
    await sql`
      update quiz_players set assigned_player_id = null where room_code = ${roomCode}
    `;
    return;
  }
  for (const id of ids) {
    const assigned = map[id] ?? null;
    await sql`
      update quiz_players set assigned_player_id = ${assigned}
      where room_code = ${roomCode} and player_id = ${id}
    `;
  }
}

async function loadMessages(sql: Awaited<ReturnType<typeof getSql>>, code: string): Promise<QuizChatMessage[]> {
  const rows = await sql<{
    id: string;
    player_id: string;
    name: string;
    body: string;
    sent_at: string | Date;
  }>`
    select id, player_id, name, body, sent_at
    from quiz_messages
    where room_code = ${code}
    order by sent_at desc
    limit 80
  `;
  return rows
    .slice()
    .reverse()
    .map((m) => ({
      id: m.id,
      playerId: m.player_id,
      name: m.name,
      body: m.body,
      sentAt: asIso(m.sent_at) ?? new Date().toISOString(),
    }));
}

async function recordSkipped(
  sql: Awaited<ReturnType<typeof getSql>>,
  code: string,
  playerId: string,
  name: string,
  questions: Question[],
) {
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

async function settleExpired(sql: Awaited<ReturnType<typeof getSql>>, code: string) {
  const rooms = await sql<{
    questions: unknown;
    time_limit_sec: number | null;
    started_at: string | Date | null;
    ended_at: string | Date | null;
  }>`
    select questions, time_limit_sec, started_at, ended_at from quiz_rooms where code = ${code} limit 1
  `;
  const room = rooms[0];
  if (!room?.started_at || room.ended_at) return;
  const timeLimitSec = Number(room.time_limit_sec) || 0;
  if (timeLimitSec <= 0) return;
  const startedAt = asIso(room.started_at);
  const endsAt = quizEndsAtMs(startedAt, timeLimitSec);
  if (!endsAt) return;
  if (Date.now() < endsAt + 3000) return;
  const questions = compactQuestions(typeof room.questions === "string" ? JSON.parse(room.questions) : room.questions);
  const pending = await sql<{ player_id: string; name: string }>`
    select player_id, name from quiz_players
    where room_code = ${code} and submitted_at is null
  `;
  for (const p of pending) {
    await recordSkipped(sql, code, p.player_id, p.name, questions);
  }
  await sql`update quiz_rooms set ended_at = coalesce(ended_at, now()) where code = ${code}`;
  if (pending.length) await reassignSummaries(sql, code);
}

async function maybeStartRoom(sql: Awaited<ReturnType<typeof getSql>>, code: string) {
  const waiting = await sql<{ n: number }>`
    select count(*)::int as n from quiz_players
    where room_code = ${code} and ready_at is null and left_at is null
  `;
  const present = await sql<{ n: number }>`
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

async function loadQuestions(sql: Awaited<ReturnType<typeof getSql>>, code: string): Promise<Question[]> {
  const rooms = await sql<{ questions: unknown }>`
    select questions from quiz_rooms where code = ${code} limit 1
  `;
  if (!rooms[0]) throw new Error("No quiz with that code");
  return compactQuestions(typeof rooms[0].questions === "string" ? JSON.parse(rooms[0].questions) : rooms[0].questions);
}

async function loadRoom(code: string, viewerId?: string): Promise<QuizRoom> {
  const sql = await getSql();
  await settleExpired(sql, code);
  const rooms = await sql<{
    code: string;
    title: string;
    host_id: string;
    questions: unknown;
    test_day: string | Date | null;
    folder: string | null;
    section_picks: unknown;
    time_limit_sec: number | null;
    started_at: string | Date | null;
    ended_at: string | Date | null;
  }>`
    select code, title, host_id, questions, test_day, folder, section_picks, time_limit_sec, started_at, ended_at
    from quiz_rooms where code = ${code} limit 1
  `;
  const room = rooms[0];
  if (!room) throw new Error("No quiz with that code");
  const rows = await sql<PlayerRow>`
    select player_id, name, joined_at, submitted_at, ready_at, left_at, correct, wrong, not_attempted, marked, total, score,
           view_code, assigned_player_id, items
    from quiz_players where room_code = ${code} order by joined_at
  `;
  const questions = compactQuestions(typeof room.questions === "string" ? JSON.parse(room.questions) : room.questions);
  const players = mapPlayers(rows);
  const me = viewerId ? rows.find((r) => r.player_id === viewerId) : undefined;
  const hasSubmitted = Boolean(me?.submitted_at);
  let assigned: QuizSummaryView | null = null;
  if (hasSubmitted && me?.assigned_player_id) {
    const other = rows.find((r) => r.player_id === me.assigned_player_id);
    if (other && other.player_id !== me.player_id) {
      assigned = summaryFromRow(other, questions);
    }
  }
  const testDay = room.test_day
    ? typeof room.test_day === "string"
      ? room.test_day.slice(0, 10)
      : asIso(room.test_day)?.slice(0, 10) ?? null
    : null;
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
    sectionPicks: compactSectionPicks(
      typeof room.section_picks === "string" ? JSON.parse(room.section_picks) : room.section_picks,
    ),
    timeLimitSec,
    startedAt,
    endedAt,
    serverNow: new Date().toISOString(),
    players,
    messages: await loadMessages(sql, code),
    myViewCode: hasSubmitted ? me?.view_code ?? null : null,
    hasSubmitted,
    isHost: Boolean(viewerId && viewerId === room.host_id),
    assigned,
  };
}

export const createQuiz = createServerFn({ method: "POST" })
  .validator((data: {
    title: string;
    hostId: string;
    hostName: string;
    questions: unknown;
    testDay?: string;
    folder?: string;
    sectionPicks?: unknown;
    timeLimitMin?: number;
  }) => {
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
      timeLimitSec: clampTimeLimitMin(data.timeLimitMin) * 60,
    };
  })
  .handler(async ({ data }): Promise<QuizRoom> => {
    const sql = await getSql();
    let code = makeCode();
    for (let i = 0; i < 8; i++) {
      const exists = await sql<{ code: string }>`select code from quiz_rooms where code = ${code} limit 1`;
      if (!exists[0]) break;
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

export const joinQuiz = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<QuizRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ code: string; started_at: string | Date | null; ended_at: string | Date | null }>`
      select code, started_at, ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
    const room = rooms[0];
    if (!room) throw new Error("No quiz with that code");
    if (room.ended_at) throw new Error("This test has ended");
    const existing = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from quiz_players where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!existing[0]) {
      if (room.started_at) throw new Error("This test has already started");
      const counts = await sql<{ n: number }>`select count(*)::int as n from quiz_players where room_code = ${data.code}`;
      if ((counts[0]?.n ?? 0) >= MAX_QUIZ_FRIENDS) {
        throw new Error(`This quiz is full (${MAX_QUIZ_FRIENDS} friends)`);
      }
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

export const getQuizPaper = createServerFn({ method: "GET" })
  .validator((code: string) => {
    const v = normalizeCode(code);
    if (v.length < 4) throw new Error("Enter a valid room code");
    return v;
  })
  .handler(async ({ data: code }): Promise<{
    title: string;
    questions: Question[];
    timeLimitSec: number;
    startedAt: string | null;
    endedAt: string | null;
    serverNow: string;
  }> => {
    const sql = await getSql();
    await settleExpired(sql, code);
    const rooms = await sql<{
      title: string;
      questions: unknown;
      time_limit_sec: number | null;
      started_at: string | Date | null;
      ended_at: string | Date | null;
    }>`
      select title, questions, time_limit_sec, started_at, ended_at from quiz_rooms where code = ${code} limit 1
    `;
    const room = rooms[0];
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
      serverNow: new Date().toISOString(),
    };
  });

export const listQuiz = createServerFn({ method: "GET" })
  .validator((data: { code: string; playerId?: string } | string) => {
    if (typeof data === "string") {
      const code = normalizeCode(data);
      if (code.length < 4) throw new Error("Enter a valid room code");
      return { code, playerId: "" };
    }
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    if (code.length < 4) throw new Error("Enter a valid room code");
    return { code, playerId };
  })
  .handler(async ({ data }): Promise<QuizRoom> => loadRoom(data.code, data.playerId || undefined));

export const getQuizSummary = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; viewCode: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const viewCode = normalizeCode(data.viewCode);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    if (viewCode.length < 4) throw new Error("Enter a view code");
    return { code, playerId, viewCode };
  })
  .handler(async ({ data }): Promise<QuizSummaryView> => {
    const sql = await getSql();
    const rooms = await sql<{ questions: unknown }>`
      select questions from quiz_rooms where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No quiz with that code");
    const viewer = await sql<{ player_id: string; submitted_at: string | Date | null; view_code: string | null }>`
      select player_id, submitted_at, view_code from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!viewer[0]) throw new Error("Join this quiz first");
    if (!viewer[0].submitted_at) throw new Error("Submit your paper first to open summaries");
    if (viewer[0].view_code && viewer[0].view_code === data.viewCode) {
      throw new Error("Summaries stay swapped — enter a friend’s view code");
    }
    const target = await sql<PlayerRow>`
      select player_id, name, joined_at, submitted_at, ready_at, left_at, correct, wrong, not_attempted, marked, total, score,
             view_code, assigned_player_id, items
      from quiz_players
      where room_code = ${data.code} and view_code = ${data.viewCode} limit 1
    `;
    const row = target[0];
    if (!row?.submitted_at) throw new Error("No summary with that code in this room");
    if (row.player_id === data.playerId) {
      throw new Error("Summaries stay swapped — enter a friend’s view code");
    }
    const questions = compactQuestions(
      typeof rooms[0].questions === "string" ? JSON.parse(rooms[0].questions) : rooms[0].questions,
    );
    const summary = summaryFromRow(row, questions);
    if (!summary) throw new Error("That summary is not ready yet");
    return summary;
  });

export const submitQuizScore = createServerFn({ method: "POST" })
  .validator((data: {
    code: string;
    playerId: string;
    name: string;
    correct: number;
    wrong: number;
    notAttempted: number;
    marked: number;
    total: number;
    score: number;
    items?: unknown;
  }) => {
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
      items: compactQuizItems(data.items),
    };
  })
  .handler(async ({ data }): Promise<QuizRoom> => {
    const sql = await getSql();
    const rooms = await sql<{
      code: string;
      started_at: string | Date | null;
      ended_at: string | Date | null;
      time_limit_sec: number | null;
    }>`
      select code, started_at, ended_at, time_limit_sec from quiz_rooms where code = ${data.code} limit 1
    `;
    const room = rooms[0];
    if (!room) throw new Error("No quiz with that code");
    const endsAt = quizEndsAtMs(asIso(room.started_at), Number(room.time_limit_sec) || 0);
    if (paperSubmitLocked(endsAt, Date.now() + 1500)) {
      throw new Error("The paper stays open until time is up");
    }
    const existing = await sql<{ submitted_at: string | Date | null; view_code: string | null }>`
      select submitted_at, view_code from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (existing[0]?.submitted_at) {
      throw new Error("This paper is already submitted and cannot be changed");
    }
    const viewCode = existing[0]?.view_code || (await uniqueViewCode(sql, data.code));
    const rawItems = JSON.stringify(data.items);
    if (existing[0]) {
      await sql`
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
    } else {
      const counts = await sql<{ n: number }>`select count(*)::int as n from quiz_players where room_code = ${data.code}`;
      if ((counts[0]?.n ?? 0) >= MAX_QUIZ_FRIENDS) {
        throw new Error(`This quiz is full (${MAX_QUIZ_FRIENDS} friends)`);
      }
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
    const pending = await sql<{ n: number }>`
      select count(*)::int as n from quiz_players
      where room_code = ${data.code} and submitted_at is null and left_at is null
    `;
    if ((pending[0]?.n ?? 0) === 0) {
      await sql`update quiz_rooms set ended_at = coalesce(ended_at, now()) where code = ${data.code}`;
    }
    await reassignSummaries(sql, data.code);
    return loadRoom(data.code, data.playerId);
  });

export const readyQuiz = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<QuizRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ ended_at: string | Date | null }>`
      select ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No quiz with that code");
    if (rooms[0].ended_at) throw new Error("This test has ended");
    const mine = await sql<{ player_id: string; left_at: string | Date | null }>`
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

export const sendQuizChat = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string; body: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    const body = String(data.body || "").trim().slice(0, 400);
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    if (!body) throw new Error("Write a message");
    return { code, playerId, name, body };
  })
  .handler(async ({ data }): Promise<QuizRoom> => {
    const sql = await getSql();
    const mine = await sql<{ player_id: string; left_at: string | Date | null }>`
      select player_id, left_at from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!mine[0] || mine[0].left_at) throw new Error("Join this quiz first");
    const id = `${Date.now().toString(36)}-${makeCode()}`;
    await sql`
      insert into quiz_messages (id, room_code, player_id, name, body)
      values (${id}, ${data.code}, ${data.playerId}, ${data.name}, ${data.body})
    `;
    return loadRoom(data.code, data.playerId);
  });

export const leaveQuiz = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const sql = await getSql();
    const rooms = await sql<{ started_at: string | Date | null; ended_at: string | Date | null }>`
      select started_at, ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No quiz with that code");
    const mine = await sql<{ submitted_at: string | Date | null }>`
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

export const endQuiz = createServerFn({ method: "POST" })
  .validator((data: { code: string; playerId: string; name: string }) => {
    const code = normalizeCode(data.code);
    const playerId = String(data.playerId || "").trim().slice(0, 64);
    const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
    if (code.length < 4) throw new Error("Enter a valid room code");
    if (!playerId) throw new Error("Missing player");
    return { code, playerId, name };
  })
  .handler(async ({ data }): Promise<QuizRoom> => {
    const sql = await getSql();
    const rooms = await sql<{ started_at: string | Date | null; ended_at: string | Date | null }>`
      select started_at, ended_at from quiz_rooms where code = ${data.code} limit 1
    `;
    if (!rooms[0]) throw new Error("No quiz with that code");
    const mine = await sql<{ player_id: string }>`
      select player_id from quiz_players
      where room_code = ${data.code} and player_id = ${data.playerId} limit 1
    `;
    if (!mine[0]) throw new Error("Join this quiz first");
    if (rooms[0].started_at && !rooms[0].ended_at) {
      const questions = await loadQuestions(sql, data.code);
      const pending = await sql<{ player_id: string; name: string }>`
        select player_id, name from quiz_players
        where room_code = ${data.code} and submitted_at is null
      `;
      for (const p of pending) {
        await recordSkipped(sql, data.code, p.player_id, p.name, questions);
      }
      if (pending.length) await reassignSummaries(sql, data.code);
    }
    await sql`update quiz_rooms set ended_at = coalesce(ended_at, now()) where code = ${data.code}`;
    return loadRoom(data.code, data.playerId);
  });
