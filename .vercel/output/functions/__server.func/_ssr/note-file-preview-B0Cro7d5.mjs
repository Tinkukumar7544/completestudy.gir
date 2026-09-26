import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { M as Music, Y as Image, _t as ChevronRight, at as FileCode, it as FileText, nt as File$1, t as X, tt as Film, v as Share2, vt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { H as Button, Q as getNoteFile, W as cn, a as DialogDescription, at as formatBytes, i as DialogContent, r as Dialog, s as DialogTitle } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/note-file-preview-B0Cro7d5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	image: Image,
	video: Film,
	audio: Music,
	pdf: FileText,
	html: FileCode,
	doc: FileText,
	other: File$1
};
var APP_NAME = {
	image: "Photos",
	video: "Videos",
	audio: "Music",
	pdf: "PDF",
	html: "Page",
	text: "Document",
	file: "Files"
};
var TEXT_EXTS = /* @__PURE__ */ new Set([
	"txt",
	"md",
	"csv",
	"json",
	"xml",
	"log",
	"svg"
]);
function FileKindIcon({ kind, className }) {
	const Icon = ICONS[kind] ?? File$1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-5", className) });
}
function fileExt(name) {
	return (name.split(".").pop() || "").toLowerCase();
}
function viewerMode(file) {
	if (file.kind === "image") return "image";
	if (file.kind === "video") return "video";
	if (file.kind === "audio") return "audio";
	if (file.kind === "pdf") return "pdf";
	if (file.kind === "html") return "html";
	const ext = fileExt(file.name);
	const mime = (file.mime || "").toLowerCase();
	if (mime.startsWith("text/") || mime === "application/json" || TEXT_EXTS.has(ext)) return "text";
	return "file";
}
function kindLabel(file) {
	return APP_NAME[viewerMode(file)];
}
async function openWithDevice(file, blob) {
	const data = blob ?? await getNoteFile(file.id).then((row) => row?.blob ?? null);
	if (!data) {
		toast.error("File is not on this device");
		return;
	}
	const native = new File([data], file.name, { type: file.mime || data.type || "application/octet-stream" });
	try {
		if (navigator.canShare?.({ files: [native] })) {
			await navigator.share({
				files: [native],
				title: file.name
			});
			return;
		}
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") return;
	}
	const url = URL.createObjectURL(data);
	const a = document.createElement("a");
	a.href = url;
	a.download = file.name;
	a.rel = "noopener";
	a.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 3e4);
	toast.success("Saved. Open it with an app on this device.");
}
function NoteFilePreview({ file }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFileRow, {
		file,
		onOpen: () => setOpen(true)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFileViewer, {
		files: [file],
		open,
		onOpenChange: setOpen
	})] });
}
function NoteFileRow({ file, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-note-file": file.id,
		className: "surface-3d flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left",
		"aria-label": `Open ${file.name}`,
		onClick: (e) => {
			e.stopPropagation();
			onOpen();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileKindIcon, {
			kind: file.kind,
			className: "size-5 shrink-0 text-primary"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm font-medium",
				children: file.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					kindLabel(file),
					" · ",
					formatBytes(file.size)
				]
			})]
		})]
	});
}
function NoteFileViewer({ files, index = 0, open, onOpenChange }) {
	const [i, setI] = (0, import_react.useState)(index);
	(0, import_react.useEffect)(() => {
		if (open) setI(Math.min(Math.max(0, index), Math.max(0, files.length - 1)));
	}, [
		open,
		index,
		files
	]);
	const file = files[i] ?? null;
	const mode = file ? viewerMode(file) : "file";
	const [url, setUrl] = (0, import_react.useState)(null);
	const [blob, setBlob] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)(null);
	const [textReady, setTextReady] = (0, import_react.useState)(false);
	const [broken, setBroken] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open || !file) {
			setUrl(null);
			setBlob(null);
			setMissing(false);
			setLoading(false);
			setText(null);
			setTextReady(false);
			setBroken(false);
			return;
		}
		let alive = true;
		let objectUrl = null;
		setUrl(null);
		setBlob(null);
		setMissing(false);
		setLoading(true);
		setText(null);
		setTextReady(false);
		setBroken(false);
		getNoteFile(file.id).then((stored) => {
			if (!alive) return;
			if (!stored) {
				setMissing(true);
				setLoading(false);
				return;
			}
			objectUrl = URL.createObjectURL(stored.blob);
			setUrl(objectUrl);
			setBlob(stored.blob);
			setLoading(false);
		});
		return () => {
			alive = false;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [open, file]);
	(0, import_react.useEffect)(() => {
		if (!blob || mode !== "text") {
			setText(null);
			setTextReady(false);
			return;
		}
		if (blob.size > 2e6) {
			setText(null);
			setTextReady(true);
			return;
		}
		let alive = true;
		setTextReady(false);
		blob.text().then((value) => {
			if (alive) {
				setText(value);
				setTextReady(true);
			}
		});
		return () => {
			alive = false;
		};
	}, [blob, mode]);
	const media = mode === "image" || mode === "video" || mode === "audio";
	const many = files.length > 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			showClose: false,
			"aria-describedby": void 0,
			className: cn("top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 shadow-none", media ? "bg-bar text-bar-foreground" : "bg-background text-foreground"),
			children: file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex h-14 shrink-0 items-center gap-1 px-1", media ? "bg-bar text-bar-foreground" : "border-b border-border bg-card text-card-foreground"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							className: media ? "text-bar-foreground hover:bg-bar-foreground/10" : void 0,
							"aria-label": "Close",
							onClick: () => onOpenChange(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "truncate text-sm font-medium",
								children: file.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: cn("truncate text-xs", media ? "text-bar-foreground/70" : "text-muted-foreground"),
								children: kindLabel(file)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							className: media ? "text-bar-foreground hover:bg-bar-foreground/10" : void 0,
							"aria-label": "Open with a device app",
							"data-open-with-device": "true",
							disabled: loading || missing,
							onClick: () => void openWithDevice(file, blob),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-file-viewer": file.kind,
					className: "relative min-h-0 flex-1",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "grid h-full place-items-center text-sm opacity-80",
						children: "Opening…"
					}) : missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "grid h-full place-items-center px-6 text-center text-sm opacity-80",
						children: "File is not on this device. Names sync; the file itself stays where it was added."
					}) : !url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "grid h-full place-items-center text-sm opacity-80",
						children: "Could not open this file."
					}) : mode === "image" && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: file.name,
							className: "max-h-full max-w-full object-contain",
							onError: () => setBroken(true)
						})
					}) : mode === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid h-full place-items-center gap-3 px-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "This photo needs an app on your device."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void openWithDevice(file, blob),
							children: "Open with a device app"
						})]
					}) : mode === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center bg-bar p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: url,
							controls: true,
							autoPlay: true,
							playsInline: true,
							className: "max-h-full w-full"
						})
					}) : mode === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid h-full max-w-md content-center gap-6 px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-10" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-center text-base font-medium",
								children: file.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
								src: url,
								controls: true,
								autoPlay: true,
								className: "w-full"
							})
						]
					}) : mode === "pdf" || mode === "html" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: url,
						title: file.name,
						className: "h-full w-full bg-card"
					}) : mode === "text" && !textReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "grid h-full place-items-center text-sm opacity-80",
						children: "Opening…"
					}) : mode === "text" && text != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "h-full overflow-auto whitespace-pre-wrap break-words bg-card p-4 text-sm leading-relaxed text-card-foreground",
						children: text
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid h-full max-w-sm content-center gap-4 px-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileKindIcon, {
								kind: file.kind,
								className: "mx-auto size-12 text-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: file.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: formatBytes(file.size)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "This file opens with an app on your phone — PDF reader, gallery, video, or documents."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => void openWithDevice(file, blob),
								children: "Open with a device app"
							})
						]
					})
				}),
				many ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex h-14 shrink-0 items-center justify-between px-2", media ? "bg-bar" : "border-t border-border bg-card"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							disabled: i === 0,
							className: media ? "text-bar-foreground hover:bg-bar-foreground/10" : void 0,
							onClick: () => setI((n) => Math.max(0, n - 1)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" }), "Previous"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs opacity-80",
							children: [
								i + 1,
								" / ",
								files.length
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							disabled: i >= files.length - 1,
							className: media ? "text-bar-foreground hover:bg-bar-foreground/10" : void 0,
							onClick: () => setI((n) => Math.min(files.length - 1, n + 1)),
							children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex h-16 shrink-0 items-center justify-center px-4 pb-2", media ? "bg-bar" : "border-t border-border bg-card"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: media ? "secondary" : "outline",
						className: "w-full max-w-sm",
						"data-open-with-device-bar": "true",
						disabled: loading || missing,
						onClick: () => void openWithDevice(file, blob),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Open with a device app"]
					})
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "File"
			})
		})
	});
}
//#endregion
export { NoteFilePreview as n, NoteFileViewer as r, FileKindIcon as t };
