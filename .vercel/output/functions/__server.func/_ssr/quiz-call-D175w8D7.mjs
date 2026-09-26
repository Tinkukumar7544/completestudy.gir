import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as PhoneOff, I as Mic, L as MicOff, a as Video, o as VideoOff, x as Send, z as MessageCircle } from "../_libs/lucide-react.mjs";
import { H as Button, V as Input, W as cn } from "./router-B0Z9kZGU2.mjs";
import { r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { l as sendQuizChat } from "./quiz-DNF-wQMz.mjs";
import { t as P2PRoom } from "./p2p-Dp9s0yIA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-call-D175w8D7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* P2P mesh for a live-test room. Identity is the quiz player id so a remount
* (paper ↔ lobby) can rejoin the same peer slot. Key the component on `code`.
*/
function rtcRoomId(code) {
	return `quiz-${code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24)}`.slice(0, 64);
}
function useQuizCall(opts) {
	const { code, selfId, name, enabled } = opts;
	const [peers, setPeers] = (0, import_react.useState)([]);
	const [joined, setJoined] = (0, import_react.useState)(false);
	const [remoteStreams, setRemoteStreams] = (0, import_react.useState)({});
	const [localStream, setLocalStreamState] = (0, import_react.useState)(null);
	const roomRef = (0, import_react.useRef)(null);
	const localRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!enabled || !code || !selfId || selfId === "ssr") return;
		const p2p = new P2PRoom({
			room: rtcRoomId(code),
			selfId: selfId.slice(0, 64),
			name,
			onPeersChanged: setPeers,
			onConnected: () => setJoined(true),
			onTrack: (from, stream) => {
				setRemoteStreams((cur) => ({
					...cur,
					[from]: stream
				}));
			}
		});
		roomRef.current = p2p;
		p2p.join();
		return () => {
			roomRef.current = null;
			p2p.close();
			setJoined(false);
			setPeers([]);
			setRemoteStreams({});
		};
	}, [
		code,
		selfId,
		name,
		enabled
	]);
	(0, import_react.useEffect)(() => {
		const alive = new Set(peers.map((p) => p.id));
		setRemoteStreams((cur) => {
			const next = {};
			for (const [id, stream] of Object.entries(cur)) if (alive.has(id)) next[id] = stream;
			return next;
		});
	}, [peers]);
	const stopLocal = (0, import_react.useCallback)(() => {
		localRef.current?.getTracks().forEach((t) => t.stop());
		localRef.current = null;
		setLocalStreamState(null);
		roomRef.current?.setLocalStream(null);
	}, []);
	return {
		peers,
		joined,
		remoteStreams,
		localStream,
		setMedia: (0, import_react.useCallback)(async (audio, video) => {
			if (!audio && !video) {
				stopLocal();
				return;
			}
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio,
					video: video ? { facingMode: "user" } : false
				});
				localRef.current?.getTracks().forEach((t) => t.stop());
				localRef.current = stream;
				setLocalStreamState(stream);
				roomRef.current?.setLocalStream(stream);
			} catch (err) {
				stopLocal();
				throw err;
			}
		}, [stopLocal]),
		endCall: stopLocal
	};
}
function QuizLiveBar({ code, name, messages, onRoom, compact = false }) {
	const me = quizPlayerId();
	const display = name.trim() || rememberedQuizName() || "You";
	const call = useQuizCall({
		code,
		selfId: me,
		name: display,
		enabled: Boolean(code && me && me !== "ssr")
	});
	const [mic, setMic] = (0, import_react.useState)(false);
	const [video, setVideo] = (0, import_react.useState)(false);
	const [chatOpen, setChatOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	const localVideo = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = localVideo.current;
		if (!el) return;
		el.srcObject = call.localStream;
	}, [call.localStream]);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages.length, chatOpen]);
	async function toggleMic() {
		const next = !mic;
		try {
			await call.setMedia(next, video);
			setMic(next);
		} catch {
			toast.error("Microphone permission is needed");
			setMic(false);
		}
	}
	async function toggleVideo() {
		const next = !video;
		try {
			await call.setMedia(mic || next, next);
			setVideo(next);
			if (next && !mic) setMic(true);
		} catch {
			toast.error("Camera permission is needed");
			setVideo(false);
		}
	}
	function endCall() {
		call.endCall();
		setMic(false);
		setVideo(false);
		toast.success("Call ended — chat is still open");
	}
	(0, import_react.useEffect)(() => {
		function onEnd() {
			call.endCall();
			setMic(false);
			setVideo(false);
			toast.success("Call ended — chat is still open");
		}
		window.addEventListener("setpaper-end-call", onEnd);
		return () => window.removeEventListener("setpaper-end-call", onEnd);
	}, [call.endCall]);
	async function send() {
		const body = draft.trim();
		if (!body) return;
		setSending(true);
		setDraft("");
		try {
			const next = await sendQuizChat({ data: {
				code,
				playerId: me,
				name: display,
				body
			} });
			onRoom?.(next);
		} catch (err) {
			setDraft(body);
			toast.error(err instanceof Error ? err.message : "Could not send");
		} finally {
			setSending(false);
		}
	}
	const tiles = Object.entries(call.remoteStreams);
	const controls = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap items-center gap-2", compact ? "justify-end" : "justify-center"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: chatOpen ? "default" : "outline",
				size: "sm",
				onClick: () => setChatOpen((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Chat"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: mic ? "default" : "outline",
				size: "sm",
				onClick: () => void toggleMic(),
				children: [mic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }), "Mic"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: video ? "default" : "outline",
				size: "sm",
				onClick: () => void toggleVideo(),
				children: [video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-4" }), "Video"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: endCall,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" }), "End call"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn(compact ? "border-b border-border bg-card px-2 py-2" : "mt-6"),
		children: [
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Room chat and call"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: call.joined ? `${call.peers.length} on call` : "Connecting…"
				})]
			}) : null,
			controls,
			(video || tiles.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-3 grid gap-2", tiles.length > 1 ? "grid-cols-2" : "grid-cols-1"),
				children: [video && call.localStream ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: localVideo,
					className: "aspect-video w-full rounded-lg bg-bar object-cover",
					autoPlay: true,
					muted: true,
					playsInline: true
				}) : null, tiles.map(([id, stream]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemoteTile, {
					stream,
					name: call.peers.find((p) => p.id === id)?.name || "Friend"
				}, id))]
			}),
			call.peers.some((p) => p.connectionState === "failed") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "Some friends cannot connect on video — chat still works."
			}) : null,
			chatOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-3 grid gap-2", compact && "rounded-lg border border-border bg-card p-3 text-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scroller,
						className: "max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border bg-card p-3",
						children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-6 text-center text-sm text-muted-foreground",
							children: "No messages yet."
						}) : messages.map((m) => {
							const mine = m.playerId === me;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("flex flex-col", mine ? "items-end" : "items-start"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-0.5 text-xs text-muted-foreground",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed", mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
									children: m.body
								})]
							}, m.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							send();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Message everyone",
							"aria-label": "Message everyone",
							maxLength: 400
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: sending || !draft.trim(),
							"aria-label": "Send",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: endCall,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" }), "End call"]
					})
				]
			}) : null
		]
	});
}
function RemoteTile({ stream, name }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ref.current) ref.current.srcObject = stream;
	}, [stream]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref,
			className: "aspect-video w-full rounded-lg bg-bar object-cover",
			autoPlay: true,
			playsInline: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute bottom-2 left-2 rounded-md bg-bar/80 px-2 py-0.5 text-xs text-bar-foreground",
			children: name
		})]
	});
}
//#endregion
export { QuizLiveBar as t };
