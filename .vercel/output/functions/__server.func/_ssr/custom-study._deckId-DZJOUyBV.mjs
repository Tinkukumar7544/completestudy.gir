import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as Route$9 } from "./router-B0Z9kZGU.mjs";
import { H as Button, U as activeExamTemplate, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
import { n as clampPaperCount, r as clampPaperMinutes, t as PaperStartFields } from "./paper-start-u23BUBx1.mjs";
import { r as rememberPaperPrefs } from "./clipboard-wrdOgXLB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/custom-study._deckId-DZJOUyBV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomStudy() {
	const { deckId } = Route$9.useParams();
	const navigate = useNavigate();
	const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
	const bumpNewLimit = useExamStore((s) => s.bumpNewLimit);
	const total = useExamStore((s) => s.cards.filter((c) => c.deckId === deckId).length);
	const templates = useExamStore((s) => s.templates ?? []);
	const [n, setN] = (0, import_react.useState)("20");
	const [minutes, setMinutes] = (0, import_react.useState)("20");
	const [templateId, setTemplateId] = (0, import_react.useState)(() => activeExamTemplate()?.id ?? "");
	if (!deck) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Custom study",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm",
			children: "Deck not found."
		})
	});
	function go(pick, mode = "custom") {
		const count = clampPaperCount(n, total);
		const mins = clampPaperMinutes(minutes);
		rememberPaperPrefs({
			template: templateId,
			minutes: mins
		});
		navigate({
			to: "/study/$deckId",
			params: { deckId },
			search: {
				mode,
				pick,
				count,
				paper: "",
				quiz: "",
				session: "",
				template: templateId || void 0,
				minutes: mins
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Custom study",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						deck.name,
						" · ",
						total,
						" questions. Session becomes a paper in the template you pick."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperStartFields, {
						total,
						count: n,
						onCount: setN,
						minutes,
						onMinutes: setMinutes,
						templateId: templateId || templates.find((t) => t.bookmarked)?.id || templates[0]?.id || "",
						onTemplate: setTemplateId
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-12 justify-start",
							onClick: () => {
								bumpNewLimit(deckId, Number(n) || 20);
								go("new");
							},
							children: "Increase today's new limit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-12 justify-start",
							onClick: () => go("forgotten"),
							children: "Review forgotten questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-12 justify-start",
							onClick: () => go("ahead"),
							children: "Review ahead"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-12 justify-start",
							onClick: () => go("new", "preview"),
							children: "Preview new questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-12 justify-start",
							onClick: () => go("random"),
							children: "Study random questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "h-12 justify-start",
							onClick: () => go("all"),
							children: "All questions in deck (full paper)"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { CustomStudy as component };
