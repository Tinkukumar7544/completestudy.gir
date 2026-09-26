import type { Question, QuestionType } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface ParseResult {
  questions: Question[];
  warnings: string[];
  errors: string[];
}

const OPTION_RE = /^\s*(?:[([]?)([A-Da-d1-4])[)\].,:\-]\s+(.*\S)\s*$/;
const QUESTION_RE = /^\s*(?:Q(?:uestion)?\s*)?(\d+)[).:\-]\s+(.*\S)\s*$/i;
const ANSWER_RE = /^\s*(?:Answer|Ans|Correct(?:\s*answer)?)\s*[:\-–]\s*(.+)\s*$/i;
const EXPLAIN_RE = /^\s*(?:Explanation|Explain|Exp|Solution)\s*[:\-–]\s*(.*)\s*$/i;
const TYPE_RE = /^\s*Type\s*[:\-]\s*(mcq|msq|numerical)\s*$/i;
const RULE_RE = /^\s*(?:Rule|Topic|Subject|Source)\s*[:\-]\s*(.+)\s*$/i;

const JSON_ASSIGN_NAMES = [
  "examData",
  "raw_questions_data",
  "questions_data",
  "questionsData",
  "quizData",
  "paperData",
  "testData",
  "mcqData",
  "questionBank",
  "QUESTION_BANK",
  "questions",
];

function letterToIndex(token: string): number | null {
  const t = token.trim();
  if (/^[A-Da-d]$/.test(t)) return t.toUpperCase().charCodeAt(0) - 65;
  if (/^[1-4]$/.test(t)) return Number(t) - 1;
  return null;
}

function parseAnswerToken(
  raw: string,
  options: string[],
  type: QuestionType,
): number | number[] | string | null {
  const value = raw.trim().replace(/^\(|\)$/g, "");
  if (type === "numerical") return value;
  if (type === "msq") {
    const parts = value.split(/[,&+/]|and/i).map((p) => p.trim()).filter(Boolean);
    const idxs: number[] = [];
    for (const p of parts) {
      const i = letterToIndex(p);
      if (i === null) return null;
      idxs.push(i);
    }
    return idxs;
  }
  const direct = letterToIndex(value);
  if (direct !== null) return direct;
  const lower = value.toLowerCase();
  const byText = options.findIndex((o) => o.toLowerCase() === lower);
  if (byText >= 0) return byText;
  return null;
}

interface Draft {
  question: string;
  options: string[];
  correct: number | number[] | string | null;
  explanation: string;
  type: QuestionType;
  rule: string;
}

function flush(draft: Draft | null, out: Question[], warnings: string[]) {
  if (!draft) return;
  const q = draft.question.trim();
  if (!q) return;
  if (draft.type !== "numerical" && draft.options.length < 2) {
    warnings.push(`Skipped (need at least 2 options): “${q.slice(0, 60)}”`);
    return;
  }
  let correct: number | number[] | string = draft.correct ?? 0;
  if (draft.correct === null) {
    warnings.push(`No answer marked for “${q.slice(0, 48)}…” — defaulted to A`);
    correct = 0;
  }
  out.push({
    id: uid(),
    type: draft.type,
    rule: draft.rule || "General",
    question: q,
    options: draft.options,
    correct,
    explanation: draft.explanation.trim(),
  });
}

function parseJsonBlob(raw: string): ParseResult | null {
  try {
    const data = JSON.parse(raw) as unknown;
    return questionsFromUnknown(data);
  } catch {
    try {
      const loosened = raw.replace(/,\s*([}\]])/g, "$1");
      const data = JSON.parse(loosened) as unknown;
      return questionsFromUnknown(data);
    } catch {
      return null;
    }
  }
}

function asText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return stripMarkup(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    return asText(o.text ?? o.label ?? o.option ?? o.value ?? o.en ?? o.question_en);
  }
  return "";
}

function stripMarkup(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/"/gi, '"')
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function optionList(value: unknown): { options: string[]; correctFromFlags: number | null } {
  if (!Array.isArray(value)) return { options: [], correctFromFlags: null };
  const options: string[] = [];
  let correctFromFlags: number | null = null;
  value.forEach((item, idx) => {
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      options.push(asText(o.text ?? o.label ?? o.option ?? o.value ?? o.en ?? item));
      if (o.isCorrect === true || o.correct === true || o.answer === true) correctFromFlags = idx;
    } else {
      options.push(asText(item));
    }
  });
  return { options: options.filter(Boolean), correctFromFlags };
}

function asCorrect(q: Record<string, unknown>, options: string[]): number | number[] | string {
  const flagged = optionList(q.options ?? q.options_en ?? q.choices).correctFromFlags;
  if (flagged != null) return flagged;
  const candidates = [q.correct, q.answerIndex, q.answer_index, q.correctIndex, q.correct_index, q.answer, q.ans];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return c;
    if (Array.isArray(c)) {
      const nums = c.map((n) => Number(n)).filter((n) => Number.isFinite(n));
      if (nums.length) return nums;
    }
    if (typeof c === "string" && c.trim()) {
      const token = parseAnswerToken(c, options, "mcq");
      if (token !== null) return token;
      return c.trim();
    }
  }
  return 0;
}

