// @ts-nocheck — recovered runtime plus Focus types; signatures are explicit below.
export type QuestionType = "mcq" | "msq" | "numerical";
export type Rating = "again" | "hard" | "good" | "easy";
export type SectionSize = 10 | 20;
export type Queue = "new" | "learn" | "review" | "relearn" | "suspended" | "buried";
export type NewOrder = "sequential" | "random";
export type NewPosition = "mixed" | "before" | "after";
export type LeechAction = "suspend" | "tag";
export type ThemeName = "light" | "dark";
export type AnswerButtonSize = "small" | "normal" | "large";
export type OptionOrder = "as-written" | "shuffle" | "reverse";
export type TimerMode = "section" | "overall" | "off";
export type NoteFileKind = "image" | "video" | "audio" | "pdf" | "html" | "doc" | "other";
export type RiverKind = "subject" | "bridge" | "flood";

export const BUNDLED_TEMPLATE_ID = "bundled";
export const DEFAULT_CONFIG_ID = "default";
export const FLOOD_WINDOW_DAYS = 14;
export const MAX_RIVER_NODES = 16;

export interface Question {
  id: string;
  type: QuestionType;
  rule: string;
  question: string;
  options: string[];
  correct: number | number[] | string;
  explanation: string;
  sourceSection?: string;
}

export interface Card extends Question {
  deckId: string;
  tags: string[];
  queue: Queue;
  due: number;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  remainingSteps: number;
  flag: number;
  marked: boolean;
  lastRating?: Rating;
  reviewStage?: number;
  reviewBucket?: string;
  reviewHistory?: Array<{ bucket: string; stage: number; outcome: "pending" | "correct" | "transfer"; at: number }>;
  createdAt: number;
  modifiedAt: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  configId: string;
  collapsed: boolean;
  createdAt: number;
  reviewDays?: number;
  kind?: "deck" | "folder";
  logo?: string;
  order?: number;
}

export interface DeckConfig {
  id: string;
  name: string;
  newPerDay: number;
  reviewsPerDay: number;
  learnSteps: number[];
  relearnSteps: number[];
  graduatingInterval: number;
  easyInterval: number;
  startingEase: number;
  easyBonus: number;
  intervalModifier: number;
  hardInterval: number;
  maximumInterval: number;
  minimumInterval: number;
  leechThreshold: number;
  leechAction: LeechAction;
  newOrder: NewOrder;
  burySiblings: boolean;
}

export interface Prefs {
  theme: ThemeName;
  newPosition: NewPosition;
  dayStartHour: number;
  learnAheadMinutes: number;
  timeboxMinutes: number;
  keepScreenOn: boolean;
  fullscreenReview: boolean;
  showButtonTime: boolean;
  showRemaining: boolean;
  answerButtonSize: AnswerButtonSize;
  cardZoom: number;
  notifyWhenDue: boolean;
  sectionSize: SectionSize;
  minutesPerQuestion: number;
  templateHtml: string;
  language: string;
  defaultDeckId: string;
  targetExamName: string;
}

export interface TemplatePattern {
  sectionSize: SectionSize;
  minutesPerQuestion: number;
  extraMinutes: number;
  timerMode: TimerMode;
  optionOrder: OptionOrder;
  candidateName: string;
  candidateId: string;
  examTitle: string;
  allowSectionSwitch: boolean;
  showMarkForReview: boolean;
  showClear: boolean;
  showPalette: boolean;
  showSubmitSection: boolean;
  showTimer: boolean;
}

export interface TemplateResult {
  sessionId: string;
  deckId: string;
  deckName?: string;
  at: number;
  total: number;
  correct: number;
  wrong: number;
  notAttempted: number;
  marked: number;
}

export interface ExamTemplate {
  id: string;
  name: string;
  kind: "bundled" | "uploaded";
  fileName: string;
  size: number;
  bookmarked: boolean;
  pattern: TemplatePattern;
  createdAt: number;
  modifiedAt: number;
  lastResult?: TemplateResult | null;
  results?: TemplateResult[];
}

export interface DailyDeck {
  newStudied: number;
  reviewsStudied: number;
}

export interface Daily {
  day: string;
  byDeck: Record<string, DailyDeck>;
}

export interface RevLog {
  id: string;
  cardId: string;
  deckId: string;
  rating: Rating;
  queue: Queue;
  interval: number;
  ease: number;
  at: number;
}

export interface SessionSummary {
  id: string;
  deckId: string;
  at: number;
  total: number;
  correct: number;
  wrong: number;
  notAttempted: number;
  marked: number;
  againIds: string[];
  hardIds: string[];
  goodIds: string[];
  wrongIds?: string[];
  skippedIds?: string[];
  markedIds?: string[];
  correctIds?: string[];
  paperId: string | null;
  templateId?: string | null;
}

export type PaperKind = "wrong" | "hard" | "skipped" | "marked" | "correct";

export interface PaperFile {
  id: string;
  deckId: string;
  kind: PaperKind;
  title: string;
  questionIds: string[];
  createdAt: number;
  dueAt: number;
  repetition: number;
  sourceSessionId: string;
}

export interface FileProgress {
  seen: number;
  total: number;
  done: boolean;
}

export interface NoteFileMeta {
  id: string;
  name: string;
  mime: string;
  size: number;
  kind: NoteFileKind;
  progress?: FileProgress;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  folderId: string | null;
  files: NoteFileMeta[];
  createdAt: number;
  modifiedAt: number;
}

export interface NoteFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
  source?: "phone" | "desk" | "email";
  logo?: string;
}

export type LinkedSourceKind = "email" | "phone" | "desk";

export interface LinkedSource {
  id: string;
  kind: LinkedSourceKind;
  name: string;
  remoteId?: string;
  folderId?: string;
  createdAt: number;
}

export interface CoachingLesson {
  id: string;
  title: string;
  done: boolean;
}

export interface CoachingCourse {
  id: string;
  title: string;
  subject: string;
  lessons: CoachingLesson[];
  createdAt: number;
}

export interface CoachingClass {
  id: string;
  title: string;
  subject: string;
  startsAt: number;
  durationMin: number;
  live: boolean;
  notes: string;
  createdAt: number;
  roomCode: string;
  timeoutSec: number;
}

export interface CoachingRecording {
  id: string;
  title: string;
  subject: string;
  durationMin: number;
  file: NoteFileMeta | null;
  notes: string;
  createdAt: number;
}

export interface CoachingMeeting {
  id: string;
  title: string;
  withWhom: string;
  at: number;
  notes: string;
  live: boolean;
  createdAt: number;
}

export interface CoachingPost {
  id: string;
  author: string;
  body: string;
  at: number;
}

export interface CoachingDiscussion {
  id: string;
  title: string;
  prompt: string;
  mode: "video" | "audio" | "chat" | "hand";
  roomCode: string;
  posts: CoachingPost[];
  createdAt: number;
}

export interface CoachingTeacher {
  name: string;
  subject: string;
  phone: string;
  email: string;
  hours: string;
  note: string;
}

export interface CoachingCustomization {
  institute: string;
  batch: string;
  schedule: string;
  language: string;
  allowDiscussions: boolean;
  allowRecordings: boolean;
}

export interface CoachingTeacherMessage {
  id: string;
  body: string;
  at: number;
}

export interface CoachingState {
  classes: CoachingClass[];
  recordings: CoachingRecording[];
  meetings: CoachingMeeting[];
  courses: CoachingCourse[];
  discussions: CoachingDiscussion[];
  teacher: CoachingTeacher;
  customization: CoachingCustomization;
  teacherMessages: CoachingTeacherMessage[];
}

export interface RiverNode {
  id: string;
  kind: RiverKind;
  title: string;
  t: number;
  done: boolean;
  deckId: string | null;
  notes: string;
  createdAt: number;
}

export interface TargetJourney {
  examDate: number | null;
  floodDays: number;
  nodes: RiverNode[];
}

export type PathNodeKind = "note" | "test" | "weekly" | "extra";
export type PathNodeState = "locked" | "current" | "done";
export type PathDailyGoal = 1 | 2 | 3 | 5;

