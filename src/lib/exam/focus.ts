import {
  DEFAULT_FOCUS_DAYS,
  defaultFocus,
  defaultFocusLimits,
  normalizeFocus,
  type FocusApp,
  type FocusAppKind,
  type FocusGroup,
  type FocusLimits,
  type FocusSession,
  type FocusSort,
  type FocusState,
  type FocusUsageEntry,
  type FocusWeekday,
} from "./types.ts";
import { AWAY_APP_ID } from "./focus-device.ts";

export const FOCUS_WEEKDAYS: Array<{ id: FocusWeekday; label: string }> = [
  { id: 0, label: "S" },
  { id: 1, label: "M" },
  { id: 2, label: "T" },
  { id: 3, label: "W" },
  { id: 4, label: "T" },
  { id: 5, label: "F" },
  { id: 6, label: "S" },
];

const STUDY: Array<[string, string, string]> = [
  ["sp-tests", "SetPaper Tests", "/"],
  ["sp-notes", "SetPaper Notes", "/notes"],
  ["sp-connect", "SetPaper Connect", "/connect"],
  ["sp-coaching", "SetPaper Coaching", "/coaching"],
  ["sp-target", "SetPaper Target", "/target"],
];

const PHONE = [
  "Adobe Express",
  "Albums",
  "Amazon",
  "Airtel",
  "Assistant",
  "BHIM",
  "Blackmagic Camera",
  "Blinkit",
  "BNE eSIM",
  "Browser",
  "Bubble Level",
  "Calculator",
  "Calendar",
  "Camera",
  "CamScanner",
  "Canva",
  "CapCut",
  "ChatGPT",
  "Chrome",
  "Claude",
  "Clock",
  "Clone Phone",
  "Compass",
  "Contacts",
  "Copilot",
  "Crack Govt Exams",
  "CRED",
  "Dialer",
  "DigiLocker",
  "Discord",
  "Drive",
  "Excel",
  "Facebook",
  "Files",
  "Firefox",
  "Flipkart",
  "Gallery",
  "Gmail",
  "Grok",
  "Grok CLI",
  "Groww",
  "Hindi Keyboard",
  "Home AI",
  "IndSMART",
  "InShot",
  "Instagram",
  "IRCTC",
  "Jan Aushadhi Sugam",
  "JioHotstar",
  "JioSaavn",
  "LinkedIn",
  "Maps",
  "Meet",
  "Meesho",
  "Messages",
  "Messenger",
  "MX Player",
  "MyJio",
  "Netflix",
  "News",
  "Notion",
  "Paytm",
  "Phone",
  "PhonePe",
  "Photos",
  "Play Games",
  "Play Store",
  "PowerPoint",
  "Prime Video",
  "Recorder",
  "Reddit",
  "Settings",
  "ShareChat",
  "Slack",
  "Snapchat",
  "Spotify",
  "Swiggy",
  "Telegram",
  "Teams",
  "TikTok",
  "Translate",
  "Truecaller",
  "Uber",
  "UMANG",
  "Vi",
  "Wallet",
  "Weather",
  "WhatsApp",
  "Wikipedia",
  "Word",
  "X",
  "YouTube",
  "YouTube Music",
  "Zoom",
  "Zomato",
] as const;

export function slugApp(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function markFromName(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "A";
}

export function markHue(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) % 360;
}

function makeApp(id: string, name: string, kind: FocusAppKind, route: string | null, createdAt: number): FocusApp {
  return {
    id,
    name,
    mark: markFromName(name),
    hue: markHue(id),
    kind,
    custom: kind === "custom",
    route,
    pinned: false,
    createdAt,
    limits: defaultFocusLimits(),
  };
}

export function focusCatalog(): FocusApp[] {
  const device = makeApp(AWAY_APP_ID, "This device", "setpaper", null, 0);
  const study = STUDY.map(([id, name, route], i) => makeApp(id, name, "setpaper", route, i + 1));
  const phone = PHONE.map((name, i) => makeApp(slugApp(name), name, "catalog", null, 100 + i));
  return [device, ...study, ...phone];
}

