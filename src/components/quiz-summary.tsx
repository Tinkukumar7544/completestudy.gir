import { useMemo, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import {
  correctIndexes,
  formatAnswer,
  optionLetter,
  type QuizSummaryItem,
  type QuizSummaryView,
} from "@/lib/exam/quiz-assign";
import { cn } from "@/lib/utils";

type Bucket = "wrong" | "marked" | "skipped" | "correct" | "attempted" | "all";

const BUCKETS: Array<{ id: Bucket; label: string; tone: "learn" | "mark" | "new" | "review" | "muted" }> = [
  { id: "wrong", label: "Wrong", tone: "learn" },
  { id: "marked", label: "Review", tone: "mark" },
  { id: "skipped", label: "Skipped", tone: "new" },
  { id: "correct", label: "Correct", tone: "review" },
];

function inBucket(item: QuizSummaryItem, bucket: Bucket): boolean {
  if (bucket === "all") return true;
  if (bucket === "wrong") return item.isAttempted && !item.isCorrect;
  if (bucket === "correct") return item.isAttempted && item.isCorrect;
  if (bucket === "skipped") return !item.isAttempted;
  if (bucket === "marked") return item.isMarked;
  return item.isAttempted;
}

function countOf(items: QuizSummaryItem[], bucket: Bucket): number {
  return items.filter((item) => inBucket(item, bucket)).length;
}

function QuestionCard({ item, index }: { item: QuizSummaryItem; index: number }) {
  const [open, setOpen] = useState(false);
  const rights = correctIndexes(item.correct, item.options);
  const picked = Array.isArray(item.userAns)
    ? item.userAns.map(Number)
    : typeof item.userAns === "number"
      ? [item.userAns]
      : [];
  const status = !item.isAttempted ? "Skipped" : item.isCorrect ? "Correct" : "Wrong";
  const tone = !item.isAttempted ? "text-new" : item.isCorrect ? "text-review" : "text-learn";

  return (
    <li className="border-b border-border last:border-b-0">
      <button
        type="button"
        className="flex min-h-12 w-full items-start gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="w-6 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">{index + 1}</span>
        <span className="min-w-0 flex-1 text-sm leading-snug">{item.question}</span>
        <span className={cn("shrink-0 pt-0.5 text-xs font-semibold", tone)}>{status}</span>
        <ChevronDown className={cn("mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="grid gap-3 px-4 pb-4 pl-12">
          <ul className="grid gap-1.5">
            {item.options.map((opt, i) => {
              const isRight = rights.includes(i);
              const isPick = picked.includes(i);
              return (
                <li
                  key={`${item.bankId}-${i}`}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    isRight && "border-review/40 bg-review/10 text-foreground",
                    isPick && !isRight && "border-learn/40 bg-learn/10 text-foreground",
                    !isRight && !isPick && "border-border bg-card text-muted-foreground",
                  )}
                >
                  <span className="font-medium">{optionLetter(i)}.</span> {opt}
                  {isRight ? <span className="ml-2 text-xs font-semibold text-review">Correct</span> : null}
                  {isPick && !isRight ? <span className="ml-2 text-xs font-semibold text-learn">Attempt</span> : null}
                </li>
              );
            })}
          </ul>
          {item.type === "numerical" ? (
            <p className="text-sm">
              Attempt: <span className="font-medium">{formatAnswer(item.userAns, item.options)}</span>
              <span className="mx-2 text-muted-foreground">·</span>
              Correct: <span className="font-medium text-review">{String(item.correct)}</span>
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {item.isAttempted ? "Attempted" : "Not attempted"}
            {item.isMarked ? " · marked for review" : ""}
            {" · "}
            {status}
          </p>
          {item.explanation ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm leading-relaxed text-foreground">
              {item.explanation}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function QuizSummaryViewOnly({
  summary,
  testDay,
  folder,
}: {
  summary: QuizSummaryView;
  testDay?: string;
  folder?: string;
}) {
  const [bucket, setBucket] = useState<Bucket>("all");
  const items = useMemo(() => summary.items.filter((item) => inBucket(item, bucket)), [summary.items, bucket]);
  const attempted = countOf(summary.items, "attempted");

  return (
    <section className="surface-3d mt-6 overflow-hidden">
      <div className="border-b border-border px-4 py-4 text-center">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Test summary</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{summary.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-review">{summary.correct}</span>/{summary.total} correct
          {summary.wrong ? (
            <>
              {" "}
              · <span className="font-semibold text-learn">{summary.wrong} wrong</span>
            </>
          ) : null}
        </p>
        {testDay || folder ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {testDay ? <>Day {testDay}</> : null}
            {testDay && folder ? " · " : null}
            {folder ? <>Folder {folder}</> : null}
          </p>
        ) : null}
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          View only — answers cannot be changed
        </p>
      </div>

      <ul className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {BUCKETS.map((row) => {
          const n =
            row.id === "wrong"
              ? summary.wrong
              : row.id === "correct"
                ? summary.correct
                : row.id === "skipped"
                  ? summary.notAttempted
                  : summary.marked;
          const active = bucket === row.id;
          return (
            <li key={row.id}>
              <button
                type="button"
                className={cn("flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-2 py-2", active && "bg-muted")}
                onClick={() => setBucket(active ? "all" : row.id)}
              >
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <span
                  className={cn(
                    "text-base font-semibold tabular-nums",
                    row.tone === "learn" && "text-learn",
                    row.tone === "mark" && "text-mark",
                    row.tone === "new" && "text-new",
                    row.tone === "review" && "text-review",
                  )}
                >
                  {n}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2 border-t border-border px-3 py-2">
        <button
          type="button"
          className={cn(
            "min-h-10 flex-1 rounded-md px-2 text-xs font-medium",
            bucket === "attempted" ? "bg-muted" : "hover:bg-muted/60",
          )}
          onClick={() => setBucket(bucket === "attempted" ? "all" : "attempted")}
        >
          Attempts {attempted}
        </button>
        <button
          type="button"
          className={cn(
            "min-h-10 flex-1 rounded-md px-2 text-xs font-medium",
            bucket === "all" ? "bg-muted" : "hover:bg-muted/60",
          )}
          onClick={() => setBucket("all")}
        >
          All {summary.total}
        </button>
      </div>

      <ul className="border-t border-border">
        {items.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">Nothing in this list.</li>
        ) : (
          items.map((item, i) => <QuestionCard key={item.bankId} item={item} index={i} />)
        )}
      </ul>

      <div className="border-t border-border px-4 py-4 text-center">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">View code</p>
        <p className="mt-1 font-mono text-2xl font-semibold tracking-[0.28em]">{summary.viewCode}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Enter this code below to open {summary.name}'s summary on another device. Summaries cannot be edited.
        </p>
      </div>
    </section>
  );
}
