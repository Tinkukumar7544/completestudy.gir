import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addCustomRule,
  applyActiveColors,
  applyLandingEffects,
  applyPlayerMode,
  applyRoll,
  canColorRoll,
  canEnterYard,
  isActiveSeat,
  isBotColumn,
  legalMoves,
  ludoIsResting,
  ludoTodayKey,
  nextDateForDow,
  nextTurnColor,
  playMove,
  resolveChallengeFromSession,
  rolledToday,
  setChallengeTest,
} from "./ludo-path.ts";
import { defaultLudo, type LudoBoard, type SessionSummary } from "./types.ts";

function boardWith(patch: Partial<LudoBoard>): LudoBoard {
  return { ...defaultLudo(), ...patch };
}

describe("ludo study rules", () => {
  it("lets a yard piece enter on 1 or 6", () => {
    const board = defaultLudo();
    assert.equal(canEnterYard(board, "red", 1), true);
    assert.equal(canEnterYard(board, "red", 6), true);
    assert.equal(canEnterYard(board, "red", 4), false);
    const off = boardWith({ rules: { ...board.rules, enterOnOneOrSix: false } });
    assert.equal(canEnterYard(off, "red", 1), false);
    assert.equal(canEnterYard(off, "red", 6), true);
  });

  it("offers enter or advance on a six", () => {
    const board = defaultLudo();
    board.columns = board.columns.map((c) =>
      c.color === "red"
        ? { ...c, tokens: c.tokens.map((t, i) => (i === 0 ? { ...t, steps: 3 } : t)) }
        : c,
    );
    const moves = legalMoves(board, "red", 6);
    assert.ok(moves.some((m) => m.enter));
    assert.ok(moves.some((m) => !m.enter && m.fromSteps === 3));
  });

  it("locks a student after one finished turn in the same day", () => {
    const now = Date.now();
    const board = applyRoll(defaultLudo(), 2);
    assert.equal(rolledToday(board, "red", now), true);
    const again = { ...board, turnColor: "red" as const, phase: "roll" as const, extraTurns: 0 };
    assert.equal(canColorRoll(again, "red", now), false);
  });

  it("opens a capture test when a piece is sent home", () => {
    let board = defaultLudo();
    board = {
      ...board,
      bots: false,
      columns: board.columns.map((c) => {
        if (c.color === "red") return { ...c, tokens: c.tokens.map((t, i) => (i === 0 ? { ...t, steps: 0 } : t)) };
        if (c.color === "green") return { ...c, studentName: "Aman", tokens: c.tokens.map((t, i) => (i === 0 ? { ...t, steps: 17, name: "Law" } : t)) };
        return c;
      }),
    };
    board = playMove(board, "red", board.columns.find((c) => c.color === "red")!.tokens[0]!.id, 4);
    assert.equal(board.phase, "challenge");
    assert.equal(board.challenge?.capturedColor, "green");
    assert.equal(board.challenge?.tokenName, "Law");
    board = setChallengeTest(board, "sample-rock-mechanics", 60);
    assert.equal(board.challenge?.status, "pending-take");
    assert.equal(board.challenge?.passingScore, 60);
  });

  it("resolves a capture test from a session score", () => {
    const board = boardWith({
      challenge: {
        id: "cap-1",
        capturerColor: "red",
        capturedColor: "green",
        tokenId: "x",
        tokenName: "Law",
        deckId: "sample-rock-mechanics",
        passingScore: 50,
        status: "pending-take",
        createdAt: 1,
        sessionId: null,
      },
    });
    const pass: SessionSummary = {
      id: "s1",
      deckId: "sample-rock-mechanics",
      at: 2,
      total: 10,
      correct: 7,
      wrong: 3,
      notAttempted: 0,
      marked: 0,
      againIds: [],
      hardIds: [],
      goodIds: [],
      paperId: null,
    };
    const passed = resolveChallengeFromSession(board, pass);
    assert.equal(passed.challenge, null);
    const fail = resolveChallengeFromSession(board, { ...pass, correct: 2 });
    assert.ok(fail.challenge);
    assert.ok(fail.restDates.length > 0);
  });

  it("turns the skipped study day into a rest date on an array box", () => {
    const base = defaultLudo();
    const token = base.columns.find((c) => c.color === "red")!.tokens[0]!;
    const placed: LudoBoard = {
      ...base,
      columns: base.columns.map((c) =>
        c.color === "red" ? { ...c, tokens: c.tokens.map((t) => (t.id === token.id ? { ...t, steps: 30, dayName: "Mon" } : t)) } : c,
      ),
    };
    const at = Date.parse("2026-08-30T12:00:00");
    const next = applyLandingEffects(placed, "red", token.id, at);
    assert.ok(next.restDates.includes(nextDateForDow(1, at)));
    const moved = next.columns.find((c) => c.color === "red")!.tokens[0]!;
    assert.equal(moved.steps, 34);
  });

  it("treats rest dates as rest days", () => {
    const today = ludoTodayKey();
    const board = boardWith({ restDates: [today], restDays: [] });
    assert.equal(ludoIsResting(board), true);
  });

  it("stores custom rules", () => {
    const next = addCustomRule(defaultLudo(), "No group study", "Work alone on capture tests.");
    assert.equal(next.customRules.length, 1);
    assert.equal(next.customRules[0]?.enabled, true);
  });

  it("two player keeps only you and the opposite column, never auto-plays", () => {
    const next = applyPlayerMode(defaultLudo(), "two");
    assert.equal(next.playerMode, "two");
    assert.equal(next.bots, false);
    assert.deepEqual(next.activeColors, ["yellow", "red"]);
    assert.equal(isActiveSeat(next, "red"), true);
    assert.equal(isActiveSeat(next, "yellow"), true);
    assert.equal(isActiveSeat(next, "blue"), false);
    assert.equal(isActiveSeat(next, "green"), false);
    assert.equal(isBotColumn(next, "yellow", "red"), false);
    const waiting = { ...next, turnColor: "green" as const, phase: "roll" as const };
    assert.equal(canColorRoll(waiting, "green"), false);
    assert.equal(nextTurnColor(next, "red"), "yellow");
  });

  it("four player restores every column", () => {
    const four = applyPlayerMode(applyPlayerMode(defaultLudo(), "two"), "four");
    assert.equal(four.playerMode, "four");
    assert.deepEqual(four.activeColors, ["blue", "yellow", "red", "green"]);
    assert.equal(isActiveSeat(four, "blue"), true);
  });

  it("custom seats skip idle columns and keep at least one", () => {
    const custom = applyActiveColors(defaultLudo(), ["red", "blue"]);
    assert.equal(custom.playerMode, "custom");
    assert.deepEqual(custom.activeColors, ["blue", "red"]);
    assert.equal(nextTurnColor(custom, "red"), "blue");
    const same = applyActiveColors(custom, []);
    assert.deepEqual(same.activeColors, custom.activeColors);
  });
});
