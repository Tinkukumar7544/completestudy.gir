import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as defaultConfig } from "./types-XZVWHhWz.mjs";
import { D as resultCounts, g as lastSessionForDeck } from "./results-DOq2AZyk.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as FolderPlus, D as Plus, H as Mail, P as Monitor, _t as ChevronRight, c as UserPlus, ct as EllipsisVertical, h as Smartphone, lt as Download, pt as ClipboardPaste, rt as FileUp, s as Users, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { B as Label, H as Button, K as deckCounts, R as useCurrentUserState, V as Input, W as cn, Y as ensureDaily, a as DialogDescription, c as AnkiShell, d as DropdownMenuItem, f as DropdownMenuSeparator, i as DialogContent, l as DropdownMenu, nt as useExamStore, o as DialogHeader, p as DropdownMenuTrigger, r as Dialog, s as DialogTitle, u as DropdownMenuContent } from "./router-B0Z9kZGU2.mjs";
import { a as setClip, n as getClip, t as clearClip } from "./clipboard-wrdOgXLB.mjs";
import { n as importBrowserDirectory, t as DirectoryInput } from "./folder-import-CkC_ovFv.mjs";
import { t as Glyph3D } from "./glyphs-CX9tzrUD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-wFai4D0g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeckList() {
	const navigate = useNavigate();
	const decks = useExamStore((s) => s.decks);
	const cards = useExamStore((s) => s.cards);
	const dailyRaw = useExamStore((s) => s.daily);
	const prefs = useExamStore((s) => s.prefs);
	const configs = useExamStore((s) => s.configs);
	const sessions = useExamStore((s) => s.sessions ?? []);
	const lastSession = useExamStore((s) => s.lastSession);
	const createDeck = useExamStore((s) => s.createDeck);
	const renameDeck = useExamStore((s) => s.renameDeck);
	const deleteDeck = useExamStore((s) => s.deleteDeck);
	const toggleCollapsed = useExamStore((s) => s.toggleCollapsed);
	const unburyDeck = useExamStore((s) => s.unburyDeck);
	const setDescription = useExamStore((s) => s.setDescription);
	const moveDeck = useExamStore((s) => s.moveDeck);
	const duplicateDeck = useExamStore((s) => s.duplicateDeck);
	const links = useExamStore((s) => s.links ?? []);
	const daily = ensureDaily(dailyRaw, prefs.dayStartHour);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [folderOpen, setFolderOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [renameId, setRenameId] = (0, import_react.useState)(null);
	const [descId, setDescId] = (0, import_react.useState)(null);
	const [moveId, setMoveId] = (0, import_react.useState)(null);
	const [moveParent, setMoveParent] = (0, import_react.useState)("");
	const [fab, setFab] = (0, import_react.useState)(false);
	const phoneRef = (0, import_react.useRef)(null);
	const deskRef = (0, import_react.useRef)(null);
	const rows = (0, import_react.useMemo)(() => {
		const sorted = decks.slice().sort((a, b) => a.name.localeCompare(b.name));
		const hidden = /* @__PURE__ */ new Set();
		for (const d of sorted) {
			if (!d.collapsed) continue;
			for (const child of sorted) if (child.name.startsWith(d.name + "::")) hidden.add(child.id);
		}
		return sorted.filter((d) => !hidden.has(d.id));
	}, [decks]);
	function openDeck(deckId) {
		navigate({
			to: "/overview/$deckId",
			params: { deckId }
		});
	}
	function practice(deckId, pick, count) {
		if (!count) {
			openDeck(deckId);
			return;
		}
		navigate({
			to: "/study/$deckId",
			params: { deckId },
			search: {
				mode: "custom",
				pick,
				count,
				paper: "",
				quiz: "",
				session: ""
			}
		});
	}
	function pasteInto(parentId) {
		const clip = getClip();
		if (!clip || clip.kind !== "deck") {
			toast.message("Cut or copy a test first");
			return;
		}
		if (clip.action === "cut") {
			moveDeck(clip.id, parentId);
			clearClip();
			toast.success("Moved");
		} else if (!duplicateDeck(clip.id, parentId)) toast.error("Could not paste here");
		else toast.success("Copied");
	}
	async function onDirectory(list, source) {
		if (!list?.length) return;
		const toastId = toast.loading("Copying folder…");
		try {
			const result = await importBrowserDirectory(list, { source });
			toast.success(`${result.files} files from ${result.name}`);
			navigate({
				to: "/desk",
				search: {
					folder: result.folderId,
					from: "tests"
				}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not link that folder");
		} finally {
			toast.dismiss(toastId);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnkiShell, {
		title: "Tests",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBanner, { onOpen: () => void navigate({
				to: "/login",
				search: {
					mode: "signup",
					via: "email"
				}
			}) }),
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-10 text-center text-sm text-muted-foreground",
				children: "No decks. Tap + to create one."
			}),
			rows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-4 pt-3 text-xs text-muted-foreground",
				children: [
					"Tap a test for a custom paper, full paper, or Friend Quiz. Counts:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-learn",
						children: "Wrong"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-mark",
						children: "Review"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-new",
						children: "Unattempted"
					})
				]
			}) : null,
			links.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 px-4 pt-3",
				children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "surface-3d lift flex min-h-14 w-full items-center gap-3 px-3 text-left",
					onClick: () => {
						if (link.kind === "email") navigate({
							to: "/mail",
							search: {
								from: "tests",
								label: link.remoteId ?? "",
								message: "",
								connector: "Gmail"
							}
						});
						else navigate({
							to: "/desk",
							search: {
								folder: link.folderId ?? "",
								from: "tests"
							}
						});
					},
					children: [link.kind === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 text-primary" }) : link.kind === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-semibold",
							children: link.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: link.kind === "email" ? "Mail folder · live" : link.kind === "phone" ? "Phone folder" : "Desk folder"
						})]
					})]
				}) }, link.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 p-4 pb-36",
				children: rows.map((deck) => {
					const depth = deck.name.split("::").length - 1;
					const leaf = deck.name.split("::").pop() ?? deck.name;
					const config = configs[deck.configId] ?? defaultConfig();
					const c = deckCounts(cards, deck.id, config, daily, prefs);
					const r = resultCounts(cards, deck.id);
					const saved = lastSessionForDeck(lastSession?.deckId === deck.id && !(sessions ?? []).some((s) => s.id === lastSession.id) ? [lastSession, ...sessions] : sessions, deck.id);
					const hasResults = r.wrong + r.marked + r.skipped > 0;
					const hasChildren = decks.some((d) => d.name.startsWith(deck.name + "::") && d.id !== deck.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "surface-3d lift overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-h-16 items-stretch",
							style: { paddingLeft: 8 + depth * 18 },
							children: [
								hasChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "grid w-10 place-items-center text-muted-foreground",
									onClick: () => toggleCollapsed(deck.id),
									"aria-label": deck.collapsed ? "Expand" : "Collapse",
									children: deck.collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex min-w-0 flex-1 items-center gap-3 py-3 pr-2 text-left",
									onClick: () => openDeck(deck.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph3D, {
										name: depth > 0 ? "subdeck" : "deck",
										alt: "",
										size: "md"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-base font-semibold tracking-tight",
											children: leaf
										}), saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-review",
													children: saved.correct
												}),
												" / ",
												saved.total,
												" last paper",
												saved.wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium text-learn",
													children: [saved.wrong, " wrong"]
												})] }) : null
											]
										}) : depth > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Subdeck"
										}) : null]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "flex h-16 w-10 items-center justify-center text-muted-foreground",
										"aria-label": "Deck actions",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => void navigate({
												to: "/add",
												search: {
													deck: deck.id,
													tab: "one"
												}
											}),
											children: "Add"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => void navigate({
												to: "/friends",
												search: { deck: deck.id }
											}),
											children: "Friends quiz"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => void navigate({
												to: "/browser",
												search: { deck: deck.id }
											}),
											children: "Browse cards"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => setRenameId(deck.id),
											children: "Rename deck"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => {
												const id = createDeck(`${deck.name}::Subdeck`);
												toast.success("Subdeck created");
												setRenameId(id);
											},
											children: "Create subdeck"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => {
												setClip({
													kind: "deck",
													action: "cut",
													id: deck.id
												});
												toast.success("Cut");
											},
											children: "Cut"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => {
												setClip({
													kind: "deck",
													action: "copy",
													id: deck.id
												});
												toast.success("Copied");
											},
											children: "Copy"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => pasteInto(deck.id),
											children: "Paste here"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => {
												setMoveId(deck.id);
												setMoveParent("");
											},
											children: "Move…"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => void navigate({
												to: "/options/$deckId",
												params: { deckId: deck.id }
											}),
											children: "Deck options"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => void navigate({
												to: "/custom-study/$deckId",
												params: { deckId: deck.id }
											}),
											children: "Custom study"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => setDescId(deck.id),
											children: "Edit description"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => unburyDeck(deck.id),
											children: "Unbury"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											className: "text-destructive",
											onSelect: () => {
												deleteDeck(deck.id);
												toast.success("Deck deleted");
											},
											children: "Delete deck"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex shrink-0 items-center justify-end gap-1.5 px-3 font-semibold tabular-nums",
									children: hasResults ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										r.wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rounded-md bg-learn/10 px-1.5 py-0.5 text-xs text-learn",
											onClick: () => practice(deck.id, "wrong", r.wrong),
											"aria-label": `${r.wrong} wrong`,
											children: r.wrong
										}) : null,
										r.marked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rounded-md bg-mark/10 px-1.5 py-0.5 text-xs text-mark",
											onClick: () => practice(deck.id, "marked", r.marked),
											"aria-label": `${r.marked} marked for review`,
											children: r.marked
										}) : null,
										r.skipped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rounded-md bg-new/10 px-1.5 py-0.5 text-xs text-new",
											onClick: () => practice(deck.id, "skipped", r.skipped),
											"aria-label": `${r.skipped} unattempted`,
											children: r.skipped
										}) : null
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center justify-end gap-1.5 font-semibold tabular-nums",
										onClick: () => openDeck(deck.id),
										children: [
											c.new ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-new/10 px-1.5 py-0.5 text-xs text-new",
												children: c.new
											}) : null,
											c.learn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-learn/10 px-1.5 py-0.5 text-xs text-learn",
												children: c.learn
											}) : null,
											c.review ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-review/10 px-1.5 py-0.5 text-xs text-review",
												children: c.review
											}) : null
										]
									})
								})
							]
						})
					}, deck.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed right-4 bottom-28 z-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryInput, {
						inputRef: phoneRef,
						onFiles: (files) => void onDirectory(files, "phone")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryInput, {
						inputRef: deskRef,
						onFiles: (files) => void onDirectory(files, "desk")
					}),
					fab && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-col items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "From email",
								onClick: () => {
									setFab(false);
									navigate({
										to: "/mail",
										search: {
											from: "tests",
											label: "",
											message: "",
											connector: "Gmail"
										}
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Phone folder",
								onClick: () => {
									setFab(false);
									phoneRef.current?.click();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Desk folder",
								onClick: () => {
									setFab(false);
									deskRef.current?.click();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Paste",
								onClick: () => {
									setFab(false);
									pasteInto(null);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Get shared decks",
								onClick: () => {
									setFab(false);
									toast.message("Sample collection is already loaded. Import JSON from the menu for more.");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Friends quiz",
								onClick: () => {
									setFab(false);
									navigate({ to: "/connect" });
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Upload HTML test",
								onClick: () => {
									setFab(false);
									navigate({
										to: "/add",
										search: {
											deck: decks[0]?.id ?? "",
											tab: "html"
										}
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Create deck",
								onClick: () => {
									setFab(false);
									setCreateOpen(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FabLabel, {
								label: "Add",
								onClick: () => {
									setFab(false);
									navigate({
										to: "/add",
										search: {
											deck: decks[0]?.id ?? "",
											tab: "one"
										}
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "secondary",
							className: "size-12 rounded-full shadow-raised",
							"aria-label": "New folder",
							onClick: () => {
								setFolderOpen(true);
								setName("");
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							className: "size-14 rounded-full shadow-btn",
							onClick: () => setFab((v) => !v),
							"aria-label": "Add",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: cn("size-7 transition-transform", fab && "rotate-45") })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create deck" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Use Parent::Child for a subdeck." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Deck name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (!name.trim()) return;
							createDeck(name.trim());
							setName("");
							setCreateOpen(false);
						},
						children: "OK"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: folderOpen,
				onOpenChange: setFolderOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New folder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Tests you move here become subdecks of this folder." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Folder name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (!name.trim()) return;
							createDeck(name.trim(), "Folder");
							setName("");
							setFolderOpen(false);
							toast.success("Folder created");
						},
						children: "Create folder"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!moveId,
				onOpenChange: () => setMoveId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Move test" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Choose a folder, or Tests for the top level." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-lg border border-border bg-card px-3 text-sm",
						value: moveParent,
						onChange: (e) => setMoveParent(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Tests (top level)"
						}), decks.filter((d) => d.id !== moveId && !d.name.startsWith(`${decks.find((x) => x.id === moveId)?.name}::`)).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.name
						}, d.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (moveId) moveDeck(moveId, moveParent || null);
							setMoveId(null);
							toast.success("Moved");
						},
						children: "Move"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!renameId,
				onOpenChange: () => setRenameId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Rename deck" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: decks.find((d) => d.id === renameId)?.name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (renameId && name.trim()) renameDeck(renameId, name.trim());
							setRenameId(null);
						},
						children: "OK"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!descId,
				onOpenChange: () => setDescId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Deck description" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "desc",
						children: "Description"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "desc",
						defaultValue: decks.find((d) => d.id === descId)?.description,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (descId) setDescription(descId, name);
							setDescId(null);
						},
						children: "OK"
					})
				] })
			})
		]
	});
}
function FabLabel({ label, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "flex items-center gap-3",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "surface-3d px-3 py-1.5 text-xs font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-11 items-center justify-center rounded-full bg-card text-primary shadow-raised",
			children
		})]
	});
}
function AccountBanner({ onOpen }) {
	const { user } = useCurrentUserState();
	if (user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "surface-3d lift flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left",
			onClick: onOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-btn",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-semibold",
					children: "Create account or sign in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted-foreground",
					children: "Email ID or mobile number — tests and notes stay on this account"
				})]
			})]
		})
	});
}
//#endregion
export { DeckList as component };
