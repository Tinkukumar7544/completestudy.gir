import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Radio, m as StickyNote, s as Users, v as Share2, z as MessageCircle } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, L as useCurrentUser, V as Input, a as DialogDescription, c as AnkiShell, i as DialogContent, nt as useExamStore, o as DialogHeader, r as Dialog, s as DialogTitle } from "./router-B0Z9kZGU2.mjs";
import { i as sendChat, n as joinChat, t as createChat } from "./chat-DZdTZY-7.mjs";
import { n as rememberQuizName, r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { a as joinQuiz } from "./quiz-DNF-wQMz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/connect-DbR5cKb8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConnectHub() {
	const navigate = useNavigate();
	const user = useCurrentUser();
	const [name, setName] = (0, import_react.useState)("");
	const [quizCode, setQuizCode] = (0, import_react.useState)("");
	const [chatCode, setChatCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const notes = useExamStore((s) => s.notes ?? []);
	const recentNotes = (0, import_react.useMemo)(() => notes.slice().sort((a, b) => b.modifiedAt - a.modifiedAt).slice(0, 40), [notes]);
	(0, import_react.useEffect)(() => {
		const remembered = rememberedQuizName();
		if (remembered) setName(remembered);
		else if (user?.primaryEmail) setName(user.primaryEmail.split("@")[0] || "");
		else if (user?.displayName) setName(user.displayName);
	}, [user]);
	async function joinLiveTest() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name so friends can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("quiz");
		try {
			const room = await joinQuiz({ data: {
				code: quizCode,
				playerId: quizPlayerId(),
				name: display
			} });
			navigate({
				to: "/quiz/$code",
				params: { code: room.code },
				search: { view: "" }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setBusy(null);
		}
	}
	async function startChat() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name so your friend can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("chat");
		try {
			const room = await createChat({ data: {
				hostId: quizPlayerId(),
				hostName: display,
				title: "1-1 chat"
			} });
			navigate({
				to: "/chat/$code",
				params: { code: room.code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start chat");
		} finally {
			setBusy(null);
		}
	}
	async function joinExistingChat() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name so your friend can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("join-chat");
		try {
			const room = await joinChat({ data: {
				code: chatCode,
				playerId: quizPlayerId(),
				name: display
			} });
			navigate({
				to: "/chat/$code",
				params: { code: room.code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join chat");
		} finally {
			setBusy(null);
		}
	}
	async function shareNote(noteId) {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name so your friend can see you");
			return;
		}
		const note = notes.find((n) => n.id === noteId);
		if (!note) return;
		rememberQuizName(display);
		setBusy("notes");
		try {
			const room = await createChat({ data: {
				hostId: quizPlayerId(),
				hostName: display,
				title: note.title.trim() || "Shared note"
			} });
			const files = (note.files ?? []).map((f) => f.name).filter(Boolean);
			const body = [
				note.title.trim() || "Untitled",
				note.body.trim(),
				files.length ? `Files: ${files.join(", ")}` : ""
			].filter(Boolean).join("\n\n").slice(0, 8e3) || "Empty note";
			await sendChat({ data: {
				code: room.code,
				playerId: quizPlayerId(),
				name: display,
				body
			} });
			setShareOpen(false);
			navigate({
				to: "/chat/$code",
				params: { code: room.code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not share this note");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Connect",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-md gap-5 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Take live tests with friends, chat 1-1, share notes, and share a room code — like a Telegram quiz."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-3d grid gap-2 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "connect-name",
						children: "Your name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "connect-name",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Shown to friends"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "surface-3d lift grid gap-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold tracking-tight",
								children: "Live tests together"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Host a paper from Tests. Up to ",
								20,
								" friends join with a code. Everyone taps Start. The paper runs until time is up, then auto-submits. Chat, mic, and video stay on through the summary."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void navigate({
								to: "/friends",
								search: { deck: "" }
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Create a live test"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "connect-quiz",
							children: "Join with a code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "connect-quiz",
							value: quizCode,
							onChange: (e) => setQuizCode(e.target.value.toUpperCase()),
							placeholder: "ABC123",
							className: "font-mono tracking-widest",
							autoCapitalize: "characters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void joinLiveTest(),
							disabled: busy === "quiz",
							children: busy === "quiz" ? "Joining…" : "Join live test"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "surface-3d lift grid gap-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold tracking-tight",
								children: "1-1 chat"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Private room for ",
								2,
								" people. Share the code with one friend."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void startChat(),
							disabled: busy === "chat",
							children: busy === "chat" ? "Starting…" : "Start a chat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "connect-chat",
							children: "Join a chat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "connect-chat",
							value: chatCode,
							onChange: (e) => setChatCode(e.target.value.toUpperCase()),
							placeholder: "ABC123",
							className: "font-mono tracking-widest",
							autoCapitalize: "characters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void joinExistingChat(),
							disabled: busy === "join-chat",
							children: busy === "join-chat" ? "Joining…" : "Join chat"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "surface-3d lift grid gap-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold tracking-tight",
								children: "Share notes"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Send a note through Connect. Your friend joins with the chat code and reads the text in the room."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setShareOpen(true),
							disabled: busy === "notes",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" }), busy === "notes" ? "Sharing…" : "Share a note"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: shareOpen,
			onOpenChange: setShareOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Share a note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Opens a 1-1 chat with the note as the first message." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-72 divide-y divide-border overflow-auto rounded-lg border border-border",
				children: recentNotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-3 py-6 text-center text-sm text-muted-foreground",
					children: "No notes yet."
				}) : recentNotes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex min-h-12 w-full items-center px-3 py-2 text-left text-sm",
					onClick: () => void shareNote(note.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: note.title.trim() || "Untitled"
					})
				}) }, note.id))
			})] })
		})]
	});
}
//#endregion
export { ConnectHub as component };
