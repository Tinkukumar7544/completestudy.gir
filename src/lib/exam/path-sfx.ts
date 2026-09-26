export type PathSfx = "tap" | "complete" | "unlock" | "deny" | "streak" | "goal";

const MUTE_KEY = "setpaper-path-sfx";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "off";
  } catch {
    return false;
  }
}

export function isPathMuted(): boolean {
  return muted;
}

export function setPathMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? "off" : "on");
  } catch {
    /* ignore */
  }
  if (master && ctx) master.gain.setTargetAtTime(next ? 0 : 0.7, ctx.currentTime, 0.02);
}

export function unlockPathSfx() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.55;
    master.gain.value = muted ? 0 : 0.7;
    sfxBus.connect(master);
    master.connect(ctx.destination);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void ctx?.resume();
    });
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, at: number, slide?: number) {
  if (!ctx || !sfxBus || muted) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g);
  g.connect(sfxBus);
  o.start(at);
  o.stop(at + dur + 0.03);
  o.onended = () => {
    o.disconnect();
    g.disconnect();
  };
}

export function playPathSfx(kind: PathSfx) {
  unlockPathSfx();
  if (!ctx || muted) return;
  const t = ctx.currentTime;
  switch (kind) {
    case "tap":
      tone(640, 0.07, "triangle", 0.16, t);
      return;
    case "complete":
      tone(392, 0.1, "sine", 0.14, t);
      tone(523, 0.12, "sine", 0.16, t + 0.08);
      tone(659, 0.18, "triangle", 0.18, t + 0.16);
      return;
    case "unlock":
      tone(523, 0.12, "triangle", 0.14, t, 784);
      tone(784, 0.16, "sine", 0.12, t + 0.1);
      return;
    case "deny":
      tone(180, 0.16, "square", 0.1, t, 110);
      return;
    case "streak":
      tone(440, 0.1, "sine", 0.12, t);
      tone(554, 0.1, "sine", 0.12, t + 0.09);
      tone(659, 0.12, "sine", 0.14, t + 0.18);
      tone(880, 0.2, "triangle", 0.16, t + 0.28);
      return;
    case "goal":
      tone(523, 0.12, "triangle", 0.14, t);
      tone(784, 0.18, "triangle", 0.16, t + 0.12);
      return;
  }
}
