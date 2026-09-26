import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { p as Route$23 } from "./router-B0Z9kZGU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Plus, E as Radio, Q as GraduationCap, R as MessagesSquare, Tt as BookOpen, Z as Hand, _t as ChevronRight, a as Video, dt as Copy, f as Trash2, g as SlidersHorizontal, ht as CirclePlay, k as Phone, z as MessageCircle } from "../_libs/lucide-react.mjs";
import { $ as persistBrowserFile, B as Label, H as Button, V as Input, W as cn, a as DialogDescription, c as AnkiShell, i as DialogContent, n as Switch, nt as useExamStore, o as DialogHeader, r as Dialog, s as DialogTitle, tt as uid } from "./router-B0Z9kZGU2.mjs";
import { t as Textarea } from "./textarea-BI7oN-Xh.mjs";
import { r as rememberedQuizName, t as quizPlayerId } from "./quiz-client-BuyieeJt.mjs";
import { a as discModeHint, i as asDiscMode, o as discModeLabel, t as DISC_MODES } from "./discussion-room-C9rESxG8.mjs";
import { r as NoteFileViewer } from "./note-file-preview-B0Cro7d5.mjs";
import { t as createDiscussion } from "./discussion-BiZJVwBc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coaching-BGzO3QAy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function pad(n) {
	return String(n).padStart(2, "0");
}
function toLocalInput(ts) {
	const d = new Date(ts);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(value) {
	const t = new Date(value).getTime();
	return Number.isFinite(t) ? t : Date.now();
}
function whenLabel(ts) {
	return new Date(ts).toLocaleString([], {
		dateStyle: "medium",
		timeStyle: "short"
	});
}
function CoachingPage() {
	const { view } = Route$23.useSearch();
	if (view === "live") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveClasses, {});
	if (view === "recorded") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordedClasses, {});
	if (view === "meetings") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMeetings, {});
	if (view === "courses") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoursesView, {});
	if (view === "discussions") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscussionsView, {});
	if (view === "customize") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomizeView, {});
	if (view === "teacher") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherView, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachingHub, {});
}
function Back({ to = "hub" }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-card px-3 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			onClick: () => void navigate({
				to: "/coaching",
				search: { view: to }
			}),
			children: "Back"
		})
	});
}
function CoachingHub() {
	const navigate = useNavigate();
	const coaching = useExamStore((s) => s.coaching);
	const liveCount = (coaching?.classes ?? []).filter((c) => c.live).length;
	const courseDone = (coaching?.courses ?? []).reduce((n, c) => n + c.lessons.filter((l) => l.done).length, 0);
	const courseTotal = (coaching?.courses ?? []).reduce((n, c) => n + c.lessons.length, 0);
	const items = [
		{
			view: "live",
			title: "Live classes",
			hint: liveCount ? `${liveCount} live now` : `${coaching?.classes.length ?? 0} scheduled`,
			icon: Radio
		},
		{
			view: "recorded",
			title: "Recorded classes",
			hint: `${coaching?.recordings.length ?? 0} recordings`,
			icon: CirclePlay
		},
		{
			view: "meetings",
			title: "Live meetings",
			hint: `${coaching?.meetings.length ?? 0} meetings`,
			icon: Video
		},
		{
			view: "courses",
			title: "Courses",
			hint: courseTotal ? `${courseDone}/${courseTotal} lessons done` : "Add a course",
			icon: BookOpen
		},
		{
			view: "discussions",
			title: "Group discussions",
			hint: `${coaching?.discussions.length ?? 0} topics`,
			icon: MessagesSquare
		},
		{
			view: "customize",
			title: "Customization",
			hint: coaching?.customization.institute || coaching?.customization.batch || "Batch, schedule, language",
			icon: SlidersHorizontal
		},
		{
			view: "teacher",
			title: "Teacher contact",
			hint: coaching?.teacher.name || "Add your teacher",
			icon: Phone
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnkiShell, {
		title: "Coaching",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-lg gap-3 p-4 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Classes, recordings, meetings, and teacher contact — kept with your account."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "surface-3d lift flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left",
					onClick: () => void navigate({
						to: "/coaching",
						search: { view: item.view }
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold tracking-tight",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: item.hint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })
					]
				}) }, item.view))
			})]
		})
	});
}
function LiveClasses() {
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)(toLocalInput(Date.now() + 36e5));
	const [mins, setMins] = (0, import_react.useState)("45");
	const [notes, setNotes] = (0, import_react.useState)("");
	function add() {
		const name = title.trim();
		if (!name) {
			toast.error("Give the class a title");
			return;
		}
		updateCoaching((c) => ({
			...c,
			classes: [{
				id: uid(),
				title: name,
				subject: subject.trim(),
				startsAt: fromLocalInput(when),
				durationMin: Math.max(1, Number(mins) || 45),
				live: false,
				notes: notes.trim(),
				createdAt: Date.now()
			}, ...c.classes]
		}));
		setOpen(false);
		setTitle("");
		setSubject("");
		setNotes("");
		toast.success("Live class scheduled");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Live classes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3 p-4",
				children: [(coaching?.classes ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-8 text-center text-sm text-muted-foreground",
					children: "No live classes yet. Schedule one."
				}) : null, (coaching?.classes ?? []).map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "surface-3d grid gap-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold tracking-tight",
									children: cls.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										cls.subject ? `${cls.subject} · ` : "",
										whenLabel(cls.startsAt),
										" · ",
										cls.durationMin,
										" min"
									]
								})]
							}), cls.live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-learn/10 px-2 py-1 text-xs font-medium text-learn",
								children: "Live"
							}) : null]
						}),
						cls.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: cls.notes
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: cls.live ? "secondary" : "default",
								onClick: () => {
									updateCoaching((c) => ({
										...c,
										classes: c.classes.map((x) => x.id === cls.id ? {
											...x,
											live: !x.live
										} : x)
									}));
									toast.success(cls.live ? "Class ended" : "Class is live");
								},
								children: cls.live ? "End class" : "Start class"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									updateCoaching((c) => ({
										...c,
										classes: c.classes.filter((x) => x.id !== cls.id)
									}));
									toast.success("Class removed");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
							})]
						})
					]
				}, cls.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Schedule live class"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Schedule live class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Shown in Coaching. Start it when you go live." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lc-title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lc-title",
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lc-subject",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lc-subject",
							className: "mt-2",
							value: subject,
							onChange: (e) => setSubject(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lc-when",
							children: "Starts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lc-when",
							className: "mt-2",
							type: "datetime-local",
							value: when,
							onChange: (e) => setWhen(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lc-mins",
							children: "Duration (min)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lc-mins",
							className: "mt-2",
							type: "number",
							min: 1,
							value: mins,
							onChange: (e) => setMins(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "lc-notes",
							children: "Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "lc-notes",
							className: "mt-2 min-h-24",
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: add,
							children: "Save class"
						})
					]
				})] })
			})
		]
	});
}
function RecordedClasses() {
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const fileRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [mins, setMins] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [viewer, setViewer] = (0, import_react.useState)(null);
	const allow = coaching?.customization.allowRecordings !== false;
	async function onFile(list) {
		const picked = list?.[0];
		if (!picked) return;
		setBusy(true);
		try {
			setFile(await persistBrowserFile(picked));
		} catch {
			toast.error("Could not attach this file");
		} finally {
			setBusy(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	function add() {
		const name = title.trim() || file?.name;
		if (!name) {
			toast.error("Give the recording a title");
			return;
		}
		updateCoaching((c) => ({
			...c,
			recordings: [{
				id: uid(),
				title: name,
				subject: subject.trim(),
				durationMin: Math.max(0, Number(mins) || 0),
				file,
				notes: notes.trim(),
				createdAt: Date.now()
			}, ...c.recordings]
		}));
		setOpen(false);
		setTitle("");
		setSubject("");
		setMins("");
		setNotes("");
		setFile(null);
		toast.success("Recording added");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Recorded classes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}),
			!allow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-3 text-sm text-muted-foreground",
				children: "Recordings are turned off in Customization."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3 p-4",
				children: [(coaching?.recordings ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-8 text-center text-sm text-muted-foreground",
					children: "No recordings yet."
				}) : null, (coaching?.recordings ?? []).map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "surface-3d grid gap-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold tracking-tight",
							children: rec.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [rec.subject ? `${rec.subject} · ` : "", rec.durationMin ? `${rec.durationMin} min` : "Recording"]
						})] }),
						rec.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: rec.notes
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [rec.file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setViewer(rec.file),
								children: "Open recording"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => updateCoaching((c) => ({
									...c,
									recordings: c.recordings.filter((x) => x.id !== rec.id)
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
							})]
						})
					]
				}, rec.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: !allow,
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add recording"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add recorded class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Attach a video or audio file from this device." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rc-title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rc-title",
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rc-subject",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rc-subject",
							className: "mt-2",
							value: subject,
							onChange: (e) => setSubject(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rc-mins",
							children: "Length (min)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rc-mins",
							className: "mt-2",
							type: "number",
							min: 0,
							value: mins,
							onChange: (e) => setMins(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "video/*,audio/*",
							className: "sr-only",
							onChange: (e) => void onFile(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							disabled: busy,
							onClick: () => fileRef.current?.click(),
							children: file ? file.name : busy ? "Attaching…" : "Attach video or audio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rc-notes",
							children: "Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "rc-notes",
							className: "mt-2 min-h-24",
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: add,
							disabled: busy,
							children: "Save recording"
						})
					]
				})] })
			}),
			viewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteFileViewer, {
				files: [viewer],
				open: true,
				onOpenChange: (v) => !v && setViewer(null)
			}) : null
		]
	});
}
function LiveMeetings() {
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [withWhom, setWithWhom] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)(toLocalInput(Date.now() + 18e5));
	const [notes, setNotes] = (0, import_react.useState)("");
	function add() {
		const name = title.trim();
		if (!name) {
			toast.error("Give the meeting a title");
			return;
		}
		updateCoaching((c) => ({
			...c,
			meetings: [{
				id: uid(),
				title: name,
				withWhom: withWhom.trim(),
				at: fromLocalInput(when),
				notes: notes.trim(),
				live: false,
				createdAt: Date.now()
			}, ...c.meetings]
		}));
		setOpen(false);
		setTitle("");
		setWithWhom("");
		setNotes("");
		toast.success("Meeting added");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Live meetings",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3 p-4",
				children: [(coaching?.meetings ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-8 text-center text-sm text-muted-foreground",
					children: "No meetings yet."
				}) : null, (coaching?.meetings ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "surface-3d grid gap-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold tracking-tight",
								children: m.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [m.withWhom ? `With ${m.withWhom} · ` : "", whenLabel(m.at)]
							})] }), m.live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-learn/10 px-2 py-1 text-xs font-medium text-learn",
								children: "In meeting"
							}) : null]
						}),
						m.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: m.notes
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: m.live ? "secondary" : "default",
								onClick: () => updateCoaching((c) => ({
									...c,
									meetings: c.meetings.map((x) => x.id === m.id ? {
										...x,
										live: !x.live
									} : x)
								})),
								children: m.live ? "Leave meeting" : "Join meeting"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => updateCoaching((c) => ({
									...c,
									meetings: c.meetings.filter((x) => x.id !== m.id)
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
							})]
						})
					]
				}, m.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Schedule meeting"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Live meeting" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "For teacher or batch meetings. Join when it starts." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mt-title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mt-title",
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mt-with",
							children: "With"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mt-with",
							className: "mt-2",
							value: withWhom,
							onChange: (e) => setWithWhom(e.target.value),
							placeholder: "Teacher / batch"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mt-when",
							children: "When"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mt-when",
							className: "mt-2",
							type: "datetime-local",
							value: when,
							onChange: (e) => setWhen(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mt-notes",
							children: "Agenda"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "mt-notes",
							className: "mt-2 min-h-24",
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: add,
							children: "Save meeting"
						})
					]
				})] })
			})
		]
	});
}
function CoursesView() {
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [lessons, setLessons] = (0, import_react.useState)("Lesson 1\nLesson 2\nLesson 3");
	const [lessonDraft, setLessonDraft] = (0, import_react.useState)({});
	function add() {
		const name = title.trim();
		if (!name) {
			toast.error("Give the course a title");
			return;
		}
		const items = lessons.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => ({
			id: uid(),
			title: line,
			done: false
		}));
		updateCoaching((c) => ({
			...c,
			courses: [{
				id: uid(),
				title: name,
				subject: subject.trim(),
				lessons: items,
				createdAt: Date.now()
			}, ...c.courses]
		}));
		setOpen(false);
		setTitle("");
		setSubject("");
		toast.success("Course added");
	}
	function addLesson(course) {
		const name = (lessonDraft[course.id] ?? "").trim();
		if (!name) return;
		updateCoaching((c) => ({
			...c,
			courses: c.courses.map((x) => x.id === course.id ? {
				...x,
				lessons: [...x.lessons, {
					id: uid(),
					title: name,
					done: false
				}]
			} : x)
		}));
		setLessonDraft((d) => ({
			...d,
			[course.id]: ""
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Courses",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3 p-4",
				children: [(coaching?.courses ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-8 text-center text-sm text-muted-foreground",
					children: "No courses yet."
				}) : null, (coaching?.courses ?? []).map((course) => {
					const done = course.lessons.filter((l) => l.done).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "surface-3d grid gap-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold tracking-tight",
									children: course.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										course.subject ? `${course.subject} · ` : "",
										done,
										"/",
										course.lessons.length,
										" lessons"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => updateCoaching((c) => ({
										...c,
										courses: c.courses.filter((x) => x.id !== course.id)
									})),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2",
								children: course.lessons.map((lesson) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex min-h-11 items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: lesson.done,
										onCheckedChange: (v) => updateCoaching((c) => ({
											...c,
											courses: c.courses.map((x) => x.id === course.id ? {
												...x,
												lessons: x.lessons.map((l) => l.id === lesson.id ? {
													...l,
													done: v
												} : l)
											} : x)
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: lesson.done ? "text-sm text-muted-foreground line-through" : "text-sm",
										children: lesson.title
									})]
								}, lesson.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: lessonDraft[course.id] ?? "",
									onChange: (e) => setLessonDraft((d) => ({
										...d,
										[course.id]: e.target.value
									})),
									placeholder: "Add a lesson",
									onKeyDown: (e) => {
										if (e.key === "Enter") addLesson(course);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => addLesson(course),
									children: "Add"
								})]
							})
						]
					}, course.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New course"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New course" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "One lesson per line. Tick them off as you finish." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "co-title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "co-title",
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "co-subject",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "co-subject",
							className: "mt-2",
							value: subject,
							onChange: (e) => setSubject(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "co-lessons",
							children: "Lessons"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "co-lessons",
							className: "mt-2",
							value: lessons,
							onChange: (e) => setLessons(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: add,
							children: "Save course"
						})
					]
				})] })
			})
		]
	});
}
function DiscussionsView() {
	const navigate = useNavigate();
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [first, setFirst] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("video");
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const allow = coaching?.customization.allowDiscussions !== false;
	async function add() {
		const name = title.trim();
		if (!name) {
			toast.error("Give the topic a title");
			return;
		}
		const promptText = prompt.trim() || first.trim();
		if (!promptText) {
			toast.error("Define the topic prompt");
			return;
		}
		setBusy(true);
		const posts = first.trim() ? [{
			id: uid(),
			author: "You",
			body: first.trim(),
			at: Date.now()
		}] : [{
			id: uid(),
			author: "You",
			body: promptText,
			at: Date.now()
		}];
		let roomCode = "";
		try {
			roomCode = (await createDiscussion({ data: {
				hostId: quizPlayerId(),
				hostName: rememberedQuizName() || "You",
				title: name,
				prompt: promptText,
				mode
			} })).code;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not open a live room");
		}
		updateCoaching((c) => ({
			...c,
			discussions: [{
				id: uid(),
				title: name,
				prompt: promptText,
				mode,
				roomCode,
				posts,
				createdAt: Date.now()
			}, ...c.discussions]
		}));
		setOpen(false);
		setTitle("");
		setPrompt("");
		setFirst("");
		setBusy(false);
		toast.success(roomCode ? `Topic opened · ${roomCode}` : "Topic saved");
		if (roomCode) navigate({
			to: "/discuss/$code",
			params: { code: roomCode }
		});
	}
	async function openRoom(topic) {
		if (topic.roomCode) {
			navigate({
				to: "/discuss/$code",
				params: { code: topic.roomCode }
			});
			return;
		}
		setBusy(true);
		try {
			const room = await createDiscussion({ data: {
				hostId: quizPlayerId(),
				hostName: rememberedQuizName() || "You",
				title: topic.title,
				prompt: topic.prompt || topic.title,
				mode: asDiscMode(topic.mode)
			} });
			updateCoaching((c) => ({
				...c,
				discussions: c.discussions.map((d) => d.id === topic.id ? {
					...d,
					roomCode: room.code,
					prompt: d.prompt || topic.title,
					mode: asDiscMode(d.mode)
				} : d)
			}));
			navigate({
				to: "/discuss/$code",
				params: { code: room.code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not open a live room");
		} finally {
			setBusy(false);
		}
	}
	function post(topic) {
		const body = (drafts[topic.id] ?? "").trim();
		if (!body) return;
		updateCoaching((c) => ({
			...c,
			discussions: c.discussions.map((d) => d.id === topic.id ? {
				...d,
				posts: [...d.posts, {
					id: uid(),
					author: "You",
					body,
					at: Date.now()
				}]
			} : d)
		}));
		setDrafts((d) => ({
			...d,
			[topic.id]: ""
		}));
	}
	const modeIcon = {
		video: Video,
		audio: Phone,
		chat: MessageCircle,
		hand: Hand
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Group discussions",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}),
			!allow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-3 text-sm text-muted-foreground",
				children: "Discussions are turned off in Customization."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Define a topic, pick how people connect, then join. Up to ",
						20,
						" names. The live room starts only after everyone has tapped Connect."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: joinCode,
						onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
						placeholder: "Room code",
						className: "font-mono tracking-widest",
						"aria-label": "Join with room code"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: !joinCode.trim(),
						onClick: () => void navigate({
							to: "/discuss/$code",
							params: { code: joinCode.trim() }
						}),
						children: "Join"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3 p-4",
				children: [(coaching?.discussions ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-8 text-center text-sm text-muted-foreground",
					children: "No topics yet."
				}) : null, (coaching?.discussions ?? []).map((topic) => {
					const ModeIcon = modeIcon[asDiscMode(topic.mode)];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "surface-3d grid gap-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold tracking-tight",
										children: topic.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeIcon, { className: "size-3.5" }),
											discModeLabel(asDiscMode(topic.mode)),
											topic.roomCode ? ` · ${topic.roomCode}` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => updateCoaching((c) => ({
										...c,
										discussions: c.discussions.filter((x) => x.id !== topic.id)
									})),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}),
							topic.prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: topic.prompt
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									disabled: !allow || busy,
									onClick: () => void openRoom(topic),
									children: topic.roomCode ? "Open room" : "Connect"
								}), topic.roomCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => {
										navigator.clipboard.writeText(topic.roomCode).then(() => toast.success("Code copied"), () => toast.message(topic.roomCode));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy code"]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2",
								children: topic.posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg bg-muted px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										suppressHydrationWarning: true,
										children: [
											p.author,
											" · ",
											whenLabel(p.at)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: p.body
									})]
								}, p.id))
							}),
							allow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: drafts[topic.id] ?? "",
									onChange: (e) => setDrafts((d) => ({
										...d,
										[topic.id]: e.target.value
									})),
									placeholder: "Write a reply",
									onKeyDown: (e) => {
										if (e.key === "Enter") post(topic);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => post(topic),
									children: "Post"
								})]
							}) : null
						]
					}, topic.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: !allow,
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New topic"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New discussion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Define the topic, then pick how the group connects. Max ",
					20,
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gd-title",
							children: "Topic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "gd-title",
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gd-prompt",
							children: "Prompt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "gd-prompt",
							className: "mt-2 min-h-24",
							value: prompt,
							onChange: (e) => setPrompt(e.target.value),
							placeholder: "The question everyone will discuss"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Connect with"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: DISC_MODES.map((id) => {
								const Icon = modeIcon[id];
								const on = mode === id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cn("flex min-h-16 flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left text-sm", on ? "border-primary bg-primary/10" : "border-border bg-card"),
									onClick: () => setMode(id),
									"aria-pressed": on,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), discModeLabel(id)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: discModeHint(id)
									})]
								}, id);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gd-first",
							children: "First post"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "gd-first",
							className: "mt-2 min-h-20",
							value: first,
							onChange: (e) => setFirst(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void add(),
							disabled: busy,
							children: busy ? "Opening…" : "Open topic"
						})
					]
				})] })
			})
		]
	});
}
function CustomizeView() {
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const custom = coaching?.customization;
	function patch(next) {
		updateCoaching((c) => ({
			...c,
			customization: {
				...c.customization,
				...next
			}
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Customization",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-0 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-3 text-sm text-muted-foreground",
					children: "These settings apply across live classes, recordings, and discussions."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cu-inst",
						children: "Institute / coaching"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cu-inst",
						className: "mt-2",
						value: custom?.institute ?? "",
						onChange: (e) => patch({ institute: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cu-batch",
						children: "Batch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cu-batch",
						className: "mt-2",
						value: custom?.batch ?? "",
						onChange: (e) => patch({ batch: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cu-sched",
						children: "Weekly schedule"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "cu-sched",
						className: "mt-2 min-h-24",
						value: custom?.schedule ?? "",
						onChange: (e) => patch({ schedule: e.target.value }),
						placeholder: "Mon–Fri 6–8 pm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Instruction language"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Used for class notes and discussions"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-lg border border-border bg-card px-3 text-sm",
						value: custom?.language ?? "en",
						onChange: (e) => patch({ language: e.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "en",
							children: "English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "hi",
							children: "Hindi"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Group discussions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Allow topics and replies"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: custom?.allowDiscussions !== false,
						onCheckedChange: (v) => patch({ allowDiscussions: v })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Recorded classes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Allow adding video and audio"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: custom?.allowRecordings !== false,
						onCheckedChange: (v) => patch({ allowRecordings: v })
					})]
				})
			]
		})]
	});
}
function TeacherView() {
	const coaching = useExamStore((s) => s.coaching);
	const updateCoaching = useExamStore((s) => s.updateCoaching);
	const teacher = coaching?.teacher;
	const messages = coaching?.teacherMessages ?? [];
	const [note, setNote] = (0, import_react.useState)("");
	function patch(next) {
		updateCoaching((c) => ({
			...c,
			teacher: {
				...c.teacher,
				...next
			}
		}));
	}
	function send() {
		const body = note.trim();
		if (!body) return;
		updateCoaching((c) => ({
			...c,
			teacherMessages: [{
				id: uid(),
				body,
				at: Date.now()
			}, ...c.teacherMessages].slice(0, 80)
		}));
		setNote("");
		toast.success("Note saved for your teacher");
	}
	const tel = teacher?.phone.replace(/\s+/g, "");
	const mail = teacher?.email.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Teacher contact",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-0 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tc-name",
						children: "Teacher name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "tc-name",
						className: "mt-2",
						value: teacher?.name ?? "",
						onChange: (e) => patch({ name: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tc-subject",
						children: "Subject"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "tc-subject",
						className: "mt-2",
						value: teacher?.subject ?? "",
						onChange: (e) => patch({ subject: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tc-phone",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "tc-phone",
						className: "mt-2",
						inputMode: "tel",
						value: teacher?.phone ?? "",
						onChange: (e) => patch({ phone: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tc-email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "tc-email",
						className: "mt-2",
						type: "email",
						value: teacher?.email ?? "",
						onChange: (e) => patch({ email: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tc-hours",
						children: "Hours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "tc-hours",
						className: "mt-2",
						value: teacher?.hours ?? "",
						onChange: (e) => patch({ hours: e.target.value }),
						placeholder: "Weekdays 5–7 pm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "tc-note",
						children: "Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "tc-note",
						className: "mt-2 min-h-24",
						value: teacher?.note ?? "",
						onChange: (e) => patch({ note: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 border-b border-border bg-card px-4 py-3",
					children: [tel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${tel}`,
							children: "Call"
						})
					}) : null, mail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${mail}`,
							children: "Email"
						})
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tc-msg",
							children: "Send a note"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "tc-msg",
							className: "mt-2 min-h-24",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Question or reminder for your teacher"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							onClick: send,
							children: "Save note"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-2",
							children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "surface-3d px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: whenLabel(m.at)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: m.body
								})]
							}, m.id))
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { CoachingPage as component };
