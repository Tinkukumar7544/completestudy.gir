import { createFileRoute } from "@tanstack/react-router";
import { StudyShell } from "@/components/study-shell";
import { forecast } from "@/lib/exam/scheduler";
import { useExamStore } from "@/lib/exam/store";

export const Route = createFileRoute("/stats")({ component: Stats });

function Stats() {
  const cards = useExamStore((s) => s.cards);
  const revlog = useExamStore((s) => s.revlog);
  const prefs = useExamStore((s) => s.prefs);
  const start = new Date();
  start.setHours(prefs.dayStartHour, 0, 0, 0);
  const todayLogs = revlog.filter((r) => r.at >= start.getTime());
  const again = todayLogs.filter((r) => r.rating === "again").length;
  const hard = todayLogs.filter((r) => r.rating === "hard").length;
  const good = todayLogs.filter((r) => r.rating === "good").length;
  const easy = todayLogs.filter((r) => r.rating === "easy").length;
  const fc = forecast(cards, 14);
  const max = Math.max(1, ...fc);
  const nNew = cards.filter((c) => c.queue === "new").length;
  const nLearn = cards.filter((c) => c.queue === "learn" || c.queue === "relearn").length;
  const nRev = cards.filter((c) => c.queue === "review").length;
  const nSus = cards.filter((c) => c.queue === "suspended" || c.queue === "buried").length;

  return (
    <StudyShell title="Statistics">
      <section className="border-b border-border bg-card px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground">Today</h2>
        <p className="mt-2 text-3xl font-medium tabular-nums">{todayLogs.length}</p>
        <p className="text-sm text-muted-foreground">questions answered</p>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
          <Stat n={again} label="Again" className="text-learn" />
          <Stat n={hard} label="Hard" className="text-foreground" />
          <Stat n={good} label="Good" className="text-review" />
          <Stat n={easy} label="Easy" className="text-new" />
        </div>
      </section>
      <section className="border-b border-border bg-card px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground">Forecast (14 days)</h2>
        <div className="mt-3 flex h-28 items-end gap-1">
          {fc.map((n, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-sm bg-primary" style={{ height: `${(n / max) * 100}%`, minHeight: n ? 4 : 0 }} />
              <span className="text-[9px] text-muted-foreground">{i === 0 ? "T" : i + 1}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-card px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground">Question counts</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between">
            <span>New</span>
            <span className="tabular-nums text-new">{nNew}</span>
          </li>
          <li className="flex justify-between">
            <span>Learning</span>
            <span className="tabular-nums text-learn">{nLearn}</span>
          </li>
          <li className="flex justify-between">
            <span>Review</span>
            <span className="tabular-nums text-review">{nRev}</span>
          </li>
          <li className="flex justify-between">
            <span>Suspended / buried</span>
            <span className="tabular-nums">{nSus}</span>
          </li>
          <li className="flex justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">{cards.length}</span>
          </li>
        </ul>
      </section>
    </StudyShell>
  );
}

function Stat({ n, label, className }: { n: number; label: string; className?: string }) {
  return (
    <div>
      <div className={`text-lg font-medium tabular-nums ${className ?? ""}`}>{n}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
