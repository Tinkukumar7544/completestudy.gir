import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as persistBrowserFile, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/folder-import-CkC_ovFv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DirectoryInput({ inputRef, onFiles }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref: inputRef,
		type: "file",
		className: "sr-only",
		multiple: true,
		"aria-hidden": "true",
		tabIndex: -1,
		webkitdirectory: "",
		directory: "",
		onChange: (e) => {
			onFiles(e.target.files);
			e.target.value = "";
		}
	});
}
async function importBrowserDirectory(files, opts) {
	const list = Array.from(files).filter((f) => f && f.size >= 0);
	if (!list.length) throw new Error("That folder is empty.");
	const rootName = (list[0].webkitRelativePath || list[0].name).split("/")[0] || opts.source;
	const rootId = useExamStore.getState().createFolder(rootName, opts.parentId ?? null, opts.source);
	if (!rootId) throw new Error("Could not create that folder.");
	const pathToId = /* @__PURE__ */ new Map([[rootName, rootId]]);
	const ensurePath = (dirPath) => {
		if (pathToId.has(dirPath)) return pathToId.get(dirPath);
		const parts = dirPath.split("/").filter(Boolean);
		let cur = "";
		let parent = opts.parentId ?? null;
		for (const part of parts) {
			cur = cur ? `${cur}/${part}` : part;
			if (!pathToId.has(cur)) {
				const id = useExamStore.getState().createFolder(part, parent, opts.source);
				pathToId.set(cur, id);
				parent = id;
			} else parent = pathToId.get(cur);
		}
		return pathToId.get(dirPath) ?? rootId;
	};
	let saved = 0;
	for (const file of list) {
		const parts = (file.webkitRelativePath || file.name).replace(/\\/g, "/").split("/").filter(Boolean);
		const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : rootName;
		opts.onProgress?.(`Saving ${file.name}…`);
		const folderId = ensurePath(dir);
		const meta = await persistBrowserFile(file);
		useExamStore.getState().addNote(file.name, "", folderId, [meta]);
		saved += 1;
	}
	useExamStore.getState().addLink({
		kind: opts.source,
		name: rootName,
		folderId: rootId
	});
	return {
		folderId: rootId,
		files: saved,
		name: rootName
	};
}
//#endregion
export { importBrowserDirectory as n, DirectoryInput as t };