export interface PathIntake {
  completed: boolean;
  examName: string;
  startDate: number | null;
  examDate: number | null;
  dailyGoal: PathDailyGoal;
  weeklyTests: boolean;
  subjects: string[];
  noteIds: string[];
  deckIds: string[];
  extraItems: string[];
}

export interface PathNode {
  id: string;
  kind: PathNodeKind;
  title: string;
  unit: number;
  unitTitle: string;
  noteId: string | null;
  deckId: string | null;
  extra: string | null;
}

export interface PathTestScore {
  percent: number;
  at: number;
  sessionId: string;
}

export interface PathProgress {
  doneIds: string[];
  noteReads: Record<string, number>;
  testScores: Record<string, PathTestScore>;
  marks: number;
  todayMarks: number;
  weekMarks: number;
  dayKey: string;
  weekKey: string;
  streak: number;
  lastActiveDay: string | null;
  sound: boolean;
}

export interface ExamPath {
  intake: PathIntake;
  nodes: PathNode[];
  progress: PathProgress;
}

export type FocusWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type FocusSort = "asc" | "desc" | "created";
export type FocusAppKind = "catalog" | "setpaper" | "custom";
export type FocusThemePref = "auto" | "light" | "dark";

export interface FocusPeriod {
  id: string;
  start: string;
  end: string;
}

export interface FocusLimits {
  days: FocusWeekday[];
  timerOn: boolean;
  offTimerMin: number;
  waitMin: number;
  usageOn: boolean;
  usageLimitMin: number;
  periodOn: boolean;
  periods: FocusPeriod[];
  disabled: boolean;
}

export interface FocusApp {
  id: string;
  name: string;
  mark: string;
  hue: number;
  kind: FocusAppKind;
  custom: boolean;
  route: string | null;
  pinned: boolean;
  createdAt: number;
  limits: FocusLimits;
}

export interface FocusGroup {
  id: string;
  name: string;
  appIds: string[];
  createdAt: number;
  limits: FocusLimits;
}

export interface FocusUsageEntry {
  id: string;
  appId: string;
  at: number;
  seconds: number;
}

export interface FocusSession {
  appId: string;
  startedAt: number;
  lastTick: number;
  plannedMs: number;
  waiting: boolean;
  waitUntil: number | null;
  warned: boolean;
}

export interface FocusSettings {
  defaultOffMin: number;
  defaultWaitMin: number;
  defaultUsageMin: number;
  notifyBeforeClose: boolean;
  displayRemaining: boolean;
  notifyUsage: boolean;
  pinEnabled: boolean;
  pinHash: string;
  restrictPinned: boolean;
  audioMessage: boolean;
  darkTheme: FocusThemePref;
  lockEnabled: boolean;
  modeOn: boolean;
  shieldOn: boolean;
  blockAllOn: boolean;
  accessGrantedAt: number;
}

export interface FocusState {
  apps: FocusApp[];
  groups: FocusGroup[];
  settings: FocusSettings;
  usage: FocusUsageEntry[];
  usageSeeded: boolean;
  sortApps: FocusSort;
  sortGroups: FocusSort;
  session: FocusSession | null;
  lastDayKey: string;
  todayUsed: Record<string, number>;
  waitUntil: Record<string, number>;
}

export const LUDO_COLORS = ["blue", "yellow", "red", "green"] as const;
export type LudoColor = (typeof LUDO_COLORS)[number];
export type LudoPlayerMode = "two" | "four" | "custom";
export const MAX_LUDO_STUDENTS = 4;
export const MIN_LUDO_TOKENS = 4;
export const MAX_LUDO_TOKENS = 10;
export const LUDO_HOME_STEPS = 57;
export const LUDO_LAYOUT = 3;
export type LudoLogo = "book" | "flask" | "scale" | "pick" | "none";
export type LudoPhase = "roll" | "move" | "study" | "challenge" | "won";
export type LudoCellKind = "note" | "array" | "sunday";
export type LudoChallengeStatus = "pending-set" | "pending-take" | "passed" | "failed";

export interface LudoCellNote {
  label: string;
  content: string;
  kind: LudoCellKind;
  skip: number;
  sundayTokenId: string | null;
  sundayColor: LudoColor | null;
}

export interface LudoToken {
  id: string;
  name: string;
  deckId: string | null;
  steps: number;
  dayName: string;
  stampColor: LudoColor | "inherit";
  logo: LudoLogo;
  sundayKey: string | null;
}

export interface LudoColumn {
  color: LudoColor;
  studentName: string;
  tokenCount: number;
  tokens: LudoToken[];
  dailyTarget: number;
  entryTurn: number;
  arrowEnabled: boolean;
}

export interface LudoStudyRules {
  oncePerDay: boolean;
  enterOnOneOrSix: boolean;
  captureTest: boolean;
  skipArray: boolean;
  sundayBoxes: boolean;
  standardLudo: boolean;
  passingScore: number;
  skipSteps: number;
}

export interface LudoCustomRule {
  id: string;
  title: string;
  detail: string;
  enabled: boolean;
}

export interface LudoChallenge {
  id: string;
  capturerColor: LudoColor;
  capturedColor: LudoColor;
  tokenId: string;
  tokenName: string;
  deckId: string | null;
  passingScore: number;
  status: LudoChallengeStatus;
  createdAt: number;
  sessionId: string | null;
}

export interface LudoBoard {
  layout: number;
  startedAt: number | null;
  examDate: number | null;
  fastMode: boolean;
  restDays: number[];
  restDates: string[];
  playerColor: LudoColor;
  columns: LudoColumn[];
  lastTestId: string | null;
  lastNoteAt: number;
  lastPips: number;
  lastMoveAt: number | null;
  cells: Record<string, LudoCellNote>;
  turnColor: LudoColor;
  phase: LudoPhase;
  consecutiveSixes: number;
  extraTurns: number;
  winner: LudoColor | null;
  pendingCell: string | null;
  bots: boolean;
  playerMode: LudoPlayerMode;
  activeColors: LudoColor[];
  rules: LudoStudyRules;
  customRules: LudoCustomRule[];
  challenge: LudoChallenge | null;
  studentRolls: Partial<Record<LudoColor, string>>;
}

export interface CollectionPayload {
  decks: Deck[];
  cards: Card[];
  configs: Record<string, DeckConfig>;
  prefs: Prefs;
  daily: Daily;
  revlog: RevLog[];
  papers: PaperFile[];
  lastSession: SessionSummary | null;
  sessions: SessionSummary[];
  notes: Note[];
  folders: NoteFolder[];
  links?: LinkedSource[];
  templates: ExamTemplate[];
  coaching: CoachingState;
  journey: TargetJourney;
  ludo: LudoBoard;
  path: ExamPath;
  focus: FocusState;
}

export interface DeckCounts {
  new: number;
  learn: number;
  review: number;
  total: number;
  suspended: number;
}

export interface ResultCounts {
  wrong: number;
  marked: number;
  skipped: number;
  correct: number;
}

export interface ExamMeta {
  title: string;
  subtitle?: string;
  footer?: string;
  candidateName?: string;
  candidateId?: string;
}

export interface ExamQuestion {
  id: number;
  bankId: string;
  type: QuestionType;
  rule: string;
  question: string;
  options: string[];
  correct: number | number[] | string;
  explanation: string;
}

