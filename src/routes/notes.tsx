import { useMemo, useRef, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardPaste,
  FileUp,
  FolderPlus,
  Mail,
  Monitor,
  MoreVertical,
  Plus,
  Smartphone,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { DirectoryInput } from "@/components/directory-input";
import { AdminLogo } from "@/components/admin-logo";
import { Glyph3D } from "@/components/glyphs";
import { FileKindIcon, NoteFilePreview, NoteFileViewer, ReadRing } from "@/components/note-file-preview";
import { useAdminCopy } from "@/lib/admin/use-copy";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { persistBrowserFile, formatBytes } from "@/lib/exam/note-files";
import { clearClip, getClip, setClip } from "@/lib/exam/clipboard";
import { importBrowserDirectory } from "@/lib/exam/folder-import";
import { descendantFolderIds, folderDepth, MAX_FOLDER_DEPTH, useExamStore } from "@/lib/exam/store";
import type { Note, NoteFileMeta, NoteFolder } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

type Search = { view: "list" | "study"; folder: string };

export const Route = createFileRoute("/notes")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    view: raw.view === "study" ? "study" : "list",
    folder: String(raw.folder ?? ""),
  }),
  component: NotesPage,
});

function NotesPage() {
  const { view } = Route.useSearch();
  if (view === "study") return <NotesStudy />;
  return <NotesList />;
}

function folderPath(folders: NoteFolder[], id: string): NoteFolder[] {
  const path: NoteFolder[] = [];
  let cur: string | null = id;
  const seen = new Set<string>();
  while (cur) {
    if (seen.has(cur)) break;
    seen.add(cur);
    const next = folders.find((f) => f.id === cur);
    if (!next) break;
    path.unshift(next);
    cur = next.parentId;
  }
  return path;
}