function questionTextOf(q: Record<string, unknown>): string {
  return asText(
    q.question ??
      q.q ??
      q.question_en ??
      q.questionText ??
      q.question_text ??
      q.stem ??
      q.text ??
      q.prompt ??
      q.title,
  );
}

function explanationOf(q: Record<string, unknown>): string {
  return asText(q.explanation ?? q.solution ?? q.explain ?? q.reason ?? q.solution_en ?? q.answer_explain);
}

export function questionsFromUnknown(data: unknown): ParseResult | null {
  const collected: unknown[] = [];
  if (Array.isArray(data)) collected.push(...data);
  else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.questions)) collected.push(...obj.questions);
    if (Array.isArray(obj.raw_questions_data)) collected.push(...obj.raw_questions_data);
    if (Array.isArray(obj.questions_data)) collected.push(...obj.questions_data);
    if (Array.isArray(obj.items)) collected.push(...obj.items);
    if (Array.isArray(obj.data)) collected.push(...obj.data);
    if (Array.isArray(obj.sections)) {
      for (const s of obj.sections as Array<{ questions?: unknown[]; name?: string; title?: string }>) {
        if (Array.isArray(s.questions)) {
          for (const q of s.questions) {
            if (q && typeof q === "object") {
              collected.push({ ...(q as object), rule: (q as { rule?: string }).rule || s.name || s.title });
            } else collected.push(q);
          }
        }
      }
    }
  }
  if (collected.length === 0) return null;
  const questions: Question[] = [];
  const warnings: string[] = [];
  for (const item of collected) {
    if (!item || typeof item !== "object") continue;
    const q = item as Record<string, unknown>;
    const text = questionTextOf(q);
    if (!text) continue;
    const { options } = optionList(q.options ?? q.options_en ?? q.choices ?? q.answers ?? q.optionsEn);
    const type = ((q.type as string) || "mcq").toLowerCase() as QuestionType;
    const safeType: QuestionType = type === "msq" || type === "numerical" ? type : "mcq";
    questions.push({
      id: uid(),
      type: safeType,
      rule: asText(q.rule ?? q.topic ?? q.subject ?? q.source ?? q.section) || "General",
      question: text,
      options,
      correct: asCorrect(q, options),
      explanation: explanationOf(q),
    });
    if (safeType !== "numerical" && options.length < 2) {
      warnings.push(`“${text.slice(0, 48)}” has fewer than 2 options`);
    }
  }
  return { questions, warnings, errors: questions.length ? [] : ["JSON had no questions"] };
}

export function parseQuestionText(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) return { questions: [], warnings: [], errors: ["Nothing to parse"] };

  const payloads = extractQuestionPayloads(trimmed);
  for (const embedded of payloads) {
    const json = parseJsonBlob(embedded);
    if (json && json.questions.length) return json;
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const json = parseJsonBlob(trimmed);
    if (json) return json;
  }

  const questions: Question[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const lines = trimmed.replace(/\r\n/g, "\n").split("\n");
  let draft: Draft | null = null;
  let explainContinue = false;

  const startDraft = (text: string): Draft => ({
    question: text,
    options: [],
    correct: null,
    explanation: "",
    type: "mcq",
    rule: "General",
  });

  for (const line of lines) {
    if (!line.trim()) {
      explainContinue = false;
      continue;
    }

    const typeMatch = line.match(TYPE_RE);
    if (typeMatch && draft) {
      draft.type = typeMatch[1].toLowerCase() as QuestionType;
      continue;
    }
    const ruleMatch = line.match(RULE_RE);
    if (ruleMatch && draft) {
      draft.rule = ruleMatch[1].trim();
      continue;
    }
    const ansMatch = line.match(ANSWER_RE);
    if (ansMatch && draft) {
      draft.correct = parseAnswerToken(ansMatch[1], draft.options, draft.type);
      if (draft.correct === null) warnings.push(`Could not read answer “${ansMatch[1].trim()}”`);
      explainContinue = false;
      continue;
    }
    const expMatch = line.match(EXPLAIN_RE);
    if (expMatch && draft) {
      draft.explanation = expMatch[1];
      explainContinue = true;
      continue;
    }
    const optMatch = line.match(OPTION_RE);
    if (optMatch && draft) {
      draft.options.push(optMatch[2].trim());
      explainContinue = false;
      continue;
    }
    const qMatch = line.match(QUESTION_RE);
    if (qMatch) {
      flush(draft, questions, warnings);
      draft = startDraft(qMatch[2]);
      explainContinue = false;
      continue;
    }
    if (draft && explainContinue) {
      draft.explanation += (draft.explanation ? " " : "") + line.trim();
      continue;
    }
    if (draft && draft.options.length === 0 && !OPTION_RE.test(line)) {
      draft.question += " " + line.trim();
      continue;
    }
    if (!draft) {
      draft = startDraft(line.trim());
    }
  }
  flush(draft, questions, warnings);

  if (questions.length === 0) {
    errors.push("Could not detect questions. Use numbered items with A/B/C/D options.");
  }
  return { questions, warnings, errors };
}

