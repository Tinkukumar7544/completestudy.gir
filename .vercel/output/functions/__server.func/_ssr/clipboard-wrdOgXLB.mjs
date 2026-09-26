//#region node_modules/.nitro/vite/services/ssr/assets/clipboard-wrdOgXLB.js
var KEY = "setpaper-clipboard-v1";
function setClip(clip) {
	try {
		sessionStorage.setItem(KEY, JSON.stringify(clip));
	} catch {}
}
function getClip() {
	try {
		const raw = sessionStorage.getItem(KEY);
		if (!raw) return null;
		const v = JSON.parse(raw);
		if (!v?.id || v.kind !== "deck" && v.kind !== "note" && v.kind !== "folder") return null;
		if (v.action !== "cut" && v.action !== "copy") return null;
		return {
			kind: v.kind,
			action: v.action,
			id: String(v.id)
		};
	} catch {
		return null;
	}
}
function clearClip() {
	try {
		sessionStorage.removeItem(KEY);
	} catch {}
}
var PAPER_KEY = "setpaper-paper-prefs";
function rememberPaperPrefs(prefs) {
	try {
		sessionStorage.setItem(PAPER_KEY, JSON.stringify(prefs));
	} catch {}
}
function rememberedPaperPrefs() {
	try {
		const raw = sessionStorage.getItem(PAPER_KEY);
		if (!raw) return null;
		const v = JSON.parse(raw);
		return {
			template: String(v.template ?? ""),
			minutes: Number.isFinite(Number(v.minutes)) ? Math.max(0, Math.floor(Number(v.minutes))) : 0
		};
	} catch {
		return null;
	}
}
//#endregion
export { setClip as a, rememberedPaperPrefs as i, getClip as n, rememberPaperPrefs as r, clearClip as t };
