import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, File as FileIcon, FileCode, FileText, Film, Image, Music, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatBytes, getNoteFile } from "@/lib/exam/note-files";
import { openPdf } from "@/lib/exam/pdf-open";
import { useExamStore } from "@/lib/exam/store";
import type { NoteFileKind, NoteFileMeta } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

const ICONS: Record<NoteFileKind, typeof FileIcon> = {
  image: Image,
  video: Film,
  audio: Music,
  pdf: FileText,
  html: FileCode,
  doc: FileText,
  other: FileIcon,
};

type ViewerMode = "image" | "video" | "audio" | "pdf" | "html" | "text" | "file";

const APP_NAME: Record<ViewerMode, string> = {
  image: "Photos",
  video: "Videos",
  audio: "Music",
  pdf: "PDF",
  html: "Page",
  text: "Document",
  file: "Files",
};

const TEXT_EXTS = new Set(["txt", "md", "csv", "json", "xml", "log", "svg"]);

export function FileKindIcon({ kind, className }: { kind: NoteFileKind; className?: string }) {
  const Icon = ICONS[kind] ?? FileIcon;
  return <Icon className={cn("size-5", className)} />;
}

export function ReadRing({ seen, total, done, size = 40 }: { seen: number; total: number; done?: boolean; size?: number }) {
  const pct = done || (total > 0 && seen >= total) ? 100 : total > 0 ? Math.max(0, Math.min(100, Math.round((seen / total) * 100))) : 0;
  const r = 15.5;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center text-primary"
      style={{ width: size, height: size }}
      aria-label={`${pct}% read`}
    >
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3.5" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-[9px] font-semibold leading-none tabular-nums">{pct}%</span>
    </span>
  );
}

function fileExt(name: string) {
  return (name.split(".").pop() || "").toLowerCase();
}

function viewerMode(file: NoteFileMeta): ViewerMode {
  if (file.kind === "image") return "image";
  if (file.kind === "video") return "video";
  if (file.kind === "audio") return "audio";
  if (file.kind === "pdf") return "pdf";
  if (file.kind === "html") return "html";
  const ext = fileExt(file.name);
  const mime = (file.mime || "").toLowerCase();
  if (mime.startsWith("text/") || mime === "application/json" || TEXT_EXTS.has(ext)) return "text";
  return "file";
}

function kindLabel(file: NoteFileMeta) {
  return APP_NAME[viewerMode(file)];
}

async function openWithDevice(file: NoteFileMeta, blob: Blob | null) {
  const data = blob ?? (await getNoteFile(file.id).then((row) => row?.blob ?? null));
  if (!data) {
    toast.error("File is not on this device");
    return;
  }
  const native = new File([data], file.name, { type: file.mime || data.type || "application/octet-stream" });
  try {
    if (navigator.canShare?.({ files: [native] })) {
      await navigator.share({ files: [native], title: file.name });
      return;
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return;
  }
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.rel = "noopener";
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  toast.success("Saved. Open it with an app on this device.");
}

export function NoteFilePreview({ file }: { file: NoteFileMeta }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NoteFileRow file={file} onOpen={() => setOpen(true)} />
      <NoteFileViewer files={[file]} open={open} onOpenChange={setOpen} />
    </>
  );
}

export function NoteFileRow({ file, onOpen }: { file: NoteFileMeta; onOpen: () => void }) {
  return (
    <button
      type="button"
      data-note-file={file.id}
      className="surface-3d flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left"
      aria-label={`Open ${file.name}`}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <FileKindIcon kind={file.kind} className="size-5 shrink-0 text-primary" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          {kindLabel(file)} · {formatBytes(file.size)}
        </span>
      </span>
      {file.kind === "pdf" || file.kind === "video" ? (
        <ReadRing seen={file.progress?.seen ?? 0} total={file.progress?.total ?? 0} done={file.progress?.done} size={36} />
      ) : null}
    </button>
  );
}