export interface ExamSection {
  id: number;
  name: string;
  title: string;
  timeMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamData {
  meta: ExamMeta;
  sections: ExamSection[];
  settings?: TemplatePattern;
}

export interface ExamCompletePayload {
  total: number;
  correct: number;
  wrong: number;
  notAttempted: number;
  marked: number;
  score?: number;
  items: Array<{
    bankId: string | number;
    isAttempted: boolean;
    isCorrect: boolean;
    isMarked: boolean;
    userAns?: number | number[] | string | null;
  }>;
}

const FILE_KINDS: NoteFileKind[] = ["image", "video", "audio", "pdf", "html", "doc", "other"];

export function noteFileKind(mime: any, name: any) {
	const m = (mime || "").toLowerCase();
	const ext = (name.split(".").pop() || "").toLowerCase();
	if (m.startsWith("image/") || [
		"png",
		"jpg",
		"jpeg",
		"gif",
		"webp",
		"heic",
		"heif",
		"svg",
		"bmp"
	].includes(ext)) return "image";
	if (m.startsWith("video/") || [
		"mp4",
		"webm",
		"mov",
		"mkv",
		"avi",
		"m4v"
	].includes(ext)) return "video";
	if (m.startsWith("audio/") || [
		"mp3",
		"wav",
		"m4a",
		"ogg",
		"aac",
		"flac",
		"opus"
	].includes(ext)) return "audio";
	if (m === "application/pdf" || ext === "pdf") return "pdf";
	if (m.includes("html") || ext === "html" || ext === "htm") return "html";
	if ([
		"doc",
		"docx",
		"xls",
		"xlsx",
		"ppt",
		"pptx",
		"txt",
		"rtf",
		"csv",
		"odt",
		"ods",
		"odp",
		"json",
		"zip",
		"md"
	].includes(ext)) return "doc";
	return "other";
}
export function normalizeFiles(raw: any) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const f = item;
		const id = String(f.id ?? "").trim();
		const name = String(f.name ?? "").trim();
		if (!id || !name) continue;
		const mime = String(f.mime ?? "");
		const seen = Math.max(0, Number(f.progress?.seen) || 0);
		const total = Math.max(0, Number(f.progress?.total) || 0);
		const done = Boolean(f.progress?.done) || (total > 0 && seen >= total);
		out.push({
			id,
			name,
			mime,
			size: Math.max(0, Number(f.size) || 0),
			kind: f.kind && FILE_KINDS.includes(f.kind) ? f.kind : noteFileKind(mime, name),
			...(seen || total || done ? { progress: { seen, total: total || seen, done } } : {})
		});
	}
	return out;
}
export function normalizeNotes(raw: unknown): Note[] {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const n = item;
		const id = String(n.id ?? "").trim();
		if (!id) continue;
		const folderId = n.folderId == null || n.folderId === "" ? null : String(n.folderId);
		out.push({
			id,
			title: String(n.title ?? ""),
			body: String(n.body ?? ""),
			folderId,
			files: normalizeFiles(n.files),
			createdAt: Number(n.createdAt) || Date.now(),
			modifiedAt: Number(n.modifiedAt) || Date.now()
		});
	}
	return out;
}
export function normalizeFolders(raw: unknown): NoteFolder[] {
	if (!Array.isArray(raw)) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const f = item;
		const id = String(f.id ?? "").trim();
		const name = String(f.name ?? "").trim();
		if (!id || !name || seen.has(id)) continue;
		seen.add(id);
		const parentId = f.parentId == null || f.parentId === "" ? null : String(f.parentId);
		out.push({
			id,
			name,
			parentId: parentId === id ? null : parentId,
			createdAt: Number(f.createdAt) || Date.now(),
			source: f.source === "phone" || f.source === "desk" || f.source === "email" ? f.source : undefined
		});
	}
	return out;
}
export function normalizeLinks(raw: unknown): LinkedSource[] {
	if (!Array.isArray(raw)) return [];
	const out: LinkedSource[] = [];
	const seen = new Set<string>();
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const l = item as Partial<LinkedSource>;
		const id = String(l.id ?? "").trim();
		const name = String(l.name ?? "").trim();
		const kind = l.kind === "email" || l.kind === "phone" || l.kind === "desk" ? l.kind : null;
		if (!id || !name || !kind || seen.has(id)) continue;
		seen.add(id);
		out.push({
			id,
			kind,
			name,
			remoteId: l.remoteId ? String(l.remoteId) : undefined,
			folderId: l.folderId ? String(l.folderId) : undefined,
			createdAt: Number(l.createdAt) || Date.now(),
		});
	}
	return out;
}
export function defaultPattern(prefs?: Partial<Prefs> | null): TemplatePattern {
	const minutes = Number(prefs?.minutesPerQuestion);
	return {
		sectionSize: prefs?.sectionSize === 20 ? 20 : 10,
		minutesPerQuestion: Number.isFinite(minutes) && minutes > 0 ? minutes : 1,
		extraMinutes: 0,
		timerMode: "section",
		optionOrder: "as-written",
		candidateName: "",
		candidateId: "",
		examTitle: "",
		allowSectionSwitch: true,
		showMarkForReview: true,
		showClear: true,
		showPalette: true,
		showSubmitSection: true,
		showTimer: true
	};
}
export function asSectionSize(raw: any) {
	return Number(raw) === 20 ? 20 : 10;
}
export function asTimerMode(raw: any) {
	return raw === "overall" || raw === "off" ? raw : "section";
}
export function asOptionOrder(raw: any) {
	return raw === "shuffle" || raw === "reverse" ? raw : "as-written";
}
export function normalizePattern(raw: unknown, prefs?: Partial<Prefs> | null): TemplatePattern {
	const base = defaultPattern(prefs);
	if (!raw || typeof raw !== "object") return base;
	const p = raw;
	const minutes = Number(p.minutesPerQuestion);
	const extra = Number(p.extraMinutes);
	return {
		sectionSize: asSectionSize(p.sectionSize ?? base.sectionSize),
		minutesPerQuestion: Number.isFinite(minutes) && minutes > 0 ? minutes : base.minutesPerQuestion,
		extraMinutes: Number.isFinite(extra) && extra > 0 ? extra : 0,
		timerMode: asTimerMode(p.timerMode),
		optionOrder: asOptionOrder(p.optionOrder),
		candidateName: String(p.candidateName ?? ""),
		candidateId: String(p.candidateId ?? ""),
		examTitle: String(p.examTitle ?? ""),
		allowSectionSwitch: p.allowSectionSwitch !== false,
		showMarkForReview: p.showMarkForReview !== false,
		showClear: p.showClear !== false,
		showPalette: p.showPalette !== false,
		showSubmitSection: p.showSubmitSection !== false,
		showTimer: p.showTimer !== false
	};
}
export function defaultTemplates(prefs?: Partial<Prefs> | null): ExamTemplate[] {
	const now = Date.now();
	return [{
		id: BUNDLED_TEMPLATE_ID,
		name: "TCS iON",
		kind: "bundled",
		fileName: "tcs-ion-template.html",
		size: 0,
		bookmarked: true,
		pattern: defaultPattern(prefs),
		createdAt: now,
		modifiedAt: now,
		lastResult: null,
		results: []
	}];
}
export function normalizeTemplateResult(raw: unknown): TemplateResult | null {
	if (!raw || typeof raw !== "object") return null;
	const r = raw as Partial<TemplateResult>;
	const sessionId = String(r.sessionId ?? "").trim();
	const deckId = String(r.deckId ?? "").trim();
	if (!sessionId || !deckId) return null;
	return {
		sessionId,
		deckId,
		deckName: r.deckName ? String(r.deckName) : undefined,
		at: Number(r.at) || Date.now(),
		total: Math.max(0, Number(r.total) || 0),
		correct: Math.max(0, Number(r.correct) || 0),
		wrong: Math.max(0, Number(r.wrong) || 0),
		notAttempted: Math.max(0, Number(r.notAttempted) || 0),
		marked: Math.max(0, Number(r.marked) || 0),
	};
}
export function normalizeTemplateResults(raw: unknown): TemplateResult[] {
	if (!Array.isArray(raw)) return [];
	const out: TemplateResult[] = [];
	for (const item of raw) {
		const row = normalizeTemplateResult(item);
		if (row) out.push(row);
		if (out.length >= 40) break;
	}
	return out;
}
export function normalizeTemplates(raw: unknown, prefs?: Partial<Prefs> | null): ExamTemplate[] {
	if (!Array.isArray(raw) || raw.length === 0) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const t = item;
		const id = String(t.id ?? "").trim();
		const name = String(t.name ?? "").trim();
		if (!id || !name || seen.has(id)) continue;
		seen.add(id);
		out.push({
			id,
			name,
			kind: t.kind === "uploaded" ? "uploaded" : "bundled",
			fileName: String(t.fileName ?? ""),
			size: Math.max(0, Number(t.size) || 0),
			bookmarked: Boolean(t.bookmarked),
			pattern: normalizePattern(t.pattern, prefs),
			createdAt: Number(t.createdAt) || Date.now(),
			modifiedAt: Number(t.modifiedAt) || Date.now(),
			lastResult: normalizeTemplateResult(t.lastResult),
			results: normalizeTemplateResults(t.results)
		});
	}
	if (out.length && !out.some((t) => t.bookmarked)) out[0].bookmarked = true;
	return out;
}
export function defaultConfig(): DeckConfig {
	return {
		id: DEFAULT_CONFIG_ID,
		name: "Default",
		newPerDay: 20,
		reviewsPerDay: 200,
		learnSteps: [10, 1440],
		relearnSteps: [10],
		graduatingInterval: 1,
		easyInterval: 3,
		startingEase: 2500,
		easyBonus: 1.3,
		intervalModifier: 1,
		hardInterval: 1.2,
		maximumInterval: 120,
		minimumInterval: 1,
		leechThreshold: 8,
		leechAction: "suspend",
		newOrder: "sequential",
		burySiblings: true
	};
}
export function defaultPrefs(): Prefs {
	return {
		theme: "light",
		newPosition: "mixed",
		dayStartHour: 4,
		learnAheadMinutes: 20,
		timeboxMinutes: 0,
		keepScreenOn: false,
		fullscreenReview: false,
		showButtonTime: true,
		showRemaining: true,
		answerButtonSize: "normal",
		cardZoom: 100,
		notifyWhenDue: false,
		sectionSize: 10,
		minutesPerQuestion: 1,
		templateHtml: "",
		language: "en",
		defaultDeckId: "",
		targetExamName: "Target Exam"
	};
}
export function defaultTeacher(): CoachingTeacher {
	return {
		name: "",
		subject: "",
		phone: "",
		email: "",
		hours: "",
		note: ""
	};
}
export function defaultCustomization(): CoachingCustomization {
	return {
		institute: "",
		batch: "",
		schedule: "",
		language: "en",
		allowDiscussions: true,
		allowRecordings: true
	};
}
export function defaultCoaching(): CoachingState {
	const now = Date.now();
	return {
		classes: [{
			id: "sample-live-class",
			title: "Roof supports — doubt class",
			subject: "Rock Mechanics",
			startsAt: now + 36e5,
			durationMin: 45,
			live: false,
			notes: "Bring RMR chart questions.",
			createdAt: now,
			roomCode: "",
			timeoutSec: 60
		}],
		recordings: [],
		meetings: [],
		courses: [{
			id: "sample-course",
			title: "Overman paper 1",
			subject: "Mining",
			lessons: [
				{
					id: "cl1",
					title: "RMR and rock classification",
					done: true
				},
				{
					id: "cl2",
					title: "Support systems",
					done: false
				},
				{
					id: "cl3",
					title: "Subsidence",
					done: false
				}
			],
			createdAt: now
		}],
		discussions: [{
			id: "sample-disc",
			title: "RMR vs Q-system",
			prompt: "When do you prefer Q-system over RMR in galleries?",
			mode: "video",
			roomCode: "",
			posts: [{
				id: "cp1",
				author: "You",
				body: "When do you prefer Q-system over RMR in galleries?",
				at: now
			}],
			createdAt: now
		}],
		teacher: defaultTeacher(),
		customization: defaultCustomization(),
		teacherMessages: []
	};
}
export function asFileMeta(raw: any) {
	if (!raw || typeof raw !== "object") return null;
	const f = raw;
	const id = String(f.id ?? "").trim();
	const name = String(f.name ?? "").trim();
	if (!id || !name) return null;
	const mime = String(f.mime ?? "");
	return {
		id,
		name,
		mime,
		size: Math.max(0, Number(f.size) || 0),
		kind: f.kind && FILE_KINDS.includes(f.kind) ? f.kind : noteFileKind(mime, name)
	};
}
export function normalizeCoaching(raw: unknown): CoachingState {
	const fallback = defaultCoaching();
	if (!raw || typeof raw !== "object") return fallback;
	const c = raw;
	const teacher = c.teacher && typeof c.teacher === "object" ? c.teacher : defaultTeacher();
	const custom = c.customization && typeof c.customization === "object" ? c.customization : defaultCustomization();
	return {
		classes: Array.isArray(c.classes) ? c.classes.filter((item) => item && item.id && item.title).map((item) => ({
			id: String(item.id),
			title: String(item.title),
			subject: String(item.subject ?? ""),
			startsAt: Number(item.startsAt) || Date.now(),
			durationMin: Math.max(1, Number(item.durationMin) || 45),
			live: Boolean(item.live),
			notes: String(item.notes ?? ""),
			createdAt: Number(item.createdAt) || Date.now(),
			roomCode: String(item.roomCode ?? ""),
			timeoutSec: Math.max(15, Math.min(300, Number(item.timeoutSec) || 60))
		})) : fallback.classes,
		recordings: Array.isArray(c.recordings) ? c.recordings.filter((item) => item && item.id && item.title).map((item) => ({
			id: String(item.id),
			title: String(item.title),
			subject: String(item.subject ?? ""),
			durationMin: Math.max(0, Number(item.durationMin) || 0),
			file: asFileMeta(item.file),
			notes: String(item.notes ?? ""),
			createdAt: Number(item.createdAt) || Date.now()
		})) : [],
		meetings: Array.isArray(c.meetings) ? c.meetings.filter((item) => item && item.id && item.title).map((item) => ({
			id: String(item.id),
			title: String(item.title),
			withWhom: String(item.withWhom ?? ""),
			at: Number(item.at) || Date.now(),
			notes: String(item.notes ?? ""),
			live: Boolean(item.live),
			createdAt: Number(item.createdAt) || Date.now()
		})) : [],
		courses: Array.isArray(c.courses) ? c.courses.filter((item) => item && item.id && item.title).map((item) => ({
			id: String(item.id),
			title: String(item.title),
			subject: String(item.subject ?? ""),
			lessons: Array.isArray(item.lessons) ? item.lessons.filter((l) => l && l.id && l.title).map((l) => ({
				id: String(l.id),
				title: String(l.title),
				done: Boolean(l.done)
			})) : [],
			createdAt: Number(item.createdAt) || Date.now()
		})) : fallback.courses,
		discussions: Array.isArray(c.discussions) ? c.discussions.filter((item) => item && item.id && item.title).map((item) => ({
			id: String(item.id),
			title: String(item.title),
			prompt: String(item.prompt ?? ""),
			mode: item.mode === "audio" || item.mode === "chat" || item.mode === "hand" ? item.mode : "video",
			roomCode: String(item.roomCode ?? "").trim().toUpperCase().slice(0, 8),
			posts: Array.isArray(item.posts) ? item.posts.filter((p) => p && p.id && p.body).map((p) => ({
				id: String(p.id),
				author: String(p.author || "You"),
				body: String(p.body),
				at: Number(p.at) || Date.now()
			})) : [],
			createdAt: Number(item.createdAt) || Date.now()
		})) : fallback.discussions,
		teacher: {
			name: String(teacher.name ?? ""),
			subject: String(teacher.subject ?? ""),
			phone: String(teacher.phone ?? ""),
			email: String(teacher.email ?? ""),
			hours: String(teacher.hours ?? ""),
			note: String(teacher.note ?? "")
		},
		customization: {
			institute: String(custom.institute ?? ""),
			batch: String(custom.batch ?? ""),
			schedule: String(custom.schedule ?? ""),
			language: custom.language === "hi" ? "hi" : "en",
			allowDiscussions: custom.allowDiscussions !== false,
			allowRecordings: custom.allowRecordings !== false
		},
		teacherMessages: Array.isArray(c.teacherMessages) ? c.teacherMessages.filter((m) => m && m.id && m.body).map((m) => ({
			id: String(m.id),
			body: String(m.body),
			at: Number(m.at) || Date.now()
		})) : []
	};
}
export function layoutRiverNodes(nodes: RiverNode[]): RiverNode[] {
	const sorted = [...nodes].sort((a, b) => a.createdAt - b.createdAt || a.title.localeCompare(b.title));
	const n = sorted.length;
	if (!n) return [];
	return sorted.map((node, i) => ({
		...node,
		t: n === 1 ? .42 : .14 + i / (n - 1) * .7
	}));
}
export function defaultJourney(): TargetJourney {
	const now = Date.now();
	return {
		examDate: now + 10368e5,
		floodDays: 14,
		nodes: layoutRiverNodes([
			{
				id: "sample-subject-rm",
				kind: "subject",
				title: "Rock Mechanics",
				t: .2,
				done: false,
				deckId: null,
				notes: "RMR, Q-system, support design",
				createdAt: now
			},
			{
				id: "sample-subject-law",
				kind: "subject",
				title: "Mining Law",
				t: .4,
				done: false,
				deckId: null,
				notes: "",
				createdAt: now + 1
			},
			{
				id: "sample-bridge-overman",
				kind: "bridge",
				title: "Overman paper 1",
				t: .62,
				done: false,
				deckId: "sample-rock-mechanics",
				notes: "Full exam test",
				createdAt: now + 2
			}
		])
	};
}
export function asRiverKind(raw: any) {
	return raw === "bridge" || raw === "flood" ? raw : "subject";
}
export function normalizeJourney(raw: unknown): TargetJourney {
	const fallback = defaultJourney();
	if (!raw || typeof raw !== "object") return fallback;
	const j = raw;
	const examDateRaw = j.examDate;
	const examDate = examDateRaw == null || examDateRaw === 0 ? null : Number(examDateRaw) || null;
	const floodDaysRaw = Number(j.floodDays);
	const nodes = Array.isArray(j.nodes) ? j.nodes.filter((item) => item && item.id && item.title).slice(0, 16).map((item) => ({
		id: String(item.id),
		kind: asRiverKind(item.kind),
		title: String(item.title).slice(0, 80),
		t: Math.min(.95, Math.max(.05, Number(item.t) || .5)),
		done: Boolean(item.done),
		deckId: item.deckId ? String(item.deckId) : null,
		notes: String(item.notes ?? "").slice(0, 240),
		createdAt: Number(item.createdAt) || Date.now()
	})) : fallback.nodes;
	return {
		examDate,
		floodDays: Number.isFinite(floodDaysRaw) && floodDaysRaw > 0 ? Math.min(90, floodDaysRaw) : 14,
		nodes: layoutRiverNodes(nodes)
	};
}
export function defaultPathIntake(): PathIntake {
	return {
		completed: false,
		examName: "",
		startDate: null,
		examDate: null,
		dailyGoal: 2,
		weeklyTests: true,
		subjects: [],
		noteIds: [],
		deckIds: [],
		extraItems: []
	};
}
export function defaultPathProgress(): PathProgress {
	return {
		doneIds: [],
		noteReads: {},
		testScores: {},
		marks: 0,
		todayMarks: 0,
		weekMarks: 0,
		dayKey: "",
		weekKey: "",
		streak: 0,
		lastActiveDay: null,
		sound: true
	};
}
export function defaultExamPath(): ExamPath {
	return {
		intake: defaultPathIntake(),
		nodes: [],
		progress: defaultPathProgress()
	};
}
export function asPathDailyGoal(raw: any): PathDailyGoal {
	return raw === 1 || raw === 3 || raw === 5 ? raw : 2;
}
export function asPathNodeKind(raw: any): PathNodeKind {
	return raw === "test" || raw === "weekly" || raw === "extra" ? raw : "note";
}
export function normalizeExamPath(raw: unknown): ExamPath {
	const fallback = defaultExamPath();
	if (!raw || typeof raw !== "object") return fallback;
	const p = raw;
	const intakeRaw = p.intake && typeof p.intake === "object" ? p.intake : {};
	const progressRaw = p.progress && typeof p.progress === "object" ? p.progress : {};
	const intake = {
		completed: Boolean(intakeRaw.completed),
		examName: String(intakeRaw.examName ?? "").trim().slice(0, 80),
		startDate: intakeRaw.startDate == null ? null : Number(intakeRaw.startDate) || null,
		examDate: intakeRaw.examDate == null ? null : Number(intakeRaw.examDate) || null,
		dailyGoal: asPathDailyGoal(Number(intakeRaw.dailyGoal)),
		weeklyTests: intakeRaw.weeklyTests !== false,
		subjects: Array.isArray(intakeRaw.subjects) ? intakeRaw.subjects.map((s) => String(s).trim().slice(0, 40)).filter(Boolean).slice(0, 16) : [],
		noteIds: Array.isArray(intakeRaw.noteIds) ? intakeRaw.noteIds.map((id) => String(id)).filter(Boolean).slice(0, 80) : [],
		deckIds: Array.isArray(intakeRaw.deckIds) ? intakeRaw.deckIds.map((id) => String(id)).filter(Boolean).slice(0, 40) : [],
		extraItems: Array.isArray(intakeRaw.extraItems) ? intakeRaw.extraItems.map((s) => String(s).trim().slice(0, 60)).filter(Boolean).slice(0, 16) : []
	};
	const nodes = Array.isArray(p.nodes) ? p.nodes.filter((n) => n && n.id && n.title).slice(0, 120).map((n) => ({
		id: String(n.id).slice(0, 80),
		kind: asPathNodeKind(n.kind),
		title: String(n.title).slice(0, 80),
		unit: Math.min(24, Math.max(1, Number(n.unit) || 1)),
		unitTitle: String(n.unitTitle ?? "").slice(0, 80),
		noteId: n.noteId ? String(n.noteId) : null,
		deckId: n.deckId ? String(n.deckId) : null,
		extra: n.extra ? String(n.extra).slice(0, 80) : null
	})) : [];
	const noteReads: Record<string, number> = {};
	if (progressRaw.noteReads && typeof progressRaw.noteReads === "object") for (const [id, value] of Object.entries(progressRaw.noteReads)) {
		const n = Math.min(100, Math.max(0, Number(value) || 0));
		if (id) noteReads[id] = n;
	}
	const testScores: Record<string, PathTestScore> = {};
	if (progressRaw.testScores && typeof progressRaw.testScores === "object") for (const [id, value] of Object.entries(progressRaw.testScores)) {
		if (!value || typeof value !== "object") continue;
		const row = value;
		testScores[id] = {
			percent: Math.min(100, Math.max(0, Number(row.percent) || 0)),
			at: Number(row.at) || 0,
			sessionId: String(row.sessionId ?? "")
		};
	}
	return {
		intake,
		nodes,
		progress: {
			doneIds: Array.isArray(progressRaw.doneIds) ? progressRaw.doneIds.map(String).slice(0, 120) : [],
			noteReads,
			testScores,
			marks: Math.max(0, Number(progressRaw.marks) || 0),
			todayMarks: Math.max(0, Number(progressRaw.todayMarks) || 0),
			weekMarks: Math.max(0, Number(progressRaw.weekMarks) || 0),
			dayKey: String(progressRaw.dayKey ?? ""),
			weekKey: String(progressRaw.weekKey ?? ""),
			streak: Math.max(0, Number(progressRaw.streak) || 0),
			lastActiveDay: progressRaw.lastActiveDay ? String(progressRaw.lastActiveDay) : null,
			sound: progressRaw.sound !== false
		}
	};
}
export function daysToExam(examDate: number | null | undefined, now: number = Date.now()): number | null {
	if (!examDate) return null;
	return (examDate - now) / 864e5;
}
export function floodIsOpen(journey: TargetJourney, now: number = Date.now()): boolean {
	const days = daysToExam(journey.examDate, now);
	if (days == null) return false;
	return days <= journey.floodDays && days > -2;
}
export function withAutoFlood(journey: TargetJourney, now: number = Date.now()): TargetJourney {
	if (!floodIsOpen(journey, now)) return journey;
	if (journey.nodes.some((n) => n.kind === "flood")) return journey;
	const days = daysToExam(journey.examDate, now);
	const left = days == null ? 0 : Math.max(0, Math.ceil(days));
	return {
		...journey,
		nodes: layoutRiverNodes([...journey.nodes, {
			id: `auto-flood-${Math.round(now / 864e5)}`,
			kind: "flood",
			title: "Accelerated study",
			t: .82,
			done: false,
			deckId: journey.nodes.find((n) => n.kind === "bridge" && n.deckId)?.deckId ?? null,
			notes: left === 0 ? "Exam day — sprint now" : `${left} day${left === 1 ? "" : "s"} to the exam`,
			createdAt: now
		}])
	};
}
export function journeyProgress(nodes: RiverNode[], doneIds?: string[]): number {
	if (!nodes.length) return 0;
	if (doneIds) {
		const set = new Set(doneIds);
		return nodes.filter((n) => set.has(n.id) || n.done).length / nodes.length;
	}
	return nodes.filter((n) => n.done).length / nodes.length;
}
const LUDO_DAY_NAMES = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
export function asLudoColor(raw: any): LudoColor {
	return LUDO_COLORS.includes(raw) ? raw : "red";
}
export function asLudoLogo(raw: any): LudoLogo {
	return raw === "book" || raw === "flask" || raw === "scale" || raw === "pick" ? raw : "none";
}
export function asLudoPhase(raw: any): LudoPhase {
	return raw === "move" || raw === "study" || raw === "won" || raw === "challenge" || raw === "roll" ? raw : "roll";
}
export function asLudoCellKind(raw: any): LudoCellKind {
	return raw === "array" || raw === "sunday" ? raw : "note";
}
export function defaultLudoRules(): LudoStudyRules {
	return {
		oncePerDay: true,
		enterOnOneOrSix: true,
		captureTest: true,
		skipArray: true,
		sundayBoxes: true,
		standardLudo: true,
		passingScore: 50,
		skipSteps: 4
	};
}
export function asLudoRules(raw: any) {
	const base = defaultLudoRules();
	if (!raw || typeof raw !== "object") return base;
	const r = raw;
	return {
		oncePerDay: r.oncePerDay !== false,
		enterOnOneOrSix: r.enterOnOneOrSix !== false,
		captureTest: r.captureTest !== false,
		skipArray: r.skipArray !== false,
		sundayBoxes: r.sundayBoxes !== false,
		standardLudo: r.standardLudo !== false,
		passingScore: Math.min(100, Math.max(1, Number(r.passingScore) || 50)),
		skipSteps: Math.min(12, Math.max(1, Number(r.skipSteps) || 4))
	};
}
export function asCustomRules(raw: any) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const item of raw.slice(0, 24)) {
		if (!item || typeof item !== "object") continue;
		const r = item;
		const title = String(r.title ?? "").trim().slice(0, 80);
		if (!title) continue;
		out.push({
			id: String(r.id || `rule-${out.length + 1}`).slice(0, 48),
			title,
			detail: String(r.detail ?? "").trim().slice(0, 800),
			enabled: r.enabled !== false
		});
	}
	return out;
}
export function asChallenge(raw: any) {
	if (!raw || typeof raw !== "object") return null;
	const c = raw;
	const capturerColor = asLudoColor(c.capturerColor);
	const capturedColor = asLudoColor(c.capturedColor);
	const status = c.status === "pending-take" || c.status === "passed" || c.status === "failed" ? c.status : "pending-set";
	if (status === "passed" || status === "failed") return null;
	return {
		id: String(c.id || "challenge").slice(0, 48),
		capturerColor,
		capturedColor,
		tokenId: String(c.tokenId || "").slice(0, 64),
		tokenName: String(c.tokenName || "subject").slice(0, 48),
		deckId: c.deckId ? String(c.deckId).slice(0, 64) : null,
		passingScore: Math.min(100, Math.max(1, Number(c.passingScore) || 50)),
		status,
		createdAt: Number(c.createdAt) || Date.now(),
		sessionId: c.sessionId ? String(c.sessionId).slice(0, 64) : null
	};
}
export function asStudentRolls(raw: any) {
	if (!raw || typeof raw !== "object") return {};
	const out: Partial<Record<LudoColor, string>> = {};
	for (const color of LUDO_COLORS) {
		const value = raw[color];
		if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) out[color] = value;
	}
	return out;
}
export function asPlayerMode(raw: any): LudoPlayerMode {
	if (raw === "two" || raw === "four" || raw === "custom") return raw;
	return "four";
}
export function asActiveColors(raw: any, mode: any, playerColor: any) {
	if (mode === "four") return [...LUDO_COLORS];
	if (mode === "two") {
		const opposite = playerColor === "red" || playerColor === "yellow" ? playerColor === "red" ? "yellow" : "red" : playerColor === "blue" ? "green" : "blue";
		return LUDO_COLORS.filter((c) => c === playerColor || c === opposite);
	}
	const listed = Array.isArray(raw) ? LUDO_COLORS.filter((c) => raw.includes(c)) : [];
	return listed.length ? listed : [...LUDO_COLORS];
}
export function asRestDates(raw: any) {
	if (!Array.isArray(raw)) return [];
	return raw.map((d) => String(d)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 60);
}
export function defaultLudoCells(): Record<string, LudoCellNote> {
	return {
		"6,1": {
			label: "Begin",
			content: "Blue gate. Roll a 1 or 6 to bring a subject onto the track.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"2,6": {
			label: "Vent",
			content: "Mine ventilation — a safe square. Review airflow and fans.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"1,8": {
			label: "Law",
			content: "Mining legislation. Safe square — nobody can capture you here.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"5,8": {
			label: "Array",
			content: "Array box — a subject that lands here skips ahead, and that study day becomes rest.",
			kind: "array",
			skip: 4,
			sundayTokenId: null,
			sundayColor: null
		},
		"6,12": {
			label: "Gas",
			content: "Firedamp and gas testing. Safe square.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"8,13": {
			label: "Mine",
			content: "Green gate. Shaft, winding, and cage questions.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"12,8": {
			label: "Roof",
			content: "Roof support and rock bolts. Safe square.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"13,6": {
			label: "Rock",
			content: "Red gate. Rock Mechanics paper starts here.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		},
		"8,2": {
			label: "Shot",
			content: "Blasting and explosives. Safe square.",
			kind: "note",
			skip: 0,
			sundayTokenId: null,
			sundayColor: null
		}
	};
}
export function asLudoCell(value: any) {
	if (!value || typeof value !== "object") return null;
	const cell = value;
	const label = String(cell.label ?? "").slice(0, 24);
	const content = String(cell.content ?? "").slice(0, 2e3);
	const kind = asLudoCellKind(cell.kind);
	const skip = Math.min(12, Math.max(0, Number(cell.skip) || 0));
	const sundayTokenId = cell.sundayTokenId ? String(cell.sundayTokenId).slice(0, 64) : null;
	const sundayColor = cell.sundayColor && LUDO_COLORS.includes(cell.sundayColor) ? cell.sundayColor : null;
	if (!label && !content && kind === "note" && !sundayTokenId) return null;
	return {
		label,
		content,
		kind,
		skip,
		sundayTokenId,
		sundayColor
	};
}
export function asLudoCells(raw: any) {
	if (!raw || typeof raw !== "object") return defaultLudoCells();
	const out: Record<string, LudoCellNote> = {};
	for (const [key, value] of Object.entries(raw)) {
		const cell = asLudoCell(value);
		if (!cell) continue;
		out[key] = cell;
	}
	return Object.keys(out).length ? out : defaultLudoCells();
}
export function makeLudoTokens(color: LudoColor, count: number, existing?: LudoToken[]): LudoToken[] {
	const n = Math.min(10, Math.max(4, count));
	const prev = existing ?? [];
	const out = [];
	for (let i = 0; i < n; i++) {
		const old = prev[i];
		out.push(old ? {
			...old,
			stampColor: old.stampColor === "inherit" ? "inherit" : asLudoColor(old.stampColor),
			sundayKey: old.sundayKey ? String(old.sundayKey).slice(0, 12) : null
		} : {
			id: `ludo-${color}-${i + 1}`,
			name: "",
			deckId: null,
			steps: -1,
			dayName: LUDO_DAY_NAMES[i % 7],
			stampColor: "inherit",
			logo: "none",
			sundayKey: null
		});
	}
	return out;
}
export function defaultLudo(): LudoBoard {
	const now = Date.now();
	const seeds = {
		red: [
			{
				name: "Rock Mechanics",
				deckId: "sample-rock-mechanics"
			},
			{
				name: "Mining Law",
				deckId: null
			},
			{
				name: "Overman paper 1",
				deckId: "sample-rock-mechanics"
			},
			{
				name: "Notes sprint",
				deckId: null
			}
		],
		blue: [
			{
				name: "Ventilation",
				deckId: null
			},
			{
				name: "Mine gases",
				deckId: null
			},
			{
				name: "Surveying",
				deckId: null
			},
			{
				name: "First aid",
				deckId: null
			}
		],
		yellow: [
			{
				name: "Safety",
				deckId: null
			},
			{
				name: "Strata control",
				deckId: null
			},
			{
				name: "Legislation",
				deckId: null
			},
			{
				name: "Mine fires",
				deckId: null
			}
		],
		green: [
			{
				name: "Arithmetic",
				deckId: null
			},
			{
				name: "English",
				deckId: null
			},
			{
				name: "Reasoning",
				deckId: null
			},
			{
				name: "GK",
				deckId: null
			}
		]
	};
	return {
		layout: 3,
		startedAt: now,
		examDate: now + 10368e5,
		fastMode: false,
		restDays: [],
		restDates: [],
		playerColor: "red",
		lastTestId: null,
		lastNoteAt: now,
		lastPips: 6,
		lastMoveAt: null,
		cells: defaultLudoCells(),
		turnColor: "red",
		phase: "roll",
		consecutiveSixes: 0,
		extraTurns: 0,
		winner: null,
		pendingCell: null,
		bots: false,
		playerMode: "four",
		activeColors: [...LUDO_COLORS],
		rules: defaultLudoRules(),
		customRules: [],
		challenge: null,
		studentRolls: {},
		columns: LUDO_COLORS.map((color) => ({
			color,
			studentName: color === "red" ? "You" : "",
			tokenCount: 4,
			tokens: makeLudoTokens(color, 4).map((t, i) => {
				const seed = seeds[color][i];
				return seed ? {
					...t,
					...seed,
					logo: "none",
					steps: -1,
					sundayKey: null
				} : t;
			}),
			dailyTarget: 4,
			entryTurn: 6,
			arrowEnabled: true
		}))
	};
}
export function normalizeLudo(raw: unknown): LudoBoard {
	const fallback = defaultLudo();
	if (!raw || typeof raw !== "object") return fallback;
	const b = raw;
	const layout = Number(b.layout);
	if (layout !== 2 && layout !== 3) return {
		...fallback,
		startedAt: b.startedAt == null ? fallback.startedAt : Number(b.startedAt) || null,
		examDate: b.examDate == null ? fallback.examDate : Number(b.examDate) || null,
		fastMode: Boolean(b.fastMode),
		restDays: Array.isArray(b.restDays) ? b.restDays.map((d) => Number(d)).filter((d) => d >= 0 && d <= 6) : fallback.restDays,
		playerColor: asLudoColor(b.playerColor)
	};
	const restDays = Array.isArray(b.restDays) ? b.restDays.map((d) => Number(d)).filter((d) => d >= 0 && d <= 6) : fallback.restDays;
	const byColor = new Map((Array.isArray(b.columns) ? b.columns : []).map((c) => [asLudoColor(c?.color), c]));
	const playerColor = asLudoColor(b.playerColor);
	const playerMode = asPlayerMode(b.playerMode);
	const activeColors = asActiveColors(b.activeColors, playerMode, playerColor);
	const turnColorRaw = asLudoColor(b.turnColor ?? playerColor);
	const turnColor = activeColors.includes(turnColorRaw) ? turnColorRaw : activeColors[0] ?? playerColor;
	return {
		layout: 3,
		startedAt: b.startedAt == null ? null : Number(b.startedAt) || null,
		examDate: b.examDate == null ? null : Number(b.examDate) || null,
		fastMode: Boolean(b.fastMode),
		restDays,
		restDates: asRestDates(b.restDates),
		playerColor,
		lastTestId: b.lastTestId ? String(b.lastTestId) : null,
		lastNoteAt: Number(b.lastNoteAt) || 0,
		lastPips: Math.min(6, Math.max(1, Number(b.lastPips) || 6)),
		lastMoveAt: b.lastMoveAt == null ? null : Number(b.lastMoveAt) || null,
		cells: asLudoCells(b.cells),
		turnColor,
		phase: asLudoPhase(b.phase),
		consecutiveSixes: Math.min(3, Math.max(0, Number(b.consecutiveSixes) || 0)),
		extraTurns: Math.min(6, Math.max(0, Number(b.extraTurns) || 0)),
		winner: b.winner && LUDO_COLORS.includes(b.winner) ? b.winner : null,
		pendingCell: b.pendingCell ? String(b.pendingCell).slice(0, 12) : null,
		bots: false,
		playerMode,
		activeColors,
		rules: asLudoRules(b.rules),
		customRules: asCustomRules(b.customRules),
		challenge: asChallenge(b.challenge),
		studentRolls: asStudentRolls(b.studentRolls),
		columns: LUDO_COLORS.map((color) => {
			const col = byColor.get(color);
			const tokenCount = Math.min(10, Math.max(4, Number(col?.tokenCount) || 4));
			const tokens = makeLudoTokens(color, tokenCount, Array.isArray(col?.tokens) ? col.tokens.map((t) => ({
				id: String(t?.id || `ludo-${color}`),
				name: String(t?.name ?? "").slice(0, 48),
				deckId: t?.deckId ? String(t.deckId) : null,
				steps: Number.isFinite(Number(t?.steps)) ? Math.min(57, Math.max(-1, Number(t.steps))) : -1,
				dayName: String(t?.dayName ?? "").slice(0, 12),
				stampColor: t?.stampColor === "inherit" ? "inherit" : asLudoColor(t?.stampColor),
				logo: asLudoLogo(t?.logo),
				sundayKey: t?.sundayKey ? String(t.sundayKey).slice(0, 12) : null
			})) : void 0);
			return {
				color,
				studentName: String(col?.studentName ?? (color === "red" ? "You" : "")).slice(0, 40),
				tokenCount,
				tokens,
				dailyTarget: Math.min(40, Math.max(1, Number(col?.dailyTarget) || 4)),
				entryTurn: Math.min(6, Math.max(1, Number(col?.entryTurn) || 6)),
				arrowEnabled: col?.arrowEnabled !== false
			};
		})
	};
}

export const DEFAULT_FOCUS_DAYS: FocusWeekday[] = [1, 2, 3, 4, 5, 6];
export const FOCUS_VERSION = "1.2";

export function defaultFocusLimits(settings?: Partial<FocusSettings> | null): FocusLimits {
  const off = Math.max(1, Number(settings?.defaultOffMin) || 10);
  const wait = Math.max(1, Number(settings?.defaultWaitMin) || 10);
  const usage = Math.max(1, Number(settings?.defaultUsageMin) || 60);
  return {
    days: [...DEFAULT_FOCUS_DAYS],
    timerOn: false,
    offTimerMin: off,
    waitMin: wait,
    usageOn: false,
    usageLimitMin: usage,
    periodOn: false,
    periods: [],
    disabled: false,
  };
}

export function defaultFocusSettings(): FocusSettings {
  return {
    defaultOffMin: 10,
    defaultWaitMin: 10,
    defaultUsageMin: 60,
    notifyBeforeClose: true,
    displayRemaining: true,
    notifyUsage: true,
    pinEnabled: false,
    pinHash: "",
    restrictPinned: false,
    audioMessage: true,
    darkTheme: "auto",
    lockEnabled: false,
    modeOn: true,
    shieldOn: false,
    blockAllOn: false,
    accessGrantedAt: 0,
  };
}

export function defaultFocus(): FocusState {
  return {
    apps: [],
    groups: [],
    settings: defaultFocusSettings(),
    usage: [],
    usageSeeded: false,
    sortApps: "created",
    sortGroups: "created",
    session: null,
    lastDayKey: "",
    todayUsed: {},
    waitUntil: {},
  };
}

function asFocusWeekday(raw: unknown): FocusWeekday | null {
  const n = Number(raw);
  return n === 0 || n === 1 || n === 2 || n === 3 || n === 4 || n === 5 || n === 6 ? n : null;
}

function asFocusSort(raw: unknown): FocusSort {
  return raw === "asc" || raw === "desc" ? raw : "created";
}

function asFocusKind(raw: unknown): FocusAppKind {
  return raw === "setpaper" || raw === "custom" ? raw : "catalog";
}

function asFocusTheme(raw: unknown): FocusThemePref {
  return raw === "light" || raw === "dark" ? raw : "auto";
}

function asHm(raw: unknown, fallback: string): string {
  const s = String(raw ?? "").trim();
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return fallback;
  const h = Math.min(23, Math.max(0, Number(m[1])));
  const min = Math.min(59, Math.max(0, Number(m[2])));
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function clampMin(raw: unknown, fallback: number, max = 24 * 60): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(max, Math.round(n));
}

export function normalizeFocusLimits(raw: unknown, settings?: Partial<FocusSettings> | null): FocusLimits {
  const fallback = defaultFocusLimits(settings);
  if (!raw || typeof raw !== "object") return fallback;
  const l = raw as Partial<FocusLimits>;
  const days = Array.isArray(l.days)
    ? (l.days.map(asFocusWeekday).filter((d): d is FocusWeekday => d != null) as FocusWeekday[])
    : fallback.days;
  const periods: FocusPeriod[] = Array.isArray(l.periods)
    ? l.periods
        .filter((p) => p && typeof p === "object")
        .slice(0, 24)
        .map((p, i) => ({
          id: String(p.id ?? `p-${i}`).slice(0, 80),
          start: asHm(p.start, "12:00"),
          end: asHm(p.end, "00:00"),
        }))
    : [];
  return {
    days: days.length ? Array.from(new Set(days)).sort((a, b) => a - b) : [...DEFAULT_FOCUS_DAYS],
    timerOn: Boolean(l.timerOn),
    offTimerMin: clampMin(l.offTimerMin, fallback.offTimerMin),
    waitMin: clampMin(l.waitMin, fallback.waitMin),
    usageOn: Boolean(l.usageOn),
    usageLimitMin: clampMin(l.usageLimitMin, fallback.usageLimitMin),
    periodOn: Boolean(l.periodOn),
    periods,
    disabled: Boolean(l.disabled),
  };
}

export function normalizeFocus(raw: unknown): FocusState {
  const fallback = defaultFocus();
  if (!raw || typeof raw !== "object") return fallback;
  const f = raw as Partial<FocusState>;
  const settingsRaw = (f.settings && typeof f.settings === "object" ? f.settings : {}) as Partial<FocusSettings>;
  const settings: FocusSettings = {
    defaultOffMin: clampMin(settingsRaw.defaultOffMin, 10),
    defaultWaitMin: clampMin(settingsRaw.defaultWaitMin, 10),
    defaultUsageMin: clampMin(settingsRaw.defaultUsageMin, 60),
    notifyBeforeClose: settingsRaw.notifyBeforeClose !== false,
    displayRemaining: settingsRaw.displayRemaining !== false,
    notifyUsage: settingsRaw.notifyUsage !== false,
    pinEnabled: Boolean(settingsRaw.pinEnabled),
    pinHash: String(settingsRaw.pinHash ?? "").slice(0, 128),
    restrictPinned: Boolean(settingsRaw.restrictPinned),
    audioMessage: settingsRaw.audioMessage !== false,
    darkTheme: asFocusTheme(settingsRaw.darkTheme),
    lockEnabled: Boolean(settingsRaw.lockEnabled),
    modeOn: settingsRaw.modeOn !== false,
    shieldOn: Boolean(settingsRaw.shieldOn),
    blockAllOn: Boolean(settingsRaw.blockAllOn),
    accessGrantedAt: Math.max(0, Number(settingsRaw.accessGrantedAt) || 0),
  };
  const apps: FocusApp[] = Array.isArray(f.apps)
    ? f.apps
        .filter((a) => a && a.id && a.name)
        .slice(0, 400)
        .map((a) => ({
          id: String(a.id).slice(0, 80),
          name: String(a.name).slice(0, 60),
          mark: String(a.mark ?? "").slice(0, 2) || String(a.name).slice(0, 2),
          hue: Math.min(359, Math.max(0, Number(a.hue) || 0)),
          kind: asFocusKind(a.kind),
          custom: Boolean(a.custom) || asFocusKind(a.kind) === "custom",
          route: a.route ? String(a.route).slice(0, 80) : null,
          pinned: Boolean(a.pinned),
          createdAt: Number(a.createdAt) || Date.now(),
          limits: normalizeFocusLimits(a.limits, settings),
        }))
    : [];
  const groups: FocusGroup[] = Array.isArray(f.groups)
    ? f.groups
        .filter((g) => g && g.id && g.name)
        .slice(0, 80)
        .map((g) => ({
          id: String(g.id).slice(0, 80),
          name: String(g.name).slice(0, 60),
          appIds: Array.isArray(g.appIds) ? g.appIds.map(String).filter(Boolean).slice(0, 400) : [],
          createdAt: Number(g.createdAt) || Date.now(),
          limits: normalizeFocusLimits(g.limits, settings),
        }))
    : [];
  const usage: FocusUsageEntry[] = Array.isArray(f.usage)
    ? f.usage
        .filter((u) => u && u.appId)
        .slice(0, 4000)
        .map((u, i) => ({
          id: String(u.id ?? `u-${i}`).slice(0, 80),
          appId: String(u.appId).slice(0, 80),
          at: Number(u.at) || 0,
          seconds: Math.max(0, Number(u.seconds) || 0),
        }))
    : [];
  const todayUsed: Record<string, number> = {};
  if (f.todayUsed && typeof f.todayUsed === "object") {
    for (const [id, value] of Object.entries(f.todayUsed)) {
      todayUsed[id] = Math.max(0, Number(value) || 0);
    }
  }
  const waitUntil: Record<string, number> = {};
  if (f.waitUntil && typeof f.waitUntil === "object") {
    for (const [id, value] of Object.entries(f.waitUntil)) {
      const n = Number(value) || 0;
      if (n > 0) waitUntil[id] = n;
    }
  }
  let session: FocusSession | null = null;
  if (f.session && typeof f.session === "object" && f.session.appId) {
    session = {
      appId: String(f.session.appId).slice(0, 80),
      startedAt: Number(f.session.startedAt) || Date.now(),
      lastTick: Number(f.session.lastTick) || Number(f.session.startedAt) || Date.now(),
      plannedMs: Math.max(0, Number(f.session.plannedMs) || 0),
      waiting: Boolean(f.session.waiting),
      waitUntil: f.session.waitUntil == null ? null : Number(f.session.waitUntil) || null,
      warned: Boolean(f.session.warned),
    };
  }
  return {
    apps,
    groups,
    settings,
    usage,
    usageSeeded: Boolean(f.usageSeeded),
    sortApps: asFocusSort(f.sortApps),
    sortGroups: asFocusSort(f.sortGroups),
    session,
    lastDayKey: String(f.lastDayKey ?? ""),
    todayUsed,
    waitUntil,
  };
}
