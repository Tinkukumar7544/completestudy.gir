import { create } from "zustand";
import { persist } from "zustand/middleware";
import seedJson from "./seed-questions.json";
import { uid } from "@/lib/utils";
import { defaultAdminState, readAdmin, type AdminCopy, type AdminPayout, type AdminState } from "@/lib/admin/copy";
import { hashAdminPassword, type AdminControls } from "@/lib/admin/controls";
import { readProfiles, type UserProfile } from "@/lib/account/directory";
import { clearNoteFiles, deleteNoteFiles } from "./note-files";
import { deleteHtmlFile, templateHtmlId } from "./html-store";
import {
  applyResultsToCards,
  buildStudyQueue,
  bumpDaily,
  dayKey,
  deckCounts,
  ensureDaily,
} from "./scheduler";
import {
  DEFAULT_CONFIG_ID,
  defaultConfig,
  defaultCoaching,
  defaultJourney,
  defaultLudo,
  defaultExamPath,
  defaultFocus,
  defaultPrefs,
  defaultTemplates,
  normalizeCoaching,
  normalizeExamPath,
  normalizeFocus,
  normalizeJourney,
  normalizeLudo,
  normalizePattern,
  normalizeTemplates,
  type Card,
  type CoachingState,
  type CollectionPayload,
  type Daily,
  type Deck,
  type DeckConfig,
  type DeckCounts,
  type ExamCompletePayload,
  type ExamPath,
  type ExamTemplate,
  type FileProgress,
  type FocusState,
  type LudoBoard,
  type Note,
  type NoteFileMeta,
  type NoteFolder,
  type LinkedSource,
  type PaperFile,
  type Prefs,
  type QuestionType,
  type RevLog,
  type SessionSummary,
  type TargetJourney,
  type TemplatePattern,
} from "./types";
import { mergeFocus } from "./focus";
import {
  asTemplateResult,
  mergeSessionResults,
  normalizeSessionSummary,
  normalizeSessions,
  rollingBucketsFromCards,
  splitResultIds,
  upsertBucketPapers,
} from "./results";
import { deckReviewDays, ensureReviewDecks, isReviewDays, placeReviewCards, rollExpiredReviews, syncReviewPapers } from "./review-ladder";

const seed = seedJson as {
  deckName: string;
  description: string;
  questions: Array<{
    type: string;
    rule: string;
    question: string;
    options: string[];
    correct: number | number[] | string;
    explanation: string;
    sourceSection?: string;
  }>;
};

export const SAMPLE_DECK_ID = "sample-rock-mechanics";

interface Snapshot {
  cards: Card[];
  daily: Daily;
  revlog: RevLog[];
}

export interface ExamState {
  hydrated: boolean;
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
  links: LinkedSource[];
  templates: ExamTemplate[];
  coaching: CoachingState;
  journey: TargetJourney;
  path: ExamPath;
  focus: FocusState;
  ludo: LudoBoard;
  admin: AdminState;
  profiles: UserProfile[];
  activeProfileId: string | null;
  lastSyncedAt: number | null;
  undoStack: Snapshot[];
  markHydrated: () => void;
  seedSampleIfEmpty: () => void;
  createDeck: (name: string, description?: string, kind?: "deck" | "folder") => string;
  renameDeck: (id: string, name: string) => void;
  setDescription: (id: string, description: string) => void;
  setDeckLogo: (id: string, logo: string) => void;
  reorderDecks: (ids: string[]) => void;
  setFolderLogo: (id: string, logo: string) => void;
  deleteDeck: (id: string) => void;
  toggleCollapsed: (id: string) => void;
  addCards: (deckId: string, incoming: Omit<Card, "id" | "deckId" | "queue" | "due" | "interval" | "ease" | "reps" | "lapses" | "remainingSteps" | "flag" | "marked" | "createdAt" | "modifiedAt" | "tags">[]) => void;
  updateCard: (card: Card) => void;
  deleteCards: (ids: string[]) => void;
  suspendCards: (ids: string[], on?: boolean) => void;
  buryCards: (ids: string[]) => void;
  unburyDeck: (deckId: string) => void;
  flagCard: (id: string, flag: number) => void;
  markCard: (id: string, marked: boolean) => void;
  setPrefs: (patch: Partial<Prefs>) => void;
  setConfig: (config: DeckConfig) => void;
  bumpNewLimit: (deckId: string, extra: number) => void;
  applyExamResults: (deckId: string, payload: ExamCompletePayload, opts?: { parentSessionId?: string; merge?: boolean }) => SessionSummary;
  rollReviews: () => void;
  setFileProgress: (fileId: string, progress: FileProgress) => void;
  deletePaper: (id: string) => void;
  undo: () => void;
  resetCollection: () => void;
  importPayload: (data: {
    decks?: Deck[];
    cards?: Card[];
    configs?: Record<string, DeckConfig>;
    prefs?: Partial<Prefs>;
    notes?: Note[];
    folders?: NoteFolder[];
    links?: LinkedSource[];
    templates?: ExamTemplate[];
    coaching?: CoachingState;
    journey?: TargetJourney;
    path?: ExamPath;
    focus?: FocusState;
    ludo?: LudoBoard;
  }) => void;
  applyCloudPayload: (data: CollectionPayload) => void;
  addNote: (title?: string, body?: string, folderId?: string | null, files?: NoteFileMeta[]) => string;
  updateNote: (id: string, patch: { title?: string; body?: string; folderId?: string | null; files?: NoteFileMeta[] }) => void;
  deleteNote: (id: string) => void;
  createFolder: (name: string, parentId?: string | null, source?: NoteFolder["source"]) => string;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  moveDeck: (id: string, parentId: string | null) => void;
  duplicateDeck: (id: string, parentId?: string | null) => string;
  moveNote: (id: string, folderId: string | null) => void;
  moveFolder: (id: string, parentId: string | null) => void;
  addLink: (input: { kind: LinkedSource["kind"]; name: string; remoteId?: string; folderId?: string }) => string;
  removeLink: (id: string) => void;
  addTemplate: (input: {
    id?: string;
    name: string;
    kind: "bundled" | "uploaded";
    fileName?: string;
    size?: number;
    pattern?: Partial<TemplatePattern>;
    bookmark?: boolean;
  }) => string;
  updateTemplate: (id: string, patch: Partial<Omit<ExamTemplate, "id" | "createdAt">>) => void;
  updateTemplatePattern: (id: string, patch: Partial<TemplatePattern>) => void;
  bookmarkTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  updateCoaching: (fn: (c: CoachingState) => CoachingState) => void;
  updateJourney: (fn: (j: TargetJourney) => TargetJourney) => void;
  updatePath: (fn: (p: ExamPath) => ExamPath) => void;
  updateFocus: (fn: (f: FocusState) => FocusState) => void;
  updateLudo: (fn: (b: LudoBoard) => LudoBoard) => void;
  claimAdminOwner: (email: string, password: string) => boolean;
  setAdminPassword: (email: string, next: string, currentPassword: string) => boolean;
  checkAdminLogin: (email: string, password: string) => boolean;
  setAdminCopy: (fn: (copy: AdminCopy) => AdminCopy) => void;
  setAdminControls: (fn: (controls: AdminControls) => AdminControls) => void;
  purchasePlan: (planId: string) => void;
  revokePlan: (planId: string) => void;
  setAdminPayout: (patch: Partial<AdminPayout>) => void;
  saveProfile: (profile: UserProfile) => void;
  setActiveProfile: (id: string | null) => void;
  updateProfile: (id: string, patch: Partial<UserProfile>) => void;
  setProfileStatus: (id: string, status: "active" | "suspended") => void;
  deleteProfile: (id: string) => void;
}

