import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Route$4 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as PhoneOff, U as LogOut, W as Lock, dt as Copy, u as Trophy, v as Share2, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, U as activeExamTemplate, V as Input, W as cn, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
import { n as rememberQuizName, r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { a as correctIndexes, c as formatCountdown, d as lockUntilMs, f as optionLetter, l as formatIsoDate, s as formatAnswer, v as remainingMs } from "./quiz-assign-i7C7lqvX.mjs";
import { a as joinQuiz, c as readyQuiz, i as getQuizSummary, n as endQuiz, o as leaveQuiz, s as listQuiz } from "./quiz-DNF-wQMz.mjs";
import { t as PaperStartFields } from "./paper-start-u23BUBx1.mjs";
import { i as rememberedPaperPrefs, r as rememberPaperPrefs } from "./clipboard-wrdOgXLB.mjs";
import { t as QuizLiveBar } from "./quiz-call-D175w8D7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz._code-AOkDPD43.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BUCKETS = [
	{
		id: "wrong",
		label: "Wrong",
		tone: "learn"
	},
	{
		id: "marked",
		label: "Review",
		tone: "mark"
	},
	{
		id: "skipped",
		label: "Skipped",
		tone: "new"
	},
	{
		id: "correct",
		label: "Correct",
		tone: "review"
	}
];
function inBucket(item, bucket) {
	if (bucket === "all") return true;
	if (bucket === "wrong") return item.isAttempted && !item.isCorrect;
	if (bucket === "correct") return item.isAttempted && item.isCorrect;
	if (bucket === "skipped") return !item.isAttempted;
	if (bucket === "marked") return item.isMarked;
	return item.isAttempted;
}
function countOf(items, bucket) {
	return items.filter((item) => inBucket(item, bucket)).length;
}
function QuestionCard({ item, index }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const rights = correctIndexes(item.correct, item.options);
	const picked = Array.isArray(item.userAns) ? item.userAns.map(Number) : typeof item.userAns === "number" ? [item.userAns] : [];
	const status = !item.isAttempted ? "Skipped" : item.isCorrect ? "Correct" : "Wrong";
	const tone = !item.isAttempted ? "text-new" : item.isCorrect ? "text-review" : "text-learn";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-border last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-h-12 w-full items-start gap-3 px-4 py-3 text-left",
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-6 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground",
					children: index + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 text-sm leading-snug",
					children: item.question
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("shrink-0 pt-0.5 text-xs font-semibold", tone),
					children: status
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180") })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 px-4 pb-4 pl-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-1.5",
					children: item.options.map((opt, i) => {
						const isRight = rights.includes(i);
						const isPick = picked.includes(i);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("rounded-md border px-3 py-2 text-sm", isRight && "border-review/40 bg-review/10 text-foreground", isPick && !isRight && "border-learn/40 bg-learn/10 text-foreground", !isRight && !isPick && "border-border bg-card text-muted-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium",
									children: [optionLetter(i), "."]
								}),
								" ",
								opt,
								isRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs font-semibold text-review",
									children: "Correct"
								}) : null,
								isPick && !isRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs font-semibold text-learn",
									children: "Attempt"
								}) : null
							]
						}, `${item.bankId}-${i}`);
					})
				}),
				item.type === "numerical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						"Attempt: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: formatAnswer(item.userAns, item.options)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-muted-foreground",
							children: "·"
						}),
						"Correct: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-review",
							children: String(item.correct)
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						item.isAttempted ? "Attempted" : "Not attempted",
						item.isMarked ? " · marked for review" : "",
						" · ",
						status
					]
				}),
				item.explanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md bg-muted px-3 py-2 text-sm leading-relaxed text-foreground",
					children: item.explanation
				}) : null
			]
		}) : null]
	});
}
function QuizSummaryViewOnly({ summary, testDay, folder }) {
	const [bucket, setBucket] = (0, import_react.useState)("all");
	const items = (0, import_react.useMemo)(() => summary.items.filter((item) => inBucket(item, bucket)), [summary.items, bucket]);
	const attempted = countOf(summary.items, "attempted");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-3d mt-6 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-4 py-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Test summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-xl font-semibold tracking-tight",
						children: summary.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-review",
								children: summary.correct
							}),
							"/",
							summary.total,
							" correct",
							summary.wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								" ",
								"· ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-learn",
									children: [summary.wrong, " wrong"]
								})
							] }) : null
						]
					}),
					testDay || folder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							testDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Day ", testDay] }) : null,
							testDay && folder ? " · " : null,
							folder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Folder ", folder] }) : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), "View only — answers cannot be changed"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0",
				children: BUCKETS.map((row) => {
					const n = row.id === "wrong" ? summary.wrong : row.id === "correct" ? summary.correct : row.id === "skipped" ? summary.notAttempted : summary.marked;
					const active = bucket === row.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-2 py-2", active && "bg-muted"),
						onClick: () => setBucket(active ? "all" : row.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: row.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-base font-semibold tabular-nums", row.tone === "learn" && "text-learn", row.tone === "mark" && "text-mark", row.tone === "new" && "text-new", row.tone === "review" && "text-review"),
							children: n
						})]
					}) }, row.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 border-t border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn("min-h-10 flex-1 rounded-md px-2 text-xs font-medium", bucket === "attempted" ? "bg-muted" : "hover:bg-muted/60"),
					onClick: () => setBucket(bucket === "attempted" ? "all" : "attempted"),
					children: ["Attempts ", attempted]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn("min-h-10 flex-1 rounded-md px-2 text-xs font-medium", bucket === "all" ? "bg-muted" : "hover:bg-muted/60"),
					onClick: () => setBucket("all"),
					children: ["All ", summary.total]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "border-t border-border",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-center text-sm text-muted-foreground",
					children: "Nothing in this list."
				}) : items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionCard, {
					item,
					index: i
				}, item.bankId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-4 py-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "View code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-2xl font-semibold tracking-[0.28em]",
						children: summary.viewCode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"Enter this code below to open ",
							summary.name,
							"'s summary on another device. Summaries cannot be edited."
						]
					})
				]
			})
		]
	});
}
function QuizRoomPage() {
	const { code } = Route$4.useParams();
	const { view = "" } = Route$4.useSearch();
	const navigate = useNavigate();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [joining, setJoining] = (0, import_react.useState)(false);
	const [viewInput, setViewInput] = (0, import_react.useState)(view);
	const [lookup, setLookup] = (0, import_react.useState)(null);
	const [lookupError, setLookupError] = (0, import_react.useState)(null);
	const [looking, setLooking] = (0, import_react.useState)(false);
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const me = quizPlayerId();
	const templates = useExamStore((s) => s.templates ?? []);
	const [templateId, setTemplateId] = (0, import_react.useState)(() => rememberedPaperPrefs()?.template || activeExamTemplate()?.id || "");
	(0, import_react.useEffect)(() => {
		setName(rememberedQuizName());
	}, []);
	(0, import_react.useEffect)(() => {
		setViewInput(view);
	}, [view]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function refresh() {
			try {
				const next = await listQuiz({ data: {
					code,
					playerId: me
				} });
				if (!cancelled) {
					setRoom(next);
					setError(null);
				}
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "Quiz not found");
			}
		}
		refresh();
		const t = window.setInterval(() => void refresh(), 2e3);
		return () => {
			cancelled = true;
			window.clearInterval(t);
		};
	}, [code, me]);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 400);
		return () => window.clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!view || !room?.hasSubmitted) {
			setLookup(null);
			setLookupError(null);
			return;
		}
		let cancelled = false;
		setLooking(true);
		getQuizSummary({ data: {
			code,
			playerId: me,
			viewCode: view
		} }).then((summary) => {
			if (cancelled) return;
			setLookup(summary);
			setLookupError(null);
		}).catch((err) => {
			if (cancelled) return;
			setLookup(null);
			setLookupError(err instanceof Error ? err.message : "Could not open that summary");
		}).finally(() => {
			if (!cancelled) setLooking(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		view,
		code,
		me,
		room?.hasSubmitted
	]);
	const joined = Boolean(room?.players.some((p) => p.playerId === me && !p.leftAt));
	const present = room?.players.filter((p) => !p.leftAt) ?? [];
	const waitingStart = present.filter((p) => !p.readyAt);
	const lockUntil = (0, import_react.useMemo)(() => room ? lockUntilMs(room.startedAt, room.timeLimitSec, room.serverNow) : 0, [
		room?.startedAt,
		room?.timeLimitSec,
		room?.serverNow
	]);
	const left = remainingMs(lockUntil || null, now);
	const live = Boolean(room?.startedAt && !room.endedAt && left > 0);
	(0, import_react.useEffect)(() => {
		if (!joined || !room?.startedAt || room.hasSubmitted || room.endedAt) return;
		const key = `quiz-paper-${code}`;
		try {
			if (sessionStorage.getItem(key)) return;
			sessionStorage.setItem(key, "1");
		} catch {}
		rememberPaperPrefs({
			template: templateId,
			minutes: Math.max(1, Math.round((room.timeLimitSec || 0) / 60))
		});
		navigate({
			to: "/study/$deckId",
			params: { deckId: "quiz" },
			search: {
				mode: "custom",
				pick: "all",
				count: room.questionCount,
				paper: "",
				quiz: code.toUpperCase(),
				session: "",
				template: templateId || void 0,
				minutes: Math.max(1, Math.round((room.timeLimitSec || 0) / 60))
			}
		});
	}, [
		joined,
		room?.startedAt,
		room?.hasSubmitted,
		room?.endedAt,
		room?.questionCount,
		room?.timeLimitSec,
		code,
		navigate,
		templateId
	]);
	async function join() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name");
			return;
		}
		rememberQuizName(display);
		setJoining(true);
		try {
			const next = await joinQuiz({ data: {
				code,
				playerId: me,
				name: display
			} });
			setRoom(next);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setJoining(false);
		}
	}
	async function tapStart() {
		const display = name.trim() || rememberedQuizName() || "Friend";
		rememberQuizName(display);
		try {
			const next = await readyQuiz({ data: {
				code,
				playerId: me,
				name: display
			} });
			setRoom(next);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start");
		}
	}
	function openPaper() {
		rememberPaperPrefs({
			template: templateId,
			minutes: Math.max(1, Math.round((room?.timeLimitSec || 0) / 60))
		});
		navigate({
			to: "/study/$deckId",
			params: { deckId: "quiz" },
			search: {
				mode: "custom",
				pick: "all",
				count: room?.questionCount ?? 0,
				paper: "",
				quiz: code.toUpperCase(),
				session: "",
				template: templateId || void 0,
				minutes: Math.max(1, Math.round((room?.timeLimitSec || 0) / 60))
			}
		});
	}
	function copyCode() {
		navigator.clipboard.writeText(code.toUpperCase());
		toast.success("Code copied — send it to friends");
	}
	function shareCode() {
		const text = `Join my SetPaper quiz “${room?.title ?? "Friends quiz"}”. Code: ${code.toUpperCase()}`;
		if (typeof navigator.share === "function") {
			navigator.share({
				title: room?.title ?? "Friends quiz",
				text
			}).catch(() => copyCode());
			return;
		}
		copyCode();
	}
	function copyViewCode(value) {
		navigator.clipboard.writeText(value);
		toast.success("View code copied");
	}
	function openViewCode() {
		const next = viewInput.trim().toUpperCase();
		if (next.length < 4) {
			toast.error("Enter a view code from a friend’s summary");
			return;
		}
		navigate({
			to: "/quiz/$code",
			params: { code },
			search: { view: next }
		});
	}
	async function terminate() {
		const display = name.trim() || rememberedQuizName() || "Friend";
		try {
			const next = await endQuiz({ data: {
				code,
				playerId: me,
				name: display
			} });
			setRoom(next);
			toast.success("Test ended — remaining papers were auto-submitted");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not end the test");
		}
	}
	async function disconnect() {
		const display = name.trim() || rememberedQuizName() || "Friend";
		try {
			await leaveQuiz({ data: {
				code,
				playerId: me,
				name: display
			} });
		} catch {}
		navigate({ to: "/connect" });
	}
	if (error && !room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Friends quiz",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: error
		})
	});
	if (!room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Friends quiz",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-muted-foreground",
			children: "Loading room…"
		})
	});
	const submitted = room.players.filter((p) => p.submittedAt);
	const summary = lookup ?? room.assigned;
	const dayLabel = formatIsoDate(room.testDay);
	const minutes = Math.max(1, Math.round(room.timeLimitSec / 60));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: room.title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md p-4 pb-10",
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
								onClick: copyCode,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy code"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: shareCode,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								present.length,
								"/",
								20,
								" friends · ",
								room.questionCount,
								" questions · ",
								minutes,
								" min"
							]
						}),
						(dayLabel || room.folder) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								dayLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Test day ", dayLabel] }) : null,
								dayLabel && room.folder ? " · " : null,
								room.folder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Folder ", room.folder] }) : null
							]
						}),
						live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-lg font-semibold tabular-nums",
							children: formatCountdown(left)
						}) : room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "This test has ended"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "The paper starts when every name has tapped Start."
						})
					]
				}),
				!joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "join-name",
							children: "Your name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "join-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Shown on the scoreboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void join(),
							disabled: joining,
							children: joining ? "Joining…" : "Join this quiz"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					!room.startedAt && !room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6",
						children: [
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
										children: "Ready"
									}) : p.playerId === me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "h-11 px-5",
										onClick: () => void tapStart(),
										children: "Start"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Waiting"
									})]
								}, p.playerId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: waitingStart.length ? `Wait until everyone has joined, then each person taps Start. Still waiting on ${waitingStart.length}.` : "Starting…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperStartFields, {
									total: room.questionCount,
									count: String(room.questionCount),
									onCount: () => void 0,
									minutes: String(minutes),
									onMinutes: () => void 0,
									templateId: templateId || templates.find((t) => t.bookmarked)?.id || templates[0]?.id || "",
									onTemplate: (id) => {
										setTemplateId(id);
										rememberPaperPrefs({
											template: id,
											minutes
										});
									},
									showCount: false,
									showMinutes: false
								})
							})
						]
					}) : null,
					room.startedAt && !room.hasSubmitted && !room.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6 h-12 w-full",
						onClick: openPaper,
						children: "Open paper"
					}) : null,
					room.hasSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), " Submitted — this paper is locked"]
					}) : null
				] }),
				submitted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5" }), " Scoreboard"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-2 divide-y divide-border rounded-lg border border-border bg-card",
						children: submitted.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex items-center gap-3 px-3 py-3", p.playerId === me && "bg-primary/5"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 text-sm tabular-nums text-muted-foreground",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1 truncate text-sm",
									children: [p.name, p.playerId === me ? " (you)" : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-medium tabular-nums",
									children: [
										p.score,
										"/",
										p.total
									]
								})
							]
						}, p.playerId))
					})]
				}),
				room.hasSubmitted && !summary && !lookupError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-lg border border-border bg-card px-4 py-5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Waiting to swap summaries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Another participant needs to submit so papers can be shuffled. You will never be shown your own summary."
					})]
				}),
				looking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-sm text-muted-foreground",
					children: "Opening that summary…"
				}) : null,
				lookupError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-sm text-destructive",
					children: lookupError
				}) : null,
				summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizSummaryViewOnly, {
					summary,
					testDay: dayLabel,
					folder: room.folder
				}) : null,
				room.hasSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 grid gap-3",
					children: [
						room.myViewCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-dashed border-border px-4 py-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs tracking-wide text-muted-foreground uppercase",
									children: "Your view code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xl font-semibold tracking-[0.28em]",
									children: room.myViewCode
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "mt-1",
									onClick: () => copyViewCode(room.myViewCode),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy so friends can open yours"]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "view-code",
							children: "Open another summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "view-code",
								value: viewInput,
								onChange: (e) => setViewInput(e.target.value.toUpperCase()),
								placeholder: "Code under a summary",
								className: "font-mono tracking-widest",
								autoCapitalize: "characters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: openViewCode,
								children: "Open summary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Enter the code shown under a friend’s summary to view it. It stays read-only."
						})
					]
				}) : null,
				joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizLiveBar, {
					code,
					name: name || rememberedQuizName(),
					messages: room.messages,
					onRoom: setRoom
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-lg border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold tracking-tight",
							children: "Leave the room"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "End call turns off camera and mic. Chat stays open until you disconnect." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "End test closes the paper for everyone still writing and builds results." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Disconnect leaves chat and the call. You can exit on your own." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => window.dispatchEvent(new Event("setpaper-end-call")),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" }), " End call"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: terminate,
									disabled: Boolean(room.endedAt),
									children: "End test"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => void disconnect(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Disconnect"]
								})
							]
						})
					]
				})] }) : null
			]
		})
	});
}
//#endregion
export { QuizRoomPage as component };
