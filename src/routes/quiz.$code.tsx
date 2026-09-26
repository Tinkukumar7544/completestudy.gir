import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, Lock, LogOut, PhoneOff, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { PaperStartFields } from "@/components/paper-start";
import { QuizLiveBar } from "@/components/quiz-call";
import { QuizSummaryViewOnly } from "@/components/quiz-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCountdown, formatIsoDate, lockUntilMs, remainingMs, type QuizSummaryView } from "@/lib/exam/quiz-assign";
import {
  endQuiz,
  getQuizSummary,
  joinQuiz,
  leaveQuiz,
  listQuiz,
  MAX_QUIZ_FRIENDS,
  readyQuiz,
  type QuizRoom,
} from "@/lib/exam/quiz";
import { rememberPaperPrefs, rememberedPaperPrefs } from "@/lib/exam/clipboard";
import { quizPlayerId, rememberQuizName, rememberedQuizName } from "@/lib/exam/quiz-client";
import { activeExamTemplate, useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz/$code")({
  validateSearch: (raw: Record<string, unknown>): { view?: string } => {
    const view = String(raw.view ?? "").trim().toUpperCase();
    return view ? { view } : {};
  },
  component: QuizRoomPage,
});

function QuizRoomPage() {
  const { code } = Route.useParams();
  const { view = "" } = Route.useSearch();
  const navigate = useNavigate();
  const [room, setRoom] = useState<QuizRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [viewInput, setViewInput] = useState(view);
  const [lookup, setLookup] = useState<QuizSummaryView | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);
  const [now, setNow] = useState(Date.now());
  const me = quizPlayerId();
  const templates = useExamStore((s) => s.templates ?? []);
  const [templateId, setTemplateId] = useState(
    () => rememberedPaperPrefs()?.template || activeExamTemplate()?.id || "",
  );

  useEffect(() => {
    setName(rememberedQuizName());
  }, []);

  useEffect(() => {
    setViewInput(view);
  }, [view]);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const next = await listQuiz({ data: { code, playerId: me } });
        if (!cancelled) {
          setRoom(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Quiz not found");
      }
    }
    void refresh();
    const t = window.setInterval(() => void refresh(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [code, me]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 400);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!view || !room?.hasSubmitted) {
      setLookup(null);
      setLookupError(null);
      return;
    }
    let cancelled = false;
    setLooking(true);
    void getQuizSummary({ data: { code, playerId: me, viewCode: view } })
      .then((summary) => {
        if (cancelled) return;
        setLookup(summary);
        setLookupError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setLookup(null);
        setLookupError(err instanceof Error ? err.message : "Could not open that summary");
      })
      .finally(() => {
        if (!cancelled) setLooking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [view, code, me, room?.hasSubmitted]);

  const joined = Boolean(room?.players.some((p) => p.playerId === me && !p.leftAt));
  const present = room?.players.filter((p) => !p.leftAt) ?? [];
  const waitingStart = present.filter((p) => !p.readyAt);
  const lockUntil = useMemo(
    () => (room ? lockUntilMs(room.startedAt, room.timeLimitSec, room.serverNow) : 0),
    [room?.startedAt, room?.timeLimitSec, room?.serverNow],
  );
  const left = remainingMs(lockUntil || null, now);
  const live = Boolean(room?.startedAt && !room.endedAt && left > 0);

  useEffect(() => {
    if (!joined || !room?.startedAt || room.hasSubmitted || room.endedAt) return;
    const key = `quiz-paper-${code}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    rememberPaperPrefs({
      template: templateId,
      minutes: Math.max(1, Math.round((room.timeLimitSec || 0) / 60)),
    });
    void navigate({
      to: "/study/$deckId",
      params: { deckId: "quiz" },
      search: {
        mode: "custom",
        pick: "all",
        count: room.questionCount,
        paper: "",
        quiz: code.toUpperCase(),
        session: "",
        template: templateId || undefined,
        minutes: Math.max(1, Math.round((room.timeLimitSec || 0) / 60)),
      },
    });
  }, [joined, room?.startedAt, room?.hasSubmitted, room?.endedAt, room?.questionCount, room?.timeLimitSec, code, navigate, templateId]);

  async function join() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name");
      return;
    }
    rememberQuizName(display);
    setJoining(true);
    try {
      const next = await joinQuiz({ data: { code, playerId: me, name: display } });
      setRoom(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setJoining(false);
    }
  }

  async function tapStart() {
    const display = name.trim() || rememberedQuizName() || "Friend";
    rememberQuizName(display);
    try {
      const next = await readyQuiz({ data: { code, playerId: me, name: display } });
      setRoom(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start");
    }
  }

  function openPaper() {
    rememberPaperPrefs({ template: templateId, minutes: Math.max(1, Math.round((room?.timeLimitSec || 0) / 60)) });
    void navigate({
      to: "/study/$deckId",
      params: { deckId: "quiz" },
      search: {
        mode: "custom",
        pick: "all",
        count: room?.questionCount ?? 0,
        paper: "",
        quiz: code.toUpperCase(),
        session: "",
        template: templateId || undefined,
        minutes: Math.max(1, Math.round((room?.timeLimitSec || 0) / 60)),
      },
    });
  }

  function copyCode() {
    void navigator.clipboard.writeText(code.toUpperCase());
    toast.success("Code copied — send it to friends");
  }

  function shareCode() {
    const text = `Join my SetPaper quiz “${room?.title ?? "Friends quiz"}”. Code: ${code.toUpperCase()}`;
    if (typeof navigator.share === "function") {
      void navigator.share({ title: room?.title ?? "Friends quiz", text }).catch(() => copyCode());
      return;
    }
    copyCode();
  }

  function copyViewCode(value: string) {
    void navigator.clipboard.writeText(value);
    toast.success("View code copied");
  }

  function openViewCode() {
    const next = viewInput.trim().toUpperCase();
    if (next.length < 4) {
      toast.error("Enter a view code from a friend’s summary");
      return;
    }
    void navigate({ to: "/quiz/$code", params: { code }, search: { view: next } });
  }

  async function terminate() {
    const display = name.trim() || rememberedQuizName() || "Friend";
    try {
      const next = await endQuiz({ data: { code, playerId: me, name: display } });
      setRoom(next);
      toast.success("Test ended — remaining papers were auto-submitted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not end the test");
    }
  }

  async function disconnect() {
    const display = name.trim() || rememberedQuizName() || "Friend";
    try {
      await leaveQuiz({ data: { code, playerId: me, name: display } });
    } catch {
      /* still leave the screen */
    }
    void navigate({ to: "/connect" });
  }

  if (error && !room) {
    return (
      <StudyShell title="Friends quiz">
        <p className="p-6 text-sm text-muted-foreground">{error}</p>
      </StudyShell>
    );
  }

  if (!room) {
    return (
      <StudyShell title="Friends quiz">
        <p className="p-6 text-sm text-muted-foreground">Loading room…</p>
      </StudyShell>
    );
  }

  const submitted = room.players.filter((p) => p.submittedAt);
  const summary = lookup ?? room.assigned;
  const dayLabel = formatIsoDate(room.testDay);
  const minutes = Math.max(1, Math.round(room.timeLimitSec / 60));

  return (
    <StudyShell title={room.title}>
      <div className="mx-auto max-w-md p-4 pb-10">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Room code</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-[0.3em]">{room.code}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={copyCode}>
              <Copy className="size-4" /> Copy code
            </Button>
            <Button variant="outline" size="sm" onClick={shareCode}>
              <Share2 className="size-4" /> Share
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {present.length}/{MAX_QUIZ_FRIENDS} friends · {room.questionCount} questions · {minutes} min
          </p>
          {(dayLabel || room.folder) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {dayLabel ? <>Test day {dayLabel}</> : null}
              {dayLabel && room.folder ? " · " : null}
              {room.folder ? <>Folder {room.folder}</> : null}
            </p>
          )}
          {live ? (
            <p className="mt-2 font-mono text-lg font-semibold tabular-nums">{formatCountdown(left)}</p>
          ) : room.endedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">This test has ended</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">The paper starts when every name has tapped Start.</p>
          )}
        </div>

        {!joined ? (
          <div className="mt-6 grid gap-3">
            <Label htmlFor="join-name">Your name</Label>
            <Input id="join-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown on the scoreboard" />
            <Button onClick={() => void join()} disabled={joining}>
              {joining ? "Joining…" : "Join this quiz"}
            </Button>
          </div>
        ) : (
          <>
            {!room.startedAt && !room.endedAt ? (
              <section className="mt-6">
                <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Participants</h2>
                <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
                  {present.map((p) => (
                    <li key={p.playerId} className="flex min-h-14 items-center gap-3 px-3 py-2">
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {p.name}
                        {p.playerId === me ? " (you)" : ""}
                      </span>
                      {p.readyAt ? (
                        <span className="text-xs font-medium text-review">Ready</span>
                      ) : p.playerId === me ? (
                        <Button className="h-11 px-5" onClick={() => void tapStart()}>
                          Start
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Waiting</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  {waitingStart.length
                    ? `Wait until everyone has joined, then each person taps Start. Still waiting on ${waitingStart.length}.`
                    : "Starting…"}
                </p>
                <div className="mt-4">
                  <PaperStartFields
                    total={room.questionCount}
                    count={String(room.questionCount)}
                    onCount={() => undefined}
                    minutes={String(minutes)}
                    onMinutes={() => undefined}
                    templateId={templateId || templates.find((t) => t.bookmarked)?.id || templates[0]?.id || ""}
                    onTemplate={(id) => {
                      setTemplateId(id);
                      rememberPaperPrefs({ template: id, minutes });
                    }}
                    showCount={false}
                    showMinutes={false}
                  />
                </div>
              </section>
            ) : null}

            {room.startedAt && !room.hasSubmitted && !room.endedAt ? (
              <Button className="mt-6 h-12 w-full" onClick={openPaper}>
                Open paper
              </Button>
            ) : null}

            {room.hasSubmitted ? (
              <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" /> Submitted — this paper is locked
              </p>
            ) : null}
          </>
        )}

        {submitted.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Trophy className="size-3.5" /> Scoreboard
            </h2>
            <ol className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
              {submitted.map((p, i) => (
                <li key={p.playerId} className={cn("flex items-center gap-3 px-3 py-3", p.playerId === me && "bg-primary/5")}>
                  <span className="w-6 text-sm tabular-nums text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {p.name}
                    {p.playerId === me ? " (you)" : ""}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {p.score}/{p.total}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {room.hasSubmitted && !summary && !lookupError && (
          <div className="mt-6 rounded-lg border border-border bg-card px-4 py-5 text-center">
            <p className="text-sm font-medium">Waiting to swap summaries</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Another participant needs to submit so papers can be shuffled. You will never be shown your own summary.
            </p>
          </div>
        )}

        {looking ? <p className="mt-6 text-center text-sm text-muted-foreground">Opening that summary…</p> : null}
        {lookupError ? <p className="mt-6 text-center text-sm text-destructive">{lookupError}</p> : null}

        {summary ? (
          <QuizSummaryViewOnly summary={summary} testDay={dayLabel} folder={room.folder} />
        ) : null}

        {room.hasSubmitted ? (
          <section className="mt-6 grid gap-3">
            {room.myViewCode ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-3 text-center">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">Your view code</p>
                <p className="mt-1 font-mono text-xl font-semibold tracking-[0.28em]">{room.myViewCode}</p>
                <Button variant="ghost" size="sm" className="mt-1" onClick={() => copyViewCode(room.myViewCode!)}>
                  <Copy className="size-4" /> Copy so friends can open yours
                </Button>
              </div>
            ) : null}
            <Label htmlFor="view-code">Open another summary</Label>
            <div className="flex gap-2">
              <Input
                id="view-code"
                value={viewInput}
                onChange={(e) => setViewInput(e.target.value.toUpperCase())}
                placeholder="Code under a summary"
                className="font-mono tracking-widest"
                autoCapitalize="characters"
              />
              <Button variant="outline" onClick={openViewCode}>
                Open summary
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the code shown under a friend’s summary to view it. It stays read-only.
            </p>
          </section>
        ) : null}

        {joined ? (
          <>
            <QuizLiveBar
              code={code}
              name={name || rememberedQuizName()}
              messages={room.messages}
              onRoom={setRoom}
              phase={!room.startedAt ? "before" : live ? "during" : "after"}
            />
            <section className="mt-8 rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold tracking-tight">Leave the room</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>End call turns off camera and mic. Chat stays open until you disconnect.</li>
              <li>End test closes the paper for everyone still writing and builds results.</li>
              <li>Disconnect leaves chat and the call. You can exit on your own.</li>
            </ol>
            <div className="mt-4 grid gap-2">
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new Event("setpaper-end-call"))}
              >
                <PhoneOff className="size-4" /> End call
              </Button>
              <Button variant="outline" onClick={terminate} disabled={Boolean(room.endedAt)}>
                End test
              </Button>
              <Button variant="outline" onClick={() => void disconnect()}>
                <LogOut className="size-4" /> Disconnect
              </Button>
            </div>
          </section>
          </>
        ) : null}
      </div>
    </StudyShell>
  );
}
