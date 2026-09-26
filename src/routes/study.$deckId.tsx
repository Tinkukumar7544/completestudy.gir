import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getQuizPaper, listQuiz, submitQuizScore, type QuizRoom } from "@/lib/exam/quiz";
import { quizPlayerId, rememberedQuizName } from "@/lib/exam/quiz-client";
import { formatCountdown, lockUntilMs, remainingMs } from "@/lib/exam/quiz-assign";
import { pickQuestions, splitIntoSections } from "@/lib/exam/sections";
import { activeExamTemplate, studyCards, useExamStore } from "@/lib/exam/store";
import { applyOptionOrder, injectExamData, resolveTemplateHtml, withPatternSettings } from "@/lib/exam/template";
import type { Card, ExamCompletePayload, Question } from "@/lib/exam/types";
import { cardsForBucket, idsForSessionPick, lastSessionForDeck, type ResultBucket } from "@/lib/exam/results";
import { deckReviewDays, isReviewDayFolder } from "@/lib/exam/review-ladder";
import { QuizLiveBar } from "@/components/quiz-call";

type StudyPick =
  | "due"
  | "new"
  | "random"
  | "all"
  | "forgotten"
  | "ahead"
  | "paper"
  | "wrong"
  | "skipped"
  | "marked"
  | "correct"
  | "attempted";

type Search = {
  mode: "study" | "custom" | "preview";
  pick: StudyPick;
  count: number;
  paper: string;
  quiz: string;
  session: string;
  template?: string;
  minutes?: number;
};

const PICKS: StudyPick[] = [
  "due",
  "new",
  "random",
  "all",
  "forgotten",
  "ahead",
  "paper",
  "wrong",
  "skipped",
  "marked",
  "correct",
  "attempted",
];

export const Route = createFileRoute("/study/$deckId")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const minutes = Number(raw.minutes);
    const template = String(raw.template ?? "").trim();
    return {
      mode: raw.mode === "custom" || raw.mode === "preview" ? raw.mode : "study",
      pick: PICKS.includes(raw.pick as StudyPick) ? (raw.pick as StudyPick) : "due",
      count: Number.isFinite(Number(raw.count)) && Number(raw.count) > 0 ? Math.floor(Number(raw.count)) : 0,
      paper: String(raw.paper ?? ""),
      quiz: String(raw.quiz ?? "").toUpperCase(),
      session: String(raw.session ?? ""),
      template: template || undefined,
      minutes: Number.isFinite(minutes) && minutes > 0 ? Math.floor(minutes) : undefined,
    };
  },
  component: Study,
});

function poolFor(deckId: string, pick: Search["pick"], paperId: string, sessionId: string): Card[] {
  const { cards, papers, sessions, lastSession, decks } = useExamStore.getState();
  const reviewDeck = decks.find((deck) => deck.id === deckId);
  const reviewDays = deckReviewDays(reviewDeck);
  const mine = isReviewDayFolder(reviewDeck)
    ? cards.filter((c) => c.reviewBucket === deckId && c.queue !== "suspended" && c.queue !== "buried")
    : reviewDays
    ? cards.filter((c) => c.reviewStage === reviewDays && c.queue !== "suspended" && c.queue !== "buried")
    : cards.filter((c) => c.deckId === deckId && c.queue !== "suspended" && c.queue !== "buried");
  if (sessionId && (pick === "wrong" || pick === "skipped" || pick === "marked" || pick === "correct" || pick === "attempted")) {
    const session = (sessions ?? []).find((s) => s.id === sessionId) ?? (lastSession?.id === sessionId ? lastSession : null);
    if (session) {
      const order = new Map(idsForSessionPick(session, pick).map((id, i) => [id, i]));
      return mine.filter((c) => order.has(c.id)).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }
  }
  if (pick === "due") return studyCards(deckId);
  if (pick === "new") return mine.filter((c) => c.queue === "new");
  if (pick === "forgotten") return mine.filter((c) => c.lastRating === "again" || c.lapses > 0);
  if (pick === "ahead") return mine.filter((c) => c.queue === "review");
  if (pick === "all") return mine;
  if (pick === "wrong" || pick === "skipped" || pick === "marked" || pick === "correct" || pick === "attempted") {
    return cardsForBucket(cards, deckId, pick as ResultBucket);
  }
  if (pick === "paper") {
    const file = papers.find((p) => p.id === paperId);
    if (!file) return [];
    const order = new Map(file.questionIds.map((id, i) => [id, i]));
    const pool = file.id.startsWith("review-paper:") ? cards : mine;
    return pool
      .filter((c) => order.has(c.id))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }
  return mine;
}

