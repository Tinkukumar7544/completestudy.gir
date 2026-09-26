import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Label, V as Input, W as cn, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paper-start-u23BUBx1.js
var import_jsx_runtime = require_jsx_runtime();
function PaperStartFields({ total, count, onCount, minutes, onMinutes, templateId, onTemplate, showCount = true, showMinutes = true }) {
	const templates = useExamStore((s) => s.templates ?? []);
	const rows = templates.length ? templates : [];
	const both = showCount && showMinutes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-w-0 gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "paper-template",
				className: "text-xs text-muted-foreground",
				children: "Template"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				id: "paper-template",
				className: "h-11 w-full min-w-0 max-w-full truncate rounded-lg border border-border bg-card px-3 text-sm shadow-raised",
				value: templateId,
				onChange: (e) => onTemplate(e.target.value),
				children: rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: t.id,
					children: [t.name, t.bookmarked ? " · active" : ""]
				}, t.id))
			})]
		}), showCount || showMinutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("grid min-w-0 gap-2", both && "grid-cols-2"),
			children: [showCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-w-0 gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "paper-count",
						className: "text-xs text-muted-foreground",
						children: "Questions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "paper-count",
						inputMode: "numeric",
						value: count,
						onChange: (e) => onCount(e.target.value.replace(/[^\d]/g, "")),
						"aria-label": "Number of questions",
						className: "min-w-0 tabular-nums"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: [total, " in this test"]
					})
				]
			}) : null, showMinutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-w-0 gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "paper-minutes",
						className: "text-xs text-muted-foreground",
						children: "Time (min)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "paper-minutes",
						inputMode: "numeric",
						value: minutes,
						onChange: (e) => onMinutes(e.target.value.replace(/[^\d]/g, "")),
						"aria-label": "Time limit in minutes",
						className: "min-w-0 tabular-nums"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: "1–180 min"
					})
				]
			}) : null]
		}) : null]
	});
}
function clampPaperMinutes(raw, fallback = 20) {
	const n = Number(raw);
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.max(1, Math.min(180, Math.floor(n)));
}
function clampPaperCount(raw, total, fallback = 20) {
	const n = Number(raw);
	const cap = Math.max(1, total || 1);
	if (!Number.isFinite(n) || n <= 0) return Math.min(fallback, cap);
	return Math.max(1, Math.min(cap, Math.floor(n)));
}
//#endregion
export { clampPaperCount as n, clampPaperMinutes as r, PaperStartFields as t };
