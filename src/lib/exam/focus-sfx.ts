export type FocusSfx = "tap" | "warn" | "close" | "deny" | "unlock";

const MUTE_KEY = "setpaper-focus-sfx";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bus: GainNode | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "off";
  } catch {
    return false;
  }
}

export function unlockFocusSfx() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    bus = ctx.createGain();
    bus.gain.value = 0.55;
    master.gain.value = muted ? 0 : 0.72;
    bus.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, at: number, slide?: number) {
  if (!ctx || !bus || muted) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g);
  g.connect(bus);
  o.start(at);
  o.stop(at + dur + 0.03);
}

export function playFocusSfx(kind: FocusSfx) {
  unlockFocusSfx();
  if (!ctx || muted) return;
  const t = ctx.currentTime;
  switch (kind) {
    case "tap":
      tone(620, 0.06, "triangle", 0.14, t);
      return;
    case "warn":
      tone(520, 0.12, "sine", 0.16, t);
      tone(520, 0.12, "sine", 0.12, t + 0.16);
      return;
    case "close":
      tone(392, 0.14, "sine", 0.18, t, 220);
      tone(330, 0.18, "triangle", 0.14, t + 0.12, 180);
      return;
    case "deny":
      tone(180, 0.16, "square", 0.08, t);
      return;
    case "unlock":
      tone(440, 0.08, "sine", 0.12, t);
      tone(660, 0.1, "sine", 0.14, t + 0.08);
      return;
  }
}

export function speakFocusClose(name: string, waitMin: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${name} is paused. Come back after ${waitMin} minutes.`);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
