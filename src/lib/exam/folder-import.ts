import { persistBrowserFile } from "./note-files";
import { useExamStore } from "./store";
import type { NoteFolder } from "./types";

export async function importBrowserDirectory(
  files: FileList | File[],
  opts: { source: "phone" | "desk"; parentId?: string | null; onProgress?: (hint: string) => void },
): Promise<{ folderId: string; files: number; name: string }> {
  const list = Array.from(files).filter((f) => f && f.size >= 0);
  if (!list.length) throw new Error("That folder is empty.");
  const firstPath = (list[0] as File & { webkitRelativePath?: string }).webkitRelativePath || list[0]!.name;
  const rootName = firstPath.split("/")[0] || opts.source;
  const store = useExamStore.getState();
  const rootId = store.createFolder(rootName, opts.parentId ?? null, opts.source);
  if (!rootId) throw new Error("Could not create that folder.");
  const pathToId = new Map<string, string>([[rootName, rootId]]);

  const ensurePath = (dirPath: string): string => {
    if (pathToId.has(dirPath)) return pathToId.get(dirPath)!;
    const parts = dirPath.split("/").filter(Boolean);
    let cur = "";
    let parent: string | null = opts.parentId ?? null;
    for (const part of parts) {
      cur = cur ? `${cur}/${part}` : part;
      if (!pathToId.has(cur)) {
        const id = useExamStore.getState().createFolder(part, parent, opts.source);
        pathToId.set(cur, id);
        parent = id;
      } else {
        parent = pathToId.get(cur)!;
      }
    }
    return pathToId.get(dirPath) ?? rootId;
  };

  let saved = 0;
  for (const file of list) {
    const rel = ((file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name).replace(/\\/g, "/");
    const parts = rel.split("/").filter(Boolean);
    const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : rootName;
    opts.onProgress?.(`Saving ${file.name}…`);
    const folderId = ensurePath(dir);
    const meta = await persistBrowserFile(file);
    useExamStore.getState().addNote(file.name, "", folderId, [meta]);
    saved += 1;
  }

  useExamStore.getState().addLink({ kind: opts.source, name: rootName, folderId: rootId });
  return { folderId: rootId, files: saved, name: rootName };
}

export function folderSourceLabel(folder: NoteFolder | undefined): string {
  if (!folder?.source) return "";
  if (folder.source === "phone") return "Phone";
  if (folder.source === "desk") return "Desk";
  return "Email";
}