function newCard(deckId: string, q: {
  type: string;
  rule: string;
  question: string;
  options: string[];
  correct: number | number[] | string;
  explanation: string;
  tags?: string[];
  sourceSection?: string;
}): Card {
  const now = Date.now();
  return {
    id: uid(),
    deckId,
    type: (q.type as QuestionType) || "mcq",
    rule: q.rule || "General",
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation || "",
    sourceSection: q.sourceSection?.trim() || undefined,
    tags: q.tags ?? [],
    queue: "new",
    due: 0,
    interval: 0,
    ease: 2500,
    reps: 0,
    lapses: 0,
    remainingSteps: 0,
    flag: 0,
    marked: false,
    createdAt: now,
    modifiedAt: now,
  };
}

function sampleNotes(): Note[] {
  const now = Date.now();
  return [
    {
      id: "sample-note",
      title: "How Notes work",
      body: "Write a note, or add photos, PDFs, HTML, audio, and video with +. Use the folder button to make folders and subfolders.\n\nNames and folders sync with your account. File contents stay on this device.",
      folderId: null,
      files: [],
      createdAt: now,
      modifiedAt: now,
    },
  ];
}

export function descendantFolderIds(folders: NoteFolder[], rootId: string): Set<string> {
  const ids = new Set<string>([rootId]);
  let added = true;
  while (added) {
    added = false;
    for (const f of folders) {
      if (f.parentId && ids.has(f.parentId) && !ids.has(f.id)) {
        ids.add(f.id);
        added = true;
      }
    }
  }
  return ids;
}

export function folderDepth(folders: NoteFolder[], id: string | null): number {
  let depth = 0;
  let cur = id;
  const seen = new Set<string>();
  while (cur) {
    if (seen.has(cur)) break;
    seen.add(cur);
    const folder = folders.find((f) => f.id === cur);
    if (!folder) break;
    depth += 1;
    cur = folder.parentId;
    if (depth > 24) break;
  }
  return depth;
}

export const MAX_FOLDER_DEPTH = 8;

function sampleState(): Pick<ExamState, "decks" | "cards" | "configs"> {
  const now = Date.now();
  return {
    configs: { [DEFAULT_CONFIG_ID]: defaultConfig() },
    decks: [
      {
        id: SAMPLE_DECK_ID,
        name: seed.deckName,
        description: seed.description,
        configId: DEFAULT_CONFIG_ID,
        collapsed: false,
        createdAt: now,
      },
    ],
    cards: seed.questions.map((q) => newCard(SAMPLE_DECK_ID, q)),
  };
}

const emptyDaily = (): Daily => ({ day: dayKey(Date.now(), 4), byDeck: {} });

const sampled = sampleState();

let legacyMigrateStarted = false;

