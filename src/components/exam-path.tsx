import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  ClipboardList,
  Flame,
  Lock,
  MoreVertical,
  Plus,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  applySessionToPath,
  buildExamPath,
  completePathNode,
  currentNodeIndex,
  DAILY_GOAL_OPTIONS,
  dailyGoalMet,
  daysLeftLabel,
  formatPathDate,
  intakeReady,
  noteReadPercent,
  pathNodeState,
  pathOverallPercent,
  pathStarted,
  rolloverPath,
  testScoreOf,
  todayStepCount,
} from "@/lib/exam/exam-path";
import { isPathMuted, playPathSfx, setPathMuted, unlockPathSfx } from "@/lib/exam/path-sfx";
import { useExamStore } from "@/lib/exam/store";
import {
  defaultExamPath,
  defaultPathIntake,
  normalizeExamPath,
  type PathDailyGoal,
  type PathIntake,
  type PathNode,
  type PathNodeKind,
} from "@/lib/exam/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "name", title: "Which exam is this target for?", hint: "GATE, NEET, Overman, SSC — whatever you are sitting." },
  { id: "start", title: "When does the target start?", hint: "Steps stay still until this date." },
  { id: "exam", title: "When do you need to be ready?", hint: "The date this path is built to finish." },
  { id: "pace", title: "How many steps each day?", hint: "One step is a note, a test, or a weekly check." },
  { id: "subjects", title: "Which subjects stay on this path?", hint: "Pick from your folders, or type your own." },
  { id: "notes", title: "Which notes belong on the path?", hint: "Reading them fills the percent on each step." },
  { id: "tests", title: "Which tests belong on the path?", hint: "Scores land on the step after you sit the paper." },
  { id: "weekly", title: "Add a weekly check in each subject?", hint: "Unlocks after that subject's notes and tests." },
  { id: "extra", title: "Anything else to add?", hint: "Optional — a book, coaching class, extra drill." },
  { id: "review", title: "Create this target?", hint: "Start date, finish date, subjects, notes, and tests." },
] as const;

