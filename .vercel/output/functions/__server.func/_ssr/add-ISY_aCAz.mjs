import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as TabsList, E as TabsContent, O as TabsTrigger, T as Tabs, h as Route$25 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as LoaderCircle, rt as FileUp } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, V as Input, W as cn, _ as importHtmlTest, at as formatBytes, c as AnkiShell, nt as useExamStore, w as parseQuestionText } from "./router-B0Z9kZGU2.mjs";
import { t as Textarea } from "./textarea-BI7oN-Xh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/add-ISY_aCAz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HtmlDropzone({ onImported, compact }) {
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [hint, setHint] = (0, import_react.useState)(null);
	const [over, setOver] = (0, import_react.useState)(false);
	async function handleFile(file) {
		if (!file) return;
		setBusy(true);
		setHint(`Reading ${file.name} · ${formatBytes(file.size)}…`);
		try {
			const result = await importHtmlTest(file, setHint);
			if (result.template && result.questions) toast.success(`${result.questions} questions from ${result.title}. Saved two templates: original paper and TCS iON.`);
			else if (result.questions) toast.success(`${result.questions} questions from ${result.title} (${result.sizeLabel})`);
			else if (result.template) toast.success(`Saved two templates (${result.sizeLabel}): original paper and TCS iON.`);
			for (const w of result.warnings.slice(0, 3)) toast.message(w);
			onImported?.(result.deckId);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not read this HTML file");
		} finally {
			setBusy(false);
			setHint(null);
			if (inputRef.current) inputRef.current.value = "";
		}
	}
	function onDrop(e) {
		e.preventDefault();
		setOver(false);
		handleFile(e.dataTransfer.files?.[0]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("surface-3d grid place-items-center px-4 py-8 text-center", over && "ring-2 ring-ring", compact && "py-5"),
		onDragOver: (e) => {
			e.preventDefault();
			setOver(true);
		},
		onDragLeave: () => setOver(false),
		onDrop,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				id: "html-test-file",
				type: "file",
				accept: ".html,.htm,text/html",
				className: "sr-only",
				"aria-label": "HTML test file",
				onChange: (e) => void handleFile(e.target.files?.[0])
			}),
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-8 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-medium",
				children: busy ? "Uploading HTML test…" : "Upload HTML test"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-xs text-muted-foreground",
				children: hint ?? "Drop any practice-test HTML. Questions become a test. Two templates are saved: the original paper and TCS iON."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				className: "mt-4",
				disabled: busy,
				onClick: () => inputRef.current?.click(),
				children: "Choose HTML file"
			})
		]
	});
}
function AddNote() {
	const { deck: deckParam, tab: tabParam } = Route$25.useSearch();
	const navigate = useNavigate();
	const decks = useExamStore((s) => s.decks);
	const addCards = useExamStore((s) => s.addCards);
	const [deckId, setDeckId] = (0, import_react.useState)(deckParam || decks[0]?.id || "");
	const [type, setType] = (0, import_react.useState)("mcq");
	const [question, setQuestion] = (0, import_react.useState)("");
	const [rule, setRule] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)("");
	const [options, setOptions] = (0, import_react.useState)([
		"",
		"",
		"",
		""
	]);
	const [correct, setCorrect] = (0, import_react.useState)(0);
	const [explanation, setExplanation] = (0, import_react.useState)("");
	const [paste, setPaste] = (0, import_react.useState)("");
	const parsed = (0, import_react.useMemo)(() => parseQuestionText(paste), [paste]);
	function saveOne() {
		const opts = options.map((o) => o.trim()).filter(Boolean);
		if (!question.trim()) {
			toast.error("Front (question) is empty");
			return;
		}
		if (type !== "numerical" && opts.length < 2) {
			toast.error("Need at least two options");
			return;
		}
		addCards(deckId, [{
			type,
			rule: rule.trim() || "General",
			question: question.trim(),
			options: opts,
			correct,
			explanation: explanation.trim()
		}]);
		toast.success("Added");
		setQuestion("");
		setOptions([
			"",
			"",
			"",
			""
		]);
		setExplanation("");
		setCorrect(0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Add",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
							value: type,
							onChange: (e) => setType(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "mcq",
									children: "MCQ (one answer)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "msq",
									children: "MSQ (multi)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "numerical",
									children: "Numerical"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deck" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
							value: deckId,
							onChange: (e) => setDeckId(e.target.value),
							children: decks.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.name
							}, d.id))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: tabParam,
					className: "mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "one",
								children: "Add one"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "paste",
								children: "Paste set"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "html",
								children: "HTML test"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "one",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Front" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											className: "min-h-24",
											value: question,
											onChange: (e) => setQuestion(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags / topic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: rule,
												onChange: (e) => setRule(e.target.value),
												placeholder: "Topic"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: tags,
												onChange: (e) => setTags(e.target.value),
												placeholder: "tags space-separated"
											})]
										})]
									}),
									type !== "numerical" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Options — tap letter for the answer" }), options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "icon",
												variant: correct === i ? "default" : "outline",
												onClick: () => setCorrect(i),
												children: String.fromCharCode(65 + i)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: opt,
												onChange: (e) => {
													const next = [...options];
													next[i] = e.target.value;
													setOptions(next);
												}
											})]
										}, i))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Back / explanation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											className: "min-h-20",
											value: explanation,
											onChange: (e) => setExplanation(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: saveOne,
										children: "Save"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "paste",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "min-h-56 font-mono text-[13px]",
									value: paste,
									onChange: (e) => setPaste(e.target.value),
									placeholder: "1. Question\nA) ...\nB) ...\nAnswer: A\nExplanation: ..."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: [parsed.questions.length, " questions detected"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-3",
									disabled: !parsed.questions.length,
									onClick: () => {
										addCards(deckId, parsed.questions);
										toast.success(`${parsed.questions.length} added`);
										setPaste("");
									},
									children: "Import into deck"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "html",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HtmlDropzone, { onImported: (id) => {
								if (id) navigate({
									to: "/overview/$deckId",
									params: { deckId: id }
								});
							} })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-4",
					onClick: () => void navigate({ to: "/" }),
					children: "Close"
				})
			]
		})
	});
}
//#endregion
export { AddNote as component };
