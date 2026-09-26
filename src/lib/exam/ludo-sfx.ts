export type LudoSfx = "dice" | "move" | "capture" | "home" | "extra" | "turn" | "win" | "skip";

const MUTE_KEY = "setpaper-ludo-sfx";

type AudioCtx = AudioContext;

let ctx: AudioCtx | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = readMuted();
let lastDiceAt = 0;

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "off";
  } catch {
    return false;
  }
}

function now(): number {
  return ctx?.currentTime ?? 0;
}

export function isLudoMuted(): boolean {
  return muted;
}

export function setLudoMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? "off" : "on");
  } catch {
    /* ignore */
  }
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.72, ctx.currentTime, 0.02);
  }
}

export function unlockLudoSfx() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.62;
    master.gain.value = muted ? 0 : 0.72;
    sfxBus.connect(master);
    master.connect(ctx.destination);
    noiseBuffer = makeNoise(ctx);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void ctx?.resume();
    });
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function makeNoise(audio: AudioCtx): AudioBuffer {
  const buffer = audio.createBuffer(1, audio.sampleRate * 0.35, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function envGain(peak: number, attack: number, dur: number, at: number): GainNode {
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  g.connect(sfxBus!);
  return g;
}

function tone(opts: {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  at?: number;
  slide?: number;
  attack?: number;
}) {
  if (!ctx || !sfxBus || muted) return;
  const at = opts.at ?? now();
  const dur = opts.dur;
  const o = ctx.createOscillator();
  const g = envGain(opts.gain ?? 0.18, opts.attack ?? 0.01, dur, at);
  o.type = opts.type ?? "triangle";
  o.frequency.setValueAtTime(opts.freq, at);
  if (opts.slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, opts.slide), at + dur);
  o.connect(g);
  o.start(at);
  o.stop(at + dur + 0.03);
  o.onended = () => {
    o.disconnect();
    g.disconnect();
  };
}

function noise(opts: { dur: number; gain?: number; at?: number; hp?: number; lp?: number }) {
  if (!ctx || !sfxBus || !noiseBuffer || muted) return;
  const at = opts.at ?? now();
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = opts.hp ? "highpass" : "lowpass";
  filter.frequency.value = opts.hp ?? opts.lp ?? 800;
  const g = envGain(opts.gain ?? 0.16, 0.006, opts.dur, at);
  src.connect(filter);
  filter.connect(g);
  src.start(at);
  src.stop(at + opts.dur + 0.02);
  src.onended = () => {
    src.disconnect();
    filter.disconnect();
    g.disconnect();
  };
}

export function playLudoSfx(kind: LudoSfx) {
  unlockLudoSfx();
  if (!ctx || muted) return;
  const t = now();
  const jitter = 1 + (Math.random() * 2 - 1) * 0.08;

  switch (kind) {
    case "dice": {
      lastDiceAt = performance.now();
      noise({ dur: 0.09, gain: 0.14, at: t, hp: 500 });
      for (let i = 0; i < 6; i++) {
        const at = t + 0.045 * i + Math.random() * 0.02;
        tone({ freq: (720 + i * 90) * jitter, dur: 0.045, type: "square", gain: 0.07, at });
        noise({ dur: 0.03, gain: 0.09, at, hp: 900 });
      }
      tone({ freq: 180, dur: 0.14, type: "sine", gain: 0.22, at: t + 0.34, slide: 90 });
      noise({ dur: 0.08, gain: 0.12, at: t + 0.34, lp: 600 });
      return;
    }
    case "move":
      tone({ freq: 490 * jitter, dur: 0.09, type: "triangle", gain: 0.2, slide: 320 });
      noise({ dur: 0.04, gain: 0.1, hp: 1200 });
      return;
    case "capture":
      tone({ freq: 420, dur: 0.18, type: "sawtooth", gain: 0.16, slide: 140 });
      tone({ freq: 220, dur: 0.22, type: "square", gain: 0.12, at: t + 0.05, slide: 90 });
      noise({ dur: 0.12, gain: 0.14, hp: 400 });
      return;
    case "home":
      tone({ freq: 523, dur: 0.14, type: "triangle", gain: 0.16 });
      tone({ freq: 659, dur: 0.16, type: "triangle", gain: 0.15, at: t + 0.1 });
      tone({ freq: 784, dur: 0.22, type: "triangle", gain: 0.18, at: t + 0.2 });
      return;
    case "extra":
      tone({ freq: 784, dur: 0.12, type: "sine", gain: 0.16 });
      tone({ freq: 988, dur: 0.16, type: "sine", gain: 0.14, at: t + 0.09 });
      tone({ freq: 1175, dur: 0.18, type: "sine", gain: 0.12, at: t + 0.18 });
      return;
    case "turn":
      tone({ freq: 392, dur: 0.12, type: "sine", gain: 0.12 });
      tone({ freq: 523, dur: 0.16, type: "sine", gain: 0.1, at: t + 0.08 });
      return;
    case "win":
      [523, 659, 784, 1046].forEach((freq, i) => {
        tone({ freq, dur: 0.28, type: "triangle", gain: 0.18, at: t + i * 0.12 });
      });
      return;
    case "skip":
      tone({ freq: 180, dur: 0.16, type: "sine", gain: 0.16, slide: 110 });
      noise({ dur: 0.08, gain: 0.08, lp: 500 });
  }
}

export function cueLudoSfx(kinds: LudoSfx[], rolled = false, moved = false) {
  const sinceDice = performance.now() - lastDiceAt;
  if (rolled && sinceDice > 600) playLudoSfx("dice");
  if (moved) playLudoSfx("move");
  const special = kinds.find((k) => k !== "turn" && k !== "move" && k !== "dice");
  const delay = rolled ? Math.max(0, 380 - sinceDice) : moved ? 120 : 0;
  if (special) {
    window.setTimeout(() => playLudoSfx(special), delay);
    return;
  }
  if (kinds.includes("turn") && !rolled && !moved) playLudoSfx("turn");
}