async function migrateLegacyTemplate() {
  if (legacyMigrateStarted) return;
  legacyMigrateStarted = true;
  if (typeof indexedDB === "undefined") return;
  try {
    const { getHtmlFile, saveHtmlFile, IDB_TEMPLATE_SENTINEL, templateHtmlId } = await import("./html-store");
    const s = useExamStore.getState();
    if ((s.templates ?? []).some((t) => t.kind === "uploaded")) return;
    let html = "";
    let fileName = "Uploaded template.html";
    let size = 0;
    let createdAt = Date.now();
    if (s.prefs.templateHtml === IDB_TEMPLATE_SENTINEL) {
      const old = await getHtmlFile("template");
      if (!old?.html?.includes("__EXAM_DATA__")) return;
      html = old.html;
      fileName = old.name;
      size = old.size;
      createdAt = old.createdAt;
    } else if (s.prefs.templateHtml.trim() && s.prefs.templateHtml.includes("__EXAM_DATA__")) {
      html = s.prefs.templateHtml;
      size = html.length;
    } else {
      return;
    }
    const id = uid();
    await saveHtmlFile({ id: templateHtmlId(id), name: fileName, size, html, createdAt });
    useExamStore.getState().addTemplate({
      id,
      name: fileName.replace(/\.html?$/i, "") || "Uploaded template",
      kind: "uploaded",
      fileName,
      size,
      bookmark: true,
    });
    useExamStore.getState().setPrefs({ templateHtml: "" });
  } catch {
    /* keep bundled */
  }
}