export function NoteFileViewer({
  files,
  index = 0,
  open,
  onOpenChange,
}: {
  files: NoteFileMeta[];
  index?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [i, setI] = useState(index);
  useEffect(() => {
    if (open) setI(Math.min(Math.max(0, index), Math.max(0, files.length - 1)));
  }, [open, index, files]);

  const file = files[i] ?? null;
  const mode = file ? viewerMode(file) : "file";
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [textReady, setTextReady] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    if (!open || !file) {
      setUrl(null);
      setBlob(null);
      setMissing(false);
      setLoading(false);
      setText(null);
      setTextReady(false);
      setBroken(false);
      return;
    }
    let alive = true;
    let objectUrl: string | null = null;
    setUrl(null);
    setBlob(null);
    setMissing(false);
    setLoading(true);
    setText(null);
    setTextReady(false);
    setBroken(false);
    void getNoteFile(file.id).then((stored) => {
      if (!alive) return;
      if (!stored) {
        setMissing(true);
        setLoading(false);
        return;
      }
      objectUrl = URL.createObjectURL(stored.blob);
      setUrl(objectUrl);
      setBlob(stored.blob);
      setLoading(false);
    });
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, file]);

  useEffect(() => {
    if (!blob || mode !== "text") {
      setText(null);
      setTextReady(false);
      return;
    }
    if (blob.size > 2_000_000) {
      setText(null);
      setTextReady(true);
      return;
    }
    let alive = true;
    setTextReady(false);
    void blob.text().then((value) => {
      if (alive) {
        setText(value);
        setTextReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [blob, mode]);

  const setFileProgress = useExamStore((s) => s.setFileProgress);
  useEffect(() => {
    if (!open || !file || mode !== "image" || !url) return;
    if (file.progress?.done) return;
    setFileProgress(file.id, { seen: 1, total: 1, done: true });
  }, [open, file, mode, url, setFileProgress]);

  const media = mode === "image" || mode === "video" || mode === "audio";
  const many = files.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        aria-describedby={undefined}
        className={cn(
          "top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 shadow-none",
          media ? "bg-bar text-bar-foreground" : "bg-background text-foreground",
        )}
      >
        {file ? (
          <>
            <div
              className={cn(
                "flex h-14 shrink-0 items-center gap-1 px-1",
                media ? "bg-bar text-bar-foreground" : "border-b border-border bg-card text-card-foreground",
              )}
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={media ? "text-bar-foreground hover:bg-bar-foreground/10" : undefined}
                aria-label="Close"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-sm font-medium">{file.name}</DialogTitle>
                <DialogDescription className={cn("truncate text-xs", media ? "text-bar-foreground/70" : "text-muted-foreground")}>
                  {kindLabel(file)}
                </DialogDescription>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={media ? "text-bar-foreground hover:bg-bar-foreground/10" : undefined}
                aria-label="Open with a device app"
                data-open-with-device="true"
                disabled={loading || missing}
                onClick={() => void openWithDevice(file, blob)}
              >
                <Share2 className="size-5" />
              </Button>
            </div>
            <div data-file-viewer={file.kind} className="relative min-h-0 flex-1">
              {loading ? (
                <p className="grid h-full place-items-center text-sm opacity-80">Opening…</p>
              ) : missing ? (
                <p className="grid h-full place-items-center px-6 text-center text-sm opacity-80">
                  File is not on this device. Names sync; the file itself stays where it was added.
                </p>
              ) : !url ? (
                <p className="grid h-full place-items-center text-sm opacity-80">Could not open this file.</p>
              ) : mode === "image" && !broken ? (
                <div className="grid h-full place-items-center p-2">
                  <img
                    src={url}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain"
                    onError={() => setBroken(true)}
                  />
                </div>
              ) : mode === "image" ? (
                <div className="grid h-full place-items-center gap-3 px-6 text-center">
                  <p className="text-sm">This photo needs an app on your device.</p>
                  <Button type="button" onClick={() => void openWithDevice(file, blob)}>
                    Open with a device app
                  </Button>
                </div>
              ) : mode === "video" ? (
                <VideoProgress url={url} file={file} />
              ) : mode === "audio" ? (
                <div className="mx-auto grid h-full max-w-md content-center gap-6 px-6">
                  <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Music className="size-10" />
                  </div>
                  <p className="truncate text-center text-base font-medium">{file.name}</p>
                  <audio src={url} controls autoPlay className="w-full" />
                </div>
              ) : mode === "pdf" || mode === "html" ? (
                mode === "pdf" && blob ? <PdfProgress blob={blob} file={file} /> : <iframe src={url} title={file.name} className="h-full w-full bg-card" />
              ) : mode === "text" && !textReady ? (
                <p className="grid h-full place-items-center text-sm opacity-80">Opening…</p>
              ) : mode === "text" && text != null ? (
                <pre className="h-full overflow-auto whitespace-pre-wrap break-words bg-card p-4 text-sm leading-relaxed text-card-foreground">
                  {text}
                </pre>
              ) : (
                <div className="mx-auto grid h-full max-w-sm content-center gap-4 px-6 text-center">
                  <FileKindIcon kind={file.kind} className="mx-auto size-12 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This file opens with an app on your phone — PDF reader, gallery, video, or documents.
                  </p>
                  <Button type="button" onClick={() => void openWithDevice(file, blob)}>
                    Open with a device app
                  </Button>
                </div>
              )}
            </div>
            {many ? (
              <div
                className={cn(
                  "flex h-14 shrink-0 items-center justify-between px-2",
                  media ? "bg-bar" : "border-t border-border bg-card",
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  disabled={i === 0}
                  className={media ? "text-bar-foreground hover:bg-bar-foreground/10" : undefined}
                  onClick={() => setI((n) => Math.max(0, n - 1))}
                >
                  <ChevronLeft className="size-5" />
                  Previous
                </Button>
                <p className="text-xs opacity-80">
                  {i + 1} / {files.length}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={i >= files.length - 1}
                  className={media ? "text-bar-foreground hover:bg-bar-foreground/10" : undefined}
                  onClick={() => setI((n) => Math.min(files.length - 1, n + 1))}
                >
                  Next
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-16 shrink-0 items-center justify-center px-4 pb-2",
                  media ? "bg-bar" : "border-t border-border bg-card",
                )}
              >
                <Button
                  type="button"
                  variant={media ? "secondary" : "outline"}
                  className="w-full max-w-sm"
                  data-open-with-device-bar="true"
                  disabled={loading || missing}
                  onClick={() => void openWithDevice(file, blob)}
                >
                  <Share2 className="size-4" />
                  Open with a device app
                </Button>
              </div>
            )}
          </>
        ) : (
          <DialogTitle className="sr-only">File</DialogTitle>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PdfProgress({ blob, file }: { blob: Blob; file: NoteFileMeta }) {
  const setFileProgress = useExamStore((s) => s.setFileProgress);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seen = useRef(new Set<number>());
  const [pdf, setPdf] = useState<Awaited<ReturnType<typeof openPdf>> | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const seeded = useRef(false);

  useEffect(() => {
    let alive = true;
    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;
    setError(null);
    setPdf(null);
    setRendering(true);
    seeded.current = false;
    void blob.arrayBuffer().then(async (buf) => {
      try {
        doc = await openPdf(buf);
        if (!alive) {
          await doc.destroy();
          return;
        }
        if (!seeded.current) {
          seeded.current = true;
          const prior = file.progress?.done ? doc.numPages : Math.min(file.progress?.seen ?? 0, doc.numPages);
          for (let i = 1; i <= prior; i++) seen.current.add(i);
        }
        setTotal(doc.numPages);
        setPdf(doc);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Could not open this PDF");
      } finally {
        if (alive) setRendering(false);
      }
    });
    return () => {
      alive = false;
      void doc?.destroy();
    };
  }, [blob, file.id]);

  useEffect(() => {
    const doc = pdf;
    const canvas = canvasRef.current;
    if (!doc || !canvas) return;
    let cancelled = false;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;
    setRendering(true);
    void (async () => {
      try {
        const pageObj = await doc.getPage(page);
        if (cancelled) return;
        const parent = canvas.parentElement;
        const width = Math.max(280, (parent?.clientWidth ?? 360) - 24);
        const unscaled = pageObj.getViewport({ scale: 1 });
        const scale = Math.min(2, width / unscaled.width);
        const viewport = pageObj.getViewport({ scale });
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        task = pageObj.render({ canvasContext: ctx, viewport });
        await task.promise;
        if (cancelled) return;
        seen.current.add(page);
        const count = seen.current.size;
        const done = count >= doc.numPages;
        setFileProgress(file.id, { seen: count, total: doc.numPages, done });
      } catch (err) {
        if (!cancelled && !(err && typeof err === "object" && "name" in err && err.name === "RenderingCancelledException")) {
          setError(err instanceof Error ? err.message : "Could not draw this page");
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, page, file.id, setFileProgress]);

  const seenCount = Math.max(seen.current.size, file.progress?.seen ?? 0);
  return (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-3 py-2 text-sm">
        <Button type="button" size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((n) => Math.max(1, n - 1))}>
          Previous
        </Button>
        <span className="inline-flex items-center gap-2 font-medium">
          <ReadRing seen={seenCount} total={total} done={file.progress?.done} size={44} />
          <span>{total ? `${page} / ${total}` : "Opening"}</span>
        </span>
        <Button type="button" size="sm" variant="outline" disabled={!total || page >= total} onClick={() => setPage((n) => Math.min(total, n + 1))}>
          Next
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {error ? (
          <p className="grid h-full place-items-center px-6 text-center text-sm text-destructive">{error}</p>
        ) : (
          <canvas ref={canvasRef} className="mx-auto block max-w-full bg-white shadow-sm" />
        )}
        {rendering && !error ? <p className="py-2 text-center text-xs text-muted-foreground">Opening page…</p> : null}
      </div>
    </div>
  );
}

function VideoProgress({ url, file }: { url: string; file: NoteFileMeta }) {
  const setFileProgress = useExamStore((s) => s.setFileProgress);
  const watched = useRef(file.progress?.done ? Number.POSITIVE_INFINITY : 0);
  const last = useRef(0);
  const [done, setDone] = useState(Boolean(file.progress?.done));

  return (
    <div className="grid h-full place-items-center bg-bar p-2">
      <div className="flex w-full max-w-3xl flex-col gap-2">
        <p className="flex items-center justify-center gap-2 text-xs text-bar-foreground">
          <ReadRing seen={done ? 1 : 0} total={1} done={done} size={44} />
          {done ? "Watched" : "Finishes only after the full video plays"}
        </p>
        <video
          src={url}
          controls
          autoPlay
          playsInline
          className="max-h-[70dvh] w-full"
          onPlay={(event) => {
            last.current = event.currentTarget.currentTime;
          }}
          onTimeUpdate={(event) => {
            if (done) return;
            const video = event.currentTarget;
            const delta = video.currentTime - last.current;
            if (delta > 0 && delta < 1.25) watched.current += delta;
            last.current = video.currentTime;
            const duration = video.duration;
            if (Number.isFinite(duration) && duration > 0 && watched.current >= duration * 0.98) {
              setDone(true);
              setFileProgress(file.id, { seen: 1, total: 1, done: true });
            }
          }}
        />
      </div>
    </div>
  );
}