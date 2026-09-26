import type {
  Card,
  ExamCompletePayload,
  PaperFile,
  PaperKind,
  ResultCounts,
  SessionSummary,
  TemplateResult,
} from "./types.ts";

export const TAG_WRONG = "wrong";
export const TAG_SKIPPED = "skipped";
export const TAG_MARKED = "marked";

export type ResultBucket = "wrong" | "skipped" | "marked" | "correct" | "attempted";

export function bucketPaperId(deckId: string, kind: PaperKind): string {
  return `bucket:${deckId}:${kind}`;
}

export function applyResultTags(tags: string[], item: {
  isAttempted: boolean;
  isCorrect: boolean;
  isMarked: boolean;
}, marked: boolean): string[] {
  const next = tags.filter((t) => t !== TAG_WRONG && t !== TAG_SKIPPED && t !== TAG_MARKED);
  if (!item.isAttempted) next.push(TAG_SKIPPED);
  else if (!item.isCorrect) next.push(TAG_WRONG);
  if (marked) next.push(TAG_MARKED);
  return next;
}

export function stampCardFromItem(
  card: Card,
  item: { isAttempted: boolean; isCorrect: boolean; isMarked: boolean },
): Pick<Card, "marked" | "tags"> {
  const corrected = item.isAttempted && item.isCorrect;
  const marked = Boolean(item.isMarked) || (card.marked && !corrected);
  return { marked, tags: applyResultTags(card.tags, item, marked) };
}

export function hasTag(card: Card, tag: string): boolean {
  return card.tags.includes(tag);
}

export function isWrongCard(card: Card): boolean {
  return hasTag(card, TAG_WRONG);
}

export function isSkippedCard(card: Card): boolean {
  return hasTag(card, TAG_SKIPPED);
}

export function isMarkedCard(card: Card): boolean {
  return card.marked || hasTag(card, TAG_MARKED);
}

export function isCorrectCard(card: Card): boolean {
  if (isWrongCard(card) || isSkippedCard(card)) return false;
  return card.lastRating === "good" || card.lastRating === "easy" || card.lastRating === "hard";
}

export function resultCounts(cards: Card[], deckId: string): ResultCounts {
  const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended");
  return {
    wrong: mine.filter(isWrongCard).length,
    marked: mine.filter(isMarkedCard).length,
    skipped: mine.filter(isSkippedCard).length,
    correct: mine.filter(isCorrectCard).length,
  };
}

export function cardsForBucket(cards: Card[], deckId: string, bucket: ResultBucket): Card[] {
  const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended" && c.queue !== "buried");
  if (bucket === "wrong") return mine.filter(isWrongCard);
  if (bucket === "skipped") return mine.filter(isSkippedCard);
  if (bucket === "marked") return mine.filter(isMarkedCard);
  if (bucket === "correct") return mine.filter(isCorrectCard);
  return mine.filter((c) => !isSkippedCard(c) && Boolean(c.lastRating));
}

export function idsForSessionPick(session: SessionSummary, pick: ResultBucket): string[] {
  if (pick === "wrong") return session.wrongIds ?? session.againIds ?? [];
  if (pick === "skipped") return session.skippedIds ?? [];
  if (pick === "marked") return session.markedIds ?? session.hardIds ?? [];
  if (pick === "correct") return session.correctIds ?? session.goodIds ?? [];
  const attempted = [
    ...(session.wrongIds ?? session.againIds ?? []),
    ...(session.correctIds ?? session.goodIds ?? []),
    ...(session.hardIds ?? []),
  ];
  return [...new Set(attempted)];
}

export function splitResultIds(payload: ExamCompletePayload): {
  wrongIds: string[];
  skippedIds: string[];
  markedIds: string[];
  correctIds: string[];
  againIds: string[];
  hardIds: string[];
  goodIds: string[];
} {
  const wrongIds: string[] = [];
  const skippedIds: string[] = [];
  const markedIds: string[] = [];
  const correctIds: string[] = [];
  const againIds: string[] = [];
  const hardIds: string[] = [];
  const goodIds: string[] = [];
  for (const item of payload.items) {
    const id = String(item.bankId);
    if (!item.isAttempted) skippedIds.push(id);
    else if (!item.isCorrect) wrongIds.push(id);
    else correctIds.push(id);
    if (item.isMarked) markedIds.push(id);
    if (!item.isAttempted || !item.isCorrect) againIds.push(id);
    else if (item.isMarked) hardIds.push(id);
    else goodIds.push(id);
  }
  return { wrongIds, skippedIds, markedIds, correctIds, againIds, hardIds, goodIds };
}

