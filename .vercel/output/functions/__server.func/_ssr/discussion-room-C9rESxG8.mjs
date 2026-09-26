//#region node_modules/.nitro/vite/services/ssr/assets/discussion-room-C9rESxG8.js
var DISC_MODES = [
	"video",
	"audio",
	"chat",
	"hand"
];
function asDiscMode(raw) {
	return DISC_MODES.includes(raw) ? raw : "video";
}
function discModeLabel(mode) {
	if (mode === "audio") return "Audio call";
	if (mode === "chat") return "Audio chat";
	if (mode === "hand") return "Hand-raise";
	return "Video call";
}
function discModeHint(mode) {
	if (mode === "audio") return "Voice only. Camera stays off.";
	if (mode === "chat") return "Voice plus text. Camera stays off.";
	if (mode === "hand") return "Raise a hand to take the floor. Mic starts off.";
	return "Camera and mic. Chat, hands, and questions stay on.";
}
function allowsVideo(mode) {
	return mode === "video";
}
function asDiscKind(raw) {
	return raw === "question" ? "question" : "chat";
}
function waitingConnect(players) {
	return players.filter((p) => !p.leftAt && !p.readyAt).length;
}
//#endregion
export { discModeHint as a, asDiscMode as i, allowsVideo as n, discModeLabel as o, asDiscKind as r, waitingConnect as s, DISC_MODES as t };
