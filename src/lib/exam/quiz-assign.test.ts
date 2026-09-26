import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSummaryItems,
  clampTimeLimitMin,
  compactQuizItems,
  derangeIds,
  formatAnswer,
  formatCountdown,
  groupQuizSections,
  isDerangement,
  lockUntilMs,
  paperSubmitLocked,
  pickSectionCards,
  quizEndsAtMs,
  skippedQuizItems,
  todayIsoDate,
  type QuizSectionGroup,
} from "./quiz-assign.ts";
import type { Card, Question } from "./types.ts";

function card(partial: Partial<Card> & Pick<Card, "id" | "question">): Card {
  return {
    deckId: "d1",
    type: "mcq",
    rule: "General",
    options: ["A", "B"],
    correct: 0,
    explanation: "Because",
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
    createdAt: 1,
    modifiedAt: 1,
    ...partial,
  };
}

describe("derangeIds", () => {
  it("returns empty for fewer than two ids", () => {
    assert.deepEqual(derangeIds([]), {});
    assert.deepEqual(derangeIds(["a"]), {});
  });

  it("swaps two players", () => {
    const map = derangeIds(["a", "b"]);
    assert.equal(map.a, "b");
    assert.equal(map.b, "a");
    assert.equal(isDerangement(map, ["a", "b"]), true);
  });

  it("never leaves a fixed point for n >= 2", () => {
    for (let n = 2; n <= 20; n++) {
      const ids = Array.from({ length: n }, (_, i) => `p${i}`);
      for (let k = 0; k < 40; k++) {
        const map = derangeIds(ids);
        assert.equal(isDerangement(map, ids), true, `n=${n} k=${k}`);
      }
    }
  });
});

describe("compactQuizItems", () => {
  it("keeps answers and drops junk", () => {
    const items = compactQuizItems([
      { bankId: "q1", userAns: 2, isAttempted: true, isCorrect: false, isMarked: true },
      { bankId: "", question: "skip" },
      { id: "q2", userAns: [0, 1], isAttempted: true, isCorrect: true, isMarked: false },
      { bankId: "q1", userAns: 0, isAttempted: true, isCorrect: true, isMarked: false },
    ]);
    assert.equal(items.length, 2);
    assert.deepEqual(items[0], {
      bankId: "q1",
      userAns: 2,
      isAttempted: true,
      isCorrect: false,
      isMarked: true,
    });
    assert.deepEqual(items[1]?.userAns, [0, 1]);
  });

  it("parses a JSON string of items", () => {
    const items = compactQuizItems(
      JSON.stringify([{ bankId: "q3", userAns: 0, isAttempted: true, isCorrect: true, isMarked: false }]),
    );
    assert.equal(items[0]?.bankId, "q3");
    assert.equal(items[0]?.isCorrect, true);
  });
});

describe("groupQuizSections", () => {
  it("groups by sourceSection when present", () => {
    const groups = groupQuizSections([
      card({ id: "1", question: "Q1", sourceSection: "Part A" }),
      card({ id: "2", question: "Q2", sourceSection: "Part A" }),
      card({ id: "3", question: "Q3", sourceSection: "Part B" }),
    ]);
    assert.equal(groups.length, 2);
    assert.equal(groups[0]?.name, "Part A");
    assert.equal(groups[0]?.cards.length, 2);
    assert.equal(groups[1]?.name, "Part B");
  });

  it("chunks a single-rule deck", () => {
    const cards = Array.from({ length: 30 }, (_, i) =>
      card({ id: `q${i}`, question: `Q${i}`, rule: "Same" }),
    );
    const groups = groupQuizSections(cards);
    assert.equal(groups.length, 2);
    assert.equal(groups[0]?.cards.length, 25);
    assert.equal(groups[1]?.cards.length, 5);
  });
});

describe("pickSectionCards", () => {
  it("takes the requested count from each selected section", () => {
    const groups: QuizSectionGroup[] = [
      { name: "A", cards: [card({ id: "a1", question: "a1" }), card({ id: "a2", question: "a2" })] },
      { name: "B", cards: [card({ id: "b1", question: "b1" }), card({ id: "b2", question: "b2" })] },
    ];
    const picked = pickSectionCards(groups, [
      { name: "A", count: 1 },
      { name: "B", count: 0 },
    ]);
    assert.deepEqual(picked.map((c) => c.id), ["a1"]);
  });
});

describe("buildSummaryItems", () => {
  it("joins attempts onto the paper questions", () => {
    const questions: Question[] = [
      {
        id: "q1",
        type: "mcq",
        rule: "R",
        question: "What?",
        options: ["Yes", "No"],
        correct: 0,
        explanation: "Yes.",
      },
    ];
    const items = buildSummaryItems(questions, [
      { bankId: "q1", userAns: 1, isAttempted: true, isCorrect: false, isMarked: false },
      { bankId: "missing", userAns: 0, isAttempted: true, isCorrect: true, isMarked: false },
    ]);
    assert.equal(items.length, 1);
    assert.equal(items[0]?.question, "What?");
    assert.equal(formatAnswer(items[0]?.userAns, items[0]?.options ?? []), "B. No");
  });
});

describe("todayIsoDate", () => {
  it("formats a local calendar day", () => {
    assert.equal(todayIsoDate(new Date(2026, 7, 31, 15, 0, 0)), "2026-08-31");
  });
});

describe("live test timing", () => {
  it("clamps minutes to 1–180 and defaults empty to 20", () => {
    assert.equal(clampTimeLimitMin(undefined), 20);
    assert.equal(clampTimeLimitMin(""), 20);
    assert.equal(clampTimeLimitMin(0), 20);
    assert.equal(clampTimeLimitMin(1), 1);
    assert.equal(clampTimeLimitMin(20), 20);
    assert.equal(clampTimeLimitMin(180), 180);
    assert.equal(clampTimeLimitMin(999), 180);
    assert.equal(clampTimeLimitMin(-4), 20);
  });

  it("locks submit until the clock hits the end", () => {
    const ends = 1_000_000;
    assert.equal(paperSubmitLocked(ends, ends - 1), true);
    assert.equal(paperSubmitLocked(ends, ends), false);
    assert.equal(paperSubmitLocked(null, ends), false);
  });

  it("maps server remaining time onto the local clock", () => {
    const started = "2026-08-31T10:00:00.000Z";
    const serverNow = "2026-08-31T10:05:00.000Z";
    const local = Date.parse("2026-08-31T10:05:02.000Z");
    const until = lockUntilMs(started, 20 * 60, serverNow, local);
    assert.equal(until, local + 15 * 60 * 1000);
    assert.equal(quizEndsAtMs(started, 1200), Date.parse(started) + 1_200_000);
    assert.equal(formatCountdown(90_000), "1:30");
    assert.equal(formatCountdown(0), "0:00");
  });

  it("records skipped items with no answers", () => {
    const items = skippedQuizItems([{ id: "q1" }, { id: "q2" }]);
    assert.equal(items.length, 2);
    assert.equal(items[0]?.isAttempted, false);
    assert.equal(items[0]?.userAns, null);
    assert.equal(items[1]?.bankId, "q2");
  });
});
