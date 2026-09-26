import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookMarked,
  BadgeCheck,
  ClipboardList,
  FileUp,
  GraduationCap,
  HelpCircle,
  Inbox,
  Menu,
  Monitor,
  MoreVertical,
  Radio,
  RefreshCw,
  Settings,
  Shield,
  StickyNote,
  Target,
  Undo2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SectionNav, FocusMark } from "@/components/section-nav";
import { FocusGuard } from "@/components/focus-guard";
import { useAdminCopy, useAdminState, useRouteAccess } from "@/lib/admin/use-copy";
import { sectionLabel } from "@/lib/admin/copy";
import { functionAccess, defaultFunctions, type SectionId } from "@/lib/admin/controls";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { importHtmlTest } from "@/lib/exam/html-import";
import { useExamStore } from "@/lib/exam/store";
import { syncNow, toastOutcome, useSyncUi } from "@/lib/exam/sync";
import { cn } from "@/lib/utils";

export function StudyShell({
  title = "SetPaper",
  children,
  onUndo,
  immersive = false,
  hideHeader = false,
}: {
  title?: string;
  children: ReactNode;
  onUndo?: () => void;
  immersive?: boolean;
  hideHeader?: boolean;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const prefs = useExamStore((s) => s.prefs);
  const hydrated = useExamStore((s) => s.hydrated);
  const markHydrated = useExamStore((s) => s.markHydrated);
  const seedSampleIfEmpty = useExamStore((s) => s.seedSampleIfEmpty);
  const undo = useExamStore((s) => s.undo);
  const resetCollection = useExamStore((s) => s.resetCollection);
  const cards = useExamStore((s) => s.cards);
  const decks = useExamStore((s) => s.decks);
  const configs = useExamStore((s) => s.configs);
  const prefsAll = useExamStore((s) => s.prefs);
  const notes = useExamStore((s) => s.notes);
  const folders = useExamStore((s) => s.folders);
  const links = useExamStore((s) => s.links);
  const templates = useExamStore((s) => s.templates);
  const coaching = useExamStore((s) => s.coaching);
  const journey = useExamStore((s) => s.journey);
  const path = useExamStore((s) => s.path);
  const focus = useExamStore((s) => s.focus);
  const ludo = useExamStore((s) => s.ludo);
  const { user, isPending } = useCurrentUserState();
  const copy = useAdminCopy();
  const admin = useAdminState();
  const routeAccess = useRouteAccess(pathname);
  const syncing = useSyncUi((s) => s.syncing);

  useEffect(() => {
    const unsub = useExamStore.persist.onFinishHydration(() => {
      markHydrated();
      seedSampleIfEmpty();
    });
    if (useExamStore.persist.hasHydrated()) {
      markHydrated();
      seedSampleIfEmpty();
    }
    return unsub;
  }, [markHydrated, seedSampleIfEmpty]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", prefs.theme === "dark");
  }, [prefs.theme]);

  function exportCollection() {
    const blob = new Blob(
      [JSON.stringify({ decks, cards, configs, prefs: prefsAll, notes, folders, links, templates, coaching, journey, path, focus, ludo }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "setpaper-collection.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Collection exported");
  }

  async function onSyncClick() {
    if (syncing || isPending) return;
    if (!user) {
      void navigate({ to: "/login", search: { mode: "signup", via: "email" } });
      return;
    }
    try {
      const outcome = await syncNow();
      toastOutcome(outcome, user.primaryEmail ?? "your account");
    } catch {
      toast.error("Could not sync. Try again.");
    }
  }

  const nav = [
    { to: "/", label: copy.tests.name, icon: ClipboardList },
    { to: "/notes", label: copy.notes.name, icon: StickyNote },
    { to: "/focus", label: copy.focus.name, icon: FocusMark },
    { to: "/connect", label: copy.connect.name, icon: Radio },
    { to: "/coaching", label: copy.coaching.name, icon: GraduationCap },
    { to: "/target", label: sectionLabel(copy.target.name, prefs.targetExamName, "Target Exam"), icon: Target },
    { to: "/subscriptions", label: "Subscriptions", icon: BadgeCheck },
    { to: "/stats", label: "Statistics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/templates", label: "Exam templates", icon: BookMarked },
    { to: "/mail", label: "Mail", icon: Inbox },
    { to: "/desk", label: "Desk", icon: Monitor },
  ] as const;
  const sectionOfNav: Record<string, SectionId> = {
    "/": "tests",
    "/notes": "notes",
    "/focus": "focus",
    "/connect": "connect",
    "/coaching": "coaching",
    "/target": "target",
    "/subscriptions": "subscriptions",
    "/settings": "settings",
    "/templates": "templates",
    "/mail": "tests",
    "/desk": "tests",
  };
  const visibleNav = nav.filter((item) => admin.controls.sections[sectionOfNav[item.to]] !== false);

  return (
    <div className="app-canvas relative min-h-dvh text-foreground">
      {hideHeader ? null : (
      <header
        className={cn(
          "z-30 flex min-h-14 items-center gap-1 border-b border-bar-foreground/10 px-1 py-1 text-bar-foreground shadow-dock",
          immersive ? "absolute inset-x-0 top-0 bg-bar/80 backdrop-blur-md" : "sticky top-0 bg-bar",
        )}
      >
        <Button variant="ghost" size="icon" className="text-bar-foreground hover:bg-bar-foreground/10" onClick={() => setOpen(true)} aria-label="Menu">
          <Menu />
        </Button>
        <div className="min-w-0 flex-1 px-1">
          <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
          {sectionHint(pathname, copy) ? (
            <p className="mt-0.5 truncate rounded px-1 text-[10px] leading-4 font-medium" style={{ background: copy.tests.headerColor, color: "#1a1400" }}>
              {sectionHint(pathname, copy)}
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-bar-foreground hover:bg-bar-foreground/10"
          aria-label="Account"
          disabled={syncing}
          onClick={() => void onSyncClick()}
        >
          <RefreshCw className={cn(syncing && "animate-spin")} />
          {user ? <span className="absolute top-2 right-2 size-1.5 rounded-full bg-review" /> : null}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-bar-foreground hover:bg-bar-foreground/10" aria-label="More">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                (onUndo ?? undo)();
                toast.success("Undo");
              }}
            >
              <Undo2 className="size-4" /> Undo
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (user) void onSyncClick();
                else void navigate({ to: "/login", search: { mode: "signup", via: "email" } });
              }}
            >
              <UserPlus className="size-4" /> {user ? "Sync account" : "Create account / sign in"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                const empty = cards.filter((c) => !c.question.trim()).length;
                const short = cards.filter((c) => c.type !== "numerical" && c.options.length < 2).length;
                toast.success(`Check database: ${cards.length} questions, ${empty} empty, ${short} missing options`);
              }}
            >
              Check database
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.message("Media check skipped — questions are text-only")}>
              Check media
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                const access = functionAccess(admin, "tests.import");
                if (!access.allowed) {
                  toast.error(access.reason === "locked" ? `${access.name} is locked to ${access.planName}` : "Import is turned off");
                  return;
                }
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".html,.htm,text/html";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const toastId = toast.loading(`Reading ${file.name}…`);
                  void importHtmlTest(file, (hint) => toast.loading(hint, { id: toastId }))
                    .then((result) => {
                      toast.dismiss(toastId);
                      if (result.template && result.questions) {
                        toast.success(
                          `${result.questions} questions from ${result.title}. Saved two templates: original paper and TCS iON.`,
                        );
                      } else if (result.questions) {
                        toast.success(`${result.questions} questions from ${result.title} (${result.sizeLabel})`);
                      } else if (result.template) {
                        toast.success(`Saved two templates (${result.sizeLabel}): original paper and TCS iON.`);
                      }
                      if (result.deckId) {
                        void navigate({ to: "/overview/$deckId", params: { deckId: result.deckId } });
                      }
                    })
                    .catch((err) => {
                      toast.dismiss(toastId);
                      toast.error(err instanceof Error ? err.message : "Could not read this HTML file");
                    });
                };
                input.click();
              }}
            >
              <FileUp className="size-4" /> Import HTML test
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/json";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  file.text().then((t) => {
                    try {
                      useExamStore.getState().importPayload(JSON.parse(t));
                      toast.success("Imported");
                    } catch {
                      toast.error("Invalid collection file");
                    }
                  });
                };
                input.click();
              }}
            >
              Import collection
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={exportCollection}>Export collection</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                resetCollection();
                toast.success("Restored sample collection");
              }}
            >
              Restore from backup
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void navigate({ to: "/profile" })}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void navigate({ to: "/privacy" })}>Privacy policy</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void navigate({ to: "/terms" })}>Terms and conditions</DropdownMenuItem>
            {user ? (
              <DropdownMenuItem
                onSelect={() => {
                  void signOut("/login?mode=signin&via=email").catch(() => toast.error("Could not log out"));
                }}
              >
                Log out
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onSelect={() => void navigate({ to: "/delete-account" })}>Delete account</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void navigate({ to: "/admin" })}>
              <Shield className="size-4" /> Admin
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.message("Help: Tests for papers, Notes to study, Focus for timers, Connect for live tests, Coaching for classes, Target Exam for the daily path.")}>
              <HelpCircle className="size-4" /> Help
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <div className="bg-bar px-5 py-8 text-bar-foreground">
            <p className="font-display text-xl font-semibold tracking-tight">{copy.appName}</p>
            <p className="mt-1 text-xs text-bar-foreground/70">{copy.tests.name} · {copy.notes.name} · {copy.focus.name} · {copy.connect.name} · {copy.coaching.name} · {sectionLabel(copy.target.name, prefs.targetExamName, "Target Exam")}</p>
          </div>
          <nav className="py-2">
            {visibleNav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={
                    item.to === "/notes"
                      ? { view: "list", folder: "" }
                      : item.to === "/coaching"
                          ? { view: "hub" }
                        : item.to === "/target"
                            ? { game: "home" }
                            : item.to === "/focus"
                              ? { view: "apps", id: "", range: "30d" }
                              : item.to === "/mail"
                                ? { from: "tests", label: "", message: "", connector: "Gmail" }
                                : item.to === "/desk"
                                  ? { folder: "", from: "tests" }
                                  : undefined
                  }
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center gap-4 px-5 text-sm",
                    active ? "bg-primary/10 font-medium text-primary" : "text-foreground",
                  )}
                >
                  {copy.logos[sectionOfNav[item.to] as keyof typeof copy.logos] ? (
                    <img src={copy.logos[sectionOfNav[item.to] as keyof typeof copy.logos]} alt="" className="size-5 rounded object-cover" />
                  ) : (
                    <item.icon className="size-5" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <main className={cn("relative z-10", immersive ? "" : "pb-32")}>
        {routeAccess.state === "off" ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">This section is turned off in Admin.</p>
        ) : routeAccess.state === "locked" ? (
          <div className="mx-auto grid max-w-sm gap-3 px-6 py-16 text-center">
            <p className="text-sm">{routeAccess.name} is locked to {routeAccess.planName}{routeAccess.price ? ` (${routeAccess.price})` : ""}.</p>
            <Button onClick={() => void navigate({ to: "/subscriptions" })}>View subscriptions</Button>
          </div>
        ) : (
          <>
            <SectionExtras section={routeAccess.section} />
            {children}
          </>
        )}
      </main>
      <FocusGuard />
      <SectionNav />
    </div>
  );
}