function toDateInput(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromDateInput(value: string, endOfDay = false): number | null {
  if (!value) return null;
  const d = new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}`);
  const n = d.getTime();
  return Number.isFinite(n) ? n : null;
}

function PaperMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.12" />
      <path
        d="M20 18h18l10 10v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4z"
        fill="currentColor"
        opacity="0.92"
      />
      <path d="M38 18v8a2 2 0 0 0 2 2h8" fill="none" stroke="var(--color-card)" strokeWidth="2.4" />
      <path d="M24 36h16M24 43h12" stroke="var(--color-card)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function nodeIcon(kind: PathNodeKind) {
  if (kind === "test") return ClipboardList;
  if (kind === "weekly") return Trophy;
  if (kind === "extra") return Plus;
  return BookOpen;
}

export function ExamPathHome() {
  const path = normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath());
  if (!path.intake.completed) return <PathIntakeFlow />;
  return <PathBoard />;
}

function PathIntakeFlow() {
  const decks = useExamStore((s) => s.decks);
  const notes = useExamStore((s) => s.notes);
  const folders = useExamStore((s) => s.folders);
  const prefs = useExamStore((s) => s.prefs);
  const stored = normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath());
  const updatePath = useExamStore((s) => s.updatePath);
  const setPrefs = useExamStore((s) => s.setPrefs);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<PathIntake>(() => {
    const base = stored.intake.examName ? stored.intake : defaultPathIntake();
    return {
      ...base,
      completed: false,
      examName: base.examName || prefs.targetExamName || "",
      startDate: base.startDate ?? Date.now(),
      examDate: base.examDate ?? Date.now() + 12 * 864e5,
      noteIds: base.noteIds.length ? base.noteIds : notes.map((n) => n.id),
      deckIds: base.deckIds.length ? base.deckIds : decks.map((d) => d.id),
    };
  });
  const [subjectDraft, setSubjectDraft] = useState("");
  const [extraDraft, setExtraDraft] = useState("");
  const current = STEPS[step]!;
  const suggestions = useMemo(() => {
    const fromFolders = folders.map((f) => f.name.trim()).filter(Boolean);
    const fromDecks = decks.map((d) => (d.name.split("::").pop() ?? d.name).trim()).filter(Boolean);
    return [...new Set([...fromFolders, ...fromDecks])].slice(0, 12);
  }, [folders, decks]);

  function canContinue(): boolean {
    if (current.id === "name") return draft.examName.trim().length > 1;
    if (current.id === "start") return Boolean(draft.startDate);
    if (current.id === "exam") return Boolean(draft.examDate) && (draft.startDate == null || draft.examDate! >= draft.startDate);
    if (current.id === "subjects") return true;
    if (current.id === "review") return intakeReady(draft);
    return true;
  }

  function addSubject(name: string) {
    const clean = name.trim().slice(0, 40);
    if (!clean || draft.subjects.includes(clean)) return;
    setDraft((d) => ({ ...d, subjects: [...d.subjects, clean].slice(0, 16) }));
    setSubjectDraft("");
  }

  function addExtra(name: string) {
    const clean = name.trim().slice(0, 60);
    if (!clean || draft.extraItems.includes(clean)) return;
    setDraft((d) => ({ ...d, extraItems: [...d.extraItems, clean].slice(0, 16) }));
    setExtraDraft("");
  }

  function finish() {
    const ready = {
      ...draft,
      examName: draft.examName.trim(),
    };
    if (!intakeReady(ready)) {
      toast.message("Add a name, dates, and at least one subject, note, test, or extra item");
      return;
    }
    unlockPathSfx();
    playPathSfx("goal");
    const next = buildExamPath(ready, notes, decks, folders, stored);
    updatePath(() => next);
    if (ready.examName) setPrefs({ targetExamName: ready.examName });
    toast.success("Target path is ready");
  }

  return (
    <StudyShell title="Set your target">
      <div className="exam-intake mx-auto grid max-w-lg gap-6 p-4 pb-28" onPointerDown={unlockPathSfx}>
        <div className="exam-intake-bar" aria-hidden>
          <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {step + 1} of {STEPS.length}
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">{current.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{current.hint}</p>
        </div>

        {current.id === "name" ? (
          <Input
            value={draft.examName}
            onChange={(e) => setDraft((d) => ({ ...d, examName: e.target.value }))}
            placeholder="Overman · Paper 1"
            className="h-12 text-base"
            autoFocus
          />
        ) : null}

        {current.id === "start" ? (
          <Input
            type="date"
            value={toDateInput(draft.startDate)}
            onChange={(e) => setDraft((d) => ({ ...d, startDate: fromDateInput(e.target.value) }))}
            className="h-12"
          />
        ) : null}

        {current.id === "exam" ? (
          <Input
            type="date"
            value={toDateInput(draft.examDate)}
            onChange={(e) => setDraft((d) => ({ ...d, examDate: fromDateInput(e.target.value, true) }))}
            className="h-12"
          />
        ) : null}

        {current.id === "pace" ? (
          <div className="grid grid-cols-2 gap-2">
            {DAILY_GOAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn("exam-choice", draft.dailyGoal === opt.value && "is-on")}
                onClick={() => {
                  playPathSfx("tap");
                  setDraft((d) => ({ ...d, dailyGoal: opt.value }));
                }}
              >
                <span className="font-display text-lg font-semibold">{opt.label}</span>
                <span className="text-sm text-muted-foreground">{opt.hint}</span>
              </button>
            ))}
          </div>
        ) : null}

        {current.id === "subjects" ? (
          <div className="grid gap-3">
            <div className="flex gap-2">
              <Input
                value={subjectDraft}
                onChange={(e) => setSubjectDraft(e.target.value)}
                placeholder="Add a subject"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject(subjectDraft);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addSubject(subjectDraft)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((name) => {
                const on = draft.subjects.includes(name);
                return (
                  <Button
                    key={name}
                    type="button"
                    size="sm"
                    variant={on ? "default" : "outline"}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        subjects: on ? d.subjects.filter((s) => s !== name) : [...d.subjects, name],
                      }))
                    }
                  >
                    {name}
                  </Button>
                );
              })}
            </div>
            {draft.subjects.length ? (
              <p className="text-xs text-muted-foreground">{draft.subjects.join(" · ")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">None yet — we will use a Core paper unit if you skip this.</p>
            )}
          </div>
        ) : null}

        {current.id === "notes" ? (
          <ul className="grid gap-2">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet. You can add them later from Notes.</p>
            ) : (
              notes.map((note) => {
                const on = draft.noteIds.includes(note.id);
                return (
                  <button
                    key={note.id}
                    type="button"
                    className={cn("exam-choice text-left", on && "is-on")}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        noteIds: on ? d.noteIds.filter((id) => id !== note.id) : [...d.noteIds, note.id],
                      }))
                    }
                  >
                    <span className="font-medium">{note.title || "Untitled note"}</span>
                    <span className="text-xs text-muted-foreground">{on ? "On the path" : "Off the path"}</span>
                  </button>
                );
              })
            )}
          </ul>
        ) : null}

        {current.id === "tests" ? (
          <ul className="grid gap-2">
            {decks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tests yet. You can add them later from Tests.</p>
            ) : (
              decks.map((deck) => {
                const on = draft.deckIds.includes(deck.id);
                return (
                  <button
                    key={deck.id}
                    type="button"
                    className={cn("exam-choice text-left", on && "is-on")}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        deckIds: on ? d.deckIds.filter((id) => id !== deck.id) : [...d.deckIds, deck.id],
                      }))
                    }
                  >
                    <span className="font-medium">{deck.name.split("::").pop()}</span>
                    <span className="text-xs text-muted-foreground">{on ? "On the path" : "Off the path"}</span>
                  </button>
                );
              })
            )}
          </ul>
        ) : null}

        {current.id === "weekly" ? (
          <div className="grid gap-2">
            <button type="button" className={cn("exam-choice text-left", draft.weeklyTests && "is-on")} onClick={() => setDraft((d) => ({ ...d, weeklyTests: true }))}>
              <span className="font-medium">Yes — weekly checks</span>
              <span className="text-xs text-muted-foreground">A checkpoint after each subject</span>
            </button>
            <button type="button" className={cn("exam-choice text-left", !draft.weeklyTests && "is-on")} onClick={() => setDraft((d) => ({ ...d, weeklyTests: false }))}>
              <span className="font-medium">Notes and tests only</span>
              <span className="text-xs text-muted-foreground">No weekly checkpoint</span>
            </button>
          </div>
        ) : null}

        {current.id === "extra" ? (
          <div className="grid gap-3">
            <div className="flex gap-2">
              <Input
                value={extraDraft}
                onChange={(e) => setExtraDraft(e.target.value)}
                placeholder="e.g. Coaching mock on Sunday"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addExtra(extraDraft);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addExtra(extraDraft)}>
                Add
              </Button>
            </div>
            <ul className="grid gap-2">
              {draft.extraItems.map((item) => (
                <li key={item} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                  <span>{item}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setDraft((d) => ({ ...d, extraItems: d.extraItems.filter((x) => x !== item) }))}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {current.id === "review" ? (
          <dl className="exam-review">
            <div>
              <dt>Start</dt>
              <dd>{formatPathDate(draft.startDate)}</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>{formatPathDate(draft.examDate)}</dd>
            </div>
            <div>
              <dt>Daily</dt>
              <dd>{draft.dailyGoal} step{draft.dailyGoal === 1 ? "" : "s"}</dd>
            </div>
            <div>
              <dt>Subjects</dt>
              <dd>{draft.subjects.length ? draft.subjects.join(", ") : "Core paper"}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{draft.noteIds.length} on the path</dd>
            </div>
            <div>
              <dt>Tests</dt>
              <dd>{draft.deckIds.length} on the path</dd>
            </div>
            <div>
              <dt>Weekly checks</dt>
              <dd>{draft.weeklyTests ? "On" : "Off"}</dd>
            </div>
            <div>
              <dt>Added</dt>
              <dd>{draft.extraItems.length ? draft.extraItems.join(", ") : "None"}</dd>
            </div>
          </dl>
        ) : null}

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          {current.id === "review" ? (
            <Button type="button" className="flex-1" disabled={!canContinue()} onClick={finish}>
              Create target
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              disabled={!canContinue()}
              onClick={() => {
                playPathSfx("tap");
                setStep((s) => Math.min(STEPS.length - 1, s + 1));
              }}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </StudyShell>
  );
}

function PathBoard() {
  const navigate = useNavigate();
  const raw = useExamStore((s) => s.path);
  const decks = useExamStore((s) => s.decks);
  const notes = useExamStore((s) => s.notes);
  const folders = useExamStore((s) => s.folders);
  const lastSession = useExamStore((s) => s.lastSession);
  const prefs = useExamStore((s) => s.prefs);
  const updatePath = useExamStore((s) => s.updatePath);
  const path = normalizeExamPath(raw ?? defaultExamPath());
  const [picked, setPicked] = useState<PathNode | null>(null);
  const [sfxOn, setSfxOn] = useState(() => path.progress.sound && !isPathMuted());
  const started = pathStarted(path);
  const current = currentNodeIndex(path);
  const today = todayStepCount(path, prefs.dayStartHour);
  const goal = path.intake.dailyGoal;
  const overall = pathOverallPercent(path);

  useEffect(() => {
    updatePath((p) => rolloverPath(p, prefs.dayStartHour));
  }, [prefs.dayStartHour, updatePath]);

  useEffect(() => {
    if (!lastSession) return;
    updatePath((p) => applySessionToPath(p, lastSession, prefs.dayStartHour));
  }, [lastSession?.id, prefs.dayStartHour, updatePath]);

  const units = useMemo(() => {
    const map = new Map<number, { title: string; nodes: PathNode[] }>();
    for (const node of path.nodes) {
      const row = map.get(node.unit) ?? { title: node.unitTitle, nodes: [] };
      row.nodes.push(node);
      map.set(node.unit, row);
    }
    return [...map.entries()].map(([unit, row]) => ({ unit, ...row }));
  }, [path.nodes]);

  function persist(next: typeof path, sfx?: "complete" | "unlock" | "streak" | "goal") {
    updatePath(() => next);
    if (sfx && next.progress.sound) playPathSfx(sfx);
  }

  function onNode(node: PathNode, index: number) {
    unlockPathSfx();
    const state = pathNodeState(path, index);
    if (state === "locked" || !started) {
      playPathSfx("deny");
      toast.message(started ? "Finish the step before this one" : "The target has not started yet");
      return;
    }
    playPathSfx("tap");
    setPicked(node);
  }

  function finishNode(node: PathNode) {
    const before = path.progress.streak;
    const next = completePathNode(path, node.id, prefs.dayStartHour);
    const met = dailyGoalMet(next, prefs.dayStartHour);
    persist(next, next.progress.streak > before ? "streak" : met && !dailyGoalMet(path, prefs.dayStartHour) ? "goal" : "complete");
    setPicked(null);
  }

  return (
    <StudyShell title={path.intake.examName || prefs.targetExamName || "Target Exam"}>
      <div className="exam-path mx-auto grid max-w-lg pb-28" onPointerDown={unlockPathSfx}>
        <header className="exam-path-hud">
          <div className="exam-stat">
            <Flame className="size-4" />
            <span className="tabular-nums">{path.progress.streak}</span>
            <span>day run</span>
          </div>
          <div className="exam-stat">
            <Trophy className="size-4" />
            <span className="tabular-nums">{path.progress.marks}</span>
            <span>marks</span>
          </div>
          <div
            className="exam-goal"
            style={{ background: `conic-gradient(var(--color-primary) ${(today / goal) * 360}deg, color-mix(in oklab, var(--color-foreground) 12%, transparent) 0)` }}
            aria-label={`${today} of ${goal} steps today`}
          >
            <span>
              {today}/{goal}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label="Target options">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  const next = !sfxOn;
                  setSfxOn(next);
                  setPathMuted(!next);
                  updatePath((p) => ({ ...p, progress: { ...p.progress, sound: next } }));
                  if (next) playPathSfx("tap");
                }}
              >
                {sfxOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                {sfxOn ? "Sound off" : "Sound on"}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void navigate({ to: "/target", search: { game: "pick" } })}>
                River and Ludo tracks
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void navigate({ to: "/settings" })}>Edit daily goal</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  updatePath((p) => ({ ...p, intake: { ...p.intake, completed: false } }));
                  toast.message("Answer the questions again to rebuild the path");
                }}
              >
                Redo the setup questions
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  persist(buildExamPath(path.intake, notes, decks, folders, path), "unlock");
                  toast.success("Path rebuilt from the current notes and tests");
                }}
              >
                Rebuild path
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <section className="exam-summary">
          <div className="flex items-start gap-3">
            <PaperMark className="exam-mark" />
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold tracking-tight">{path.intake.examName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPathDate(path.intake.startDate)} → {formatPathDate(path.intake.examDate)} · {daysLeftLabel(path.intake.examDate)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {path.intake.subjects.join(" · ") || "Core paper"} · {overall}% of the path
              </p>
            </div>
          </div>
          <dl className="exam-summary-grid">
            <div>
              <dt>Notes</dt>
              <dd>{path.intake.noteIds.length} linked</dd>
            </div>
            <div>
              <dt>Tests</dt>
              <dd>{path.intake.deckIds.length} linked</dd>
            </div>
            <div>
              <dt>This week</dt>
              <dd className="tabular-nums">{path.progress.weekMarks} marks</dd>
            </div>
            <div>
              <dt>Added</dt>
              <dd>{path.intake.extraItems.length || "None"}</dd>
            </div>
          </dl>
        </section>

        <div className="exam-lane">
          {units.map((unit) => (
            <section key={unit.unit} className="exam-unit">
              <header className="exam-unit-banner">
                <p>Unit {unit.unit}</p>
                <h3>{unit.title}</h3>
              </header>
              {unit.nodes.map((node) => {
                const index = path.nodes.findIndex((n) => n.id === node.id);
                const state = pathNodeState(path, index);
                const Icon = nodeIcon(node.kind);
                const read = noteReadPercent(path, node.noteId);
                const score = testScoreOf(path, node.deckId);
                return (
                  <div key={node.id} className={cn("exam-step", `shift-${index % 5}`)}>
                    <button
                      type="button"
                      className={cn("exam-node", `is-${state}`, node.kind === "weekly" && "is-check")}
                      aria-label={node.title}
                      onClick={() => onNode(node, index)}
                    >
                      {state === "locked" ? <Lock className="size-5" /> : state === "done" ? <Check className="size-6" /> : <Icon className="size-5" />}
                    </button>
                    <div className="exam-node-meta">
                      <p className="exam-node-title">{node.title}</p>
                      <p className="exam-node-hint">
                        {node.kind === "note"
                          ? `Read ${read}%`
                          : node.kind === "test" || node.kind === "weekly"
                            ? score == null
                              ? "Test not sat"
                              : `Test ${score}%`
                            : "On the target"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
          {current === -1 ? (
            <p className="px-6 py-8 text-center font-display text-lg font-semibold">Path complete — sit the exam when it comes.</p>
          ) : null}
        </div>
      </div>

      <Dialog open={picked != null} onOpenChange={(open) => !open && setPicked(null)}>
        <DialogContent>
          {picked ? (
            <>
              <DialogHeader>
                <DialogTitle>{picked.title}</DialogTitle>
                <DialogDescription>
                  {picked.kind === "note"
                    ? `Reading this note counts on the path. Now at ${noteReadPercent(path, picked.noteId)}%.`
                    : picked.kind === "test"
                      ? testScoreOf(path, picked.deckId) == null
                        ? "Sit this paper. The score lands on the step."
                        : `Last sit ${testScoreOf(path, picked.deckId)}%. Sit again or mark the step done.`
                      : picked.kind === "weekly"
                        ? "Weekly check — sit the linked test, or mark the week after you have reviewed."
                        : "An extra item you added to this target."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                {picked.noteId ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setPicked(null);
                      void navigate({ to: "/notes/$noteId", params: { noteId: picked.noteId! } });
                    }}
                  >
                    Open note
                  </Button>
                ) : null}
                {picked.deckId ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setPicked(null);
                      void navigate({
                        to: "/study/$deckId",
                        params: { deckId: picked.deckId! },
                        search: { mode: "study", pick: "due", count: 0, paper: "", quiz: "", session: "" },
                      });
                    }}
                  >
                    Start test
                  </Button>
                ) : null}
                {picked.extra === "notes" ? (
                  <Button type="button" onClick={() => void navigate({ to: "/notes", search: { view: "list", folder: "" } })}>
                    Open Notes
                  </Button>
                ) : null}
                {picked.extra === "tests" ? (
                  <Button type="button" onClick={() => void navigate({ to: "/" })}>
                    Open Tests
                  </Button>
                ) : null}
                <Button type="button" variant="outline" onClick={() => finishNode(picked)}>
                  Mark this step done
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}
