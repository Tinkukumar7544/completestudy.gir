import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { StudyShell } from "@/components/study-shell";
import { Glyph3D } from "@/components/glyphs";
import { PaperStartFields, clampPaperCount, clampPaperMinutes } from "@/components/paper-start";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { rememberPaperPrefs } from "@/lib/exam/clipboard";
import { isCorrectCard, isMarkedCard, isWrongCard, paperKindLabel, resultCounts } from "@/lib/exam/results";
import { isReviewDayFolder, reviewLocked } from "@/lib/exam/review-ladder";
import { ensureDaily, deckCounts } from "@/lib/exam/scheduler";
import { defaultConfig, type Card, type SessionSummary } from "@/lib/exam/types";
import { activeExamTemplate, studyCards, useExamStore } from "@/lib/exam/store";

export const Route = createFileRoute("/overview/$deckId")({ component: Overview });

function Overview() {
  const { deckId } = Route.useParams();
  const navigate = useNavigate();
  const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
  const cards = useExamStore((s) => s.cards);
  const configs = useExamStore((s) => s.configs);
  const dailyRaw = useExamStore((s) => s.daily);
  const prefs = useExamStore((s) => s.prefs);
  const unburyDeck = useExamStore((s) => s.unburyDeck);
  const papers = useExamStore((s) => s.papers);
  const sessions = useExamStore((s) => s.sessions ?? []);
  const lastSession = useExamStore((s) => s.lastSession);
  const dayFolder = isReviewDayFolder(deck);
  const total = dayFolder
    ? cards.filter((card) => card.reviewBucket === deckId).length
    : cards.filter((c) => c.deckId === deckId).length;
  const templates = useExamStore((s) => s.templates ?? []);
  const [customCount, setCustomCount] = useState(() => String(Math.min(20, Math.max(1, total || 20))));
  const [minutes, setMinutes] = useState("20");
  const [templateId, setTemplateId] = useState(() => activeExamTemplate()?.id ?? "");

  const deckSessions = sessions.filter((s) => s.deckId === deckId);
  const sessionRows =
    lastSession?.deckId === deckId && !deckSessions.some((s) => s.id === lastSession.id)
      ? [lastSession, ...deckSessions]
      : deckSessions;

  if (!deck) {
    return (
      <StudyShell title="Test">
        <p className="p-6 text-sm text-muted-foreground">Test not found.</p>
      </StudyShell>
    );
  }

  const config = configs[deck.configId] ?? defaultConfig();
  const daily = ensureDaily(dailyRaw, prefs.dayStartHour);
  const c = deckCounts(cards, deck.id, config, daily, prefs);
  const results = resultCounts(
    dayFolder ? cards.filter((card) => card.reviewBucket === deckId).map((card) => ({ ...card, deckId })) : cards,
    deckId,
  );
  const locked = Boolean(deck && dayFolder && deck.reviewDays && reviewLocked(deck.createdAt, deck.reviewDays as 3 | 7 | 14 | 21));
  const buried = cards.filter((x) => x.deckId === deckId && x.queue === "buried").length;
  const due = c.new + c.learn + c.review;
  const deckPapers = papers.filter((p) => p.deckId === deckId);
  const n = clampPaperCount(customCount, total);
  const mins = clampPaperMinutes(minutes);
  const attempts = sessionRows.slice().sort((a, b) => b.at - a.at);

  function go(pick: "due" | "random" | "all" | "wrong" | "skipped" | "marked" | "correct" | "attempted", count: number, session = "") {
    rememberPaperPrefs({ template: templateId, minutes: mins });
    void navigate({
      to: "/study/$deckId",
      params: { deckId },
      search: {
        mode: pick === "due" ? "study" : "custom",
        pick,
        count,
        paper: "",
        quiz: "",
        session,
        template: templateId || undefined,
        minutes: mins,
      },
    });
  }

  return (
    <StudyShell title={deck.name.split("::").pop()}>
      <div className="mx-auto w-full min-w-0 max-w-md px-5 pt-4 pb-10 text-center">
        <div className="mx-auto mb-5 grid place-items-center">
          <Glyph3D name={deck.name.includes("::") ? "subdeck" : "deck"} alt="" size="lg" />
        </div>
        {deck.description ? <p className="mb-5 text-sm text-muted-foreground">{deck.description}</p> : null}
        {locked ? <p className="mb-4 text-sm text-muted-foreground">This folder is locked. The attempt window has ended.</p> : null}

        <div className="mx-auto mt-1 grid w-full min-w-0 max-w-xs gap-3 text-left">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Start</p>
            <div className="mt-2 min-w-0">
              <PaperStartFields
                total={total}
                count={customCount}
                onCount={setCustomCount}
                minutes={minutes}
                onMinutes={setMinutes}
                templateId={templateId || templates.find((t) => t.bookmarked)?.id || templates[0]?.id || ""}
                onTemplate={setTemplateId}
              />
            </div>
          </div>
          <Button className="h-12 w-full" disabled={total === 0 || locked} onClick={() => go("random", n)}>
            Start {n}
          </Button>
          <Button className="h-12 w-full" disabled={total === 0 || locked} onClick={() => go("all", total)}>
            Take Full Paper
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full"
            disabled={total === 0}
            onClick={() => void navigate({ to: "/browser", search: { deck: deckId } })}
          >
            Browse Questions
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full"
            onClick={() => void navigate({ to: "/friends", search: { deck: deckId } })}
          >
            <Users className="size-4" /> Friend Quiz
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full"
            disabled={due === 0}
            onClick={() => {
              const q = studyCards(deckId);
              go("due", q.length);
            }}
          >
            Study
          </Button>
          {buried > 0 ? (
            <Button variant="outline" className="h-12 w-full" onClick={() => unburyDeck(deckId)}>
              Unbury {buried}
            </Button>
          ) : null}
        </div>

        <AttemptTable
          cards={cards.filter((card) => card.deckId === deckId)}
          total={total}
          correct={results.correct}
          wrong={results.wrong}
          marked={results.marked}
          attempts={attempts}
        />

        {deckPapers.length > 0 && (
          <div className="mx-auto mt-6 max-w-xs text-left">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Practice later</p>
            <ul className="mt-2 divide-y divide-border rounded-md border border-border bg-card">
              {deckPapers.slice(0, 8).map((p) => (
                <li key={p.id}>
                  <button
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm"
                    onClick={() =>
                      void navigate({
                        to: "/study/$deckId",
                        params: { deckId },
                        search: { mode: "custom", pick: "paper", count: p.questionIds.length, paper: p.id, quiz: "", session: "" },
                      })
                    }
                  >
                    <span>{p.title || paperKindLabel(p.kind)}</span>
                    <span className="text-xs text-muted-foreground">{p.questionIds.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </StudyShell>
  );
}

function attemptDate(at: number, attempts: SessionSummary[]) {
  const day = new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const shared = attempts.filter((session) => new Date(session.at).toLocaleDateString(undefined, { day: "numeric", month: "short" }) === day);
  if (shared.length < 2) return day;
  return `${day} ${new Date(at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}

function AttemptTable({
  cards,
  total,
  correct,
  wrong,
  marked,
  attempts,
}: {
  cards: Card[];
  total: number;
  correct: number;
  wrong: number;
  marked: number;
  attempts: SessionSummary[];
}) {
  const [open, setOpen] = useState<{ title: string; cards: Card[] } | null>(null);
  const completed = correct + wrong;
  const unattempted = Math.max(0, total - completed);
  const allDone = total > 0 && completed >= total;
  const fresh = allDone ? 0 : unattempted + wrong + marked;
  const rows: Array<{
    label: string;
    total: string | number;
    value: (session: SessionSummary) => number;
  }> = [
    { label: "Selected", total, value: (session) => session.total },
    { label: "Completed", total: completed, value: (session) => session.correct + session.wrong },
    { label: "Correct", total: correct, value: (session) => session.correct },
    { label: "Incorrect", total: wrong, value: (session) => session.wrong },
    { label: "Unattempted", total: unattempted, value: (session) => session.notAttempted },
    {
      label: "New",
      total: fresh,
      value: (session) => (session.total > 0 && session.notAttempted === 0 ? 0 : session.notAttempted + session.wrong + session.marked),
    },
    { label: "Mark", total: marked, value: (session) => session.marked },
    { label: "Marks", total: total ? `${correct}/${total}` : 0, value: (session) => session.correct },
  ];

  function show(label: string, session: SessionSummary | null) {
    setOpen({
      title: session ? `${label} · ${attemptDate(session.at, attempts)}` : label,
      cards: questionsForStatus(label, cards, session),
    });
  }

  return (
    <div className="mt-8 grid gap-4 text-left">
      <StatusBlock title="Total" rows={rows} session={null} onNumber={show} />
      {attempts.map((session) => (
        <StatusBlock key={session.id} title={attemptDate(session.at, attempts)} rows={rows} session={session} onNumber={show} />
      ))}
      <p className="text-xs text-muted-foreground">
        New includes questions not yet tested, unattempted questions, incorrect answers, and marked questions. It returns to zero when every question has been completed.
      </p>
      <Dialog open={Boolean(open)} onOpenChange={(next) => { if (!next) setOpen(null); }}>
        <DialogContent className="max-h-[90dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
          </DialogHeader>
          {open && open.cards.length === 0 ? <p className="text-sm text-muted-foreground">No questions in this group.</p> : null}
          <ol className="grid gap-4">
            {open?.cards.map((card, index) => (
              <li key={card.id} className="grid gap-2 border-b border-border pb-4 text-sm">
                <p className="font-medium">{index + 1}. {card.question}</p>
                {card.type === "numerical" ? null : (
                  <ul className="grid gap-1">
                    {card.options.map((option, optionIndex) => (
                      <li key={optionIndex} className={optionChosen(card, optionIndex) ? "font-medium text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
                <p><span className="font-medium">Answer. </span>{answerText(card) || "Not set"}</p>
                <p><span className="font-medium">Description. </span>{card.explanation.trim() || "No description"}</p>
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  Selected: "text-blue-600 dark:text-blue-400",
  Completed: "text-foreground",
  Correct: "text-green-600 dark:text-green-400",
  Incorrect: "text-red-600 dark:text-red-400",
  Unattempted: "text-amber-700 dark:text-amber-400",
  New: "text-blue-600 dark:text-blue-400",
  Mark: "text-violet-600 dark:text-violet-400",
  Marks: "text-teal-700 dark:text-teal-400",
};

function StatusBlock({
  title,
  rows,
  session,
  onNumber,
}: {
  title: string;
  rows: Array<{ label: string; total: string | number; value: (session: SessionSummary) => number }>;
  session: SessionSummary | null;
  onNumber: (label: string, session: SessionSummary | null) => void;
}) {
  return (
    <section>
      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {rows.map((row) => {
          const color = STATUS_COLOR[row.label] ?? "text-foreground";
          const shown = session ? row.value(session) : row.total;
          const empty = session ? row.value(session) === 0 : Number(row.total) === 0 || row.total === "0/0";
          return (
            <li key={row.label} className="flex h-11 items-center justify-between gap-4 px-3">
              <span className={`text-sm font-medium ${color}`}>{row.label}</span>
              <button
                type="button"
                className={`w-16 shrink-0 text-right text-sm font-semibold tabular-nums ${color} disabled:opacity-40`}
                disabled={empty}
                onClick={() => onNumber(row.label, session)}
              >
                {shown}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function idsOf(session: SessionSummary, key: "wrong" | "skipped" | "marked" | "correct") {
  if (key === "wrong") return session.wrongIds ?? session.againIds ?? [];
  if (key === "skipped") return session.skippedIds ?? [];
  if (key === "marked") return session.markedIds ?? session.hardIds ?? [];
  return session.correctIds ?? session.goodIds ?? [];
}

function questionsForStatus(label: string, cards: Card[], session: SessionSummary | null): Card[] {
  if (session) {
    const byId = new Map(cards.map((card) => [card.id, card]));
    const take = (...groups: string[][]) => {
      const seen = new Set<string>();
      const list: Card[] = [];
      for (const id of groups.flat()) {
        if (seen.has(id)) continue;
        const card = byId.get(id);
        if (!card) continue;
        seen.add(id);
        list.push(card);
      }
      return list;
    };
    const wrong = idsOf(session, "wrong");
    const skipped = idsOf(session, "skipped");
    const marked = idsOf(session, "marked");
    const correct = idsOf(session, "correct");
    if (label === "Selected") return take(wrong, skipped, correct);
    if (label === "Completed") return take(wrong, correct);
    if (label === "Correct" || label === "Marks") return take(correct);
    if (label === "Incorrect") return take(wrong);
    if (label === "Unattempted") return take(skipped);
    if (label === "Mark") return take(marked);
    if (session.total > 0 && session.notAttempted === 0) return [];
    return take(skipped, wrong, marked);
  }
  const attempted = cards.filter((card) => isCorrectCard(card) || isWrongCard(card));
  const missed = cards.filter((card) => !isCorrectCard(card) && !isWrongCard(card));
  if (label === "Selected") return cards;
  if (label === "Completed") return attempted;
  if (label === "Correct" || label === "Marks") return cards.filter(isCorrectCard);
  if (label === "Incorrect") return cards.filter(isWrongCard);
  if (label === "Unattempted") return missed;
  if (label === "Mark") return cards.filter(isMarkedCard);
  if (cards.length > 0 && attempted.length >= cards.length) return [];
  const ids = new Set<string>([...missed, ...cards.filter(isWrongCard), ...cards.filter(isMarkedCard)].map((card) => card.id));
  return cards.filter((card) => ids.has(card.id));
}

function optionChosen(card: Card, index: number) {
  if (Array.isArray(card.correct)) return card.correct.includes(index);
  return card.correct === index;
}

function answerText(card: Card) {
  if (typeof card.correct === "string") return card.correct;
  if (Array.isArray(card.correct)) return card.correct.map((index) => card.options[index]).filter(Boolean).join(", ");
  return card.options[card.correct] ?? "";
}

