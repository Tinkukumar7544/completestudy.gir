import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as Route$1 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ct as Bookmark, f as Trash2, rt as FileUp, wt as BookmarkCheck } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, V as Input, at as formatBytes, c as AnkiShell, n as Switch, nt as useExamStore, rt as copyHtmlFile, ut as templateHtmlId, x as BUNDLED_TEMPLATE, y as replaceTemplateHtml } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/templates_._templateId-APjHaweg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Group({ title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
		children: title
	});
}
function Row({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: title
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children
		})]
	});
}
function selectClass() {
	return "h-11 min-w-32 rounded-lg border border-border bg-card px-3 text-sm";
}
function TemplateEditor() {
	const { templateId } = Route$1.useParams();
	const navigate = useNavigate();
	const hydrated = useExamStore((s) => s.hydrated);
	const template = useExamStore((s) => (s.templates ?? []).find((t) => t.id === templateId));
	const updateTemplate = useExamStore((s) => s.updateTemplate);
	const updateTemplatePattern = useExamStore((s) => s.updateTemplatePattern);
	const bookmarkTemplate = useExamStore((s) => s.bookmarkTemplate);
	const addTemplate = useExamStore((s) => s.addTemplate);
	const deleteTemplate = useExamStore((s) => s.deleteTemplate);
	const replaceRef = (0, import_react.useRef)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const current = useExamStore.getState().templates.find((t) => t.id === templateId);
		if (current) setName(current.name);
	}, [templateId, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (!template) navigate({ to: "/templates" });
	}, [
		hydrated,
		template,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!template) return;
		const timer = window.setTimeout(() => {
			if (name.trim() && name !== template.name) updateTemplate(template.id, { name: name.trim() });
		}, 350);
		return () => window.clearTimeout(timer);
	}, [
		name,
		template,
		updateTemplate
	]);
	function flush() {
		const current = useExamStore.getState().templates.find((t) => t.id === templateId);
		if (!current) return;
		if (name.trim() && name !== current.name) updateTemplate(current.id, { name: name.trim() });
	}
	function back() {
		flush();
		navigate({ to: "/templates" });
	}
	async function onReplace(file) {
		if (!file || !template) return;
		setBusy(true);
		const toastId = toast.loading(`Replacing ${file.name}…`);
		try {
			const result = await replaceTemplateHtml(template.id, file, (hint) => toast.loading(hint, { id: toastId }));
			toast.dismiss(toastId);
			toast.success(`HTML replaced (${result.sizeLabel}). Pattern settings and other templates are unchanged.`);
		} catch (err) {
			toast.dismiss(toastId);
			toast.error(err instanceof Error ? err.message : "Could not replace this template");
		} finally {
			setBusy(false);
			if (replaceRef.current) replaceRef.current.value = "";
		}
	}
	async function duplicate() {
		if (!template) return;
		flush();
		const id = addTemplate({
			name: `${template.name} copy`,
			kind: template.kind,
			fileName: template.fileName,
			size: template.size,
			pattern: template.pattern,
			bookmark: false
		});
		if (template.kind === "uploaded") await copyHtmlFile(templateHtmlId(template.id), templateHtmlId(id));
		toast.success("Copy added. The active template is unchanged.");
		navigate({
			to: "/templates/$templateId",
			params: { templateId: id }
		});
	}
	if (!template) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Exam template",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-4 text-sm text-muted-foreground",
			children: "Loading template…"
		})
	});
	const p = template.pattern;
	const sizeLabel = template.kind === "bundled" ? formatBytes(BUNDLED_TEMPLATE.length) : template.size ? formatBytes(template.size) : "On this device";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: template.name || "Exam template",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-border bg-card px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: back,
						children: "Back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-sm text-muted-foreground",
						children: template.bookmarked ? "Active template" : "Inactive — stored unchanged"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: template.bookmarked ? "default" : "outline",
						size: "sm",
						"aria-label": template.bookmarked ? "Active template" : "Bookmark as active",
						onClick: () => {
							bookmarkTemplate(template.id);
							toast.success(`${template.name} is the active template`);
						},
						children: [template.bookmarked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), template.bookmarked ? "Bookmarked" : "Bookmark"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Template" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "template-name",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "template-name",
						className: "mt-2",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Template name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							template.kind === "bundled" ? "TCS iON paper" : template.fileName || "Uploaded HTML",
							" · ",
							sizeLabel
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								disabled: busy,
								onClick: () => replaceRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), "Replace HTML"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => void duplicate(),
								children: "Duplicate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => {
									deleteTemplate(template.id);
									toast.success("Template removed. Others are unchanged.");
									navigate({ to: "/templates" });
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: replaceRef,
						type: "file",
						accept: ".html,.htm,text/html",
						className: "sr-only",
						"aria-label": "Replace template HTML",
						onChange: (e) => void onReplace(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Replace only updates this template. Upload any HTML test — questions are stripped, the paper layout stays."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Saved results" }),
			template.lastResult || template.results && template.results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-b border-border bg-card",
				children: (template.results?.length ? template.results : template.lastResult ? [template.lastResult] : []).slice(0, 12).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
					onClick: () => void navigate({
						to: "/session/$deckId",
						params: { deckId: row.deckId },
						search: { id: row.sessionId }
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm",
							children: row.deckName || "Paper"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: new Date(row.at).toLocaleString(void 0, {
								dateStyle: "medium",
								timeStyle: "short"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 text-sm tabular-nums",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-review",
								children: row.correct
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["/", row.total]
							}),
							row.wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 font-medium text-learn",
								children: [row.wrong, " wrong"]
							}) : null
						]
					})]
				}) }, row.sessionId))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-border bg-card px-4 py-3 text-sm text-muted-foreground",
				children: "After a full paper, correct vs wrong stays on this template."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Paper pattern" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Questions per section",
				hint: "How the bank is split on the paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: selectClass(),
					value: p.sectionSize,
					onChange: (e) => updateTemplatePattern(template.id, { sectionSize: Number(e.target.value) }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: 10,
						children: "10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: 20,
						children: "20"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Minutes per question",
				hint: "Used to size each section timer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-24",
					type: "number",
					min: .5,
					step: .5,
					value: p.minutesPerQuestion,
					onChange: (e) => updateTemplatePattern(template.id, { minutesPerQuestion: Number(e.target.value) || 1 })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Extra minutes",
				hint: "Added on top of the computed duration",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-24",
					type: "number",
					min: 0,
					step: 1,
					value: p.extraMinutes,
					onChange: (e) => updateTemplatePattern(template.id, { extraMinutes: Math.max(0, Number(e.target.value) || 0) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Timer",
				hint: "Section-wise, one clock for the paper, or none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: selectClass(),
					value: p.timerMode,
					onChange: (e) => updateTemplatePattern(template.id, { timerMode: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "section",
							children: "Section timers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "overall",
							children: "One timer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "off",
							children: "No timer"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Show timer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: p.showTimer,
					onCheckedChange: (v) => updateTemplatePattern(template.id, { showTimer: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Options" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Option order",
				hint: "Rearrange A/B/C/D on the paper, not in the bank",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: selectClass(),
					value: p.optionOrder,
					onChange: (e) => updateTemplatePattern(template.id, { optionOrder: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "as-written",
							children: "As written"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "shuffle",
							children: "Shuffle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "reverse",
							children: "Reverse"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Participant" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "candidate-name",
					children: "Candidate name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "candidate-name",
					className: "mt-2",
					value: p.candidateName,
					onChange: (e) => updateTemplatePattern(template.id, { candidateName: e.target.value }),
					placeholder: "Shown on the paper"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "candidate-id",
					children: "Roll / ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "candidate-id",
					className: "mt-2",
					value: p.candidateId,
					onChange: (e) => updateTemplatePattern(template.id, { candidateId: e.target.value }),
					placeholder: "Optional"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "exam-title",
					children: "Exam title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "exam-title",
					className: "mt-2",
					value: p.examTitle,
					onChange: (e) => updateTemplatePattern(template.id, { examTitle: e.target.value }),
					placeholder: "Leave blank to use the deck name"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Paper functions" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Switch sections",
				hint: "Tap another section tab during the test",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: p.allowSectionSwitch,
					onCheckedChange: (v) => updateTemplatePattern(template.id, { allowSectionSwitch: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Mark for review",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: p.showMarkForReview,
					onCheckedChange: (v) => updateTemplatePattern(template.id, { showMarkForReview: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Clear response",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: p.showClear,
					onCheckedChange: (v) => updateTemplatePattern(template.id, { showClear: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Question palette",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: p.showPalette,
					onCheckedChange: (v) => updateTemplatePattern(template.id, { showPalette: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Submit section",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: p.showSubmitSection,
					onCheckedChange: (v) => updateTemplatePattern(template.id, { showSubmitSection: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-6 text-xs text-muted-foreground",
				children: "These controls apply the next time you start a test with this template bookmarked. Inactive templates keep their HTML and pattern as stored."
			})
		]
	});
}
//#endregion
export { TemplateEditor as component };
