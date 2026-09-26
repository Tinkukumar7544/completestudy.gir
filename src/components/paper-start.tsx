import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

export function PaperStartFields({
  total,
  count,
  onCount,
  minutes,
  onMinutes,
  templateId,
  onTemplate,
  showCount = true,
  showMinutes = true,
}: {
  total: number;
  count: string;
  onCount: (value: string) => void;
  minutes: string;
  onMinutes: (value: string) => void;
  templateId: string;
  onTemplate: (value: string) => void;
  showCount?: boolean;
  showMinutes?: boolean;
}) {
  const templates = useExamStore((s) => s.templates ?? []);
  const rows = templates.length ? templates : [];
  const both = showCount && showMinutes;

  return (
    <div className="grid min-w-0 gap-2">
      <div className="grid min-w-0 gap-1">
        <Label htmlFor="paper-template" className="text-xs text-muted-foreground">
          Template
        </Label>
        <select
          id="paper-template"
          className="h-11 w-full min-w-0 max-w-full truncate rounded-lg border border-border bg-card px-3 text-sm shadow-raised"
          value={templateId}
          onChange={(e) => onTemplate(e.target.value)}
        >
          {rows.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {t.bookmarked ? " · active" : ""}
            </option>
          ))}
        </select>
      </div>
      {showCount || showMinutes ? (
        <div className={cn("grid min-w-0 gap-2", both && "grid-cols-2")}>
          {showCount ? (
            <div className="grid min-w-0 gap-1">
              <Label htmlFor="paper-count" className="text-xs text-muted-foreground">
                Questions
              </Label>
              <Input
                id="paper-count"
                inputMode="numeric"
                value={count}
                onChange={(e) => onCount(e.target.value.replace(/[^\d]/g, ""))}
                aria-label="Number of questions"
                className="min-w-0 tabular-nums"
              />
              <p className="truncate text-xs text-muted-foreground">{total} in this test</p>
            </div>
          ) : null}
          {showMinutes ? (
            <div className="grid min-w-0 gap-1">
              <Label htmlFor="paper-minutes" className="text-xs text-muted-foreground">
                Time (min)
              </Label>
              <Input
                id="paper-minutes"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => onMinutes(e.target.value.replace(/[^\d]/g, ""))}
                aria-label="Time limit in minutes"
                className="min-w-0 tabular-nums"
              />
              <p className="truncate text-xs text-muted-foreground">1–180 min</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function clampPaperMinutes(raw: string, fallback = 20): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.max(1, Math.min(180, Math.floor(n)));
}

export function clampPaperCount(raw: string, total: number, fallback = 20): number {
  const n = Number(raw);
  const cap = Math.max(1, total || 1);
  if (!Number.isFinite(n) || n <= 0) return Math.min(fallback, cap);
  return Math.max(1, Math.min(cap, Math.floor(n)));
}
