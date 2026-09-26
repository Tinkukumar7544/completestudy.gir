import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { E as normalizeLudo, _ as journeyProgress, d as defaultLudo, g as floodIsOpen, i as daysToExam, j as withAutoFlood, p as defaultPathIntake, r as LUDO_COLORS, s as defaultExamPath, v as layoutRiverNodes, w as normalizeJourney, x as normalizeExamPath, y as makeLudoTokens } from "./types-XZVWHhWz.mjs";
import { D as TabsList, E as TabsContent, O as TabsTrigger, T as Tabs, a as Route$13 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Plus, E as Radio, F as Minus, Tt as BookOpen, V as Maximize2, W as Lock, _t as ChevronRight, b as Settings2, bt as Check, ct as EllipsisVertical, et as Flame, f as Trash2, g as SlidersHorizontal, i as Volume2, j as Pencil, mt as ClipboardList, r as VolumeX, s as Users, u as Trophy, ut as Dices, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { B as Label, G as createSsrRpc, H as Button, L as useCurrentUser, V as Input, W as cn, a as DialogDescription, c as AnkiShell, d as DropdownMenuItem, f as DropdownMenuSeparator, i as DialogContent, l as DropdownMenu, n as Switch, nt as useExamStore, o as DialogHeader, p as DropdownMenuTrigger, r as Dialog, s as DialogTitle, tt as uid, u as DropdownMenuContent } from "./router-B0Z9kZGU2.mjs";
import { t as Textarea } from "./textarea-BI7oN-Xh.mjs";
import { n as rememberQuizName, r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { _ as todayStepCount, a as completePathNode, c as daysLeftLabel, d as noteReadPercent, f as pathNodeState, g as testScoreOf, h as rolloverPath, l as formatPathDate, m as pathStarted, n as applySessionToPath, o as currentNodeIndex, p as pathOverallPercent, r as buildExamPath, s as dailyGoalMet, t as DAILY_GOAL_OPTIONS, u as intakeReady } from "./exam-path-CegkKdrh.mjs";
import { A as placeSundayBox, B as stretchOwner, C as ludoSeatInitial, D as patchCustomRule, E as passTurn, F as rollDie, H as tokenCell, I as rolledToday, L as setCellNote, M as popupCopy, N as removeCustomRule, O as pickBotMove, P as resetMatch, R as setChallengeTest, S as ludoIsResting, T as onCross, U as whyCantRoll, V as tickLudoFromActivity, W as yardPad, _ as isActiveSeat, a as applyActiveColors, b as legalMoves, c as canColorRoll, d as daysToLudoExam, f as dismissChallenge, g as inYard, h as inHomeCenter, i as addCustomRule, j as playMove, k as placeArrayBox, l as cellKey, m as flashesFromBoards, o as applyPlayerMode, p as dismissStudy, r as YARD_ORIGIN, s as applyRoll, t as ARROW_DIR, u as cellNote, v as isBotColumn, w as ludoSeatName, x as ludoHasStarted, y as isSafeBoardCell, z as startOwner } from "./ludo-path-Bs2aZvF5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/target-C4vduOrV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MUTE_KEY$1 = "setpaper-path-sfx";
var ctx$1 = null;
var master$1 = null;
var sfxBus$1 = null;
var muted$1 = readMuted$1();
function readMuted$1() {
	try {
		return localStorage.getItem(MUTE_KEY$1) === "off";
	} catch {
		return false;
	}
}
function isPathMuted() {
	return muted$1;
}
function setPathMuted(next) {
	muted$1 = next;
	try {
		localStorage.setItem(MUTE_KEY$1, next ? "off" : "on");
	} catch {}
	if (master$1 && ctx$1) master$1.gain.setTargetAtTime(next ? 0 : .7, ctx$1.currentTime, .02);
}
function unlockPathSfx() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx$1) {
		ctx$1 = new AC({ latencyHint: "interactive" });
		master$1 = ctx$1.createGain();
		sfxBus$1 = ctx$1.createGain();
		sfxBus$1.gain.value = .55;
		master$1.gain.value = muted$1 ? 0 : .7;
		sfxBus$1.connect(master$1);
		master$1.connect(ctx$1.destination);
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") ctx$1?.resume();
		});
	}
	if (ctx$1.state === "suspended") ctx$1.resume();
}
function tone$1(freq, dur, type, gain, at, slide) {
	if (!ctx$1 || !sfxBus$1 || muted$1) return;
	const o = ctx$1.createOscillator();
	const g = ctx$1.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, at);
	if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), at + dur);
	g.gain.setValueAtTime(1e-4, at);
	g.gain.exponentialRampToValueAtTime(Math.max(2e-4, gain), at + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, at + dur);
	o.connect(g);
	g.connect(sfxBus$1);
	o.start(at);
	o.stop(at + dur + .03);
	o.onended = () => {
		o.disconnect();
		g.disconnect();
	};
}
function playPathSfx(kind) {
	unlockPathSfx();
	if (!ctx$1 || muted$1) return;
	const t = ctx$1.currentTime;
	switch (kind) {
		case "tap":
			tone$1(640, .07, "triangle", .16, t);
			return;
		case "complete":
			tone$1(392, .1, "sine", .14, t);
			tone$1(523, .12, "sine", .16, t + .08);
			tone$1(659, .18, "triangle", .18, t + .16);
			return;
		case "unlock":
			tone$1(523, .12, "triangle", .14, t, 784);
			tone$1(784, .16, "sine", .12, t + .1);
			return;
		case "deny":
			tone$1(180, .16, "square", .1, t, 110);
			return;
		case "streak":
			tone$1(440, .1, "sine", .12, t);
			tone$1(554, .1, "sine", .12, t + .09);
			tone$1(659, .12, "sine", .14, t + .18);
			tone$1(880, .2, "triangle", .16, t + .28);
			return;
		case "goal":
			tone$1(523, .12, "triangle", .14, t);
			tone$1(784, .18, "triangle", .16, t + .12);
			return;
	}
}
var STEPS = [
	{
		id: "name",
		title: "Which exam is this target for?",
		hint: "GATE, NEET, Overman, SSC — whatever you are sitting."
	},
	{
		id: "start",
		title: "When does the target start?",
		hint: "Steps stay still until this date."
	},
	{
		id: "exam",
		title: "When do you need to be ready?",
		hint: "The date this path is built to finish."
	},
	{
		id: "pace",
		title: "How many steps each day?",
		hint: "One step is a note, a test, or a weekly check."
	},
	{
		id: "subjects",
		title: "Which subjects stay on this path?",
		hint: "Pick from your folders, or type your own."
	},
	{
		id: "notes",
		title: "Which notes belong on the path?",
		hint: "Reading them fills the percent on each step."
	},
	{
		id: "tests",
		title: "Which tests belong on the path?",
		hint: "Scores land on the step after you sit the paper."
	},
	{
		id: "weekly",
		title: "Add a weekly check in each subject?",
		hint: "Unlocks after that subject's notes and tests."
	},
	{
		id: "extra",
		title: "Anything else to add?",
		hint: "Optional — a book, coaching class, extra drill."
	},
	{
		id: "review",
		title: "Create this target?",
		hint: "Start date, finish date, subjects, notes, and tests."
	}
];
function toDateInput$2(ts) {
	if (!ts) return "";
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromDateInput$1(value, endOfDay = false) {
	if (!value) return null;
	const n = (/* @__PURE__ */ new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}`)).getTime();
	return Number.isFinite(n) ? n : null;
}
function PaperMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 64 64",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "30",
				fill: "currentColor",
				opacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M20 18h18l10 10v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4z",
				fill: "currentColor",
				opacity: "0.92"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M38 18v8a2 2 0 0 0 2 2h8",
				fill: "none",
				stroke: "var(--color-card)",
				strokeWidth: "2.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 36h16M24 43h12",
				stroke: "var(--color-card)",
				strokeWidth: "2.4",
				strokeLinecap: "round"
			})
		]
	});
}
function nodeIcon(kind) {
	if (kind === "test") return ClipboardList;
	if (kind === "weekly") return Trophy;
	if (kind === "extra") return Plus;
	return BookOpen;
}
function ExamPathHome() {
	if (!normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath()).intake.completed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathIntakeFlow, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathBoard, {});
}
function PathIntakeFlow() {
	const decks = useExamStore((s) => s.decks);
	const notes = useExamStore((s) => s.notes);
	const folders = useExamStore((s) => s.folders);
	const prefs = useExamStore((s) => s.prefs);
	const stored = normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath());
	const updatePath = useExamStore((s) => s.updatePath);
	const setPrefs = useExamStore((s) => s.setPrefs);
	const [step, setStep] = (0, import_react.useState)(0);
	const [draft, setDraft] = (0, import_react.useState)(() => {
		const base = stored.intake.examName ? stored.intake : defaultPathIntake();
		return {
			...base,
			completed: false,
			examName: base.examName || prefs.targetExamName || "",
			startDate: base.startDate ?? Date.now(),
			examDate: base.examDate ?? Date.now() + 10368e5,
			noteIds: base.noteIds.length ? base.noteIds : notes.map((n) => n.id),
			deckIds: base.deckIds.length ? base.deckIds : decks.map((d) => d.id)
		};
	});
	const [subjectDraft, setSubjectDraft] = (0, import_react.useState)("");
	const [extraDraft, setExtraDraft] = (0, import_react.useState)("");
	const current = STEPS[step];
	const suggestions = (0, import_react.useMemo)(() => {
		const fromFolders = folders.map((f) => f.name.trim()).filter(Boolean);
		const fromDecks = decks.map((d) => (d.name.split("::").pop() ?? d.name).trim()).filter(Boolean);
		return [.../* @__PURE__ */ new Set([...fromFolders, ...fromDecks])].slice(0, 12);
	}, [folders, decks]);
	function canContinue() {
		if (current.id === "name") return draft.examName.trim().length > 1;
		if (current.id === "start") return Boolean(draft.startDate);
		if (current.id === "exam") return Boolean(draft.examDate) && (draft.startDate == null || draft.examDate >= draft.startDate);
		if (current.id === "subjects") return true;
		if (current.id === "review") return intakeReady(draft);
		return true;
	}
	function addSubject(name) {
		const clean = name.trim().slice(0, 40);
		if (!clean || draft.subjects.includes(clean)) return;
		setDraft((d) => ({
			...d,
			subjects: [...d.subjects, clean].slice(0, 16)
		}));
		setSubjectDraft("");
	}
	function addExtra(name) {
		const clean = name.trim().slice(0, 60);
		if (!clean || draft.extraItems.includes(clean)) return;
		setDraft((d) => ({
			...d,
			extraItems: [...d.extraItems, clean].slice(0, 16)
		}));
		setExtraDraft("");
	}
	function finish() {
		const ready = {
			...draft,
			examName: draft.examName.trim()
		};
		if (!intakeReady(ready)) {
			toast.message("Add a name, dates, and at least one subject, note, test, or extra item");
			return;
		}
		unlockPathSfx();
		playPathSfx("goal");
		const next = buildExamPath(ready, notes, decks, folders, stored);
		updatePath(() => next);
		if (ready.examName) setPrefs({ targetExamName: ready.examName });
		toast.success("Target path is ready");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Set your target",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "exam-intake mx-auto grid max-w-lg gap-6 p-4 pb-28",
			onPointerDown: unlockPathSfx,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "exam-intake-bar",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${(step + 1) / STEPS.length * 100}%` } })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: [
							step + 1,
							" of ",
							STEPS.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-2xl font-semibold tracking-tight",
						children: current.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: current.hint
					})
				] }),
				current.id === "name" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft.examName,
					onChange: (e) => setDraft((d) => ({
						...d,
						examName: e.target.value
					})),
					placeholder: "Overman · Paper 1",
					className: "h-12 text-base",
					autoFocus: true
				}) : null,
				current.id === "start" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: toDateInput$2(draft.startDate),
					onChange: (e) => setDraft((d) => ({
						...d,
						startDate: fromDateInput$1(e.target.value)
					})),
					className: "h-12"
				}) : null,
				current.id === "exam" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: toDateInput$2(draft.examDate),
					onChange: (e) => setDraft((d) => ({
						...d,
						examDate: fromDateInput$1(e.target.value, true)
					})),
					className: "h-12"
				}) : null,
				current.id === "pace" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: DAILY_GOAL_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("exam-choice", draft.dailyGoal === opt.value && "is-on"),
						onClick: () => {
							playPathSfx("tap");
							setDraft((d) => ({
								...d,
								dailyGoal: opt.value
							}));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold",
							children: opt.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted-foreground",
							children: opt.hint
						})]
					}, opt.value))
				}) : null,
				current.id === "subjects" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: subjectDraft,
								onChange: (e) => setSubjectDraft(e.target.value),
								placeholder: "Add a subject",
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addSubject(subjectDraft);
									}
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => addSubject(subjectDraft),
								children: "Add"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: suggestions.map((name) => {
								const on = draft.subjects.includes(name);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: on ? "default" : "outline",
									onClick: () => setDraft((d) => ({
										...d,
										subjects: on ? d.subjects.filter((s) => s !== name) : [...d.subjects, name]
									})),
									children: name
								}, name);
							})
						}),
						draft.subjects.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: draft.subjects.join(" · ")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "None yet — we will use a Core paper unit if you skip this."
						})
					]
				}) : null,
				current.id === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No notes yet. You can add them later from Notes."
					}) : notes.map((note) => {
						const on = draft.noteIds.includes(note.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("exam-choice text-left", on && "is-on"),
							onClick: () => setDraft((d) => ({
								...d,
								noteIds: on ? d.noteIds.filter((id) => id !== note.id) : [...d.noteIds, note.id]
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: note.title || "Untitled note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: on ? "On the path" : "Off the path"
							})]
						}, note.id);
					})
				}) : null,
				current.id === "tests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: decks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No tests yet. You can add them later from Tests."
					}) : decks.map((deck) => {
						const on = draft.deckIds.includes(deck.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("exam-choice text-left", on && "is-on"),
							onClick: () => setDraft((d) => ({
								...d,
								deckIds: on ? d.deckIds.filter((id) => id !== deck.id) : [...d.deckIds, deck.id]
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: deck.name.split("::").pop()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: on ? "On the path" : "Off the path"
							})]
						}, deck.id);
					})
				}) : null,
				current.id === "weekly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("exam-choice text-left", draft.weeklyTests && "is-on"),
						onClick: () => setDraft((d) => ({
							...d,
							weeklyTests: true
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Yes — weekly checks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "A checkpoint after each subject"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("exam-choice text-left", !draft.weeklyTests && "is-on"),
						onClick: () => setDraft((d) => ({
							...d,
							weeklyTests: false
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Notes and tests only"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "No weekly checkpoint"
						})]
					})]
				}) : null,
				current.id === "extra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: extraDraft,
							onChange: (e) => setExtraDraft(e.target.value),
							placeholder: "e.g. Coaching mock on Sunday",
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addExtra(extraDraft);
								}
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => addExtra(extraDraft),
							children: "Add"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: draft.extraItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: () => setDraft((d) => ({
									...d,
									extraItems: d.extraItems.filter((x) => x !== item)
								})),
								children: "Remove"
							})]
						}, item))
					})]
				}) : null,
				current.id === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "exam-review",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Start" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPathDate(draft.startDate) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Finish" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPathDate(draft.examDate) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Daily" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
							draft.dailyGoal,
							" step",
							draft.dailyGoal === 1 ? "" : "s"
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Subjects" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: draft.subjects.length ? draft.subjects.join(", ") : "Core paper" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [draft.noteIds.length, " on the path"] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tests" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [draft.deckIds.length, " on the path"] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Weekly checks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: draft.weeklyTests ? "On" : "Off" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Added" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: draft.extraItems.length ? draft.extraItems.join(", ") : "None" })] })
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "flex-1",
						disabled: step === 0,
						onClick: () => setStep((s) => Math.max(0, s - 1)),
						children: "Back"
					}), current.id === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "flex-1",
						disabled: !canContinue(),
						onClick: finish,
						children: "Create target"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "flex-1",
						disabled: !canContinue(),
						onClick: () => {
							playPathSfx("tap");
							setStep((s) => Math.min(STEPS.length - 1, s + 1));
						},
						children: "Continue"
					})]
				})
			]
		})
	});
}
function PathBoard() {
	const navigate = useNavigate();
	const raw = useExamStore((s) => s.path);
	const decks = useExamStore((s) => s.decks);
	const notes = useExamStore((s) => s.notes);
	const folders = useExamStore((s) => s.folders);
	const lastSession = useExamStore((s) => s.lastSession);
	const prefs = useExamStore((s) => s.prefs);
	const updatePath = useExamStore((s) => s.updatePath);
	const path = normalizeExamPath(raw ?? defaultExamPath());
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [sfxOn, setSfxOn] = (0, import_react.useState)(() => path.progress.sound && !isPathMuted());
	const started = pathStarted(path);
	const current = currentNodeIndex(path);
	const today = todayStepCount(path, prefs.dayStartHour);
	const goal = path.intake.dailyGoal;
	const overall = pathOverallPercent(path);
	(0, import_react.useEffect)(() => {
		updatePath((p) => rolloverPath(p, prefs.dayStartHour));
	}, [prefs.dayStartHour, updatePath]);
	(0, import_react.useEffect)(() => {
		if (!lastSession) return;
		updatePath((p) => applySessionToPath(p, lastSession, prefs.dayStartHour));
	}, [
		lastSession?.id,
		prefs.dayStartHour,
		updatePath
	]);
	const units = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const node of path.nodes) {
			const row = map.get(node.unit) ?? {
				title: node.unitTitle,
				nodes: []
			};
			row.nodes.push(node);
			map.set(node.unit, row);
		}
		return [...map.entries()].map(([unit, row]) => ({
			unit,
			...row
		}));
	}, [path.nodes]);
	function persist(next, sfx) {
		updatePath(() => next);
		if (sfx && next.progress.sound) playPathSfx(sfx);
	}
	function onNode(node, index) {
		unlockPathSfx();
		if (pathNodeState(path, index) === "locked" || !started) {
			playPathSfx("deny");
			toast.message(started ? "Finish the step before this one" : "The target has not started yet");
			return;
		}
		playPathSfx("tap");
		setPicked(node);
	}
	function finishNode(node) {
		const before = path.progress.streak;
		const next = completePathNode(path, node.id, prefs.dayStartHour);
		const met = dailyGoalMet(next, prefs.dayStartHour);
		persist(next, next.progress.streak > before ? "streak" : met && !dailyGoalMet(path, prefs.dayStartHour) ? "goal" : "complete");
		setPicked(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: path.intake.examName || prefs.targetExamName || "Target Exam",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "exam-path mx-auto grid max-w-lg pb-28",
			onPointerDown: unlockPathSfx,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "exam-path-hud",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "exam-stat",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: path.progress.streak
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "day run" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "exam-stat",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: path.progress.marks
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "marks" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "exam-goal",
							style: { background: `conic-gradient(var(--color-primary) ${today / goal * 360}deg, color-mix(in oklab, var(--color-foreground) 12%, transparent) 0)` },
							"aria-label": `${today} of ${goal} steps today`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								today,
								"/",
								goal
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								"aria-label": "Target options",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										const next = !sfxOn;
										setSfxOn(next);
										setPathMuted(!next);
										updatePath((p) => ({
											...p,
											progress: {
												...p.progress,
												sound: next
											}
										}));
										if (next) playPathSfx("tap");
									},
									children: [sfxOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }), sfxOn ? "Sound off" : "Sound on"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => void navigate({
										to: "/target",
										search: { game: "pick" }
									}),
									children: "River and Ludo tracks"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => void navigate({ to: "/settings" }),
									children: "Edit daily goal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => {
										updatePath((p) => ({
											...p,
											intake: {
												...p.intake,
												completed: false
											}
										}));
										toast.message("Answer the questions again to rebuild the path");
									},
									children: "Redo the setup questions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => {
										persist(buildExamPath(path.intake, notes, decks, folders, path), "unlock");
										toast.success("Path rebuilt from the current notes and tests");
									},
									children: "Rebuild path"
								})
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "exam-summary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperMark, { className: "exam-mark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-semibold tracking-tight",
									children: path.intake.examName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										formatPathDate(path.intake.startDate),
										" → ",
										formatPathDate(path.intake.examDate),
										" · ",
										daysLeftLabel(path.intake.examDate)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										path.intake.subjects.join(" · ") || "Core paper",
										" · ",
										overall,
										"% of the path"
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "exam-summary-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [path.intake.noteIds.length, " linked"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tests" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [path.intake.deckIds.length, " linked"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "This week" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "tabular-nums",
								children: [path.progress.weekMarks, " marks"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Added" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: path.intake.extraItems.length || "None" })] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "exam-lane",
					children: [units.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "exam-unit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "exam-unit-banner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Unit ", unit.unit] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: unit.title })]
						}), unit.nodes.map((node) => {
							const index = path.nodes.findIndex((n) => n.id === node.id);
							const state = pathNodeState(path, index);
							const Icon = nodeIcon(node.kind);
							const read = noteReadPercent(path, node.noteId);
							const score = testScoreOf(path, node.deckId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("exam-step", `shift-${index % 5}`),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: cn("exam-node", `is-${state}`, node.kind === "weekly" && "is-check"),
									"aria-label": node.title,
									onClick: () => onNode(node, index),
									children: state === "locked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" }) : state === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "exam-node-meta",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "exam-node-title",
										children: node.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "exam-node-hint",
										children: node.kind === "note" ? `Read ${read}%` : node.kind === "test" || node.kind === "weekly" ? score == null ? "Test not sat" : `Test ${score}%` : "On the target"
									})]
								})]
							}, node.id);
						})]
					}, unit.unit)), current === -1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-6 py-8 text-center font-display text-lg font-semibold",
						children: "Path complete — sit the exam when it comes."
					}) : null]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: picked != null,
			onOpenChange: (open) => !open && setPicked(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: picked.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: picked.kind === "note" ? `Reading this note counts on the path. Now at ${noteReadPercent(path, picked.noteId)}%.` : picked.kind === "test" ? testScoreOf(path, picked.deckId) == null ? "Sit this paper. The score lands on the step." : `Last sit ${testScoreOf(path, picked.deckId)}%. Sit again or mark the step done.` : picked.kind === "weekly" ? "Weekly check — sit the linked test, or mark the week after you have reviewed." : "An extra item you added to this target." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					picked.noteId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => {
							setPicked(null);
							navigate({
								to: "/notes/$noteId",
								params: { noteId: picked.noteId }
							});
						},
						children: "Open note"
					}) : null,
					picked.deckId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => {
							setPicked(null);
							navigate({
								to: "/study/$deckId",
								params: { deckId: picked.deckId },
								search: {
									mode: "study",
									pick: "due",
									count: 0,
									paper: "",
									quiz: "",
									session: ""
								}
							});
						},
						children: "Start test"
					}) : null,
					picked.extra === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void navigate({
							to: "/notes",
							search: {
								view: "list",
								folder: ""
							}
						}),
						children: "Open Notes"
					}) : null,
					picked.extra === "tests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void navigate({ to: "/" }),
						children: "Open Tests"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => finishNode(picked),
						children: "Mark this step done"
					})
				]
			})] }) : null })
		})]
	});
}
var MUTE_KEY = "setpaper-ludo-sfx";
var ctx = null;
var master = null;
var sfxBus = null;
var noiseBuffer = null;
var muted = readMuted();
var lastDiceAt = 0;
function readMuted() {
	try {
		return localStorage.getItem(MUTE_KEY) === "off";
	} catch {
		return false;
	}
}
function now() {
	return ctx?.currentTime ?? 0;
}
function isLudoMuted() {
	return muted;
}
function setLudoMuted(next) {
	muted = next;
	try {
		localStorage.setItem(MUTE_KEY, next ? "off" : "on");
	} catch {}
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .72, ctx.currentTime, .02);
}
function unlockLudoSfx() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfxBus = ctx.createGain();
		sfxBus.gain.value = .62;
		master.gain.value = muted ? 0 : .72;
		sfxBus.connect(master);
		master.connect(ctx.destination);
		noiseBuffer = makeNoise(ctx);
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") ctx?.resume();
		});
	}
	if (ctx.state === "suspended") ctx.resume();
}
function makeNoise(audio) {
	const buffer = audio.createBuffer(1, audio.sampleRate * .35, audio.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
	return buffer;
}
function envGain(peak, attack, dur, at) {
	const g = ctx.createGain();
	g.gain.setValueAtTime(1e-4, at);
	g.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak), at + attack);
	g.gain.exponentialRampToValueAtTime(1e-4, at + dur);
	g.connect(sfxBus);
	return g;
}
function tone(opts) {
	if (!ctx || !sfxBus || muted) return;
	const at = opts.at ?? now();
	const dur = opts.dur;
	const o = ctx.createOscillator();
	const g = envGain(opts.gain ?? .18, opts.attack ?? .01, dur, at);
	o.type = opts.type ?? "triangle";
	o.frequency.setValueAtTime(opts.freq, at);
	if (opts.slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, opts.slide), at + dur);
	o.connect(g);
	o.start(at);
	o.stop(at + dur + .03);
	o.onended = () => {
		o.disconnect();
		g.disconnect();
	};
}
function noise(opts) {
	if (!ctx || !sfxBus || !noiseBuffer || muted) return;
	const at = opts.at ?? now();
	const src = ctx.createBufferSource();
	src.buffer = noiseBuffer;
	const filter = ctx.createBiquadFilter();
	filter.type = opts.hp ? "highpass" : "lowpass";
	filter.frequency.value = opts.hp ?? opts.lp ?? 800;
	const g = envGain(opts.gain ?? .16, .006, opts.dur, at);
	src.connect(filter);
	filter.connect(g);
	src.start(at);
	src.stop(at + opts.dur + .02);
	src.onended = () => {
		src.disconnect();
		filter.disconnect();
		g.disconnect();
	};
}
function playLudoSfx(kind) {
	unlockLudoSfx();
	if (!ctx || muted) return;
	const t = now();
	const jitter = 1 + (Math.random() * 2 - 1) * .08;
	switch (kind) {
		case "dice":
			lastDiceAt = performance.now();
			noise({
				dur: .09,
				gain: .14,
				at: t,
				hp: 500
			});
			for (let i = 0; i < 6; i++) {
				const at = t + .045 * i + Math.random() * .02;
				tone({
					freq: (720 + i * 90) * jitter,
					dur: .045,
					type: "square",
					gain: .07,
					at
				});
				noise({
					dur: .03,
					gain: .09,
					at,
					hp: 900
				});
			}
			tone({
				freq: 180,
				dur: .14,
				type: "sine",
				gain: .22,
				at: t + .34,
				slide: 90
			});
			noise({
				dur: .08,
				gain: .12,
				at: t + .34,
				lp: 600
			});
			return;
		case "move":
			tone({
				freq: 490 * jitter,
				dur: .09,
				type: "triangle",
				gain: .2,
				slide: 320
			});
			noise({
				dur: .04,
				gain: .1,
				hp: 1200
			});
			return;
		case "capture":
			tone({
				freq: 420,
				dur: .18,
				type: "sawtooth",
				gain: .16,
				slide: 140
			});
			tone({
				freq: 220,
				dur: .22,
				type: "square",
				gain: .12,
				at: t + .05,
				slide: 90
			});
			noise({
				dur: .12,
				gain: .14,
				hp: 400
			});
			return;
		case "home":
			tone({
				freq: 523,
				dur: .14,
				type: "triangle",
				gain: .16
			});
			tone({
				freq: 659,
				dur: .16,
				type: "triangle",
				gain: .15,
				at: t + .1
			});
			tone({
				freq: 784,
				dur: .22,
				type: "triangle",
				gain: .18,
				at: t + .2
			});
			return;
		case "extra":
			tone({
				freq: 784,
				dur: .12,
				type: "sine",
				gain: .16
			});
			tone({
				freq: 988,
				dur: .16,
				type: "sine",
				gain: .14,
				at: t + .09
			});
			tone({
				freq: 1175,
				dur: .18,
				type: "sine",
				gain: .12,
				at: t + .18
			});
			return;
		case "turn":
			tone({
				freq: 392,
				dur: .12,
				type: "sine",
				gain: .12
			});
			tone({
				freq: 523,
				dur: .16,
				type: "sine",
				gain: .1,
				at: t + .08
			});
			return;
		case "win":
			[
				523,
				659,
				784,
				1046
			].forEach((freq, i) => {
				tone({
					freq,
					dur: .28,
					type: "triangle",
					gain: .18,
					at: t + i * .12
				});
			});
			return;
		case "skip":
			tone({
				freq: 180,
				dur: .16,
				type: "sine",
				gain: .16,
				slide: 110
			});
			noise({
				dur: .08,
				gain: .08,
				lp: 500
			});
	}
}
function cueLudoSfx(kinds, rolled = false, moved = false) {
	const sinceDice = performance.now() - lastDiceAt;
	if (rolled && sinceDice > 600) playLudoSfx("dice");
	if (moved) playLudoSfx("move");
	const special = kinds.find((k) => k !== "turn" && k !== "move" && k !== "dice");
	const delay = rolled ? Math.max(0, 380 - sinceDice) : moved ? 120 : 0;
	if (special) {
		window.setTimeout(() => playLudoSfx(special), delay);
		return;
	}
	if (kinds.includes("turn") && !rolled && !moved) playLudoSfx("turn");
}
function pct(cell) {
	return (cell + .5) / 15 * 100;
}
var PIP_MAP = {
	1: [[50, 50]],
	2: [[28, 28], [72, 72]],
	3: [
		[28, 28],
		[50, 50],
		[72, 72]
	],
	4: [
		[28, 28],
		[72, 28],
		[28, 72],
		[72, 72]
	],
	5: [
		[28, 28],
		[72, 28],
		[50, 50],
		[28, 72],
		[72, 72]
	],
	6: [
		[28, 28],
		[72, 28],
		[28, 50],
		[72, 50],
		[28, 72],
		[72, 72]
	]
};
var YARD_AREA = {
	blue: "1 / 1 / 7 / 7",
	yellow: "1 / 10 / 7 / 16",
	green: "10 / 10 / 16 / 16",
	red: "10 / 1 / 16 / 7"
};
function tokenPaint(token, fallback) {
	return token.stampColor === "inherit" ? fallback : token.stampColor;
}
var FALLBACK_SUBJECTS = {
	red: [
		"Rock Mechanics",
		"Mining Law",
		"Overman paper 1",
		"Notes sprint"
	],
	blue: [
		"Ventilation",
		"Mine gases",
		"Surveying",
		"First aid"
	],
	yellow: [
		"Safety",
		"Strata control",
		"Legislation",
		"Mine fires"
	],
	green: [
		"Arithmetic",
		"English",
		"Reasoning",
		"GK"
	]
};
function ludoPinLabel(token, index, color) {
	const raw = token.name.trim() || FALLBACK_SUBJECTS[color][index] || token.dayName.trim() || `Subject ${index + 1}`;
	if (raw.length <= 11) return raw;
	const first = raw.split(/\s+/).find(Boolean) ?? raw;
	if (first.length <= 11) return first;
	return first.slice(0, 10);
}
function pinInitials(label, index) {
	const parts = label.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
	const compact = label.replace(/[^A-Za-z0-9]/g, "");
	if (compact.length >= 2) return compact.slice(0, 2).toUpperCase();
	return compact.slice(0, 1).toUpperCase() || String(index + 1);
}
function LocationPin({ label, index }) {
	const init = pinInitials(label, index);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "ludo-pin",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ludo-pin-name",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 88",
			className: "ludo-pin-svg",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "ludo-pin-body",
					d: "M32 84C32 84 6 52 6 32a26 26 0 1 1 52 0C58 52 32 84 32 84z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					className: "ludo-pin-hole",
					cx: "32",
					cy: "30",
					r: "13.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					className: "ludo-pin-init",
					x: "32",
					y: "31",
					textAnchor: "middle",
					dominantBaseline: "middle",
					children: init
				})
			]
		})]
	});
}
function StarMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "ludo-star",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M12 2.6 14.4 8l5.8.5-4.4 3.8 1.4 5.6L12 15.8 6.8 17.9l1.4-5.6L3.8 8.5 9.6 8z"
		})
	});
}
function pathSquares() {
	const cells = [];
	for (let r = 0; r < 15; r++) for (let c = 0; c < 15; c++) {
		if (inYard(r, c)) continue;
		if (inHomeCenter(r, c)) continue;
		if (!onCross(r, c)) continue;
		cells.push({
			r,
			c
		});
	}
	return cells;
}
var PATH_SQUARES = pathSquares();
function LudoDieFace({ pips }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 100 100",
		className: "size-full",
		"aria-hidden": true,
		children: PIP_MAP[Math.min(6, Math.max(1, pips || 6))].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: x,
			cy: y,
			r: "8.5",
			fill: "var(--color-ludo-pip)"
		}, i))
	});
}
function LudoSeat({ board, color, myColor, rolling, canRoll, onRoll, onOpen }) {
	const col = board.columns.find((c) => c.color === color);
	const name = ludoSeatName(board, color, myColor);
	const onTarget = isActiveSeat(board, color);
	const active = onTarget && board.turnColor === color && board.phase !== "won";
	const showDie = active && (board.phase === "roll" || board.phase === "move" || Boolean(rolling));
	const played = board.rules.oncePerDay && rolledToday(board, color);
	const hint = !onTarget ? "Off this target" : played ? "Played today" : color === myColor ? "You" : col?.studentName.trim() ? "On this target" : "Open seat";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("ludo-seat", active && "is-turn", !onTarget && "is-idle"),
		"data-color": color,
		"data-corner": color,
		"data-live": onTarget ? "1" : "0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "ludo-seat-card",
			onClick: () => onOpen?.(color),
			"aria-label": `${name}, ${color} seat`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ludo-seat-avatar",
				"data-color": color,
				children: ludoSeatInitial(name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ludo-seat-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ludo-seat-name",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ludo-seat-hint",
					children: hint
				})]
			})]
		}), showDie ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("ludo-seat-die", rolling && "is-rolling", canRoll && active && "is-ready"),
			"aria-label": canRoll && color === myColor ? `Roll for ${name}` : `${name} die showing ${board.lastPips || 6}`,
			onClick: (e) => {
				e.stopPropagation();
				onRoll?.();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoDieFace, { pips: rolling ? 6 : board.lastPips || 6 })
		}) : null]
	});
}
function LudoPopupBanner({ flash, board, myColor }) {
	const copy = popupCopy(flash, board, myColor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ludo-popup",
		"data-kind": flash.kind,
		"data-color": flash.actor,
		role: "status",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ludo-popup-accent",
				"data-color": flash.actor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ludo-popup-name",
				children: copy.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ludo-popup-detail",
				children: copy.detail
			})
		]
	});
}
function LudoBoardView({ board, selectedId, legalTokenIds, legalCellKeys, rolling, canRoll, canEditNames, myColor, popup, onSelectToken, onSelectCell, onRename, onRoll, onOpenSeat }) {
	const pips = Math.min(6, Math.max(1, board.lastPips || 6));
	const occupancy = /* @__PURE__ */ new Map();
	const seatColor = myColor ?? board.playerColor;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ludo-match",
		"data-mode": board.playerMode,
		"data-active": board.activeColors.join(","),
		onPointerDown: unlockLudoSfx,
		children: [LUDO_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoSeat, {
			board,
			color,
			myColor: seatColor,
			rolling: rolling && board.turnColor === color,
			canRoll,
			onRoll,
			onOpen: onOpenSeat
		}, color)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ludo-stage",
			role: "application",
			"aria-label": "Ludo exam board",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ludo-play",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ludo-grid",
					children: [
						LUDO_COLORS.map((color) => {
							const col = board.columns.find((c) => c.color === color);
							const named = col?.studentName.trim() ?? "";
							const display = ludoSeatName(board, color, seatColor);
							const onTarget = isActiveSeat(board, color);
							const active = onTarget && board.turnColor === color && board.phase !== "won";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("ludo-yard", active && "is-turn", !onTarget && "is-idle"),
								"data-color": color,
								"data-live": onTarget ? "1" : "0",
								style: { gridArea: YARD_AREA[color] },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ludo-yard-frame",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "ludo-player-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "sr-only",
											children: [color, " player name"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "ludo-player-name",
											value: named || display,
											placeholder: display,
											maxLength: 40,
											disabled: !canEditNames,
											onChange: (e) => {
												const next = e.target.value;
												onRename?.(color, next === display && !named ? "" : next);
											},
											"aria-label": `${color} player name`
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ludo-pads",
										children: (col?.tokens ?? [
											0,
											1,
											2,
											3
										]).slice(0, 4).map((token, i) => {
											const pad = yardPad(color, i, 4);
											const origin = YARD_ORIGIN[color];
											const localR = pad.r - origin.r;
											const localC = pad.c - origin.c;
											const filled = typeof token !== "number" && token.steps < 0;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("ludo-pad-slot", filled && "is-filled"),
												"data-color": color,
												style: {
													left: `${(localC + .5) / 6 * 100}%`,
													top: `${(localR + .5) / 6 * 100}%`
												}
											}, typeof token === "number" ? `pad-${i}` : token.id);
										})
									})]
								})
							}, color);
						}),
						PATH_SQUARES.map(({ r, c }) => {
							const key = cellKey({
								r,
								c
							});
							const stretch = stretchOwner(r, c);
							const start = startOwner(r, c);
							const paint = stretch ?? start;
							const safe = isSafeBoardCell(r, c);
							const note = board.cells[key];
							const label = note?.label?.trim() ?? "";
							const hasNote = Boolean(label || note?.content?.trim());
							const legal = legalCellKeys?.has(key);
							const arrow = start && board.columns.find((col) => col.color === start)?.arrowEnabled;
							const isArray = note?.kind === "array";
							const isSunday = note?.kind === "sunday" || board.columns.some((col) => col.tokens.some((t) => t.sundayKey === key));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cn("ludo-sq", legal && "is-legal", hasNote && "is-noted", isArray && "is-array", isSunday && "is-sunday"),
								"data-color": paint ?? void 0,
								"data-safe": safe ? "1" : void 0,
								style: {
									gridRow: r + 1,
									gridColumn: c + 1
								},
								"aria-label": label || (isArray ? "Array skip" : isSunday ? "Sunday box" : `Square ${r + 1},${c + 1}`),
								onClick: () => onSelectCell?.(key, r, c),
								children: [
									safe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarMark, {}) : null,
									arrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ludo-arrow",
										"data-dir": ARROW_DIR[start]
									}) : null,
									isArray ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ludo-sq-tag",
										children: "Arr"
									}) : isSunday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ludo-sq-tag",
										children: "Sun"
									}) : null,
									label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ludo-sq-label",
										children: label
									}) : hasNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ludo-sq-dot" }) : null
								]
							}, key);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ludo-home",
							onClick: () => onRoll?.(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("ludo-tri", !isActiveSeat(board, "yellow") && "is-idle"),
									"data-dir": "top",
									"data-color": "yellow"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("ludo-tri", !isActiveSeat(board, "green") && "is-idle"),
									"data-dir": "right",
									"data-color": "green"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("ludo-tri", !isActiveSeat(board, "red") && "is-idle"),
									"data-dir": "bottom",
									"data-color": "red"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("ludo-tri", !isActiveSeat(board, "blue") && "is-idle"),
									"data-dir": "left",
									"data-color": "blue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: cn("ludo-die", rolling && "is-rolling", canRoll && "is-ready"),
									"aria-label": canRoll ? "Roll the die" : board.phase === "move" ? `Tap to move ${pips}` : `Die showing ${pips}`,
									onClick: (e) => {
										e.stopPropagation();
										onRoll?.();
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoDieFace, { pips })
								})
							]
						})
					]
				}), board.columns.flatMap((col) => col.tokens.map((token, i) => {
					const cell = tokenCell(col.color, token, i, col.tokens.length);
					const key = cellKey({
						r: Math.round(cell.r * 10) / 10,
						c: Math.round(cell.c * 10) / 10
					});
					const stack = occupancy.get(key) ?? 0;
					occupancy.set(key, stack + 1);
					const paint = tokenPaint(token, col.color);
					const selected = selectedId === token.id;
					const ready = legalTokenIds?.has(token.id);
					const inBase = token.steps < 0;
					const nudge = stack * .22;
					const label = ludoPinLabel(token, i, col.color);
					const onTarget = isActiveSeat(board, col.color);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("ludo-token", inBase && "in-yard", selected && "is-selected", ready && "is-ready", !onTarget && "is-idle"),
						"data-color": paint,
						"data-live": onTarget ? "1" : "0",
						style: {
							left: `${pct(cell.c + nudge)}%`,
							top: `${pct(cell.r + (inBase ? 0 : -.08))}%`,
							zIndex: selected ? 9 : 4 + stack
						},
						"aria-label": label,
						onClick: () => onSelectToken?.(token, col.color),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationPin, {
							label,
							index: i
						})
					}, token.id);
				}))]
			}), popup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoPopupBanner, {
				flash: popup,
				board,
				myColor: seatColor
			}, `${popup.kind}-${popup.actor}-${popup.pips ?? 0}-${popup.other ?? ""}`) : null]
		})]
	});
}
function normalizeCode$1(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
var createLudo = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "Ludo target").trim().slice(0, 120) || "Ludo target";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
	if (!hostId) throw new Error("Missing student");
	return {
		title,
		hostId,
		hostName,
		board: normalizeLudo(data.board)
	};
}).handler(createSsrRpc("d404acc9d0b75afc158bfa5469e01b7f1ade5293f1ee9347cab70876792b38c6"));
var joinLudo = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode$1(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid Ludo code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name
	};
}).handler(createSsrRpc("2f1a4f2dd367cf218acea8d9fbd78cbac7d62224c493d7f6a40a7154c9ad26fc"));
var listLudo = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode$1(code);
	if (v.length < 4) throw new Error("Enter a valid Ludo code");
	return v;
}).handler(createSsrRpc("b40089e4cb262f016cd83bd1eb174aa08142065d790c96e8b156407233dad175"));
var pushLudoBoard = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode$1(data.code);
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid Ludo code");
	if (!hostId) throw new Error("Missing host");
	return {
		code,
		hostId,
		board: normalizeLudo(data.board)
	};
}).handler(createSsrRpc("433c7c74314c88fafede667f48c978a074e81cf662534e25bba2f6998e8e9dce"));
var pushLudoColumn = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode$1(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid Ludo code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name,
		board: normalizeLudo(data.board)
	};
}).handler(createSsrRpc("f401e1a40226730fc2a1ac2bd9a187165f94c66140d8607c0a2df6a82635de6d"));
var DAY_LABELS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
var LOGOS = [
	"none",
	"book",
	"flask",
	"scale",
	"pick"
];
function sfxKinds(events) {
	const out = [];
	for (const event of events) {
		if (event.kind === "roll") continue;
		if (event.kind === "threeSix") out.push("skip");
		else out.push(event.kind);
	}
	return out;
}
function toDateInput$1(ts) {
	if (!ts) return "";
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromDateInput(value, hour = 12) {
	if (!value) return null;
	const hh = String(hour).padStart(2, "0");
	const t = (/* @__PURE__ */ new Date(`${value}T${hh}:00:00`)).getTime();
	return Number.isFinite(t) ? t : null;
}
function logoLabel(logo) {
	if (logo === "book") return "Book";
	if (logo === "flask") return "Flask";
	if (logo === "scale") return "Scale";
	if (logo === "pick") return "Pick";
	return "None";
}
function destCellKey(color, steps) {
	const cell = tokenCell(color, { steps }, 0, 1);
	return cellKey({
		r: Math.round(cell.r),
		c: Math.round(cell.c)
	});
}
function parseSundayPick(raw, board) {
	const [color, ...rest] = raw.split(":");
	const tokenId = rest.join(":");
	if (!color || !tokenId) return null;
	if (!LUDO_COLORS.includes(color)) return null;
	if (!board.columns.find((c) => c.color === color)?.tokens.some((t) => t.id === tokenId)) return null;
	return {
		tokenId,
		color
	};
}
var RULE_COPY = [
	{
		key: "oncePerDay",
		title: "One roll a day",
		detail: "Each student may complete one Ludo turn per calendar day. The shared die in the centre passes from player to player."
	},
	{
		key: "enterOnOneOrSix",
		title: "Enter on 1 or 6",
		detail: "A subject leaves the yard only on a 1 or a 6. You may bring a new piece out or advance another piece, as in Ludo."
	},
	{
		key: "captureTest",
		title: "Capture test",
		detail: "If you send another student's subject home, they must pass a test you set. The passing score is set in these rules."
	},
	{
		key: "skipArray",
		title: "Array skip",
		detail: "Landing on an array box skips the subject ahead. The skipped study day becomes a rest day."
	},
	{
		key: "sundayBoxes",
		title: "Sunday boxes",
		detail: "Each stump can place its Sunday rest on a separate board square from Manage."
	},
	{
		key: "standardLudo",
		title: "Standard Ludo",
		detail: "Classic extras still apply in study mode: extra roll on 6, on a capture, and on reaching home. Three sixes in a row forfeit the turn."
	}
];
function GameBack$1() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-card px-3 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			onClick: () => void navigate({
				to: "/target",
				search: { game: "pick" }
			}),
			children: "Back"
		})
	});
}
function LudoGame() {
	const navigate = useNavigate();
	const user = useCurrentUser();
	const prefs = useExamStore((s) => s.prefs);
	const decks = useExamStore((s) => s.decks);
	const notes = useExamStore((s) => s.notes);
	const lastSession = useExamStore((s) => s.lastSession);
	const stored = useExamStore((s) => s.ludo);
	const updateLudo = useExamStore((s) => s.updateLudo);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [manageOpen, setManageOpen] = (0, import_react.useState)(false);
	const [manageTab, setManageTab] = (0, import_react.useState)("pieces");
	const [scheduleOpen, setScheduleOpen] = (0, import_react.useState)(false);
	const [classOpen, setClassOpen] = (0, import_react.useState)(false);
	const [studentName, setStudentName] = (0, import_react.useState)("");
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [room, setRoom] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [playerId, setPlayerId] = (0, import_react.useState)("you");
	const [manageColor, setManageColor] = (0, import_react.useState)("red");
	const [rolling, setRolling] = (0, import_react.useState)(false);
	const [editKey, setEditKey] = (0, import_react.useState)(null);
	const [editLabel, setEditLabel] = (0, import_react.useState)("");
	const [editContent, setEditContent] = (0, import_react.useState)("");
	const [editKind, setEditKind] = (0, import_react.useState)("note");
	const [editSkip, setEditSkip] = (0, import_react.useState)(4);
	const [editSundayToken, setEditSundayToken] = (0, import_react.useState)("");
	const [placeMode, setPlaceMode] = (0, import_react.useState)(null);
	const [challengeDeck, setChallengeDeck] = (0, import_react.useState)("");
	const [challengeScore, setChallengeScore] = (0, import_react.useState)(50);
	const [flashQueue, setFlashQueue] = (0, import_react.useState)([]);
	const [sfxOn, setSfxOn] = (0, import_react.useState)(() => !isLudoMuted());
	const introFlash = (0, import_react.useRef)(false);
	const roomRef = (0, import_react.useRef)(room);
	roomRef.current = room;
	const board = normalizeLudo(room?.board ?? stored ?? defaultLudo());
	const canEdit = !room || room.hostId === playerId;
	const myColor = room?.students.find((s) => s.playerId === playerId)?.color ?? board.playerColor;
	const days = daysToLudoExam(board.examDate);
	const resting = ludoIsResting(board);
	const started = ludoHasStarted(board);
	const humanTurn = !isBotColumn(board, board.turnColor, myColor);
	const canRoll = canColorRoll(board, board.turnColor) && humanTurn && !rolling && !placeMode;
	const dayLocked = board.rules.oncePerDay && board.phase === "roll" && board.extraTurns === 0 && !isBotColumn(board, board.turnColor, myColor) && rolledToday(board, board.turnColor);
	const moves = board.phase === "move" ? legalMoves(board, board.turnColor, board.lastPips) : [];
	const legalTokenIds = (0, import_react.useMemo)(() => new Set(moves.map((m) => m.tokenId)), [moves]);
	const legalCellKeys = (0, import_react.useMemo)(() => new Set(moves.map((m) => destCellKey(board.turnColor, m.toSteps))), [moves, board.turnColor]);
	const study = board.phase === "study" && board.pendingCell ? cellNote(board, board.pendingCell) : null;
	const challenge = board.challenge;
	const settingTest = challenge?.status === "pending-set" && challenge.capturerColor === myColor;
	const takingTest = challenge?.status === "pending-take" && challenge.capturedColor === myColor;
	const flash = flashQueue[0] ?? null;
	const holdBots = Boolean(flash && (flash.kind === "turn" || flash.kind === "extra" || flash.kind === "skip" || flash.kind === "threeSix"));
	(0, import_react.useEffect)(() => {
		setPlayerId(quizPlayerId());
	}, []);
	(0, import_react.useEffect)(() => {
		const remembered = rememberedQuizName();
		if (remembered) setStudentName(remembered);
		else if (user?.primaryEmail) setStudentName(user.primaryEmail.split("@")[0] || "");
		else if (user?.displayName) setStudentName(user.displayName);
	}, [user]);
	(0, import_react.useEffect)(() => {
		const current = useExamStore.getState().ludo ?? defaultLudo();
		const result = tickLudoFromActivity(current, lastSession, notes);
		if (result.moved || result.board !== current) {
			if (result.board === current) return;
			updateLudo(() => result.board);
			if (result.moved) {
				if (result.reason === "test") toast.success("Test complete — bonus roll");
				if (result.reason === "note") toast.success("Notes reviewed — bonus roll");
				if (result.reason === "challenge") {
					if (!result.board.challenge) toast.success("Capture test passed — subject stays in the yard until a 1 or 6");
					else toast.message("Score was below the pass mark — retake the capture test");
				}
				const r = roomRef.current;
				if (r) {
					const display = studentName.trim() || "Student";
					if (r.hostId === playerId) pushLudoBoard({ data: {
						code: r.code,
						hostId: playerId,
						board: result.board
					} }).then(setRoom).catch(() => void 0);
					else pushLudoColumn({ data: {
						code: r.code,
						playerId,
						name: display,
						board: result.board
					} }).then(setRoom).catch(() => void 0);
				}
			}
		}
	}, [
		lastSession?.id,
		notes,
		updateLudo,
		playerId,
		studentName
	]);
	(0, import_react.useEffect)(() => {
		if (!room) return;
		let alive = true;
		const refresh = async () => {
			try {
				const next = await listLudo({ data: room.code });
				if (alive) setRoom(next);
			} catch {}
		};
		const t = window.setInterval(() => void refresh(), 2e3);
		return () => {
			alive = false;
			window.clearInterval(t);
		};
	}, [room?.code]);
	function persist(next, flashes) {
		const events = flashes === "none" ? [] : flashes ?? flashesFromBoards(board, next);
		const clean = normalizeLudo(next);
		if (events.length) setFlashQueue(events);
		const rolled = board.phase === "roll" && next.lastPips !== board.lastPips;
		const moved = board.phase === "move" && (next.phase !== "move" || Boolean(next.challenge && next.challenge.id !== board.challenge?.id));
		cueLudoSfx(sfxKinds(events), rolled, moved);
		updateLudo(() => clean);
		if (room) {
			if (room.hostId === playerId) pushLudoBoard({ data: {
				code: room.code,
				hostId: playerId,
				board: clean
			} }).then(setRoom).catch((err) => toast.error(err instanceof Error ? err.message : "Could not update the board"));
			else pushLudoColumn({ data: {
				code: room.code,
				playerId,
				name: studentName.trim() || "Student",
				board: clean
			} }).then(setRoom).catch((err) => toast.error(err instanceof Error ? err.message : "Could not update your column"));
		}
	}
	function patchBoard(fn) {
		persist(fn(board));
	}
	(0, import_react.useEffect)(() => {
		if (!flash || flash.kind === "win") return;
		const ms = flash.kind === "turn" ? 1400 : flash.kind === "roll" ? 1100 : 1500;
		const t = window.setTimeout(() => setFlashQueue((q) => q.slice(1)), ms);
		return () => window.clearTimeout(t);
	}, [flash]);
	(0, import_react.useEffect)(() => {
		if (introFlash.current) return;
		if (!started || resting || board.phase === "won") return;
		introFlash.current = true;
		if (board.phase === "roll") setFlashQueue([{
			kind: "turn",
			actor: board.turnColor
		}]);
	}, [
		started,
		resting,
		board.phase,
		board.turnColor
	]);
	(0, import_react.useEffect)(() => {
		if (!challenge) return;
		setChallengeScore(challenge.passingScore);
		setChallengeDeck(challenge.deckId ?? "");
	}, [
		challenge?.id,
		challenge?.status,
		challenge?.deckId,
		challenge?.passingScore
	]);
	(0, import_react.useEffect)(() => {
		if (!board.bots) return;
		if (board.phase === "won" || rolling) return;
		if (!started || resting) return;
		if (holdBots) return;
		if (board.phase === "challenge") {
			if (challenge?.status === "pending-set" && isBotColumn(board, challenge.capturerColor, myColor)) {
				const t = window.setTimeout(() => {
					persist(setChallengeTest(board, challenge.deckId, board.rules.passingScore));
				}, 400);
				return () => window.clearTimeout(t);
			}
			return;
		}
		if (!isBotColumn(board, board.turnColor, myColor)) return;
		if (board.phase === "roll" && !canColorRoll(board, board.turnColor)) return;
		const delay = board.phase === "roll" ? 700 : board.phase === "study" ? 400 : 550;
		const t = window.setTimeout(() => {
			if (board.phase === "roll") {
				persist(applyRoll(board, rollDie()));
				return;
			}
			if (board.phase === "move") {
				const pick = pickBotMove(board, board.turnColor, board.lastPips);
				if (pick) persist(playMove(board, board.turnColor, pick.tokenId, board.lastPips));
				else persist(passTurn(board));
				return;
			}
			if (board.phase === "study") persist(dismissStudy(board));
		}, delay);
		return () => window.clearTimeout(t);
	}, [
		board.phase,
		board.turnColor,
		board.lastMoveAt,
		board.bots,
		board.lastPips,
		myColor,
		rolling,
		started,
		resting,
		holdBots
	]);
	function roll() {
		if (rolling) return;
		unlockLudoSfx();
		if (placeMode) {
			toast.message("Tap a path square to place the box, or cancel");
			return;
		}
		if (board.phase === "move" && humanTurn) {
			const pick = pickBotMove(board, board.turnColor, board.lastPips);
			if (pick) persist(playMove(board, board.turnColor, pick.tokenId, board.lastPips));
			else persist(passTurn(board));
			return;
		}
		const blocked = whyCantRoll(board, board.turnColor);
		if (blocked || !canColorRoll(board, board.turnColor)) {
			toast.message(blocked ?? "The die is waiting");
			return;
		}
		setRolling(true);
		playLudoSfx("dice");
		window.setTimeout(() => {
			try {
				persist(applyRoll(board, rollDie()));
			} finally {
				setRolling(false);
			}
		}, 520);
	}
	function tryMove(token, color) {
		if (board.phase === "move" && color === board.turnColor && legalTokenIds.has(token.id) && humanTurn) {
			persist(playMove(board, color, token.id, board.lastPips));
			setSelected({
				token,
				color
			});
			return;
		}
		setSelected({
			token,
			color
		});
	}
	function onCell(key, _r, _c) {
		if (placeMode) {
			if (placeMode.kind === "sunday") {
				persist(placeSundayBox(board, placeMode.color, placeMode.tokenId, key));
				toast.success("Sunday box placed on the board");
			} else {
				persist(placeArrayBox(board, key));
				toast.success("Array skip placed — landing here jumps ahead");
			}
			setPlaceMode(null);
			return;
		}
		if (board.phase === "move" && humanTurn && legalCellKeys.has(key)) {
			const match = moves.filter((m) => destCellKey(board.turnColor, m.toSteps) === key);
			const chosen = selected && match.find((m) => m.tokenId === selected.token.id) ? match.find((m) => m.tokenId === selected.token.id) : match[0];
			if (chosen) {
				persist(playMove(board, board.turnColor, chosen.tokenId, board.lastPips));
				return;
			}
		}
		const note = board.cells[key];
		setEditKey(key);
		setEditLabel(note?.label ?? "");
		setEditContent(note?.content ?? "");
		setEditKind(note?.kind ?? "note");
		setEditSkip(note?.skip || board.rules.skipSteps);
		setEditSundayToken(note?.sundayTokenId ?? "");
	}
	function saveCell() {
		if (!editKey) return;
		const sunday = editKind === "sunday" ? parseSundayPick(editSundayToken, board) : null;
		persist(setCellNote(board, editKey, {
			label: editLabel,
			content: editContent,
			kind: editKind,
			skip: editKind === "array" ? editSkip : 0,
			sundayTokenId: sunday?.tokenId ?? null,
			sundayColor: sunday?.color ?? null
		}));
		setEditKey(null);
		toast.success(editKind === "array" ? "Array box saved" : editKind === "sunday" ? "Sunday box saved" : "Notebook box saved");
	}
	async function startClass() {
		const display = studentName.trim();
		if (!display) {
			toast.error("Enter your name so classmates can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("create");
		try {
			const snap = useExamStore.getState().ludo;
			const next = await createLudo({ data: {
				title: prefs.targetExamName?.trim() || "Target Exam",
				hostId: playerId,
				hostName: display,
				board: snap
			} });
			setRoom(next);
			toast.success("Class board is live — share the code");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start the board");
		} finally {
			setBusy(null);
		}
	}
	async function joinClass() {
		const display = studentName.trim();
		if (!display) {
			toast.error("Enter your name so classmates can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("join");
		try {
			const next = await joinLudo({ data: {
				code: joinCode,
				playerId,
				name: display
			} });
			setRoom(next);
			toast.success("You joined the board");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setBusy(null);
		}
	}
	const selectedCol = selected ? board.columns.find((c) => c.color === selected.color) : null;
	const status = (0, import_react.useMemo)(() => {
		if (board.phase === "won" && board.winner) return `${ludoSeatName(board, board.winner, myColor)} reached home — exam target cleared`;
		if (placeMode) return placeMode.kind === "sunday" ? "Tap a path square to place this stump's Sunday box" : "Tap a path square to place an array skip";
		if (board.phase === "challenge" && challenge) {
			const who = ludoSeatName(board, challenge.capturedColor, myColor);
			return `${ludoSeatName(board, challenge.capturerColor, myColor)} captured ${who} — pass a ${challenge.passingScore}% test`;
		}
		if (takingTest) return `You were captured — pass the test at ${challenge?.passingScore ?? 50}%`;
		if (!started) return "Target has not started yet — pieces stay still";
		if (resting) return "Rest day — pieces stay still";
		if (dayLocked) return "Everyone has played today — the centre die waits until tomorrow";
		if (board.phase === "move") return `Rolled ${board.lastPips} — tap a glowing piece to move`;
		if (board.phase === "study") return "Landed on a notebook box — review then continue";
		const who = ludoSeatName(board, board.turnColor, myColor);
		if (board.rules.oncePerDay && rolledToday(board, board.turnColor)) return `${who} already played today`;
		const extra = board.extraTurns ? ` · ${board.extraTurns} bonus roll${board.extraTurns > 1 ? "s" : ""}` : "";
		if (days != null) {
			if (days < 0) return `${who} to roll${extra}`;
			if (days < 1) return `Exam is today · ${who} to roll${extra}`;
			return `${Math.ceil(days)} days to the exam · ${who} to roll${extra}`;
		}
		return `${who} to roll${extra}`;
	}, [
		started,
		resting,
		days,
		board,
		myColor,
		placeMode,
		challenge,
		takingTest,
		dayLocked
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Ludo Game Target Achieve",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameBack$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-lg gap-4 p-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold tracking-tight",
								children: "Ludo Game Target Achieve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "icon",
								"aria-label": "Target schedule",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => setScheduleOpen(true),
									children: "When the target starts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => {
										setManageColor(myColor);
										setManageTab("pieces");
										setManageOpen(true);
									},
									children: "Open TargetXPED"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => {
										setManageColor(myColor);
										setManageTab("rules");
										setManageOpen(true);
									},
									children: "Manage rules"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										persist(applyPlayerMode(board, "two"));
										toast.success("Two player — only two columns stay on the target");
									},
									children: [board.playerMode === "two" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Two player"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										persist(applyPlayerMode(board, "four"));
										toast.success("Four player — all four columns are on the target");
									},
									children: [board.playerMode === "four" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Four player"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										navigate({ to: "/settings" });
									},
									children: [board.playerMode === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), "Custom seats"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => patchBoard((b) => ({
										...b,
										fastMode: !b.fastMode
									})),
									children: board.fastMode ? "Turn fast mode off" : "Turn fast mode on"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => {
										const next = !sfxOn;
										setSfxOn(next);
										setLudoMuted(!next);
										unlockLudoSfx();
										if (next) playLudoSfx("turn");
									},
									children: [sfxOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }), sfxOn ? "Sound off" : "Sound on"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => {
										persist(resetMatch(board), [{
											kind: "turn",
											actor: board.playerColor
										}]);
										toast.success("Pieces returned to yards");
									},
									children: "New match"
								})
							]
						})] })]
					}),
					placeMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-3d flex items-center justify-between gap-3 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: placeMode.kind === "sunday" ? "Tap any path square for this stump's Sunday." : "Tap any path square to mark an array skip."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: () => setPlaceMode(null),
							children: "Cancel"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoBoardView, {
						board,
						selectedId: selected?.token.id,
						legalTokenIds,
						legalCellKeys,
						rolling,
						canRoll: canRoll || board.phase === "move" && humanTurn,
						canEditNames: canEdit,
						myColor,
						popup: flash,
						onSelectToken: tryMove,
						onSelectCell: onCell,
						onOpenSeat: (color) => {
							setManageColor(color);
							setManageTab("pieces");
							setManageOpen(true);
						},
						onRename: (color, name) => {
							patchBoard((b) => ({
								...b,
								columns: b.columns.map((c) => c.color === color ? {
									...c,
									studentName: name.slice(0, 40)
								} : c)
							}));
							if (color === myColor) {
								setStudentName(name);
								rememberQuizName(name);
							}
						},
						onRoll: roll
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							className: "h-auto min-h-12",
							onClick: roll,
							disabled: rolling || Boolean(placeMode),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" }), rolling ? "Rolling…" : canRoll ? "Roll die" : board.phase === "move" && humanTurn ? `Move ${board.lastPips}` : takingTest ? "Take test" : dayLocked ? "Tomorrow" : "Die"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "h-auto min-h-12",
							onClick: () => {
								persist(resetMatch(board), [{
									kind: "turn",
									actor: board.playerColor
								}]);
								toast.success("New match — tap the die");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "New match"]
						})]
					}),
					selected && selectedCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-3d p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: [
									selected.color,
									" · ",
									selected.token.dayName || "subject"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-1 text-base font-semibold",
								children: selected.token.name || "Unnamed subject"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: selected.token.steps < 0 ? `In the yard — needs a ${board.rules.enterOnOneOrSix ? "1 or 6" : selectedCol.entryTurn} to start` : selected.token.steps >= 57 ? "Home" : `Step ${selected.token.steps} of 57`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [selected.token.deckId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									onClick: () => void navigate({
										to: "/study/$deckId",
										params: { deckId: selected.token.deckId },
										search: {
											mode: "study",
											pick: "due",
											count: 0,
											paper: "",
											quiz: "",
											session: ""
										}
									}),
									children: "Start test"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => void navigate({
										to: "/notes",
										search: {
											view: "list",
											folder: ""
										}
									}),
									children: "Review notes"
								}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									onClick: () => {
										setManageColor(selected.color);
										setManageTab("pieces");
										setManageOpen(true);
									},
									children: "Edit in TargetXPED"
								}), board.rules.sundayBoxes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => {
										setPlaceMode({
											kind: "sunday",
											tokenId: selected.token.id,
											color: selected.color
										});
										toast.message("Tap a path square for this Sunday box");
									},
									children: "Place Sunday"
								}) : null] }) : null]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Tap any path square to name it, mark an array skip, or place a Sunday. The die in the centre is shared — one column at a time, once a day. Empty seats wait for you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							className: "h-auto min-h-12",
							onClick: () => {
								setManageColor(myColor);
								setManageTab("pieces");
								setManageOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), "TargetXPED"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							className: "h-auto min-h-12",
							onClick: () => setClassOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), room ? `${room.students.length}/4` : "Class"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(study && board.pendingCell),
				onOpenChange: (open) => !open && persist(dismissStudy(board)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: study?.label || "Notebook box" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "You landed on a study square. Review it, then keep playing." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-sm leading-relaxed",
						children: study?.content || "No notes on this box yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => persist(dismissStudy(board)),
							children: "Got it — continue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => void navigate({
								to: "/notes",
								search: {
									view: "list",
									folder: ""
								}
							}),
							children: "Open notes"
						})]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editKey != null,
				onOpenChange: (open) => !open && setEditKey(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Manage box" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Notebook, array skip, or Sunday rest. Array skips the subject ahead and makes that study day a rest day." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "box-label",
							children: "Box name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "box-label",
							className: "mt-2",
							value: editLabel,
							maxLength: 24,
							placeholder: "e.g. Ventilation",
							onChange: (e) => setEditLabel(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "box-kind",
							children: "Box type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "box-kind",
							className: "mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
							value: editKind,
							disabled: !canEdit,
							onChange: (e) => setEditKind(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "note",
									children: "Notebook"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "array",
									children: "Array skip"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "sunday",
									children: "Sunday rest"
								})
							]
						})] }),
						editKind === "array" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "box-skip",
							children: "Skip ahead (steps)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "box-skip",
							className: "mt-2",
							type: "number",
							min: 1,
							max: 12,
							value: editSkip,
							disabled: !canEdit,
							onChange: (e) => setEditSkip(Math.min(12, Math.max(1, Number(e.target.value) || 4)))
						})] }) : null,
						editKind === "sunday" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "box-sunday",
							children: "Stump that rests here"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "box-sunday",
							className: "mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
							value: editSundayToken,
							disabled: !canEdit,
							onChange: (e) => setEditSundayToken(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Choose a stump"
							}), board.columns.flatMap((col) => col.tokens.map((token, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: `${col.color}:${token.id}`,
								children: [
									col.color,
									" · ",
									token.name || `Piece ${i + 1}`
								]
							}, token.id)))]
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "box-content",
							children: "Notes or question"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "box-content",
							className: "mt-2 min-h-32",
							value: editContent,
							placeholder: "Paste a formula, definition, or practice question",
							onChange: (e) => setEditContent(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: saveCell,
							disabled: !canEdit,
							children: "Save box"
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: scheduleOpen,
				onOpenChange: setScheduleOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "When the target starts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Pieces stay still until this date, and on rest days. Choose two or four columns from the menu, or pick exact seats in Settings." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ludo-start",
							children: "Target start"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ludo-start",
							className: "mt-2",
							type: "date",
							value: toDateInput$1(board.startedAt),
							disabled: !canEdit,
							onChange: (e) => patchBoard((b) => ({
								...b,
								startedAt: fromDateInput(e.target.value, 0)
							}))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ludo-exam",
							children: "Exam date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ludo-exam",
							className: "mt-2",
							type: "date",
							value: toDateInput$1(board.examDate),
							disabled: !canEdit,
							onChange: (e) => patchBoard((b) => ({
								...b,
								examDate: fromDateInput(e.target.value)
							}))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Fast mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Extra bonus rolls from tests"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: board.fastMode,
								disabled: !canEdit,
								onCheckedChange: (v) => patchBoard((b) => ({
									...b,
									fastMode: v
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Rest days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: DAY_LABELS.map((label, i) => {
								const on = board.restDays.includes(i);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: on ? "default" : "outline",
									disabled: !canEdit,
									onClick: () => patchBoard((b) => ({
										...b,
										restDays: on ? b.restDays.filter((d) => d !== i) : [...b.restDays, i].sort()
									})),
									children: label
								}, label);
							})
						})] }),
						board.restDates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Skipped rest dates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Added when a subject hits an array or Sunday box."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: board.restDates.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "secondary",
									disabled: !canEdit,
									onClick: () => patchBoard((b) => ({
										...b,
										restDates: b.restDates.filter((x) => x !== d)
									})),
									children: d
								}, d))
							})
						] }) : null
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: manageOpen,
				onOpenChange: setManageOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-dvh max-w-2xl overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: manageTab === "rules" ? "Manage rules" : "TargetXPED" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: manageTab === "rules" ? "Enable, disable, or edit study-mode rules. Custom rules can be added for this exam." : "Edit columns, subjects, Sunday boxes, and stamps. Up to 10 subjects per student." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: manageTab,
						onValueChange: (v) => setManageTab(v === "rules" ? "rules" : "pieces"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "pieces",
									className: "flex-1",
									children: "Manage sections"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "rules",
									className: "flex-1",
									children: "Rules"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "pieces",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TargetXped, {
									board,
									color: manageColor,
									onColor: setManageColor,
									canEdit,
									decks: decks.map((d) => ({
										id: d.id,
										name: d.name
									})),
									myColor,
									onChange: persist,
									onPlaceSunday: (color, tokenId) => {
										setManageOpen(false);
										setPlaceMode({
											kind: "sunday",
											tokenId,
											color
										});
									},
									onPlaceArray: () => {
										setManageOpen(false);
										setPlaceMode({ kind: "array" });
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "rules",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoRulesPanel, {
									board,
									canEdit,
									onChange: persist
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(settingTest && challenge),
				onOpenChange: (open) => {
					if (!open && settingTest) persist(setChallengeTest(board, challenge?.deckId ?? null, challengeScore));
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: challenge ? `${ludoSeatName(board, challenge.capturerColor, myColor)} captured ${ludoSeatName(board, challenge.capturedColor, myColor)}` : "Set a capture test" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: challenge ? `${challenge.tokenName || "A subject"} was sent home. Set a test at ${challengeScore}% for ${ludoSeatName(board, challenge.capturedColor, myColor)}.` : "Set a passing score for the captured student." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cap-deck",
							children: "Test paper"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "cap-deck",
							className: "mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
							value: challengeDeck,
							onChange: (e) => setChallengeDeck(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Notes only — mark after review"
							}), decks.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.name
							}, d.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cap-score",
							children: "Passing score (%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "cap-score",
							className: "mt-2",
							type: "number",
							min: 1,
							max: 100,
							value: challengeScore,
							onChange: (e) => setChallengeScore(Math.min(100, Math.max(1, Number(e.target.value) || 50)))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => {
								persist(setChallengeTest(board, challengeDeck || null, challengeScore));
								toast.success("Capture test set");
							},
							children: "Set test"
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(takingTest && challenge),
				onOpenChange: () => void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					showClose: false,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: challenge ? `${ludoSeatName(board, challenge.capturerColor, myColor)} captured you` : "Capture test" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: challenge ? `${ludoSeatName(board, challenge.capturerColor, myColor)} sent ${challenge.tokenName || "your subject"} home. Pass at ${challenge.passingScore}% to keep playing on your next day.` : "Pass the capture test to keep playing." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [challenge?.deckId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void navigate({
								to: "/study/$deckId",
								params: { deckId: challenge.deckId },
								search: {
									mode: "study",
									pick: "all",
									count: 0,
									paper: "",
									quiz: "",
									session: ""
								}
							}),
							children: "Start test"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void navigate({
								to: "/notes",
								search: {
									view: "list",
									folder: ""
								}
							}),
							children: "Review notes"
						}), !challenge?.deckId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								persist(dismissChallenge({
									...board,
									challenge: {
										...challenge,
										status: "pending-take"
									}
								}));
								toast.success("Marked as reviewed");
							},
							children: "I reviewed — continue"
						}) : null]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: classOpen,
				onOpenChange: setClassOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Class board" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Up to ",
					4,
					" students, one color each."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ludo-name",
						children: "Your name on the board"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ludo-name",
						className: "mt-2",
						value: studentName,
						onChange: (e) => setStudentName(e.target.value),
						placeholder: "Shown on your column"
					})] }), room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tracking-widest",
								children: room.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									room.students.length,
									"/",
									4,
									" playing",
									room.hostId === playerId ? " · you are hosting" : "",
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2",
								children: room.students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 truncate font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ludo-chip-dot",
												"data-color": s.color
											}),
											s.name,
											s.playerId === playerId ? " (you)" : ""
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize text-muted-foreground",
										children: s.color
									})]
								}, s.playerId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => {
										navigator.clipboard?.writeText(room.code);
										toast.success("Code copied");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }), "Copy code"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => setRoom(null),
									children: "Leave board"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => void startClass(),
								disabled: busy === "create",
								children: busy === "create" ? "Starting…" : "Start a class board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ludo-code",
								children: "Join with a code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ludo-code",
								value: joinCode,
								onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
								placeholder: "ABC123",
								className: "font-mono tracking-widest",
								autoCapitalize: "characters"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => void joinClass(),
								disabled: busy === "join",
								children: busy === "join" ? "Joining…" : "Join class board"
							})
						]
					})]
				})] })
			})
		]
	});
}
function TargetXped({ board, color, onColor, canEdit, decks, myColor, onChange, onPlaceSunday, onPlaceArray }) {
	const col = board.columns.find((c) => c.color === color);
	if (!col) return null;
	const column = col;
	const canEditTokens = canEdit || color === myColor;
	function patchColumn(patch) {
		onChange({
			...board,
			columns: board.columns.map((c) => c.color === color ? {
				...c,
				...patch
			} : c)
		});
	}
	function setTokenCount(n) {
		const tokenCount = Math.min(10, Math.max(4, n));
		patchColumn({
			tokenCount,
			tokens: makeLudoTokens(color, tokenCount, column.tokens)
		});
	}
	function patchToken(id, patch) {
		patchColumn({ tokens: column.tokens.map((t) => t.id === id ? {
			...t,
			...patch
		} : t) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-1",
				children: LUDO_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: c === color ? "default" : "outline",
					onClick: () => onColor(c),
					className: `capitalize${!isActiveSeat(board, c) ? " opacity-40" : ""}`,
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "xped-student",
				children: "Student on this column"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "xped-student",
				className: "mt-2",
				value: col.studentName,
				disabled: !canEditTokens,
				onChange: (e) => patchColumn({ studentName: e.target.value }),
				placeholder: "Open seat"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "xped-count",
						children: "Subjects (pieces)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "xped-count",
						className: "mt-2",
						type: "number",
						min: 4,
						max: 10,
						value: col.tokenCount,
						disabled: !canEdit,
						onChange: (e) => setTokenCount(Number(e.target.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "xped-daily",
						children: "Daily target"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "xped-daily",
						className: "mt-2",
						type: "number",
						min: 1,
						max: 40,
						value: col.dailyTarget,
						disabled: !canEdit,
						onChange: (e) => patchColumn({ dailyTarget: Math.min(40, Math.max(1, Number(e.target.value) || 1)) })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "xped-entry",
						children: "Arrow · entry turn"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "xped-entry",
						className: "mt-2",
						type: "number",
						min: 1,
						max: 6,
						value: col.entryTurn,
						disabled: !canEdit,
						onChange: (e) => patchColumn({ entryTurn: Math.min(6, Math.max(1, Number(e.target.value) || 6)) })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Show arrows"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: col.arrowEnabled,
								disabled: !canEdit,
								onCheckedChange: (v) => patchColumn({ arrowEnabled: v })
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				disabled: !canEdit,
				onClick: onPlaceArray,
				children: "Place array skip on the board"
			}),
			color === myColor ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				disabled: !canEdit,
				onClick: () => {
					let next = {
						...board,
						playerColor: color
					};
					if (board.playerMode === "two") next = applyPlayerMode(next, "two");
					else if (!isActiveSeat(board, color)) next = applyActiveColors(next, [...board.activeColors, color]);
					else next = {
						...next,
						turnColor: color
					};
					onChange(next);
				},
				children: "Make this your column"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: col.tokens.map((token, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-2 rounded-lg border border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: ["Piece ", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: token.name,
							disabled: !canEditTokens,
							onChange: (e) => patchToken(token.id, { name: e.target.value }),
							placeholder: "Subject name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Linked test"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "mt-1 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
									value: token.deckId ?? "",
									disabled: !canEditTokens,
									onChange: (e) => patchToken(token.id, { deckId: e.target.value || null }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Notes only"
									}), decks.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: d.id,
										children: d.name
									}, d.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Day stamp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									value: token.dayName,
									disabled: !canEditTokens,
									onChange: (e) => patchToken(token.id, { dayName: e.target.value }),
									placeholder: "Mon"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Stamp color"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "mt-1 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
									value: token.stampColor,
									disabled: !canEditTokens,
									onChange: (e) => patchToken(token.id, { stampColor: e.target.value }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inherit",
										children: "Column color"
									}), LUDO_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										className: "capitalize",
										children: c
									}, c))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Logo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
									value: token.logo,
									disabled: !canEditTokens,
									onChange: (e) => patchToken(token.id, { logo: e.target.value }),
									children: LOGOS.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: logo,
										children: logoLabel(logo)
									}, logo))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Sunday box"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: token.sundayKey || "Not placed",
											readOnly: true,
											className: "font-mono text-xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											className: "shrink-0",
											disabled: !canEditTokens,
											onClick: () => onPlaceSunday(color, token.id),
											children: "Place"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Arrangement (steps, −1 yard · 57 home)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1",
										type: "number",
										min: -1,
										max: 57,
										value: token.steps,
										disabled: !canEdit,
										onChange: (e) => patchToken(token.id, { steps: Math.min(57, Math.max(-1, Number(e.target.value))) })
									})]
								})
							]
						})
					]
				}, token.id))
			})
		]
	});
}
function LudoRulesPanel({ board, canEdit, onChange }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [detail, setDetail] = (0, import_react.useState)("");
	function patchRules(patch) {
		onChange({
			...board,
			rules: {
				...board.rules,
				...patch
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Study mode keeps the Ludo die in the centre. Toggle a rule off if it does not fit this exam."
			}),
			RULE_COPY.map((rule) => {
				const on = Boolean(board.rules[rule.key]);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 rounded-lg border border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: rule.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: rule.detail
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: on,
								disabled: !canEdit,
								onCheckedChange: (v) => patchRules({ [rule.key]: v })
							})]
						}),
						rule.key === "captureTest" && on ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rule-pass",
							children: "Passing score (%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rule-pass",
							className: "mt-2",
							type: "number",
							min: 1,
							max: 100,
							value: board.rules.passingScore,
							disabled: !canEdit,
							onChange: (e) => patchRules({ passingScore: Math.min(100, Math.max(1, Number(e.target.value) || 50)) })
						})] }) : null,
						rule.key === "skipArray" && on ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rule-skip",
							children: "Default skip (steps)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rule-skip",
							className: "mt-2",
							type: "number",
							min: 1,
							max: 12,
							value: board.rules.skipSteps,
							disabled: !canEdit,
							onChange: (e) => patchRules({ skipSteps: Math.min(12, Math.max(1, Number(e.target.value) || 4)) })
						})] }) : null
					]
				}, rule.key);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-lg border border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Custom rules"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Add exam-specific rules. They can be switched on or off like the defaults."
					})] }),
					board.customRules.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: board.customRules.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "grid gap-2 rounded-md border border-border p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: rule.title
									}), rule.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs leading-relaxed text-muted-foreground",
										children: rule.detail
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: rule.enabled,
										disabled: !canEdit,
										onCheckedChange: (v) => onChange(patchCustomRule(board, rule.id, { enabled: v }))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "icon",
										variant: "ghost",
										disabled: !canEdit,
										"aria-label": `Remove ${rule.title}`,
										onClick: () => onChange(removeCustomRule(board, rule.id)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								})]
							})
						}, rule.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No custom rules yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "custom-title",
						children: "Rule title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "custom-title",
						className: "mt-2",
						value: title,
						disabled: !canEdit,
						maxLength: 80,
						placeholder: "e.g. No phones on rest days",
						onChange: (e) => setTitle(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "custom-detail",
						children: "Detail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "custom-detail",
						className: "mt-2 min-h-20",
						value: detail,
						disabled: !canEdit,
						placeholder: "How this rule applies during the exam run-up",
						onChange: (e) => setDetail(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						disabled: !canEdit || !title.trim(),
						onClick: () => {
							onChange(addCustomRule(board, title, detail));
							setTitle("");
							setDetail("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add custom rule"]
					})
				]
			})
		]
	});
}
/** Shared geometry for the Target Exam river. SVG space 360×940 maps to a 3D XZ valley. */
var RIVER_VB = {
	w: 360,
	h: 940
};
var RIVER_PATH = "M 180 48 C 62 96, 44 156, 86 208 S 318 268, 286 332 S 48 404, 82 468 S 322 538, 278 604 S 50 678, 96 742 S 210 804, 180 848";
var ROCKS = [
	{
		cx: 262,
		cy: 168,
		rx: 28,
		ry: 18,
		rotate: -18
	},
	{
		cx: 78,
		cy: 292,
		rx: 26,
		ry: 16,
		rotate: 22
	},
	{
		cx: 274,
		cy: 422,
		rx: 30,
		ry: 18,
		rotate: -12
	},
	{
		cx: 72,
		cy: 552,
		rx: 24,
		ry: 16,
		rotate: 16
	},
	{
		cx: 268,
		cy: 678,
		rx: 28,
		ry: 17,
		rotate: -20
	}
];
var measurer = null;
function pathEl() {
	if (typeof document === "undefined") return null;
	if (!measurer) {
		measurer = document.createElementNS("http://www.w3.org/2000/svg", "path");
		measurer.setAttribute("d", RIVER_PATH);
	}
	return measurer;
}
function pointOnPath(path, t) {
	const len = path.getTotalLength();
	const at = Math.min(1, Math.max(0, t)) * len;
	const p = path.getPointAtLength(at);
	const p2 = path.getPointAtLength(Math.min(len, at + 2));
	const dx = p2.x - p.x;
	const dy = p2.y - p.y;
	const mag = Math.hypot(dx, dy) || 1;
	return {
		x: p.x,
		y: p.y,
		tx: dx / mag,
		ty: dy / mag,
		nx: -dy / mag,
		ny: dx / mag
	};
}
function pointAlongRiver(t) {
	const path = pathEl();
	if (!path) return {
		x: 180,
		y: 48 + Math.min(1, Math.max(0, t)) * 800,
		tx: 0,
		ty: 1,
		nx: -1,
		ny: 0
	};
	return pointOnPath(path, t);
}
function logoFor(kind) {
	if (kind === "bridge") return "/river/bridge.png";
	if (kind === "flood") return "/river/flood.png";
	return "/river/subject.png";
}
function RiverMap({ nodes, avatars, selectedId, onSelectNode }) {
	const uid = (0, import_react.useId)().replace(/:/g, "");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const seaReached = avatars.some((a) => a.self && a.progress >= .999);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	const placed = (0, import_react.useMemo)(() => {
		if (!ready) return [];
		return nodes.map((node) => ({
			node,
			at: pointAlongRiver(node.t)
		}));
	}, [nodes, ready]);
	const boats = (0, import_react.useMemo)(() => {
		if (!ready) return [];
		return avatars.map((a, i) => {
			const t = .06 + Math.min(1, Math.max(0, a.progress)) * .86;
			return {
				...a,
				at: pointAlongRiver(t),
				slot: i
			};
		});
	}, [avatars, ready]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "river-stage",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: `0 0 ${RIVER_VB.w} ${RIVER_VB.h}`,
				preserveAspectRatio: "xMidYMin meet",
				className: "absolute inset-0 size-full",
				role: "img",
				"aria-label": "River to the sea",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `translate(180 0) scale(${zoom}) translate(-180 0)`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
								id: `${uid}-grass`,
								patternUnits: "userSpaceOnUse",
								width: "160",
								height: "160",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
									href: "/river/grass.jpg",
									width: "160",
									height: "160"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
								id: `${uid}-water`,
								patternUnits: "userSpaceOnUse",
								width: "80",
								height: "80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
									href: "/river/water.jpg",
									width: "80",
									height: "80"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
								id: `${uid}-sand`,
								patternUnits: "userSpaceOnUse",
								width: "90",
								height: "90",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
									href: "/river/sand.jpg",
									width: "90",
									height: "90"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
								id: `${uid}-rock`,
								patternUnits: "userSpaceOnUse",
								width: "70",
								height: "70",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
									href: "/river/rock.jpg",
									width: "70",
									height: "70"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: `${uid}-sea`,
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--color-river)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--color-sea)"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							width: RIVER_VB.w,
							height: RIVER_VB.h,
							fill: `url(#${uid}-grass)`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
							cx: "180",
							cy: "900",
							rx: "150",
							ry: "70",
							fill: `url(#${uid}-sea)`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: RIVER_PATH,
							fill: "none",
							stroke: `url(#${uid}-sand)`,
							strokeWidth: "38",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: RIVER_PATH,
							className: "river-flow",
							fill: "none",
							stroke: `url(#${uid}-water)`,
							strokeWidth: "22",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						ROCKS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
							cx: r.cx,
							cy: r.cy,
							rx: r.rx,
							ry: r.ry,
							transform: `rotate(${r.rotate} ${r.cx} ${r.cy})`,
							fill: `url(#${uid}-rock)`
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
							href: "/river/source.png",
							x: "156",
							y: "20",
							width: "48",
							height: "48"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "180",
							y: "82",
							textAnchor: "middle",
							fill: "var(--color-foreground)",
							fontSize: "12",
							fontWeight: "600",
							children: "Source"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
							href: "/river/sea.png",
							x: "150",
							y: "868",
							width: "60",
							height: "60"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "180",
							y: "860",
							textAnchor: "middle",
							fill: "var(--color-primary-foreground)",
							fontSize: "12",
							fontWeight: "600",
							children: "Sea"
						}),
						placed.map(({ node, at }) => {
							const size = node.id === selectedId ? 40 : 32;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								role: "button",
								tabIndex: 0,
								className: "cursor-pointer",
								onClick: () => onSelectNode?.(node.id),
								onKeyDown: (e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onSelectNode?.(node.id);
									}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
										href: logoFor(node.kind),
										x: at.x - size / 2,
										y: at.y - size / 2,
										width: size,
										height: size
									}),
									node.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: at.x + 12,
										cy: at.y - 12,
										r: "5",
										fill: "var(--color-review)"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: at.x,
										y: at.y - size / 2 - 6,
										textAnchor: "middle",
										fill: "var(--color-foreground)",
										fontSize: "11",
										fontWeight: "600",
										children: node.title.length > 18 ? `${node.title.slice(0, 16)}…` : node.title
									})
								]
							}, node.id);
						}),
						boats.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							className: "river-bob",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
								href: "/river/kayak.png",
								x: a.at.x - 14 + a.slot * 10,
								y: a.at.y - 14,
								width: "28",
								height: "28"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: a.at.x + a.slot * 10,
								y: a.at.y - 18,
								textAnchor: "middle",
								fill: "var(--color-foreground)",
								fontSize: "10",
								fontWeight: "600",
								children: a.self ? "You" : a.name
							})]
						}, a.id))
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 top-3 z-10 flex gap-1 rounded-xl bg-card/90 p-1 shadow-raised",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						"aria-label": "Zoom in",
						onClick: () => setZoom((z) => Math.min(2.2, z + .25)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						"aria-label": "Zoom out",
						onClick: () => setZoom((z) => Math.max(.8, z - .25)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						"aria-label": "Fit river",
						onClick: () => setZoom(1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
					})
				]
			}),
			seaReached ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground shadow-raised",
				children: "You reached the sea"
			}) : null
		]
	});
}
function normalizeCode(raw) {
	return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
var createRiver = createServerFn({ method: "POST" }).validator((data) => {
	const title = String(data.title || "Class river").trim().slice(0, 120) || "Class river";
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	const hostName = String(data.hostName || "Host").trim().slice(0, 40) || "Host";
	if (!hostId) throw new Error("Missing student");
	return {
		title,
		hostId,
		hostName,
		journey: normalizeJourney(data.journey)
	};
}).handler(createSsrRpc("f88e11abf94b0c420dbda27a888b78ade73215f2f7bd965546aef59d414f23d2"));
var joinRiver = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid river code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name
	};
}).handler(createSsrRpc("69dcb7669bd8261fd8e953ce0dad6bed345c60e7d52dfb9367ba6eba9f1e6a2d"));
var listRiver = createServerFn({ method: "GET" }).validator((code) => {
	const v = normalizeCode(code);
	if (v.length < 4) throw new Error("Enter a valid river code");
	return v;
}).handler(createSsrRpc("c16b0eaecbcebcbf6a1f757b6feeb2f49ae569417499ee3ac4ff3d04877dcd50"));
var pushRiverJourney = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const hostId = String(data.hostId || "").trim().slice(0, 64);
	if (code.length < 4) throw new Error("Enter a valid river code");
	if (!hostId) throw new Error("Missing host");
	return {
		code,
		hostId,
		journey: normalizeJourney(data.journey)
	};
}).handler(createSsrRpc("67f350380a5764c9d4a197d6050af8e68ef6a1f94f43da90e4da42a698fe4f46"));
var pushRiverProgress = createServerFn({ method: "POST" }).validator((data) => {
	const code = normalizeCode(data.code);
	const playerId = String(data.playerId || "").trim().slice(0, 64);
	const name = String(data.name || "Student").trim().slice(0, 40) || "Student";
	if (code.length < 4) throw new Error("Enter a valid river code");
	if (!playerId) throw new Error("Missing student");
	return {
		code,
		playerId,
		name,
		doneIds: Array.isArray(data.doneIds) ? data.doneIds.map(String).filter(Boolean).slice(0, 40) : []
	};
}).handler(createSsrRpc("49e4a7c4628dfba9c501a76daa05955036817251bc971c2be0066368002b95c5"));
function toDateInput(ts) {
	if (!ts) return "";
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function kindLabel(kind) {
	if (kind === "bridge") return "Bridge · exam test";
	if (kind === "flood") return "Flood · accelerated study";
	return "River encounter · subject";
}
function TargetExamPage() {
	const { game } = Route$13.useSearch();
	if (game === "river") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiverGame, {});
	if (game === "ludo") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoGame, {});
	if (game === "pick") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TargetPicker, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPathHome, {});
}
function GameBack() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-card px-3 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			onClick: () => void navigate({
				to: "/target",
				search: { game: "home" }
			}),
			children: "Back"
		})
	});
}
function TargetPicker() {
	const navigate = useNavigate();
	const prefs = useExamStore((s) => s.prefs);
	const setPrefs = useExamStore((s) => s.setPrefs);
	const name = prefs.targetExamName?.trim() || "Target Exam";
	const [renameOpen, setRenameOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(name);
	(0, import_react.useEffect)(() => {
		setDraft(name);
	}, [name]);
	function saveName() {
		const next = draft.trim() || "Target Exam";
		setPrefs({ targetExamName: next });
		setRenameOpen(false);
		toast.success(`Section renamed to ${next}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: name,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-lg gap-4 p-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Optional boards alongside the daily path."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => setRenameOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Rename"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-4",
					children: [{
						game: "river",
						title: "River Game Target Achieve",
						hint: "Subjects, tests, and floods along a river to the sea.",
						image: "/river/sea.png"
					}, {
						game: "ludo",
						title: "Ludo Game Target Achieve",
						hint: "Play like Ludo King — label every square with exam notes.",
						image: "/river/ludo.jpg"
					}].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "surface-3d lift flex min-h-36 w-full items-center gap-4 px-4 py-4 text-left",
						onClick: () => void navigate({
							to: "/target",
							search: { game: item.game }
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: "",
									className: "size-20 object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display block text-lg font-semibold tracking-tight",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-muted-foreground",
									children: item.hint
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted-foreground" })
						]
					}) }, item.game))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => void navigate({
						to: "/target",
						search: { game: "home" }
					}),
					children: "Back to the path"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: renameOpen,
			onOpenChange: setRenameOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Rename this section" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Examples: GATE, NEET, Overman, SSC CGL. This is the name on the bottom bar." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "target-name",
					children: "Section name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "target-name",
					className: "mt-2",
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Target Exam",
					onKeyDown: (e) => {
						if (e.key === "Enter") saveName();
					}
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: saveName,
					children: "Save name"
				})]
			})] })
		})]
	});
}
function RiverGame() {
	const navigate = useNavigate();
	const user = useCurrentUser();
	const prefs = useExamStore((s) => s.prefs);
	const decks = useExamStore((s) => s.decks);
	const journey = useExamStore((s) => s.journey);
	const updateJourney = useExamStore((s) => s.updateJourney);
	const lastSession = useExamStore((s) => s.lastSession);
	const [addKind, setAddKind] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [deckId, setDeckId] = (0, import_react.useState)("");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [studentName, setStudentName] = (0, import_react.useState)("");
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [room, setRoom] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [playerId, setPlayerId] = (0, import_react.useState)("you");
	const [classOpen, setClassOpen] = (0, import_react.useState)(false);
	const liveJourney = withAutoFlood(room?.journey ?? journey ?? {
		examDate: null,
		floodDays: 14,
		nodes: []
	});
	const canEdit = !room || room.hostId === playerId;
	const me = room?.students.find((s) => s.playerId === playerId);
	const myDone = (0, import_react.useMemo)(() => {
		if (me) return new Set(me.doneIds);
		return new Set((liveJourney.nodes ?? []).filter((n) => n.done).map((n) => n.id));
	}, [me, liveJourney.nodes]);
	const displayNodes = (0, import_react.useMemo)(() => (liveJourney.nodes ?? []).map((n) => ({
		...n,
		done: myDone.has(n.id)
	})), [liveJourney.nodes, myDone]);
	const myProgress = journeyProgress(displayNodes, [...myDone]);
	const selected = displayNodes.find((n) => n.id === selectedId) ?? null;
	const days = daysToExam(liveJourney.examDate);
	const floodOpen = floodIsOpen(liveJourney);
	const avatars = room ? room.students.map((s) => ({
		id: s.playerId,
		name: s.name,
		progress: s.progress,
		self: s.playerId === playerId,
		hue: s.hue
	})) : [{
		id: playerId,
		name: studentName.trim() || "You",
		progress: myProgress,
		self: true,
		hue: 0
	}];
	(0, import_react.useEffect)(() => {
		setPlayerId(quizPlayerId());
	}, []);
	(0, import_react.useEffect)(() => {
		const remembered = rememberedQuizName();
		if (remembered) setStudentName(remembered);
		else if (user?.primaryEmail) setStudentName(user.primaryEmail.split("@")[0] || "");
		else if (user?.displayName) setStudentName(user.displayName);
	}, [user]);
	(0, import_react.useEffect)(() => {
		updateJourney((j) => withAutoFlood(j));
	}, [
		updateJourney,
		journey?.examDate,
		journey?.floodDays
	]);
	(0, import_react.useEffect)(() => {
		const last = lastSession;
		if (!last?.deckId) return;
		updateJourney((j) => ({
			...j,
			nodes: j.nodes.map((n) => n.kind === "bridge" && n.deckId === last.deckId ? {
				...n,
				done: true
			} : n)
		}));
	}, [
		lastSession?.id,
		lastSession?.deckId,
		updateJourney
	]);
	(0, import_react.useEffect)(() => {
		if (!room) return;
		let alive = true;
		const refresh = async () => {
			try {
				const next = await listRiver({ data: room.code });
				if (alive) setRoom(next);
			} catch {}
		};
		const t = window.setInterval(() => void refresh(), 2e3);
		return () => {
			alive = false;
			window.clearInterval(t);
		};
	}, [room?.code]);
	function persist(next) {
		const laid = {
			...next,
			nodes: layoutRiverNodes(next.nodes)
		};
		updateJourney(() => laid);
		if (room && room.hostId === playerId) pushRiverJourney({ data: {
			code: room.code,
			hostId: playerId,
			journey: laid
		} }).then(setRoom).catch((err) => toast.error(err instanceof Error ? err.message : "Could not update the river"));
	}
	function addNode() {
		if (!addKind) return;
		const label = title.trim();
		if (!label) {
			toast.error("Give this encounter a name");
			return;
		}
		if ((liveJourney.nodes?.length ?? 0) >= 16) {
			toast.error(`This river is full (16 encounters)`);
			return;
		}
		const node = {
			id: uid(),
			kind: addKind,
			title: label,
			t: .5,
			done: false,
			deckId: deckId || null,
			notes: notes.trim(),
			createdAt: Date.now()
		};
		persist({
			...liveJourney,
			nodes: [...liveJourney.nodes ?? [], node]
		});
		setAddKind(null);
		setTitle("");
		setNotes("");
		setDeckId("");
		setSelectedId(node.id);
		toast.success(addKind === "bridge" ? "Bridge added" : addKind === "flood" ? "Flood stretch added" : "Subject added to the river");
	}
	async function toggleDone(node) {
		const nextDone = new Set(myDone);
		if (nextDone.has(node.id)) nextDone.delete(node.id);
		else nextDone.add(node.id);
		if (room) {
			try {
				const display = studentName.trim() || "Student";
				rememberQuizName(display);
				const updated = await pushRiverProgress({ data: {
					code: room.code,
					playerId,
					name: display,
					doneIds: [...nextDone]
				} });
				setRoom(updated);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Could not update progress");
			}
			return;
		}
		persist({
			...liveJourney,
			nodes: (liveJourney.nodes ?? []).map((n) => n.id === node.id ? {
				...n,
				done: !n.done
			} : n)
		});
	}
	function removeNode(id) {
		persist({
			...liveJourney,
			nodes: (liveJourney.nodes ?? []).filter((n) => n.id !== id)
		});
		setSelectedId(null);
	}
	function setExamDate(value) {
		persist({
			...liveJourney,
			examDate: value ? (/* @__PURE__ */ new Date(`${value}T12:00:00`)).getTime() : null
		});
	}
	async function startClass() {
		const display = studentName.trim();
		if (!display) {
			toast.error("Enter your name so classmates can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("create");
		try {
			const snap = withAutoFlood(useExamStore.getState().journey);
			const next = await createRiver({ data: {
				title: prefs.targetExamName?.trim() || "Target Exam",
				hostId: playerId,
				hostName: display,
				journey: snap
			} });
			const doneIds = snap.nodes.filter((n) => n.done).map((n) => n.id);
			const synced = doneIds.length > 0 ? await pushRiverProgress({ data: {
				code: next.code,
				playerId,
				name: display,
				doneIds
			} }) : next;
			setRoom(synced);
			toast.success("Class river is live — share the code");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start the river");
		} finally {
			setBusy(null);
		}
	}
	async function joinClass() {
		const display = studentName.trim();
		if (!display) {
			toast.error("Enter your name so classmates can see you");
			return;
		}
		rememberQuizName(display);
		setBusy("join");
		try {
			const next = await joinRiver({ data: {
				code: joinCode,
				playerId,
				name: display
			} });
			setRoom(next);
			toast.success("You are on the river");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setBusy(null);
		}
	}
	function openAdd(kind) {
		if (!canEdit) {
			toast.message("Only the host can add encounters on a shared river");
			return;
		}
		setAddKind(kind);
		setTitle("");
		setNotes("");
		setDeckId(kind === "bridge" || kind === "flood" ? decks[0]?.id ?? "" : "");
	}
	function startEncounter(node) {
		if (node.deckId) {
			navigate({
				to: "/study/$deckId",
				params: { deckId: node.deckId },
				search: {
					mode: "study",
					pick: "due",
					count: 0,
					paper: "",
					quiz: "",
					session: ""
				}
			});
			return;
		}
		if (node.kind === "bridge") {
			navigate({ to: "/" });
			toast.message("Pick a paper from Tests, or edit this bridge and attach a deck");
			return;
		}
		toast.message("Mark this stretch done after you study");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "River Game Target Achieve",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameBack, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-lg gap-4 p-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: days != null ? days < 0 ? "Exam date has passed" : days < 1 ? "Exam is today · flood open" : `${Math.ceil(days)} days to the exam${floodOpen ? " · flood open" : ""}` : "Set the exam date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "exam-date",
								className: "sr-only",
								children: "Exam date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "exam-date",
								type: "date",
								value: toDateInput(liveJourney.examDate),
								onChange: (e) => setExamDate(e.target.value),
								disabled: !canEdit
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiverMap, {
						nodes: displayNodes,
						avatars,
						selectedId,
						onSelectNode: (id) => setSelectedId(id || null)
					}),
					selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-3d p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: kindLabel(selected.kind)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-1 text-base font-semibold",
								children: selected.title
							}),
							selected.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: selected.notes
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										onClick: () => void toggleDone(selected),
										children: selected.done ? "Mark not done" : "Mark done"
									}),
									(selected.kind === "bridge" || selected.kind === "flood") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "outline",
										onClick: () => startEncounter(selected),
										children: selected.kind === "flood" ? "Start sprint" : "Start test"
									}),
									canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										onClick: () => removeNode(selected.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
									}) : null
								]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								className: "h-auto min-h-14 flex-col gap-1 py-2",
								onClick: () => openAdd("subject"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/river/subject.png",
									alt: "",
									className: "size-8 object-contain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: "Add subject"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								className: "h-auto min-h-14 flex-col gap-1 py-2",
								onClick: () => openAdd("bridge"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/river/bridge.png",
									alt: "",
									className: "size-8 object-contain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: "Add test"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								className: "h-auto min-h-14 flex-col gap-1 py-2",
								onClick: () => openAdd("flood"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/river/flood.png",
									alt: "",
									className: "size-8 object-contain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: "Add flood"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								className: "h-auto min-h-14 flex-col gap-1 py-2",
								onClick: () => setClassOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: room ? `${room.students.length}/20` : "Class"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: classOpen,
				onOpenChange: setClassOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Class river" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Up to ",
					20,
					" students float together toward the sea."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "river-name",
						children: "Your name on the river"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "river-name",
						className: "mt-2",
						value: studentName,
						onChange: (e) => setStudentName(e.target.value),
						placeholder: "Shown on your avatar"
					})] }), room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tracking-widest",
								children: room.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									room.students.length,
									"/",
									20,
									" on the water",
									room.hostId === playerId ? " · you are hosting" : "",
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2",
								children: room.students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate font-medium",
										children: [s.name, s.playerId === playerId ? " (you)" : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [Math.round(s.progress * 100), "%"]
									})]
								}, s.playerId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => {
										navigator.clipboard?.writeText(room.code);
										toast.success("Code copied");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }), "Copy code"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => setRoom(null),
									children: "Leave river"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => void startClass(),
								disabled: busy === "create",
								children: busy === "create" ? "Starting…" : "Start a class river"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "river-code",
								children: "Join with a code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "river-code",
								value: joinCode,
								onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
								placeholder: "ABC123",
								className: "font-mono tracking-widest",
								autoCapitalize: "characters"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => void joinClass(),
								disabled: busy === "join",
								children: busy === "join" ? "Joining…" : "Join class river"
							})
						]
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addKind != null,
				onOpenChange: (open) => !open && setAddKind(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: addKind === "bridge" ? "Add a bridge test" : addKind === "flood" ? "Add a flood sprint" : "Add a subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: addKind === "bridge" ? "Bridges are exam tests across the river." : addKind === "flood" ? "Floods are accelerated study when the exam date is close." : "Subjects appear as encounters along the current." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "encounter-title",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "encounter-title",
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: addKind === "bridge" ? "Paper 1 mock" : addKind === "flood" ? "Final sprint" : "Rock Mechanics",
							onKeyDown: (e) => {
								if (e.key === "Enter") addNode();
							}
						})] }),
						(addKind === "bridge" || addKind === "flood") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "encounter-deck",
							children: "Test deck"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "encounter-deck",
							className: "mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised",
							value: deckId,
							onChange: (e) => setDeckId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None yet"
							}), decks.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.name
							}, d.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "encounter-notes",
							children: "Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "encounter-notes",
							className: "mt-2",
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							placeholder: "Optional"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: addNode,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add to river"]
						})
					]
				})] })
			})
		]
	});
}
//#endregion
export { TargetExamPage as component };
