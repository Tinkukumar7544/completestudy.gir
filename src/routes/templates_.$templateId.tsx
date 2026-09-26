import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, FileUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { copyHtmlFile, formatBytes, templateHtmlId } from "@/lib/exam/html-store";
import { replaceTemplateHtml } from "@/lib/exam/html-import";
import { BUNDLED_TEMPLATE } from "@/lib/exam/template";
import { useExamStore } from "@/lib/exam/store";
import type { OptionOrder, SectionSize, TimerMode } from "@/lib/exam/types";

export const Route = createFileRoute("/templates_/$templateId")({
  component: TemplateEditor,
});

function Group({ title }: { title: string }) {
  return (
    <h2 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {title}
    </h2>
  );
}

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm">{title}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function selectClass() {
  return "h-11 min-w-32 rounded-lg border border-border bg-card px-3 text-sm";
}

function TemplateEditor() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useExamStore((s) => s.hydrated);
  const template = useExamStore((s) => (s.templates ?? []).find((t) => t.id === templateId));
  const updateTemplate = useExamStore((s) => s.updateTemplate);
  const updateTemplatePattern = useExamStore((s) => s.updateTemplatePattern);
  const bookmarkTemplate = useExamStore((s) => s.bookmarkTemplate);
  const addTemplate = useExamStore((s) => s.addTemplate);
  const deleteTemplate = useExamStore((s) => s.deleteTemplate);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const current = useExamStore.getState().templates.find((t) => t.id === templateId);
    if (current) setName(current.name);
  }, [templateId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (!template) void navigate({ to: "/templates" });
  }, [hydrated, template, navigate]);

  useEffect(() => {
    if (!template) return;
    const timer = window.setTimeout(() => {
      if (name.trim() && name !== template.name) updateTemplate(template.id, { name: name.trim() });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [name, template, updateTemplate]);

  function flush() {
    const current = useExamStore.getState().templates.find((t) => t.id === templateId);
    if (!current) return;
    if (name.trim() && name !== current.name) updateTemplate(current.id, { name: name.trim() });
  }

  function back() {
    flush();
    void navigate({ to: "/templates" });
  }

  async function onReplace(file: File | undefined) {
    if (!file || !template) return;
    setBusy(true);
    const toastId = toast.loading(`Replacing ${file.name}…`);
    try {
      const result = await replaceTemplateHtml(template.id, file, (hint) => toast.loading(hint, { id: toastId }));
      toast.dismiss(toastId);
      toast.success(`HTML replaced (${result.sizeLabel}). Pattern settings and other templates are unchanged.`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Could not replace this template");
    } finally {
      setBusy(false);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }

  async function duplicate() {
    if (!template) return;
    flush();
    const id = addTemplate({
      name: `${template.name} copy`,
      kind: template.kind,
      fileName: template.fileName,
      size: template.size,
      pattern: template.pattern,
      bookmark: false,
    });
    if (template.kind === "uploaded") {
      await copyHtmlFile(templateHtmlId(template.id), templateHtmlId(id));
    }
    toast.success("Copy added. The active template is unchanged.");
    void navigate({ to: "/templates/$templateId", params: { templateId: id } });
  }

  if (!template) {
    return (
      <StudyShell title="Exam template">
        <p className="p-4 text-sm text-muted-foreground">Loading template…</p>
      </StudyShell>
    );
  }

  const p = template.pattern;
  const sizeLabel =
    template.kind === "bundled"
      ? formatBytes(BUNDLED_TEMPLATE.length)
      : template.size
        ? formatBytes(template.size)
        : "On this device";

  return (
    <StudyShell title={template.name || "Exam template"}>
      <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
        <Button type="button" variant="ghost" onClick={back}>
          Back
        </Button>
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          {template.bookmarked ? "Active template" : "Inactive — stored unchanged"}
        </span>
        <Button
          type="button"
          variant={template.bookmarked ? "default" : "outline"}
          size="sm"
          aria-label={template.bookmarked ? "Active template" : "Bookmark as active"}
          onClick={() => {
            bookmarkTemplate(template.id);
            toast.success(`${template.name} is the active template`);
          }}
        >
          {template.bookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          {template.bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
      </div>

      <Group title="Template" />
      <div className="border-b border-border bg-card px-4 py-3">
        <Label htmlFor="template-name">Name</Label>
        <Input
          id="template-name"
          className="mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {template.kind === "bundled" ? "TCS iON paper" : template.fileName || "Uploaded HTML"} · {sizeLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => replaceRef.current?.click()}>
            <FileUp className="size-4" />
            Replace HTML
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void duplicate()}>
            Duplicate
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              deleteTemplate(template.id);
              toast.success("Template removed. Others are unchanged.");
              void navigate({ to: "/templates" });
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
        <input
          ref={replaceRef}
          type="file"
          accept=".html,.htm,text/html"
          className="sr-only"
          aria-label="Replace template HTML"
          onChange={(e) => void onReplace(e.target.files?.[0])}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Replace only updates this template. Upload any HTML test — questions are stripped, the paper layout stays.
        </p>
      </div>

      <Group title="Saved results" />
      {template.lastResult || (template.results && template.results.length) ? (
        <ul className="divide-y divide-border border-b border-border bg-card">
          {(template.results?.length ? template.results : template.lastResult ? [template.lastResult] : []).slice(0, 12).map((row) => (
            <li key={row.sessionId}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                onClick={() => void navigate({ to: "/session/$deckId", params: { deckId: row.deckId }, search: { id: row.sessionId } })}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{row.deckName || "Paper"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(row.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </span>
                <span className="shrink-0 text-sm tabular-nums">
                  <span className="font-semibold text-review">{row.correct}</span>
                  <span className="text-muted-foreground">/{row.total}</span>
                  {row.wrong ? <span className="ml-2 font-medium text-learn">{row.wrong} wrong</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-b border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          After a full paper, correct vs wrong stays on this template.
        </p>
      )}

      <Group title="Paper pattern" />
      <Row title="Questions per section" hint="How the bank is split on the paper">
        <select
          className={selectClass()}
          value={p.sectionSize}
          onChange={(e) => updateTemplatePattern(template.id, { sectionSize: Number(e.target.value) as SectionSize })}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </Row>
      <Row title="Minutes per question" hint="Used to size each section timer">
        <Input
          className="w-24"
          type="number"
          min={0.5}
          step={0.5}
          value={p.minutesPerQuestion}
          onChange={(e) => updateTemplatePattern(template.id, { minutesPerQuestion: Number(e.target.value) || 1 })}
        />
      </Row>
      <Row title="Extra minutes" hint="Added on top of the computed duration">
        <Input
          className="w-24"
          type="number"
          min={0}
          step={1}
          value={p.extraMinutes}
          onChange={(e) => updateTemplatePattern(template.id, { extraMinutes: Math.max(0, Number(e.target.value) || 0) })}
        />
      </Row>
      <Row title="Timer" hint="Section-wise, one clock for the paper, or none">
        <select
          className={selectClass()}
          value={p.timerMode}
          onChange={(e) => updateTemplatePattern(template.id, { timerMode: e.target.value as TimerMode })}
        >
          <option value="section">Section timers</option>
          <option value="overall">One timer</option>
          <option value="off">No timer</option>
        </select>
      </Row>
      <Row title="Show timer">
        <Switch checked={p.showTimer} onCheckedChange={(v) => updateTemplatePattern(template.id, { showTimer: v })} />
      </Row>

      <Group title="Options" />
      <Row title="Option order" hint="Rearrange A/B/C/D on the paper, not in the bank">
        <select
          className={selectClass()}
          value={p.optionOrder}
          onChange={(e) => updateTemplatePattern(template.id, { optionOrder: e.target.value as OptionOrder })}
        >
          <option value="as-written">As written</option>
          <option value="shuffle">Shuffle</option>
          <option value="reverse">Reverse</option>
        </select>
      </Row>

      <Group title="Participant" />
      <div className="border-b border-border bg-card px-4 py-3">
        <Label htmlFor="candidate-name">Candidate name</Label>
        <Input
          id="candidate-name"
          className="mt-2"
          value={p.candidateName}
          onChange={(e) => updateTemplatePattern(template.id, { candidateName: e.target.value })}
          placeholder="Shown on the paper"
        />
      </div>
      <div className="border-b border-border bg-card px-4 py-3">
        <Label htmlFor="candidate-id">Roll / ID</Label>
        <Input
          id="candidate-id"
          className="mt-2"
          value={p.candidateId}
          onChange={(e) => updateTemplatePattern(template.id, { candidateId: e.target.value })}
          placeholder="Optional"
        />
      </div>
      <div className="border-b border-border bg-card px-4 py-3">
        <Label htmlFor="exam-title">Exam title</Label>
        <Input
          id="exam-title"
          className="mt-2"
          value={p.examTitle}
          onChange={(e) => updateTemplatePattern(template.id, { examTitle: e.target.value })}
          placeholder="Leave blank to use the deck name"
        />
      </div>

      <Group title="Paper functions" />
      <Row title="Switch sections" hint="Tap another section tab during the test">
        <Switch
          checked={p.allowSectionSwitch}
          onCheckedChange={(v) => updateTemplatePattern(template.id, { allowSectionSwitch: v })}
        />
      </Row>
      <Row title="Mark for review">
        <Switch
          checked={p.showMarkForReview}
          onCheckedChange={(v) => updateTemplatePattern(template.id, { showMarkForReview: v })}
        />
      </Row>
      <Row title="Clear response">
        <Switch checked={p.showClear} onCheckedChange={(v) => updateTemplatePattern(template.id, { showClear: v })} />
      </Row>
      <Row title="Question palette">
        <Switch checked={p.showPalette} onCheckedChange={(v) => updateTemplatePattern(template.id, { showPalette: v })} />
      </Row>
      <Row title="Submit section">
        <Switch
          checked={p.showSubmitSection}
          onCheckedChange={(v) => updateTemplatePattern(template.id, { showSubmitSection: v })}
        />
      </Row>
      <p className="px-4 py-6 text-xs text-muted-foreground">
        These controls apply the next time you start a test with this template bookmarked. Inactive templates keep their HTML and pattern as stored.
      </p>
    </StudyShell>
  );
}