export function htmlTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!m) return "";
  return decodeHtmlEntities(m[1])
    .replace(/TCS\s*iON\s*\|\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function examMinutesFromHtml(html: string): number | undefined {
  const m =
    html.match(/id=["']setting-time["'][^>]*value=["'](\d+)/i) ||
    html.match(/value=["'](\d+)["'][^>]*id=["']setting-time["']/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_, ent: string) => {
    const lower = ent.toLowerCase();
    if (lower.startsWith("#x")) return String.fromCharCode(parseInt(lower.slice(2), 16));
    if (lower.startsWith("#")) return String.fromCharCode(Number(lower.slice(1)));
    if (lower === "amp") return String.fromCharCode(38);
    if (lower === "lt") return String.fromCharCode(60);
    if (lower === "gt") return String.fromCharCode(62);
    if (lower === "quot") return String.fromCharCode(34);
    if (lower === "apos" || lower === "nbsp") return lower === "nbsp" ? " " : "'";
    return `&${ent};`;
  });
}

/** Pull the examData object out of a full HTML paper, any size. */
export function extractExamDataObject(html: string): string | null {
  const span = findAssignedValue(html, ["examData"]);
  if (!span || span.placeholder) return null;
  if (span.value === "{}") return null;
  return span.value;
}

/** JSON blobs that may hold questions — examData, raw_questions_data, etc. */
export function extractQuestionPayloads(html: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (value: string | null | undefined) => {
    if (!value || value === "{}" || value === "[]") return;
    if (seen.has(value)) return;
    seen.add(value);
    out.push(value);
  };
  push(extractExamDataObject(html));
  for (const name of JSON_ASSIGN_NAMES) {
    const span = findAssignedValue(html, [name]);
    if (span && !span.placeholder) push(span.value);
  }
  const any = findAnyJsonAssignment(html);
  if (any && !any.placeholder) push(any.value);
  return out;
}

/** Turn a filled HTML paper into a reusable template by dropping the questions. */
export function toTemplateHtml(html: string): string | null {
  if (html.includes("__EXAM_DATA__")) return html;
  const span = findAssignedValue(html, ["examData"]);
  if (span) return html.slice(0, span.start) + "__EXAM_DATA__" + html.slice(span.end);
  return null;
}

export type JsonValueSpan = {
  start: number;
  end: number;
  value: string;
  placeholder: boolean;
  name: string;
};

export function findAssignedValue(html: string, names: string[]): JsonValueSpan | null {
  for (const name of names) {
    const markers = [
      new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`),
      new RegExp(`window\\.${name}\\s*=\\s*`),
    ];
    for (const re of markers) {
      const m = html.match(re);
      if (!m || m.index === undefined) continue;
      let i = m.index + m[0].length;
      while (i < html.length && /\s/.test(html[i])) i++;
      if (html.startsWith("__EXAM_DATA__", i)) {
        return { start: i, end: i + "__EXAM_DATA__".length, value: "__EXAM_DATA__", placeholder: true, name };
      }
      if (html[i] !== "{" && html[i] !== "[") continue;
      const value = sliceBalanced(html, i);
      if (!value) continue;
      return { start: i, end: i + value.length, value, placeholder: false, name };
    }
  }
  return null;
}

function findAnyJsonAssignment(html: string): JsonValueSpan | null {
  const re = /(?:(?:const|let|var)\s+|window\.)([A-Za-z_][\w]*)\s*=\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const name = m[1];
    let i = m.index + m[0].length;
    while (i < html.length && /\s/.test(html[i])) i++;
    if (html[i] !== "[" && html[i] !== "{") continue;
    const value = sliceBalanced(html, i);
    if (!value || value.length < 20) continue;
    if (value.startsWith("[") || /"question|"options|"question_en|"answerIndex/.test(value.slice(0, 400))) {
      return { start: i, end: i + value.length, value, placeholder: false, name };
    }
  }
  return null;
}

function sliceBalanced(source: string, start: number): string | null {
  const open = source[start];
  const close = open === "[" ? "]" : open === "{" ? "}" : "";
  if (!close) return null;
  let depth = 0;
  let inStr = false;
  let quote = "";
  let esc = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      quote = c;
      continue;
    }
    if (c === open) depth += 1;
    else if (c === close) {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    } else if (open === "{" && c === "{" ) {
      depth += 1;
    }
  }
  return null;
}

export function serializeQuestionsAsText(questions: Question[]): string {
  return questions
    .map((q, i) => {
      const opts = q.options
        .map((o, idx) => `${String.fromCharCode(65 + idx)}) ${o}`)
        .join("\n");
      let ans = "";
      if (typeof q.correct === "number") ans = String.fromCharCode(65 + q.correct);
      else if (Array.isArray(q.correct)) ans = q.correct.map((n) => String.fromCharCode(65 + n)).join(", ");
      else ans = String(q.correct);
      const exp = q.explanation ? `\nExplanation: ${q.explanation}` : "";
      return `${i + 1}. ${q.question}\n${opts}\nAnswer: ${ans}${exp}`;
    })
    .join("\n\n");
}
