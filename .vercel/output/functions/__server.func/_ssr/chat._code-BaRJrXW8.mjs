import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Route$10 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { dt as Copy, x as Send } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, V as Input, W as cn, c as AnkiShell } from "./router-B0Z9kZGU2.mjs";
import { i as sendChat, n as joinChat, r as listChat } from "./chat-DZdTZY-7.mjs";
import { n as rememberQuizName, r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._code-BaRJrXW8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatRoomPage() {
	const { code } = Route$10.useParams();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [joining, setJoining] = (0, import_react.useState)(false);
	const [sending, setSending] = (0, import_react.useState)(false);
	const me = quizPlayerId();
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setName(rememberedQuizName());
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function refresh() {
			try {
				const next = await listChat({ data: code });
				if (!cancelled) {
					setRoom(next);
					setError(null);
				}
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "Chat not found");
			}
		}
		refresh();
		const t = window.setInterval(() => void refresh(), 2e3);
		return () => {
			cancelled = true;
			window.clearInterval(t);
		};
	}, [code]);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [room?.messages.length]);
	const joined = Boolean(room?.members.some((m) => m.playerId === me));
	async function join() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name");
			return;
		}
		rememberQuizName(display);
		setJoining(true);
		try {
			const next = await joinChat({ data: {
				code,
				playerId: me,
				name: display
			} });
			setRoom(next);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setJoining(false);
		}
	}
	async function send() {
		const body = draft.trim();
		if (!body) return;
		const display = rememberedQuizName() || name.trim() || "You";
		setSending(true);
		setDraft("");
		try {
			const next = await sendChat({ data: {
				code,
				playerId: me,
				name: display,
				body
			} });
			setRoom(next);
		} catch (err) {
			setDraft(body);
			toast.error(err instanceof Error ? err.message : "Could not send");
		} finally {
			setSending(false);
		}
	}
	function copyCode() {
		navigator.clipboard.writeText(code.toUpperCase());
		toast.success("Code copied — send it to your friend");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: room?.title || "1-1 chat",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-[70dvh] max-w-md flex-col gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-lg tracking-widest",
						children: code.toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: room ? `${room.members.length}/2 in this chat` : "Connecting…"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "outline",
						onClick: copyCode,
						"aria-label": "Copy code",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error
				}) : null,
				!joined && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 rounded-lg border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "chat-join-name",
							children: "Your name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "chat-join-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Shown in chat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void join(),
							disabled: joining,
							children: joining ? "Joining…" : "Join chat"
						})
					]
				}) : null,
				joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scroller,
					className: "min-h-64 flex-1 space-y-2 overflow-y-auto rounded-lg border border-border bg-card p-3",
					children: [room && room.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No messages yet. Say hello."
					}) : null, room?.messages.map((m) => {
						const mine = m.playerId === me;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col", mine ? "items-end" : "items-start"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-0.5 text-[11px] text-muted-foreground",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed", mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
								children: m.body
							})]
						}, m.id);
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Message",
						"aria-label": "Message",
						maxLength: 800
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: sending || !draft.trim(),
						"aria-label": "Send",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})] }) : null
			]
		})
	});
}
//#endregion
export { ChatRoomPage as component };
