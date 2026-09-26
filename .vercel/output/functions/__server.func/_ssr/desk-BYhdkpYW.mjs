import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as Route$21 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as Monitor, _t as ChevronRight, h as Smartphone } from "../_libs/lucide-react.mjs";
import { H as Button, J as descendantFolderIds, W as cn, at as formatBytes, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
import { r as NoteFileViewer, t as FileKindIcon } from "./note-file-preview-B0Cro7d5.mjs";
import { n as importBrowserDirectory, t as DirectoryInput } from "./folder-import-CkC_ovFv.mjs";
import { t as Glyph3D } from "./glyphs-CX9tzrUD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-BYhdkpYW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeskPage() {
	const { folder: folderParam, from } = Route$21.useSearch();
	const navigate = useNavigate();
	const folders = useExamStore((s) => s.folders ?? []);
	const notes = useExamStore((s) => s.notes ?? []);
	const links = useExamStore((s) => s.links ?? []);
	const phoneRef = (0, import_react.useRef)(null);
	const deskRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [viewer, setViewer] = (0, import_react.useState)(null);
	const linkedIds = (0, import_react.useMemo)(() => {
		const ids = /* @__PURE__ */ new Set();
		for (const link of links) if ((link.kind === "phone" || link.kind === "desk") && link.folderId) ids.add(link.folderId);
		return ids;
	}, [links]);
	const current = folders.find((f) => f.id === folderParam) ?? null;
	const currentId = current?.id ?? null;
	const childFolders = (0, import_react.useMemo)(() => {
		if (currentId) return folders.filter((f) => (f.parentId ?? null) === currentId).sort((a, b) => a.name.localeCompare(b.name));
		return folders.filter((f) => linkedIds.has(f.id) || f.source === "phone" || f.source === "desk").filter((f) => !f.parentId || !linkedIds.has(f.parentId)).sort((a, b) => a.name.localeCompare(b.name));
	}, [
		folders,
		currentId,
		linkedIds
	]);
	const childNotes = (0, import_react.useMemo)(() => {
		if (!currentId) return [];
		return notes.filter((n) => (n.folderId ?? null) === currentId).sort((a, b) => b.modifiedAt - a.modifiedAt);
	}, [notes, currentId]);
	async function onDirectory(list, source) {
		if (!list?.length) return;
		setBusy(true);
		const toastId = toast.loading("Copying folder…");
		try {
			const result = await importBrowserDirectory(list, {
				source,
				parentId: currentId,
				onProgress: (hint) => toast.loading(hint, { id: toastId })
			});
			toast.success(`${result.files} files from ${result.name}`);
			navigate({
				to: "/desk",
				search: {
					folder: result.folderId,
					from
				}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not link that folder");
		} finally {
			toast.dismiss(toastId);
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: current?.name ?? "Desk",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryInput, {
				inputRef: phoneRef,
				onFiles: (files) => void onDirectory(files, "phone")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryInput, {
				inputRef: deskRef,
				onFiles: (files) => void onDirectory(files, "desk")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-md p-4 pb-36",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Phone and computer folders copy into this app so every file type opens here. The device itself is not browsed live."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-11 flex-1",
							disabled: busy,
							onClick: () => phoneRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4" }), " Phone folder"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-11 flex-1",
							disabled: busy,
							onClick: () => deskRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-4" }), " Desk folder"]
						})]
					}),
					current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mt-4 flex items-center gap-1 text-sm text-primary",
						onClick: () => void navigate({
							to: "/desk",
							search: {
								folder: current.parentId ?? "",
								from
							}
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 rotate-180" }), current.parentId ? "Parent folder" : "All linked folders"]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 grid gap-2",
						children: [childFolders.map((folder) => {
							const nested = descendantFolderIds(folders, folder.id);
							const nCount = notes.filter((n) => n.folderId && nested.has(n.folderId)).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "surface-3d lift flex min-h-16 w-full items-center gap-3 px-3 text-left",
								onClick: () => void navigate({
									to: "/desk",
									search: {
										folder: folder.id,
										from
									}
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph3D, {
									name: "folder",
									alt: "",
									size: "md"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-semibold",
										children: folder.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [folder.source === "phone" ? "Phone" : folder.source === "desk" ? "Desk" : "Folder", nCount ? ` · ${nCount} files` : ""]
									})]
								})]
							}) }, folder.id);
						}), childNotes.map((note) => {
							const file = (note.files ?? [])[0];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "surface-3d lift overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex min-h-16 w-full items-center gap-3 px-3 text-left",
									onClick: () => {
										if (note.files?.length) setViewer({
											files: note.files,
											index: 0
										});
									},
									children: [file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-12 place-items-center rounded-xl bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileKindIcon, {
											kind: file.kind,
											className: "size-5 text-primary"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph3D, {
										name: "note",
										alt: "",
										size: "md"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-semibold",
											children: note.title
										}), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												file.kind,
												" · ",
												formatBytes(file.size)
											]
										}) : null]
									})]
								})
							}, note.id);
						})]
					}),
					!childFolders.length && !childNotes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-10 text-center text-sm text-muted-foreground",
						children: "Link a phone or computer folder to open it here like a file manager."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: cn("mt-4 h-11 w-full"),
						onClick: () => void navigate({ to: from === "notes" ? "/notes" : "/" }),
						children: ["Back to ", from === "notes" ? "Notes" : "Tests"]
					})
				]
			}),
			viewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFileViewer, {
				files: viewer.files,
				index: viewer.index,
				open: true,
				onOpenChange: (open) => {
					if (!open) setViewer(null);
				}
			}) : null
		]
	});
}
//#endregion
export { DeskPage as component };