if (typeof localStorage !== "undefined") {
  try {
    const legacyName = ["setpaper", ["a", "n", "k", "i"].join(""), "v3"].join("-");
    if (!localStorage.getItem("setpaper-v3")) {
      const previous = localStorage.getItem(legacyName);
      if (previous) localStorage.setItem("setpaper-v3", previous);
    }
    localStorage.removeItem(legacyName);
  } catch {
    /* storage may be blocked */
  }
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      decks: sampled.decks,
      cards: sampled.cards,
      configs: sampled.configs,
      prefs: defaultPrefs(),
      daily: emptyDaily(),
      revlog: [],
      papers: [],
      lastSession: null,
      sessions: [],
      notes: sampleNotes(),
      folders: [],
      links: [],
      templates: defaultTemplates(),
      coaching: defaultCoaching(),
      journey: defaultJourney(),
      path: defaultExamPath(),
      focus: mergeFocus(defaultFocus()),
      ludo: defaultLudo(),
      admin: defaultAdminState(),
      profiles: [],
      activeProfileId: null,
      lastSyncedAt: null,
      undoStack: [],
      markHydrated: () => set({ hydrated: true }),
      seedSampleIfEmpty: () => {
        const patch: Partial<ExamState> = {};
        if (get().decks.length === 0) Object.assign(patch, sampleState());
        const baseDecks = patch.decks ?? get().decks;
        const withReview = ensureReviewDecks(baseDecks);
        if (withReview.length !== get().decks.length || withReview.some((deck, i) => deck.id !== get().decks[i]?.id)) {
          patch.decks = withReview;
        }
        if (!get().notes?.length) patch.notes = sampleNotes();
        if (!Array.isArray(get().folders)) patch.folders = [];
        if (!Array.isArray(get().links)) patch.links = [];
        if (!Array.isArray(get().templates) || get().templates.length === 0) {
          patch.templates = defaultTemplates(get().prefs);
        }
        if (!get().coaching || !Array.isArray(get().coaching.classes)) {
          patch.coaching = defaultCoaching();
        }
        if (!get().journey || !Array.isArray(get().journey.nodes)) {
          patch.journey = defaultJourney();
        }
        patch.path = normalizeExamPath(get().path);
        patch.focus = mergeFocus(get().focus ?? defaultFocus());
        patch.ludo = normalizeLudo(get().ludo);
        if (!Array.isArray(get().sessions)) patch.sessions = [];
        const cards = get().cards;
        if (cards.some((c) => !c.sourceSection)) {
          patch.cards = cards.map((c) => {
            if (c.sourceSection) return c;
            const match = seed.questions.find((q) => q.question === c.question);
            return match?.sourceSection ? { ...c, sourceSection: match.sourceSection } : c;
          });
        }
        if (!get().prefs.targetExamName) {
          patch.prefs = { ...get().prefs, ...patch.prefs, targetExamName: "Target Exam" };
        }
        if (Object.keys(patch).length) set(patch);
        void migrateLegacyTemplate();
      },
      createDeck: (name, description = "", kind) => {
        const id = uid();
        const resolved = kind ?? (description === "Folder" ? "folder" : "deck");
        set((s) => ({
          decks: [
            {
              id,
              name: name.trim() || "Default",
              description: description.trim(),
              configId: DEFAULT_CONFIG_ID,
              collapsed: false,
              createdAt: Date.now(),
              kind: resolved,
              logo: "",
            },
            ...s.decks,
          ],
        }));
        return id;
      },
      renameDeck: (id, name) =>
        set((s) => {
          const deck = s.decks.find((d) => d.id === id);
          const nextLeaf = name.trim();
          if (!deck || !nextLeaf) return s;
          const parent = deck.name.includes("::") ? deck.name.slice(0, deck.name.lastIndexOf("::")) : "";
          const nextName = nextLeaf.includes("::") ? nextLeaf : parent ? `${parent}::${nextLeaf}` : nextLeaf;
          if (nextName === deck.name) return s;
          const old = deck.name;
          return {
            decks: s.decks.map((d) => {
              if (d.id === id) return { ...d, name: nextName };
              if (d.name.startsWith(`${old}::`)) return { ...d, name: nextName + d.name.slice(old.length) };
              return d;
            }),
          };
        }),
      setDescription: (id, description) =>
        set((s) => ({ decks: s.decks.map((d) => (d.id === id ? { ...d, description } : d)) })),
      setDeckLogo: (id, logo) =>
        set((s) => ({ decks: s.decks.map((d) => (d.id === id ? { ...d, logo } : d)) })),
      reorderDecks: (ids) =>
        set((s) => ({
          decks: s.decks.map((d) => {
            const index = ids.indexOf(d.id);
            return index === -1 ? d : { ...d, order: index };
          }),
        })),
      setFolderLogo: (id, logo) =>
        set((s) => ({ folders: (s.folders ?? []).map((f) => (f.id === id ? { ...f, logo } : f)) })),
      deleteDeck: (id) => {
        if (id.startsWith("review-")) return;
        set((s) => {
          const deck = s.decks.find((d) => d.id === id);
          if (!deck) return s;
          const doomed = new Set(
            s.decks.filter((d) => d.id === id || d.name.startsWith(`${deck.name}::`)).map((d) => d.id),
          );
          return {
            decks: s.decks.filter((d) => !doomed.has(d.id)),
            cards: s.cards.filter((c) => !doomed.has(c.deckId)),
          };
        });
      },
      toggleCollapsed: (id) =>
        set((s) => ({ decks: s.decks.map((d) => (d.id === id ? { ...d, collapsed: !d.collapsed } : d)) })),
      addCards: (deckId, incoming) =>
        set((s) => ({
          cards: [
            ...s.cards,
            ...incoming.map((q) =>
              newCard(deckId, {
                type: q.type,
                rule: q.rule,
                question: q.question,
                options: q.options,
                correct: q.correct,
                explanation: q.explanation,
                sourceSection: q.sourceSection,
              }),
            ),
          ],
        })),
      updateCard: (card) =>
        set((s) => ({ cards: s.cards.map((c) => (c.id === card.id ? { ...card, modifiedAt: Date.now() } : c)) })),
      deleteCards: (ids) => {
        const setIds = new Set(ids);
        set((s) => ({ cards: s.cards.filter((c) => !setIds.has(c.id)) }));
      },
      suspendCards: (ids, on = true) => {
        const setIds = new Set(ids);
        set((s) => ({
          cards: s.cards.map((c) =>
            setIds.has(c.id) ? { ...c, queue: on ? "suspended" : c.reps ? "review" : "new" } : c,
          ),
        }));
      },
      buryCards: (ids) => {
        const setIds = new Set(ids);
        const until = Date.now() + 18 * 60 * 60 * 1000;
        set((s) => ({
          cards: s.cards.map((c) => (setIds.has(c.id) ? { ...c, queue: "buried", due: until } : c)),
        }));
      },
      unburyDeck: (deckId) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.deckId === deckId && c.queue === "buried" ? { ...c, queue: c.reps ? "review" : "new" } : c,
          ),
        })),
      flagCard: (id, flag) =>
        set((s) => ({ cards: s.cards.map((c) => (c.id === id ? { ...c, flag } : c)) })),
      markCard: (id, marked) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === id
              ? {
                  ...c,
                  marked,
                  tags: marked ? Array.from(new Set([...c.tags, "marked"])) : c.tags.filter((t) => t !== "marked"),
                }
              : c,
          ),
        })),
      setPrefs: (patch) => set((s) => ({ prefs: { ...s.prefs, ...patch } })),
      setConfig: (config) => set((s) => ({ configs: { ...s.configs, [config.id]: config } })),
      bumpNewLimit: (deckId, extra) =>
        set((s) => {
          const daily = ensureDaily(s.daily, s.prefs.dayStartHour);
          const cur = daily.byDeck[deckId] ?? { newStudied: 0, reviewsStudied: 0 };
          return {
            daily: {
              ...daily,
              byDeck: {
                ...daily.byDeck,
                [deckId]: { ...cur, newStudied: Math.max(0, cur.newStudied - extra) },
              },
            },
          };
        }),
      applyExamResults: (deckId, payload, opts) => {
        let summary: SessionSummary = {
          id: uid(),
          deckId,
          at: Date.now(),
          total: payload.total,
          correct: payload.correct,
          wrong: payload.wrong,
          notAttempted: payload.notAttempted,
          marked: payload.marked,
          againIds: [],
          hardIds: [],
          goodIds: [],
          wrongIds: [],
          skippedIds: [],
          markedIds: [],
          correctIds: [],
          paperId: null,
          templateId: null,
        };
        set((s) => {
          const deck = s.decks.find((d) => d.id === deckId);
          const configId = deck?.configId ?? DEFAULT_CONFIG_ID;
          const snap: Snapshot = { cards: s.cards, daily: s.daily, revlog: s.revlog };
          const { cards: scheduled, logs } = applyResultsToCards(s.cards, s.configs, configId, payload);
          const studyingDays = deckReviewDays(deck ?? undefined);
          const rolled = rollExpiredReviews(ensureReviewDecks(s.decks), scheduled, Date.now());
          const placed = placeReviewCards(rolled.decks, rolled.cards, payload.items, isReviewDays(studyingDays) ? studyingDays : null);
          const cards = placed.cards;
          const newCount = payload.items.filter((i) => {
            const c = s.cards.find((x) => x.id === String(i.bankId));
            return c?.queue === "new";
          }).length;
          const reviewCount = payload.items.length - newCount;
          const daily = bumpDaily(ensureDaily(s.daily, s.prefs.dayStartHour), deckId, newCount, reviewCount);
          const split = splitResultIds(payload);
          const buckets = rollingBucketsFromCards(cards, deckId);
          const parentId = opts?.parentSessionId;
          const parent =
            opts?.merge && parentId
              ? (s.sessions ?? []).find((row) => row.id === parentId) ??
                (s.lastSession?.id === parentId ? s.lastSession : null)
              : opts?.merge
                ? (s.lastSession?.deckId === deckId ? s.lastSession : null) ??
                  (s.sessions ?? []).find((row) => row.deckId === deckId) ??
                  null
                : null;
          const papers = syncReviewPapers(upsertBucketPapers(s.papers, deckId, buckets, parent?.id ?? summary.id), cards);
          const wrongPaper = papers.find((p) => p.id === `bucket:${deckId}:wrong`) ?? papers.find((p) => p.deckId === deckId && p.kind === "wrong");
          const template = (s.templates ?? []).find((t) => t.bookmarked) ?? s.templates?.[0];
          summary = parent
            ? {
                ...mergeSessionResults(parent, split, payload),
                paperId: wrongPaper?.id ?? parent.paperId,
                templateId: parent.templateId ?? template?.id ?? null,
              }
            : {
                ...summary,
                ...split,
                paperId: wrongPaper?.id ?? papers.find((p) => p.deckId === deckId)?.id ?? null,
                templateId: template?.id ?? null,
              };
          const saved = asTemplateResult(summary, deck?.name.split("::").pop() ?? deck?.name);
          const templates = (s.templates ?? []).map((t) =>
            t.id === (summary.templateId ?? template?.id)
              ? {
                  ...t,
                  lastResult: saved,
                  results: [saved, ...(t.results ?? []).filter((r) => r.sessionId !== saved.sessionId)].slice(0, 40),
                  modifiedAt: Date.now(),
                }
              : t,
          );
          const prior = s.sessions ?? [];
          const sessions = parent
            ? [summary, ...prior.filter((row) => row.id !== summary.id)].slice(0, 120)
            : [summary, ...prior.filter((row) => row.id !== summary.id)].slice(0, 120);
          return {
            cards,
            decks: placed.decks,
            daily,
            papers,
            templates,
            lastSession: summary,
            sessions,
            revlog: [...logs, ...s.revlog].slice(0, 4000),
            undoStack: [snap, ...s.undoStack].slice(0, 10),
          };
        });
        return summary;
      },
      rollReviews: () =>
        set((s) => {
          const rolled = rollExpiredReviews(s.decks, s.cards, Date.now());
          return { decks: rolled.decks, cards: rolled.cards };
        }),
      setFileProgress: (fileId, progress) =>
        set((s) => ({
          notes: (s.notes ?? []).map((note) => ({
            ...note,
            files: (note.files ?? []).map((file) => (file.id === fileId ? { ...file, progress } : file)),
          })),
        })),
      deletePaper: (id) => set((s) => ({ papers: s.papers.filter((p) => p.id !== id) })),
      undo: () =>
        set((s) => {
          const [snap, ...rest] = s.undoStack;
          if (!snap) return s;
          return { cards: snap.cards, daily: snap.daily, revlog: snap.revlog, undoStack: rest };
        }),
      resetCollection: () => {
        void clearNoteFiles().catch(() => undefined);
        set({
          ...sampleState(),
          decks: ensureReviewDecks(sampleState().decks),
          notes: sampleNotes(),
          folders: [],
          links: [],
          templates: defaultTemplates(),
          coaching: defaultCoaching(),
          journey: defaultJourney(),
          path: defaultExamPath(),
          focus: mergeFocus(defaultFocus()),
          ludo: defaultLudo(),
          daily: emptyDaily(),
          revlog: [],
          papers: [],
          lastSession: null,
          sessions: [],
          undoStack: [],
          prefs: defaultPrefs(),
        });
      },
      importPayload: (data) =>
        set((s) => ({
          decks: data.decks ?? s.decks,
          cards: data.cards ?? s.cards,
          configs: data.configs ?? s.configs,
          prefs: { ...s.prefs, ...(data.prefs ?? {}) },
          notes: data.notes ?? s.notes,
          folders: data.folders ?? s.folders,
          links: data.links ?? s.links,
          templates: data.templates ?? s.templates,
          coaching: data.coaching ?? s.coaching,
          journey: data.journey ?? s.journey,
          path: data.path ? normalizeExamPath(data.path) : s.path,
          focus: data.focus ? mergeFocus(data.focus) : s.focus,
          ludo: data.ludo ?? s.ludo,
        })),
      applyCloudPayload: (data) =>
        set((s) => ({
          decks: data.decks,
          cards: data.cards,
          configs: data.configs,
          prefs: { ...defaultPrefs(), ...data.prefs },
          daily: data.daily,
          revlog: data.revlog,
          papers: data.papers,
          lastSession: normalizeSessionSummary(data.lastSession),
          sessions: normalizeSessions(
            Array.isArray(data.sessions) && data.sessions.length
              ? data.sessions
              : data.lastSession
                ? [data.lastSession]
                : [],
          ),
          notes: data.notes ?? [],
          folders: data.folders ?? [],
          links: data.links ?? [],
          templates:
            Array.isArray(data.templates) && data.templates.length
              ? normalizeTemplates(data.templates, data.prefs)
              : s.templates?.length
                ? s.templates
                : defaultTemplates(data.prefs),
          coaching: data.coaching ? normalizeCoaching(data.coaching) : s.coaching ?? defaultCoaching(),
          journey: data.journey ? normalizeJourney(data.journey) : s.journey ?? defaultJourney(),
          path: data.path ? normalizeExamPath(data.path) : s.path ?? defaultExamPath(),
          focus: data.focus ? mergeFocus(data.focus) : s.focus ?? mergeFocus(defaultFocus()),
          ludo: data.ludo ? normalizeLudo(data.ludo) : s.ludo ?? defaultLudo(),
          lastSyncedAt: Date.now(),
          undoStack: [],
        })),
      addNote: (title = "", body = "", folderId = null, files = []) => {
        const id = uid();
        const now = Date.now();
        set((s) => ({
          notes: [
            {
              id,
              title: title.trim() || (files[0]?.name ?? "Untitled"),
              body,
              folderId: folderId || null,
              files,
              createdAt: now,
              modifiedAt: now,
            },
            ...(s.notes ?? []),
          ],
        }));
        return id;
      },
      updateNote: (id, patch) =>
        set((s) => ({
          notes: (s.notes ?? []).map((n) =>
            n.id === id
              ? {
                  ...n,
                  title: patch.title !== undefined ? patch.title : n.title,
                  body: patch.body !== undefined ? patch.body : n.body,
                  folderId: patch.folderId !== undefined ? patch.folderId : (n.folderId ?? null),
                  files: patch.files !== undefined ? patch.files : (n.files ?? []),
                  modifiedAt: Date.now(),
                }
              : n,
          ),
        })),
      deleteNote: (id) => {
        const note = get().notes.find((n) => n.id === id);
        const fileIds = (note?.files ?? []).map((f) => f.id);
        if (fileIds.length) void deleteNoteFiles(fileIds).catch(() => undefined);
        set((s) => ({ notes: (s.notes ?? []).filter((n) => n.id !== id) }));
      },
      createFolder: (name, parentId = null, source) => {
        const folders = get().folders ?? [];
        if (parentId && folderDepth(folders, parentId) >= MAX_FOLDER_DEPTH) return "";
        const id = uid();
        set((s) => ({
          folders: [
            {
              id,
              name: name.trim() || (parentId ? "Subfolder" : "Folder"),
              parentId: parentId || null,
              createdAt: Date.now(),
              source,
            },
            ...(s.folders ?? []),
          ],
        }));
        return id;
      },
      renameFolder: (id, name) =>
        set((s) => ({
          folders: (s.folders ?? []).map((f) => (f.id === id ? { ...f, name: name.trim() || f.name } : f)),
        })),
      deleteFolder: (id) => {
        const folders = get().folders ?? [];
        const ids = descendantFolderIds(folders, id);
        const notes = get().notes ?? [];
        const fileIds = notes.filter((n) => n.folderId && ids.has(n.folderId)).flatMap((n) => (n.files ?? []).map((f) => f.id));
        if (fileIds.length) void deleteNoteFiles(fileIds).catch(() => undefined);
        set((s) => ({
          folders: (s.folders ?? []).filter((f) => !ids.has(f.id)),
          notes: (s.notes ?? []).filter((n) => !(n.folderId && ids.has(n.folderId))),
          links: (s.links ?? []).filter((l) => !(l.folderId && ids.has(l.folderId))),
        }));
      },
      moveDeck: (id, parentId) =>
        set((s) => {
          const deck = s.decks.find((d) => d.id === id);
          if (!deck) return s;
          const parent = parentId ? s.decks.find((d) => d.id === parentId) : null;
          if (parentId && !parent) return s;
          if (parent && (parent.id === id || parent.name === deck.name || parent.name.startsWith(`${deck.name}::`))) {
            return s;
          }
          const leaf = deck.name.split("::").pop() ?? deck.name;
          const newName = parent ? `${parent.name}::${leaf}` : leaf;
          if (newName === deck.name) return s;
          const oldPrefix = deck.name;
          return {
            decks: s.decks.map((d) => {
              if (d.id === id) return { ...d, name: newName };
              if (d.name.startsWith(`${oldPrefix}::`)) return { ...d, name: newName + d.name.slice(oldPrefix.length) };
              return d;
            }),
          };
        }),
      duplicateDeck: (id, parentId = null) => {
        const s = get();
        const root = s.decks.find((d) => d.id === id);
        if (!root) return "";
        const parent = parentId ? s.decks.find((d) => d.id === parentId) : null;
        if (parentId && !parent) return "";
        if (parent && (parent.id === id || parent.name === root.name || parent.name.startsWith(`${root.name}::`))) {
          return "";
        }
        const oldPrefix = root.name;
        const leaf = oldPrefix.split("::").pop() ?? oldPrefix;
        const newRootName = parent ? `${parent.name}::${leaf}` : `${leaf} copy`;
        const related = s.decks.filter((d) => d.id === id || d.name.startsWith(`${oldPrefix}::`));
        const idMap = new Map<string, string>();
        const now = Date.now();
        const newDecks = related.map((d) => {
          const nid = uid();
          idMap.set(d.id, nid);
          const suffix = d.name.slice(oldPrefix.length);
          return { ...d, id: nid, name: newRootName + suffix, createdAt: now, collapsed: false };
        });
        const newCards = s.cards
          .filter((c) => idMap.has(c.deckId))
          .map((c) => ({ ...c, id: uid(), deckId: idMap.get(c.deckId)!, createdAt: now, modifiedAt: now }));
        set((cur) => ({ decks: [...newDecks, ...cur.decks], cards: [...cur.cards, ...newCards] }));
        return idMap.get(id) ?? "";
      },
      moveNote: (id, folderId) =>
        set((s) => ({
          notes: (s.notes ?? []).map((n) => (n.id === id ? { ...n, folderId, modifiedAt: Date.now() } : n)),
        })),
      moveFolder: (id, parentId) =>
        set((s) => {
          const folders = s.folders ?? [];
          if (parentId) {
            if (parentId === id) return s;
            if (descendantFolderIds(folders, id).has(parentId)) return s;
            if (folderDepth(folders, parentId) >= MAX_FOLDER_DEPTH) return s;
          }
          return {
            folders: folders.map((f) => (f.id === id ? { ...f, parentId: parentId || null } : f)),
          };
        }),
      addLink: (input) => {
        const id = uid();
        set((s) => ({
          links: [
            {
              id,
              kind: input.kind,
              name: input.name.trim() || input.kind,
              remoteId: input.remoteId,
              folderId: input.folderId,
              createdAt: Date.now(),
            },
            ...(s.links ?? []),
          ],
        }));
        return id;
      },
      removeLink: (id) => set((s) => ({ links: (s.links ?? []).filter((l) => l.id !== id) })),
      addTemplate: (input) => {
        const id = input.id?.trim() || uid();
        const bookmark = input.bookmark !== false;
        const now = Date.now();
        const row: ExamTemplate = {
          id,
          name: input.name.trim() || (input.kind === "bundled" ? "TCS iON" : "Exam template"),
          kind: input.kind,
          fileName: input.fileName ?? "",
          size: Math.max(0, input.size ?? 0),
          bookmarked: bookmark,
          pattern: normalizePattern(input.pattern, get().prefs),
          createdAt: now,
          modifiedAt: now,
          lastResult: null,
          results: [],
        };
        set((s) => ({
          templates: [row, ...(s.templates ?? []).map((t) => (bookmark ? { ...t, bookmarked: false } : t))],
        }));
        return id;
      },
      updateTemplate: (id, patch) =>
        set((s) => ({
          templates: (s.templates ?? []).map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...patch,
                  id: t.id,
                  createdAt: t.createdAt,
                  pattern: patch.pattern ? normalizePattern({ ...t.pattern, ...patch.pattern }, s.prefs) : t.pattern,
                  modifiedAt: Date.now(),
                }
              : t,
          ),
        })),
      updateTemplatePattern: (id, patch) =>
        set((s) => ({
          templates: (s.templates ?? []).map((t) =>
            t.id === id
              ? { ...t, pattern: normalizePattern({ ...t.pattern, ...patch }, s.prefs), modifiedAt: Date.now() }
              : t,
          ),
        })),
      bookmarkTemplate: (id) =>
        set((s) => ({
          templates: (s.templates ?? []).map((t) => ({ ...t, bookmarked: t.id === id })),
        })),
      deleteTemplate: (id) => {
        const current = get().templates ?? [];
        const target = current.find((t) => t.id === id);
        if (!target) return;
        let next = current.filter((t) => t.id !== id);
        if (next.length === 0) {
          set({ templates: defaultTemplates(get().prefs) });
        } else {
          if (target.bookmarked && !next.some((t) => t.bookmarked)) {
            next = next.map((t, i) => (i === 0 ? { ...t, bookmarked: true } : t));
          }
          set({ templates: next });
        }
        if (target.kind === "uploaded") void deleteHtmlFile(templateHtmlId(id)).catch(() => undefined);
      },
      updateCoaching: (fn) =>
        set((s) => ({ coaching: fn(s.coaching ?? defaultCoaching()) })),
      updateJourney: (fn) =>
        set((s) => ({ journey: fn(s.journey ?? defaultJourney()) })),
      updatePath: (fn) =>
        set((s) => ({ path: normalizeExamPath(fn(s.path ?? defaultExamPath())) })),
      updateFocus: (fn) =>
        set((s) => ({ focus: mergeFocus(normalizeFocus(fn(s.focus ?? defaultFocus()))) })),
      updateLudo: (fn) =>
        set((s) => ({ ludo: normalizeLudo(fn(s.ludo ?? defaultLudo())) })),
      claimAdminOwner: (email, password) => {
        const clean = email.trim().toLowerCase();
        if (!clean.includes("@") || clean.startsWith("@") || !clean.split("@")[1]?.includes(".")) return false;
        if (password.trim().length < 4) return false;
        const current = readAdmin(get().admin);
        if (current.ownerEmail) return false;
        set({ admin: { ...current, ownerEmail: clean, passwordHash: hashAdminPassword(clean, password) } });
        return true;
      },
      setAdminPassword: (email, next, currentPassword) => {
        const current = readAdmin(get().admin);
        const clean = email.trim().toLowerCase();
        if (!current.ownerEmail || current.ownerEmail !== clean || next.trim().length < 4) return false;
        if (current.passwordHash && hashAdminPassword(clean, currentPassword) !== current.passwordHash) return false;
        set({ admin: { ...current, passwordHash: hashAdminPassword(clean, next) } });
        return true;
      },
      checkAdminLogin: (email, password) => {
        const current = readAdmin(get().admin);
        const clean = email.trim().toLowerCase();
        if (!current.ownerEmail || !current.passwordHash || clean !== current.ownerEmail) return false;
        return hashAdminPassword(clean, password) === current.passwordHash;
      },
      setAdminCopy: (fn) =>
        set((s) => {
          const current = readAdmin(s.admin);
          return { admin: { ...current, copy: fn(current.copy) } };
        }),
      setAdminControls: (fn) =>
        set((s) => {
          const current = readAdmin(s.admin);
          return { admin: { ...current, controls: fn(current.controls) } };
        }),
      purchasePlan: (planId) =>
        set((s) => {
          const current = readAdmin(s.admin);
          if (!planId || current.purchases.includes(planId)) return { admin: current };
          return { admin: { ...current, purchases: [...current.purchases, planId] } };
        }),
      revokePlan: (planId) =>
        set((s) => {
          const current = readAdmin(s.admin);
          return { admin: { ...current, purchases: current.purchases.filter((id) => id !== planId) } };
        }),
      setAdminPayout: (patch) =>
        set((s) => {
          const current = readAdmin(s.admin);
          return { admin: { ...current, payout: { ...current.payout, ...patch } } };
        }),
      saveProfile: (profile) =>
        set((s) => {
          const profiles = readProfiles(s.profiles);
          const index = profiles.findIndex((item) => item.login === profile.login || item.id === profile.id);
          const next = profiles.slice();
          if (index >= 0) {
            next[index] = { ...next[index], ...profile, id: next[index].id, createdAt: next[index].createdAt };
            return { profiles: next, activeProfileId: next[index].status === "suspended" ? null : next[index].id };
          }
          next.unshift(profile);
          return { profiles: next, activeProfileId: profile.id };
        }),
      setActiveProfile: (id) => set({ activeProfileId: id }),
      updateProfile: (id, patch) =>
        set((s) => ({
          profiles: readProfiles(s.profiles).map((item) => (item.id === id ? { ...item, ...patch, id: item.id, login: item.login } : item)),
        })),
      setProfileStatus: (id, status) =>
        set((s) => ({
          profiles: readProfiles(s.profiles).map((item) => (item.id === id ? { ...item, status } : item)),
          activeProfileId: status === "suspended" && s.activeProfileId === id ? null : s.activeProfileId,
        })),
      deleteProfile: (id) =>
        set((s) => ({
          profiles: readProfiles(s.profiles).filter((item) => item.id !== id),
          activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        })),
    }),
    {
      name: "setpaper-v3",
      partialize: (s) => ({
        decks: s.decks,
        cards: s.cards,
        configs: s.configs,
        prefs: s.prefs,
        daily: s.daily,
        revlog: s.revlog,
        papers: s.papers,
        lastSession: s.lastSession,
        sessions: s.sessions ?? [],
        notes: s.notes,
        folders: s.folders,
        links: s.links ?? [],
        templates: s.templates,
        coaching: s.coaching,
        journey: s.journey,
        path: s.path,
        focus: s.focus,
        ludo: s.ludo,
        admin: readAdmin(s.admin),
        profiles: readProfiles(s.profiles),
        activeProfileId: s.activeProfileId ?? null,
        lastSyncedAt: s.lastSyncedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
        state?.seedSampleIfEmpty();
      },
    },
  ),
);