function asCards(questions: Question[]): Card[] {
  const now = Date.now();
  return questions.map((q) => ({
    id: q.id,
    deckId: "quiz",
    type: q.type,
    rule: q.rule,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    tags: [],
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
  }));
}

function withQuizLock(html: string, lockUntil: number): string {
  if (!(lockUntil > Date.now())) return html;
  const tag = `<script>window.__setpaperLockUntil=${lockUntil};</script>`;
  if (/<head>/i.test(html)) return html.replace(/<head>/i, `<head>${tag}`);
  return tag + html;
}

function Study() {
  const { deckId } = Route.useParams();
  const { mode, pick, count, paper, quiz, session, template: templateId, minutes } = Route.useSearch();
  const navigate = useNavigate();
  const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
  const prefs = useExamStore((s) => s.prefs);
  const templates = useExamStore((s) => s.templates);
  const applyExamResults = useExamStore((s) => s.applyExamResults);
  const recorded = useRef(false);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState<string | null>(null);
  const [quizQs, setQuizQs] = useState<Card[] | null>(null);
  const [lockUntil, setLockUntil] = useState(0);
  const [quizRoom, setQuizRoom] = useState<QuizRoom | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!quiz) {
      setQuizQs(null);
      setQuizTitle(null);
      return;
    }
    let cancelled = false;
    void getQuizPaper({ data: quiz })
      .then((paperData) => {
        if (cancelled) return;
        setQuizTitle(paperData.title);
        setQuizQs(asCards(paperData.questions));
        setLockUntil(lockUntilMs(paperData.startedAt, paperData.timeLimitSec, paperData.serverNow));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load friends quiz");
      });
    return () => {
      cancelled = true;
    };
  }, [quiz]);

  useEffect(() => {
    if (!quiz) return;
    let cancelled = false;
    async function refresh() {
      try {
        const next = await listQuiz({ data: { code: quiz, playerId: quizPlayerId() } });
        if (!cancelled) setQuizRoom(next);
      } catch {
        /* keep last */
      }
    }
    void refresh();
    const t = window.setInterval(() => void refresh(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [quiz]);

  useEffect(() => {
    if (!lockUntil) return;
    const t = window.setInterval(() => setNow(Date.now()), 400);
    return () => window.clearInterval(t);
  }, [lockUntil]);

  const paperQs = useMemo(() => {
    if (quiz) return quizQs ?? [];
    const pool = poolFor(deckId, pick, paper, session);
    const n = count > 0 ? count : pool.length;
    const order = pick === "random" || pick === "all" ? "random" : "first";
    return pickQuestions(pool, n, order);
  }, [deckId, pick, count, paper, quiz, quizQs, session]);

  const title = quiz ? quizTitle ?? "Friends quiz" : deck?.name.split("::").pop() ?? deck?.name ?? "Study";
  const canBuild = quiz ? quizQs !== null : Boolean(deck);

  useEffect(() => {
    if (!canBuild) return;
    if (paperQs.length === 0) {
      if (quiz && quizQs === null) return;
      setError("No questions in this study session.");
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const chosen =
          (templateId && templates.find((t) => t.id === templateId)) || activeExamTemplate();
        const pattern = { ...chosen.pattern };
        if (minutes && minutes > 0 && paperQs.length) {
          pattern.timerMode = "overall";
          pattern.minutesPerQuestion = Math.max(0.5, Math.round((minutes / paperQs.length) * 2) / 2);
          pattern.extraMinutes = 0;
        }
        const template = await resolveTemplateHtml(chosen);
        const ordered = applyOptionOrder(paperQs, pattern.optionOrder);
        const data = withPatternSettings(
          splitIntoSections(ordered, pattern.sectionSize, pattern.minutesPerQuestion, {
            title: pattern.examTitle.trim() || title,
            subtitle: quiz
              ? `Friends quiz ${quiz}`
              : pick === "paper"
                ? "Saved paper"
                : pick === "wrong"
                  ? "Wrong questions"
                  : pick === "skipped"
                    ? "Unattempted questions"
                    : pick === "marked"
                      ? "Marked for review"
                      : pick === "correct"
                        ? "Correct answers"
                        : pick === "attempted"
                          ? "Attempted questions"
                          : mode === "preview"
                            ? "Preview — answers not scheduled"
                            : "Study session",
            footer: `${ordered.length} questions · sections of ${pattern.sectionSize}`,
            candidateName: pattern.candidateName,
            candidateId: pattern.candidateId,
          }, pattern),
          pattern,
        );
        if (!cancelled) setSrcDoc(withQuizLock(injectExamData(template, data), lockUntil));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not build the paper.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canBuild, paperQs, mode, pick, quiz, quizQs, title, templates, lockUntil, templateId, minutes]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as { source?: string; type?: string; payload?: ExamCompletePayload };
      if (data?.source !== "setpaper-exam" || data.type !== "exam-complete" || !data.payload) return;
      if (recorded.current) return;
      recorded.current = true;
      const payload = data.payload;
      if (quiz) {
        void submitQuizScore({
          data: {
            code: quiz,
            playerId: quizPlayerId(),
            name: rememberedQuizName() || "Friend",
            correct: payload.correct,
            wrong: payload.wrong,
            notAttempted: payload.notAttempted,
            marked: payload.marked,
            total: payload.total,
            score: payload.score ?? payload.correct,
            items: payload.items ?? [],
          },
        })
          .then(() => {
            void navigate({ to: "/quiz/$code", params: { code: quiz }, search: { view: "" } });
          })
          .catch((err) => {
            const message = err instanceof Error ? err.message : "Could not save score";
            toast.error(message);
            if (/until time is up/i.test(message)) {
              recorded.current = false;
              return;
            }
            void navigate({ to: "/quiz/$code", params: { code: quiz }, search: { view: "" } });
          });
        return;
      }
      if (!deck) return;
      if (mode === "preview") {
        toast.success(`Preview finished · ${payload.correct}/${payload.total}`);
        return;
      }
      const retry = Boolean(session) || pick === "wrong" || pick === "skipped" || pick === "marked" || pick === "correct" || pick === "attempted" || pick === "paper";
      const parent = retry
        ? session || lastSessionForDeck(useExamStore.getState().sessions ?? [], deck.id)?.id || useExamStore.getState().lastSession?.id
        : undefined;
      const summary = applyExamResults(deck.id, payload, { parentSessionId: parent, merge: retry });
      void navigate({ to: "/session/$deckId", params: { deckId: deck.id }, search: { id: summary.id } });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [applyExamResults, deck, mode, navigate, pick, quiz, session]);

  if (!quiz && !deck) {
    return <p className="p-6 text-sm">Deck not found.</p>;
  }
  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-lg">{error}</p>
        {quiz ? (
          <Link to="/quiz/$code" params={{ code: quiz }} search={{}} className="text-primary">
            Back to scores
          </Link>
        ) : (
          <Link to="/overview/$deckId" params={{ deckId }} className="text-primary">
            Deck overview
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-bar">
      <div className="flex h-11 shrink-0 items-center justify-between px-2 text-bar-foreground">
        {quiz ? (
          <Link to="/quiz/$code" params={{ code: quiz }} search={{}} className="inline-flex h-9 items-center gap-1 px-2 text-sm">
            <ArrowLeft className="size-4" />
          </Link>
        ) : (
          <Link to="/overview/$deckId" params={{ deckId }} className="inline-flex h-9 items-center gap-1 px-2 text-sm">
            <ArrowLeft className="size-4" />
          </Link>
        )}
        <span className="truncate text-sm">{title}</span>
        {quiz && lockUntil ? (
          <span className="px-2 font-mono text-xs tabular-nums">{formatCountdown(remainingMs(lockUntil, now))}</span>
        ) : prefs.showRemaining ? (
          <span className="px-2 font-mono text-xs tabular-nums">{paperQs.length || ""}</span>
        ) : (
          <span className="w-8" />
        )}
      </div>
      {quiz ? (
        <QuizLiveBar
          compact
          code={quiz}
          name={rememberedQuizName()}
          messages={quizRoom?.messages ?? []}
          onRoom={setQuizRoom}
        />
      ) : null}
      {srcDoc ? (
        <iframe
          title="Study"
          className="min-h-0 w-full flex-1 border-0 bg-white"
          sandbox="allow-scripts allow-modals allow-same-origin"
          srcDoc={srcDoc}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center bg-background text-sm text-muted-foreground">Building paper…</div>
      )}
    </div>
  );
}
