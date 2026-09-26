import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ct as Bookmark, D as Plus, ct as EllipsisVertical, dt as Copy, f as Trash2, rt as FileUp, wt as BookmarkCheck } from "../_libs/lucide-react.mjs";
import { H as Button, W as cn, _ as importHtmlTest, a as DialogDescription, at as formatBytes, c as AnkiShell, d as DropdownMenuItem, f as DropdownMenuSeparator, i as DialogContent, l as DropdownMenu, nt as useExamStore, o as DialogHeader, p as DropdownMenuTrigger, r as Dialog, rt as copyHtmlFile, s as DialogTitle, u as DropdownMenuContent, ut as templateHtmlId, x as BUNDLED_TEMPLATE, y as replaceTemplateHtml } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/templates-CtB4qEPz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function patternHint(t) {
	const p = t.pattern;
	const timer = p.timerMode === "off" ? "No timer" : p.timerMode === "overall" ? "One timer" : "Section timers";
	const options = p.optionOrder === "shuffle" ? "Shuffled options" : p.optionOrder === "reverse" ? "Reversed options" : "Options as written";
	return `${p.sectionSize} Q per section · ${p.minutesPerQuestion} min/Q · ${timer} · ${options}`;
}
function TemplatesPage() {
	const navigate = useNavigate();
	const templates = useExamStore((s) => s.templates);
	const addTemplate = useExamStore((s) => s.addTemplate);
	const bookmarkTemplate = useExamStore((s) => s.bookmarkTemplate);
	const deleteTemplate = useExamStore((s) => s.deleteTemplate);
	const fileRef = (0, import_react.useRef)(null);
	const replaceRef = (0, import_react.useRef)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [replaceId, setReplaceId] = (0, import_react.useState)(null);
	const rows = templates ?? [];
	async function addUploaded(file) {
		if (!file) return;
		setBusy(true);
		const toastId = toast.loading(`Reading ${file.name}…`);
		try {
			const result = await importHtmlTest(file, (hint) => toast.loading(hint, { id: toastId }));
			toast.dismiss(toastId);
			if (result.template && result.templateId) {
				toast.success(result.questions ? `Saved two templates. ${result.questions} questions added as a test.` : `Saved two templates (${result.sizeLabel}): original paper and TCS iON.`);
				setAddOpen(false);
				navigate({
					to: "/templates/$templateId",
					params: { templateId: result.templateId }
				});
				return;
			}
			if (result.questions) toast.success(`${result.questions} questions from ${result.title}. No paper layout to copy.`);
		} catch (err) {
			toast.dismiss(toastId);
			toast.error(err instanceof Error ? err.message : "Could not read this HTML file");
		} finally {
			setBusy(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	async function replaceFile(file) {
		const id = replaceId;
		setReplaceId(null);
		if (!file || !id) return;
		setBusy(true);
		const toastId = toast.loading(`Replacing ${file.name}…`);
		try {
			const result = await replaceTemplateHtml(id, file, (hint) => toast.loading(hint, { id: toastId }));
			toast.dismiss(toastId);
			toast.success(`Replaced HTML for this template (${result.sizeLabel}). Other templates are unchanged.`);
		} catch (err) {
			toast.dismiss(toastId);
			toast.error(err instanceof Error ? err.message : "Could not replace this template");
		} finally {
			setBusy(false);
			if (replaceRef.current) replaceRef.current.value = "";
		}
	}
	async function duplicate(src) {
		const id = addTemplate({
			name: `${src.name} copy`,
			kind: src.kind,
			fileName: src.fileName,
			size: src.size,
			pattern: src.pattern,
			bookmark: false
		});
		if (src.kind === "uploaded") await copyHtmlFile(templateHtmlId(src.id), templateHtmlId(id));
		toast.success("Copy added. The active template is unchanged.");
		navigate({
			to: "/templates/$templateId",
			params: { templateId: id }
		});
	}
	function addBundled() {
		const id = addTemplate({
			name: "TCS iON",
			kind: "bundled",
			fileName: "tcs-ion-template.html",
			size: BUNDLED_TEMPLATE.length,
			bookmark: false
		});
		setAddOpen(false);
		toast.success("TCS iON paper added. Bookmark it to use it.");
		navigate({
			to: "/templates/$templateId",
			params: { templateId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Exam templates",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pt-4 text-sm text-muted-foreground",
				children: "Bookmark the template used for study. Inactive templates stay as they are — adding or replacing one never overwrites the rest."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 p-4 pb-36",
				children: rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-3d flex items-stretch gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left",
						onClick: () => void navigate({
							to: "/templates/$templateId",
							params: { templateId: t.id }
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("grid size-11 shrink-0 place-items-center rounded-xl", t.bookmarked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
							children: t.bookmarked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-medium",
										children: t.name
									}), t.bookmarked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
										children: "Active"
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block truncate text-xs text-muted-foreground",
									children: patternHint(t)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block truncate text-xs text-muted-foreground",
									children: [t.kind === "bundled" ? "TCS iON paper" : t.fileName || "Uploaded HTML", t.size > 0 ? ` · ${formatBytes(t.size)}` : t.kind === "bundled" ? ` · ${formatBytes(BUNDLED_TEMPLATE.length)}` : ""]
								}),
								t.lastResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-review",
											children: t.lastResult.correct
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: " correct · "
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-learn",
											children: t.lastResult.wrong
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												" ",
												"wrong",
												t.lastResult.deckName ? ` · ${t.lastResult.deckName}` : ""
											]
										})
									]
								}) : null
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-center pr-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							"aria-label": t.bookmarked ? "Active template" : "Bookmark as active",
							onClick: () => {
								bookmarkTemplate(t.id);
								toast.success(`${t.name} is the active template`);
							},
							children: t.bookmarked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								"aria-label": `More for ${t.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => void navigate({
										to: "/templates/$templateId",
										params: { templateId: t.id }
									}),
									children: "Edit pattern"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => {
										bookmarkTemplate(t.id);
										toast.success(`${t.name} is the active template`);
									},
									children: t.bookmarked ? "Already active" : "Bookmark as active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										setReplaceId(t.id);
										replaceRef.current?.click();
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), " Replace HTML"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => void duplicate(t),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Duplicate"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										deleteTemplate(t.id);
										toast.success("Template removed. Others are unchanged.");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete"]
								})
							]
						})] })]
					})]
				}) }, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: ".html,.htm,text/html",
				className: "sr-only",
				"aria-label": "Upload exam template HTML",
				onChange: (e) => void addUploaded(e.target.files?.[0])
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: replaceRef,
				type: "file",
				accept: ".html,.htm,text/html",
				className: "sr-only",
				"aria-label": "Replace template HTML",
				onChange: (e) => void replaceFile(e.target.files?.[0])
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "icon",
				className: "fixed right-5 bottom-28 z-30 size-14 rounded-full shadow-btn",
				"aria-label": "Add template",
				disabled: busy,
				onClick: () => setAddOpen(true),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add exam template" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Each template keeps its own paper, pattern, and HTML. Bookmark one to use it in study." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: addBundled,
							disabled: busy,
							children: "Add TCS iON paper"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							disabled: busy,
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), "Upload HTML template"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Any TCS iON or practice-test HTML works. Questions are left out — only the paper layout is stored. Bookmark it so later tests use that structure."
						})
					]
				})] })
			})
		]
	});
}
//#endregion
export { TemplatesPage as component };
