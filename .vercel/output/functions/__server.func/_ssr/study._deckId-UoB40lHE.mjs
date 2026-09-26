import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as lastSessionForDeck, h as idsForSessionPick, s as cardsForBucket } from "./results-DOq2AZyk.mjs";
import { u as Route$2 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { kt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { C as injectExamData, E as withPatternSettings, S as applyOptionOrder, T as resolveTemplateHtml, U as activeExamTemplate, et as studyCards, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
import { r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { c as formatCountdown, d as lockUntilMs, v as remainingMs } from "./quiz-assign-i7C7lqvX.mjs";
import { r as getQuizPaper, s as listQuiz, u as submitQuizScore } from "./quiz-DNF-wQMz.mjs";
import { t as QuizLiveBar } from "./quiz-call-D175w8D7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/study._deckId-UoB40lHE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function splitIntoSections(questions, sectionSize, minutesPerQuestion, meta, pattern) {
	if (questions.length === 0) return {
		meta,
		sections: [],
		settings: pattern
	};
	const size = sectionSize === 20 ? 20 : 10;
	const sections = [];
	for (let i = 0; i < questions.length; i += size) {
		const chunk = questions.slice(i, i + size);
		const n = sections.length + 1;
		const from = i + 1;
		const to = i + chunk.length;
		sections.push({
			id: n,
			name: `Section ${n}`,
			title: `Questions ${from}–${to}`,
			timeMinutes: Math.max(1, Math.round(chunk.length * minutesPerQuestion)),
			questions: chunk.map((q, idx) => ({
				id: from + idx,
				bankId: q.id,
				type: q.type,
				rule: q.rule || "General",
				question: q.question,
				options: q.options,
				correct: q.correct,
				explanation: q.explanation || ""
			}))
		});
	}
	return {
		meta,
		sections,
		settings: pattern
	};
}
function pickQuestions(questions, count, pick) {
	if (pick === "all" || count >= questions.length) return questions.slice();
	const n = Math.max(1, Math.min(count, questions.length));
	if (pick === "first") return questions.slice(0, n);
	const copy = questions.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy.slice(0, n);
}
function poolFor(deckId, pick, paperId, sessionId) {
	const { cards, papers, sessions, lastSession } = useExamStore.getState();
	const mine = cards.filter((c) => c.deckId === deckId && c.queue !== "suspended" && c.queue !== "buried");
	if (sessionId && (pick === "wrong" || pick === "skipped" || pick === "marked" || pick === "correct" || pick === "attempted")) {
		const session = (sessions ?? []).find((s) => s.id === sessionId) ?? (lastSession?.id === sessionId ? lastSession : null);
		if (session) {
			const order = new Map(idsForSessionPick(session, pick).map((id, i) => [id, i]));
			return mine.filter((c) => order.has(c.id)).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
		}
	}
	if (pick === "due") return studyCards(deckId);
	if (pick === "new") return mine.filter((c) => c.queue === "new");
	if (pick === "forgotten") return mine.filter((c) => c.lastRating === "again" || c.lapses > 0);
	if (pick === "ahead") return mine.filter((c) => c.queue === "review");
	if (pick === "all") return mine;
	if (pick === "wrong" || pick === "skipped" || pick === "marked" || pick === "correct" || pick === "attempted") return cardsForBucket(cards, deckId, pick);
	if (pick === "paper") {
		const file = papers.find((p) => p.id === paperId);
		if (!file) return [];
		const order = new Map(file.questionIds.map((id, i) => [id, i]));
		return mine.filter((c) => order.has(c.id)).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
	}
	return mine;
}
function asCards(questions) {
	const now = Date.now();
	return questions.map((q) => ({
		id: q.id,
		deckId: "quiz",
		type: q.type,
		rule: q.rule,
		question: q.question,
		options: q.options,
		correct: q.correct,
		explanation: q.explanation,
		tags: [],
		queue: "new",
		due: 0,
		interval: 0,
		ease: 2500,
		reps: 0,
		lapses: 0,
		remainingSteps: 0,
		flag: 0,
		marked: false,
		createdAt: now,
		modifiedAt: now
	}));
}
function withQuizLock(html, lockUntil) {
	if (!(lockUntil > Date.now())) return html;
	const tag = `<script>window.__setpaperLockUntil=${lockUntil};<\/script>`;
	if (/<head>/i.test(html)) return html.replace(/<head>/i, `<head>${tag}`);
	return tag + html;
}
function Study() {
	const { deckId } = Route$2.useParams();
	const { mode, pick, count, paper, quiz, session, template: templateId, minutes } = Route$2.useSearch();
	const navigate = useNavigate();
	const deck = useExamStore((s) => s.decks.find((d) => d.id === deckId));
	const prefs = useExamStore((s) => s.prefs);
	const templates = useExamStore((s) => s.templates);
	const applyExamResults = useExamStore((s) => s.applyExamResults);
	const recorded = (0, import_react.useRef)(false);
	const [srcDoc, setSrcDoc] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [quizTitle, setQuizTitle] = (0, import_react.useState)(null);
	const [quizQs, setQuizQs] = (0, import_react.useState)(null);
	const [lockUntil, setLockUntil] = (0, import_react.useState)(0);
	const [quizRoom, setQuizRoom] = (0, import_react.useState)(null);
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		if (!quiz) {
			setQuizQs(null);
			setQuizTitle(null);
			return;
		}
		let cancelled = false;
		getQuizPaper({ data: quiz }).then((paperData) => {
			if (cancelled) return;
			setQuizTitle(paperData.title);
			setQuizQs(asCards(paperData.questions));
			setLockUntil(lockUntilMs(paperData.startedAt, paperData.timeLimitSec, paperData.serverNow));
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "Could not load friends quiz");
		});
		return () => {
			cancelled = true;
		};
	}, [quiz]);
	(0, import_react.useEffect)(() => {
		if (!quiz) return;
		let cancelled = false;
		async function refresh() {
			try {
				const next = await listQuiz({ data: {
					code: quiz,
					playerId: quizPlayerId()
				} });
				if (!cancelled) setQuizRoom(next);
			} catch {}
		}
		refresh();
		const t = window.setInterval(() => void refresh(), 2e3);
		return () => {
			cancelled = true;
			window.clearInterval(t);
		};
	}, [quiz]);
	(0, import_react.useEffect)(() => {
		if (!lockUntil) return;
		const t = window.setInterval(() => setNow(Date.now()), 400);
		return () => window.clearInterval(t);
	}, [lockUntil]);
	const paperQs = (0, import_react.useMemo)(() => {
		if (quiz) return quizQs ?? [];
		const pool = poolFor(deckId, pick, paper, session);
		return pickQuestions(pool, count > 0 ? count : pool.length, pick === "random" || pick === "all" ? "random" : "first");
	}, [
		deckId,
		pick,
		count,
		paper,
		quiz,
		quizQs,
		session
	]);
	const title = quiz ? quizTitle ?? "Friends quiz" : deck?.name.split("::").pop() ?? deck?.name ?? "Study";
	const canBuild = quiz ? quizQs !== null : Boolean(deck);
	(0, import_react.useEffect)(() => {
		if (!canBuild) return;
		if (paperQs.length === 0) {
			if (quiz && quizQs === null) return;
			setError("No questions in this study session.");
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const chosen = templateId && templates.find((t) => t.id === templateId) || activeExamTemplate();
				const pattern = { ...chosen.pattern };
				if (minutes && minutes > 0 && paperQs.length) {
					pattern.timerMode = "overall";
					pattern.minutesPerQuestion = Math.max(.5, Math.round(minutes / paperQs.length * 2) / 2);
					pattern.extraMinutes = 0;
				}
				const template = await resolveTemplateHtml(chosen);
				const ordered = applyOptionOrder(paperQs, pattern.optionOrder);
				const data = withPatternSettings(splitIntoSections(ordered, pattern.sectionSize, pattern.minutesPerQuestion, {
					title: pattern.examTitle.trim() || title,
					subtitle: quiz ? `Friends quiz ${quiz}` : pick === "paper" ? "Saved paper" : pick === "wrong" ? "Wrong questions" : pick === "skipped" ? "Unattempted questions" : pick === "marked" ? "Marked for review" : pick === "correct" ? "Correct answers" : pick === "attempted" ? "Attempted questions" : mode === "preview" ? "Preview — answers not scheduled" : "Study session",
					footer: `${ordered.length} questions · sections of ${pattern.sectionSize}`,
					candidateName: pattern.candidateName,
					candidateId: pattern.candidateId
				}, pattern), pattern);
				if (!cancelled) setSrcDoc(withQuizLock(injectExamData(template, data), lockUntil));
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "Could not build the paper.");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		canBuild,
		paperQs,
		mode,
		pick,
		quiz,
		quizQs,
		title,
		templates,
		lockUntil,
		templateId,
		minutes
	]);
	(0, import_react.useEffect)(() => {
		function onMessage(event) {
			const data = event.data;
			if (data?.source !== "setpaper-exam" || data.type !== "exam-complete" || !data.payload) return;
			if (recorded.current) return;
			recorded.current = true;
			const payload = data.payload;
			if (quiz) {
				submitQuizScore({ data: {
					code: quiz,
					playerId: quizPlayerId(),
					name: rememberedQuizName() || "Friend",
					correct: payload.correct,
					wrong: payload.wrong,
					notAttempted: payload.notAttempted,
					marked: payload.marked,
					total: payload.total,
					score: payload.score ?? payload.correct,
					items: payload.items ?? []
				} }).then(() => {
					navigate({
						to: "/quiz/$code",
						params: { code: quiz },
						search: { view: "" }
					});
				}).catch((err) => {
					const message = err instanceof Error ? err.message : "Could not save score";
					toast.error(message);
					if (/until time is up/i.test(message)) {
						recorded.current = false;
						return;
					}
					navigate({
						to: "/quiz/$code",
						params: { code: quiz },
						search: { view: "" }
					});
				});
				return;
			}
			if (!deck) return;
			if (mode === "preview") {
				toast.success(`Preview finished · ${payload.correct}/${payload.total}`);
				return;
			}
			const retry = Boolean(session) || pick === "wrong" || pick === "skipped" || pick === "marked" || pick === "correct" || pick === "attempted" || pick === "paper";
			const parent = retry ? session || lastSessionForDeck(useExamStore.getState().sessions ?? [], deck.id)?.id || useExamStore.getState().lastSession?.id : void 0;
			const summary = applyExamResults(deck.id, payload, {
				parentSessionId: parent,
				merge: retry
			});
			navigate({
				to: "/session/$deckId",
				params: { deckId: deck.id },
				search: { id: summary.id }
			});
		}
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, [
		applyExamResults,
		deck,
		mode,
		navigate,
		pick,
		quiz,
		session
	]);
	if (!quiz && !deck) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6 text-sm",
		children: "Deck not found."
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg",
			children: error
		}), quiz ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/quiz/$code",
			params: { code: quiz },
			search: {},
			className: "text-primary",
			children: "Back to scores"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/overview/$deckId",
			params: { deckId },
			className: "text-primary",
			children: "Deck overview"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-11 shrink-0 items-center justify-between px-2 text-bar-foreground",
				children: [
					quiz ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/quiz/$code",
						params: { code: quiz },
						search: {},
						className: "inline-flex h-9 items-center gap-1 px-2 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/overview/$deckId",
						params: { deckId },
						className: "inline-flex h-9 items-center gap-1 px-2 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm",
						children: title
					}),
					quiz && lockUntil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2 font-mono text-xs tabular-nums",
						children: formatCountdown(remainingMs(lockUntil, now))
					}) : prefs.showRemaining ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2 font-mono text-xs tabular-nums",
						children: paperQs.length || ""
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8" })
				]
			}),
			quiz ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizLiveBar, {
				compact: true,
				code: quiz,
				name: rememberedQuizName(),
				messages: quizRoom?.messages ?? [],
				onRoom: setQuizRoom
			}) : null,
			srcDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: "Study",
				className: "min-h-0 w-full flex-1 border-0 bg-white",
				sandbox: "allow-scripts allow-modals allow-same-origin",
				srcDoc
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-center bg-background text-sm text-muted-foreground",
				children: "Building paper…"
			})
		]
	});
}
//#endregion
export { Study as component };