export function upsertBucketPapers(
  papers: PaperFile[],
  deckId: string,
  buckets: { wrong: string[]; skipped: string[]; marked: string[]; correct: string[] },
  sessionId: string,
  now = Date.now(),
): PaperFile[] {
  const kinds: Array<{ kind: PaperKind; ids: string[]; title: string }> = [
    { kind: "wrong", ids: buckets.wrong, title: `Learning / Wrong · ${buckets.wrong.length} Q` },
    { kind: "skipped", ids: buckets.skipped, title: `Unattempted · ${buckets.skipped.length} Q` },
    { kind: "marked", ids: buckets.marked, title: `Review · ${buckets.marked.length} Q` },
    { kind: "correct", ids: buckets.correct, title: `Correct · ${buckets.correct.length} Q` },
  ];
  const replace = new Set(kinds.map((k) => bucketPaperId(deckId, k.kind)));
  replace.add(bucketPaperId(deckId, "hard"));
  const kept = papers.filter((p) => !replace.has(p.id) && !(p.deckId === deckId && (p.kind === "wrong" || p.kind === "hard") && p.id.startsWith("bucket:")));
  const next: PaperFile[] = [];
  for (const row of kinds) {
    if (!row.ids.length) continue;
    next.push({
      id: bucketPaperId(deckId, row.kind),
      deckId,
      kind: row.kind,
      title: row.title,
      questionIds: row.ids,
      createdAt: now,
      dueAt: now,
      repetition: 0,
      sourceSessionId: sessionId,
    });
  }
  return [...next, ...kept].slice(0, 80);
}

export function rollingBucketsFromCards(cards: Card[], deckId: string): {
  wrong: string[];
  skipped: string[];
  marked: string[];
  correct: string[];
} {
  const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended");
  return {
    wrong: mine.filter(isWrongCard).map((c) => c.id),
    skipped: mine.filter(isSkippedCard).map((c) => c.id),
    marked: mine.filter(isMarkedCard).map((c) => c.id),
    correct: mine.filter(isCorrectCard).map((c) => c.id),
  };
}

export function normalizeSessionSummary(raw: unknown): SessionSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<SessionSummary>;
  const id = String(s.id ?? "").trim();
  const deckId = String(s.deckId ?? "").trim();
  if (!id || !deckId) return null;
  const againIds = Array.isArray(s.againIds) ? s.againIds.map(String) : [];
  const hardIds = Array.isArray(s.hardIds) ? s.hardIds.map(String) : [];
  const goodIds = Array.isArray(s.goodIds) ? s.goodIds.map(String) : [];
  return {
    id,
    deckId,
    at: Number(s.at) || Date.now(),
    total: Math.max(0, Number(s.total) || 0),
    correct: Math.max(0, Number(s.correct) || 0),
    wrong: Math.max(0, Number(s.wrong) || 0),
    notAttempted: Math.max(0, Number(s.notAttempted) || 0),
    marked: Math.max(0, Number(s.marked) || 0),
    againIds,
    hardIds,
    goodIds,
    wrongIds: Array.isArray(s.wrongIds) ? s.wrongIds.map(String) : againIds,
    skippedIds: Array.isArray(s.skippedIds) ? s.skippedIds.map(String) : [],
    markedIds: Array.isArray(s.markedIds) ? s.markedIds.map(String) : hardIds,
    correctIds: Array.isArray(s.correctIds) ? s.correctIds.map(String) : goodIds,
    paperId: s.paperId ? String(s.paperId) : null,
    templateId: s.templateId ? String(s.templateId) : null,
  };
}

export function normalizeSessions(raw: unknown): SessionSummary[] {
  if (!Array.isArray(raw)) return [];
  const out: SessionSummary[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const row = normalizeSessionSummary(item);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
    if (out.length >= 120) break;
  }
  return out;
}

export function lastSessionForDeck(sessions: SessionSummary[], deckId: string): SessionSummary | null {
  return sessions.find((s) => s.deckId === deckId) ?? null;
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

export function mergeSessionResults(
  parent: SessionSummary,
  split: ReturnType<typeof splitResultIds>,
  payload: ExamCompletePayload,
): SessionSummary {
  const touched = new Set(payload.items.map((item) => String(item.bankId)));
  const drop = (ids?: string[]) => (ids ?? []).filter((id) => !touched.has(id));
  const wrongIds = uniqueIds([...drop(parent.wrongIds ?? parent.againIds), ...split.wrongIds]);
  const skippedIds = uniqueIds([...drop(parent.skippedIds), ...split.skippedIds]);
  const markedIds = uniqueIds([...drop(parent.markedIds ?? parent.hardIds), ...split.markedIds]);
  const correctIds = uniqueIds([...drop(parent.correctIds ?? parent.goodIds), ...split.correctIds]);
  const againIds = uniqueIds([...drop(parent.againIds), ...split.againIds]);
  const hardIds = uniqueIds([...drop(parent.hardIds), ...split.hardIds]);
  const goodIds = uniqueIds([...drop(parent.goodIds), ...split.goodIds]);
  return {
    ...parent,
    at: Date.now(),
    wrongIds,
    skippedIds,
    markedIds,
    correctIds,
    againIds,
    hardIds,
    goodIds,
    wrong: wrongIds.length,
    notAttempted: skippedIds.length,
    marked: markedIds.length,
    correct: correctIds.length,
    total: Math.max(parent.total || 0, payload.total || 0, wrongIds.length + skippedIds.length + correctIds.length),
  };
}

export function asTemplateResult(
  session: SessionSummary,
  deckName?: string,
): TemplateResult {
  return {
    sessionId: session.id,
    deckId: session.deckId,
    deckName,
    at: session.at,
    total: session.total,
    correct: session.correct,
    wrong: session.wrong,
    notAttempted: session.notAttempted,
    marked: session.marked,
  };
}

export function paperKindLabel(kind: PaperKind): string {
  if (kind === "wrong" || kind === "hard") return "Learning / Wrong";
  if (kind === "skipped") return "Unattempted";
  if (kind === "marked") return "Review";
  return "Correct";
}
