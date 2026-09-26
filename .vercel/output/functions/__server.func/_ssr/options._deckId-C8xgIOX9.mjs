import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as defaultConfig } from "./types-XZVWHhWz.mjs";
import { D as TabsList, E as TabsContent, O as TabsTrigger, T as Tabs, y as Route$6 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Label, H as Button, V as Input, c as AnkiShell, n as Switch, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/options._deckId-C8xgIOX9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5 border-b border-border px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			}) : null,
			children
		]
	});
}
function Options() {
	const { deckId } = Route$6.useParams();
	const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
	const stored = useExamStore((s) => s.configs[deck?.configId ?? ""] ?? defaultConfig());
	const setConfig = useExamStore((s) => s.setConfig);
	const [cfg, setCfg] = (0, import_react.useState)(stored);
	if (!deck) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Deck options",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm",
			children: "Deck not found."
		})
	});
	function patch(p) {
		setCfg((c) => ({
			...c,
			...p
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Deck options",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "new",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "w-full justify-start rounded-none bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "new",
							children: "New"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "reviews",
							children: "Reviews"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "lapses",
							children: "Lapses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "general",
							children: "General"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "new",
					className: "mt-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "New questions/day",
							hint: "Anki default 20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.newPerDay,
								onChange: (e) => patch({ newPerDay: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Learning steps (minutes)",
							hint: "Space-separated. Default 10 1440 (10m then 1d)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cfg.learnSteps.join(" "),
								onChange: (e) => patch({ learnSteps: e.target.value.split(/\s+/).map(Number).filter((n) => n > 0) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Graduating interval (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.graduatingInterval,
								onChange: (e) => patch({ graduatingInterval: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Easy interval (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.easyInterval,
								onChange: (e) => patch({ easyInterval: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Starting ease",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.startingEase,
								onChange: (e) => patch({ startingEase: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Insertion order",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
								value: cfg.newOrder,
								onChange: (e) => patch({ newOrder: e.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "sequential",
									children: "Sequential"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "random",
									children: "Random"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "reviews",
					className: "mt-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Maximum reviews/day",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.reviewsPerDay,
								onChange: (e) => patch({ reviewsPerDay: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Easy bonus",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: .1,
								value: cfg.easyBonus,
								onChange: (e) => patch({ easyBonus: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Interval modifier",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: .05,
								value: cfg.intervalModifier,
								onChange: (e) => patch({ intervalModifier: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Hard interval",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: .05,
								value: cfg.hardInterval,
								onChange: (e) => patch({ hardInterval: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Maximum interval (days)",
							hint: "Capped at 120 for an 8-repetition ladder",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.maximumInterval,
								onChange: (e) => patch({ maximumInterval: Number(e.target.value) })
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "lapses",
					className: "mt-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Relearning steps (minutes)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cfg.relearnSteps.join(" "),
								onChange: (e) => patch({ relearnSteps: e.target.value.split(/\s+/).map(Number).filter((n) => n > 0) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Minimum interval (days)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.minimumInterval,
								onChange: (e) => patch({ minimumInterval: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Leech threshold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cfg.leechThreshold,
								onChange: (e) => patch({ leechThreshold: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Leech action",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
								value: cfg.leechAction,
								onChange: (e) => patch({ leechAction: e.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "suspend",
									children: "Suspend"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tag",
									children: "Tag only"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "general",
					className: "mt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Option group name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cfg.name,
							onChange: (e) => patch({ name: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Bury siblings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Hide related questions until tomorrow"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: cfg.burySiblings,
							onCheckedChange: (v) => patch({ burySiblings: v })
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => {
					setConfig(cfg);
					toast.success("Options saved");
				},
				children: "Save"
			})
		})]
	});
}
//#endregion
export { Options as component };
