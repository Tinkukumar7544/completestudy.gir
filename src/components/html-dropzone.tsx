import { useRef, useState, type DragEvent } from "react";
import { FileUp, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { importHtmlTest } from "@/lib/exam/html-import";
import { formatBytes } from "@/lib/exam/html-store";
import { cn } from "@/lib/utils";

export function HtmlDropzone({
  onImported,
  compact,
}: {
  onImported?: (deckId: string | null) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setHint(`Reading ${file.name} · ${formatBytes(file.size)}…`);
    try {
      const result = await importHtmlTest(file, setHint);
      if (result.template && result.questions) {
        toast.success(
          `${result.questions} questions from ${result.title}. Saved two templates: original paper and TCS iON.`,
        );
      } else if (result.questions) {
        toast.success(`${result.questions} questions from ${result.title} (${result.sizeLabel})`);
      } else if (result.template) {
        toast.success(`Saved two templates (${result.sizeLabel}): original paper and TCS iON.`);
      }
      for (const w of result.warnings.slice(0, 3)) toast.message(w);
      onImported?.(result.deckId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read this HTML file");
    } finally {
      setBusy(false);
      setHint(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    void handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      className={cn(
        "surface-3d grid place-items-center px-4 py-8 text-center",
        over && "ring-2 ring-ring",
        compact && "py-5",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        id="html-test-file"
        type="file"
        accept=".html,.htm,text/html"
        className="sr-only"
        aria-label="HTML test file"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {busy ? (
        <LoaderCircle className="size-8 animate-spin text-primary" />
      ) : (
        <FileUp className="size-8 text-primary" />
      )}
      <p className="mt-3 text-sm font-medium">{busy ? "Uploading HTML test…" : "Upload HTML test"}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {hint ?? "Drop any practice-test HTML. Questions become a test. Two templates are saved: the original paper and TCS iON."}
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        Choose HTML file
      </Button>
    </div>
  );
}
