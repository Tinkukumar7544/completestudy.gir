import { r as createServerFn } from "./ssr.mjs";
import { G as createSsrRpc } from "./router-B0Z9kZGU2.mjs";
import { i as asDiscMode, r as asDiscKind } from "./discussion-room-C9rESxG8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discussion-BiZJVwBc.js
function normalizeCode(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
var createDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "You").trim().slice(0, 40) || "You";
	const title = String(data.title || "").trim().slice(0, 80);
	const prompt = String(data.prompt || "").trim().slice(0, 600);
	const mode = asDiscMode(data.mode);
	if (!hostId) throw new Error("Missing player");
	if (!title) throw new Error("Give the topic a title");
	return {
		hostId,
		hostName,
		title,
		prompt,
		mode
	};
}).handler(createSsrRpc("6ef1923e1a8bc068a04f8d4153573aa96954cde15d41eb75680ee675fe62c715"));
var joinDiscussion = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(createSsrRpc("f2dc5701ea5a91963fe522a4e9139c72f3de2555a0c5e1187d32cb2643a49c57"));
var listDiscussion = createServerFn({ method: "GET" }).validator((data) => {
	if (typeof data === "string") {
		const code = normalizeCode(data);
		if (code.length < 4) throw new Error("Enter a valid room code");
		return {
			code,
			playerId: ""
		};
	}
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	return {
		code,
		playerId
	};
}).handler(createSsrRpc("217a9f815342fb7ab70c923f19be6f97232ba6c88530ce1d62ac0b6038170b77"));
var readyDiscussion = createServerFn({ method: "POST" }).validator((data) => {
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
}).handler(createSsrRpc("ccfd23e09591fc84200e84c3de4f6e1cc924a9d67b0ad87757c77dbb84c2adab"));
var sendDiscussionChat = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Friend").trim().slice(0, 40) || "Friend";
	const body = String(data.body || "").trim().slice(0, 400);
	const kind = asDiscKind(data.kind);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	if (!body) throw new Error("Write a message");
	return {
		code,
		playerId,
		name,
		body,
		kind
	};
}).handler(createSsrRpc("e41416aea670b5804f8a4484452ad49f79250bf674a67fc2d7adcaae8cd81d2f"));
var raiseDiscussionHand = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId,
		on: Boolean(data.on)
	};
}).handler(createSsrRpc("8ac760beac63927f974c2fdc38f633b6507af7c82d9cddde918607671a04a32a"));
var leaveDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId
	};
}).handler(createSsrRpc("aed36f9d23b858f9c41305bcbe7e3a87743fc8a0fdcc48c6958ce4e68b9d7aef"));
var endDiscussion = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid room code");
	if (!playerId) throw new Error("Missing player");
	return {
		code,
		playerId
	};
}).handler(createSsrRpc("0b8b267680df959d800acfb35f7331fceddc43563a68c337a7f4526ad68c23a8"));
//#endregion
export { listDiscussion as a, sendDiscussionChat as c, leaveDiscussion as i, endDiscussion as n, raiseDiscussionHand as o, joinDiscussion as r, readyDiscussion as s, createDiscussion as t };
