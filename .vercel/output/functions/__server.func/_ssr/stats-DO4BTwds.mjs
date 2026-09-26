import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Z as forecast, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stats-DO4BTwds.js
var import_jsx_runtime = require_jsx_runtime();
function Stats() {
	const cards = useExamStore((s) => s.cards);
	const revlog = useExamStore((s) => s.revlog);
	const prefs = useExamStore((s) => s.prefs);
	const start = /* @__PURE__ */ new Date();
	start.setHours(prefs.dayStartHour, 0, 0, 0);
	const todayLogs = revlog.filter((r) => r.at >= start.getTime());
	const again = todayLogs.filter((r) => r.rating === "again").length;
	const hard = todayLogs.filter((r) => r.rating === "hard").length;
	const good = todayLogs.filter((r) => r.rating === "good").length;
	const easy = todayLogs.filter((r) => r.rating === "easy").length;
	const fc = forecast(cards, 14);
	const max = Math.max(1, ...fc);
	const nNew = cards.filter((c) => c.queue === "new").length;
	const nLearn = cards.filter((c) => c.queue === "learn" || c.queue === "relearn").length;
	const nRev = cards.filter((c) => c.queue === "review").length;
	const nSus = cards.filter((c) => c.queue === "suspended" || c.queue === "buried").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Statistics",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border bg-card px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-muted-foreground",
						children: "Today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-3xl font-medium tabular-nums",
						children: todayLogs.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "questions answered"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-4 gap-2 text-center text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: again,
								label: "Again",
								className: "text-learn"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: hard,
								label: "Hard",
								className: "text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: good,
								label: "Good",
								className: "text-review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: easy,
								label: "Easy",
								className: "text-new"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border bg-card px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted-foreground",
					children: "Forecast (14 days)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex h-28 items-end gap-1",
					children: fc.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full rounded-t-sm bg-primary",
							style: {
								height: `${n / max * 100}%`,
								minHeight: n ? 4 : 0
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground",
							children: i === 0 ? "T" : i + 1
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-card px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted-foreground",
					children: "Question counts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-new",
								children: nNew
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Learning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-learn",
								children: nLearn
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-review",
								children: nRev
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Suspended / buried" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: nSus
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: cards.length
							})]
						})
					]
				})]
			})
		]
	});
}
function Stat({ n, label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `text-lg font-medium tabular-nums ${className ?? ""}`,
		children: n
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: label
	})] });
}
//#endregion
export { Stats as component };
