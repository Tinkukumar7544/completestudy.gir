import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { parseQuestionText, questionsFromUnknown, toTemplateHtml } from "./parser.ts";

describe("questionsFromUnknown EMT fields", () => {
  it("maps question_en, options_en, answerIndex, solution", () => {
    const parsed = questionsFromUnknown([
      {
        id: 1,
        question_en: "Minimum thickness of a permanent stopping?",
        options_en: ["25 cm", "38 cm", "40 cm", "50 cm"],
        answerIndex: 1,
        solution: "Exact rule is 38 cm.<br>",
      },
    ]);
    assert.ok(parsed);
    assert.equal(parsed.questions.length, 1);
    const q = parsed.questions[0]!;
    assert.match(q.question, /permanent stopping/i);
    assert.deepEqual(q.options, ["25 cm", "38 cm", "40 cm", "50 cm"]);
    assert.equal(q.correct, 1);
    assert.match(q.explanation, /38 cm/);
    assert.doesNotMatch(q.explanation, /<br>/i);
  });

  it("reads examData.sections", () => {
    const parsed = questionsFromUnknown({
      sections: [
        {
          name: "Ventilation",
          questions: [
            {
              question: "A regulator is used to?",
              options: ["Increase pressure", "Reduce quantity", "Stop air", "Measure gas"],
              correct: 1,
            },
          ],
        },
      ],
    });
    assert.equal(parsed?.questions.length, 1);
    assert.equal(parsed?.questions[0]?.rule, "Ventilation");
    assert.equal(parsed?.questions[0]?.correct, 1);
  });
});

describe("parseQuestionText HTML papers", () => {
  it("extracts raw_questions_data from an EMT-style script", () => {
    const html = `<!doctype html><title>TCS iON Ultra Pro Mock — EMT</title>
<script>
var raw_questions_data = [{"id":1,"question_en":"What is a brattice?","options_en":["Fan","Canvas partition","Door","Lock"],"answerIndex":1,"solution":"Canvas partition at the face."}];
var questions_data = [];
</script>`;
    const parsed = parseQuestionText(html);
    assert.equal(parsed.questions.length, 1);
    assert.equal(parsed.questions[0]?.correct, 1);
    assert.match(parsed.questions[0]?.question ?? "", /brattice/i);
  });

  it("still reads const examData = { sections }", () => {
    const html = `<script>const examData = {"meta":{"title":"Paper"},"sections":[{"questions":[{"question":"Q?","options":["A","B","C","D"],"correct":2}]}]};</script>`;
    const parsed = parseQuestionText(html);
    assert.equal(parsed.questions.length, 1);
    assert.equal(parsed.questions[0]?.correct, 2);
    assert.ok(toTemplateHtml(html)?.includes("__EXAM_DATA__"));
  });

  it("parses the attached EMT Chapter 3 HTML", () => {
    const html = readFileSync("/workspace/attachments/EMT2(Chap3 Part1).html", "utf8");
    const parsed = parseQuestionText(html);
    assert.equal(parsed.errors.length, 0, parsed.errors.join("; "));
    assert.equal(parsed.questions.length, 50);
    assert.match(parsed.questions[0]?.question ?? "", /D\.G\.M\.S/i);
    assert.equal(parsed.questions[0]?.correct, 1);
    assert.equal(parsed.questions[0]?.options[1], "38 cm");
    assert.match(parsed.questions[49]?.question ?? "", /Freon/i);
  });
});
