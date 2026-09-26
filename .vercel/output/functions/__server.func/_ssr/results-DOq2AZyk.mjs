import { n as createMiddleware } from "./ssr.mjs";
import { S as normalizeFocus, l as defaultFocusLimits, n as DEFAULT_FOCUS_DAYS } from "./types-XZVWHhWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-DOq2AZyk.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CVqXY6bk.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-_hq0tw-r.mjs");
	const { requireUserId } = await import("./verify.server-BVtlV_Bv.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var AWAY_APP_ID = "sp-device";
var wakeSentinel = null;
function notifyState() {
	if (typeof Notification === "undefined") return "unsupported";
	return Notification.permission;
}
function readDeviceAccess() {
	if (typeof window === "undefined") return {
		notify: "unsupported",
		persist: false,
		persistSupported: false,
		wakeSupported: false,
		standalone: false,
		related: [],
		hidden: false
	};
	const nav = navigator;
	const standalone = window.matchMedia("(display-mode: standalone)").matches || Boolean(nav.standalone);
	return {
		notify: notifyState(),
		persist: false,
		persistSupported: Boolean(nav.storage?.persist),
		wakeSupported: Boolean(nav.wakeLock),
		standalone,
		related: [],
		hidden: document.visibilityState === "hidden"
	};
}
async function grantDeviceAccess() {
	const access = readDeviceAccess();
	if (typeof window === "undefined") return access;
	if (access.notify !== "unsupported" && access.notify !== "granted") try {
		await Notification.requestPermission();
	} catch {}
	let persist = false;
	try {
		persist = await navigator.storage?.persist?.() ?? false;
	} catch {
		persist = false;
	}
	await holdWakeLock();
	const related = await readRelatedApps();
	return {
		...readDeviceAccess(),
		persist,
		related,
		notify: notifyState()
	};
}
async function readRelatedApps() {
	const nav = navigator;
	if (!nav.getInstalledRelatedApps) return [];
	try {
		return (await nav.getInstalledRelatedApps()).map((a) => a.id || a.url || a.platform || "").map((s) => s.trim()).filter(Boolean).slice(0, 20);
	} catch {
		return [];
	}
}
async function holdWakeLock() {
	const nav = navigator;
	if (!nav.wakeLock) return false;
	try {
		if (wakeSentinel && wakeSentinel.released === false) return true;
		wakeSentinel = await nav.wakeLock.request("screen");
		wakeSentinel.addEventListener("release", () => {
			wakeSentinel = null;
		});
		return true;
	} catch {
		wakeSentinel = null;
		return false;
	}
}
function releaseWakeLock() {
	if (!wakeSentinel) return;
	wakeSentinel.release().catch(() => void 0);
	wakeSentinel = null;
}
async function showFocusNotice(title, body) {
	if (typeof window === "undefined" || typeof Notification === "undefined") return false;
	if (Notification.permission !== "granted") return false;
	try {
		const registration = await navigator.serviceWorker?.getRegistration?.();
		if (registration?.showNotification) {
			await registration.showNotification(title, {
				body,
				tag: "setpaper-focus",
				silent: false
			});
			return true;
		}
		const note = new Notification(title, {
			body,
			tag: "setpaper-focus"
		});
		window.setTimeout(() => note.close(), 8e3);
		return true;
	} catch {
		return false;
	}
}
var FOCUS_WEEKDAYS = [
	{
		id: 0,
		label: "S"
	},
	{
		id: 1,
		label: "M"
	},
	{
		id: 2,
		label: "T"
	},
	{
		id: 3,
		label: "W"
	},
	{
		id: 4,
		label: "T"
	},
	{
		id: 5,
		label: "F"
	},
	{
		id: 6,
		label: "S"
	}
];
var STUDY = [
	[
		"sp-tests",
		"SetPaper Tests",
		"/"
	],
	[
		"sp-notes",
		"SetPaper Notes",
		"/notes"
	],
	[
		"sp-connect",
		"SetPaper Connect",
		"/connect"
	],
	[
		"sp-coaching",
		"SetPaper Coaching",
		"/coaching"
	],
	[
		"sp-target",
		"SetPaper Target",
		"/target"
	]
];
var PHONE = [
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
	"Zomato"
];
function slugApp(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
function markFromName(name) {
	const parts = name.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "A";
}
function markHue(id) {
	let h = 2166136261;
	for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
	return (h >>> 0) % 360;
}
function makeApp(id, name, kind, route, createdAt) {
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
		limits: defaultFocusLimits()
	};
}
function focusCatalog() {
	const device = makeApp(AWAY_APP_ID, "This device", "setpaper", null, 0);
	const study = STUDY.map(([id, name, route], i) => makeApp(id, name, "setpaper", route, i + 1));
	const phone = PHONE.map((name, i) => makeApp(slugApp(name), name, "catalog", null, 100 + i));
	return [
		device,
		...study,
		...phone
	];
}
function hashPin(pin) {
	let h = 2166136261;
	const s = `setpaper-focus:${pin}`;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return (h >>> 0).toString(16).padStart(8, "0");
}
function pinOk(hash, pin) {
	return Boolean(hash) && hash === hashPin(pin);
}
function focusDayKey(ts = Date.now()) {
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function minutesNow(ts = Date.now()) {
	const d = new Date(ts);
	return d.getHours() * 60 + d.getMinutes();
}
function parseHm(hm) {
	const [h, m] = hm.split(":").map(Number);
	return (Number(h) || 0) * 60 + (Number(m) || 0);
}
function inPeriod(nowMin, start, end) {
	const a = parseHm(start);
	const b = parseHm(end);
	if (a === b) return true;
	if (a < b) return nowMin >= a && nowMin < b;
	return nowMin >= a || nowMin < b;
}
function isDayActive(days, ts = Date.now()) {
	return days.includes(new Date(ts).getDay());
}
function formatDurationMin(min) {
	const n = Math.max(0, Math.round(min));
	if (n < 60) return `${n} minute${n === 1 ? "" : "s"}`;
	const h = Math.floor(n / 60);
	const m = n % 60;
	if (m === 0) return `${h} hour${h === 1 ? "" : "s"}`;
	return `${h}h ${m}m`;
}
function formatUsage(seconds) {
	const s = Math.max(0, Math.round(seconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = s % 60;
	const parts = [];
	if (h) parts.push(`${h} hour${h === 1 ? "" : "s"}`);
	if (m) parts.push(`${m} minute${m === 1 ? "" : "s"}`);
	if (sec || !parts.length) parts.push(`${sec} second${sec === 1 ? "" : "s"}`);
	return parts.join(" ");
}
function withPeriodOn(limits) {
	const periods = limits.periods.length ? limits.periods : [{
		id: "p-default",
		start: "12:00",
		end: "00:00"
	}];
	return {
		...limits,
		periodOn: true,
		periods
	};
}
function mergeLimits(a, b) {
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
	for (const p of b.periods) if (!periods.some((x) => x.start === p.start && x.end === p.end)) periods.push(p);
	return {
		days,
		timerOn,
		offTimerMin: Math.min(a.offTimerMin, b.offTimerMin),
		waitMin: Math.max(a.waitMin, b.waitMin),
		usageOn,
		usageLimitMin: Math.min(a.usageLimitMin, b.usageLimitMin),
		periodOn,
		periods,
		disabled
	};
}
function effectiveLimits(app, state) {
	let lim = app.limits;
	for (const g of state.groups) {
		if (!g.appIds.includes(app.id)) continue;
		if (g.limits.timerOn || g.limits.usageOn || g.limits.periodOn || g.limits.disabled) lim = mergeLimits(lim, g.limits);
	}
	return lim;
}
function whyBlocked(app, state, ts = Date.now()) {
	if (!state.settings.modeOn) return "ok";
	const limits = effectiveLimits(app, state);
	if ((state.waitUntil[app.id] ?? 0) > ts) return "wait";
	if (state.session?.appId === app.id && state.session.waiting && (state.session.waitUntil ?? 0) > ts) return "wait";
	if (state.settings.blockAllOn && state.settings.shieldOn) return "shield";
	if (limits.disabled) {
		if (!isDayActive(limits.days, ts)) return "day";
		return "disabled";
	}
	if (!(limits.timerOn || limits.usageOn || limits.periodOn)) return "ok";
	if (!isDayActive(limits.days, ts)) return "day";
	if (limits.usageOn && (state.todayUsed[app.id] ?? 0) >= limits.usageLimitMin) return "cap";
	if (limits.periodOn && limits.periods.some((p) => inPeriod(minutesNow(ts), p.start, p.end))) return "period";
	if (state.settings.shieldOn && limits.timerOn) {
		if (!(state.session?.appId === app.id && !state.session.waiting)) return "shield";
	}
	return "ok";
}
function blockLabel(reason, app, state, ts = Date.now()) {
	if (reason === "ok") return "";
	if (reason === "off") return "Focus is off. Turn it on from the Focus tab.";
	if (reason === "wait") {
		const until = Math.max(state.waitUntil[app.id] ?? 0, state.session?.waitUntil ?? 0);
		return `Waiting ${Math.max(1, Math.ceil((until - ts) / 6e4))} min before this opens again`;
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
function sortApps(apps, sort) {
	const list = [...apps];
	if (sort === "asc") list.sort((a, b) => a.name.localeCompare(b.name) || a.createdAt - b.createdAt);
	else if (sort === "desc") list.sort((a, b) => b.name.localeCompare(a.name) || a.createdAt - b.createdAt);
	else list.sort((a, b) => a.createdAt - b.createdAt || a.name.localeCompare(b.name));
	return list;
}
function sortGroups(groups, sort) {
	const list = [...groups];
	if (sort === "asc") list.sort((a, b) => a.name.localeCompare(b.name));
	else if (sort === "desc") list.sort((a, b) => b.name.localeCompare(a.name));
	else list.sort((a, b) => a.createdAt - b.createdAt);
	return list;
}
function sampleUsage(now) {
	const weights = [
		["chrome", .3079],
		["albums", .1137],
		["youtube", .14],
		["instagram", .11],
		["gmail", .08],
		["grok", .0733],
		["maps", .05],
		["telegram", .04],
		["paytm", .032],
		["whatsapp", .0232]
	];
	const total = 22858;
	const out = [];
	const noon = Date.parse(`${focusDayKey(now)}T12:00:00`);
	weights.forEach(([id, w], wi) => {
		const seconds = Math.round(total * w);
		const days = 12;
		const slice = Math.max(8, Math.round(seconds / days));
		for (let d = 0; d < days; d++) {
			const at = noon - d * 864e5 - (wi + 1) * 36e5;
			const sec = d === 0 ? Math.round(slice * 1.4) : slice;
			out.push({
				id: `seed-${id}-${d}`,
				appId: id,
				at,
				seconds: sec
			});
		}
	});
	return out;
}
function mergeFocus(raw, ts = Date.now()) {
	const state = normalizeFocus(raw);
	const catalog = focusCatalog();
	const byId = new Map(state.apps.map((a) => [a.id, a]));
	const apps = catalog.map((c) => {
		const prev = byId.get(c.id);
		if (!prev) return c;
		return {
			...c,
			limits: prev.limits,
			pinned: prev.pinned,
			mark: prev.mark || c.mark,
			hue: prev.hue || c.hue
		};
	});
	for (const a of state.apps) if (a.custom && !apps.some((x) => x.id === a.id)) apps.push(a);
	const usage = state.usageSeeded ? state.usage : sampleUsage(ts);
	const lastDayKey = state.lastDayKey || focusDayKey(ts);
	const todayUsed = lastDayKey === focusDayKey(ts) ? state.todayUsed : {};
	return {
		...state,
		apps,
		usage,
		usageSeeded: true,
		lastDayKey,
		todayUsed
	};
}
function rolloverFocus(state, ts = Date.now()) {
	const key = focusDayKey(ts);
	if (state.lastDayKey === key) return state;
	return {
		...state,
		lastDayKey: key,
		todayUsed: {}
	};
}
function tickFocus(state, ts = Date.now()) {
	const rolled = rolloverFocus(state, ts);
	if (!rolled.settings.modeOn) {
		if (!rolled.session) return {
			state: rolled,
			event: "none"
		};
		return {
			state: {
				...rolled,
				session: null
			},
			event: "none"
		};
	}
	const sess = rolled.session;
	if (!sess) {
		const ended = Object.entries(rolled.waitUntil).filter(([, until]) => until <= ts);
		if (!ended.length) return {
			state: rolled,
			event: "none"
		};
		const waitUntil = { ...rolled.waitUntil };
		for (const [id] of ended) delete waitUntil[id];
		return {
			state: {
				...rolled,
				waitUntil
			},
			event: ended.length ? "wait-end" : "none"
		};
	}
	const app = rolled.apps.find((a) => a.id === sess.appId);
	const limits = app ? effectiveLimits(app, rolled) : defaultFocusLimits();
	if (sess.waiting) {
		if ((sess.waitUntil ?? 0) > ts) return {
			state: rolled,
			event: "none"
		};
		const waitUntil = { ...rolled.waitUntil };
		delete waitUntil[sess.appId];
		return {
			state: {
				...rolled,
				session: null,
				waitUntil
			},
			event: "wait-end"
		};
	}
	const elapsedMs = ts - sess.lastTick;
	if (elapsedMs < 400) return {
		state: rolled,
		event: "none"
	};
	const addSec = Math.max(1, Math.floor(elapsedMs / 1e3));
	const todayUsed = {
		...rolled.todayUsed,
		[sess.appId]: (rolled.todayUsed[sess.appId] ?? 0) + addSec / 60
	};
	const usage = [{
		id: `u-${ts}-${sess.appId}`,
		appId: sess.appId,
		at: ts,
		seconds: addSec
	}, ...rolled.usage].slice(0, 4e3);
	const nextSess = {
		...sess,
		lastTick: ts
	};
	const remaining = (sess.plannedMs || limits.offTimerMin * 6e4) - (ts - sess.startedAt);
	let event = "none";
	if (!sess.warned && remaining > 0 && remaining <= 3e5 && rolled.settings.notifyBeforeClose) {
		nextSess.warned = true;
		event = "warn";
	}
	const capHit = limits.usageOn && todayUsed[sess.appId] >= limits.usageLimitMin;
	if (limits.timerOn && remaining <= 0 || capHit) {
		const waitUntilAt = ts + Math.max(1, limits.waitMin) * 6e4;
		return {
			state: {
				...rolled,
				todayUsed,
				usage,
				session: {
					...nextSess,
					waiting: true,
					waitUntil: waitUntilAt
				},
				waitUntil: {
					...rolled.waitUntil,
					[sess.appId]: waitUntilAt
				}
			},
			event: "close"
		};
	}
	return {
		state: {
			...rolled,
			todayUsed,
			usage,
			session: nextSess
		},
		event
	};
}
function startSession(state, appId, ts = Date.now()) {
	const app = state.apps.find((a) => a.id === appId);
	if (!app) return {
		state,
		reason: "ok"
	};
	const rolled = rolloverFocus(state, ts);
	if (!rolled.settings.modeOn) return {
		state: rolled,
		reason: "off"
	};
	const reason = whyBlocked(app, rolled, ts);
	const limits = effectiveLimits(app, rolled);
	const allowShieldStart = reason === "shield" && !rolled.settings.blockAllOn && !limits.disabled && limits.timerOn;
	if (reason !== "ok" && !allowShieldStart) return {
		state: rolled,
		reason
	};
	const plannedMs = (limits.timerOn ? limits.offTimerMin : Math.max(limits.usageLimitMin, 60)) * 6e4;
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
				warned: false
			}
		},
		reason: "ok"
	};
}
function startAway(state, ts = Date.now()) {
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
			plannedMs: Math.max(1, minutes) * 6e4,
			waiting: false,
			waitUntil: null,
			warned: false
		}
	};
}
function armDeviceLock(state, ts = Date.now()) {
	return {
		...state,
		settings: {
			...state.settings,
			modeOn: true,
			shieldOn: true,
			blockAllOn: true,
			accessGrantedAt: ts
		}
	};
}
function disarmDeviceLock(state) {
	return {
		...state,
		settings: {
			...state.settings,
			shieldOn: false,
			blockAllOn: false
		},
		session: state.session?.appId === "sp-device" ? null : state.session
	};
}
function setFocusMode(state, on, ts = Date.now()) {
	if (on) {
		if (state.settings.modeOn) return state;
		return {
			...state,
			settings: {
				...state.settings,
				modeOn: true
			}
		};
	}
	const ticked = state.settings.modeOn && state.session ? tickFocus(state, ts).state : state;
	return {
		...ticked,
		settings: {
			...ticked.settings,
			modeOn: false
		},
		session: null
	};
}
function lockedCount(state, ts = Date.now()) {
	if (!state.settings.modeOn) return 0;
	return state.apps.filter((a) => a.id !== "sp-device" && whyBlocked(a, state, ts) !== "ok").length;
}
function stopSession(state, ts = Date.now()) {
	if (!state.session) return state;
	return {
		...tickFocus(state, ts).state,
		session: null
	};
}
function setpaperAppForPath(pathname, apps) {
	return apps.filter((a) => a.kind === "setpaper" && a.route).filter((a) => {
		const route = a.route;
		if (route === "/") return pathname === "/" || pathname.startsWith("/overview") || pathname.startsWith("/session") || pathname.startsWith("/study");
		return pathname === route || pathname.startsWith(`${route}/`);
	}).sort((a, b) => (b.route?.length ?? 0) - (a.route?.length ?? 0))[0];
}
function usageWindow(state, range, ts = Date.now()) {
	const from = range === "24h" ? ts - 864e5 : ts - 2592e6;
	const totals = /* @__PURE__ */ new Map();
	for (const row of state.usage) {
		if (row.at < from) continue;
		totals.set(row.appId, (totals.get(row.appId) ?? 0) + row.seconds);
	}
	const sum = [...totals.values()].reduce((n, v) => n + v, 0) || 1;
	return [...totals.entries()].map(([id, seconds]) => {
		const app = state.apps.find((a) => a.id === id);
		if (!app) return null;
		return {
			app,
			seconds,
			percent: seconds / sum * 100
		};
	}).filter((r) => Boolean(r)).sort((a, b) => b.seconds - a.seconds);
}
function remainingMs(session, ts = Date.now()) {
	if (!session || session.waiting) return 0;
	return Math.max(0, session.plannedMs - (ts - session.startedAt));
}
function addCustomApp(state, name) {
	const trimmed = name.trim().slice(0, 40);
	if (!trimmed) return state;
	const base = slugApp(trimmed) || "app";
	let id = `custom-${base}`;
	let n = 2;
	while (state.apps.some((a) => a.id === id)) id = `custom-${base}-${n++}`;
	const app = makeApp(id, trimmed, "custom", null, Date.now());
	return {
		...state,
		apps: [...state.apps, app]
	};
}
var TAG_WRONG = "wrong";
var TAG_SKIPPED = "skipped";
var TAG_MARKED = "marked";
function bucketPaperId(deckId, kind) {
	return `bucket:${deckId}:${kind}`;
}
function applyResultTags(tags, item, marked) {
	const next = tags.filter((t) => t !== "wrong" && t !== "skipped" && t !== "marked");
	if (!item.isAttempted) next.push(TAG_SKIPPED);
	else if (!item.isCorrect) next.push(TAG_WRONG);
	if (marked) next.push(TAG_MARKED);
	return next;
}
function stampCardFromItem(card, item) {
	const corrected = item.isAttempted && item.isCorrect;
	const marked = Boolean(item.isMarked) || card.marked && !corrected;
	return {
		marked,
		tags: applyResultTags(card.tags, item, marked)
	};
}
function hasTag(card, tag) {
	return card.tags.includes(tag);
}
function isWrongCard(card) {
	return hasTag(card, TAG_WRONG);
}
function isSkippedCard(card) {
	return hasTag(card, TAG_SKIPPED);
}
function isMarkedCard(card) {
	return card.marked || hasTag(card, "marked");
}
function isCorrectCard(card) {
	if (isWrongCard(card) || isSkippedCard(card)) return false;
	return card.lastRating === "good" || card.lastRating === "easy" || card.lastRating === "hard";
}
function resultCounts(cards, deckId) {
	const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended");
	return {
		wrong: mine.filter(isWrongCard).length,
		marked: mine.filter(isMarkedCard).length,
		skipped: mine.filter(isSkippedCard).length,
		correct: mine.filter(isCorrectCard).length
	};
}
function cardsForBucket(cards, deckId, bucket) {
	const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended" && c.queue !== "buried");
	if (bucket === "wrong") return mine.filter(isWrongCard);
	if (bucket === "skipped") return mine.filter(isSkippedCard);
	if (bucket === "marked") return mine.filter(isMarkedCard);
	if (bucket === "correct") return mine.filter(isCorrectCard);
	return mine.filter((c) => !isSkippedCard(c) && Boolean(c.lastRating));
}
function idsForSessionPick(session, pick) {
	if (pick === "wrong") return session.wrongIds ?? session.againIds ?? [];
	if (pick === "skipped") return session.skippedIds ?? [];
	if (pick === "marked") return session.markedIds ?? session.hardIds ?? [];
	if (pick === "correct") return session.correctIds ?? session.goodIds ?? [];
	const attempted = [
		...session.wrongIds ?? session.againIds ?? [],
		...session.correctIds ?? session.goodIds ?? [],
		...session.hardIds ?? []
	];
	return [...new Set(attempted)];
}
function splitResultIds(payload) {
	const wrongIds = [];
	const skippedIds = [];
	const markedIds = [];
	const correctIds = [];
	const againIds = [];
	const hardIds = [];
	const goodIds = [];
	for (const item of payload.items) {
		const id = String(item.bankId);
		if (!item.isAttempted) skippedIds.push(id);
		else if (!item.isCorrect) wrongIds.push(id);
		else correctIds.push(id);
		if (item.isMarked) markedIds.push(id);
		if (!item.isAttempted || !item.isCorrect) againIds.push(id);
		else if (item.isMarked) hardIds.push(id);
		else goodIds.push(id);
	}
	return {
		wrongIds,
		skippedIds,
		markedIds,
		correctIds,
		againIds,
		hardIds,
		goodIds
	};
}
function upsertBucketPapers(papers, deckId, buckets, sessionId, now = Date.now()) {
	const kinds = [
		{
			kind: "wrong",
			ids: buckets.wrong,
			title: `Learning / Wrong · ${buckets.wrong.length} Q`
		},
		{
			kind: "skipped",
			ids: buckets.skipped,
			title: `Unattempted · ${buckets.skipped.length} Q`
		},
		{
			kind: "marked",
			ids: buckets.marked,
			title: `Review · ${buckets.marked.length} Q`
		},
		{
			kind: "correct",
			ids: buckets.correct,
			title: `Correct · ${buckets.correct.length} Q`
		}
	];
	const replace = new Set(kinds.map((k) => bucketPaperId(deckId, k.kind)));
	replace.add(bucketPaperId(deckId, "hard"));
	const kept = papers.filter((p) => !replace.has(p.id) && !(p.deckId === deckId && (p.kind === "wrong" || p.kind === "hard") && p.id.startsWith("bucket:")));
	const next = [];
	for (const row of kinds) {
		if (!row.ids.length) continue;
		next.push({
			id: bucketPaperId(deckId, row.kind),
			deckId,
			kind: row.kind,
			title: row.title,
			questionIds: row.ids,
			createdAt: now,
			dueAt: now,
			repetition: 0,
			sourceSessionId: sessionId
		});
	}
	return [...next, ...kept].slice(0, 80);
}
function rollingBucketsFromCards(cards, deckId) {
	const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended");
	return {
		wrong: mine.filter(isWrongCard).map((c) => c.id),
		skipped: mine.filter(isSkippedCard).map((c) => c.id),
		marked: mine.filter(isMarkedCard).map((c) => c.id),
		correct: mine.filter(isCorrectCard).map((c) => c.id)
	};
}
function normalizeSessionSummary(raw) {
	if (!raw || typeof raw !== "object") return null;
	const s = raw;
	const id = String(s.id ?? "").trim();
	const deckId = String(s.deckId ?? "").trim();
	if (!id || !deckId) return null;
	const againIds = Array.isArray(s.againIds) ? s.againIds.map(String) : [];
	const hardIds = Array.isArray(s.hardIds) ? s.hardIds.map(String) : [];
	const goodIds = Array.isArray(s.goodIds) ? s.goodIds.map(String) : [];
	return {
		id,
		deckId,
		at: Number(s.at) || Date.now(),
		total: Math.max(0, Number(s.total) || 0),
		correct: Math.max(0, Number(s.correct) || 0),
		wrong: Math.max(0, Number(s.wrong) || 0),
		notAttempted: Math.max(0, Number(s.notAttempted) || 0),
		marked: Math.max(0, Number(s.marked) || 0),
		againIds,
		hardIds,
		goodIds,
		wrongIds: Array.isArray(s.wrongIds) ? s.wrongIds.map(String) : againIds,
		skippedIds: Array.isArray(s.skippedIds) ? s.skippedIds.map(String) : [],
		markedIds: Array.isArray(s.markedIds) ? s.markedIds.map(String) : hardIds,
		correctIds: Array.isArray(s.correctIds) ? s.correctIds.map(String) : goodIds,
		paperId: s.paperId ? String(s.paperId) : null,
		templateId: s.templateId ? String(s.templateId) : null
	};
}
function normalizeSessions(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of raw) {
		const row = normalizeSessionSummary(item);
		if (!row || seen.has(row.id)) continue;
		seen.add(row.id);
		out.push(row);
		if (out.length >= 120) break;
	}
	return out;
}
function lastSessionForDeck(sessions, deckId) {
	return sessions.find((s) => s.deckId === deckId) ?? null;
}
function uniqueIds(ids) {
	return [...new Set(ids.filter(Boolean))];
}
function mergeSessionResults(parent, split, payload) {
	const touched = new Set(payload.items.map((item) => String(item.bankId)));
	const drop = (ids) => (ids ?? []).filter((id) => !touched.has(id));
	const wrongIds = uniqueIds([...drop(parent.wrongIds ?? parent.againIds), ...split.wrongIds]);
	const skippedIds = uniqueIds([...drop(parent.skippedIds), ...split.skippedIds]);
	const markedIds = uniqueIds([...drop(parent.markedIds ?? parent.hardIds), ...split.markedIds]);
	const correctIds = uniqueIds([...drop(parent.correctIds ?? parent.goodIds), ...split.correctIds]);
	const againIds = uniqueIds([...drop(parent.againIds), ...split.againIds]);
	const hardIds = uniqueIds([...drop(parent.hardIds), ...split.hardIds]);
	const goodIds = uniqueIds([...drop(parent.goodIds), ...split.goodIds]);
	return {
		...parent,
		at: Date.now(),
		wrongIds,
		skippedIds,
		markedIds,
		correctIds,
		againIds,
		hardIds,
		goodIds,
		wrong: wrongIds.length,
		notAttempted: skippedIds.length,
		marked: markedIds.length,
		correct: correctIds.length,
		total: Math.max(parent.total || 0, payload.total || 0, wrongIds.length + skippedIds.length + correctIds.length)
	};
}
function asTemplateResult(session, deckName) {
	return {
		sessionId: session.id,
		deckId: session.deckId,
		deckName,
		at: session.at,
		total: session.total,
		correct: session.correct,
		wrong: session.wrong,
		notAttempted: session.notAttempted,
		marked: session.marked
	};
}
function paperKindLabel(kind) {
	if (kind === "wrong" || kind === "hard") return "Learning / Wrong";
	if (kind === "skipped") return "Unattempted";
	if (kind === "marked") return "Review";
	return "Correct";
}
//#endregion
export { setpaperAppForPath as A, upsertBucketPapers as B, pinOk as C, resultCounts as D, remainingMs as E, stampCardFromItem as F, whyBlocked as H, startAway as I, startSession as L, sortApps as M, sortGroups as N, rollingBucketsFromCards as O, splitResultIds as P, stopSession as R, paperKindLabel as S, releaseWakeLock as T, withPeriodOn as U, usageWindow as V, lockedCount as _, authMiddleware as a, normalizeSessionSummary as b, disarmDeviceLock as c, formatUsage as d, grantDeviceAccess as f, lastSessionForDeck as g, idsForSessionPick as h, asTemplateResult as i, showFocusNotice as j, setFocusMode as k, effectiveLimits as l, holdWakeLock as m, addCustomApp as n, blockLabel as o, hashPin as p, armDeviceLock as r, cardsForBucket as s, FOCUS_WEEKDAYS as t, formatDurationMin as u, mergeFocus as v, readDeviceAccess as w, normalizeSessions as x, mergeSessionResults as y, tickFocus as z };
