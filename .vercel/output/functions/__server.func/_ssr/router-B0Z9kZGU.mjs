import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as __exportAll } from "./ssr.mjs";
import { l as defaultFocusLimits } from "./types-XZVWHhWz.mjs";
import { C as pinOk, E as remainingMs, H as whyBlocked, L as startSession, M as sortApps, N as sortGroups, R as stopSession, U as withPeriodOn, V as usageWindow, _ as lockedCount, c as disarmDeviceLock, d as formatUsage, f as grantDeviceAccess, k as setFocusMode, l as effectiveLimits, n as addCustomApp, o as blockLabel, p as hashPin, r as armDeviceLock, t as FOCUS_WEEKDAYS, u as formatDurationMin, v as mergeFocus, w as readDeviceAccess } from "./results-DOq2AZyk.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { B as string, H as unknown, I as number, L as object, M as discriminatedUnion, O as _enum, P as literal, V as union } from "../_libs/@better-auth/core+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { B as Menu, C as ScanLine, D as Plus, Dt as Bell, K as ListFilter, N as Moon, O as Pin, Ot as Ban, S as Search, W as Lock, X as Hourglass, _ as Shield, bt as Check, c as UserPlus, d as TriangleAlert, f as Trash2, ft as Clock3, gt as CircleHelp, i as Volume2, kt as ArrowLeft, ot as Eye, q as Info, st as EyeOff, xt as ChartPie } from "../_libs/lucide-react.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { n as number$1 } from "../_libs/zod.mjs";
import { n as auth } from "./server-YrZHZ2cB.mjs";
import { B as Label, D as connectAccount, H as Button, I as toastOutcome, M as pushCurrentCollection, N as rememberedEmail, O as didCollectionChange, P as restoreFromCloud, R as useCurrentUserState, V as Input, W as cn, a as DialogDescription, b as unlockFocusSfx, c as AnkiShell, g as SheetContent, h as Sheet, i as DialogContent, j as isApplyingRemote, k as digitsFromPhoneEmail, m as FocusMark, n as Switch, nt as useExamStore, o as DialogHeader, r as Dialog, s as DialogTitle, tt as uid, v as playFocusSfx, z as useSyncUi } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-COvVJPFy.js
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-B0Z9kZGU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function AccountForm({ idPrefix, defaultMode = "signup", defaultVia = "email", onSuccess }) {
	const [mode, setMode] = (0, import_react.useState)(defaultMode === "signin" ? "signin" : "signup");
	const [via, setVia] = (0, import_react.useState)(defaultVia);
	const [emailId, setEmailId] = (0, import_react.useState)("");
	const [mobileId, setMobileId] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const remembered = rememberedEmail();
		if (!remembered) return;
		const digits = digitsFromPhoneEmail(remembered) ?? (/^[6-9]\d{9}$/.test(remembered) ? remembered : null);
		if (digits) {
			setVia("mobile");
			setMobileId(digits);
		} else if (remembered.includes("@")) {
			setVia("email");
			setEmailId(remembered);
		}
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (mode === "signup" && password !== confirm) {
			setError("Passwords do not match");
			return;
		}
		setBusy(true);
		try {
			const { outcome, account } = await connectAccount(via === "mobile" ? mobileId : emailId, password, mode, via);
			toastOutcome(outcome, account.label);
			onSuccess?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open this account");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: (e) => void onSubmit(e),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: via,
				onValueChange: (v) => setVia(v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "email",
						children: "Email ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "mobile",
						children: "Mobile number"
					})]
				})
			}),
			via === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `${idPrefix}-email`,
					children: "Email ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `${idPrefix}-email`,
					type: "email",
					autoComplete: "email",
					inputMode: "email",
					placeholder: "you@example.com",
					value: emailId,
					onChange: (e) => setEmailId(e.target.value),
					required: true,
					autoFocus: true
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `${idPrefix}-mobile`,
						children: "Mobile number"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 shrink-0 place-items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground",
							children: "+91"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: `${idPrefix}-mobile`,
							type: "tel",
							autoComplete: "tel",
							inputMode: "numeric",
							placeholder: "98765 43210",
							value: mobileId,
							onChange: (e) => setMobileId(e.target.value.replace(/[^\d+\s-]/g, "")),
							required: true,
							autoFocus: true,
							maxLength: 14
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "10-digit Indian mobile. Same number later restores this collection."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: mode,
				onValueChange: (v) => setMode(v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "signup",
						children: "Create account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "signin",
						children: "Sign in"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `${idPrefix}-password`,
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `${idPrefix}-password`,
						type: showPassword ? "text" : "password",
						autoComplete: mode === "signup" ? "new-password" : "current-password",
						placeholder: "At least 8 characters",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						minLength: 8,
						required: true,
						className: "pr-11"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground",
						onClick: () => setShowPassword((v) => !v),
						"aria-label": showPassword ? "Hide password" : "Show password",
						children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
					})]
				})]
			}),
			mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `${idPrefix}-confirm`,
					children: "Confirm password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `${idPrefix}-confirm`,
					type: showPassword ? "text" : "password",
					autoComplete: "new-password",
					placeholder: "Type the password again",
					value: confirm,
					onChange: (e) => setConfirm(e.target.value),
					minLength: 8,
					required: true
				})]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy,
				children: busy ? mode === "signup" ? "Creating account…" : "Signing in…" : mode === "signup" ? "Create account" : "Sign in"
			})
		]
	});
}
function SyncDialog() {
	const open = useSyncUi((s) => s.dialogOpen);
	const closeDialog = useSyncUi((s) => s.closeDialog);
	const syncing = useSyncUi((s) => s.syncing);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (syncing) return;
			if (next) useSyncUi.getState().openDialog();
			else closeDialog();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md gap-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "pr-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create account or sign in" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Use an email ID or a 10-digit mobile number. New account? Choose Create account. Same details later restore this collection." })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountForm, {
				idPrefix: "sync",
				defaultMode: "signup",
				onSuccess: () => closeDialog()
			})]
		})
	});
}
function SyncController() {
	const { user, isPending } = useCurrentUserState();
	const hydrated = useExamStore((s) => s.hydrated);
	const pulledFor = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!hydrated || isPending) return;
		if (!user) {
			pulledFor.current = null;
			return;
		}
		if (pulledFor.current === user.id) return;
		const recent = useSyncUi.getState().lastSyncedAt;
		if (recent && Date.now() - recent < 8e3) {
			pulledFor.current = user.id;
			return;
		}
		pulledFor.current = user.id;
		restoreFromCloud().catch(() => {
			pulledFor.current = null;
		});
	}, [
		hydrated,
		isPending,
		user
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let timer;
		const unsub = useExamStore.subscribe((state, prev) => {
			if (isApplyingRemote()) return;
			if (!didCollectionChange(state, prev)) return;
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				pushCurrentCollection();
			}, 800);
		});
		const onHide = () => {
			if (document.visibilityState === "hidden") {
				window.clearTimeout(timer);
				pushCurrentCollection();
			}
		};
		document.addEventListener("visibilitychange", onHide);
		return () => {
			window.clearTimeout(timer);
			document.removeEventListener("visibilitychange", onHide);
			unsub();
		};
	}, [user]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncDialog, {});
}
var styles_default = "/assets/styles-CBn3SBYw.css";
var APP_NAME = "SetPaper";
var Route$27 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#121a28"
			},
			{
				name: "description",
				content: "Tests from set papers, notes that sync to your account, and live quizzes with friends."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncController, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true,
				offset: 64
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$24 = () => import("./routes-wFai4D0g.mjs");
var Route$26 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./add-ISY_aCAz.mjs");
var Route$25 = createFileRoute("/add")({
	validateSearch: (raw) => ({
		deck: String(raw.deck ?? ""),
		tab: raw.tab === "html" || raw.tab === "paste" ? String(raw.tab) : "one"
	}),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./browser-BO0dwCGU.mjs");
var Route$24 = createFileRoute("/browser")({
	validateSearch: (raw) => ({ deck: String(raw.deck ?? "") }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./coaching-BGzO3QAy.mjs");
var VIEWS = [
	"hub",
	"live",
	"recorded",
	"meetings",
	"courses",
	"discussions",
	"customize",
	"teacher"
];
var Route$23 = createFileRoute("/coaching")({
	validateSearch: (raw) => ({ view: VIEWS.includes(raw.view) ? raw.view : "hub" }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./connect-DbR5cKb8.mjs");
var Route$22 = createFileRoute("/connect")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./desk-BYhdkpYW.mjs");
var Route$21 = createFileRoute("/desk")({
	validateSearch: (raw) => ({
		folder: String(raw.folder ?? ""),
		from: raw.from === "notes" ? "notes" : "tests"
	}),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var FOCUS_VIEWS = [
	"apps",
	"groups",
	"usage",
	"settings",
	"help",
	"faq",
	"updates",
	"app",
	"group",
	"period",
	"pick",
	"access"
];
var DURATIONS = [
	5,
	10,
	15,
	20,
	30,
	45,
	60,
	90,
	120,
	180
];
function useFocus() {
	const raw = useExamStore((s) => s.focus);
	const update = useExamStore((s) => s.updateFocus);
	return [mergeFocus(raw), (fn) => update((f) => fn(mergeFocus(f)))];
}
function Avatar({ app, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("focus-avatar", app.kind === "setpaper" && "is-study", className),
		style: { "--focus-hue": String(app.hue) },
		children: app.mark
	});
}
function WeekChips({ days, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-center gap-1",
		children: FOCUS_WEEKDAYS.map((d, i) => {
			const on = days.includes(d.id);
			const node = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("focus-day", on && "is-on"),
				children: d.label
			}, `${d.id}-${i}`);
			if (!onToggle) return node;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onToggle(d.id),
				"aria-pressed": on,
				children: node
			}, `${d.id}-${i}`);
		})
	});
}
function LimitIcons({ limits }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("focus-icon", limits.disabled && "is-on"),
				"aria-label": "Disabled",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("focus-icon", limits.timerOn && "is-on"),
				"aria-label": "Off timer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hourglass, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("focus-icon", limits.usageOn && "is-on"),
				"aria-label": "Daily limit",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("focus-icon", limits.periodOn && "is-on"),
				"aria-label": "Time window",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "size-4" })
			})
		]
	});
}
function BackRow({ label, onBack, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky top-0 z-20 flex items-center gap-1 bg-bar px-2 py-1 text-bar-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "icon",
				"aria-label": "Back",
				className: "text-bar-foreground hover:bg-bar-foreground/10",
				onClick: onBack,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "min-w-0 flex-1 truncate font-display text-base font-semibold",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center text-bar-foreground [&_button]:text-bar-foreground [&_button]:hover:bg-bar-foreground/10",
				children: extra
			})
		]
	});
}
function GoldSwitch({ checked, onCheckedChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
		checked,
		onCheckedChange,
		className: "data-[state=checked]:bg-focus",
		"aria-label": label
	});
}
function FocusMode({ search }) {
	const navigate = useNavigate();
	const [focus, setFocus] = useFocus();
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [sortOpen, setSortOpen] = (0, import_react.useState)(false);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [addName, setAddName] = (0, import_react.useState)("");
	const [pinOpen, setPinOpen] = (0, import_react.useState)(false);
	const [pinMode, setPinMode] = (0, import_react.useState)("unlock");
	const [pinBuf, setPinBuf] = (0, import_react.useState)("");
	const [pinPending, setPinPending] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [clock, setClock] = (0, import_react.useState)(null);
	const [dur, setDur] = (0, import_react.useState)(null);
	function go(view, id = "", range = search.range) {
		navigate({
			to: "/focus",
			search: {
				view,
				id,
				range
			}
		});
	}
	function gated(action) {
		if ((focus.settings.pinEnabled || focus.settings.lockEnabled) && !unlocked) {
			setPinMode("unlock");
			setPinBuf("");
			setPinOpen(true);
			pending.current = action;
			return;
		}
		action();
	}
	const pending = (0, import_react.useState)(() => ({ current: null }))[0];
	function submitPin() {
		if (pinMode === "set") {
			if (pinBuf.length < 4) return;
			setPinPending(pinBuf);
			setPinBuf("");
			setPinMode("confirm");
			return;
		}
		if (pinMode === "confirm") {
			if (pinBuf !== pinPending) {
				playFocusSfx("deny");
				toast.error("PIN did not match");
				setPinBuf("");
				return;
			}
			setFocus((f) => ({
				...f,
				settings: {
					...f.settings,
					pinEnabled: true,
					pinHash: hashPin(pinBuf)
				}
			}));
			setUnlocked(true);
			setPinOpen(false);
			playFocusSfx("unlock");
			toast.success("PIN saved");
			return;
		}
		if (!pinOk(focus.settings.pinHash, pinBuf)) {
			playFocusSfx("deny");
			toast.error("Wrong PIN");
			setPinBuf("");
			return;
		}
		setUnlocked(true);
		setPinOpen(false);
		playFocusSfx("unlock");
		pending.current?.();
		pending.current = null;
	}
	const view = search.view;
	const app = focus.apps.find((a) => a.id === search.id);
	const group = focus.groups.find((g) => g.id === search.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Focus",
		hideHeader: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onPointerDown: unlockFocusSfx,
			children: [
				view === "apps" || view === "groups" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home, {
					focus,
					tab: view,
					query,
					setQuery,
					searchOpen,
					setSearchOpen,
					onMenu: () => setMenu(true),
					onSort: () => setSortOpen(true),
					onOpenApp: (id) => go("app", id),
					onOpenGroup: (id) => go("group", id),
					onTab: (tab) => go(tab),
					onAccess: () => go("access"),
					onToggleMode: (on) => {
						if (!on) {
							gated(() => {
								setFocus((f) => setFocusMode(f, false));
								playFocusSfx("tap");
								toast.success("Focus off");
							});
							return;
						}
						setFocus((f) => setFocusMode(f, true));
						playFocusSfx("tap");
						toast.success("Focus on");
					},
					onAdd: () => {
						if (view === "apps") {
							setAddOpen(true);
							return;
						}
						const id = uid();
						setFocus((f) => ({
							...f,
							groups: [...f.groups, {
								id,
								name: "Target group",
								appIds: [],
								createdAt: Date.now(),
								limits: defaultFocusLimits()
							}]
						}));
						go("group", id);
					}
				}) : null,
				view === "app" && app ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppEditor, {
					focus,
					app,
					onBack: () => go("apps"),
					onChange: (limits) => gated(() => setFocus((f) => ({
						...f,
						apps: f.apps.map((x) => x.id === app.id ? {
							...x,
							limits
						} : x)
					}))),
					onDelete: () => gated(() => {
						setFocus((f) => ({
							...f,
							apps: f.apps.filter((x) => x.id !== app.id)
						}));
						go("apps");
					}),
					onStart: () => {
						const res = startSession(focus, app.id);
						if (res.reason !== "ok") {
							playFocusSfx("deny");
							toast.message(blockLabel(res.reason, app, focus) || "Cannot start");
							return;
						}
						setFocus(() => res.state);
						playFocusSfx("tap");
						toast.success(`Session on ${app.name}`);
						if (app.route) navigate({ to: app.route });
					},
					onStop: () => setFocus((f) => stopSession(f)),
					onPeriods: () => go("period", `app:${app.id}`),
					onDuration: (field) => setDur({
						target: "app",
						id: app.id,
						field
					})
				}) : null,
				view === "app" && !app ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
					label: "App",
					onBack: () => go("apps")
				}) : null,
				view === "group" && group ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupEditor, {
					focus,
					group,
					onBack: () => go("groups"),
					onSave: (next) => {
						gated(() => {
							setFocus((f) => ({
								...f,
								groups: f.groups.map((g) => g.id === next.id ? next : g)
							}));
							go("groups");
						});
					},
					onLimits: (limits) => gated(() => setFocus((f) => ({
						...f,
						groups: f.groups.map((g) => g.id === group.id ? {
							...g,
							limits
						} : g)
					}))),
					onDelete: () => gated(() => {
						setFocus((f) => ({
							...f,
							groups: f.groups.filter((g) => g.id !== group.id)
						}));
						go("groups");
					}),
					onPick: () => go("pick", group.id),
					onPeriods: () => go("period", `group:${group.id}`),
					onDuration: (field) => setDur({
						target: "group",
						id: group.id,
						field
					})
				}) : null,
				view === "group" && !group ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
					label: "Group",
					onBack: () => go("groups")
				}) : null,
				view === "pick" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppPicker, {
					focus,
					selected: group?.appIds ?? [],
					onBack: () => go("group", search.id || "new"),
					onToggle: (id) => setFocus((f) => ({
						...f,
						groups: f.groups.map((g) => g.id === search.id ? {
							...g,
							appIds: g.appIds.includes(id) ? g.appIds.filter((x) => x !== id) : [...g.appIds, id]
						} : g)
					}))
				}) : null,
				view === "period" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodEditor, {
					focus,
					token: search.id,
					onBack: () => {
						const [kind, id] = search.id.split(":");
						go(kind === "group" ? "group" : "app", id ?? "");
					},
					onChange: (periods) => gated(() => {
						const [kind, id] = search.id.split(":");
						setFocus((f) => {
							if (kind === "group") return {
								...f,
								groups: f.groups.map((g) => g.id === id ? {
									...g,
									limits: {
										...g.limits,
										periods
									}
								} : g)
							};
							return {
								...f,
								apps: f.apps.map((a) => a.id === id ? {
									...a,
									limits: {
										...a.limits,
										periods
									}
								} : a)
							};
						});
					}),
					onClock: (periodId, field) => {
						const [kind, id] = search.id.split(":");
						setClock({
							target: kind === "group" ? "group" : "app",
							id: id ?? "",
							periodId,
							field
						});
					}
				}) : null,
				view === "usage" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsageView, {
					focus,
					range: search.range,
					onRange: (range) => go("usage", "", range),
					onBack: () => go("apps")
				}) : null,
				view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {
					focus,
					onBack: () => go("apps"),
					onPatch: (patch) => gated(() => setFocus((f) => {
						if (typeof patch.modeOn === "boolean") return setFocusMode(f, patch.modeOn);
						return {
							...f,
							settings: {
								...f.settings,
								...patch
							}
						};
					})),
					onPin: () => {
						setPinMode("set");
						setPinBuf("");
						setPinOpen(true);
					},
					onDuration: (field) => setDur({
						target: "settings",
						id: "settings",
						field
					})
				}) : null,
				view === "access" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceAccess, {
					focus,
					onBack: () => go("apps"),
					onArm: () => setFocus((f) => armDeviceLock(f)),
					onDisarm: () => gated(() => setFocus((f) => disarmDeviceLock(f))),
					onPatch: (patch) => gated(() => setFocus((f) => ({
						...f,
						settings: {
							...f.settings,
							...patch
						}
					})))
				}) : null,
				view === "help" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyView, {
					title: "Help",
					onBack: () => go("apps"),
					body: HELP
				}) : null,
				view === "faq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyView, {
					title: "FAQ",
					onBack: () => go("apps"),
					body: FAQ
				}) : null,
				view === "updates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyView, {
					title: "Update information",
					onBack: () => go("apps"),
					body: UPDATES
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open: menu,
					onOpenChange: setMenu,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-bar px-5 py-8 text-bar-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-12 place-items-center rounded-2xl bg-focus text-focus-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusMark, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-semibold",
								children: "Focus"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-bar-foreground/70",
								children: ["Study timers · ", "1.2"]
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "py-2",
						children: [
							{
								view: "access",
								label: "Device access",
								icon: Shield
							},
							{
								view: "usage",
								label: "App usage status",
								icon: ChartPie
							},
							{
								view: "settings",
								label: "Setting",
								icon: Info
							},
							{
								view: "help",
								label: "Help",
								icon: CircleHelp
							},
							{
								view: "faq",
								label: "FAQ",
								icon: CircleHelp
							},
							{
								view: "updates",
								label: "Update information",
								icon: Bell
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex h-12 w-full items-center gap-4 px-5 text-sm",
							onClick: () => {
								setMenu(false);
								go(item.view);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
						}, item.view))
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: sortOpen,
					onOpenChange: setSortOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Sort" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Order the ",
						view === "groups" ? "groups" : "apps",
						" list"
					] })] }), [
						"asc",
						"desc",
						"created"
					].map((key) => {
						const current = view === "groups" ? focus.sortGroups : focus.sortApps;
						const label = key === "asc" ? "Ascending" : key === "desc" ? "Descending" : "Created";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex h-12 items-center gap-3 rounded-lg px-2 text-left text-sm",
							onClick: () => {
								setFocus((f) => view === "groups" ? {
									...f,
									sortGroups: key
								} : {
									...f,
									sortApps: key
								});
								setSortOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("grid size-5 place-items-center rounded-full border border-focus", current === key && "bg-focus"),
								children: current === key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-focus-foreground" }) : null
							}), label]
						}, key);
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: addOpen,
					onOpenChange: setAddOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add app" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Name any app on your phone. Sessions are tracked inside SetPaper." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: addName,
							onChange: (e) => setAddName(e.target.value),
							placeholder: "App name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!addName.trim()) return;
								setFocus((f) => addCustomApp(f, addName));
								setAddName("");
								setAddOpen(false);
								toast.success("App added");
							},
							children: "Add"
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: pinOpen,
					onOpenChange: setPinOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: pinMode === "unlock" ? "Enter PIN" : pinMode === "set" ? "Choose a 4-digit PIN" : "Confirm PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "PIN locks Focus settings. It is stored only on this device." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center font-mono text-2xl tracking-[0.4em]",
							children: pinBuf.replace(/./g, "•").padEnd(4, "·")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								"1",
								"2",
								"3",
								"4",
								"5",
								"6",
								"7",
								"8",
								"9",
								"←",
								"0",
								"OK"
							].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: key === "OK" ? "default" : "secondary",
								onClick: () => {
									if (key === "←") setPinBuf((p) => p.slice(0, -1));
									else if (key === "OK") submitPin();
									else if (pinBuf.length < 8) setPinBuf((p) => p + key);
								},
								children: key
							}, key))
						})
					] })
				}),
				dur ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurationDialog, {
					value: dur.target === "settings" ? dur.field === "off" ? focus.settings.defaultOffMin : dur.field === "wait" ? focus.settings.defaultWaitMin : focus.settings.defaultUsageMin : durationValue(focus, dur),
					onClose: () => setDur(null),
					onPick: (min) => {
						applyDuration(setFocus, dur, min);
						setDur(null);
					}
				}) : null,
				clock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockDialog, {
					value: clockValue(focus, clock),
					onClose: () => setClock(null),
					onPick: (hm) => {
						applyClock(setFocus, clock, hm);
						setClock(null);
					}
				}) : null
			]
		})
	});
}
function Home({ focus, tab, query, setQuery, searchOpen, setSearchOpen, onMenu, onSort, onOpenApp, onOpenGroup, onTab, onAdd, onAccess, onToggleMode }) {
	const q = query.trim().toLowerCase();
	const apps = sortApps(focus.apps, focus.sortApps).filter((a) => !q || a.name.toLowerCase().includes(q));
	const groups = sortGroups(focus.groups, focus.sortGroups).filter((g) => !q || g.name.toLowerCase().includes(q));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-20 bg-bar text-bar-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 items-center gap-1 px-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": "Focus menu",
						className: "text-bar-foreground hover:bg-bar-foreground/10",
						onClick: onMenu,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 items-center gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-8 place-items-center rounded-full bg-focus text-focus-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusMark, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-lg font-semibold tracking-tight",
							children: "Focus"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": "Search",
						"aria-pressed": searchOpen,
						className: "text-bar-foreground hover:bg-bar-foreground/10",
						onClick: () => setSearchOpen(!searchOpen),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						"aria-label": "Sort",
						className: "text-bar-foreground hover:bg-bar-foreground/10",
						onClick: onSort,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, {})
					})
				]
			}), searchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-bar-foreground/10 px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					autoFocus: true,
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: tab === "groups" ? "Search groups" : "Search apps",
					className: "border-bar-foreground/20 bg-bar-foreground/10 text-bar-foreground placeholder:text-bar-foreground/50"
				})
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 border-b border-border bg-card px-4 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("grid size-11 shrink-0 place-items-center rounded-2xl", focus.settings.modeOn ? "bg-focus text-focus-foreground" : "bg-muted text-muted-foreground"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusMark, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-base font-semibold",
						children: focus.settings.modeOn ? "Focus is on" : "Focus is off"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: focus.settings.modeOn ? "Timers, caps, and the shield apply. Flip this off to study without locks." : "Saved limits stay put. Nothing is blocked until you turn Focus on."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: focus.settings.modeOn,
					onCheckedChange: onToggleMode,
					label: "Focus mode"
				})
			]
		}),
		focus.settings.modeOn && focus.settings.shieldOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-center justify-between bg-focus px-4 py-2 text-left text-xs font-semibold text-focus-foreground",
			onClick: onAccess,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"Shield on · ",
				lockedCount(focus),
				" apps locked in real time"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Device access" })]
		}) : focus.settings.modeOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-center justify-between border-b border-border bg-card px-4 py-2 text-left text-xs font-medium",
			onClick: onAccess,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grant device access so locks run on this device" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4 text-focus" })]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "focus-tabs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn(tab === "apps" && "is-on"),
				onClick: () => onTab("apps"),
				children: "Apps"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn(tab === "groups" && "is-on"),
				onClick: () => onTab("groups"),
				children: "Groups"
			})]
		}),
		tab === "apps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 p-3 pb-36",
			children: apps.map((app) => {
				const limits = effectiveLimits(app, focus);
				const used = focus.todayUsed[app.id] ?? 0;
				const reason = whyBlocked(app, focus);
				const expanded = limits.timerOn || limits.usageOn || limits.periodOn || limits.disabled || reason !== "ok";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "focus-card lift w-full",
					onClick: () => onOpenApp(app.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { app }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold",
										children: app.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimitIcons, { limits })]
								}),
								reason !== "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 shrink-0 text-focus" }) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekChips, { days: limits.days }),
						expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1 text-xs text-muted-foreground",
							children: [
								limits.disabled || reason === "shield" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-focus",
									children: reason === "ok" ? "Switched off" : blockLabel(reason, app, focus)
								}) : null,
								limits.timerOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Off timer ",
									formatDurationMin(limits.offTimerMin),
									" · Waiting ",
									formatDurationMin(limits.waitMin)
								] }) : null,
								limits.usageOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Usage limit for 1 day ", formatDurationMin(limits.usageLimitMin)] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "focus-meter",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.min(100, used / limits.usageLimitMin * 100)}%` } })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-focus",
										children: used < .2 ? "Today unused" : `${formatDurationMin(used)} today`
									})
								] }) : null,
								limits.periodOn && limits.periods[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Time period restricting the app usage ",
									limits.periods[0].start,
									" – ",
									limits.periods[0].end
								] }) : null
							]
						}) : null
					]
				}) }, app.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "grid gap-3 p-3 pb-36",
			children: [groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "focus-card text-sm text-muted-foreground",
				children: "Name a group, pick apps, then set the same timer, daily cap, and windows for all of them."
			}) : null, groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "focus-card lift w-full",
				onClick: () => onOpenGroup(g.id),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: g.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: g.appIds.slice(0, 8).map((id) => {
							const a = focus.apps.find((x) => x.id === id);
							return a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								app: a,
								className: "size-8 text-xs"
							}, id) : null;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimitIcons, { limits: g.limits }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekChips, { days: g.limits.days })
				]
			}) }, g.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "focus-fab",
			"aria-label": tab === "apps" ? "Add app" : "Add group",
			onClick: onAdd,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
		})
	] });
}
function LimitsForm({ limits, onChange, onDuration, onPeriods }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekChips, {
				days: limits.days,
				onToggle: (d) => onChange({
					...limits,
					days: limits.days.includes(d) ? limits.days.filter((x) => x !== d) : [...limits.days, d].sort((a, b) => a - b)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }),
				title: "Disable this app",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: limits.disabled,
					onCheckedChange: (v) => onChange({
						...limits,
						disabled: v
					})
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Blocks it immediately on this device. SetPaper sections lock in real time. Other phone apps cannot be closed from the browser."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hourglass, { className: "size-4" }),
				title: "Timer settings",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: limits.timerOn,
					onCheckedChange: (v) => onChange({
						...limits,
						timerOn: v
					})
				}),
				children: limits.timerOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-12 items-center justify-between px-1 text-sm",
						onClick: () => onDuration("off"),
						children: ["Off timer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: formatDurationMin(limits.offTimerMin)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-12 items-center justify-between px-1 text-sm",
						onClick: () => onDuration("wait"),
						children: ["Waiting time ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: formatDurationMin(limits.waitMin)
						})]
					})]
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4" }),
				title: "Setting the limit on usage time",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: limits.usageOn,
					onCheckedChange: (v) => onChange({
						...limits,
						usageOn: v
					})
				}),
				children: limits.usageOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex h-12 w-full items-center justify-between px-1 text-sm",
					onClick: () => onDuration("usage"),
					children: ["Usage limit for 1 day ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: formatDurationMin(limits.usageLimitMin)
					})]
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "size-4" }),
				title: "Setting the time period limit",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: limits.periodOn,
					onCheckedChange: (v) => onChange(v ? withPeriodOn(limits) : {
						...limits,
						periodOn: false
					})
				}),
				children: limits.periodOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex h-12 w-full items-center justify-between px-1 text-sm",
					onClick: onPeriods,
					children: ["Time period restricting the app usage", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: limits.periods[0] ? `${limits.periods[0].start} – ${limits.periods[0].end}` : "Add"
					})]
				}) : null
			})
		]
	});
}
function Row({ icon, title, extra, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-focus",
					children: icon
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 flex-1 text-sm font-medium",
					children: title
				}),
				extra
			]
		}), children]
	});
}
function AppEditor({ focus, app, onBack, onChange, onDelete, onStart, onStop, onPeriods, onDuration }) {
	const live = focus.session?.appId === app.id && !focus.session.waiting;
	const reason = whyBlocked(app, focus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
			label: `${app.name} settings`,
			onBack,
			extra: app.custom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "icon",
				"aria-label": "Delete",
				onClick: onDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
			}) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 border-b border-border bg-card px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { app }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: app.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: app.kind === "setpaper" ? "Study section" : "Tracked app"
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimitsForm, {
			limits: app.limits,
			onChange,
			onDuration,
			onPeriods
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 pb-36",
			children: [live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				variant: "secondary",
				onClick: onStop,
				children: [
					"Stop session · ",
					formatDurationMin(Math.max(1, Math.ceil(remainingMs(focus.session) / 6e4))),
					" left"
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full bg-focus text-focus-foreground hover:bg-focus/90",
				onClick: onStart,
				children: "Start session"
			}), reason !== "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: blockLabel(reason, app, focus)
			}) : null]
		})
	] });
}
function GroupEditor({ focus, group, onBack, onSave, onLimits, onDelete, onPick, onPeriods, onDuration }) {
	const [name, setName] = (0, import_react.useState)(group.name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
			label: group.name || "New group",
			onBack,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					"aria-label": "Delete",
					onClick: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					"aria-label": "Save",
					onClick: () => onSave({
						...group,
						name: name.trim() || "Group"
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2 border-b border-border bg-card px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-focus",
					children: "Group name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Target MCL 21 days"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Apps"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex flex-wrap gap-1",
					onClick: onPick,
					children: [group.appIds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "Pick apps"
					}) : null, group.appIds.map((id) => {
						const a = focus.apps.find((x) => x.id === id);
						return a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							app: a,
							className: "size-9 text-xs"
						}, id) : null;
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimitsForm, {
			limits: group.limits,
			onChange: onLimits,
			onDuration,
			onPeriods
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 pb-36",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full bg-focus text-focus-foreground hover:bg-focus/90",
				onClick: () => onSave({
					...group,
					name: name.trim() || "Group"
				}),
				children: "Save group"
			})
		})
	] });
}
function AppPicker({ focus, selected, onBack, onToggle }) {
	const [q, setQ] = (0, import_react.useState)("");
	const list = sortApps(focus.apps, "asc").filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
			label: "Pick apps",
			onBack,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "icon",
				onClick: onBack,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "pb-36",
			children: list.map((app) => {
				const on = selected.includes(app.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex h-14 w-full items-center gap-3 border-b border-border px-4 text-left",
					onClick: () => onToggle(app.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { app }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate",
							children: app.name
						}),
						on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-focus" }) : null
					]
				}) }, app.id);
			})
		})
	] });
}
function PeriodEditor({ focus, token, onBack, onChange, onClock }) {
	const [kind, id] = token.split(":");
	const periods = (kind === "group" ? focus.groups.find((g) => g.id === id)?.limits : focus.apps.find((a) => a.id === id)?.limits)?.periods ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
			label: "Setting the time period limit",
			onBack,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "icon",
				onClick: onBack,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})
			})
		}),
		periods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-6 py-16 text-center text-sm text-muted-foreground",
			children: "When you tap + and register the time period you want to restrict, a list will be displayed here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2 p-3 pb-36",
			children: periods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "focus-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-12 items-center justify-between text-sm",
						onClick: () => onClock(p.id, "start"),
						children: ["Restriction start time ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.start })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-12 items-center justify-between text-sm",
						onClick: () => onClock(p.id, "end"),
						children: ["Restriction end time ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.end })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => onChange(periods.filter((x) => x.id !== p.id)),
						children: "Remove"
					})
				]
			}, p.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "focus-fab",
			"aria-label": "Add period",
			onClick: () => onChange([...periods, {
				id: uid(),
				start: "12:00",
				end: "00:00"
			}]),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
		})
	] });
}
function UsageView({ focus, range, onRange, onBack }) {
	const rows = usageWindow(focus, range);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
			label: range === "24h" ? "24 hours app usage status" : "30 days app usage status",
			onBack,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: () => onRange(range === "24h" ? "30d" : "24h"),
				children: range === "24h" ? "30 days" : "24 hours"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "bg-focus px-4 py-3 text-center text-xs font-medium text-focus-foreground",
			children: "Usage is counted from Focus sessions inside SetPaper. Phone-level blocking is not available in this web app."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "grid gap-3 p-3 pb-36",
			children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "focus-card text-sm text-muted-foreground",
				children: "No sessions yet. Start one from an app."
			}) : null, rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "focus-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { app: row.app }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: row.app.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm tabular-nums",
									children: [row.percent.toFixed(2), "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "focus-meter mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.min(100, row.percent)}%` } })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Usage time ", formatUsage(row.seconds)]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekChips, { days: row.app.limits.days })]
			}, row.app.id))]
		})
	] });
}
function SettingsView({ focus, onBack, onPatch, onPin, onDuration }) {
	const navigate = useNavigate();
	const s = focus.settings;
	const theme = useExamStore((st) => st.prefs.theme);
	const setPrefs = useExamStore((st) => st.setPrefs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-36",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
				label: "Setting",
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Focus mode"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusMark, { className: "size-4" }),
				title: s.modeOn ? "Focus is on" : "Focus is off",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.modeOn,
					onCheckedChange: (v) => onPatch({ modeOn: v }),
					label: "Focus mode"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Master switch. Off pauses every lock and session. On applies the timers and shield you already set."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Timer settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-sm",
				onClick: () => onDuration("off"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Off timer (initial value)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: formatDurationMin(s.defaultOffMin)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-sm",
				onClick: () => onDuration("wait"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Waiting time (initial value)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: formatDurationMin(s.defaultWaitMin)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Setting the limit on usage time"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-sm",
				onClick: () => onDuration("usage"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Usage limit for 1 day (initial value)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: formatDurationMin(s.defaultUsageMin)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Notification settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }),
				title: "Notify before the app closes",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.notifyBeforeClose,
					onCheckedChange: (v) => onPatch({ notifyBeforeClose: v })
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Notify 5 minutes before the app closes."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4" }),
				title: "Display remaining available time",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.displayRemaining,
					onCheckedChange: (v) => onPatch({ displayRemaining: v })
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Show remaining session time on a gold bar."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "size-4" }),
				title: "Notify the usage status of the app",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.notifyUsage,
					onCheckedChange: (v) => onPatch({ notifyUsage: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Other settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
				title: "Password settings",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.pinEnabled,
					onCheckedChange: (v) => {
						if (v) onPin();
						else onPatch({
							pinEnabled: false,
							pinHash: ""
						});
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4" }),
				title: "Restrictions on pinned apps",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.restrictPinned,
					onCheckedChange: (v) => onPatch({ restrictPinned: v })
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Pinned study apps still follow timer, cap, and window limits."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }),
				title: "Audio message",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.audioMessage,
					onCheckedChange: (v) => onPatch({ audioMessage: v })
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "When a session is closed by Focus, a short spoken message plays."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }),
				title: "Dark theme",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 rounded-md border border-border bg-card px-2 text-sm",
					value: s.darkTheme,
					onChange: (e) => {
						const darkTheme = e.target.value;
						onPatch({ darkTheme });
						if (darkTheme === "light" || darkTheme === "dark") setPrefs({ theme: darkTheme });
						else setPrefs({ theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" });
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "auto",
							children: "Auto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "light",
							children: "Light"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "dark",
							children: "Dark"
						})
					]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [theme === "dark" ? "Dark" : "Light", " on this device"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Special app access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-left text-sm",
				onClick: () => void navigate({
					to: "/focus",
					search: {
						view: "access",
						id: "",
						range: "30d"
					}
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4 text-focus" }), "Device access"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: s.shieldOn ? "Shield on" : "Grant"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }),
				title: "Protect Focus",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.lockEnabled,
					onCheckedChange: (v) => {
						if (v && !s.pinEnabled) onPin();
						onPatch({ lockEnabled: v });
					}
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Locks Focus so limits cannot be turned off without your PIN. SetPaper cannot take phone admin rights, but this keeps the study lock on inside the app."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid place-items-center gap-2 px-4 pb-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-14 place-items-center rounded-2xl bg-focus text-focus-foreground shadow-btn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusMark, { className: "size-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-sm font-semibold",
						children: ["Focus ", "1.2"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "SetPaper · study timers"
					})
				]
			})
		]
	});
}
function permLabel(state) {
	if (state === "granted") return "Allowed on this device";
	if (state === "denied") return "Blocked in browser settings";
	if (state === "unsupported") return "Not available here";
	return "Tap Grant";
}
function DeviceAccess({ focus, onBack, onArm, onDisarm, onPatch }) {
	const [access, setAccess] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const s = focus.settings;
	const locked = lockedCount(focus);
	(0, import_react.useEffect)(() => {
		setAccess(readDeviceAccess());
	}, [s.shieldOn, s.accessGrantedAt]);
	async function grantAndArm() {
		setBusy(true);
		try {
			const next = await grantDeviceAccess();
			setAccess(next);
			onArm();
		} finally {
			setBusy(false);
		}
	}
	async function grantOnly() {
		setBusy(true);
		try {
			setAccess(await grantDeviceAccess());
			onPatch({ accessGrantedAt: Date.now() });
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-36",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
				label: "Device access",
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("px-4 py-4", s.shieldOn ? "bg-focus text-focus-foreground" : "bg-card"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold",
					children: s.shieldOn ? "Shield is on" : "Shield is off"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm opacity-90",
					children: s.shieldOn ? `${locked} apps locked in real time on this device. SetPaper sections cannot open until you disarm.` : "Grant notifications, keep-awake, and the in-app lock. Then arm the shield to block listed apps as you use SetPaper."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 p-4",
				children: [s.shieldOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "h-12",
					onClick: onDisarm,
					children: "Disarm shield"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "h-12 bg-focus text-focus-foreground hover:bg-focus/90",
					disabled: busy,
					onClick: () => void grantAndArm(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-4" }), busy ? "Asking this device…" : "Grant access and lock every app"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: busy,
					onClick: () => void grantOnly(),
					children: "Grant permissions only"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Live on this device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }),
				title: "Notifications",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: access ? permLabel(access.notify) : "Checking"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Timer warnings and close alerts use the real browser permission. It shows in site settings on your phone."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4" }),
				title: "Keep screen awake",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: access?.wakeSupported ? "Supported" : "Not available"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "While a session or the shield is on, this device is asked to stay awake so the timer keeps running."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4" }),
				title: "Save Focus on this device",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: access?.persistSupported ? "Ready" : "Not available"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Asks the browser to keep Focus data when storage is tight."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }),
				title: "Installed as app",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: access?.standalone ? "Yes" : "Browser tab"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "What this can lock"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
				title: "SetPaper sections",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Live"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Tests, Notes, Connect, Coaching, and Target lock in real time when the shield or a disable switch is on."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }),
				title: "Other phone apps",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Not available"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "A website cannot read your full app list, close WhatsApp, or become a device administrator. Those names stay in the catalog so you can timer-lock habits inside SetPaper."
				})
			}),
			access?.related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-4" }),
				title: "Related apps this browser can see",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: access.related.join(", ")
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus",
				children: "Shield options"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }),
				title: "Arm shield",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.shieldOn,
					onCheckedChange: (v) => {
						if (v) grantOnly().then(() => onPatch({ shieldOn: true }));
						else onPatch({ shieldOn: false });
					}
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Enforces timers immediately. Switching away from SetPaper is counted as This device."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }),
				title: "Lock every listed app",
				extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldSwitch, {
					checked: s.blockAllOn,
					onCheckedChange: (v) => onPatch({
						blockAllOn: v,
						shieldOn: v ? true : s.shieldOn
					})
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Hard lock. Disarm to study again. PIN protects this switch when Protect Focus is on."
				})
			})
		]
	});
}
function CopyView({ title, onBack, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackRow, {
		label: title,
		onBack
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 p-4 pb-36 text-sm leading-relaxed whitespace-pre-wrap",
		children: body
	})] });
}
function DurationDialog({ value, onClose, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Duration" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Off timer, waiting time, or daily usage cap." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid max-h-80 gap-1 overflow-auto",
			children: DURATIONS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("flex h-11 items-center justify-between rounded-lg px-3 text-sm", n === value && "bg-focus/15 font-semibold"),
				onClick: () => onPick(n),
				children: [formatDurationMin(n), n === value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-focus" }) : null]
			}, n))
		})] })
	});
}
function ClockDialog({ value, onClose, onPick }) {
	const parsed = parseClock(value);
	const [hour, setHour] = (0, import_react.useState)(parsed.hour);
	const [minute, setMinute] = (0, import_react.useState)(parsed.minute);
	const [pm, setPm] = (0, import_react.useState)(parsed.pm);
	const [mode, setMode] = (0, import_react.useState)("hour");
	const label = `${String(to24(hour, pm)).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
	const ticks = mode === "hour" ? [
		12,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11
	] : [
		0,
		5,
		10,
		15,
		20,
		25,
		30,
		35,
		40,
		45,
		50,
		55
	];
	const active = mode === "hour" ? hour % 12 === 0 ? 12 : hour : Math.round(minute / 5) * 5 % 60;
	const angle = mode === "hour" ? hour % 12 * 30 : minute / 60 * 360;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Restriction time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Set the start or end of a blocked window." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center font-display text-4xl font-semibold tabular-nums tracking-tight",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "focus-clock",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "focus-clock-hand",
							style: { transform: `translateX(-50%) rotate(${angle}deg)` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "focus-clock-hub" }),
						ticks.map((n, i) => {
							const a = (i / 12 * 360 - 90) * (Math.PI / 180);
							const x = 50 + Math.cos(a) * 38;
							const y = 50 + Math.sin(a) * 38;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-semibold", n === active ? "bg-focus text-focus-foreground" : "text-foreground"),
								style: {
									left: `${x}%`,
									top: `${y}%`
								},
								onClick: () => {
									if (mode === "hour") {
										setHour(n === 12 ? 12 : n);
										setMode("minute");
									} else setMinute(n);
								},
								children: mode === "hour" ? n : String(n).padStart(2, "0")
							}, n);
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: pm ? "secondary" : "default",
						className: !pm ? "bg-focus text-focus-foreground hover:bg-focus/90" : void 0,
						onClick: () => setPm(false),
						children: "AM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: pm ? "default" : "secondary",
						className: pm ? "bg-focus text-focus-foreground hover:bg-focus/90" : void 0,
						onClick: () => setPm(true),
						children: "PM"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-focus text-focus-foreground hover:bg-focus/90",
						onClick: () => onPick(label),
						children: "OK"
					})]
				})
			]
		})
	});
}
function parseClock(hm) {
	const [hRaw, mRaw] = hm.split(":").map(Number);
	const h24 = Number(hRaw) || 0;
	const minute = Number(mRaw) || 0;
	const pm = h24 >= 12;
	return {
		hour: h24 % 12 === 0 ? 12 : h24 % 12,
		minute,
		pm
	};
}
function to24(hour, pm) {
	const h = hour % 12;
	return pm ? h + 12 : h;
}
function durationValue(focus, dur) {
	const limits = dur.target === "group" ? focus.groups.find((g) => g.id === dur.id)?.limits : focus.apps.find((a) => a.id === dur.id)?.limits;
	if (!limits) return 10;
	if (dur.field === "off") return limits.offTimerMin;
	if (dur.field === "wait") return limits.waitMin;
	return limits.usageLimitMin;
}
function applyDuration(setFocus, dur, min) {
	setFocus((f) => {
		if (dur.target === "settings") {
			const settings = { ...f.settings };
			if (dur.field === "off") settings.defaultOffMin = min;
			else if (dur.field === "wait") settings.defaultWaitMin = min;
			else settings.defaultUsageMin = min;
			return {
				...f,
				settings
			};
		}
		const patch = (limits) => dur.field === "off" ? {
			...limits,
			offTimerMin: min
		} : dur.field === "wait" ? {
			...limits,
			waitMin: min
		} : {
			...limits,
			usageLimitMin: min
		};
		if (dur.target === "group") return {
			...f,
			groups: f.groups.map((g) => g.id === dur.id ? {
				...g,
				limits: patch(g.limits)
			} : g)
		};
		return {
			...f,
			apps: f.apps.map((a) => a.id === dur.id ? {
				...a,
				limits: patch(a.limits)
			} : a)
		};
	});
}
function clockValue(focus, clock) {
	const p = (clock.target === "group" ? focus.groups.find((g) => g.id === clock.id)?.limits : focus.apps.find((a) => a.id === clock.id)?.limits)?.periods.find((x) => x.id === clock.periodId);
	return (clock.field === "start" ? p?.start : p?.end) ?? "12:00";
}
function applyClock(setFocus, clock, hm) {
	setFocus((f) => {
		const patch = (limits) => ({
			...limits,
			periods: limits.periods.map((p) => p.id === clock.periodId ? {
				...p,
				[clock.field]: hm
			} : p)
		});
		if (clock.target === "group") return {
			...f,
			groups: f.groups.map((g) => g.id === clock.id ? {
				...g,
				limits: patch(g.limits)
			} : g)
		};
		return {
			...f,
			apps: f.apps.map((a) => a.id === clock.id ? {
				...a,
				limits: patch(a.limits)
			} : a)
		};
	});
}
var HELP = `Focus is SetPaper’s study timer and device lock.

Use the switch at the top of Focus to turn the whole mode on or off. Off pauses every lock and session; your app timers stay saved. On applies them again.

Device access asks this browser for notifications, keep-awake, and stored Focus data. Those are real permissions — they appear in the site settings on your phone.

Arm the shield to lock listed apps in real time. SetPaper sections (Tests, Notes, Connect, Coaching, Target) cannot open while Focus and the shield are on. Switching away from SetPaper is counted as This device.

Apps lists common phone names plus every SetPaper section. A website cannot read every app installed on the phone or close WhatsApp. Add extra names with +.

Marks on each row:
• Ban — disable immediately
• Hourglass — off timer, then a waiting lock
• Clock — daily usage cap
• Pie — time windows when the app stays closed

Days run Sunday to Saturday. Gold means that day is on.`;
var FAQ = `How do I turn Focus off?
Open the Focus tab and flip “Focus is on”. Limits stay saved. Flip it back on when you want locks again. Protect Focus can require your PIN to turn it off.

Can Focus close WhatsApp on my phone?
No. Browsers cannot list or kill other apps, and they cannot become a device administrator. Grant Device access for real notifications and keep-awake, then arm the shield to lock SetPaper itself.

Does Grant access do anything on the device?
Yes. Notifications use the system permission dialog. Keep-awake uses the screen wake lock. Focus data can be marked persistent. Those show in the browser’s site settings.

How do I lock everything?
Turn Focus on, then Device access → Grant access and lock every app. Tests and the other SetPaper sections stay locked until you disarm or turn Focus off. PIN Protect Focus so those switches cannot be flipped by accident.

Why are some apps already in the list?
So you can timer-lock the same names you use on a phone. They are a catalog, not a scan of your installed packages.

Where did terms and privacy pages go?
They are not part of Focus.`;
var UPDATES = `Focus 1.2
• On/off switch for the whole Focus mode
• Device access with real notifications and keep-awake
• Shield locks SetPaper sections in real time
• Disable switch per app
• Away time counted as This device
• Gold mark in the middle of the bar
• No terms page`;
var $$splitComponentImporter$18 = () => import("./focus-B-B93eiP.mjs");
var Route$20 = createFileRoute("/focus")({
	validateSearch: (raw) => ({
		view: FOCUS_VIEWS.includes(raw.view) ? raw.view : "apps",
		id: String(raw.id ?? ""),
		range: raw.range === "24h" ? "24h" : "30d"
	}),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./friends-G1uJ_8SU.mjs");
var Route$19 = createFileRoute("/friends")({
	validateSearch: (raw) => ({ deck: String(raw.deck ?? "") }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./login-CEaNPVRG.mjs");
var Route$18 = createFileRoute("/login")({
	validateSearch: (raw) => ({
		mode: raw.mode === "signin" ? "signin" : "signup",
		via: raw.via === "mobile" ? "mobile" : "email"
	}),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./mail-8gQv7uRQ.mjs");
var Route$17 = createFileRoute("/mail")({
	validateSearch: (raw) => ({
		from: raw.from === "notes" ? "notes" : "tests",
		label: String(raw.label ?? ""),
		message: String(raw.message ?? ""),
		connector: raw.connector === "Outlook" ? "Outlook" : "Gmail"
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./notes-DepKwlp9.mjs");
var Route$16 = createFileRoute("/notes")({
	validateSearch: (raw) => ({
		view: raw.view === "study" ? "study" : "list",
		folder: String(raw.folder ?? "")
	}),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./settings-BU0LSg7f.mjs");
var Route$15 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./stats-DO4BTwds.mjs");
var Route$14 = createFileRoute("/stats")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./target-C4vduOrV.mjs");
var GAMES = [
	"home",
	"pick",
	"river",
	"ludo"
];
var Route$13 = createFileRoute("/target")({
	validateSearch: (raw) => ({ game: GAMES.includes(raw.game) ? raw.game : "home" }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./templates-CtB4qEPz.mjs");
var Route$12 = createFileRoute("/templates")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
/**
* WebRTC signaling over the app database (Neon deployed, PGLite in preview).
* Only rendezvous traffic passes through here — roster + SDP/ICE relay while a
* mesh forms; game data then flows peer-to-peer. DB-backed so any serverless
* instance can serve any poll. Mount at /api/rtc (see the multiplayer-p2p
* skill); the client side lives in `@/lib/multiplayer`.
*
* The GET poll is the whole peer lifecycle: the first poll (since=0) IS the
* join — it registers the peer, returns the roster, and prunes stale rows.
* Peer ids are random per mount, so a fresh inbox never has old signals to
* skip and no join/cursor handshake is needed.
*/
var ID = string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
var signalSchema = object({
	op: literal("signal"),
	room: ID,
	from: ID,
	to: ID,
	kind: _enum([
		"offer",
		"answer",
		"ice"
	]),
	payload: unknown().refine((v) => v !== void 0 && JSON.stringify(v).length <= 32768, { message: "payload too large" })
});
var leaveSchema = object({
	op: literal("leave"),
	room: ID,
	peer: ID
});
var postSchema = discriminatedUnion("op", [signalSchema, leaveSchema]);
var PEER_TTL_SECONDS = 30;
var SIGNAL_TTL_SECONDS = 60;
var globalRef = globalThis;
function ensureSchema(sql) {
	globalRef.__rtcSchemaPromise__ ??= (async () => {
		await sql.query(`CREATE TABLE IF NOT EXISTS webrtc_peers (
         room TEXT NOT NULL,
         peer_id TEXT NOT NULL,
         name TEXT NOT NULL DEFAULT '',
         last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
         PRIMARY KEY (room, peer_id)
       )`);
		await sql.query(`CREATE TABLE IF NOT EXISTS webrtc_signals (
         id BIGSERIAL PRIMARY KEY,
         room TEXT NOT NULL,
         to_peer TEXT NOT NULL,
         from_peer TEXT NOT NULL,
         kind TEXT NOT NULL,
         payload JSONB NOT NULL,
         created_at TIMESTAMPTZ NOT NULL DEFAULT now()
       )`);
		await sql.query(`CREATE INDEX IF NOT EXISTS webrtc_signals_inbox
         ON webrtc_signals (room, to_peer, id)`);
	})().catch((err) => {
		globalRef.__rtcSchemaPromise__ = void 0;
		throw err;
	});
	return globalRef.__rtcSchemaPromise__;
}
async function roster(sql, room) {
	return (await sql.query(`SELECT peer_id, name FROM webrtc_peers
     WHERE room = $1 AND last_seen > now() - make_interval(secs => $2)
     ORDER BY peer_id LIMIT 32`, [room, PEER_TTL_SECONDS])).map((r) => ({
		id: r.peer_id,
		name: r.name
	}));
}
async function touchPeer(sql, room, peer, name) {
	await sql.query(`INSERT INTO webrtc_peers (room, peer_id, name, last_seen)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (room, peer_id)
     DO UPDATE SET last_seen = now(), name = EXCLUDED.name`, [
		room,
		peer,
		name
	]);
}
async function prune(sql) {
	await Promise.all([sql.query(`DELETE FROM webrtc_signals WHERE created_at < now() - make_interval(secs => $1)`, [SIGNAL_TTL_SECONDS]), sql.query(`DELETE FROM webrtc_peers WHERE last_seen < now() - make_interval(secs => $1)`, [PEER_TTL_SECONDS])]);
}
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json",
			"cache-control": "no-store"
		}
	});
}
async function handleGet(url) {
	const parsed = object({
		room: ID,
		peer: ID,
		name: string().max(64).default(""),
		since: number$1().int().min(0).default(0)
	}).safeParse({
		room: url.searchParams.get("room"),
		peer: url.searchParams.get("peer"),
		name: url.searchParams.get("name") ?? "",
		since: url.searchParams.get("since") ?? 0
	});
	if (!parsed.success) return json({ error: "invalid query" }, 400);
	const { room, peer, name, since } = parsed.data;
	const sql = await getSql();
	await ensureSchema(sql);
	if (since === 0 || Math.random() < .02) await prune(sql);
	await touchPeer(sql, room, peer, name);
	const rows = await sql.query(`SELECT id, from_peer, kind, payload FROM webrtc_signals
     WHERE room = $1 AND to_peer = $2 AND id > $3
     ORDER BY id LIMIT 200`, [
		room,
		peer,
		since
	]);
	return json({
		peers: await roster(sql, room),
		signals: rows.map((r) => ({
			id: r.id,
			from: r.from_peer,
			kind: r.kind,
			payload: r.payload
		}))
	});
}
async function handlePost(request) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: "invalid JSON" }, 400);
	}
	const parsed = postSchema.safeParse(body);
	if (!parsed.success) return json({ error: "invalid request" }, 400);
	const msg = parsed.data;
	const sql = await getSql();
	await ensureSchema(sql);
	if (msg.op === "signal") await sql.query(`INSERT INTO webrtc_signals (room, to_peer, from_peer, kind, payload)
       VALUES ($1, $2, $3, $4, $5)`, [
		msg.room,
		msg.to,
		msg.from,
		msg.kind,
		JSON.stringify(msg.payload)
	]);
	else await sql.query(`DELETE FROM webrtc_peers WHERE room = $1 AND peer_id = $2`, [msg.room, msg.peer]);
	return json({ ok: true });
}
async function handleSignaling(request) {
	try {
		if (request.method === "GET") return await handleGet(new URL(request.url));
		if (request.method === "POST") return await handlePost(request);
		return json({ error: "method not allowed" }, 405);
	} catch (error) {
		console.error("[rtc] signaling error:", error);
		return json({ error: "signaling failed" }, 500);
	}
}
var handle = ({ request }) => handleSignaling(request);
var Route$11 = createFileRoute("/api/rtc")({ server: { handlers: {
	GET: handle,
	POST: handle
} } });
var $$splitComponentImporter$9 = () => import("./chat._code-BaRJrXW8.mjs");
var Route$10 = createFileRoute("/chat/$code")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./custom-study._deckId-DZJOUyBV.mjs");
var Route$9 = createFileRoute("/custom-study/$deckId")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./discuss._code-Cnv6J_4L.mjs");
var Route$8 = createFileRoute("/discuss/$code")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./notes_._noteId-ByE_TBRZ.mjs");
var Route$7 = createFileRoute("/notes_/$noteId")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./options._deckId-C8xgIOX9.mjs");
var Route$6 = createFileRoute("/options/$deckId")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./overview._deckId-CVEUvQi3.mjs");
var Route$5 = createFileRoute("/overview/$deckId")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./quiz._code-AOkDPD43.mjs");
var Route$4 = createFileRoute("/quiz/$code")({
	validateSearch: (raw) => {
		const view = String(raw.view ?? "").trim().toUpperCase();
		return view ? { view } : {};
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./session._deckId-Dh9c-LCI.mjs");
var Route$3 = createFileRoute("/session/$deckId")({
	validateSearch: (raw) => ({ id: String(raw.id ?? "") }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./study._deckId-UoB40lHE.mjs");
var PICKS = [
	"due",
	"new",
	"random",
	"all",
	"forgotten",
	"ahead",
	"paper",
	"wrong",
	"skipped",
	"marked",
	"correct",
	"attempted"
];
var Route$2 = createFileRoute("/study/$deckId")({
	validateSearch: (raw) => {
		const minutes = Number(raw.minutes);
		const template = String(raw.template ?? "").trim();
		return {
			mode: raw.mode === "custom" || raw.mode === "preview" ? raw.mode : "study",
			pick: PICKS.includes(raw.pick) ? raw.pick : "due",
			count: Number.isFinite(Number(raw.count)) && Number(raw.count) > 0 ? Math.floor(Number(raw.count)) : 0,
			paper: String(raw.paper ?? ""),
			quiz: String(raw.quiz ?? "").toUpperCase(),
			session: String(raw.session ?? ""),
			template: template || void 0,
			minutes: Number.isFinite(minutes) && minutes > 0 ? Math.floor(minutes) : void 0
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./templates_._templateId-APjHaweg.mjs");
var Route$1 = createFileRoute("/templates_/$templateId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$26.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$27
	}),
	AddRoute: Route$25.update({
		id: "/add",
		path: "/add",
		getParentRoute: () => Route$27
	}),
	BrowserRoute: Route$24.update({
		id: "/browser",
		path: "/browser",
		getParentRoute: () => Route$27
	}),
	CoachingRoute: Route$23.update({
		id: "/coaching",
		path: "/coaching",
		getParentRoute: () => Route$27
	}),
	ConnectRoute: Route$22.update({
		id: "/connect",
		path: "/connect",
		getParentRoute: () => Route$27
	}),
	DeskRoute: Route$21.update({
		id: "/desk",
		path: "/desk",
		getParentRoute: () => Route$27
	}),
	FocusRoute: Route$20.update({
		id: "/focus",
		path: "/focus",
		getParentRoute: () => Route$27
	}),
	FriendsRoute: Route$19.update({
		id: "/friends",
		path: "/friends",
		getParentRoute: () => Route$27
	}),
	LoginRoute: Route$18.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$27
	}),
	MailRoute: Route$17.update({
		id: "/mail",
		path: "/mail",
		getParentRoute: () => Route$27
	}),
	NotesRoute: Route$16.update({
		id: "/notes",
		path: "/notes",
		getParentRoute: () => Route$27
	}),
	SettingsRoute: Route$15.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$27
	}),
	StatsRoute: Route$14.update({
		id: "/stats",
		path: "/stats",
		getParentRoute: () => Route$27
	}),
	TargetRoute: Route$13.update({
		id: "/target",
		path: "/target",
		getParentRoute: () => Route$27
	}),
	TemplatesRoute: Route$12.update({
		id: "/templates",
		path: "/templates",
		getParentRoute: () => Route$27
	}),
	ApiRtcRoute: Route$11.update({
		id: "/api/rtc",
		path: "/api/rtc",
		getParentRoute: () => Route$27
	}),
	ChatCodeRoute: Route$10.update({
		id: "/chat/$code",
		path: "/chat/$code",
		getParentRoute: () => Route$27
	}),
	CustomStudyDeckIdRoute: Route$9.update({
		id: "/custom-study/$deckId",
		path: "/custom-study/$deckId",
		getParentRoute: () => Route$27
	}),
	DiscussCodeRoute: Route$8.update({
		id: "/discuss/$code",
		path: "/discuss/$code",
		getParentRoute: () => Route$27
	}),
	NotesNoteIdRoute: Route$7.update({
		id: "/notes_/$noteId",
		path: "/notes/$noteId",
		getParentRoute: () => Route$27
	}),
	OptionsDeckIdRoute: Route$6.update({
		id: "/options/$deckId",
		path: "/options/$deckId",
		getParentRoute: () => Route$27
	}),
	OverviewDeckIdRoute: Route$5.update({
		id: "/overview/$deckId",
		path: "/overview/$deckId",
		getParentRoute: () => Route$27
	}),
	QuizCodeRoute: Route$4.update({
		id: "/quiz/$code",
		path: "/quiz/$code",
		getParentRoute: () => Route$27
	}),
	SessionDeckIdRoute: Route$3.update({
		id: "/session/$deckId",
		path: "/session/$deckId",
		getParentRoute: () => Route$27
	}),
	StudyDeckIdRoute: Route$2.update({
		id: "/study/$deckId",
		path: "/study/$deckId",
		getParentRoute: () => Route$27
	}),
	TemplatesTemplateIdRoute: Route$1.update({
		id: "/templates_/$templateId",
		path: "/templates/$templateId",
		getParentRoute: () => Route$27
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$27
	})
};
var routeTree = Route$27._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter as C, TabsList as D, TabsContent as E, TabsTrigger as O, Route$9 as S, Tabs as T, Route$4 as _, Route$13 as a, Route$7 as b, Route$18 as c, Route$20 as d, Route$21 as f, Route$3 as g, Route$25 as h, Route$10 as i, Route$19 as l, Route$24 as m, FocusMode as n, Route$16 as o, Route$23 as p, Route$1 as r, Route$17 as s, AccountForm as t, Route$2 as u, Route$5 as v, router_exports as w, Route$8 as x, Route$6 as y };
