import {
  defaultExamPath,
  normalizeExamPath,
  type Deck,
  type ExamPath,
  type Note,
  type NoteFolder,
  type PathDailyGoal,
  type PathIntake,
  type PathNode,
  type PathNodeState,
  type SessionSummary,
} from "./types";

export function pathDayKey(now = Date.now(), dayStartHour = 4): string {
  const d = new Date(now);
  if (d.getHours() < dayStartHour) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function pathWeekKey(now = Date.now(), dayStartHour = 4): string {
  const d = new Date(now);
  if (d.getHours() < dayStartHour) d.setDate(d.getDate() - 1);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  return `${d.getFullYear()}-W${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayKey(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(y!, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() - 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function rolloverPath(path: ExamPath, dayStartHour = 4, now = Date.now()): ExamPath {
  const day = pathDayKey(now, dayStartHour);
  const week = pathWeekKey(now, dayStartHour);
  let progress = path.progress;
  if (progress.dayKey !== day) {
    progress = { ...progress, todayMarks: 0, dayKey: day };
  }
  if (progress.weekKey !== week) {
    progress = { ...progress, weekMarks: 0, weekKey: week };
  }
  return progress === path.progress ? path : { ...path, progress };
}

function folderName(folders: NoteFolder[], id: string | null): string {
  if (!id) return "";
  return folders.find((f) => f.id === id)?.name ?? "";
}

function matchesSubject(text: string, subject: string): boolean {
  const a = text.trim().toLowerCase();
  const b = subject.trim().toLowerCase();
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

export function intakeReady(intake: PathIntake): boolean {
  if (!intake.examName.trim()) return false;
  if (!intake.startDate || !intake.examDate) return false;
  if (intake.examDate < intake.startDate) return false;
  return intake.subjects.length + intake.noteIds.length + intake.deckIds.length + intake.extraItems.length > 0;
}

export function buildExamPath(
  intake: PathIntake,
  notes: Note[],
  decks: Deck[],
  folders: NoteFolder[],
  existing?: ExamPath,
): ExamPath {
  const subjects = intake.subjects.length ? intake.subjects : ["Core paper"];
  const selectedNotes = notes.filter((n) => intake.noteIds.includes(n.id));
  const selectedDecks = decks.filter((d) => intake.deckIds.includes(d.id));
  const usedNotes = new Set<string>();
  const usedDecks = new Set<string>();
  const nodes: PathNode[] = [];

  subjects.forEach((subject, index) => {
    const unit = index + 1;
    const last = index === subjects.length - 1;
    const unitNotes = selectedNotes.filter((n) => {
      if (usedNotes.has(n.id)) return false;
      const hay = `${n.title} ${folderName(folders, n.folderId)}`;
      const hit = matchesSubject(hay, subject);
      if (hit || (last && !subjects.some((s) => s !== subject && matchesSubject(hay, s)))) {
        usedNotes.add(n.id);
        return true;
      }
      return false;
    });
    const unitDecks = selectedDecks.filter((d) => {
      if (usedDecks.has(d.id)) return false;
      const hit = matchesSubject(d.name, subject);
      if (hit || (last && !subjects.some((s) => s !== subject && matchesSubject(d.name, s)))) {
        usedDecks.add(d.id);
        return true;
      }
      return false;
    });
    for (const note of unitNotes) {
      nodes.push({
        id: `note:${note.id}:u${unit}`,
        kind: "note",
        title: note.title.trim() || "Untitled note",
        unit,
        unitTitle: subject,
        noteId: note.id,
        deckId: null,
        extra: null,
      });
    }
    for (const deck of unitDecks) {
      nodes.push({
        id: `test:${deck.id}:u${unit}`,
        kind: "test",
        title: deck.name.split("::").pop() || deck.name,
        unit,
        unitTitle: subject,
        noteId: null,
        deckId: deck.id,
        extra: null,
      });
    }
    if (intake.weeklyTests) {
      nodes.push({
        id: `weekly:u${unit}`,
        kind: "weekly",
        title: `Weekly check · ${subject}`,
        unit,
        unitTitle: subject,
        noteId: null,
        deckId: unitDecks[0]?.id ?? selectedDecks[0]?.id ?? null,
        extra: null,
      });
    }
  });

  if (intake.extraItems.length) {
    const unit = (nodes.at(-1)?.unit ?? 0) + 1;
    intake.extraItems.forEach((item, i) => {
      nodes.push({
        id: `extra:${i}:${item.slice(0, 24)}`,
        kind: "extra",
        title: item,
        unit,
        unitTitle: "Added to the target",
        noteId: null,
        deckId: null,
        extra: item,
      });
    });
  }

  if (!nodes.length) {
    nodes.push({
      id: "extra:open-notes",
      kind: "extra",
      title: "Open Notes and add a reading",
      unit: 1,
      unitTitle: "Get started",
      noteId: null,
      deckId: null,
      extra: "notes",
    });
    nodes.push({
      id: "extra:open-tests",
      kind: "extra",
      title: "Open Tests and add a paper",
      unit: 1,
      unitTitle: "Get started",
      noteId: null,
      deckId: null,
      extra: "tests",
    });
  }

  const prev = existing ? normalizeExamPath(existing) : defaultExamPath();
  const keepDone = prev.progress.doneIds.filter((id) => nodes.some((n) => n.id === id));
  return {
    intake: { ...intake, completed: true, examName: intake.examName.trim().slice(0, 80) },
    nodes,
    progress: {
      ...prev.progress,
      doneIds: keepDone,
    },
  };
}

export function pathStarted(path: ExamPath, now = Date.now()): boolean {
  if (!path.intake.startDate) return true;
  const start = new Date(path.intake.startDate);
  start.setHours(0, 0, 0, 0);
  return now >= start.getTime();
}

export function currentNodeIndex(path: ExamPath): number {
  const done = new Set(path.progress.doneIds);
  return path.nodes.findIndex((n) => !done.has(n.id));
}

export function pathNodeState(path: ExamPath, index: number): PathNodeState {
  const node = path.nodes[index];
  if (!node) return "locked";
  if (path.progress.doneIds.includes(node.id)) return "done";
  const current = currentNodeIndex(path);
  if (current === -1) return "done";
  if (index === current) return "current";
  return "locked";
}

export function todayStepCount(path: ExamPath, dayStartHour = 4, now = Date.now()): number {
  const day = pathDayKey(now, dayStartHour);
  if (path.progress.lastActiveDay !== day) return 0;
  return Math.min(path.intake.dailyGoal, Math.ceil(path.progress.todayMarks / 10));
}

export function dailyGoalMet(path: ExamPath, dayStartHour = 4, now = Date.now()): boolean {
  return todayStepCount(path, dayStartHour, now) >= path.intake.dailyGoal;
}

export function pathOverallPercent(path: ExamPath): number {
  if (!path.nodes.length) return 0;
  return Math.round((path.progress.doneIds.length / path.nodes.length) * 100);
}

export function noteReadPercent(path: ExamPath, noteId: string | null): number {
  if (!noteId) return 0;
  return Math.min(100, Math.max(0, path.progress.noteReads[noteId] ?? 0));
}

export function testScoreOf(path: ExamPath, deckId: string | null): PathNode extends never ? never : number | null {
  if (!deckId) return null;
  const row = path.progress.testScores[deckId];
  return row ? row.percent : null;
}

function addMarks(path: ExamPath, amount: number, dayStartHour: number, now: number): ExamPath {
  const rolled = rolloverPath(path, dayStartHour, now);
  const day = pathDayKey(now, dayStartHour);
  const yesterday = yesterdayKey(day);
  let streak = rolled.progress.streak;
  if (rolled.progress.lastActiveDay !== day) {
    streak = rolled.progress.lastActiveDay === yesterday ? streak + 1 : 1;
  }
  return {
    ...rolled,
    progress: {
      ...rolled.progress,
      marks: rolled.progress.marks + amount,
      todayMarks: rolled.progress.todayMarks + amount,
      weekMarks: rolled.progress.weekMarks + amount,
      lastActiveDay: day,
      streak,
    },
  };
}

export function completePathNode(path: ExamPath, nodeId: string, dayStartHour = 4, now = Date.now()): ExamPath {
  if (path.progress.doneIds.includes(nodeId)) return path;
  const node = path.nodes.find((n) => n.id === nodeId);
  if (!node) return path;
  const index = path.nodes.findIndex((n) => n.id === nodeId);
  if (pathNodeState(path, index) === "locked") return path;
  const amount = node.kind === "weekly" ? 25 : node.kind === "test" ? 15 : 10;
  const next = addMarks(path, amount, dayStartHour, now);
  return {
    ...next,
    progress: {
      ...next.progress,
      doneIds: [...next.progress.doneIds, nodeId],
    },
  };
}

export function bumpNoteRead(path: ExamPath, noteId: string, delta: number, dayStartHour = 4, now = Date.now()): ExamPath {
  const prev = noteReadPercent(path, noteId);
  const nextRead = Math.min(100, prev + Math.max(0, delta));
  if (nextRead === prev) return path;
  let next: ExamPath = {
    ...path,
    progress: {
      ...path.progress,
      noteReads: { ...path.progress.noteReads, [noteId]: nextRead },
    },
  };
  if (nextRead >= 80) {
    const node = next.nodes.find((n) => n.kind === "note" && n.noteId === noteId && !next.progress.doneIds.includes(n.id));
    if (node && pathNodeState(next, next.nodes.indexOf(node)) !== "locked") {
      next = completePathNode(next, node.id, dayStartHour, now);
    }
  }
  return next;
}

export function applySessionToPath(path: ExamPath, session: SessionSummary | null, dayStartHour = 4): ExamPath {
  if (!session || !session.deckId || !session.total) return path;
  const percent = Math.round((session.correct / session.total) * 100);
  const prev = path.progress.testScores[session.deckId];
  if (prev?.sessionId === session.id) return path;
  let next: ExamPath = {
    ...path,
    progress: {
      ...path.progress,
      testScores: {
        ...path.progress.testScores,
        [session.deckId]: { percent, at: session.at, sessionId: session.id },
      },
    },
  };
  const candidates = next.nodes.filter(
    (n) => (n.kind === "test" || n.kind === "weekly") && n.deckId === session.deckId && !next.progress.doneIds.includes(n.id),
  );
  for (const node of candidates) {
    if (pathNodeState(next, next.nodes.indexOf(node)) === "locked") continue;
    next = completePathNode(next, node.id, dayStartHour, session.at);
    break;
  }
  return next;
}

export function formatPathDate(ts: number | null): string {
  if (!ts) return "Not set";
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function daysLeftLabel(examDate: number | null, now = Date.now()): string {
  if (!examDate) return "No finish date";
  const days = Math.ceil((examDate - now) / 864e5);
  if (days < 0) return "Past the goal date";
  if (days === 0) return "Goal day is today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export const DAILY_GOAL_OPTIONS: Array<{ value: PathDailyGoal; label: string; hint: string }> = [
  { value: 1, label: "Easy", hint: "1 step a day" },
  { value: 2, label: "Steady", hint: "2 steps a day" },
  { value: 3, label: "Serious", hint: "3 steps a day" },
  { value: 5, label: "Sprint", hint: "5 steps a day" },
];
