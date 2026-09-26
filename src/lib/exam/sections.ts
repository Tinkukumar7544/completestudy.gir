import type { ExamData, ExamMeta, ExamSection, Question, SectionSize, TemplatePattern } from "./types";

export function splitIntoSections(
  questions: Question[],
  sectionSize: SectionSize,
  minutesPerQuestion: number,
  meta: ExamMeta,
  pattern?: TemplatePattern,
): ExamData {
  if (questions.length === 0) {
    return { meta, sections: [], settings: pattern };
  }
  const size = sectionSize === 20 ? 20 : 10;
  const sections: ExamSection[] = [];
  for (let i = 0; i < questions.length; i += size) {
    const chunk = questions.slice(i, i + size);
    const n = sections.length + 1;
    const from = i + 1;
    const to = i + chunk.length;
    sections.push({
      id: n,
      name: `Section ${n}`,
      title: `Questions ${from}–${to}`,
      timeMinutes: Math.max(1, Math.round(chunk.length * minutesPerQuestion)),
      questions: chunk.map((q, idx) => ({
        id: from + idx,
        bankId: q.id,
        type: q.type,
        rule: q.rule || "General",
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || "",
      })),
    });
  }
  return { meta, sections, settings: pattern };
}

export function pickQuestions(
  questions: Question[],
  count: number,
  pick: "first" | "random" | "all",
): Question[] {
  if (pick === "all" || count >= questions.length) return questions.slice();
  const n = Math.max(1, Math.min(count, questions.length));
  if (pick === "first") return questions.slice(0, n);
  const copy = questions.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function describePaper(total: number, sectionSize: SectionSize): string {
  if (total === 0) return "No questions yet";
  const size = sectionSize === 20 ? 20 : 10;
  const full = Math.floor(total / size);
  const rem = total % size;
  if (full === 0) return `1 section · ${total} Q`;
  if (rem === 0) return `${full} sections · ${size} Q each`;
  return `${full + 1} sections · ${full}×${size} + ${rem}`;
}
