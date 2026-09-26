import type { Card, Deck, PaperFile } from "./types.ts";
import { DEFAULT_CONFIG_ID } from "./types.ts";

export const REVIEW_DAYS = [3, 7, 14, 21] as const;
export type ReviewDays = (typeof REVIEW_DAYS)[number];

export const REVIEW_DECKS: Array<{ id: string; days: ReviewDays; name: string }> = [
  { id: "review-3", days: 3, name: "3-day" },
  { id: "review-7", days: 7, name: "7-day" },
  { id: "review-14", days: 14, name: "14-day" },
  { id: "review-21", days: 21, name: "21-day" },
];

export function isReviewDays(value: unknown): value is ReviewDays {
  return value === 3 || value === 7 || value === 14 || value === 21;
}

export function reviewDeckId(days: ReviewDays): string {
  return `review-${days}`;
}

export function reviewPaperId(days: ReviewDays): string {
  return `review-paper:${days}`;
}

export function deckReviewDays(deck: { id: string; reviewDays?: number } | undefined): ReviewDays | null {
  if (!deck) return null;
  if (isReviewDays(deck.reviewDays)) return deck.reviewDays;
  const match = REVIEW_DECKS.find((row) => row.id === deck.id);
  return match?.days ?? null;
}

export function ensureReviewDecks(decks: Deck[]): Deck[] {
  const now = Date.now();
  const next = decks.slice();
  for (const spec of REVIEW_DECKS) {
    if (next.some((deck) => deck.id === spec.id)) continue;
    next.push({
      id: spec.id,
      name: spec.name,
      description: "Incorrect and unanswered questions. A correct answer is marked done.",
      configId: DEFAULT_CONFIG_ID,
      collapsed: false,
      createdAt: now,
      reviewDays: spec.days,
      kind: "folder",
    });
  }
  return next.map((deck) => {
    const spec = REVIEW_DECKS.find((row) => row.id === deck.id);
    if (!spec) return deck;
    return { ...deck, name: spec.name, reviewDays: spec.days, kind: "folder" };
  });
}

/** A correct answer is finished. A second miss moves to the next folder immediately. */
export function advanceReviewStage(stage: number | undefined, correct: boolean, studyingDays: number | null): number {
  if (correct && (isReviewDays(studyingDays) || isReviewDays(stage))) return 0;
  if (!correct && isReviewDays(studyingDays)) {
    if (studyingDays === 3) return 7;
    if (studyingDays === 7) return 14;
    if (studyingDays === 14) return 21;
    return 21;
  }
  if (!correct) return 3;
  return isReviewDays(stage) ? stage : 0;
}

const NEXT_REVIEW: Record<ReviewDays, ReviewDays> = { 3: 7, 7: 14, 14: 21, 21: 21 };

export function reviewWindowMs(days: ReviewDays) {
  return days * 86_400_000;
}

export function reviewRemainingDays(createdAt: number, days: ReviewDays, now = Date.now()) {
  const left = createdAt + reviewWindowMs(days) - now;
  return left <= 0 ? 0 : Math.ceil(left / 86_400_000);
}

export function reviewLocked(createdAt: number, days: ReviewDays, now = Date.now()) {
  return now >= createdAt + reviewWindowMs(days);
}

export function isReviewDayFolder(deck: { name: string; reviewDays?: number } | undefined) {
  return Boolean(deck && isReviewDays(deck.reviewDays) && deck.name.includes("::"));
}

