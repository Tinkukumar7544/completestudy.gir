import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wirePaperGlobals, withPaperHost } from "./paper-host.ts";

describe("paper host bridge", () => {
  it("exposes examData and answers as globals", () => {
    const html = `const examData = __EXAM_DATA__;
        let userAnswers = {};
        let markedForReview = {};
        let currentSection = 0;`;
    const wired = wirePaperGlobals(html);
    assert.match(wired, /var examData = window\.examData =/);
    assert.match(wired, /var userAnswers = window\.userAnswers =/);
    assert.match(wired, /var currentSection =/);
  });

  it("appends the host script once", () => {
    const html = "<html><body><p>paper</p></body></html>";
    const out = withPaperHost(html);
    assert.match(out, /window\.__setpaperHost/);
    assert.match(out, /Submit paper/);
    assert.match(out, /__setpaperLockUntil/);
    assert.match(out, /Time still running/);
    assert.match(out, /tickLock/);
    assert.match(out, /collectFromEmt/);
    assert.match(out, /startExam/);
    assert.match(out, /forceSubmit/);
    assert.equal(withPaperHost(out).split("__setpaperHost").length, out.split("__setpaperHost").length);
  });
});
