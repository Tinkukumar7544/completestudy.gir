import bundledTemplate from "./tcs-ion-template.html?raw";
import { getHtmlFile, IDB_TEMPLATE_SENTINEL, templateHtmlId } from "./html-store";
import { withPaperHost } from "./paper-host";
import { findAssignedValue } from "./parser";
import type { ExamData, ExamTemplate, OptionOrder, Question, TemplatePattern } from "./types";

export const BUNDLED_TEMPLATE = bundledTemplate;

export function activeTemplate(overrideHtml: string): string {
  const trimmed = overrideHtml.trim();
  if (trimmed && trimmed !== IDB_TEMPLATE_SENTINEL) return trimmed;
  return bundledTemplate;
}

export async function resolveTemplate(overrideHtml: string): Promise<string> {
  const trimmed = overrideHtml.trim();
  if (trimmed && trimmed !== IDB_TEMPLATE_SENTINEL) return trimmed;
  if (typeof indexedDB !== "undefined") {
    try {
      const stored = await getHtmlFile("template");
      if (stored?.html?.includes("__EXAM_DATA__")) return stored.html;
    } catch {
      /* fall through to bundled */
    }
  }
  return bundledTemplate;
}

export async function resolveTemplateHtml(template: ExamTemplate | undefined | null): Promise<string> {
  if (!template || template.kind === "bundled") return bundledTemplate;
  if (typeof indexedDB === "undefined") return bundledTemplate;
  try {
    const stored = await getHtmlFile(templateHtmlId(template.id));
    if (stored?.html) return stored.html;
    const legacy = await getHtmlFile("template");
    if (legacy?.html) return legacy.html;
  } catch {
    /* fall through to bundled */
  }
  return bundledTemplate;
}

export function applyOptionOrder<T extends Pick<Question, "options" | "correct">>(
  questions: T[],
  order: OptionOrder,
): T[] {
  if (order === "as-written") return questions;
  return questions.map((q) => {
    if (!q.options.length) return q;
    const idxs = q.options.map((_, i) => i);
    if (order === "reverse") idxs.reverse();
    else {
      for (let i = idxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
      }
    }
    const options = idxs.map((i) => q.options[i]);
    let correct = q.correct;
    if (typeof correct === "number") {
      const mapped = idxs.indexOf(correct);
      correct = mapped >= 0 ? mapped : correct;
    } else if (Array.isArray(correct)) {
      correct = correct.map((c) => idxs.indexOf(c)).filter((i) => i >= 0);
    }
    return { ...q, options, correct };
  });
}

export function withPatternSettings(data: ExamData, pattern: TemplatePattern): ExamData {
  const sections = data.sections.map((section, idx) => {
    let timeMinutes = section.timeMinutes;
    if (pattern.timerMode !== "off" && pattern.extraMinutes > 0 && idx === 0) {
      timeMinutes += pattern.extraMinutes;
    }
    return { ...section, timeMinutes: Math.max(1, timeMinutes) };
  });
  return {
    ...data,
    meta: {
      ...data.meta,
      title: pattern.examTitle.trim() || data.meta.title,
      candidateName: pattern.candidateName.trim() || undefined,
      candidateId: pattern.candidateId.trim() || undefined,
    },
    sections,
    settings: pattern,
  };
}

function flattenForRaw(data: ExamData) {
  const rows: Array<{
    id: number;
    bankId: string;
    question_en: string;
    options_en: string[];
    answerIndex: number;
    solution: string;
  }> = [];
  for (const section of data.sections) {
    for (const q of section.questions) {
      rows.push({
        id: Number(q.id) || rows.length + 1,
        bankId: q.bankId,
        question_en: q.question,
        options_en: q.options,
        answerIndex: typeof q.correct === "number" ? q.correct : 0,
        solution: q.explanation || "",
      });
    }
  }
  return rows;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function injectExamData(templateHtml: string, data: ExamData): string {
  const examJson = safeJson(data);
  if (templateHtml.includes("__EXAM_DATA__")) {
    return withPaperHost(templateHtml.replace("__EXAM_DATA__", examJson));
  }
  const examSpan = findAssignedValue(templateHtml, ["examData"]);
  if (examSpan && !examSpan.placeholder) {
    return withPaperHost(templateHtml.slice(0, examSpan.start) + examJson + templateHtml.slice(examSpan.end));
  }
  const rawSpan = findAssignedValue(templateHtml, ["raw_questions_data", "questions_data", "questions"]);
  if (rawSpan) {
    const rawJson = safeJson(flattenForRaw(data));
    let html = templateHtml.slice(0, rawSpan.start) + rawJson + templateHtml.slice(rawSpan.end);
    if (!/examData\s*=/.test(html)) {
      html = html.replace(/<head[^>]*>/i, (tag) => `${tag}<script>var examData = window.examData = ${examJson};</script>`);
    }
    return withPaperHost(html);
  }
  return withPaperHost(bundledTemplate.replace("__EXAM_DATA__", examJson));
}