export function hashPin(pin: string): string {
  let h = 2166136261;
  const s = `setpaper-focus:${pin}`;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function pinOk(hash: string, pin: string): boolean {
  return Boolean(hash) && hash === hashPin(pin);
}

export function focusDayKey(ts = Date.now()): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function minutesNow(ts = Date.now()): number {
  const d = new Date(ts);
  return d.getHours() * 60 + d.getMinutes();
}

export function parseHm(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return (Number(h) || 0) * 60 + (Number(m) || 0);
}

export function inPeriod(nowMin: number, start: string, end: string): boolean {
  const a = parseHm(start);
  const b = parseHm(end);
  if (a === b) return true;
  if (a < b) return nowMin >= a && nowMin < b;
  return nowMin >= a || nowMin < b;
}

export function isDayActive(days: FocusWeekday[], ts = Date.now()): boolean {
  return days.includes(new Date(ts).getDay() as FocusWeekday);
}

export function formatDurationMin(min: number): string {
  const n = Math.max(0, Math.round(min));
  if (n < 60) return `${n} minute${n === 1 ? "" : "s"}`;
  const h = Math.floor(n / 60);
  const m = n % 60;
  if (m === 0) return `${h} hour${h === 1 ? "" : "s"}`;
  return `${h}h ${m}m`;
}

export function formatUsage(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h} hour${h === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} minute${m === 1 ? "" : "s"}`);
  if (sec || !parts.length) parts.push(`${sec} second${sec === 1 ? "" : "s"}`);
  return parts.join(" ");
}

export function withPeriodOn(limits: FocusLimits): FocusLimits {
  const periods = limits.periods.length
    ? limits.periods
    : [{ id: "p-default", start: "12:00", end: "00:00" }];
  return { ...limits, periodOn: true, periods };
}

export function mergeLimits(a: FocusLimits, b: FocusLimits): FocusLimits {
  const timerOn = a.timerOn || b.timerOn;
  const usageOn = a.usageOn || b.usageOn;
  const periodOn = a.periodOn || b.periodOn;
  const disabled = a.disabled || b.disabled;
  const aRestricts = a.timerOn || a.usageOn || a.periodOn || a.disabled;
  const bRestricts = b.timerOn || b.usageOn || b.periodOn || b.disabled;
  let days = a.days;
  if (aRestricts && bRestricts) {
    const set = new Set(a.days);
    days = b.days.filter((d) => set.has(d));
    if (!days.length) days = [...DEFAULT_FOCUS_DAYS];
  } else if (bRestricts) days = b.days;
  const periods = [...a.periods];
  for (const p of b.periods) {
    if (!periods.some((x) => x.start === p.start && x.end === p.end)) periods.push(p);
  }
  return {
    days,
    timerOn,
    offTimerMin: Math.min(a.offTimerMin, b.offTimerMin),
    waitMin: Math.max(a.waitMin, b.waitMin),
    usageOn,
    usageLimitMin: Math.min(a.usageLimitMin, b.usageLimitMin),
    periodOn,
    periods,
    disabled,
  };
}

export function effectiveLimits(app: FocusApp, state: FocusState): FocusLimits {
  let lim = app.limits;
  for (const g of state.groups) {
    if (!g.appIds.includes(app.id)) continue;
    if (g.limits.timerOn || g.limits.usageOn || g.limits.periodOn || g.limits.disabled) {
      lim = mergeLimits(lim, g.limits);
    }
  }
  return lim;
}

export type BlockReason = "ok" | "off" | "wait" | "cap" | "period" | "day" | "disabled" | "shield";

export function limitsAreOn(limits: FocusLimits): boolean {
  return limits.disabled || limits.timerOn || limits.usageOn || limits.periodOn;
}

export function whyBlocked(app: FocusApp, state: FocusState, ts = Date.now()): BlockReason {
  if (!state.settings.modeOn) return "ok";
  const limits = effectiveLimits(app, state);
  const wait = state.waitUntil[app.id] ?? 0;
  if (wait > ts) return "wait";
  if (state.session?.appId === app.id && state.session.waiting && (state.session.waitUntil ?? 0) > ts) {
    return "wait";
  }
  if (state.settings.blockAllOn && state.settings.shieldOn) return "shield";
  if (limits.disabled) {
    if (!isDayActive(limits.days, ts)) return "day";
    return "disabled";
  }
  const active = limits.timerOn || limits.usageOn || limits.periodOn;
  if (!active) return "ok";
  if (!isDayActive(limits.days, ts)) return "day";
  if (limits.usageOn && (state.todayUsed[app.id] ?? 0) >= limits.usageLimitMin) return "cap";
  if (limits.periodOn && limits.periods.some((p) => inPeriod(minutesNow(ts), p.start, p.end))) return "period";
  if (state.settings.shieldOn && limits.timerOn) {
    const live = state.session?.appId === app.id && !state.session.waiting;
    if (!live) return "shield";
  }
  return "ok";
}

export function blockLabel(reason: BlockReason, app: FocusApp, state: FocusState, ts = Date.now()): string {
  if (reason === "ok") return "";
  if (reason === "off") return "Focus is off. Turn it on from the Focus tab.";
  if (reason === "wait") {
    const until = Math.max(state.waitUntil[app.id] ?? 0, state.session?.waitUntil ?? 0);
    const left = Math.max(1, Math.ceil((until - ts) / 60000));
    return `Waiting ${left} min before this opens again`;
  }
  if (reason === "cap") return "Daily usage limit reached";
  if (reason === "period") return "Restricted in this time window";
  if (reason === "disabled") return `${app.name} is switched off`;
  if (reason === "shield") {
    if (state.settings.blockAllOn) return "Focus shield is locking every listed app. Disarm it in Device access.";
    return "Focus shield is on. Start a session in Focus to open this.";
  }
  return "Off today";
}

export function sortApps(apps: FocusApp[], sort: FocusSort): FocusApp[] {
  const list = [...apps];
  if (sort === "asc") list.sort((a, b) => a.name.localeCompare(b.name) || a.createdAt - b.createdAt);
  else if (sort === "desc") list.sort((a, b) => b.name.localeCompare(a.name) || a.createdAt - b.createdAt);
  else list.sort((a, b) => a.createdAt - b.createdAt || a.name.localeCompare(b.name));
  return list;
}

export function sortGroups(groups: FocusGroup[], sort: FocusSort): FocusGroup[] {
  const list = [...groups];
  if (sort === "asc") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "desc") list.sort((a, b) => b.name.localeCompare(a.name));
  else list.sort((a, b) => a.createdAt - b.createdAt);
  return list;
}

function sampleUsage(now: number): FocusUsageEntry[] {
  const weights: Array<[string, number]> = [
    ["chrome", 0.3079],
    ["albums", 0.1137],
    ["youtube", 0.14],
    ["instagram", 0.11],
    ["gmail", 0.08],
    ["grok", 0.0733],
    ["maps", 0.05],
    ["telegram", 0.04],
    ["paytm", 0.032],
    ["whatsapp", 0.0232],
  ];
  const total = 22858;
  const out: FocusUsageEntry[] = [];
  const noon = Date.parse(`${focusDayKey(now)}T12:00:00`);
  weights.forEach(([id, w], wi) => {
    const seconds = Math.round(total * w);
    const days = 12;
    const slice = Math.max(8, Math.round(seconds / days));
    for (let d = 0; d < days; d++) {
      const at = noon - d * 86400000 - (wi + 1) * 3600000;
      const sec = d === 0 ? Math.round(slice * 1.4) : slice;
      out.push({ id: `seed-${id}-${d}`, appId: id, at, seconds: sec });
    }
  });
  return out;
}

export function mergeFocus(raw: unknown, ts = Date.now()): FocusState {
  const state = normalizeFocus(raw);
  const catalog = focusCatalog();
  const byId = new Map(state.apps.map((a) => [a.id, a]));
  const apps: FocusApp[] = catalog.map((c) => {
    const prev = byId.get(c.id);
    if (!prev) return c;
    return {
      ...c,
      limits: prev.limits,
      pinned: prev.pinned,
      mark: prev.mark || c.mark,
      hue: prev.hue || c.hue,
    };
  });
  for (const a of state.apps) {
    if (a.custom && !apps.some((x) => x.id === a.id)) apps.push(a);
  }
  const usage = state.usageSeeded ? state.usage : sampleUsage(ts);
  const lastDayKey = state.lastDayKey || focusDayKey(ts);
  const todayUsed = lastDayKey === focusDayKey(ts) ? state.todayUsed : {};
  return {
    ...state,
    apps,
    usage,
    usageSeeded: true,
    lastDayKey,
    todayUsed,
  };
}

export function rolloverFocus(state: FocusState, ts = Date.now()): FocusState {
  const key = focusDayKey(ts);
  if (state.lastDayKey === key) return state;
  return { ...state, lastDayKey: key, todayUsed: {} };
}

export type FocusTickEvent = "none" | "warn" | "close" | "wait-end";

export function tickFocus(state: FocusState, ts = Date.now()): { state: FocusState; event: FocusTickEvent } {
  const rolled = rolloverFocus(state, ts);
  if (!rolled.settings.modeOn) {
    if (!rolled.session) return { state: rolled, event: "none" };
    return { state: { ...rolled, session: null }, event: "none" };
  }
  const sess = rolled.session;
  if (!sess) {
    const ended = Object.entries(rolled.waitUntil).filter(([, until]) => until <= ts);
    if (!ended.length) return { state: rolled, event: "none" };
    const waitUntil = { ...rolled.waitUntil };
    for (const [id] of ended) delete waitUntil[id];
    return { state: { ...rolled, waitUntil }, event: ended.length ? "wait-end" : "none" };
  }
  const app = rolled.apps.find((a) => a.id === sess.appId);
  const limits = app ? effectiveLimits(app, rolled) : defaultFocusLimits();
  if (sess.waiting) {
    if ((sess.waitUntil ?? 0) > ts) return { state: rolled, event: "none" };
    const waitUntil = { ...rolled.waitUntil };
    delete waitUntil[sess.appId];
    return { state: { ...rolled, session: null, waitUntil }, event: "wait-end" };
  }
  const elapsedMs = ts - sess.lastTick;
  if (elapsedMs < 400) return { state: rolled, event: "none" };
  const addSec = Math.max(1, Math.floor(elapsedMs / 1000));
  const todayUsed = {
    ...rolled.todayUsed,
    [sess.appId]: (rolled.todayUsed[sess.appId] ?? 0) + addSec / 60,
  };
  const usage: FocusUsageEntry[] = [
    { id: `u-${ts}-${sess.appId}`, appId: sess.appId, at: ts, seconds: addSec },
    ...rolled.usage,
  ].slice(0, 4000);
  const nextSess: FocusSession = { ...sess, lastTick: ts };
  const planned = sess.plannedMs || limits.offTimerMin * 60000;
  const used = ts - sess.startedAt;
  const remaining = planned - used;
  let event: FocusTickEvent = "none";
  if (!sess.warned && remaining > 0 && remaining <= 5 * 60000 && rolled.settings.notifyBeforeClose) {
    nextSess.warned = true;
    event = "warn";
  }
  const capHit = limits.usageOn && todayUsed[sess.appId]! >= limits.usageLimitMin;
  if (limits.timerOn && remaining <= 0 || capHit) {
    const waitMs = Math.max(1, limits.waitMin) * 60000;
    const waitUntilAt = ts + waitMs;
    return {
      state: {
        ...rolled,
        todayUsed,
        usage,
        session: {
          ...nextSess,
          waiting: true,
          waitUntil: waitUntilAt,
        },
        waitUntil: { ...rolled.waitUntil, [sess.appId]: waitUntilAt },
      },
      event: "close",
    };
  }
  return { state: { ...rolled, todayUsed, usage, session: nextSess }, event };
}

export function startSession(state: FocusState, appId: string, ts = Date.now()): { state: FocusState; reason: BlockReason } {
  const app = state.apps.find((a) => a.id === appId);
  if (!app) return { state, reason: "ok" };
  const rolled = rolloverFocus(state, ts);
  if (!rolled.settings.modeOn) return { state: rolled, reason: "off" };
  const reason = whyBlocked(app, rolled, ts);
  const limits = effectiveLimits(app, rolled);
  const allowShieldStart = reason === "shield" && !rolled.settings.blockAllOn && !limits.disabled && limits.timerOn;
  if (reason !== "ok" && !allowShieldStart) return { state: rolled, reason };
  const plannedMs = (limits.timerOn ? limits.offTimerMin : Math.max(limits.usageLimitMin, 60)) * 60000;
  return {
    state: {
      ...rolled,
      session: {
        appId,
        startedAt: ts,
        lastTick: ts,
        plannedMs,
        waiting: false,
        waitUntil: null,
        warned: false,
      },
    },
    reason: "ok",
  };
}

export function startAway(state: FocusState, ts = Date.now()): FocusState {
  if (!state.settings.modeOn || !state.settings.shieldOn) return state;
  if (state.session && !state.session.waiting) return state;
  const rolled = rolloverFocus(state, ts);
  const app = rolled.apps.find((a) => a.id === AWAY_APP_ID);
  const minutes = app ? effectiveLimits(app, rolled).offTimerMin : rolled.settings.defaultOffMin;
  return {
    ...rolled,
    session: {
      appId: AWAY_APP_ID,
      startedAt: ts,
      lastTick: ts,
      plannedMs: Math.max(1, minutes) * 60000,
      waiting: false,
      waitUntil: null,
      warned: false,
    },
  };
}

export function armDeviceLock(state: FocusState, ts = Date.now()): FocusState {
  return {
    ...state,
    settings: {
      ...state.settings,
      modeOn: true,
      shieldOn: true,
      blockAllOn: true,
      accessGrantedAt: ts,
    },
  };
}

export function disarmDeviceLock(state: FocusState): FocusState {
  return {
    ...state,
    settings: {
      ...state.settings,
      shieldOn: false,
      blockAllOn: false,
    },
    session: state.session?.appId === AWAY_APP_ID ? null : state.session,
  };
}

export function setFocusMode(state: FocusState, on: boolean, ts = Date.now()): FocusState {
  if (on) {
    if (state.settings.modeOn) return state;
    return { ...state, settings: { ...state.settings, modeOn: true } };
  }
  const ticked = state.settings.modeOn && state.session ? tickFocus(state, ts).state : state;
  return {
    ...ticked,
    settings: { ...ticked.settings, modeOn: false },
    session: null,
  };
}

export function lockedCount(state: FocusState, ts = Date.now()): number {
  if (!state.settings.modeOn) return 0;
  return state.apps.filter((a) => a.id !== AWAY_APP_ID && whyBlocked(a, state, ts) !== "ok").length;
}

export function stopSession(state: FocusState, ts = Date.now()): FocusState {
  if (!state.session) return state;
  const ticked = tickFocus(state, ts).state;
  return { ...ticked, session: null };
}

export function setpaperAppForPath(pathname: string, apps: FocusApp[]): FocusApp | undefined {
  const mapped = apps.filter((a) => a.kind === "setpaper" && a.route);
  const hits = mapped.filter((a) => {
    const route = a.route!;
    if (route === "/") return pathname === "/" || pathname.startsWith("/overview") || pathname.startsWith("/session") || pathname.startsWith("/study");
    return pathname === route || pathname.startsWith(`${route}/`);
  });
  return hits.sort((a, b) => (b.route?.length ?? 0) - (a.route?.length ?? 0))[0];
}

export function usageWindow(state: FocusState, range: "24h" | "30d", ts = Date.now()): Array<{
  app: FocusApp;
  seconds: number;
  percent: number;
}> {
  const from = range === "24h" ? ts - 86400000 : ts - 30 * 86400000;
  const totals = new Map<string, number>();
  for (const row of state.usage) {
    if (row.at < from) continue;
    totals.set(row.appId, (totals.get(row.appId) ?? 0) + row.seconds);
  }
  const sum = [...totals.values()].reduce((n, v) => n + v, 0) || 1;
  const rows = [...totals.entries()]
    .map(([id, seconds]) => {
      const app = state.apps.find((a) => a.id === id);
      if (!app) return null;
      return { app, seconds, percent: (seconds / sum) * 100 };
    })
    .filter((r): r is { app: FocusApp; seconds: number; percent: number } => Boolean(r))
    .sort((a, b) => b.seconds - a.seconds);
  return rows;
}

export function remainingMs(session: FocusSession | null, ts = Date.now()): number {
  if (!session || session.waiting) return 0;
  return Math.max(0, session.plannedMs - (ts - session.startedAt));
}

export function addCustomApp(state: FocusState, name: string): FocusState {
  const trimmed = name.trim().slice(0, 40);
  if (!trimmed) return state;
  const base = slugApp(trimmed) || "app";
  let id = `custom-${base}`;
  let n = 2;
  while (state.apps.some((a) => a.id === id)) {
    id = `custom-${base}-${n++}`;
  }
  const app = makeApp(id, trimmed, "custom", null, Date.now());
  return { ...state, apps: [...state.apps, app] };
}

export { defaultFocus };
