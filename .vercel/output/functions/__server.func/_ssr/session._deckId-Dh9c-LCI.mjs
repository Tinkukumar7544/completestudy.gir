import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as lastSessionForDeck, s as cardsForBucket } from "./results-DOq2AZyk.mjs";
import { g as Route$3 } from "./router-B0Z9kZGU.mjs";
import { H as Button, W as cn, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session._deckId-Dh9c-LCI.js
var import_jsx_runtime = require_jsx_runtime();
function SessionEnd() {
	const { deckId } = Route$3.useParams();
	const { id } = Route$3.useSearch();
	const navigate = useNavigate();
	const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
	const lastSession = useExamStore((s) => s.lastSession);
	const sessions = useExamStore((s) => s.sessions ?? []);
	const templates = useExamStore((s) => s.templates ?? []);
	const deckSessions = sessions.filter((s) => s.deckId === deckId);
	const session = (id ? deckSessions.find((s) => s.id === id) ?? (lastSession?.id === id ? lastSession : null) : null) ?? (lastSession?.deckId === deckId ? lastSession : null) ?? lastSessionForDeck(deckSessions, deckId);
	if (!deck || !session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Session",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No session yet. Study the deck first."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/overview/$deckId",
				params: { deckId },
				className: "mt-3 inline-block text-primary",
				children: "Deck overview"
			})]
		})
	});
	const result = session;
	const template = templates.find((t) => t.id === result.templateId) ?? templates.find((t) => t.bookmarked);
	const rows = [
		{
			pick: "wrong",
			label: "Wrong",
			count: result.wrong,
			tone: "learn"
		},
		{
			pick: "marked",
			label: "Review",
			count: result.marked,
			tone: "mark"
		},
		{
			pick: "skipped",
			label: "Skipped",
			count: result.notAttempted,
			tone: "new"
		},
		{
			pick: "correct",
			label: "Correct",
			count: result.correct,
			tone: "review"
		}
	];
	function practice(pick, count) {
		const n = cardsForBucket(useExamStore.getState().cards, deckId, pick).length || count;
		if (!n) return;
		navigate({
			to: "/study/$deckId",
			params: { deckId },
			search: {
				mode: "custom",
				pick,
				count: n,
				paper: "",
				quiz: "",
				session: ""
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Study complete",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md px-5 py-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-medium",
					children: deck.name.split("::").pop()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-review",
							children: result.correct
						}),
						"/",
						result.total,
						" correct",
						result.wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							" ",
							"· ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-learn",
								children: [result.wrong, " wrong"]
							})
						] }) : null
					]
				}),
				template ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Saved on ",
						template.name,
						template.lastResult?.sessionId === result.id ? " · kept on this template" : ""
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "surface-3d mx-auto mt-6 max-w-xs overflow-hidden text-left text-base",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-border last:border-b-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-12 w-full items-center justify-between px-4 py-2 disabled:opacity-40",
							disabled: row.count === 0,
							onClick: () => practice(row.pick, row.count),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-semibold tabular-nums", row.tone === "learn" && "text-learn", row.tone === "mark" && "text-mark", row.tone === "new" && "text-new", row.tone === "review" && "text-review"),
								children: row.count
							})]
						})
					}, row.pick))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-xs text-xs text-muted-foreground",
					children: "Tap a category to practice those questions from this paper."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-5 h-12 w-full max-w-xs",
					disabled: result.wrong + result.correct === 0,
					onClick: () => practice("attempted", result.wrong + result.correct),
					children: "Practice attempted"
				}),
				deckSessions.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-8 max-w-xs text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "All results"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-border rounded-md border border-border bg-card",
						children: deckSessions.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex w-full items-center justify-between px-3 py-2.5 text-left text-sm", s.id === result.id && "bg-muted/70"),
							onClick: () => void navigate({
								to: "/session/$deckId",
								params: { deckId },
								search: { id: s.id }
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: new Date(s.at).toLocaleString(void 0, {
									dateStyle: "medium",
									timeStyle: "short"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-review",
									children: s.correct
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["/", s.total]
								})]
							})]
						}) }, s.id))
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-6 w-full max-w-xs",
					onClick: () => void navigate({
						to: "/overview/$deckId",
						params: { deckId }
					}),
					children: "Deck overview"
				})
			]
		})
	});
}
//#endregion
export { SessionEnd as component };
