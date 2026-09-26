//#region node_modules/.nitro/vite/services/ssr/assets/quiz-client-BuyieeJt.js
var ID_KEY = "setpaper-quiz-player";
var NAME_KEY = "setpaper-quiz-name";
function quizPlayerId() {
	if (typeof window === "undefined") return "ssr";
	try {
		let id = window.localStorage.getItem(ID_KEY);
		if (!id) {
			id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now().toString(36)}`;
			window.localStorage.setItem(ID_KEY, id);
		}
		return id;
	} catch {
		return `p-${Date.now().toString(36)}`;
	}
}
function rememberedQuizName() {
	if (typeof window === "undefined") return "";
	try {
		return window.localStorage.getItem(NAME_KEY) ?? "";
	} catch {
		return "";
	}
}
function rememberQuizName(name) {
	try {
		window.localStorage.setItem(NAME_KEY, name.trim().slice(0, 40));
	} catch {}
}
//#endregion
export { rememberQuizName as n, rememberedQuizName as r, quizPlayerId as t };
