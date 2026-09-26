import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { NoteFilePreview } from "@/components/note-file-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bumpNoteRead, noteReadPercent } from "@/lib/exam/exam-path";
import { deleteNoteFile, persistBrowserFile } from "@/lib/exam/note-files";
import { useExamStore } from "@/lib/exam/store";
import { defaultExamPath, normalizeExamPath } from "@/lib/exam/types";

export const Route = createFileRoute("/notes_/$noteId")({
  component: NoteEditor,
});

function NoteEditor() {
  const { noteId } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useExamStore((s) => s.hydrated);
  const note = useExamStore((s) => (s.notes ?? []).find((n) => n.id === noteId));
  const updateNote = useExamStore((s) => s.updateNote);
  const deleteNote = useExamStore((s) => s.deleteNote);
  const updatePath = useExamStore((s) => s.updatePath);
  const path = normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath());
  const onPath = path.intake.completed && path.nodes.some((n) => n.noteId === noteId);
  const readPct = noteReadPercent(path, noteId);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const folder = note?.folderId ?? "";

  useEffect(() => {
    const current = useExamStore.getState().notes.find((n) => n.id === noteId);
    if (current) {
      setTitle(current.title);
      setBody(current.body);
    }
  }, [noteId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (!note) {
      void navigate({ to: "/notes", search: { view: "list", folder } });
    }
  }, [hydrated, note, navigate, folder]);

  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => {
      if (title !== note.title || body !== note.body) {
        updateNote(note.id, { title, body });
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [title, body, note, updateNote]);

  useEffect(() => {
    if (!onPath || !noteId) return;
    const timer = window.setInterval(() => {
      useExamStore.getState().updatePath((p) => bumpNoteRead(p, noteId, 8, useExamStore.getState().prefs.dayStartHour));
    }, 4000);
    return () => window.clearInterval(timer);
  }, [onPath, noteId]);

  function flush() {
    const current = useExamStore.getState().notes.find((n) => n.id === noteId);
    if (!current) return;
    if (title !== current.title || body !== current.body) {
      updateNote(current.id, { title, body });
    }
  }

  function back() {
    flush();
    void navigate({ to: "/notes", search: { view: "list", folder: note?.folderId ?? "" } });
  }

  async function attach(list: FileList | File[] | null) {
    if (!note || !list || !list.length) return;
    const files = Array.from(list).slice(0, 20);
    setBusy(true);
    const toastId = toast.loading(`Attaching ${files.length} file${files.length === 1 ? "" : "s"}…`);
    try {
      const added = [];
      for (const file of files) added.push(await persistBrowserFile(file));
      updateNote(note.id, { files: [...(note.files ?? []), ...added] });
      toast.success(added.length === 1 ? `${added[0]?.name} attached` : `${added.length} files attached`);
    } catch {
      toast.error("Could not attach these files");
    } finally {
      toast.dismiss(toastId);
      setBusy(false);
    }
  }

  if (!hydrated || !note) {
    return (
      <StudyShell title="Note">
        <p className="p-4 text-sm text-muted-foreground">Loading…</p>
      </StudyShell>
    );
  }

  return (
    <StudyShell title="Note">
      <div className="mx-auto grid max-w-lg gap-4 p-4">
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          aria-label="Attach files"
          onChange={(e) => {
            void attach(e.target.files);
            e.target.value = "";
          }}
        />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Note title"
          className="h-12 text-base"
        />
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the note…"
          aria-label="Note body"
          className="min-h-48"
        />
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Files</p>
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
              <FileUp className="size-4" />
              Add files
            </Button>
          </div>
          {(note.files ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Tap Add files to attach photos, video, PDF, HTML, audio, or any document.
            </p>
          ) : (
            (note.files ?? []).map((file) => (
              <div key={file.id} className="grid gap-2">
                <NoteFilePreview file={file} />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="justify-start text-destructive"
                  onClick={() => {
                    void deleteNoteFile(file.id).catch(() => undefined);
                    updateNote(note.id, { files: (note.files ?? []).filter((f) => f.id !== file.id) });
                  }}
                >
                  Remove {file.name}
                </Button>
              </div>
            ))
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Text and folder names sync with your account. File contents stay on this device.
        </p>
        {onPath ? (
          <p className="text-sm">
            On the target path · read <span className="tabular-nums font-medium">{readPct}%</span>
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={back}>
            Back
          </Button>
          {onPath ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                updatePath((p) => bumpNoteRead(p, noteId, 100, useExamStore.getState().prefs.dayStartHour));
                toast.success("Marked as read on the path");
              }}
            >
              Mark as read
            </Button>
          ) : null}
          <Button
            variant="destructive"
            onClick={() => {
              deleteNote(note.id);
              toast.success("Note deleted");
              back();
            }}
            aria-label="Delete note"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </StudyShell>
  );
}
