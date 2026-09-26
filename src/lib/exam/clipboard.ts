const KEY = "setpaper-clipboard-v1";

export type ClipKind = "deck" | "note" | "folder";
export type ClipAction = "cut" | "copy";

export type Clip = {
  kind: ClipKind;
  action: ClipAction;
  id: string;
};

export function setClip(clip: Clip): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(clip));
  } catch {
    /* ignore */
  }
}

export function getClip(): Clip | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Clip>;
    if (!v?.id || (v.kind !== "deck" && v.kind !== "note" && v.kind !== "folder")) return null;
    if (v.action !== "cut" && v.action !== "copy") return null;
    return { kind: v.kind, action: v.action, id: String(v.id) };
  } catch {
    return null;
  }
}

export function clearClip(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

const PAPER_KEY = "setpaper-paper-prefs";

export type PaperPrefs = { template: string; minutes: number };

export function rememberPaperPrefs(prefs: PaperPrefs): void {
  try {
    sessionStorage.setItem(PAPER_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function rememberedPaperPrefs(): PaperPrefs | null {
  try {
    const raw = sessionStorage.getItem(PAPER_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<PaperPrefs>;
    return {
      template: String(v.template ?? ""),
      minutes: Number.isFinite(Number(v.minutes)) ? Math.max(0, Math.floor(Number(v.minutes))) : 0,
    };
  } catch {
    return null;
  }
}
