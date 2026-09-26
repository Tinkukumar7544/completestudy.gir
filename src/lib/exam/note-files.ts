import { formatBytes } from "./html-store";
import { noteFileKind, type NoteFileMeta } from "./types";
import { uid } from "@/lib/utils";

const DB_NAME = "setpaper-note-files-v1";
const STORE = "files";

export type StoredNoteFile = {
  id: string;
  name: string;
  mime: string;
  size: number;
  blob: Blob;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB unavailable"));
  });
}

export async function saveNoteFile(file: StoredNoteFile): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save file"));
    tx.objectStore(STORE).put(file);
  });
  db.close();
}

export async function getNoteFile(id: string): Promise<StoredNoteFile | null> {
  const db = await openDb();
  const row = await new Promise<StoredNoteFile | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as StoredNoteFile | undefined);
    req.onerror = () => reject(req.error ?? new Error("Could not read file"));
  });
  db.close();
  return row ?? null;
}

export async function deleteNoteFile(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not delete file"));
    tx.objectStore(STORE).delete(id);
  });
  db.close();
}

export async function deleteNoteFiles(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not delete files"));
    const store = tx.objectStore(STORE);
    for (const id of ids) store.delete(id);
  });
  db.close();
}

export async function clearNoteFiles(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not clear files"));
    tx.objectStore(STORE).clear();
  });
  db.close();
}

export async function persistBrowserFile(file: File): Promise<NoteFileMeta> {
  const id = uid();
  const mime = file.type || "application/octet-stream";
  await saveNoteFile({
    id,
    name: file.name,
    mime,
    size: file.size,
    blob: file,
    createdAt: Date.now(),
  });
  return {
    id,
    name: file.name || "file",
    mime,
    size: file.size,
    kind: noteFileKind(mime, file.name),
  };
}

export { formatBytes };