function NotesList() {
  const { folder: folderParam } = Route.useSearch();
  const navigate = useNavigate();
  const notes = useExamStore((s) => s.notes);
  const folders = useExamStore((s) => s.folders);
  const addNote = useExamStore((s) => s.addNote);
  const createFolder = useExamStore((s) => s.createFolder);
  const renameFolder = useExamStore((s) => s.renameFolder);
  const deleteFolder = useExamStore((s) => s.deleteFolder);
  const moveNote = useExamStore((s) => s.moveNote);
  const moveFolder = useExamStore((s) => s.moveFolder);
  const links = useExamStore((s) => s.links ?? []);
  const copy = useAdminCopy();
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const deskRef = useRef<HTMLInputElement>(null);
  const [fab, setFab] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState<{ files: NoteFileMeta[]; index: number } | null>(null);

  const currentId = folderParam || null;
  const current = (folders ?? []).find((f) => f.id === currentId) ?? null;
  const crumbs = currentId ? folderPath(folders ?? [], currentId) : [];

  const childFolders = useMemo(
    () =>
      (folders ?? [])
        .filter((f) => (f.parentId ?? null) === currentId)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [folders, currentId],
  );
  const childNotes = useMemo(
    () =>
      (notes ?? [])
        .filter((n) => (n.folderId ?? null) === currentId)
        .slice()
        .sort((a, b) => b.modifiedAt - a.modifiedAt),
    [notes, currentId],
  );

  const studyCount = useMemo(() => {
    if (!currentId) return (notes ?? []).length;
    const ids = descendantFolderIds(folders ?? [], currentId);
    return (notes ?? []).filter((n) => n.folderId && ids.has(n.folderId)).length;
  }, [notes, folders, currentId]);

  function goFolder(id: string) {
    void navigate({ to: "/notes", search: { view: "list", folder: id } });
  }

  function pasteHere() {
    const clip = getClip();
    if (!clip) {
      toast.message("Cut or copy first");
      return;
    }
    if (clip.kind === "note") {
      if (clip.action === "copy") {
        const src = (notes ?? []).find((n) => n.id === clip.id);
        if (src) addNote(src.title, src.body, currentId, src.files ?? []);
        toast.success("Copied here");
        return;
      }
      moveNote(clip.id, currentId);
      clearClip();
      toast.success("Moved");
      return;
    }
    if (clip.kind === "folder") {
      if (clip.action === "cut") {
        moveFolder(clip.id, currentId);
        clearClip();
      }
      toast.success("Moved");
    }
  }

  function createTextNote() {
    setFab(false);
    const id = addNote("Untitled", "", currentId);
    void navigate({ to: "/notes/$noteId", params: { noteId: id } });
  }

  async function onFiles(list: FileList | File[] | null, folderId: string | null = currentId) {
    if (!list || !("length" in list) || !list.length) return;
    const files = Array.from(list).slice(0, 40);
    setBusy(true);
    const toastId = toast.loading(`Saving ${files.length} file${files.length === 1 ? "" : "s"}…`);
    let ok = 0;
    try {
      for (const file of files) {
        const meta = await persistBrowserFile(file);
        addNote(file.name, "", folderId, [meta]);
        ok += 1;
      }
      toast.success(ok === 1 ? `${files[0]?.name} added` : `${ok} files added`);
    } catch {
      toast.error(ok ? `Saved ${ok}, then a file failed` : "Could not save these files");
    } finally {
      toast.dismiss(toastId);
      setBusy(false);
      setFab(false);
    }
  }

  function submitFolder() {
    const name = folderName.trim();
    if (!name) return;
    if (renameId) {
      renameFolder(renameId, name);
      setRenameId(null);
      setFolderName("");
      setFolderOpen(false);
      toast.success("Folder renamed");
      return;
    }
    if (currentId && folderDepth(folders ?? [], currentId) >= MAX_FOLDER_DEPTH) {
      toast.error("This folder is nested as far as it can go");
      return;
    }
    const id = createFolder(name, currentId);
    if (!id) {
      toast.error("Could not create folder");
      return;
    }
    setFolderName("");
    setFolderOpen(false);
    toast.success(currentId ? "Subfolder created" : "Folder created");
  }

  const emailLinks = !currentId ? links.filter((l) => l.kind === "email") : [];
  const empty = childFolders.length === 0 && childNotes.length === 0 && emailLinks.length === 0;
  const folderLabel = currentId ? "New subfolder" : copy.notes.newFolder;

  return (
    <StudyShell title={current?.name ?? copy.notes.name}>
      <input
        ref={fileRef}
        type="file"
        multiple
        className="sr-only"
        data-notes-file-input="true"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <DirectoryInput
        inputRef={phoneRef}
        onFiles={(list) => {
          if (!list?.length) return;
          void importBrowserDirectory(list, { source: "phone", parentId: currentId })
            .then((result) => toast.success(`${result.files} files from ${result.name}`))
            .catch((err) => toast.error(err instanceof Error ? err.message : "Could not link that folder"));
        }}
      />
      <DirectoryInput
        inputRef={deskRef}
        onFiles={(list) => {
          if (!list?.length) return;
          void importBrowserDirectory(list, { source: "desk", parentId: currentId })
            .then((result) => toast.success(`${result.files} files from ${result.name}`))
            .catch((err) => toast.error(err instanceof Error ? err.message : "Could not link that folder"));
        }}
      />
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
        <button
          type="button"
          className={cn("shrink-0 rounded-sm px-1 text-sm", currentId ? "text-primary" : "font-medium")}
          onClick={() => void navigate({ to: "/notes", search: { view: "list", folder: "" } })}
        >
          Notes
        </button>
        {crumbs.map((c) => (
          <span key={c.id} className="flex shrink-0 items-center gap-2">
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              type="button"
              className={cn(
                "max-w-32 truncate rounded-sm px-1 text-sm",
                c.id === currentId ? "font-medium" : "text-primary",
              )}
              onClick={() => goFolder(c.id)}
            >
              {c.name}
            </button>
          </span>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="ml-auto shrink-0"
          disabled={studyCount === 0}
          onClick={() => void navigate({ to: "/notes", search: { view: "study", folder: currentId ?? "" } })}
        >
          <BookOpen className="size-4" />
          Study
        </Button>
      </div>
      <div className="min-h-72">
        {empty ? (
          <p className="px-6 py-12 pb-40 text-center text-sm text-muted-foreground">
            {copy.notes.empty}
          </p>
        ) : (
          <ul className="grid gap-3 px-4 pb-36">
            {!currentId
              ? links
                  .filter((l) => l.kind === "email")
                  .map((link) => (
                    <li key={link.id}>
                      <button
                        type="button"
                        className="surface-3d lift flex min-h-16 w-full items-center gap-3 px-3 text-left"
                        onClick={() =>
                          void navigate({
                            to: "/mail",
                            search: { from: "notes", label: link.remoteId ?? "", message: "", connector: "Gmail" },
                          })
                        }
                      >
                        <Mail className="size-5 text-primary" />
                        <span className="min-w-0">
                          <span className="block truncate text-base font-semibold">{link.name}</span>
                          <span className="text-xs text-muted-foreground">Mail folder · live</span>
                        </span>
                      </button>
                    </li>
                  ))
              : null}
            {childFolders.map((folder) => {
              const nested = descendantFolderIds(folders ?? [], folder.id);
              const nCount = (notes ?? []).filter((n) => n.folderId && nested.has(n.folderId)).length;
              const fCount = (folders ?? []).filter((f) => f.parentId === folder.id).length;
              return (
                <li key={folder.id} className="surface-3d lift flex items-stretch overflow-hidden">
                  <button
                    type="button"
                    className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left"
                    onClick={() => goFolder(folder.id)}
                  >
                    <AdminLogo
                      src={folder.logo}
                      label={folder.name}
                      onChange={(logo) => useExamStore.getState().setFolderLogo(folder.id, logo)}
                      fallback={<Glyph3D name={fCount ? "folder-open" : "folder"} alt="" size="md" />}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-base font-semibold tracking-tight">{folder.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {fCount ? `${fCount} folder${fCount === 1 ? "" : "s"}` : "Folder"}
                        {nCount ? ` · ${nCount} item${nCount === 1 ? "" : "s"}` : ""}
                      </span>
                    </span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-16 w-10 items-center justify-center text-muted-foreground"
                        aria-label={`Folder actions for ${folder.name}`}
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => goFolder(folder.id)}>Open</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setClip({ kind: "folder", action: "cut", id: folder.id });
                          toast.success("Cut");
                        }}
                      >
                        Cut
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={pasteHere}>Paste here</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setRenameId(folder.id);
                          setFolderName(folder.name);
                          setFolderOpen(true);
                        }}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={() => {
                          deleteFolder(folder.id);
                          toast.success("Folder deleted");
                        }}
                      >
                        Delete folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
            {childNotes.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                onOpenFiles={(files) => setViewer({ files, index: 0 })}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="fixed right-4 bottom-28 z-20 flex flex-col items-end gap-3">
        {fab ? (
          <div className="mb-1 flex flex-col items-end gap-2">
            <FabLabel
              label="From email"
              onClick={() => {
                setFab(false);
                void navigate({ to: "/mail", search: { from: "notes", label: "", message: "", connector: "Gmail" } });
              }}
            >
              <Mail className="size-4" />
            </FabLabel>
            <FabLabel
              label="Phone folder"
              onClick={() => {
                setFab(false);
                phoneRef.current?.click();
              }}
            >
              <Smartphone className="size-4" />
            </FabLabel>
            <FabLabel
              label="Desk folder"
              onClick={() => {
                setFab(false);
                deskRef.current?.click();
              }}
            >
              <Monitor className="size-4" />
            </FabLabel>
            <FabLabel
              label="Paste"
              onClick={() => {
                setFab(false);
                pasteHere();
              }}
            >
              <ClipboardPaste className="size-4" />
            </FabLabel>
            <FabLabel
              label="Add files"
              onClick={() => {
                setFab(false);
                fileRef.current?.click();
              }}
            >
              <FileUp className="size-4" />
            </FabLabel>
            <FabLabel label={copy.notes.newNote} onClick={createTextNote}>
              <StickyNote className="size-4" />
            </FabLabel>
          </div>
        ) : null}
        <Button
          size="icon"
          variant="secondary"
          className="size-12 rounded-full shadow-raised"
          disabled={busy}
          aria-label={folderLabel}
          onClick={() => {
            setRenameId(null);
            setFolderName("");
            setFolderOpen(true);
          }}
        >
          <FolderPlus className="size-5" />
        </Button>
        <Button
          size="icon"
          className="size-14 rounded-full shadow-btn"
          disabled={busy}
          onClick={() => setFab((v) => !v)}
          aria-label="Add files or note"
        >
          <Plus className={cn("size-7 transition-transform", fab && "rotate-45")} />
        </Button>
      </div>

      <Dialog
        open={folderOpen}
        onOpenChange={(open) => {
          setFolderOpen(open);
          if (!open) setRenameId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{renameId ? "Rename folder" : folderLabel}</DialogTitle>
            <DialogDescription>
              {renameId
                ? "The folder stays in the same place."
                : currentId
                  ? `Created inside ${current?.name ?? "this folder"}.`
                  : "Add subfolders later by opening a folder and tapping the folder button again."}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
            aria-label="Folder name"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitFolder();
            }}
          />
          <Button onClick={submitFolder} disabled={!folderName.trim()}>
            {renameId ? "Save" : "Create"}
          </Button>
        </DialogContent>
      </Dialog>
      <NoteFileViewer
        files={viewer?.files ?? []}
        index={viewer?.index ?? 0}
        open={Boolean(viewer)}
        onOpenChange={(open) => {
          if (!open) setViewer(null);
        }}
      />
    </StudyShell>
  );
}

function NoteRow({
  note,
  onOpenFiles,
}: {
  note: Note;
  onOpenFiles: (files: NoteFileMeta[]) => void;
}) {
  const navigate = useNavigate();
  const files = note.files ?? [];
  const file = files[0];
  const fileOnly = files.length > 0 && !note.body.trim();
  const extra = files.length > 1 ? ` +${files.length - 1}` : "";
  const snippet = note.body.trim()
    ? note.body.trim()
    : file
      ? `${file.name}${extra} · ${formatBytes(file.size)}`
      : "Empty note";

  function openNote() {
    void navigate({ to: "/notes/$noteId", params: { noteId: note.id } });
  }

  return (
    <li className="surface-3d lift flex items-stretch overflow-hidden">
      <button
        type="button"
        className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
        onClick={() => {
          const media = files.filter((item) => item.kind === "pdf" || item.kind === "image" || item.kind === "video");
          if (media.length) onOpenFiles(media);
          else if (fileOnly) onOpenFiles(files);
          else openNote();
        }}
      >
        {file ? (
          <span className="grid size-16 place-items-center rounded-xl bg-muted">
            <FileKindIcon kind={file.kind} className="size-6 text-primary" />
          </span>
        ) : (
          <Glyph3D name="note" alt="" size="md" />
        )}
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold tracking-tight">{note.title.trim() || "Untitled"}</span>
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {snippet} · {new Date(note.modifiedAt).toLocaleDateString()}
          </span>
          {file && (file.kind === "pdf" || file.kind === "video") ? (
            <span className="mt-1 inline-flex">
              <ReadRing seen={file.progress?.seen ?? 0} total={file.progress?.total ?? 0} done={file.progress?.done} size={36} />
            </span>
          ) : null}
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-16 w-10 items-center justify-center text-muted-foreground"
            aria-label={`Note actions for ${note.title.trim() || file?.name || "note"}`}
          >
            <MoreVertical className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {fileOnly ? <DropdownMenuItem onSelect={() => onOpenFiles(files)}>Open file</DropdownMenuItem> : null}
          <DropdownMenuItem onSelect={openNote}>{fileOnly ? "Edit note" : "Open"}</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setClip({ kind: "note", action: "cut", id: note.id });
              toast.success("Cut");
            }}
          >
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setClip({ kind: "note", action: "copy", id: note.id });
              toast.success("Copied");
            }}
          >
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => {
              useExamStore.getState().deleteNote(note.id);
              toast.success("Deleted");
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

function FabLabel({ label, children, onClick }: { label: string; children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="flex items-center gap-3" onClick={onClick}>
      <span className="surface-3d px-3 py-1.5 text-xs font-medium">{label}</span>
      <span className="flex size-11 items-center justify-center rounded-full bg-card text-primary shadow-raised">{children}</span>
    </button>
  );
}

function NotesStudy() {
  const { folder: folderParam } = Route.useSearch();
  const navigate = useNavigate();
  const notes = useExamStore((s) => s.notes);
  const folders = useExamStore((s) => s.folders);
  const rows = useMemo(() => {
    const all = notes ?? [];
    if (!folderParam) return all.slice().sort((a, b) => b.modifiedAt - a.modifiedAt);
    const ids = descendantFolderIds(folders ?? [], folderParam);
    return all.filter((n) => n.folderId && ids.has(n.folderId)).sort((a, b) => b.modifiedAt - a.modifiedAt);
  }, [notes, folders, folderParam]);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const note = rows[i];
  const back = { view: "list" as const, folder: folderParam };

  if (!note) {
    return (
      <StudyShell title="Study notes">
        <div className="grid gap-4 p-6 text-center">
          <p className="text-sm text-muted-foreground">No notes to study here.</p>
          <Button onClick={() => void navigate({ to: "/notes", search: back })}>Back to notes</Button>
        </div>
      </StudyShell>
    );
  }

  const last = i >= rows.length - 1;

  return (
    <StudyShell title="Study notes">
      <div className="mx-auto grid max-w-md gap-4 p-4">
        <p className="text-xs text-muted-foreground">
          {i + 1} / {rows.length}
        </p>
        <div className="surface-3d min-h-48 px-5 py-8 text-left">
          <button type="button" className="w-full text-left" onClick={() => setShow((v) => !v)}>
            <p className="text-lg font-medium">{note.title.trim() || "Untitled"}</p>
            {show ? null : <p className="mt-6 text-sm text-primary">Tap to show the note</p>}
          </button>
          {show ? (
            <div className="mt-4 grid gap-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {note.body.trim() || ((note.files ?? []).length ? "" : "This note is empty.")}
              </p>
              {(note.files ?? []).map((file) => (
                <NoteFilePreview key={file.id} file={file} />
              ))}
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            disabled={i === 0}
            onClick={() => {
              setI((n) => Math.max(0, n - 1));
              setShow(false);
            }}
          >
            Previous
          </Button>
          {last ? (
            <Button onClick={() => void navigate({ to: "/notes", search: back })}>Done</Button>
          ) : (
            <Button
              onClick={() => {
                setI((n) => Math.min(rows.length - 1, n + 1));
                setShow(false);
              }}
            >
              Next
            </Button>
          )}
        </div>
        <Button variant="ghost" onClick={() => void navigate({ to: "/notes/$noteId", params: { noteId: note.id } })}>
          Open this note
        </Button>
      </div>
    </StudyShell>
  );
}
