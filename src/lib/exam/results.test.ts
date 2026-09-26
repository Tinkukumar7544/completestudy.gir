import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyResultTags,
  asTemplateResult,
  bucketPaperId,
  cardsForBucket,
  idsForSessionPick,
  mergeSessionResults,
  normalizeSessionSummary,
  resultCounts,
  rollingBucketsFromCards,
  splitResultIds,
  stampCardFromItem,
  upsertBucketPapers,
} from "./results.ts";
import type { Card, ExamCompletePayload, SessionSummary } from "./types.ts";

function card(partial: Partial<Card> & Pick<Card, "id">): Card {
  const now = 1;
  return {
    deckId: "d1",
    type: "mcq",
    rule: "General",
    question: "Q",
    options: ["A", "B"],
    correct: 0,
    explanation: "",
    tags: [],
    queue: "new",
    due: 0,
    interval: 0,
    ease: 2500,
    reps: 0,
    lapses: 0,
    remainingSteps: 0,
    flag: 0,
    marked: false,
    createdAt: now,
    modifiedAt: now,
    ...partial,
  };
}

describe("result buckets", () => {
  it("splits wrong, skipped, marked, and correct without mixing skipped into wrong", () => {
    const payload: ExamCompletePayload = {
      total: 4,
      correct: 2,
      wrong: 1,
      notAttempted: 1,
      marked: 2,
      items: [
        { bankId: "w", isAttempted: true, isCorrect: false, isMarked: false },
        { bankId: "s", isAttempted: false, isCorrect: false, isMarked: false },
        { bankId: "m", isAttempted: true, isCorrect: true, isMarked: true },
        { bankId: "c", isAttempted: true, isCorrect: true, isMarked: false },
      ],
    };
    const split = splitResultIds(payload);
    assert.deepEqual(split.wrongIds, ["w"]);
    assert.deepEqual(split.skippedIds, ["s"]);
    assert.deepEqual(split.markedIds, ["m"]);
    assert.deepEqual(split.correctIds, ["m", "c"]);
    assert.ok(split.againIds.includes("w") && split.againIds.includes("s"));
  });

  it("drops a corrected mark-for-review unless it is marked again", () => {
    const already = card({ id: "a", marked: true, tags: ["marked"] });
    const stamped = stampCardFromItem(already, { isAttempted: true, isCorrect: true, isMarked: false });
    assert.equal(stamped.marked, false);
    assert.ok(!stamped.tags.includes("marked"));
    assert.ok(!stamped.tags.includes("wrong"));
    assert.ok(!stamped.tags.includes("skipped"));

    const stillMarked = stampCardFromItem(already, { isAttempted: true, isCorrect: true, isMarked: true });
    assert.equal(stillMarked.marked, true);
    assert.ok(stillMarked.tags.includes("marked"));

    const skipped = applyResultTags([], { isAttempted: false, isCorrect: false, isMarked: false }, false);
    assert.deepEqual(skipped, ["skipped"]);
    const wrong = applyResultTags(["skipped"], { isAttempted: true, isCorrect: false, isMarked: false }, false);
    assert.deepEqual(wrong, ["wrong"]);
  });

  it("counts deck buckets and upserts rolling papers", () => {
    const cards = [
      card({ id: "w", tags: ["wrong"], lastRating: "again", queue: "learn" }),
      card({ id: "s", tags: ["skipped"], lastRating: "again", queue: "learn" }),
      card({ id: "m", tags: ["marked"], marked: true, lastRating: "hard", queue: "review" }),
      card({ id: "c", lastRating: "good", queue: "review" }),
    ];
    const counts = resultCounts(cards, "d1");
    assert.equal(counts.wrong, 1);
    assert.equal(counts.skipped, 1);
    assert.equal(counts.marked, 1);
    assert.equal(counts.correct, 2);
    assert.equal(cardsForBucket(cards, "d1", "wrong")[0]?.id, "w");
    assert.equal(cardsForBucket(cards, "d1", "skipped")[0]?.id, "s");

    const buckets = rollingBucketsFromCards(cards, "d1");
    const papers = upsertBucketPapers([], "d1", buckets, "sess-1", 10);
    assert.equal(papers.find((p) => p.id === bucketPaperId("d1", "wrong"))?.questionIds[0], "w");
    const again = upsertBucketPapers(papers, "d1", { ...buckets, wrong: [] }, "sess-2", 11);
    assert.equal(again.some((p) => p.kind === "wrong"), false);
    assert.ok(again.some((p) => p.kind === "skipped"));
  });

  it("normalises old sessions and reads session picks", () => {
    const raw = {
      id: "s1",
      deckId: "d1",
      at: 1,
      total: 3,
      correct: 1,
      wrong: 1,
      notAttempted: 1,
      marked: 1,
      againIds: ["w", "s"],
      hardIds: ["m"],
      goodIds: ["c"],
      paperId: null,
    };
    const session = normalizeSessionSummary(raw) as SessionSummary;
    assert.deepEqual(session.wrongIds, ["w", "s"]);
    assert.deepEqual(session.skippedIds, []);
    assert.deepEqual(idsForSessionPick(session, "marked"), ["m"]);
    const saved = asTemplateResult(session, "Estimate");
    assert.equal(saved.correct, 1);
    assert.equal(saved.wrong, 1);
    assert.equal(saved.deckName, "Estimate");
  });

  it("merges a retry into the parent paper and drops corrected ids", () => {
    const parent = normalizeSessionSummary({
      id: "s1",
      deckId: "d1",
      at: 1,
      total: 4,
      correct: 1,
      wrong: 2,
      notAttempted: 1,
      marked: 1,
      againIds: ["w1", "w2", "s"],
      hardIds: ["m"],
      goodIds: ["c"],
      wrongIds: ["w1", "w2"],
      skippedIds: ["s"],
      markedIds: ["m"],
      correctIds: ["c"],
      paperId: null,
    }) as SessionSummary;
    const payload: ExamCompletePayload = {
      total: 3,
      correct: 2,
      wrong: 1,
      notAttempted: 0,
      marked: 0,
      items: [
        { bankId: "w1", isAttempted: true, isCorrect: true, isMarked: false },
        { bankId: "w2", isAttempted: true, isCorrect: false, isMarked: false },
        { bankId: "s", isAttempted: true, isCorrect: true, isMarked: false },
      ],
    };
    const next = mergeSessionResults(parent, splitResultIds(payload), payload);
    assert.deepEqual(next.wrongIds, ["w2"]);
    assert.deepEqual(next.skippedIds, []);
    const ids = next.correctIds ?? [];
    assert.ok(ids.includes("w1"));
    assert.ok(ids.includes("s"));
    assert.ok(ids.includes("c"));
    assert.equal(next.wrong, 1);
    assert.equal(next.notAttempted, 0);
    assert.equal(next.total, 4);
  });
});
