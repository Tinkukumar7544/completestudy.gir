import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as Route$19 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Label, H as Button, L as useCurrentUser, U as activeExamTemplate, V as Input, W as cn, c as AnkiShell, nt as useExamStore } from "./router-B0Z9kZGU2.mjs";
import { n as rememberQuizName, r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { _ as quizFolderOptions, b as todayIsoDate, h as pickSectionCards, n as cardsForQuizFolder, r as clampTimeLimitMin, u as groupQuizSections } from "./quiz-assign-i7C7lqvX.mjs";
import { a as joinQuiz, t as createQuiz } from "./quiz-DNF-wQMz.mjs";
import { t as PaperStartFields } from "./paper-start-u23BUBx1.mjs";
import { r as rememberPaperPrefs } from "./clipboard-wrdOgXLB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/friends-G1uJ_8SU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FriendsHub() {
	const { deck: deckParam } = Route$19.useSearch();
	const navigate = useNavigate();
	const user = useCurrentUser();
	const decks = useExamStore((s) => s.decks);
	const cards = useExamStore((s) => s.cards);
	const folders = useExamStore((s) => s.folders ?? []);
	const hydrated = useExamStore((s) => s.hydrated);
	const folderOptions = (0, import_react.useMemo)(() => quizFolderOptions(decks, cards, folders), [
		decks,
		cards,
		folders
	]);
	const [folderId, setFolderId] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [testDay, setTestDay] = (0, import_react.useState)(todayIsoDate);
	const [timeLimit, setTimeLimit] = (0, import_react.useState)("20");
	const [templateId, setTemplateId] = (0, import_react.useState)(() => activeExamTemplate()?.id ?? "");
	const [sections, setSections] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (folderId) return;
		const fromDeck = deckParam ? `deck:${deckParam}` : "";
		if (fromDeck && folderOptions.some((o) => o.id === fromDeck)) {
			setFolderId(fromDeck);
			return;
		}
		const first = folderOptions.find((o) => o.kind === "deck" && o.count > 0) ?? folderOptions[0];
		if (first) setFolderId(first.id);
	}, [
		deckParam,
		folderOptions,
		folderId
	]);
	(0, import_react.useEffect)(() => {
		const remembered = rememberedQuizName();
		if (remembered) setName(remembered);
		else if (user?.primaryEmail) setName(user.primaryEmail.split("@")[0] || "");
		else if (user?.displayName) setName(user.displayName);
	}, [user]);
	const packed = (0, import_react.useMemo)(() => cardsForQuizFolder(folderId, decks, cards, folders), [
		folderId,
		decks,
		cards,
		folders
	]);
	(0, import_react.useEffect)(() => {
		const groups = groupQuizSections(packed.cards);
		setSections(groups.map((g) => ({
			name: g.name,
			total: g.cards.length,
			selected: true,
			count: String(g.cards.length)
		})));
	}, [packed.cards]);
	const groups = (0, import_react.useMemo)(() => groupQuizSections(packed.cards), [packed.cards]);
	const picks = sections.filter((s) => s.selected).map((s) => ({
		name: s.name,
		count: Math.max(0, Math.min(s.total, Number(s.count) || 0))
	}));
	const chosen = pickSectionCards(groups, picks);
	const selectedCount = chosen.length;
	function toggleSection(name, on) {
		setSections((prev) => prev.map((s) => s.name === name ? {
			...s,
			selected: on,
			count: on ? String(s.total) : "0"
		} : s));
	}
	function setSectionCount(name, count) {
		setSections((prev) => prev.map((s) => {
			if (s.name !== name) return s;
			const n = count.replace(/[^\d]/g, "");
			return {
				...s,
				selected: true,
				count: n
			};
		}));
	}
	async function createRoom() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name so friends can see you");
			return;
		}
		if (!chosen.length) {
			toast.error("Pick at least one question from a section");
			return;
		}
		rememberQuizName(display);
		rememberPaperPrefs({
			template: templateId,
			minutes: clampTimeLimitMin(timeLimit)
		});
		setBusy(true);
		setError(null);
		try {
			const room = await createQuiz({ data: {
				title: packed.label || "Friends quiz",
				hostId: quizPlayerId(),
				hostName: display,
				testDay,
				folder: packed.label,
				sectionPicks: picks.filter((p) => p.count > 0),
				timeLimitMin: clampTimeLimitMin(timeLimit),
				questions: chosen.map((c) => ({
					id: c.id,
					type: c.type,
					rule: c.rule,
					question: c.question,
					options: c.options,
					correct: c.correct,
					explanation: c.explanation,
					sourceSection: c.sourceSection
				}))
			} });
			navigate({
				to: "/quiz/$code",
				params: { code: room.code },
				search: { view: "" }
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not create quiz";
			setError(message);
			toast.error(message);
		} finally {
			setBusy(false);
		}
	}
	async function joinRoom() {
		const display = name.trim();
		if (!display) {
			toast.error("Enter your name so friends can see you");
			return;
		}
		rememberQuizName(display);
		setBusy(true);
		try {
			const room = await joinQuiz({ data: {
				code,
				playerId: quizPlayerId(),
				name: display
			} });
			navigate({
				to: "/quiz/$code",
				params: { code: room.code },
				search: { view: "" }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not join");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Friends quiz",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-md gap-8 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Share a code like Telegram quizzes. Up to ",
						20,
						" friends join from Connect. Everyone taps Start, then the paper stays open until the time limit — it auto-submits if someone is still writing."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "friend-name",
						children: "Your name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "friend-name",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Shown on the scoreboard"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "surface-3d grid gap-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold tracking-tight",
							children: "Create a live test"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "friend-day",
							children: "Test day"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "friend-day",
							type: "date",
							value: testDay,
							onChange: (e) => setTestDay(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "friend-folder",
							children: "Folder"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "friend-folder",
							className: "h-11 rounded-lg border border-border bg-card px-3 text-sm shadow-raised",
							value: folderId,
							onChange: (e) => setFolderId(e.target.value),
							children: folderOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: opt.id,
								children: opt.kind === "notes" ? `Notes · ${opt.label}` : `${opt.label} (${opt.count})`
							}, opt.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Questions from sections" }), sections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "This folder has no questions."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "max-h-64 divide-y divide-border overflow-auto rounded-lg border border-border bg-card",
								children: sections.map((section, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 px-3 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: `section-${i}`,
											type: "checkbox",
											className: "mt-1 size-4 accent-primary",
											checked: section.selected,
											onChange: (e) => toggleSection(section.name, e.target.checked)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: `section-${i}`,
											className: "min-w-0 flex-1 text-sm leading-snug",
											children: [section.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-0.5 block text-xs text-muted-foreground",
												children: [section.total, " in section"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											"aria-label": `Questions from ${section.name}`,
											inputMode: "numeric",
											className: cn("h-10 w-16 text-center tabular-nums", !section.selected && "opacity-40"),
											value: section.selected ? section.count : "0",
											disabled: !section.selected,
											onChange: (e) => setSectionCount(section.name, e.target.value)
										})
									]
								}, section.name))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Questions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "flex h-11 items-center rounded-lg border border-border bg-card px-3 text-sm tabular-nums",
									children: selectedCount
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "friend-limit",
										children: "Time limit (minutes)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "friend-limit",
										inputMode: "numeric",
										value: timeLimit,
										onChange: (e) => setTimeLimit(e.target.value.replace(/[^\d]/g, "")),
										onBlur: () => setTimeLimit(String(clampTimeLimitMin(timeLimit)))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "1–180. Paper stays open until this ends."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperStartFields, {
							total: selectedCount,
							count: String(selectedCount),
							onCount: () => void 0,
							minutes: timeLimit,
							onMinutes: (v) => setTimeLimit(v),
							templateId,
							onTemplate: setTemplateId,
							showCount: false,
							showMinutes: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void createRoom(),
							disabled: busy || !hydrated || !selectedCount,
							children: busy ? "Creating…" : !hydrated ? "Loading…" : !selectedCount ? "Pick questions" : "Create room code"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: error
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "surface-3d grid gap-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold tracking-tight",
							children: "Join friends"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "friend-code",
							children: "Room code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "friend-code",
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "ABC123",
							className: "font-mono tracking-widest",
							autoCapitalize: "characters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void joinRoom(),
							disabled: busy,
							children: "Join"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { FriendsHub as component };
