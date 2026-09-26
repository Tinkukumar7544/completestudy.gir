import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as defaultConfig } from "./types-XZVWHhWz.mjs";
import { D as resultCounts, S as paperKindLabel, g as lastSessionForDeck } from "./results-DOq2AZyk.mjs";
import { v as Route$5 } from "./router-B0Z9kZGU.mjs";
import { n as Wrench, s as Users } from "../_libs/lucide-react.mjs";
import { H as Button, K as deckCounts, U as activeExamTemplate, W as cn, Y as ensureDaily, c as AnkiShell, et as studyCards, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
import { n as clampPaperCount, r as clampPaperMinutes, t as PaperStartFields } from "./paper-start-u23BUBx1.mjs";
import { r as rememberPaperPrefs } from "./clipboard-wrdOgXLB.mjs";
import { t as Glyph3D } from "./glyphs-CX9tzrUD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overview._deckId-CVEUvQi3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const { deckId } = Route$5.useParams();
	const navigate = useNavigate();
	const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
	const cards = useExamStore((s) => s.cards);
	const configs = useExamStore((s) => s.configs);
	const dailyRaw = useExamStore((s) => s.daily);
	const prefs = useExamStore((s) => s.prefs);
	const unburyDeck = useExamStore((s) => s.unburyDeck);
	const papers = useExamStore((s) => s.papers);
	const sessions = useExamStore((s) => s.sessions ?? []);
	const lastSession = useExamStore((s) => s.lastSession);
	const total = cards.filter((c) => c.deckId === deckId).length;
	const templates = useExamStore((s) => s.templates ?? []);
	const [customCount, setCustomCount] = (0, import_react.useState)(() => String(Math.min(20, Math.max(1, total || 20))));
	const [minutes, setMinutes] = (0, import_react.useState)("20");
	const [templateId, setTemplateId] = (0, import_react.useState)(() => activeExamTemplate()?.id ?? "");
	const deckSessions = sessions.filter((s) => s.deckId === deckId);
	const sessionRows = lastSession?.deckId === deckId && !deckSessions.some((s) => s.id === lastSession.id) ? [lastSession, ...deckSessions] : deckSessions;
	if (!deck) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Deck",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: "Deck not found."
		})
	});
	const config = configs[deck.configId] ?? defaultConfig();
	const daily = ensureDaily(dailyRaw, prefs.dayStartHour);
	const c = deckCounts(cards, deck.id, config, daily, prefs);
	const results = resultCounts(cards, deckId);
	const buried = cards.filter((x) => x.deckId === deckId && x.queue === "buried").length;
	const due = c.new + c.learn + c.review;
	const deckPapers = papers.filter((p) => p.deckId === deckId);
	const saved = lastSessionForDeck(sessionRows, deckId);
	const n = clampPaperCount(customCount, total);
	const mins = clampPaperMinutes(minutes);
	function go(pick, count, session = "") {
		rememberPaperPrefs({
			template: templateId,
			minutes: mins
		});
		navigate({
			to: "/study/$deckId",
			params: { deckId },
			search: {
				mode: pick === "due" ? "study" : "custom",
				pick,
				count,
				paper: "",
				quiz: "",
				session,
				template: templateId || void 0,
				minutes: mins
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: deck.name.split("::").pop(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end gap-1 px-2 pt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Custom study",
				onClick: () => void navigate({
					to: "/custom-study/$deckId",
					params: { deckId }
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full min-w-0 max-w-md px-5 pt-4 pb-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-5 grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph3D, {
						name: deck.name.includes("::") ? "subdeck" : "deck",
						alt: "",
						size: "lg"
					})
				}),
				deck.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-5 text-sm text-muted-foreground",
					children: deck.description
				}) : null,
				saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-4 text-sm text-muted-foreground",
					children: [
						"Last paper ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-review",
							children: saved.correct
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [" / ", saved.total]
						}),
						" correct",
						saved.wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							" ",
							"· ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-learn",
								children: [saved.wrong, " wrong"]
							})
						] }) : null
					]
				}) : prefs.showRemaining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-4 text-xs text-muted-foreground",
					children: [
						c.total,
						" questions in deck",
						due ? ` · ${due} due to study` : "",
						c.suspended ? ` · ${c.suspended} suspended/buried` : ""
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-1 grid w-full min-w-0 max-w-xs gap-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Start"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperStartFields, {
									total,
									count: customCount,
									onCount: setCustomCount,
									minutes,
									onMinutes: setMinutes,
									templateId: templateId || templates.find((t) => t.bookmarked)?.id || templates[0]?.id || "",
									onTemplate: setTemplateId
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "h-12 w-full",
							disabled: total === 0,
							onClick: () => go("random", n),
							children: ["Start ", n]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "h-12 w-full",
							disabled: total === 0,
							onClick: () => go("all", total),
							children: "Take Full Paper"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-12 w-full",
							onClick: () => void navigate({
								to: "/friends",
								search: { deck: deckId }
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), " Friend Quiz"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-12 w-full",
							disabled: due === 0,
							onClick: () => {
								go("due", studyCards(deckId).length);
							},
							children: "Study"
						}),
						buried > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-12 w-full",
							onClick: () => unburyDeck(deckId),
							children: ["Unbury ", buried]
						}) : null
					]
				}),
				results.wrong + results.marked + results.skipped + results.correct > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "surface-3d mx-auto mt-8 max-w-xs overflow-hidden text-left text-base",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BucketRow, {
							label: "Learning / Wrong",
							count: results.wrong,
							tone: "learn",
							onClick: () => go("wrong", results.wrong)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BucketRow, {
							label: "Review",
							count: results.marked,
							tone: "mark",
							onClick: () => go("marked", results.marked)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BucketRow, {
							label: "Unattempted",
							count: results.skipped,
							tone: "new",
							onClick: () => go("skipped", results.skipped)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BucketRow, {
							label: "Correct",
							count: results.correct,
							tone: "review",
							onClick: () => go("correct", results.correct)
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "surface-3d mx-auto mt-8 max-w-xs p-4 text-left text-base leading-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums text-new",
								children: c.new
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Learning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums text-learn",
								children: c.learn
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "To review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums text-review",
								children: c.review
							})]
						})
					]
				}),
				saved && prefs.showRemaining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [
						c.total,
						" questions in deck",
						due ? ` · ${due} due to study` : ""
					]
				}) : null,
				due === 0 && results.wrong + results.marked + results.skipped > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-xs text-xs text-muted-foreground",
					children: "No cards are due. Use Wrong, Review, or Unattempted to practice those questions."
				}) : null,
				sessionRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-8 max-w-xs text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Saved papers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-border rounded-md border border-border bg-card",
						children: sessionRows.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm",
							onClick: () => void navigate({
								to: "/session/$deckId",
								params: { deckId },
								search: { id: s.id }
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate",
									children: new Date(s.at).toLocaleString(void 0, {
										dateStyle: "medium",
										timeStyle: "short"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										s.correct,
										" correct · ",
										s.wrong,
										" wrong · ",
										s.notAttempted,
										" skipped"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 font-semibold tabular-nums text-review",
								children: [
									s.correct,
									"/",
									s.total
								]
							})]
						}) }, s.id))
					})]
				}),
				deckPapers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-6 max-w-xs text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Practice later"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-border rounded-md border border-border bg-card",
						children: deckPapers.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm",
							onClick: () => void navigate({
								to: "/study/$deckId",
								params: { deckId },
								search: {
									mode: "custom",
									pick: "paper",
									count: p.questionIds.length,
									paper: p.id,
									quiz: "",
									session: ""
								}
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.title || paperKindLabel(p.kind) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: p.questionIds.length
							})]
						}) }, p.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/options/$deckId",
							params: { deckId },
							className: "text-primary",
							children: "Deck options"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/custom-study/$deckId",
							params: { deckId },
							className: "text-primary",
							children: "More custom study"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/browser",
							search: { deck: deckId },
							className: "text-primary",
							children: "Browse questions"
						})
					]
				})
			]
		})]
	});
}
function BucketRow({ label, count, tone, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "border-b border-border last:border-b-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-h-12 w-full items-center justify-between px-4 py-2 disabled:opacity-40",
			disabled: count === 0,
			onClick,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-semibold tabular-nums", tone === "learn" && "text-learn", tone === "mark" && "text-mark", tone === "new" && "text-new", tone === "review" && "text-review"),
				children: count
			})]
		})
	});
}
//#endregion
export { Overview as component };
