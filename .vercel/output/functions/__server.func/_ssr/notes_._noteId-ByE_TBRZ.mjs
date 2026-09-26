import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as defaultExamPath, x as normalizeExamPath } from "./types-XZVWHhWz.mjs";
import { b as Route$7 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as Trash2, rt as FileUp } from "../_libs/lucide-react.mjs";
import { $ as persistBrowserFile, H as Button, V as Input, c as AnkiShell, nt as useExamStore, q as deleteNoteFile } from "./router-B0Z9kZGU2.mjs";
import { t as Textarea } from "./textarea-BI7oN-Xh.mjs";
import { n as NoteFilePreview } from "./note-file-preview-B0Cro7d5.mjs";
import { d as noteReadPercent, i as bumpNoteRead } from "./exam-path-CegkKdrh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notes_._noteId-ByE_TBRZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NoteEditor() {
	const { noteId } = Route$7.useParams();
	const navigate = useNavigate();
	const hydrated = useExamStore((s) => s.hydrated);
	const note = useExamStore((s) => (s.notes ?? []).find((n) => n.id === noteId));
	const updateNote = useExamStore((s) => s.updateNote);
	const deleteNote = useExamStore((s) => s.deleteNote);
	const updatePath = useExamStore((s) => s.updatePath);
	const path = normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath());
	const onPath = path.intake.completed && path.nodes.some((n) => n.noteId === noteId);
	const readPct = noteReadPercent(path, noteId);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const folder = note?.folderId ?? "";
	(0, import_react.useEffect)(() => {
		const current = useExamStore.getState().notes.find((n) => n.id === noteId);
		if (current) {
			setTitle(current.title);
			setBody(current.body);
		}
	}, [noteId, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (!note) navigate({
			to: "/notes",
			search: {
				view: "list",
				folder
			}
		});
	}, [
		hydrated,
		note,
		navigate,
		folder
	]);
	(0, import_react.useEffect)(() => {
		if (!note) return;
		const timer = window.setTimeout(() => {
			if (title !== note.title || body !== note.body) updateNote(note.id, {
				title,
				body
			});
		}, 350);
		return () => window.clearTimeout(timer);
	}, [
		title,
		body,
		note,
		updateNote
	]);
	(0, import_react.useEffect)(() => {
		if (!onPath || !noteId) return;
		const timer = window.setInterval(() => {
			useExamStore.getState().updatePath((p) => bumpNoteRead(p, noteId, 8, useExamStore.getState().prefs.dayStartHour));
		}, 4e3);
		return () => window.clearInterval(timer);
	}, [onPath, noteId]);
	function flush() {
		const current = useExamStore.getState().notes.find((n) => n.id === noteId);
		if (!current) return;
		if (title !== current.title || body !== current.body) updateNote(current.id, {
			title,
			body
		});
	}
	function back() {
		flush();
		navigate({
			to: "/notes",
			search: {
				view: "list",
				folder: note?.folderId ?? ""
			}
		});
	}
	async function attach(list) {
		if (!note || !list || !list.length) return;
		const files = Array.from(list).slice(0, 20);
		setBusy(true);
		const toastId = toast.loading(`Attaching ${files.length} file${files.length === 1 ? "" : "s"}…`);
		try {
			const added = [];
			for (const file of files) added.push(await persistBrowserFile(file));
			updateNote(note.id, { files: [...note.files ?? [], ...added] });
			toast.success(added.length === 1 ? `${added[0]?.name} attached` : `${added.length} files attached`);
		} catch {
			toast.error("Could not attach these files");
		} finally {
			toast.dismiss(toastId);
			setBusy(false);
		}
	}
	if (!hydrated || !note) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Note",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-4 text-sm text-muted-foreground",
			children: "Loading…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Note",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-lg gap-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					multiple: true,
					className: "hidden",
					"aria-label": "Attach files",
					onChange: (e) => {
						attach(e.target.files);
						e.target.value = "";
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Title",
					"aria-label": "Note title",
					className: "h-12 text-base"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Write the note…",
					"aria-label": "Note body",
					className: "min-h-48"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Files"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							disabled: busy,
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), "Add files"]
						})]
					}), (note.files ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Tap Add files to attach photos, video, PDF, HTML, audio, or any document."
					}) : (note.files ?? []).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFilePreview, { file }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							className: "justify-start text-destructive",
							onClick: () => {
								deleteNoteFile(file.id).catch(() => void 0);
								updateNote(note.id, { files: (note.files ?? []).filter((f) => f.id !== file.id) });
							},
							children: ["Remove ", file.name]
						})]
					}, file.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Text and folder names sync with your account. File contents stay on this device."
				}),
				onPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: ["On the target path · read ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums font-medium",
						children: [readPct, "%"]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: back,
							children: "Back"
						}),
						onPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => {
								updatePath((p) => bumpNoteRead(p, noteId, 100, useExamStore.getState().prefs.dayStartHour));
								toast.success("Marked as read on the path");
							},
							children: "Mark as read"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							onClick: () => {
								deleteNote(note.id);
								toast.success("Note deleted");
								back();
							},
							"aria-label": "Delete note",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { NoteEditor as component };
