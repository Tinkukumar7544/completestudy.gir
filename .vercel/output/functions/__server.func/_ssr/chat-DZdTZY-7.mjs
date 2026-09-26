import { r as createServerFn } from "./ssr.mjs";
import { G as createSsrRpc } from "./router-B0Z9kZGU2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-DZdTZY-7.js
function normalizeCode(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
var createChat = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "1-1 chat").trim().slice(0, 80) || "1-1 chat";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "You").trim().slice(0, 40) || "You";
	if (!hostId) throw new Error("Missing player");
	return {
		title,
		hostId,
		hostName
	};
}).handler(createSsrRpc("de0d3401d71676f2d18f61afb5b0ce9f38209d2c9e7edae2cfa6c3e90b2baac9"));
var joinChat = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId,
		name
	};
}).handler(createSsrRpc("1d0d4ebce5fb1f2bdda24db3a1d1a9d57bbf5bb574bad11219ad4632ddfc6a10"));
var listChat = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid room code");
	return v;
}).handler(createSsrRpc("92155fbd47ad964f895ca833a1254f27da7fb059cb45281df08f9bb6eb832815"));
var sendChat = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	const body = String(data.body || "").trim().slice(0, 8e3);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	if (!body) throw new Error("Type a message");
	return {
		code,
		playerId,
		name,
		body
	};
}).handler(createSsrRpc("9ba1a226f119be34034b134ce842f0e9ba22350d61d7855675b871bd063a13e7"));
//#endregion
export { sendChat as i, joinChat as n, listChat as r, createChat as t };
