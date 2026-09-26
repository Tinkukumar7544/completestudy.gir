import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { W as cn } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glyphs-CX9tzrUD.js
var import_jsx_runtime = require_jsx_runtime();
var SRC = {
	folder: "/glyphs/folder.png",
	"folder-open": "/glyphs/folder-open.png",
	deck: "/glyphs/deck.png",
	subdeck: "/glyphs/subdeck.png",
	note: "/glyphs/note.png"
};
function Glyph3D({ name, alt, className, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("glyph-stage inline-grid shrink-0 place-items-center overflow-hidden", size === "sm" && "size-10", size === "md" && "size-16", size === "lg" && "size-24", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: SRC[name],
			alt,
			className: "size-full object-contain",
			draggable: false
		})
	});
}
//#endregion
export { Glyph3D as t };