function dayKey(now: number) {
  const date = new Date(now);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function reviewDayFolderId(days: ReviewDays, now: number) {
  return `review-${days}:${dayKey(now)}`;
}

function reviewStamp(now: number) {
  return new Date(now).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ensureDayFolder(decks: Deck[], days: ReviewDays, now: number): { decks: Deck[]; id: string } {
  const id = reviewDayFolderId(days, now);
  if (decks.some((deck) => deck.id === id)) return { decks, id };
  const parent = REVIEW_DECKS.find((row) => row.days === days);
  return {
    id,
    decks: [
      ...decks,
      {
        id,
        name: `${parent?.name ?? `${days}-day`}::${reviewStamp(now)}`,
        description: "Review day",
        configId: DEFAULT_CONFIG_ID,
        collapsed: false,
        createdAt: now,
        reviewDays: days,
        kind: "folder",
      },
    ],
  };
}

function withMark(card: Card, bucket: string, stage: ReviewDays, outcome: "pending" | "correct" | "transfer", at: number): Card {
  const history = card.reviewHistory ?? [];
  const last = [...history].reverse().find((mark) => mark.bucket === bucket);
  if (last?.outcome === outcome) return card;
  return { ...card, reviewHistory: [...history, { bucket, stage, outcome, at }] };
}

export function placeReviewCards(
  decks: Deck[],
  cards: Card[],
  items: Array<{ bankId: string | number; isAttempted: boolean; isCorrect: boolean }>,
  studyingDays: ReviewDays | null,
  now = Date.now(),
): { decks: Deck[]; cards: Card[] } {
  let nextDecks = decks;
  const buckets = new Map<ReviewDays, string>();
  function bucket(days: ReviewDays) {
    const existing = buckets.get(days);
    if (existing) return existing;
    const made = ensureDayFolder(nextDecks, days, now);
    nextDecks = made.decks;
    buckets.set(days, made.id);
    return made.id;
  }
  const byId = new Map(items.map((item) => [String(item.bankId), item]));
  const nextCards = cards.map((card) => {
    const item = byId.get(card.id);
    if (!item) return card;
    if (item.isAttempted && item.isCorrect) {
      if (!(studyingDays || isReviewDays(card.reviewStage))) return card;
      const stage = studyingDays ?? (isReviewDays(card.reviewStage) ? card.reviewStage : null);
      const bucketId = card.reviewBucket;
      const cleared = { ...card, reviewStage: undefined, reviewBucket: undefined };
      return bucketId && stage ? withMark(cleared, bucketId, stage, "correct", now) : cleared;
    }
    if (!item.isAttempted) {
      if (studyingDays) return card;
      const id = bucket(3);
      return withMark({ ...card, reviewStage: 3 as const, reviewBucket: id }, id, 3, "pending", now);
    }
    if (studyingDays) {
      if (studyingDays === 21) return card;
      const next = NEXT_REVIEW[studyingDays];
      const from = card.reviewBucket;
      const moved = from ? withMark(card, from, studyingDays, "transfer", now) : card;
      const id = bucket(next);
      return withMark({ ...moved, reviewStage: next, reviewBucket: id }, id, next, "pending", now);
    }
    const id = bucket(3);
    return withMark({ ...card, reviewStage: 3 as const, reviewBucket: id }, id, 3, "pending", now);
  });
  return { decks: nextDecks, cards: nextCards };
}

export function rollExpiredReviews(decks: Deck[], cards: Card[], _now = Date.now()) {
  return { decks: ensureReviewDecks(decks), cards };
}

export type ReviewStats = {
  dayCount: number;
  daysLeft: number;
  pending: number;
  correct: number;
  transfer: number;
  incorrect: number;
  remaining: number;
  practiced: boolean;
};

export function reviewStatsFor(deck: Deck, decks: Deck[], cards: Card[], now = Date.now()): ReviewStats | null {
  const days = deckReviewDays(deck);
  if (!days) return null;
  const children = decks.filter((item) => item.reviewDays === days && item.name.startsWith(`${deck.name}::`));
  const folders = isReviewDayFolder(deck) ? [deck] : children;
  const ids = new Set(folders.map((item) => item.id));
  let pending = 0;
  let correct = 0;
  let transfer = 0;
  for (const card of cards) {
    if (card.reviewBucket && ids.has(card.reviewBucket)) pending += 1;
    for (const mark of card.reviewHistory ?? []) {
      if (!ids.has(mark.bucket)) continue;
      if (mark.outcome === "correct") correct += 1;
      if (mark.outcome === "transfer") transfer += 1;
    }
  }
  const daysLeft = folders.length ? Math.min(...folders.map((item) => reviewRemainingDays(item.createdAt, days, now))) : days;
  return {
    dayCount: days,
    daysLeft,
    pending,
    correct,
    transfer,
    incorrect: pending + transfer,
    remaining: pending,
    practiced: pending === 0 && correct + transfer > 0,
  };
}

export function cardsAtStage(cards: Card[], days: ReviewDays): Card[] {
  return cards.filter((card) => card.reviewStage === days && card.queue !== "suspended");
}

export function syncReviewPapers(papers: PaperFile[], cards: Card[], now = Date.now()): PaperFile[] {
  const kept = papers.filter((paper) => !paper.id.startsWith("review-paper:"));
  const next = kept.slice();
  for (const spec of REVIEW_DECKS) {
    const ids = cardsAtStage(cards, spec.days).map((card) => card.id);
    if (!ids.length) continue;
    next.push({
      id: reviewPaperId(spec.days),
      deckId: spec.id,
      kind: "wrong",
      title: `${spec.name} test`,
      questionIds: ids,
      createdAt: now,
      dueAt: now,
      repetition: spec.days,
      sourceSessionId: "",
    });
  }
  return next;
}
