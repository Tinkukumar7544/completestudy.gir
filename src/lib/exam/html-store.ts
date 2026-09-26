const DB_NAME = "setpaper-html-v1";
const STORE = "files";
export const IDB_TEMPLATE_SENTINEL = "__IDB_TEMPLATE__";

export type StoredHtml = {
  id: string;
  name: string;
  size: number;
  html: string;
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

export async function saveHtmlFile(file: StoredHtml): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save HTML"));
    tx.objectStore(STORE).put(file);
  });
  db.close();
}

export async function getHtmlFile(id: string): Promise<StoredHtml | null> {
  const db = await openDb();
  const row = await new Promise<StoredHtml | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as StoredHtml | undefined);
    req.onerror = () => reject(req.error ?? new Error("Could not read HTML"));
  });
  db.close();
  return row ?? null;
}

export async function deleteHtmlFile(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not delete HTML"));
    tx.objectStore(STORE).delete(id);
  });
  db.close();
}

export function templateHtmlId(id: string): string {
  return `template:${id}`;
}

export async function copyHtmlFile(fromId: string, toId: string): Promise<boolean> {
  const src = await getHtmlFile(fromId);
  if (!src) return false;
  await saveHtmlFile({ ...src, id: toId, createdAt: Date.now() });
  return true;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Read an HTML file of any size off the main thread of the picker, with progress. */
export function readHtmlFile(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (onProgress && e.lengthComputable && e.total > 0) {
        onProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
      }
    };
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read this HTML file"));
    reader.readAsText(file);
  });
}
