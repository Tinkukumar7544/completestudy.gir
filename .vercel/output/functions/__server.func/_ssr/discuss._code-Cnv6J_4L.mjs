import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { x as Route$8 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as PhoneOff, I as Mic, L as MicOff, U as LogOut, Z as Hand, a as Video, dt as Copy, o as VideoOff, v as Share2, x as Send, z as MessageCircle } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, V as Input, W as cn, c as AnkiShell } from "./router-B0Z9kZGU2.mjs";
import { n as rememberQuizName, r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { a as discModeHint, n as allowsVideo, o as discModeLabel, s as waitingConnect } from "./discussion-room-C9rESxG8.mjs";
import { a as listDiscussion, c as sendDiscussionChat, i as leaveDiscussion, n as endDiscussion, o as raiseDiscussionHand, r as joinDiscussion, s as readyDiscussion } from "./discussion-BiZJVwBc.mjs";
import { t as P2PRoom } from "./p2p-Dp9s0yIA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discuss._code-Cnv6J_4L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function discRtcRoomId(code) {
	return `disc-${code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24)}`.slice(0, 64);
}
function watchSpeaking(stream, onChange) {
	if (!stream.getAudioTracks()[0] || typeof AudioContext === "undefined") return () => void 0;
	const ctx = new AudioContext();
	const source = ctx.createMediaStreamSource(stream);
	const analyser = ctx.createAnalyser();
	analyser.fftSize = 512;
	source.connect(analyser);
	const data = new Uint8Array(analyser.frequencyBinCount);
	let last = false;
	let raf = 0;
	const loop = () => {
		analyser.getByteFrequencyData(data);
		let sum = 0;
		for (const n of data) sum += n;
		const speaking = sum / data.length > 18;
		if (speaking !== last) {
			last = speaking;
			onChange(speaking);
		}
		raf = requestAnimationFrame(loop);
	};
	raf = requestAnimationFrame(loop);
	return () => {
		cancelAnimationFrame(raf);
		ctx.close();
	};
}
function useDiscussCall(opts) {
	const { code, selfId, name, enabled } = opts;
	const [peers, setPeers] = (0, import_react.useState)([]);
	const [joined, setJoined] = (0, import_react.useState)(false);
	const [remoteStreams, setRemoteStreams] = (0, import_react.useState)({});
	const [localStream, setLocalStreamState] = (0, import_react.useState)(null);
	const [speaking, setSpeaking] = (0, import_react.useState)({});
	const roomRef = (0, import_react.useRef)(null);
	const localRef = (0, import_react.useRef)(null);
	const speakStop = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!enabled || !code || !selfId || selfId === "ssr") return;
		const p2p = new P2PRoom({
			room: discRtcRoomId(code),
			selfId: selfId.slice(0, 64),
			name,
			onPeersChanged: setPeers,
			onConnected: () => setJoined(true),
			onTrack: (from, stream) => {
				setRemoteStreams((cur) => ({
					...cur,
					[from]: stream
				}));
			},
			onMessage: (from, data) => {
				if (!data || typeof data !== "object") return;
				const msg = data;
				if (msg.t === "speak") setSpeaking((cur) => ({
					...cur,
					[from]: Boolean(msg.on)
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
			setSpeaking({});
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
		setSpeaking((cur) => {
			const next = {};
			for (const [id, on] of Object.entries(cur)) if (alive.has(id) || id === selfId) next[id] = on;
			return next;
		});
	}, [peers, selfId]);
	const stopLocal = (0, import_react.useCallback)(() => {
		speakStop.current?.();
		speakStop.current = null;
		localRef.current?.getTracks().forEach((t) => t.stop());
		localRef.current = null;
		setLocalStreamState(null);
		roomRef.current?.setLocalStream(null);
		setSpeaking((cur) => ({
			...cur,
			[selfId]: false
		}));
		roomRef.current?.broadcast({
			t: "speak",
			on: false
		});
	}, [selfId]);
	return {
		peers,
		joined,
		remoteStreams,
		localStream,
		speaking,
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
				speakStop.current?.();
				localRef.current?.getTracks().forEach((t) => t.stop());
				localRef.current = stream;
				setLocalStreamState(stream);
				roomRef.current?.setLocalStream(stream);
				speakStop.current = watchSpeaking(stream, (on) => {
					setSpeaking((cur) => ({
						...cur,
						[selfId]: on
					}));
					roomRef.current?.broadcast({
						t: "speak",
						on
					});
				});
			} catch (err) {
				stopLocal();
				throw err;
			}
		}, [selfId, stopLocal]),
		endCall: stopLocal
	};
}
function initials(name) {
	const parts = name.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "Y";
}
function Tile({ name, you, stream, speaking, hand, micOn, videoOn, large }) {
	const video = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = video.current;
		if (!el) return;
		el.srcObject = stream;
	}, [stream]);
	const showVideo = Boolean(stream && videoOn && stream.getVideoTracks().some((t) => t.enabled && t.readyState === "live"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-raised", large ? "aspect-video min-h-52 w-full" : "size-20 shrink-0", speaking ? "border-primary ring-2 ring-primary" : "border-border"),
		children: [
			showVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: video,
				className: "size-full object-cover",
				autoPlay: true,
				playsInline: true,
				muted: you
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid size-full place-items-center bg-secondary text-secondary-foreground", large ? "text-2xl" : "text-sm"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold tracking-tight",
					children: initials(name)
				})
			}),
			!showVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: video,
				className: "hidden",
				autoPlay: true,
				playsInline: true,
				muted: you
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("absolute inset-x-0 bottom-0 flex items-center gap-1 bg-bar/80 px-1.5 py-1 text-bar-foreground", large ? "px-3 py-2" : ""),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("min-w-0 truncate font-medium", large ? "text-sm" : "text-xs"),
					children: [name, you ? " · you" : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto flex items-center gap-1",
					children: [
						hand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: cn(large ? "size-4" : "size-3") }) : null,
						micOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: cn(large ? "size-4" : "size-3") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: cn("opacity-70", large ? "size-4" : "size-3") }),
						videoOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: cn(large ? "size-4" : "size-3") }) : null
					]
				})]
			})
		]
	});
}
function DiscussStage({ room, me, name, onRoom }) {
	const call = useDiscussCall({
		code: room.code,
		selfId: me,
		name,
		enabled: Boolean(room.startedAt && !room.endedAt)
	});
	const videoOk = allowsVideo(room.mode);
	const [mic, setMic] = (0, import_react.useState)(false);
	const [video, setVideo] = (0, import_react.useState)(false);
	const [chatOpen, setChatOpen] = (0, import_react.useState)(false);
	const [askOpen, setAskOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [question, setQuestion] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	const present = room.players.filter((p) => !p.leftAt);
	const mine = present.find((p) => p.playerId === me);
	const handOn = Boolean(mine?.handAt);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		room.messages.length,
		chatOpen,
		askOpen
	]);
	async function toggleMic() {
		const next = !mic;
		try {
			await call.setMedia(next, video && videoOk);
			setMic(next);
		} catch {
			toast.error("Microphone permission is needed");
			setMic(false);
		}
	}
	async function toggleVideo() {
		if (!videoOk) return;
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
	async function toggleHand() {
		try {
			onRoom(await raiseDiscussionHand({ data: {
				code: room.code,
				playerId: me,
				on: !handOn
			} }));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not raise hand");
		}
	}
	async function send(kind) {
		const body = (kind === "question" ? question : draft).trim();
		if (!body) return;
		setSending(true);
		if (kind === "question") setQuestion("");
		else setDraft("");
		try {
			onRoom(await sendDiscussionChat({ data: {
				code: room.code,
				playerId: me,
				name,
				body,
				kind
			} }));
		} catch (err) {
			if (kind === "question") setQuestion(body);
			else setDraft(body);
			toast.error(err instanceof Error ? err.message : "Could not send");
		} finally {
			setSending(false);
		}
	}
	const speakerId = (0, import_react.useMemo)(() => {
		const live = Object.entries(call.speaking).filter(([, on]) => on).map(([id]) => id);
		if (live.includes(me)) return me;
		if (live[0]) return live[0];
		return present.find((p) => p.handAt)?.playerId ?? present[0]?.playerId ?? me;
	}, [
		call.speaking,
		me,
		present
	]);
	const speaker = present.find((p) => p.playerId === speakerId) ?? present[0];
	const others = present.filter((p) => p.playerId !== speaker?.playerId);
	const failed = call.peers.filter((p) => p.connectionState === "failed");
	const questions = room.messages.filter((m) => m.kind === "question");
	function streamFor(player) {
		if (player.playerId === me) return call.localStream;
		return call.remoteStreams[player.playerId] ?? null;
	}
	function videoFlag(player) {
		if (player.playerId === me) return video;
		const stream = call.remoteStreams[player.playerId];
		return Boolean(stream?.getVideoTracks().some((t) => t.enabled && t.readyState === "live"));
	}
	function micFlag(player) {
		if (player.playerId === me) return mic;
		const stream = call.remoteStreams[player.playerId];
		return Boolean(stream?.getAudioTracks().some((t) => t.enabled && t.readyState === "live")) || Boolean(call.speaking[player.playerId]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			speaker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
				name: speaker.name,
				you: speaker.playerId === me,
				stream: streamFor(speaker),
				speaking: Boolean(call.speaking[speaker.playerId]),
				hand: Boolean(speaker.handAt),
				micOn: micFlag(speaker),
				videoOn: videoFlag(speaker),
				large: true
			}) : null,
			others.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: others.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					name: p.name,
					you: p.playerId === me,
					stream: streamFor(p),
					speaking: Boolean(call.speaking[p.playerId]),
					hand: Boolean(p.handAt),
					micOn: micFlag(p),
					videoOn: videoFlag(p)
				}, p.playerId))
			}) : null,
			failed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Camera may not reach every pair past a small group. Chat, hands, and questions still reach all ",
					present.length,
					"."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: chatOpen ? "default" : "outline",
						onClick: () => {
							setChatOpen((v) => !v);
							setAskOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Chat"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: mic ? "default" : "outline",
						onClick: () => void toggleMic(),
						children: [mic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }), "Mic"]
					}),
					videoOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: video ? "default" : "outline",
						onClick: () => void toggleVideo(),
						children: [video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-4" }), "Camera"]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: handOn ? "default" : "outline",
						onClick: () => void toggleHand(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "size-4" }), "Hand"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: askOpen ? "default" : "outline",
						onClick: () => {
							setAskOpen((v) => !v);
							setChatOpen(false);
						},
						children: "Ask"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							call.endCall();
							setMic(false);
							setVideo(false);
							toast.success("Call ended — chat is still open");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" }), "End call"]
					})
				]
			}),
			chatOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-xl border border-border bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Chat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scroller,
						className: "grid max-h-48 gap-2 overflow-y-auto",
						children: room.messages.filter((m) => m.kind === "chat").map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [" · ", m.body]
							})]
						}, m.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Message the group",
							onKeyDown: (e) => {
								if (e.key === "Enter") send("chat");
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							disabled: sending,
							onClick: () => void send("chat"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
						})]
					})
				]
			}) : null,
			askOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-xl border border-border bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Questions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "grid max-h-48 gap-2 overflow-y-auto",
						children: [questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No questions yet."
						}) : null, questions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-muted px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.body })]
						}, m.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: question,
							onChange: (e) => setQuestion(e.target.value),
							placeholder: "Ask the group",
							onKeyDown: (e) => {
								if (e.key === "Enter") send("question");
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							disabled: sending,
							onClick: () => void send("question"),
							children: "Ask"
						})]
					})
				]
			}) : null
		]
	});
}
function DiscussRoomPage() {
	const { code } = Route$8.useParams();
	const navigate = useNavigate();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [joining, setJoining] = (0, import_react.useState)(false);
	const me = quizPlayerId();
	(0, import_react.useEffect)(() => {
		setName(rememberedQuizName());
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function refresh() {
			try {
				const next = await listDiscussion({ data: {
					code,
					playerId: me
				} });
				if (!cancelled) {
					setRoom(next);
					setError(null);
				}
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "Discussion not found");
			}
		}
		refresh();
		const t = window.setInterval(() => void refresh(), 2e3);
		return () => {
			cancelled = true;
			window.clearInterval(t);
		};
	}, [code, me]);
	const present = room?.players.filter((p) => !p.leftAt) ?? [];
	const joined = present.some((p) => p.playerId === me);
	const waiting = room ? waitingConnect(present) : 0;
	const display = name.trim() || rememberedQuizName() || "You";
	async function join() {
		const nextName = name.trim() || "Friend";
		setJoining(true);
		try {
			rememberQuizName(nextName);
			setRoom(await joinDiscussion({ data: {
				code,
				playerId: me,
				name: nextName
			} }));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setJoining(false);
		}
	}
	async function connect() {
		try {
			rememberQuizName(display);
			setRoom(await readyDiscussion({ data: {
				code,
				playerId: me,
				name: display
			} }));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not connect");
		}
	}
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(room?.code ?? code);
			toast.success("Code copied");
		} catch {
			toast.message(room?.code ?? code);
		}
	}
	async function shareCode() {
		const url = `${window.location.origin}/discuss/${room?.code ?? code}`;
		try {
			if (navigator.share) {
				await navigator.share({
					title: room?.title ?? "Discussion",
					text: room?.code,
					url
				});
				return;
			}
			await navigator.clipboard.writeText(url);
			toast.success("Link copied");
		} catch {}
	}
	if (error && !room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Group discussion",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: error
		})
	});
	if (!room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Group discussion",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: "Loading room…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: room.title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-md gap-4 p-4 pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Room code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-3xl font-semibold tracking-[0.3em]",
							children: room.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => void copyCode(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy code"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => void shareCode(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								discModeLabel(room.mode),
								" · ",
								present.length,
								"/",
								20
							]
						}),
						room.prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm",
							children: room.prompt
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: discModeHint(room.mode)
						}),
						room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "This discussion has ended"
						}) : room.startedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Live. The highlighted box is the active speaker."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Join first. Then each person taps Connect. The discussion starts when every name is connected."
						})
					]
				}),
				!joined && !room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "disc-name",
							children: "Your name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "disc-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Shown on the tiles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void join(),
							disabled: joining,
							children: joining ? "Joining…" : "Join this discussion"
						})
					]
				}) : null,
				joined && !room.startedAt && !room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Participants"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-border rounded-lg border border-border bg-card",
						children: present.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex min-h-14 items-center gap-3 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1 truncate text-sm",
								children: [p.name, p.playerId === me ? " (you)" : ""]
							}), p.readyAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-review",
								children: "Connected"
							}) : p.playerId === me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-11 px-5",
								onClick: () => void connect(),
								children: "Connect"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Waiting"
							})]
						}, p.playerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: waiting ? `Still waiting on ${waiting} to tap Connect.` : "Starting…"
					})
				] }) : null,
				joined && room.startedAt && !room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscussStage, {
					room,
					me,
					name: display,
					onRoom: setRoom
				}) : null,
				joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							leaveDiscussion({ data: {
								code: room.code,
								playerId: me
							} }).then(() => void navigate({
								to: "/coaching",
								search: { view: "discussions" }
							})).catch((err) => toast.error(err instanceof Error ? err.message : "Could not leave"));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Leave"]
					}), room.isHost && !room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							endDiscussion({ data: {
								code: room.code,
								playerId: me
							} }).then(setRoom).catch((err) => toast.error(err instanceof Error ? err.message : "Could not end"));
						},
						children: "End discussion"
					}) : null]
				}) : null
			]
		})
	});
}
//#endregion
export { DiscussRoomPage as component };