function SectionExtras({ section }: { section: SectionId | null }) {
  const admin = useAdminState();
  const navigate = useNavigate();
  const builtinIds = new Set(defaultFunctions().map((item) => item.id));
  if (!section) return null;
  const extras = admin.controls.functions.filter((item) => item.section === section && !item.builtin && !builtinIds.has(item.id));
  if (!extras.length) return null;
  return (
    <ul className="mx-auto grid max-w-lg gap-2 px-4 pt-3">
      {extras.map((item) => {
        const access = functionAccess(admin, item.id);
        if (access.reason === "off") return null;
        return (
          <li key={item.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
            <p className="font-medium">{item.name}</p>
            {item.hint ? <p className="text-xs text-muted-foreground">{item.hint}</p> : null}
            {access.reason === "locked" ? (
              <button type="button" className="mt-2 text-xs text-primary" onClick={() => void navigate({ to: "/subscriptions" })}>
                Locked to {access.planName}. View subscriptions
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function sectionHint(pathname: string, copy: ReturnType<typeof useAdminCopy>) {
  if (
    pathname === "/" ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/add") ||
    pathname.startsWith("/friends") ||
    pathname.startsWith("/custom-study")
  ) {
    return copy.tests.intro;
  }
  if (pathname.startsWith("/notes")) return copy.notes.intro;
  if (pathname.startsWith("/focus")) return copy.focus.intro;
  if (pathname.startsWith("/connect") || pathname.startsWith("/quiz") || pathname.startsWith("/chat")) return copy.connect.intro;
  if (pathname.startsWith("/coaching") || pathname.startsWith("/discuss") || pathname.startsWith("/class")) return copy.coaching.intro;
  if (pathname.startsWith("/target")) return copy.target.intro;
  return "";
}
