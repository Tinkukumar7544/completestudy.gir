import { useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { DirectoryInput } from "@/components/directory-input";
import { Glyph3D } from "@/components/glyphs";
import { FileKindIcon, NoteFileViewer } from "@/components/note-file-preview";
import { Button } from "@/components/ui/button";
import { importBrowserDirectory } from "@/lib/exam/folder-import";
import { formatBytes } from "@/lib/exam/note-files";
import { descendantFolderIds, useExamStore } from "@/lib/exam/store";
import type { NoteFileMeta } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

type Search = { folder: string; from: "tests" | "notes" };

export const Route = createFileRoute("/desk")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    folder: String(raw.folder ?? ""),
    from: raw.from === "notes" ? "notes" : "tests",
  }),
  component: DeskPage,
});

function DeskPage() {
  const { folder: folderParam, from } = Route.useSearch();
  const navigate = useNavigate();
  const folders = useExamStore((s) => s.folders ?? []);
  const notes = useExamStore((s) => s.notes ?? []);
  const links = useExamStore((s) => s.links ?? []);
  const phoneRef = useRef<HTMLInputElement>(null);
  const deskRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState<{ files: NoteFileMeta[]; index: number } | null>(null);

  const linkedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const link of links) {
      if ((link.kind === "phone" || link.kind === "desk") && link.folderId) ids.add(link.folderId);
    }
    return ids;
  }, [links]);

  const current = folders.find((f) => f.id === folderParam) ?? null;
  const currentId = current?.id ?? null;

  const childFolders = useMemo(() => {
    if (currentId) {
      return folders.filter((f) => (f.parentId ?? null) === currentId).sort((a, b) => a.name.localeCompare(b.name));
    }
    return folders
      .filter((f) => linkedIds.has(f.id) || f.source === "phone" || f.source === "desk")
      .filter((f) => !f.parentId || !linkedIds.has(f.parentId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [folders, currentId, linkedIds]);

  const childNotes = useMemo(() => {
    if (!currentId) return [];
    return notes.filter((n) => (n.folderId ?? null) === currentId).sort((a, b) => b.modifiedAt - a.modifiedAt);
  }, [notes, currentId]);

  async function onDirectory(list: FileList | null, source: "phone" | "desk") {
    if (!list?.length) return;
    setBusy(true);
    const toastId = toast.loading("Copying folder…");
    try {
      const result = await importBrowserDirectory(list, {
        source,
        parentId: currentId,
        onProgress: (hint) => toast.loading(hint, { id: toastId }),
      });
      toast.success(`${result.files} files from ${result.name}`);
      void navigate({ to: "/desk", search: { folder: result.folderId, from } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not link that folder");
    } finally {
      toast.dismiss(toastId);
      setBusy(false);
    }
  }

  return (
    <StudyShell title={current?.name ?? "Desk"}>
      <DirectoryInput inputRef={phoneRef} onFiles={(files) => void onDirectory(files, "phone")} />
      <DirectoryInput inputRef={deskRef} onFiles={(files) => void onDirectory(files, "desk")} />
      <div className="mx-auto max-w-md p-4 pb-36">
        <p className="text-sm text-muted-foreground">
          Phone and computer folders copy into this app so every file type opens here. The device itself is not browsed
          live.
        </p>
        <div className="mt-3 flex gap-2">
          <Button variant="outline" className="h-11 flex-1" disabled={busy} onClick={() => phoneRef.current?.click()}>
            <Smartphone className="size-4" /> Phone folder
          </Button>
          <Button variant="outline" className="h-11 flex-1" disabled={busy} onClick={() => deskRef.current?.click()}>
            <Monitor className="size-4" /> Desk folder
          </Button>
        </div>

        {current ? (
          <button
            type="button"
            className="mt-4 flex items-center gap-1 text-sm text-primary"
            onClick={() =>
              void navigate({
                to: "/desk",
                search: { folder: current.parentId ?? "", from },
              })
            }
          >
            <ChevronRight className="size-3.5 rotate-180" />
            {current.parentId ? "Parent folder" : "All linked folders"}
          </button>
        ) : null}

        <ul className="mt-4 grid gap-2">
          {childFolders.map((folder) => {
            const nested = descendantFolderIds(folders, folder.id);
            const nCount = notes.filter((n) => n.folderId && nested.has(n.folderId)).length;
            return (
              <li key={folder.id}>
                <button
                  type="button"
                  className="surface-3d lift flex min-h-16 w-full items-center gap-3 px-3 text-left"
                  onClick={() => void navigate({ to: "/desk", search: { folder: folder.id, from } })}
                >
                  <Glyph3D name="folder" alt="" size="md" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {folder.source === "phone" ? "Phone" : folder.source === "desk" ? "Desk" : "Folder"}
                      {nCount ? ` · ${nCount} files` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {childNotes.map((note) => {
            const file = (note.files ?? [])[0];
            return (
              <li key={note.id} className="surface-3d lift overflow-hidden">
                <button
                  type="button"
                  className="flex min-h-16 w-full items-center gap-3 px-3 text-left"
                  onClick={() => {
                    if (note.files?.length) setViewer({ files: note.files, index: 0 });
                  }}
                >
                  {file ? (
                    <span className="grid size-12 place-items-center rounded-xl bg-muted">
                      <FileKindIcon kind={file.kind} className="size-5 text-primary" />
                    </span>
                  ) : (
                    <Glyph3D name="note" alt="" size="md" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{note.title}</span>
                    {file ? (
                      <span className="text-xs text-muted-foreground">
                        {file.kind} · {formatBytes(file.size)}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {!childFolders.length && !childNotes.length ? (
          <p className="px-2 py-10 text-center text-sm text-muted-foreground">
            Link a phone or computer folder to open it here like a file manager.
          </p>
        ) : null}
        <Button
          variant="ghost"
          className={cn("mt-4 h-11 w-full")}
          onClick={() => void navigate({ to: from === "notes" ? "/notes" : "/" })}
        >
          Back to {from === "notes" ? "Notes" : "Tests"}
        </Button>
      </div>
      {viewer ? (
        <NoteFileViewer
          files={viewer.files}
          index={viewer.index}
          open
          onOpenChange={(open) => {
            if (!open) setViewer(null);
          }}
        />
      ) : null}
    </StudyShell>
  );
}
