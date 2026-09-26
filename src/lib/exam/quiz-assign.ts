import type { Card, Question, QuestionType } from "./types.ts";

export type QuizAttemptItem = {
  bankId: string;
  userAns: number | number[] | string | null;
  isAttempted: boolean;
  isCorrect: boolean;
  isMarked: boolean;
};

export type QuizSummaryItem = QuizAttemptItem & {
  type: QuestionType;
  question: string;
  options: string[];
  correct: number | number[] | string;
  explanation: string;
  rule: string;
};

export type QuizSummaryView = {
  playerId: string;
  name: string;
  viewCode: string;
  correct: number;
  wrong: number;
  notAttempted: number;
  marked: number;
  total: number;
  score: number;
  items: QuizSummaryItem[];
};

export type QuizSectionGroup = {
  name: string;
  cards: Card[];
};

export type QuizSectionPick = {
  name: string;
  count: number;
};

export type QuizFolderOption = {
  id: string;
  label: string;
  kind: "deck" | "notes";
  count: number;
};

/** Sattolo shuffle: a cyclic permutation, so nobody keeps their own id. */
export function derangeIds(ids: string[]): Record<string, string> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length < 2) return {};
  const dest = unique.slice();
  for (let i = dest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const a = dest[i]!;
    dest[i] = dest[j]!;
    dest[j] = a;
  }
  const map: Record<string, string> = {};
  for (let i = 0; i < unique.length; i++) map[unique[i]!] = dest[i]!;
  return map;
}

export function isDerangement(map: Record<string, string>, ids: string[]): boolean {
  if (ids.length < 2) return Object.keys(map).length === 0;
  if (Object.keys(map).length !== ids.length) return false;
  return ids.every((id) => {
    const other = map[id];
    return Boolean(other) && other !== id && ids.includes(other);
  });
}

function parseJson(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function normalizeUserAns(raw: unknown): number | number[] | string | null {
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) {
    return raw.map(Number).filter((n) => Number.isFinite(n));
  }
  return null;
}

export function compactQuizItems(raw: unknown): QuizAttemptItem[] {
  const parsed = parseJson(raw);
  if (!Array.isArray(parsed)) return [];
  const out: QuizAttemptItem[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const bankId = String(row.bankId ?? row.id ?? "").trim();
    if (!bankId || seen.has(bankId)) continue;
    seen.add(bankId);
    out.push({
      bankId,
      userAns: normalizeUserAns(row.userAns),
      isAttempted: Boolean(row.isAttempted),
      isCorrect: Boolean(row.isCorrect),
      isMarked: Boolean(row.isMarked),
    });
  }
  return out;
}

function asSummaryItem(q: Question, item: QuizAttemptItem): QuizSummaryItem {
  return {
    ...item,
    bankId: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    rule: q.rule,
  };
}

export function buildSummaryItems(questions: Question[], items: QuizAttemptItem[]): QuizSummaryItem[] {
  const qmap = new Map(questions.map((q) => [q.id, q]));
  const out: QuizSummaryItem[] = [];
  for (const item of items) {
    const q = qmap.get(item.bankId) ?? questions.find((row) => String(row.id) === String(item.bankId));
    if (!q) continue;
    out.push(asSummaryItem(q, item));
  }
  if (!out.length && items.length && questions.length) {
    const n = Math.min(items.length, questions.length);
    for (let i = 0; i < n; i++) out.push(asSummaryItem(questions[i]!, items[i]!));
  }
  if (!out.length && questions.length) {
    for (const q of questions) {
      out.push(
        asSummaryItem(q, {
          bankId: q.id,
          userAns: null,
          isAttempted: false,
          isCorrect: false,
          isMarked: false,
        }),
      );
    }
  }
  return out;
}

export function groupQuizSections(cards: Card[]): QuizSectionGroup[] {
  if (!cards.length) return [];
  const hasSource = cards.some((c) => Boolean(c.sourceSection?.trim()));
  if (hasSource) {
    const order: string[] = [];
    const byName = new Map<string, Card[]>();
    for (const card of cards) {
      const name = card.sourceSection?.trim() || card.rule || "General";
      if (!byName.has(name)) {
        byName.set(name, []);
        order.push(name);
      }
      byName.get(name)!.push(card);
    }
    return order.map((name) => ({ name, cards: byName.get(name)! }));
  }
  const rules: string[] = [];
  const byRule = new Map<string, Card[]>();
  for (const card of cards) {
    const name = card.rule || "General";
    if (!byRule.has(name)) {
      byRule.set(name, []);
      rules.push(name);
    }
    byRule.get(name)!.push(card);
  }
  if (rules.length > 1) return rules.map((name) => ({ name, cards: byRule.get(name)! }));
  const size = 25;
  const groups: QuizSectionGroup[] = [];
  for (let i = 0; i < cards.length; i += size) {
    const chunk = cards.slice(i, i + size);
    groups.push({
      name: `Section ${groups.length + 1} (Q${i + 1}–Q${i + chunk.length})`,
      cards: chunk,
    });
  }
  return groups;
}

