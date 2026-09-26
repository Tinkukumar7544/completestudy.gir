import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { m as Route$24 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Label, H as Button, V as Input, c as AnkiShell, i as DialogContent, nt as useExamStore, o as DialogHeader, r as Dialog, s as DialogTitle } from "./router-B0Z9kZGU2.mjs";
import { t as Textarea } from "./textarea-BI7oN-Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browser-BO0dwCGU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function matches(card, q) {
	const s = q.trim().toLowerCase();
	if (!s) return true;
	if (s === "is:new") return card.queue === "new";
	if (s === "is:learn") return card.queue === "learn" || card.queue === "relearn";
	if (s === "is:due") return card.queue === "review" && card.due <= Date.now();
	if (s === "is:suspended") return card.queue === "suspended";
	if (s === "is:marked" || s === "tag:marked") return card.marked;
	if (s.startsWith("flag:")) return card.flag === Number(s.slice(5));
	if (s.startsWith("tag:")) return card.tags.map((t) => t.toLowerCase()).includes(s.slice(4));
	return card.question.toLowerCase().includes(s) || card.explanation.toLowerCase().includes(s) || card.rule.toLowerCase().includes(s) || card.tags.some((t) => t.toLowerCase().includes(s));
}
function Browser() {
	const { deck: deckFilter } = Route$24.useSearch();
	const decks = useExamStore((s) => s.decks);
	const cards = useExamStore((s) => s.cards);
	const deleteCards = useExamStore((s) => s.deleteCards);
	const suspendCards = useExamStore((s) => s.suspendCards);
	const flagCard = useExamStore((s) => s.flagCard);
	const markCard = useExamStore((s) => s.markCard);
	const updateCard = useExamStore((s) => s.updateCard);
	const [query, setQuery] = (0, import_react.useState)(deckFilter ? "" : "");
	const [deckId, setDeckId] = (0, import_react.useState)(deckFilter);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const list = (0, import_react.useMemo)(() => {
		return cards.filter((c) => (!deckId || c.deckId === deckId) && matches(c, query));
	}, [
		cards,
		deckId,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Card browser",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search (is:new, is:due, tag:marked)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm",
						value: deckId,
						onChange: (e) => setDeckId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All decks"
						}), decks.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.name
						}, d.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 px-1 text-xs text-muted-foreground",
						children: [list.length, " questions"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start justify-between gap-2 border-b border-border bg-card px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "min-w-0 flex-1 text-left",
					onClick: () => setEdit({ ...c }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm",
						children: c.question
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							decks.find((d) => d.id === c.deckId)?.name,
							" · ",
							c.queue,
							c.marked ? " · marked" : "",
							c.flag ? ` · flag ${c.flag}` : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-wrap justify-end gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => markCard(c.id, !c.marked),
							children: c.marked ? "Unmark" : "Mark"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => flagCard(c.id, c.flag ? 0 : 1),
							children: "Flag"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => suspendCards([c.id], c.queue !== "suspended"),
							children: c.queue === "suspended" ? "Unsuspend" : "Suspend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-destructive",
							onClick: () => {
								deleteCards([c.id]);
								toast.success("Deleted");
							},
							children: "Del"
						})
					]
				})]
			}, c.id)) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!edit,
				onOpenChange: () => setEdit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90dvh] overflow-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit note" }) }), edit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Front" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: edit.question,
									onChange: (e) => setEdit({
										...edit,
										question: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Back / explanation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: edit.explanation,
									onChange: (e) => setEdit({
										...edit,
										explanation: e.target.value
									})
								})]
							}),
							edit.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: opt,
								onChange: (e) => {
									const options = [...edit.options];
									options[i] = e.target.value;
									setEdit({
										...edit,
										options
									});
								}
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									updateCard(edit);
									setEdit(null);
									toast.success("Saved");
								},
								children: "Save"
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { Browser as component };
