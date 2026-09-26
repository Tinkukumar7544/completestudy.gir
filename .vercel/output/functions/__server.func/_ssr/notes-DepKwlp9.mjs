import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as Route$16 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as FolderPlus, D as Plus, H as Mail, P as Monitor, Tt as BookOpen, _t as ChevronRight, ct as EllipsisVertical, h as Smartphone, m as StickyNote, pt as ClipboardPaste, rt as FileUp } from "../_libs/lucide-react.mjs";
import { $ as persistBrowserFile, H as Button, J as descendantFolderIds, V as Input, W as cn, X as folderDepth, a as DialogDescription, at as formatBytes, c as AnkiShell, d as DropdownMenuItem, f as DropdownMenuSeparator, i as DialogContent, l as DropdownMenu, nt as useExamStore, o as DialogHeader, p as DropdownMenuTrigger, r as Dialog, s as DialogTitle, u as DropdownMenuContent } from "./router-B0Z9kZGU2.mjs";
import { n as NoteFilePreview, r as NoteFileViewer, t as FileKindIcon } from "./note-file-preview-B0Cro7d5.mjs";
import { a as setClip, n as getClip, t as clearClip } from "./clipboard-wrdOgXLB.mjs";
import { n as importBrowserDirectory, t as DirectoryInput } from "./folder-import-CkC_ovFv.mjs";
import { t as Glyph3D } from "./glyphs-CX9tzrUD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notes-DepKwlp9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotesPage() {
	const { view } = Route$16.useSearch();
	if (view === "study") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesStudy, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesList, {});
}
function folderPath(folders, id) {
	const path = [];
	let cur = id;
	const seen = /* @__PURE__ */ new Set();
	while (cur) {
		if (seen.has(cur)) break;
		seen.add(cur);
		const next = folders.find((f) => f.id === cur);
		if (!next) break;
		path.unshift(next);
		cur = next.parentId;
	}
	return path;
}
function NotesList() {
	const { folder: folderParam } = Route$16.useSearch();
	const navigate = useNavigate();
	const notes = useExamStore((s) => s.notes);
	const folders = useExamStore((s) => s.folders);
	const addNote = useExamStore((s) => s.addNote);
	const createFolder = useExamStore((s) => s.createFolder);
	const renameFolder = useExamStore((s) => s.renameFolder);
	const deleteFolder = useExamStore((s) => s.deleteFolder);
	const moveNote = useExamStore((s) => s.moveNote);
	const moveFolder = useExamStore((s) => s.moveFolder);
	const links = useExamStore((s) => s.links ?? []);
	const fileRef = (0, import_react.useRef)(null);
	const phoneRef = (0, import_react.useRef)(null);
	const deskRef = (0, import_react.useRef)(null);
	const [fab, setFab] = (0, import_react.useState)(false);
	const [folderOpen, setFolderOpen] = (0, import_react.useState)(false);
	const [folderName, setFolderName] = (0, import_react.useState)("");
	const [renameId, setRenameId] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [viewer, setViewer] = (0, import_react.useState)(null);
	const currentId = folderParam || null;
	const current = (folders ?? []).find((f) => f.id === currentId) ?? null;
	const crumbs = currentId ? folderPath(folders ?? [], currentId) : [];
	const childFolders = (0, import_react.useMemo)(() => (folders ?? []).filter((f) => (f.parentId ?? null) === currentId).slice().sort((a, b) => a.name.localeCompare(b.name)), [folders, currentId]);
	const childNotes = (0, import_react.useMemo)(() => (notes ?? []).filter((n) => (n.folderId ?? null) === currentId).slice().sort((a, b) => b.modifiedAt - a.modifiedAt), [notes, currentId]);
	const studyCount = (0, import_react.useMemo)(() => {
		if (!currentId) return (notes ?? []).length;
		const ids = descendantFolderIds(folders ?? [], currentId);
		return (notes ?? []).filter((n) => n.folderId && ids.has(n.folderId)).length;
	}, [
		notes,
		folders,
		currentId
	]);
	function goFolder(id) {
		navigate({
			to: "/notes",
			search: {
				view: "list",
				folder: id
			}
		});
	}
	function pasteHere() {
		const clip = getClip();
		if (!clip) {
			toast.message("Cut or copy first");
			return;
		}
		if (clip.kind === "note") {
			if (clip.action === "copy") {
				const src = (notes ?? []).find((n) => n.id === clip.id);
				if (src) addNote(src.title, src.body, currentId, src.files ?? []);
				toast.success("Copied here");
				return;
			}
			moveNote(clip.id, currentId);
			clearClip();
			toast.success("Moved");
			return;
		}
		if (clip.kind === "folder") {
			if (clip.action === "cut") {
				moveFolder(clip.id, currentId);
				clearClip();
			}
			toast.success("Moved");
		}
	}
	function createTextNote() {
		setFab(false);
		const id = addNote("Untitled", "", currentId);
		navigate({
			to: "/notes/$noteId",
			params: { noteId: id }
		});
	}
	async function onFiles(list, folderId = currentId) {
		if (!list || !("length" in list) || !list.length) return;
		const files = Array.from(list).slice(0, 40);
		setBusy(true);
		const toastId = toast.loading(`Saving ${files.length} file${files.length === 1 ? "" : "s"}…`);
		let ok = 0;
		try {
			for (const file of files) {
				const meta = await persistBrowserFile(file);
				addNote(file.name, "", folderId, [meta]);
				ok += 1;
			}
			toast.success(ok === 1 ? `${files[0]?.name} added` : `${ok} files added`);
		} catch {
			toast.error(ok ? `Saved ${ok}, then a file failed` : "Could not save these files");
		} finally {
			toast.dismiss(toastId);
			setBusy(false);
			setFab(false);
		}
	}
	function submitFolder() {
		const name = folderName.trim();
		if (!name) return;
		if (renameId) {
			renameFolder(renameId, name);
			setRenameId(null);
			setFolderName("");
			setFolderOpen(false);
			toast.success("Folder renamed");
			return;
		}
		if (currentId && folderDepth(folders ?? [], currentId) >= 8) {
			toast.error("This folder is nested as far as it can go");
			return;
		}
		if (!createFolder(name, currentId)) {
			toast.error("Could not create folder");
			return;
		}
		setFolderName("");
		setFolderOpen(false);
		toast.success(currentId ? "Subfolder created" : "Folder created");
	}
	const emailLinks = !currentId ? links.filter((l) => l.kind === "email") : [];
	const empty = childFolders.length === 0 && childNotes.length === 0 && emailLinks.length === 0;
	const folderLabel = currentId ? "New subfolder" : "New folder";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: current?.name ?? "Notes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				multiple: true,
				className: "sr-only",
				"data-notes-file-input": "true",
				"aria-hidden": "true",
				tabIndex: -1,
				onChange: (e) => {
					onFiles(e.target.files);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryInput, {
				inputRef: phoneRef,
				onFiles: (list) => {
					if (!list?.length) return;
					importBrowserDirectory(list, {
						source: "phone",
						parentId: currentId
					}).then((result) => toast.success(`${result.files} files from ${result.name}`)).catch((err) => toast.error(err instanceof Error ? err.message : "Could not link that folder"));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryInput, {
				inputRef: deskRef,
				onFiles: (list) => {
					if (!list?.length) return;
					importBrowserDirectory(list, {
						source: "desk",
						parentId: currentId
					}).then((result) => toast.success(`${result.files} files from ${result.name}`)).catch((err) => toast.error(err instanceof Error ? err.message : "Could not link that folder"));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 overflow-x-auto px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("shrink-0 rounded-sm px-1 text-sm", currentId ? "text-primary" : "font-medium"),
						onClick: () => void navigate({
							to: "/notes",
							search: {
								view: "list",
								folder: ""
							}
						}),
						children: "Notes"
					}),
					crumbs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("max-w-32 truncate rounded-sm px-1 text-sm", c.id === currentId ? "font-medium" : "text-primary"),
							onClick: () => goFolder(c.id),
							children: c.name
						})]
					}, c.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "ml-auto shrink-0",
						disabled: studyCount === 0,
						onClick: () => void navigate({
							to: "/notes",
							search: {
								view: "study",
								folder: currentId ?? ""
							}
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Study"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-72",
				children: empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-6 py-12 pb-40 text-center text-sm text-muted-foreground",
					children: currentId ? "This folder is empty. Tap + to add a note or files, or use the folder button for a subfolder." : "Tap + to add photos, video, PDFs, HTML, audio, or documents. Use the folder button for folders and subfolders."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "grid gap-3 px-4 pb-36",
					children: [
						!currentId ? links.filter((l) => l.kind === "email").map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "surface-3d lift flex min-h-16 w-full items-center gap-3 px-3 text-left",
							onClick: () => void navigate({
								to: "/mail",
								search: {
									from: "notes",
									label: link.remoteId ?? "",
									message: "",
									connector: "Gmail"
								}
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-base font-semibold",
									children: link.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Mail folder · live"
								})]
							})]
						}) }, link.id)) : null,
						childFolders.map((folder) => {
							const nested = descendantFolderIds(folders ?? [], folder.id);
							const nCount = (notes ?? []).filter((n) => n.folderId && nested.has(n.folderId)).length;
							const fCount = (folders ?? []).filter((f) => f.parentId === folder.id).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "surface-3d lift flex items-stretch overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex min-h-16 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left",
									onClick: () => goFolder(folder.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph3D, {
										name: fCount ? "folder-open" : "folder",
										alt: "",
										size: "md"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-base font-semibold tracking-tight",
											children: folder.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [fCount ? `${fCount} folder${fCount === 1 ? "" : "s"}` : "Folder", nCount ? ` · ${nCount} item${nCount === 1 ? "" : "s"}` : ""]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "flex h-16 w-10 items-center justify-center text-muted-foreground",
										"aria-label": `Folder actions for ${folder.name}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => goFolder(folder.id),
											children: "Open"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => {
												setClip({
													kind: "folder",
													action: "cut",
													id: folder.id
												});
												toast.success("Cut");
											},
											children: "Cut"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: pasteHere,
											children: "Paste here"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => {
												setRenameId(folder.id);
												setFolderName(folder.name);
												setFolderOpen(true);
											},
											children: "Rename"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											className: "text-destructive",
											onSelect: () => {
												deleteFolder(folder.id);
												toast.success("Folder deleted");
											},
											children: "Delete folder"
										})
									]
								})] })]
							}, folder.id);
						}),
						childNotes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteRow, {
							note,
							onOpenFiles: (files) => setViewer({
								files,
								index: 0
							})
						}, note.id))
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed right-4 bottom-28 z-20 flex flex-col items-end gap-3",
				children: [
					fab ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex flex-col items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "From email",
								onClick: () => {
									setFab(false);
									navigate({
										to: "/mail",
										search: {
											from: "notes",
											label: "",
											message: "",
											connector: "Gmail"
										}
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Phone folder",
								onClick: () => {
									setFab(false);
									phoneRef.current?.click();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Desk folder",
								onClick: () => {
									setFab(false);
									deskRef.current?.click();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Paste",
								onClick: () => {
									setFab(false);
									pasteHere();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Add files",
								onClick: () => {
									setFab(false);
									fileRef.current?.click();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "New note",
								onClick: createTextNote,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" })
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "secondary",
						className: "size-12 rounded-full shadow-raised",
						disabled: busy,
						"aria-label": folderLabel,
						onClick: () => {
							setRenameId(null);
							setFolderName("");
							setFolderOpen(true);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						className: "size-14 rounded-full shadow-btn",
						disabled: busy,
						onClick: () => setFab((v) => !v),
						"aria-label": "Add files or note",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: cn("size-7 transition-transform", fab && "rotate-45") })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: folderOpen,
				onOpenChange: (open) => {
					setFolderOpen(open);
					if (!open) setRenameId(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: renameId ? "Rename folder" : folderLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: renameId ? "The folder stays in the same place." : currentId ? `Created inside ${current?.name ?? "this folder"}.` : "Add subfolders later by opening a folder and tapping the folder button again." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: folderName,
						onChange: (e) => setFolderName(e.target.value),
						placeholder: "Folder name",
						"aria-label": "Folder name",
						onKeyDown: (e) => {
							if (e.key === "Enter") submitFolder();
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submitFolder,
						disabled: !folderName.trim(),
						children: renameId ? "Save" : "Create"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFileViewer, {
				files: viewer?.files ?? [],
				index: viewer?.index ?? 0,
				open: Boolean(viewer),
				onOpenChange: (open) => {
					if (!open) setViewer(null);
				}
			})
		]
	});
}
function NoteRow({ note, onOpenFiles }) {
	const navigate = useNavigate();
	const files = note.files ?? [];
	const file = files[0];
	const fileOnly = files.length > 0 && !note.body.trim();
	const extra = files.length > 1 ? ` +${files.length - 1}` : "";
	const snippet = note.body.trim() ? note.body.trim() : file ? `${file.name}${extra} · ${formatBytes(file.size)}` : "Empty note";
	function openNote() {
		navigate({
			to: "/notes/$noteId",
			params: { noteId: note.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "surface-3d lift flex items-stretch overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-h-16 min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left",
			onClick: () => {
				if (fileOnly) onOpenFiles(files);
				else openNote();
			},
			children: [file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-16 place-items-center rounded-xl bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileKindIcon, {
					kind: file.kind,
					className: "size-6 text-primary"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph3D, {
				name: "note",
				alt: "",
				size: "md"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-base font-semibold tracking-tight",
					children: note.title.trim() || "Untitled"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "line-clamp-1 text-xs text-muted-foreground",
					children: [
						snippet,
						" · ",
						new Date(note.modifiedAt).toLocaleDateString()
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex h-16 w-10 items-center justify-center text-muted-foreground",
				"aria-label": `Note actions for ${note.title.trim() || file?.name || "note"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			children: [
				fileOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => onOpenFiles(files),
					children: "Open file"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: openNote,
					children: fileOnly ? "Edit note" : "Open"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => {
						setClip({
							kind: "note",
							action: "cut",
							id: note.id
						});
						toast.success("Cut");
					},
					children: "Cut"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => {
						setClip({
							kind: "note",
							action: "copy",
							id: note.id
						});
						toast.success("Copied");
					},
					children: "Copy"
				})
			]
		})] })]
	});
}
function FabLabel({ label, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "flex items-center gap-3",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "surface-3d px-3 py-1.5 text-xs font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-11 items-center justify-center rounded-full bg-card text-primary shadow-raised",
			children
		})]
	});
}
function NotesStudy() {
	const { folder: folderParam } = Route$16.useSearch();
	const navigate = useNavigate();
	const notes = useExamStore((s) => s.notes);
	const folders = useExamStore((s) => s.folders);
	const rows = (0, import_react.useMemo)(() => {
		const all = notes ?? [];
		if (!folderParam) return all.slice().sort((a, b) => b.modifiedAt - a.modifiedAt);
		const ids = descendantFolderIds(folders ?? [], folderParam);
		return all.filter((n) => n.folderId && ids.has(n.folderId)).sort((a, b) => b.modifiedAt - a.modifiedAt);
	}, [
		notes,
		folders,
		folderParam
	]);
	const [i, setI] = (0, import_react.useState)(0);
	const [show, setShow] = (0, import_react.useState)(false);
	const note = rows[i];
	const back = {
		view: "list",
		folder: folderParam
	};
	if (!note) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Study notes",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-6 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No notes to study here."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void navigate({
					to: "/notes",
					search: back
				}),
				children: "Back to notes"
			})]
		})
	});
	const last = i >= rows.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Study notes",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-md gap-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						i + 1,
						" / ",
						rows.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-3d min-h-48 px-5 py-8 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "w-full text-left",
						onClick: () => setShow((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-medium",
							children: note.title.trim() || "Untitled"
						}), show ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-primary",
							children: "Tap to show the note"
						})]
					}), show ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground",
							children: note.body.trim() || ((note.files ?? []).length ? "" : "This note is empty.")
						}), (note.files ?? []).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFilePreview, { file }, file.id))]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: i === 0,
						onClick: () => {
							setI((n) => Math.max(0, n - 1));
							setShow(false);
						},
						children: "Previous"
					}), last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void navigate({
							to: "/notes",
							search: back
						}),
						children: "Done"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							setI((n) => Math.min(rows.length - 1, n + 1));
							setShow(false);
						},
						children: "Next"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => void navigate({
						to: "/notes/$noteId",
						params: { noteId: note.id }
					}),
					children: "Open this note"
				})
			]
		})
	});
}
//#endregion
export { NotesPage as component };
