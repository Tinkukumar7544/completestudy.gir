import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as normalizeLudo, d as defaultLudo, r as LUDO_COLORS, s as defaultExamPath, x as normalizeExamPath } from "./types-XZVWHhWz.mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ct as Bookmark } from "../_libs/lucide-react.mjs";
import { A as formatAccountLabel, F as syncNow, H as Button, I as toastOutcome, R as useCurrentUserState, V as Input, c as AnkiShell, n as Switch, nt as useExamStore, z as useSyncUi } from "./router-B0Z9kZGU2.mjs";
import { t as DAILY_GOAL_OPTIONS } from "./exam-path-CegkKdrh.mjs";
import { _ as isActiveSeat, a as applyActiveColors, n as LUDO_COLOR_LABEL, o as applyPlayerMode } from "./ludo-path-Bs2aZvF5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BU0LSg7f.js
var import_jsx_runtime = require_jsx_runtime();
function Row({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: title
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children
		})]
	});
}
function Group({ title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "bg-background px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
		children: title
	});
}
function Settings() {
	const navigate = useNavigate();
	const prefs = useExamStore((s) => s.prefs);
	const setPrefs = useExamStore((s) => s.setPrefs);
	const lastSyncedAt = useExamStore((s) => s.lastSyncedAt);
	const templates = useExamStore((s) => s.templates);
	const ludo = normalizeLudo(useExamStore((s) => s.ludo) ?? defaultLudo());
	const updateLudo = useExamStore((s) => s.updateLudo);
	const path = normalizeExamPath(useExamStore((s) => s.path) ?? defaultExamPath());
	const updatePath = useExamStore((s) => s.updatePath);
	const active = (templates ?? []).find((t) => t.bookmarked) ?? templates?.[0];
	const { user } = useCurrentUserState();
	const syncing = useSyncUi((s) => s.syncing);
	const lastError = useSyncUi((s) => s.lastError);
	async function runSync() {
		if (!user) {
			navigate({
				to: "/login",
				search: {
					mode: "signup",
					via: "email"
				}
			});
			return;
		}
		try {
			const outcome = await syncNow();
			toastOutcome(outcome, user.primaryEmail ?? "your account");
		} catch {
			toast.error("Could not sync. Try again.");
		}
	}
	const syncedLabel = lastSyncedAt ? `Last saved ${new Date(lastSyncedAt).toLocaleString()}` : "Changes save automatically after you connect";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Settings",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Account" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: formatAccountLabel(user.primaryEmail) || user.displayName || "Signed in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [syncedLabel, ". New decks, questions, notes, and reviews stay on this account."]
						}),
						lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: lastError
						}) : null
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void runSync(),
							disabled: syncing,
							children: syncing ? "Syncing…" : "Sync now"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								signOut("/").catch(() => toast.error("Could not disconnect"));
							},
							children: "Disconnect"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Not signed in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Create an account with an email ID or a 10-digit mobile number. You only do this once on this device — after that, every change saves in the background."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "w-fit",
							onClick: () => void navigate({
								to: "/login",
								search: {
									mode: "signup",
									via: "email"
								}
							}),
							children: "Create account or sign in"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "General" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Language",
				hint: "Interface language",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 rounded-md border border-border bg-card px-2 text-sm",
					value: prefs.language,
					onChange: (e) => setPrefs({ language: e.target.value }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "en",
						children: "English"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "hi",
						children: "Hindi"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Deck for new questions",
				hint: "Used when adding a note",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Current deck"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Error reporting",
				hint: "Off — local only",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: false,
					disabled: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Notifications" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Notify when due",
				hint: "Browser notification if allowed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: prefs.notifyWhenDue,
					onCheckedChange: (v) => {
						setPrefs({ notifyWhenDue: v });
						if (v && typeof Notification !== "undefined") Notification.requestPermission();
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Reviewing" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "New question position",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 rounded-md border border-border bg-card px-2 text-sm",
					value: prefs.newPosition,
					onChange: (e) => setPrefs({ newPosition: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "mixed",
							children: "Mix with reviews"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "after",
							children: "After reviews"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "before",
							children: "Before reviews"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Start of next day",
				hint: "Hour (0–23)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-20",
					type: "number",
					min: 0,
					max: 23,
					value: prefs.dayStartHour,
					onChange: (e) => setPrefs({ dayStartHour: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Learn ahead limit (min)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-20",
					type: "number",
					value: prefs.learnAheadMinutes,
					onChange: (e) => setPrefs({ learnAheadMinutes: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Timebox (min)",
				hint: "0 = off",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-20",
					type: "number",
					value: prefs.timeboxMinutes,
					onChange: (e) => setPrefs({ timeboxMinutes: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Keep screen on",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: prefs.keepScreenOn,
					onCheckedChange: (v) => setPrefs({ keepScreenOn: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Fullscreen review",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: prefs.fullscreenReview,
					onCheckedChange: (v) => setPrefs({ fullscreenReview: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Show remaining count",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: prefs.showRemaining,
					onCheckedChange: (v) => setPrefs({ showRemaining: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Show button time",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: prefs.showButtonTime,
					onCheckedChange: (v) => setPrefs({ showButtonTime: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Answer button size",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 rounded-md border border-border bg-card px-2 text-sm",
					value: prefs.answerButtonSize,
					onChange: (e) => setPrefs({ answerButtonSize: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "small",
							children: "Small"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "normal",
							children: "Normal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "large",
							children: "Large"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Card zoom %",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-20",
					type: "number",
					value: prefs.cardZoom,
					onChange: (e) => setPrefs({ cardZoom: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Appearance" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Night mode",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: prefs.theme === "dark",
					onCheckedChange: (v) => setPrefs({ theme: v ? "dark" : "light" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Gestures" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-card px-4 py-3 text-sm text-muted-foreground",
				children: "Study runs inside the exam paper. Use the paper buttons (Next, Mark, Clear) and keyboard M / C / arrows. Deck list: tap name to study, tap counts for overview, long-press for actions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Exam templates" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Active: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: active.name
							}),
							active.kind === "bundled" ? " · TCS iON paper" : active.fileName ? ` · ${active.fileName}` : ""
						] }) : "TCS iON paper"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Bookmark one template for study. Add, edit, or replace others without changing the rest. Pattern, timers, options, and candidate details are set per template."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						onClick: () => void navigate({ to: "/templates" }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), "Manage templates"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Focus" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Off timer, daily caps, and time windows"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Gold tab in the middle of the bar. No terms page — just study limits."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						size: "sm",
						variant: "outline",
						onClick: () => void navigate({
							to: "/focus",
							search: {
								view: "settings",
								id: "",
								range: "30d"
							}
						}),
						children: "Open Focus settings"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Target path" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Daily steps",
				hint: "How many path steps count as a full day",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-10 rounded-md border border-border bg-card px-2 text-sm",
					value: path.intake.dailyGoal,
					disabled: !path.intake.completed,
					onChange: (e) => {
						const dailyGoal = Number(e.target.value);
						updatePath((p) => ({
							...p,
							intake: {
								...p.intake,
								dailyGoal
							}
						}));
					},
					children: DAILY_GOAL_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: opt.value,
						children: [
							opt.label,
							" · ",
							opt.hint
						]
					}, opt.value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Weekly checks",
				hint: "A checkpoint after each subject on the path",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: path.intake.weeklyTests,
					disabled: !path.intake.completed,
					onCheckedChange: (v) => updatePath((p) => ({
						...p,
						intake: {
							...p.intake,
							weeklyTests: v
						}
					}))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Path sound",
				hint: "Taps, unlocks, and finished steps",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: path.progress.sound,
					onCheckedChange: (v) => updatePath((p) => ({
						...p,
						progress: {
							...p.progress,
							sound: v
						}
					}))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-card px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Redo the setup questions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "The path is created only after every question is answered."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						size: "sm",
						variant: "outline",
						onClick: () => {
							updatePath((p) => ({
								...p,
								intake: {
									...p.intake,
									completed: false
								}
							}));
							navigate({
								to: "/target",
								search: { game: "home" }
							});
						},
						children: "Open setup"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Target exam" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Players on the target",
				hint: "Two uses you and the opposite colour. Four uses every column. Custom lets you pick any mix — empty seats never play themselves.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 rounded-md border border-border bg-card px-2 text-sm",
					value: ludo.playerMode,
					"data-ludo-mode": ludo.playerMode,
					onChange: (e) => {
						const mode = e.target.value;
						updateLudo((b) => applyPlayerMode(b, mode));
						toast.success(mode === "two" ? "Two columns stay on the target" : mode === "four" ? "All four columns are on the target" : "Pick which columns stay on the target");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "two",
							children: "Two player"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "four",
							children: "Four player"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "custom",
							children: "Custom"
						})
					]
				})
			}),
			LUDO_COLORS.map((color) => {
				const on = isActiveSeat(ludo, color);
				const yours = color === ludo.playerColor;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: `${LUDO_COLOR_LABEL[color]} column`,
					hint: yours ? "Your column" : on ? "On this target" : "Off this target",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"data-ludo-seat": color,
						"data-live": on ? "1" : "0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: on,
							onCheckedChange: (v) => {
								const next = v ? [...ludo.activeColors, color] : ludo.activeColors.filter((c) => c !== color);
								if (!next.length) {
									toast.message("Keep at least one column on the target");
									return;
								}
								updateLudo((b) => applyActiveColors(b, next));
							}
						})
					})
				}, color);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { title: "Advanced" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				title: "Collection path",
				hint: user?.primaryEmail ? `Synced to ${formatAccountLabel(user.primaryEmail)}` : "On this device until you sign in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "setpaper-anki-v3"
				})
			})
		]
	});
}
//#endregion
export { Settings as component };
