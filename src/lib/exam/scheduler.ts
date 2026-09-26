import { uid } from "@/lib/utils";
import { stampCardFromItem } from "./results";
import type {
  Card,
  Daily,
  DeckConfig,
  DeckCounts,
  ExamCompletePayload,
  Prefs,
  Rating,
  RevLog,
} from "./types";

/** Display ladder: 8 spaced repetitions after a miss */
export const REVIEW_STEPS_DAYS = [0, 1, 3, 7, 14, 30, 60, 120] as const;
export const MINUTE = 60_000;
export const DAY = 24 * 60 * 60 * 1000;

export function formatInterval(ms: number): string {
  if (ms <= 0) return "now";
  const mins = Math.round(ms / MINUTE);
  if (mins < 60) return `${Math.max(1, mins)}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export function dayKey(now: number, dayStartHour: number): string {
  const d = new Date(now);
  if (d.getHours() < dayStartHour) d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ensureDaily(daily: Daily, dayStartHour: number, now = Date.now()): Daily {
  const key = dayKey(now, dayStartHour);
  if (daily.day === key) return daily;
  return { day: key, byDeck: {} };
}

export function ratingFromResult(item: {
  isAttempted: boolean;
  isCorrect: boolean;
  isMarked: boolean;
}): Rating {
  if (!item.isAttempted || !item.isCorrect) return "again";
  if (item.isMarked) return "hard";
  return "good";
}

function clampEase(ease: number) {
  return Math.max(1300, ease);
}

function nextLearnDue(steps: number[], remainingAfter: number, now: number): number {
  const idx = Math.max(0, steps.length - remainingAfter);
  const minutes = steps[Math.min(idx, steps.length - 1)] ?? 10;
  return now + minutes * MINUTE;
}

export function answerCard(card: Card, rating: Rating, config: DeckConfig, now = Date.now()): Card {
  const next: Card = { ...card, reps: card.reps + 1, modifiedAt: now, lastRating: rating } as Card;
  const learning = card.queue === "new" || card.queue === "learn" || card.queue === "relearn";
  const steps = card.queue === "relearn" ? config.relearnSteps : config.learnSteps;

  if (learning) {
    if (rating === "again") {
      next.queue = "learn";
      next.remainingSteps = steps.length;
      next.due = nextLearnDue(steps, next.remainingSteps, now);
      if (card.queue === "relearn" || card.queue === "review") next.lapses += 1;
      return next;
    }
    if (rating === "easy") {
      next.queue = "review";
      next.remainingSteps = 0;
      next.interval = config.easyInterval;
      next.ease = config.startingEase;
      next.due = now + next.interval * DAY;
      return next;
    }
    const remaining = card.queue === "new" ? steps.length : card.remainingSteps;
    if (rating === "hard") {
      next.queue = "learn";
      next.remainingSteps = Math.max(1, remaining);
      next.due = now + Math.max(steps[0] ?? 10, 1) * MINUTE * 1.5;
      return next;
    }
    const after = remaining - 1;
    if (after <= 0) {
      next.queue = "review";
      next.remainingSteps = 0;
      next.interval = config.graduatingInterval;
      next.ease = config.startingEase;
      next.due = now + next.interval * DAY;
      return next;
    }
    next.queue = "learn";
    next.remainingSteps = after;
    next.due = nextLearnDue(steps, after, now);
    return next;
  }

  if (rating === "again") {
    next.lapses += 1;
    next.queue = "relearn";
    next.remainingSteps = config.relearnSteps.length;
    next.interval = Math.max(config.minimumInterval, Math.round(card.interval * 0));
    next.ease = clampEase(card.ease - 200);
    next.due = nextLearnDue(config.relearnSteps, next.remainingSteps, now);
    if (next.lapses >= config.leechThreshold && config.leechAction === "suspend") {
      next.queue = "suspended";
      if (!next.tags.includes("leech")) next.tags = [...next.tags, "leech"];
    } else if (next.lapses >= config.leechThreshold) {
      if (!next.tags.includes("leech")) next.tags = [...next.tags, "leech"];
    }
    return next;
  }

  let interval = card.interval || 1;
  let ease = card.ease || config.startingEase;
  if (rating === "hard") {
    interval = Math.max(1, interval * config.hardInterval);
    ease = clampEase(ease - 150);
  } else if (rating === "good") {
    interval = interval * (ease / 1000) * config.intervalModifier;
    } else {
    interval = interval * (ease / 1000) * config.easyBonus * config.intervalModifier;
    ease = ease + 150;
  }
  interval = Math.min(config.maximumInterval, Math.max(config.minimumInterval, Math.round(interval)));
  next.queue = "review";
  next.interval = interval;
  next.ease = ease;
  next.due = now + interval * DAY;
  return next;
}

export function deckCounts(
  cards: Card[],
  deckId: string,
  config: DeckConfig,
  daily: Daily,
  prefs: Prefs,
  now = Date.now(),
): DeckCounts {
  const mine = cards.filter((c) => c.deckId === deckId);
  const suspended = mine.filter((c) => c.queue === "suspended" || c.queue === "buried").length;
  const active = mine.filter((c) => c.queue !== "suspended" && c.queue !== "buried");
  const newAll = active.filter((c) => c.queue === "new").length;
  const studied = daily.byDeck[deckId]?.newStudied ?? 0;
  const newLeft = Math.max(0, Math.min(newAll, config.newPerDay - studied));
  const ahead = prefs.learnAheadMinutes * MINUTE;
  const learn = active.filter(
    (c) => (c.queue === "learn" || c.queue === "relearn") && c.due <= now + ahead,
  ).length;
  const reviewsDue = active.filter((c) => c.queue === "review" && c.due <= now).length;
  const revStudied = daily.byDeck[deckId]?.reviewsStudied ?? 0;
  const reviewLeft = Math.max(0, Math.min(reviewsDue, config.reviewsPerDay - revStudied));
  return { new: newLeft, learn, review: reviewLeft, total: mine.length, suspended };
}

export function buildStudyQueue(
  cards: Card[],
  deckId: string,
  config: DeckConfig,
  daily: Daily,
  prefs: Prefs,
  now = Date.now(),
): Card[] {
  const counts = deckCounts(cards, deckId, config, daily, prefs, now);
  const active = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended" && c.queue !== "buried");
  let news = active.filter((c) => c.queue === "new");
  if (config.newOrder === "random") news = shuffle(news);
  else news = news.slice().sort((a, b) => a.createdAt - b.createdAt);
  news = news.slice(0, counts.new);
  const learn = active
    .filter((c) => (c.queue === "learn" || c.queue === "relearn") && c.due <= now + prefs.learnAheadMinutes * MINUTE)
    .sort((a, b) => a.due - b.due);
  const reviews = active
    .filter((c) => c.queue === "review" && c.due <= now)
    .sort((a, b) => a.due - b.due)
    .slice(0, counts.review);

  if (prefs.newPosition === "before") return [...news, ...learn, ...reviews];
  if (prefs.newPosition === "after") return [...learn, ...reviews, ...news];
  const mixed: Card[] = [];
  const a = [...learn, ...reviews];
  const b = [...news];
  while (a.length || b.length) {
    if (a.length) mixed.push(a.shift()!);
    if (b.length) mixed.push(b.shift()!);
  }
  return mixed;
}

export function applyResultsToCards(
  cards: Card[],
  configs: Record<string, DeckConfig>,
  deckConfigId: string,
  payload: ExamCompletePayload,
  now = Date.now(),
): { cards: Card[]; logs: RevLog[] } {
  const config = configs[deckConfigId];
  const byId = new Map(cards.map((c) => [c.id, c]));
  const logs: RevLog[] = [];
  for (const item of payload.items) {
    const card = byId.get(String(item.bankId));
    if (!card) continue;
    const rating = ratingFromResult(item);
    const scheduled = answerCard(card, rating, config, now);
    const stamped = stampCardFromItem(scheduled, item);
    const updated = { ...scheduled, marked: stamped.marked, tags: stamped.tags };
    byId.set(card.id, updated);
    logs.push({
      id: uid(),
      cardId: card.id,
      deckId: card.deckId,
      rating,
      queue: card.queue,
      interval: updated.interval,
      ease: updated.ease,
      at: now,
    });
  }
  return { cards: cards.map((c) => byId.get(c.id) ?? c), logs };
}

export function bumpDaily(daily: Daily, deckId: string, newCount: number, reviewCount: number): Daily {
  const cur = daily.byDeck[deckId] ?? { newStudied: 0, reviewsStudied: 0 };
  return {
    ...daily,
    byDeck: {
      ...daily.byDeck,
      [deckId]: {
        newStudied: cur.newStudied + newCount,
        reviewsStudied: cur.reviewsStudied + reviewCount,
      },
    },
  };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function forecast(cards: Card[], days: number, now = Date.now()): number[] {
  const out = Array.from({ length: days }, () => 0);
  for (const c of cards) {
    if (c.queue !== "review" && c.queue !== "learn" && c.queue !== "relearn") continue;
    const diff = Math.floor((c.due - now) / DAY);
    if (diff >= 0 && diff < days) out[diff] += 1;
    if (diff < 0 && c.queue === "review") out[0] += 1;
  }
  return out;
}