export function pickSectionCards(groups: QuizSectionGroup[], picks: QuizSectionPick[]): Card[] {
  const out: Card[] = [];
  for (const pick of picks) {
    if (pick.count <= 0) continue;
    const group = groups.find((g) => g.name === pick.name);
    if (!group) continue;
    out.push(...group.cards.slice(0, Math.min(pick.count, group.cards.length)));
  }
  return out;
}

export function quizFolderOptions(
  decks: Array<{ id: string; name: string }>,
  cards: Array<{ deckId: string }>,
  folders: Array<{ id: string; name: string }>,
): QuizFolderOption[] {
  const counts = new Map<string, number>();
  for (const c of cards) counts.set(c.deckId, (counts.get(c.deckId) ?? 0) + 1);
  const out: QuizFolderOption[] = decks.map((d) => ({
    id: `deck:${d.id}`,
    label: d.name.split("::").pop() || d.name,
    kind: "deck" as const,
    count: counts.get(d.id) ?? 0,
  }));
  for (const f of folders) {
    out.push({ id: `notes:${f.id}`, label: f.name, kind: "notes", count: 0 });
  }
  return out;
}

export function cardsForQuizFolder(
  folderId: string,
  decks: Array<{ id: string; name: string }>,
  cards: Card[],
  folders: Array<{ id: string; name: string }>,
): { cards: Card[]; label: string } {
  if (folderId.startsWith("notes:")) {
    const id = folderId.slice(6);
    const folder = folders.find((f) => f.id === id);
    const deck = decks[0];
    return {
      cards: deck ? cards.filter((c) => c.deckId === deck.id) : [],
      label: folder?.name ?? "Notes",
    };
  }
  const id = folderId.startsWith("deck:") ? folderId.slice(5) : folderId;
  const deck = decks.find((d) => d.id === id);
  if (!deck) return { cards: [], label: "Folder" };
  const childIds = new Set(
    decks.filter((d) => d.id === deck.id || d.name.startsWith(`${deck.name}::`)).map((d) => d.id),
  );
  return {
    cards: cards.filter((c) => childIds.has(c.deckId)),
    label: deck.name.split("::").pop() || deck.name,
  };
}

export function todayIsoDate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(raw: string): string | null {
  const v = String(raw || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const t = Date.parse(`${v}T00:00:00`);
  if (!Number.isFinite(t)) return null;
  return v;
}

export function formatIsoDate(raw: string | null | undefined): string {
  if (!raw) return "";
  const t = Date.parse(`${raw}T00:00:00`);
  if (!Number.isFinite(t)) return raw;
  return new Date(t).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function quizEndsAtMs(startedAt: string | null | undefined, timeLimitSec: number): number | null {
  if (!startedAt || timeLimitSec <= 0) return null;
  const start = Date.parse(startedAt);
  if (!Number.isFinite(start)) return null;
  return start + timeLimitSec * 1000;
}

export function remainingMs(endsAt: number | null | undefined, now = Date.now()): number {
  if (!endsAt) return 0;
  return Math.max(0, endsAt - now);
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function paperSubmitLocked(endsAt: number | null | undefined, now = Date.now()): boolean {
  return Boolean(endsAt && now < endsAt);
}

export function lockUntilMs(
  startedAt: string | null | undefined,
  timeLimitSec: number,
  serverNow: string,
  now = Date.now(),
): number {
  const ends = quizEndsAtMs(startedAt, timeLimitSec);
  if (!ends) return 0;
  const server = Date.parse(serverNow);
  if (!Number.isFinite(server)) return ends;
  return now + (ends - server);
}

export function skippedQuizItems(questions: Array<{ id: string }>): QuizAttemptItem[] {
  return questions.map((q) => ({
    bankId: q.id,
    userAns: null,
    isAttempted: false,
    isCorrect: false,
    isMarked: false,
  }));
}

export function clampTimeLimitMin(raw: unknown): number {
  const n = Math.floor(Number(raw) || 0);
  if (!Number.isFinite(n) || n <= 0) return 20;
  return Math.min(180, Math.max(1, n));
}

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function formatAnswer(
  ans: number | number[] | string | null | undefined,
  options: string[],
): string {
  if (ans === undefined || ans === null || ans === "") return "Not answered";
  if (typeof ans === "number") {
    const text = options[ans];
    return text ? `${optionLetter(ans)}. ${text}` : optionLetter(ans);
  }
  if (Array.isArray(ans)) {
    return ans.map((i) => optionLetter(Number(i))).join(", ") || "Not answered";
  }
  return String(ans);
}

export function correctIndexes(correct: number | number[] | string, options: string[]): number[] {
  if (typeof correct === "number") return Number.isFinite(correct) ? [correct] : [];
  if (Array.isArray(correct)) return correct.map(Number).filter((n) => Number.isFinite(n));
  const text = String(correct).trim().toLowerCase();
  const idx = options.findIndex((o) => o.toLowerCase() === text);
  return idx >= 0 ? [idx] : [];
}
