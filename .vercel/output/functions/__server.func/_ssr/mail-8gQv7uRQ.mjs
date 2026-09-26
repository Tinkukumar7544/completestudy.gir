import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { s as Route$17 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as Mail, J as Inbox, T as RefreshCw, _t as ChevronRight } from "../_libs/lucide-react.mjs";
import { G as createSsrRpc, H as Button, W as cn, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mail-8gQv7uRQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listMailLabels = createServerFn({ method: "POST" }).validator((data = {}) => ({ connector: data.connector === "Outlook" ? "Outlook" : "Gmail" })).handler(createSsrRpc("4edafe0783c13752a110a2fc1e26c74844d1b82a39c27a7e289efc36f47701a4"));
var listMailMessages = createServerFn({ method: "POST" }).validator((data = {}) => ({
	connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
	labelId: String(data.labelId ?? ""),
	query: String(data.query ?? "")
})).handler(createSsrRpc("e7e8c85339c3be07f370d81470b952f95672ca9c36c9fccfe555a83c883fb403"));
var getMailMessage = createServerFn({ method: "POST" }).validator((data) => ({
	connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
	id: String(data.id || "").trim()
})).handler(createSsrRpc("acb9a5b5ab8635d02813444fe5057ce93310df710f41d4c63d9f1ebb00b2ece9"));
createServerFn({ method: "POST" }).validator((data = {}) => ({ folderId: String(data.folderId || "root") })).handler(createSsrRpc("c4c744217054c7be8feb923d776ba9924116c772ea6d19e079f063f640a8f748"));
function asList(data) {
	if (Array.isArray(data)) return data;
	if (data && typeof data === "object") {
		const o = data;
		for (const key of [
			"labels",
			"folders",
			"messages",
			"emails",
			"threads",
			"items",
			"data",
			"results"
		]) if (Array.isArray(o[key])) return o[key];
	}
	return [];
}
function asLabels(data) {
	return asList(data).map((item) => {
		if (!item || typeof item !== "object") return null;
		const o = item;
		const id = String(o.id ?? o.labelId ?? o.folder_id ?? o.name ?? "").trim();
		const name = String(o.name ?? o.label ?? o.path ?? o.id ?? "").trim();
		if (!id || !name) return null;
		return {
			id,
			name
		};
	}).filter((x) => Boolean(x));
}
function asMessages(data) {
	return asList(data).map((item) => {
		if (!item || typeof item !== "object") return null;
		const o = item;
		const id = String(o.id ?? o.message_id ?? o.threadId ?? "").trim();
		if (!id) return null;
		const fromObj = o.from && typeof o.from === "object" ? o.from : null;
		return {
			id,
			subject: String(o.subject ?? o.title ?? "(no subject)"),
			from: String(fromObj?.email ?? fromObj?.name ?? o.from ?? o.sender ?? ""),
			snippet: String(o.snippet ?? o.preview ?? o.body ?? "").slice(0, 240),
			date: String(o.date ?? o.internalDate ?? o.received ?? "")
		};
	}).filter((x) => Boolean(x));
}
function payload(res) {
	try {
		return JSON.parse(res.json);
	} catch {
		return null;
	}
}
function MailPage() {
	const search = Route$17.useSearch();
	const navigate = useNavigate();
	const addLink = useExamStore((s) => s.addLink);
	const links = useExamStore((s) => s.links ?? []);
	const [labels, setLabels] = (0, import_react.useState)([]);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [loginUrl, setLoginUrl] = (0, import_react.useState)(null);
	const linked = (0, import_react.useMemo)(() => links.filter((l) => l.kind === "email"), [links]);
	function go(patch) {
		navigate({
			to: "/mail",
			search: {
				...search,
				...patch
			}
		});
	}
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setBusy(true);
		setError(null);
		setLoginUrl(null);
		(async () => {
			try {
				if (search.message) {
					const res = await getMailMessage({ data: {
						connector: search.connector,
						id: search.message
					} });
					if (cancelled) return;
					if (res.loginRequired) {
						setLoginUrl(res.loginUrl || null);
						setError("Sign in to open mail.");
						return;
					}
					if (!res.ok) {
						setError(res.errorMessage || "Could not open this message.");
						return;
					}
					const data = payload(res);
					const row = asMessages(data)[0];
					const raw = data && typeof data === "object" ? data : {};
					setBody(String(raw.body ?? raw.html ?? raw.text ?? row?.snippet ?? "No body."));
					return;
				}
				if (search.label) {
					const res = await listMailMessages({ data: {
						connector: search.connector,
						labelId: search.label
					} });
					if (cancelled) return;
					if (res.loginRequired) {
						setLoginUrl(res.loginUrl || null);
						setError("Sign in to open mail.");
						return;
					}
					if (!res.ok) {
						setError(res.errorMessage || "Could not list messages.");
						return;
					}
					setMessages(asMessages(payload(res)));
					return;
				}
				const res = await listMailLabels({ data: { connector: search.connector } });
				if (cancelled) return;
				if (res.loginRequired) {
					setLoginUrl(res.loginUrl || null);
					setError("Sign in to browse mail here without importing.");
					return;
				}
				if (!res.ok) {
					setError(res.errorMessage || "Could not list folders.");
					return;
				}
				setLabels(asLabels(payload(res)));
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "Mail is unavailable.");
			} finally {
				if (!cancelled) setBusy(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		search.connector,
		search.label,
		search.message
	]);
	function pinLabel(label) {
		if (linked.some((l) => l.remoteId === label.id)) {
			toast.message("Already shown on Tests and Notes");
			return;
		}
		addLink({
			kind: "email",
			name: label.name,
			remoteId: label.id
		});
		toast.success(`${label.name} stays linked. Mail is not copied in.`);
	}
	const title = search.message ? "Message" : search.label ? "Folder" : "Mail";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md p-4 pb-28",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-primary",
						onClick: () => go({
							label: "",
							message: ""
						}),
						children: search.connector
					}), search.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-primary",
						onClick: () => go({ message: "" }),
						children: "Folder"
					})] }) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Browse mail live. Selecting a folder shows it on Tests and Notes without importing the messages."
				}),
				loginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 h-12 w-full",
					onClick: () => window.location.assign(loginUrl),
					children: "Sign in to mail"
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-destructive",
					children: error
				}) : null,
				busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Opening mail…"
				}) : null,
				!search.label && !search.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 grid gap-2",
					children: [labels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "surface-3d lift flex items-stretch overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 text-left",
							onClick: () => go({
								label: label.id,
								message: ""
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-medium",
								children: label.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "h-14 px-3 text-xs",
							onClick: () => pinLabel(label),
							children: "Link"
						})]
					}, label.id)), !busy && !error && labels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-8 text-center text-sm text-muted-foreground",
						children: "No folders yet."
					}) : null]
				}) : null,
				search.label && !search.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 grid gap-2",
					children: [messages.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "surface-3d lift flex min-h-16 w-full flex-col items-start gap-0.5 px-4 py-3 text-left",
						onClick: () => go({ message: row.id }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-semibold",
								children: row.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs text-muted-foreground",
								children: row.from
							}),
							row.snippet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2 text-xs text-muted-foreground",
								children: row.snippet
							}) : null
						]
					}) }, row.id)), !busy && !error && messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-8 text-center text-sm text-muted-foreground",
						children: "This folder is empty."
					}) : null]
				}) : null,
				search.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "surface-3d mt-4 whitespace-pre-wrap p-4 text-sm leading-relaxed",
					children: body
				}) : null,
				search.label && !search.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "mt-4 h-12 w-full",
					onClick: () => {
						const label = labels.find((l) => l.id === search.label);
						pinLabel({
							id: search.label,
							name: label?.name || "Mail folder"
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), " Keep this folder on Tests and Notes"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: cn("mt-3 h-11 w-full"),
					onClick: () => void navigate({ to: search.from === "notes" ? "/notes" : "/" }),
					children: ["Back to ", search.from === "notes" ? "Notes" : "Tests"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-2 flex w-full items-center justify-center gap-2 text-xs text-muted-foreground",
					onClick: () => go({}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Reload"]
				})
			]
		})
	});
}
//#endregion
export { MailPage as component };