export function collectionSnapshot(): CollectionPayload {
  const s = useExamStore.getState();
  return {
    decks: s.decks,
    cards: s.cards,
    configs: s.configs,
    prefs: s.prefs,
    daily: s.daily,
    revlog: s.revlog,
    papers: s.papers,
    lastSession: s.lastSession,
    sessions: s.sessions ?? [],
    notes: s.notes ?? [],
    folders: s.folders ?? [],
    links: s.links ?? [],
    templates: s.templates?.length ? s.templates : defaultTemplates(s.prefs),
    coaching: s.coaching ?? defaultCoaching(),
    journey: s.journey ?? defaultJourney(),
    path: s.path ?? defaultExamPath(),
    focus: s.focus ? mergeFocus(s.focus) : mergeFocus(defaultFocus()),
    ludo: s.ludo ?? defaultLudo(),
  };
}

export function useHydrate() {
  const hydrated = useExamStore((s) => s.hydrated);
  const markHydrated = useExamStore((s) => s.markHydrated);
  const seedSampleIfEmpty = useExamStore((s) => s.seedSampleIfEmpty);
  if (typeof window !== "undefined" && !hydrated) {
    const unsub = useExamStore.persist.onFinishHydration(() => {
      markHydrated();
      seedSampleIfEmpty();
    });
    if (useExamStore.persist.hasHydrated()) {
      markHydrated();
      seedSampleIfEmpty();
    }
    return () => unsub();
  }
  return;
}

export function countsOf(deckId: string): DeckCounts {
  const s = useExamStore.getState();
  const daily = ensureDaily(s.daily, s.prefs.dayStartHour);
  const config = s.configs[s.decks.find((d) => d.id === deckId)?.configId ?? DEFAULT_CONFIG_ID] ?? defaultConfig();
  return deckCounts(s.cards, deckId, config, daily, s.prefs);
}

export function studyCards(deckId: string): Card[] {
  const s = useExamStore.getState();
  const daily = ensureDaily(s.daily, s.prefs.dayStartHour);
  const config = s.configs[s.decks.find((d) => d.id === deckId)?.configId ?? DEFAULT_CONFIG_ID] ?? defaultConfig();
  return buildStudyQueue(s.cards, deckId, config, daily, s.prefs);
}

export function configOf(deckId: string): DeckConfig {
  const s = useExamStore.getState();
  return s.configs[s.decks.find((d) => d.id === deckId)?.configId ?? DEFAULT_CONFIG_ID] ?? defaultConfig();
}

export function activeExamTemplate(): ExamTemplate {
  const list = useExamStore.getState().templates ?? [];
  return list.find((t) => t.bookmarked) ?? list[0] ?? defaultTemplates()[0];
}
