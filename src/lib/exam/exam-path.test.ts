import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applySessionToPath,
  buildExamPath,
  bumpNoteRead,
  completePathNode,
  intakeReady,
  pathNodeState,
  pathOverallPercent,
} from "./exam-path.ts";
import { defaultExamPath, defaultPathIntake, type Deck, type Note, type SessionSummary } from "./types.ts";

const notes: Note[] = [
  {
    id: "n1",
    title: "Rock Mechanics",
    body: "RMR",
    folderId: null,
    files: [],
    createdAt: 1,
    modifiedAt: 1,
  },
  {
    id: "n2",
    title: "Ventilation",
    body: "Fans",
    folderId: null,
    files: [],
    createdAt: 2,
    modifiedAt: 2,
  },
];

const decks: Deck[] = [
  { id: "d1", name: "Rock Mechanics", description: "", configId: "default", collapsed: false, createdAt: 1 },
  { id: "d2", name: "Ventilation paper", description: "", configId: "default", collapsed: false, createdAt: 2 },
];

describe("exam path", () => {
  it("refuses to create a target until the questions are complete", () => {
    assert.equal(intakeReady(defaultPathIntake()), false);
    assert.equal(
      intakeReady({
        ...defaultPathIntake(),
        examName: "Overman",
        startDate: 1,
        examDate: 2,
        subjects: ["Rock Mechanics"],
      }),
      true,
    );
  });

  it("builds units that unlock one step at a time", () => {
    const path = buildExamPath(
      {
        ...defaultPathIntake(),
        completed: true,
        examName: "Overman",
        startDate: Date.now() - 864e5,
        examDate: Date.now() + 864e5 * 10,
        subjects: ["Rock Mechanics", "Ventilation"],
        noteIds: ["n1", "n2"],
        deckIds: ["d1", "d2"],
        weeklyTests: true,
      },
      notes,
      decks,
      [],
    );
    assert.ok(path.nodes.length >= 4);
    assert.equal(pathNodeState(path, 0), "current");
    assert.equal(pathNodeState(path, 1), "locked");
    const next = completePathNode(path, path.nodes[0]!.id);
    assert.equal(pathNodeState(next, 0), "done");
    assert.equal(pathNodeState(next, 1), "current");
    assert.ok(pathOverallPercent(next) > 0);
  });

  it("counts note reading toward the step", () => {
    const path = buildExamPath(
      {
        ...defaultPathIntake(),
        completed: true,
        examName: "Overman",
        startDate: 1,
        examDate: 2,
        subjects: ["Rock Mechanics"],
        noteIds: ["n1"],
        deckIds: [],
        weeklyTests: false,
      },
      notes,
      decks,
      [],
    );
    const mid = bumpNoteRead(path, "n1", 40);
    assert.equal(mid.progress.noteReads.n1, 40);
    assert.equal(pathNodeState(mid, 0), "current");
    const done = bumpNoteRead(mid, "n1", 50);
    assert.equal(done.progress.noteReads.n1, 90);
    assert.equal(pathNodeState(done, 0), "done");
  });

  it("records a test score on the matching step", () => {
    const path = buildExamPath(
      {
        ...defaultPathIntake(),
        completed: true,
        examName: "Overman",
        startDate: 1,
        examDate: 2,
        subjects: ["Rock Mechanics"],
        noteIds: [],
        deckIds: ["d1"],
        weeklyTests: false,
      },
      notes,
      decks,
      [],
    );
    const session: SessionSummary = {
      id: "s1",
      deckId: "d1",
      at: 10,
      total: 10,
      correct: 8,
      wrong: 2,
      notAttempted: 0,
      marked: 0,
      againIds: [],
      hardIds: [],
      goodIds: [],
      paperId: null,
    };
    const next = applySessionToPath(path, session);
    assert.equal(next.progress.testScores.d1?.percent, 80);
    assert.equal(pathNodeState(next, 0), "done");
  });

  it("normalises an empty path", () => {
    assert.equal(defaultExamPath().intake.completed, false);
    assert.equal(defaultExamPath().nodes.length, 0);
  });
});
