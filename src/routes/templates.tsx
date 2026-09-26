import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Copy, FileUp, MoreVertical, Plus, Trash2 } from "lucide-react";
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
import { copyHtmlFile, formatBytes, templateHtmlId } from "@/lib/exam/html-store";
import { importHtmlTest, replaceTemplateHtml } from "@/lib/exam/html-import";
import { BUNDLED_TEMPLATE } from "@/lib/exam/template";
import { useExamStore } from "@/lib/exam/store";
import type { ExamTemplate } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({ component: TemplatesPage });

function patternHint(t: ExamTemplate): string {
  const p = t.pattern;
  const timer =
    p.timerMode === "off" ? "No timer" : p.timerMode === "overall" ? "One timer" : "Section timers";
  const options =
    p.optionOrder === "shuffle" ? "Shuffled options" : p.optionOrder === "reverse" ? "Reversed options" : "Options as written";
  return `${p.sectionSize} Q per section · ${p.minutesPerQuestion} min/Q · ${timer} · ${options}`;
}

function TemplatesPage() {
  const navigate = useNavigate();
  const templates = useExamStore((s) => s.templates);
  const addTemplate = useExamStore((s) => s.addTemplate);
  const bookmarkTemplate = useExamStore((s) => s.bookmarkTemplate);
  const deleteTemplate = useExamStore((s) => s.deleteTemplate);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [replaceId, setReplaceId] = useState<string | null>(null);

  const rows = templates ?? [];

  async function addUploaded(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const toastId = toast.loading(`Reading ${file.name}…`);
    try {
      const result = await importHtmlTest(file, (hint) => toast.loading(hint, { id: toastId }));
      toast.dismiss(toastId);
      if (result.template && result.templateId) {
        toast.success(
          result.questions
            ? `Saved two templates. ${result.questions} questions added as a test.`
            : `Saved two templates (${result.sizeLabel}): original paper and TCS iON.`,
        );
        setAddOpen(false);
        void navigate({ to: "/templates/$templateId", params: { templateId: result.templateId } });
        return;
      }
      if (result.questions) {
        toast.success(`${result.questions} questions from ${result.title}. No paper layout to copy.`);
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Could not read this HTML file");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function replaceFile(file: File | undefined) {
    const id = replaceId;
    setReplaceId(null);
    if (!file || !id) return;
    setBusy(true);
    const toastId = toast.loading(`Replacing ${file.name}…`);
    try {
      const result = await replaceTemplateHtml(id, file, (hint) => toast.loading(hint, { id: toastId }));
      toast.dismiss(toastId);
      toast.success(`Replaced HTML for this template (${result.sizeLabel}). Other templates are unchanged.`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Could not replace this template");
    } finally {
      setBusy(false);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }

  async function duplicate(src: ExamTemplate) {
    const id = addTemplate({
      name: `${src.name} copy`,
      kind: src.kind,
      fileName: src.fileName,
      size: src.size,
      pattern: src.pattern,
      bookmark: false,
    });
    if (src.kind === "uploaded") {
      await copyHtmlFile(templateHtmlId(src.id), templateHtmlId(id));
    }
    toast.success("Copy added. The active template is unchanged.");
    void navigate({ to: "/templates/$templateId", params: { templateId: id } });
  }

  function addBundled() {
    const id = addTemplate({
      name: "TCS iON",
      kind: "bundled",
      fileName: "tcs-ion-template.html",
      size: BUNDLED_TEMPLATE.length,
      bookmark: false,
    });
    setAddOpen(false);
    toast.success("TCS iON paper added. Bookmark it to use it.");
    void navigate({ to: "/templates/$templateId", params: { templateId: id } });
  }

  return (
    <StudyShell title="Exam templates">
      <p className="px-4 pt-4 text-sm text-muted-foreground">
        Bookmark the template used for study. Inactive templates stay as they are — adding or replacing one never overwrites the rest.
      </p>
      <ul className="grid gap-3 p-4 pb-36">
        {rows.map((t) => (
          <li key={t.id}>
            <div className="surface-3d flex items-stretch gap-1">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
                onClick={() => void navigate({ to: "/templates/$templateId", params: { templateId: t.id } })}
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-xl",
                    t.bookmarked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {t.bookmarked ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{t.name}</span>
                    {t.bookmarked ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Active
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{patternHint(t)}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {t.kind === "bundled" ? "TCS iON paper" : t.fileName || "Uploaded HTML"}
                    {t.size > 0 ? ` · ${formatBytes(t.size)}` : t.kind === "bundled" ? ` · ${formatBytes(BUNDLED_TEMPLATE.length)}` : ""}
                  </span>
                  {t.lastResult ? (
                    <span className="mt-0.5 block text-xs">
                      <span className="font-medium text-review">{t.lastResult.correct}</span>
                      <span className="text-muted-foreground"> correct · </span>
                      <span className="font-medium text-learn">{t.lastResult.wrong}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        wrong
                        {t.lastResult.deckName ? ` · ${t.lastResult.deckName}` : ""}
                      </span>
                    </span>
                  ) : null}
                </span>
              </button>
              <div className="flex flex-col justify-center pr-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t.bookmarked ? "Active template" : "Bookmark as active"}
                  onClick={() => {
                    bookmarkTemplate(t.id);
                    toast.success(`${t.name} is the active template`);
                  }}
                >
                  {t.bookmarked ? <BookmarkCheck className="size-5 text-primary" /> : <Bookmark className="size-5" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label={`More for ${t.name}`}>
                      <MoreVertical className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => void navigate({ to: "/templates/$templateId", params: { templateId: t.id } })}
                    >
                      Edit pattern
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        bookmarkTemplate(t.id);
                        toast.success(`${t.name} is the active template`);
                      }}
                    >
                      {t.bookmarked ? "Already active" : "Bookmark as active"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setReplaceId(t.id);
                        replaceRef.current?.click();
                      }}
                    >
                      <FileUp className="size-4" /> Replace HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => void duplicate(t)}>
                      <Copy className="size-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        deleteTemplate(t.id);
                        toast.success("Template removed. Others are unchanged.");
                      }}
                    >
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <input
        ref={fileRef}
        type="file"
        accept=".html,.htm,text/html"
        className="sr-only"
        aria-label="Upload exam template HTML"
        onChange={(e) => void addUploaded(e.target.files?.[0])}
      />
      <input
        ref={replaceRef}
        type="file"
        accept=".html,.htm,text/html"
        className="sr-only"
        aria-label="Replace template HTML"
        onChange={(e) => void replaceFile(e.target.files?.[0])}
      />

      <Button
        type="button"
        size="icon"
        className="fixed right-5 bottom-28 z-30 size-14 rounded-full shadow-btn"
        aria-label="Add template"
        disabled={busy}
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add exam template</DialogTitle>
            <DialogDescription>
              Each template keeps its own paper, pattern, and HTML. Bookmark one to use it in study.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button type="button" onClick={addBundled} disabled={busy}>
              Add TCS iON paper
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
              <FileUp className="size-4" />
              Upload HTML template
            </Button>
            <p className="text-xs text-muted-foreground">
              Any TCS iON or practice-test HTML works. Questions are left out — only the paper layout is stored. Bookmark it so later tests use that structure.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}
