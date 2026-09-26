import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { advanceReviewStage, ensureReviewDecks, placeReviewCards, reviewLocked } from "./review-ladder.ts";
import type { Card, Deck } from "./types.ts";

describe("review ladder", () => {
  it("keeps a miss in place and clears a correct answer", () => {
    assert.equal(advanceReviewStage(undefined, false, null), 3);
    assert.equal(advanceReviewStage(3, false, 3), 7);
    assert.equal(advanceReviewStage(3, true, 3), 0);
    assert.equal(advanceReviewStage(7, false, 7), 14);
    assert.equal(advanceReviewStage(7, true, 7), 0);
    assert.equal(advanceReviewStage(14, false, 14), 21);
    assert.equal(advanceReviewStage(21, false, 21), 21);
    assert.equal(advanceReviewStage(21, true, 21), 0);
  });

  it("keeps the four review decks", () => {
    const decks = ensureReviewDecks([] as Deck[]);
    assert.deepEqual(
      decks.map((deck) => deck.name),
      ["3-day", "7-day", "14-day", "21-day"],
    );
    assert.equal(ensureReviewDecks(decks).length, 4);
  });

  it("moves a second miss to the next folder immediately", () => {
    const decks = ensureReviewDecks([] as Deck[]);
    const card = { id: "q1", reviewStage: undefined, reviewBucket: undefined } as Card;
    const start = Date.parse("2026-09-01T10:00:00");
    const placed = placeReviewCards(decks, [card], [{ bankId: "q1", isAttempted: true, isCorrect: false }], null, start);
    assert.equal(placed.cards[0]?.reviewStage, 3);
    const again = placeReviewCards(placed.decks, placed.cards, [{ bankId: "q1", isAttempted: true, isCorrect: false }], 3, start);
    assert.equal(again.cards[0]?.reviewStage, 7);
    assert.ok(again.cards[0]?.reviewBucket?.startsWith("review-7:"));
    assert.equal(again.cards[0]?.reviewHistory?.some((mark) => mark.outcome === "transfer"), true);
    const fixed = placeReviewCards(placed.decks, placed.cards, [{ bankId: "q1", isAttempted: true, isCorrect: true }], 3, start);
    assert.equal(fixed.cards[0]?.reviewStage, undefined);
    assert.equal(fixed.cards[0]?.reviewBucket, undefined);
    assert.equal(reviewLocked(start, 3, start + 86_400_000), false);
  });
});
