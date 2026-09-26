export const MAX_DISC_PLAYERS = 20;
export const MAX_CLASS_PLAYERS = 0;

export const DISC_MODES = ["video", "audio", "chat", "hand"] as const;
export type DiscMode = (typeof DISC_MODES)[number];
export type DiscMsgKind = "chat" | "question";
export type RoomKind = "disc" | "class";
export type FloorKind = "audio" | "question";

export function asDiscMode(raw: unknown): DiscMode {
  return DISC_MODES.includes(raw as DiscMode) ? (raw as DiscMode) : "video";
}

export function discModeLabel(mode: DiscMode): string {
  if (mode === "audio") return "Audio call";
  if (mode === "chat") return "Audio chat";
  if (mode === "hand") return "Hand-raise";
  return "Video call";
}

export function discModeHint(mode: DiscMode): string {
  if (mode === "audio") return "Voice only. Camera stays off.";
  if (mode === "chat") return "Voice plus text. Camera stays off.";
  if (mode === "hand") return "Raise a hand to take the floor. Mic starts off.";
  return "Camera and mic. Chat, hands, and questions stay on.";
}

export function allowsVideo(mode: DiscMode): boolean {
  return mode === "video";
}

export function autoMic(mode: DiscMode): boolean {
  return mode === "video" || mode === "audio" || mode === "chat";
}

export function asDiscKind(raw: unknown): DiscMsgKind {
  return raw === "question" ? "question" : "chat";
}

export function allConnected(players: Array<{ readyAt: string | null; leftAt: string | null }>): boolean {
  const present = players.filter((p) => !p.leftAt);
  return present.length > 0 && present.every((p) => Boolean(p.readyAt));
}

export function waitingConnect(players: Array<{ readyAt: string | null; leftAt: string | null }>): number {
  return players.filter((p) => !p.leftAt && !p.readyAt).length;
}

export function asRoomKind(raw: unknown): RoomKind {
  return raw === "class" ? "class" : "disc";
}

export function asFloorKind(raw: unknown): FloorKind | null {
  if (raw === "audio" || raw === "question") return raw;
  return null;
}

export function clampClassTimeout(raw: unknown, fallback = 60): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.max(15, Math.min(300, Math.floor(n)));
}

export function floorRemainingMs(until: string | null | undefined, now = Date.now()): number {
  if (!until) return 0;
  const t = Date.parse(until);
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, t - now);
}

export function formatFloorLeft(ms: number): string {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
