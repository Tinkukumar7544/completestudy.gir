import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { cardsForBucket, lastSessionForDeck, type ResultBucket } from "@/lib/exam/results";
import { useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/session/$deckId")({
  validateSearch: (raw: Record<string, unknown>) => ({ id: String(raw.id ?? "") }),
  component: SessionEnd,
});

function SessionEnd() {
  const { deckId } = Route.useParams();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
  const lastSession = useExamStore((s) => s.lastSession);
  const sessions = useExamStore((s) => s.sessions ?? []);
  const templates = useExamStore((s) => s.templates ?? []);

  const deckSessions = sessions.filter((s) => s.deckId === deckId);
  const session =
    (id ? deckSessions.find((s) => s.id === id) ?? (lastSession?.id === id ? lastSession : null) : null) ??
    (lastSession?.deckId === deckId ? lastSession : null) ??
    lastSessionForDeck(deckSessions, deckId);

  if (!deck || !session) {
    return (
      <StudyShell title="Session">
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">No session yet. Study the deck first.</p>
          <Link to="/overview/$deckId" params={{ deckId }} className="mt-3 inline-block text-primary">
            Deck overview
          </Link>
        </div>
      </StudyShell>
    );
  }

  const result = session;
  const template = templates.find((t) => t.id === result.templateId) ?? templates.find((t) => t.bookmarked);
  const rows: Array<{ pick: ResultBucket; label: string; count: number; tone: "learn" | "mark" | "new" | "review" }> = [
    { pick: "wrong", label: "Wrong", count: result.wrong, tone: "learn" },
    { pick: "marked", label: "Review", count: result.marked, tone: "mark" },
    { pick: "skipped", label: "Skipped", count: result.notAttempted, tone: "new" },
    { pick: "correct", label: "Correct", count: result.correct, tone: "review" },
  ];

  function practice(pick: ResultBucket, count: number) {
    const live = cardsForBucket(useExamStore.getState().cards, deckId, pick).length;
    const n = live || count;
    if (!n) return;
    void navigate({
      to: "/study/$deckId",
      params: { deckId },
      search: {
        mode: "custom",
        pick,
        count: n,
        paper: "",
        quiz: "",
        session: "",
      },
    });
  }

  return (
    <StudyShell title="Study complete">
      <div className="mx-auto max-w-md px-5 py-8 text-center">
        <p className="text-lg font-medium">{deck.name.split("::").pop()}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-review">{result.correct}</span>/{result.total} correct
          {result.wrong ? (
            <>
              {" "}
              · <span className="font-semibold text-learn">{result.wrong} wrong</span>
            </>
          ) : null}
        </p>
        {template ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Saved on {template.name}
            {template.lastResult?.sessionId === result.id ? " · kept on this template" : ""}
          </p>
        ) : null}

        <ul className="surface-3d mx-auto mt-6 max-w-xs overflow-hidden text-left text-base">
          {rows.map((row) => (
            <li key={row.pick} className="border-b border-border last:border-b-0">
              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-between px-4 py-2 disabled:opacity-40"
                disabled={row.count === 0}
                onClick={() => practice(row.pick, row.count)}
              >
                <span>{row.label}</span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    row.tone === "learn" && "text-learn",
                    row.tone === "mark" && "text-mark",
                    row.tone === "new" && "text-new",
                    row.tone === "review" && "text-review",
                  )}
                >
                  {row.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-2 max-w-xs text-xs text-muted-foreground">
          Tap a category to practice those questions from this paper.
        </p>

        <Button
          variant="outline"
          className="mt-5 h-12 w-full max-w-xs"
          disabled={result.wrong + result.correct === 0}
          onClick={() => practice("attempted", result.wrong + result.correct)}
        >
          Practice attempted
        </Button>

        {deckSessions.length > 1 ? (
          <div className="mx-auto mt-8 max-w-xs text-left">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">All results</p>
            <ul className="mt-2 divide-y divide-border rounded-md border border-border bg-card">
              {deckSessions.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm",
                      s.id === result.id && "bg-muted/70",
                    )}
                    onClick={() => void navigate({ to: "/session/$deckId", params: { deckId }, search: { id: s.id } })}
                  >
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                    <span className="font-semibold tabular-nums">
                      <span className="text-review">{s.correct}</span>
                      <span className="text-muted-foreground">/{s.total}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Button variant="outline" className="mt-6 w-full max-w-xs" onClick={() => void navigate({ to: "/overview/$deckId", params: { deckId } })}>
          Deck overview
        </Button>
      </div>
    </StudyShell>
  );
}
