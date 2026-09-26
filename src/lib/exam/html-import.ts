import {
  htmlTitle,
  parseQuestionText,
  extractExamDataObject,
  examMinutesFromHtml,
  toTemplateHtml,
} from "./parser";
import { formatBytes, readHtmlFile, saveHtmlFile, templateHtmlId } from "./html-store";
import { BUNDLED_TEMPLATE } from "./template";
import { useExamStore } from "./store";
import { uid } from "@/lib/utils";
import type { Question, SectionSize, TemplatePattern } from "./types";

export type HtmlImportResult = {
  deckId: string | null;
  title: string;
  questions: number;
  template: boolean;
  templateId: string | null;
  originalTemplateId: string | null;
  sizeLabel: string;
  warnings: string[];
};

function inferPattern(html: string, questionCount = 0): Partial<TemplatePattern> | undefined {
  const raw = extractExamDataObject(html);
  const fromSetting = examMinutesFromHtml(html);
  if (raw) {
    try {
      const data = JSON.parse(raw) as { sections?: Array<{ questions?: unknown[]; timeMinutes?: number }> };
      const sections = Array.isArray(data.sections) ? data.sections : [];
      if (sections.length) {
        const first = sections[0];
        const qCount = Array.isArray(first.questions) ? first.questions.length : 0;
        const mins = Number(first.timeMinutes) || fromSetting || 0;
        const sectionSize: SectionSize = qCount >= 15 ? 20 : 10;
        const minutesPerQuestion = qCount > 0 && mins > 0 ? Math.max(0.5, Math.round((mins / qCount) * 2) / 2) : 1;
        return { sectionSize, minutesPerQuestion };
      }
    } catch {
      /* fall through */
    }
  }
  if (fromSetting && questionCount > 0) {
    const minutesPerQuestion = Math.max(0.5, Math.round((fromSetting / questionCount) * 2) / 2);
    return { sectionSize: questionCount >= 15 ? 20 : 10, minutesPerQuestion, timerMode: "overall" };
  }
  if (fromSetting) return { timerMode: "overall", extraMinutes: 0 };
  return undefined;
}

async function persistTemplateHtml(input: {
  html: string;
  fileName: string;
  title: string;
  bookmark: boolean;
  name: string;
  pattern?: Partial<TemplatePattern>;
}): Promise<string> {
  const id = uid();
  const size = input.html.length;
  await saveHtmlFile({
    id: templateHtmlId(id),
    name: input.fileName,
    size,
    html: input.html,
    createdAt: Date.now(),
  });
  useExamStore.getState().addTemplate({
    id,
    name: input.name,
    kind: "uploaded",
    fileName: input.fileName,
    size,
    bookmark: input.bookmark,
    pattern: input.pattern,
  });
  return id;
}

export async function replaceTemplateHtml(
  templateId: string,
  file: File,
  onProgress?: (hint: string) => void,
): Promise<{ title: string; sizeLabel: string }> {
  const sizeLabel = formatBytes(file.size);
  onProgress?.(`Reading ${file.name} · ${sizeLabel}…`);
  const html = await readHtmlFile(file, (pct) => {
    onProgress?.(`Reading ${file.name} · ${pct}%`);
  });
  const stripped = toTemplateHtml(html) ?? html;
  onProgress?.("Saving paper layout…");
  await saveHtmlFile({
    id: templateHtmlId(templateId),
    name: file.name,
    size: stripped.length,
    html: stripped,
    createdAt: Date.now(),
  });
  const title =
    htmlTitle(html) ||
    file.name.replace(/\.html?$/i, "").replace(/[_-]+/g, " ").trim() ||
    "Exam template";
  const pattern = inferPattern(html);
  useExamStore.getState().updateTemplate(templateId, {
    kind: "uploaded",
    fileName: file.name,
    size: stripped.length,
    name: title,
  });
  if (pattern) useExamStore.getState().updateTemplatePattern(templateId, pattern);
  return { title, sizeLabel: formatBytes(stripped.length) };
}

export async function importHtmlTest(
  file: File,
  onProgress?: (hint: string) => void,
): Promise<HtmlImportResult> {
  const sizeLabel = formatBytes(file.size);
  onProgress?.(`Reading ${file.name} · ${sizeLabel}…`);
  const html = await readHtmlFile(file, (pct) => {
    onProgress?.(`Reading ${file.name} · ${pct}%`);
  });
  onProgress?.(`Parsing ${file.name}…`);
  const parsed = parseQuestionText(html);
  const title =
    htmlTitle(html) ||
    file.name.replace(/\.html?$/i, "").replace(/[_-]+/g, " ").trim() ||
    "HTML test";
  const pattern = inferPattern(html, parsed.questions.length);
  const warnings = [...parsed.warnings, ...parsed.errors.filter((e) => parsed.questions.length > 0)];

  onProgress?.("Saving original paper and TCS iON templates…");
  const originalTemplateId = await persistTemplateHtml({
    html,
    fileName: file.name,
    title,
    bookmark: false,
    name: title,
    pattern,
  });
  const tcsHtml = toTemplateHtml(html) ?? BUNDLED_TEMPLATE;
  const templateId = await persistTemplateHtml({
    html: tcsHtml,
    fileName: tcsHtml === BUNDLED_TEMPLATE ? "tcs-ion-template.html" : file.name,
    title,
    bookmark: true,
    name: `${title} · TCS iON`,
    pattern,
  });

  if (parsed.questions.length === 0) {
    return {
      deckId: null,
      title,
      questions: 0,
      template: true,
      templateId,
      originalTemplateId,
      sizeLabel,
      warnings: parsed.errors,
    };
  }

  const deckId = useExamStore.getState().createDeck(title, `Uploaded ${file.name} · ${sizeLabel}`);
  useExamStore.getState().addCards(deckId, parsed.questions);
  return {
    deckId,
    title,
    questions: parsed.questions.length,
    template: true,
    templateId,
    originalTemplateId,
    sizeLabel,
    warnings,
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "\u0026amp;";
    if (ch === "<") return "\u0026lt;";
    if (ch === ">") return "\u0026gt;";
    return "\u0026quot;";
  });
}

export function questionsToExamHtml(title: string, questions: Array<Pick<Question, "type" | "question" | "options" | "correct" | "explanation">>) {
  const examData = {
    meta: { title },
    sections: [
      {
        name: "Test",
        questions: questions.map((question) => ({
          type: question.type,
          question: question.question,
          options: question.options,
          correct: question.correct,
          explanation: question.explanation,
        })),
      },
    ],
  };
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><script>var examData = ${JSON.stringify(examData)};</script></head><body></body></html>`;
}

export async function importGeneratedTest(
  title: string,
  questions: Array<Pick<Question, "type" | "question" | "options" | "correct" | "explanation">>,
  parentId?: string | null,
) {
  const safe = title.trim() || "New test";
  const file = new File([questionsToExamHtml(safe, questions)], `${safe.replace(/[^\w.-]+/g, "_") || "test"}.html`, { type: "text/html" });
  const result = await importHtmlTest(file);
  if (result.deckId && parentId) useExamStore.getState().moveDeck(result.deckId, parentId);
  return result;
}
