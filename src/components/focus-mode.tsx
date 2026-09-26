import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Ban,
  Bell,
  Check,
  Clock3,
  HelpCircle,
  Hourglass,
  Info,
  ListFilter,
  Lock,
  Menu,
  Moon,
  PieChart,
  Pin,
  Plus,
  ScanLine,
  Search,
  Shield,
  Trash2,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { FocusMark } from "@/components/section-nav";
import { useAdminCopy } from "@/lib/admin/use-copy";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  addCustomApp,
  armDeviceLock,
  blockLabel,
  disarmDeviceLock,
  effectiveLimits,
  FOCUS_WEEKDAYS,
  formatDurationMin,
  formatUsage,
  hashPin,
  lockedCount,
  pinOk,
  remainingMs,
  setFocusMode,
  sortApps,
  sortGroups,
  startSession,
  stopSession,
  usageWindow,
  whyBlocked,
  withPeriodOn,
} from "@/lib/exam/focus";
import { grantDeviceAccess, readDeviceAccess, type DeviceAccess } from "@/lib/exam/focus-device";
import { playFocusSfx, unlockFocusSfx } from "@/lib/exam/focus-sfx";
import { useExamStore } from "@/lib/exam/store";
import {
  FOCUS_VERSION,
  defaultFocusLimits,
  type FocusApp,
  type FocusGroup,
  type FocusLimits,
  type FocusSort,
  type FocusState,
  type FocusWeekday,
} from "@/lib/exam/types";
import { mergeFocus } from "@/lib/exam/focus";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const FOCUS_VIEWS = ["apps", "groups", "usage", "settings", "help", "faq", "updates", "app", "group", "period", "pick", "access"] as const;
export type FocusView = (typeof FOCUS_VIEWS)[number];
export type FocusRange = "24h" | "30d";

export type FocusSearch = { view: FocusView; id: string; range: FocusRange };

const DURATIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180];

function useFocus(): [FocusState, (fn: (f: FocusState) => FocusState) => void] {
  const raw = useExamStore((s) => s.focus);
  const update = useExamStore((s) => s.updateFocus);
  return [mergeFocus(raw), (fn) => update((f) => fn(mergeFocus(f)))];
}

function Avatar({ app, className }: { app: Pick<FocusApp, "mark" | "hue" | "kind">; className?: string }) {
  return (
    <span
      className={cn("focus-avatar", app.kind === "setpaper" && "is-study", className)}
      style={{ "--focus-hue": String(app.hue) } as CSSProperties}
    >
      {app.mark}
    </span>
  );
}

function WeekChips({
  days,
  onToggle,
}: {
  days: FocusWeekday[];
  onToggle?: (d: FocusWeekday) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {FOCUS_WEEKDAYS.map((d, i) => {
        const on = days.includes(d.id);
        const node = (
          <span key={`${d.id}-${i}`} className={cn("focus-day", on && "is-on")}>
            {d.label}
          </span>
        );
        if (!onToggle) return node;
        return (
          <button key={`${d.id}-${i}`} type="button" onClick={() => onToggle(d.id)} aria-pressed={on}>
            {node}
          </button>
        );
      })}
    </div>
  );
}

function LimitIcons({ limits }: { limits: FocusLimits }) {
  return (
    <div className="flex gap-2">
      <span className={cn("focus-icon", limits.disabled && "is-on")} aria-label="Disabled">
        <Ban className="size-4" />
      </span>
      <span className={cn("focus-icon", limits.timerOn && "is-on")} aria-label="Off timer">
        <Hourglass className="size-4" />
      </span>
      <span className={cn("focus-icon", limits.usageOn && "is-on")} aria-label="Daily limit">
        <Clock3 className="size-4" />
      </span>
      <span className={cn("focus-icon", limits.periodOn && "is-on")} aria-label="Time window">
        <PieChart className="size-4" />
      </span>
    </div>
  );
}

function BackRow({ label, onBack, extra }: { label: string; onBack: () => void; extra?: ReactNode }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-1 bg-bar px-2 py-1 text-bar-foreground">
      <Button type="button" variant="ghost" size="icon" aria-label="Back" className="text-bar-foreground hover:bg-bar-foreground/10" onClick={onBack}>
        <ArrowLeft />
      </Button>
      <h2 className="min-w-0 flex-1 truncate font-display text-base font-semibold">{label}</h2>
      <div className="flex items-center text-bar-foreground [&_button]:text-bar-foreground [&_button]:hover:bg-bar-foreground/10">{extra}</div>
    </div>
  );
}

function GoldSwitch({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (v: boolean) => void; label?: string }) {
  return <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-focus" aria-label={label} />;
}

export function FocusMode({ search }: { search: FocusSearch }) {
  const navigate = useNavigate();
  const [focus, setFocus] = useFocus();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"unlock" | "set" | "confirm">("unlock");
  const [pinBuf, setPinBuf] = useState("");
  const [pinPending, setPinPending] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [clock, setClock] = useState<{ target: "app" | "group"; id: string; periodId: string; field: "start" | "end" } | null>(null);
  const [dur, setDur] = useState<{ target: "app" | "group" | "settings"; id: string; field: "off" | "wait" | "usage" } | null>(null);

  function go(view: FocusView, id = "", range: FocusRange = search.range) {
    void navigate({ to: "/focus", search: { view, id, range } });
  }

  function gated(action: () => void) {
    if ((focus.settings.pinEnabled || focus.settings.lockEnabled) && !unlocked) {
      setPinMode("unlock");
      setPinBuf("");
      setPinOpen(true);
      pending.current = action;
      return;
    }
    action();
  }

  const pending = useState(() => ({ current: null as null | (() => void) }))[0];

  function submitPin() {
    if (pinMode === "set") {
      if (pinBuf.length < 4) return;
      setPinPending(pinBuf);
      setPinBuf("");
      setPinMode("confirm");
      return;
    }
    if (pinMode === "confirm") {
      if (pinBuf !== pinPending) {
        playFocusSfx("deny");
        toast.error("PIN did not match");
        setPinBuf("");
        return;
      }
      setFocus((f) => ({ ...f, settings: { ...f.settings, pinEnabled: true, pinHash: hashPin(pinBuf) } }));
      setUnlocked(true);
      setPinOpen(false);
      playFocusSfx("unlock");
      toast.success("PIN saved");
      return;
    }
    if (!pinOk(focus.settings.pinHash, pinBuf)) {
      playFocusSfx("deny");
      toast.error("Wrong PIN");
      setPinBuf("");
      return;
    }
    setUnlocked(true);
    setPinOpen(false);
    playFocusSfx("unlock");
    pending.current?.();
    pending.current = null;
  }

  const view = search.view;
  const copy = useAdminCopy();
  const app = focus.apps.find((a) => a.id === search.id);
  const group = focus.groups.find((g) => g.id === search.id);

  return (
    <StudyShell title={copy.focus.name} hideHeader>
      <div onPointerDown={unlockFocusSfx}>
        {view === "apps" || view === "groups" ? (
          <Home
            focus={focus}
            tab={view}
            query={query}
            setQuery={setQuery}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            onMenu={() => setMenu(true)}
            onSort={() => setSortOpen(true)}
            onOpenApp={(id) => go("app", id)}
            onOpenGroup={(id) => go("group", id)}
            onTab={(tab) => go(tab)}
            onAccess={() => go("access")}
            onToggleMode={(on) => {
              if (!on) {
                gated(() => {
                  setFocus((f) => setFocusMode(f, false));
                  playFocusSfx("tap");
                  toast.success("Focus off");
                });
                return;
              }
              setFocus((f) => setFocusMode(f, true));
              playFocusSfx("tap");
              toast.success("Focus on");
            }}
            onAdd={() => {
              if (view === "apps") {
                setAddOpen(true);
                return;
              }
              const id = uid();
              setFocus((f) => ({
                ...f,
                groups: [
                  ...f.groups,
                  { id, name: "Target group", appIds: [], createdAt: Date.now(), limits: defaultFocusLimits() },
                ],
              }));
              go("group", id);
            }}
          />
        ) : null}
        {view === "app" && app ? (
          <AppEditor
            focus={focus}
            app={app}
            onBack={() => go("apps")}
            onChange={(limits) => gated(() => setFocus((f) => ({ ...f, apps: f.apps.map((x) => (x.id === app.id ? { ...x, limits } : x)) })))}
            onDelete={() =>
              gated(() => {
                setFocus((f) => ({ ...f, apps: f.apps.filter((x) => x.id !== app.id) }));
                go("apps");
              })
            }
            onStart={() => {
              const res = startSession(focus, app.id);
              if (res.reason !== "ok") {
                playFocusSfx("deny");
                toast.message(blockLabel(res.reason, app, focus) || "Cannot start");
                return;
              }
              setFocus(() => res.state);
              playFocusSfx("tap");
              toast.success(`Session on ${app.name}`);
              if (app.route) void navigate({ to: app.route });
            }}
            onStop={() => setFocus((f) => stopSession(f))}
            onPeriods={() => go("period", `app:${app.id}`)}
            onDuration={(field) => setDur({ target: "app", id: app.id, field })}
          />
        ) : null}
        {view === "app" && !app ? (
          <BackRow label="App" onBack={() => go("apps")} />
        ) : null}
        {view === "group" && group ? (
          <GroupEditor
            focus={focus}
            group={group}
            onBack={() => go("groups")}
            onSave={(next) => {
              gated(() => {
                setFocus((f) => ({ ...f, groups: f.groups.map((g) => (g.id === next.id ? next : g)) }));
                go("groups");
              });
            }}
            onLimits={(limits) =>
              gated(() => setFocus((f) => ({ ...f, groups: f.groups.map((g) => (g.id === group.id ? { ...g, limits } : g)) })))
            }
            onDelete={() =>
              gated(() => {
                setFocus((f) => ({ ...f, groups: f.groups.filter((g) => g.id !== group.id) }));
                go("groups");
              })
            }
            onPick={() => go("pick", group.id)}
            onPeriods={() => go("period", `group:${group.id}`)}
            onDuration={(field) => setDur({ target: "group", id: group.id, field })}
          />
        ) : null}
        {view === "group" && !group ? <BackRow label="Group" onBack={() => go("groups")} /> : null}
        {view === "pick" ? (
          <AppPicker
            focus={focus}
            selected={group?.appIds ?? []}
            onBack={() => go("group", search.id || "new")}
            onToggle={(id) =>
              setFocus((f) => ({
                ...f,
                groups: f.groups.map((g) =>
                  g.id === search.id
                    ? { ...g, appIds: g.appIds.includes(id) ? g.appIds.filter((x) => x !== id) : [...g.appIds, id] }
                    : g,
                ),
              }))
            }
          />
        ) : null}
        {view === "period" ? (
          <PeriodEditor
            focus={focus}
            token={search.id}
            onBack={() => {
              const [kind, id] = search.id.split(":");
              go(kind === "group" ? "group" : "app", id ?? "");
            }}
            onChange={(periods) =>
              gated(() => {
                const [kind, id] = search.id.split(":");
                setFocus((f) => {
                  if (kind === "group") {
                    return { ...f, groups: f.groups.map((g) => (g.id === id ? { ...g, limits: { ...g.limits, periods } } : g)) };
                  }
                  return { ...f, apps: f.apps.map((a) => (a.id === id ? { ...a, limits: { ...a.limits, periods } } : a)) };
                });
              })
            }
            onClock={(periodId, field) => {
              const [kind, id] = search.id.split(":");
              setClock({ target: kind === "group" ? "group" : "app", id: id ?? "", periodId, field });
            }}
          />
        ) : null}
        {view === "usage" ? <UsageView focus={focus} range={search.range} onRange={(range) => go("usage", "", range)} onBack={() => go("apps")} /> : null}
        {view === "settings" ? (
          <SettingsView
            focus={focus}
            onBack={() => go("apps")}
            onPatch={(patch) =>
              gated(() =>
                setFocus((f) => {
                  if (typeof patch.modeOn === "boolean") return setFocusMode(f, patch.modeOn);
                  return { ...f, settings: { ...f.settings, ...patch } };
                }),
              )
            }
            onPin={() => {
              setPinMode("set");
              setPinBuf("");
              setPinOpen(true);
            }}
            onDuration={(field) => setDur({ target: "settings", id: "settings", field })}
          />
        ) : null}
        {view === "access" ? (
          <DeviceAccess
            focus={focus}
            onBack={() => go("apps")}
            onArm={() => setFocus((f) => armDeviceLock(f))}
            onDisarm={() => gated(() => setFocus((f) => disarmDeviceLock(f)))}
            onPatch={(patch) => gated(() => setFocus((f) => ({ ...f, settings: { ...f.settings, ...patch } })))}
          />
        ) : null}
        {view === "help" ? <CopyView title="Help" onBack={() => go("apps")} body={HELP} /> : null}
        {view === "faq" ? <CopyView title="FAQ" onBack={() => go("apps")} body={FAQ} /> : null}
        {view === "updates" ? <CopyView title="Update information" onBack={() => go("apps")} body={UPDATES} /> : null}

        <Sheet open={menu} onOpenChange={setMenu}>
          <SheetContent>
            <div className="bg-bar px-5 py-8 text-bar-foreground">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-focus text-sm font-semibold text-focus-foreground">
                  {copy.focus.logoText || <FocusMark className="size-6" />}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">{copy.focus.name}</p>
                  <p className="text-xs text-bar-foreground/70">{copy.focus.intro}</p>
                </div>
              </div>
            </div>
            <nav className="py-2">
              {[
                { view: "access" as const, label: "Device access", icon: Shield },
                { view: "usage" as const, label: "App usage status", icon: PieChart },
                { view: "settings" as const, label: "Setting", icon: Info },
                { view: "help" as const, label: "Help", icon: HelpCircle },
                { view: "faq" as const, label: "FAQ", icon: HelpCircle },
                { view: "updates" as const, label: "Update information", icon: Bell },
              ].map((item) => (
                <button
                  key={item.view}
                  type="button"
                  className="flex h-12 w-full items-center gap-4 px-5 text-sm"
                  onClick={() => {
                    setMenu(false);
                    go(item.view);
                  }}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Dialog open={sortOpen} onOpenChange={setSortOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sort</DialogTitle>
              <DialogDescription>Order the {view === "groups" ? "groups" : "apps"} list</DialogDescription>
            </DialogHeader>
            {(["asc", "desc", "created"] as FocusSort[]).map((key) => {
              const current = view === "groups" ? focus.sortGroups : focus.sortApps;
              const label = key === "asc" ? "Ascending" : key === "desc" ? "Descending" : "Created";
              return (
                <button
                  key={key}
                  type="button"
                  className="flex h-12 items-center gap-3 rounded-lg px-2 text-left text-sm"
                  onClick={() => {
                    setFocus((f) => (view === "groups" ? { ...f, sortGroups: key } : { ...f, sortApps: key }));
                    setSortOpen(false);
                  }}
                >
                  <span className={cn("grid size-5 place-items-center rounded-full border border-focus", current === key && "bg-focus")}>
                    {current === key ? <span className="size-2 rounded-full bg-focus-foreground" /> : null}
                  </span>
                  {label}
                </button>
              );
            })}
          </DialogContent>
        </Dialog>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add app</DialogTitle>
              <DialogDescription>Name any app on your phone. Sessions are tracked inside SetPaper.</DialogDescription>
            </DialogHeader>
            <Input value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="App name" />
            <Button
              onClick={() => {
                if (!addName.trim()) return;
                setFocus((f) => addCustomApp(f, addName));
                setAddName("");
                setAddOpen(false);
                toast.success("App added");
              }}
            >
              Add
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={pinOpen} onOpenChange={setPinOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{pinMode === "unlock" ? "Enter PIN" : pinMode === "set" ? "Choose a 4-digit PIN" : "Confirm PIN"}</DialogTitle>
              <DialogDescription>PIN locks Focus settings. It is stored only on this device.</DialogDescription>
            </DialogHeader>
            <p className="text-center font-mono text-2xl tracking-[0.4em]">{pinBuf.replace(/./g, "•").padEnd(4, "·")}</p>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "←", "0", "OK"].map((key) => (
                <Button
                  key={key}
                  type="button"
                  variant={key === "OK" ? "default" : "secondary"}
                  onClick={() => {
                    if (key === "←") setPinBuf((p) => p.slice(0, -1));
                    else if (key === "OK") submitPin();
                    else if (pinBuf.length < 8) setPinBuf((p) => p + key);
                  }}
                >
                  {key}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {dur ? (
          <DurationDialog
            value={
              dur.target === "settings"
                ? dur.field === "off"
                  ? focus.settings.defaultOffMin
                  : dur.field === "wait"
                    ? focus.settings.defaultWaitMin
                    : focus.settings.defaultUsageMin
                : durationValue(focus, dur)
            }
            onClose={() => setDur(null)}
            onPick={(min) => {
              applyDuration(setFocus, dur, min);
              setDur(null);
            }}
          />
        ) : null}

        {clock ? (
          <ClockDialog
            value={clockValue(focus, clock)}
            onClose={() => setClock(null)}
            onPick={(hm) => {
              applyClock(setFocus, clock, hm);
              setClock(null);
            }}
          />
        ) : null}
      </div>
    </StudyShell>
  );
}

function Home({
  focus,
  tab,
  query,
  setQuery,
  searchOpen,
  setSearchOpen,
  onMenu,
  onSort,
  onOpenApp,
  onOpenGroup,
  onTab,
  onAdd,
  onAccess,
  onToggleMode,
}: {
  focus: FocusState;
  tab: "apps" | "groups";
  query: string;
  setQuery: (v: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  onMenu: () => void;
  onSort: () => void;
  onOpenApp: (id: string) => void;
  onOpenGroup: (id: string) => void;
  onTab: (tab: "apps" | "groups") => void;
  onAdd: () => void;
  onAccess: () => void;
  onToggleMode: (on: boolean) => void;
}) {
  const q = query.trim().toLowerCase();
  const apps = sortApps(focus.apps, focus.sortApps).filter((a) => !q || a.name.toLowerCase().includes(q));
  const groups = sortGroups(focus.groups, focus.sortGroups).filter((g) => !q || g.name.toLowerCase().includes(q));
  const copy = useAdminCopy();
  return (
    <div>
      <div className="sticky top-0 z-20 bg-bar text-bar-foreground">
        <div className="flex h-14 items-center gap-1 px-1">
          <Button type="button" variant="ghost" size="icon" aria-label="Focus menu" className="text-bar-foreground hover:bg-bar-foreground/10" onClick={onMenu}>
            <Menu />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
            <span className="grid size-8 place-items-center rounded-full bg-focus text-xs font-semibold text-focus-foreground">
              {copy.focus.logoText || <FocusMark className="size-4" />}
            </span>
            <h1 className="truncate font-display text-lg font-semibold tracking-tight">{copy.focus.name}</h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Search"
            aria-pressed={searchOpen}
            className="text-bar-foreground hover:bg-bar-foreground/10"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Sort" className="text-bar-foreground hover:bg-bar-foreground/10" onClick={onSort}>
            <ListFilter />
          </Button>
        </div>
        {searchOpen ? (
          <div className="border-t border-bar-foreground/10 px-3 py-2">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "groups" ? "Search groups" : "Search apps"}
              className="border-bar-foreground/20 bg-bar-foreground/10 text-bar-foreground placeholder:text-bar-foreground/50"
            />
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-4">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-2xl",
            focus.settings.modeOn ? "bg-focus text-focus-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          <FocusMark className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold">{focus.settings.modeOn ? "Focus is on" : "Focus is off"}</p>
          <p className="text-xs text-muted-foreground">
            {focus.settings.modeOn
              ? "Timers, caps, and the shield apply. Flip this off to study without locks."
              : "Saved limits stay put. Nothing is blocked until you turn Focus on."}
          </p>
        </div>
        <GoldSwitch
          checked={focus.settings.modeOn}
          onCheckedChange={onToggleMode}
          label={copy.focus.modeLabel}
        />
      </div>
      {focus.settings.modeOn && focus.settings.shieldOn ? (
        <button type="button" className="flex w-full items-center justify-between bg-focus px-4 py-2 text-left text-xs font-semibold text-focus-foreground" onClick={onAccess}>
          <span>Shield on · {lockedCount(focus)} apps locked in real time</span>
          <span>Device access</span>
        </button>
      ) : focus.settings.modeOn ? (
        <button type="button" className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-2 text-left text-xs font-medium" onClick={onAccess}>
          <span>Grant device access so locks run on this device</span>
          <Shield className="size-4 text-focus" />
        </button>
      ) : null}
      <div className="focus-tabs">
        <button type="button" className={cn(tab === "apps" && "is-on")} onClick={() => onTab("apps")}>
          Apps
        </button>
        <button type="button" className={cn(tab === "groups" && "is-on")} onClick={() => onTab("groups")}>
          Groups
        </button>
      </div>
      {tab === "apps" ? (
        <ul className="grid gap-3 p-3 pb-36">
          {apps.map((app) => {
            const limits = effectiveLimits(app, focus);
            const used = focus.todayUsed[app.id] ?? 0;
            const reason = whyBlocked(app, focus);
            const expanded = limits.timerOn || limits.usageOn || limits.periodOn || limits.disabled || reason !== "ok";
            return (
              <li key={app.id}>
                <button type="button" className="focus-card lift w-full" onClick={() => onOpenApp(app.id)}>
                  <div className="flex items-center gap-3">
                    <Avatar app={app} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{app.name}</p>
                      <LimitIcons limits={limits} />
                    </div>
                    {reason !== "ok" ? <Lock className="size-4 shrink-0 text-focus" /> : null}
                  </div>
                  <WeekChips days={limits.days} />
                  {expanded ? (
                    <div className="grid gap-1 text-xs text-muted-foreground">
                      {limits.disabled || reason === "shield" ? (
                        <p className="font-medium text-focus">{reason === "ok" ? "Switched off" : blockLabel(reason, app, focus)}</p>
                      ) : null}
                      {limits.timerOn ? (
                        <p>
                          Off timer {formatDurationMin(limits.offTimerMin)} · Waiting {formatDurationMin(limits.waitMin)}
                        </p>
                      ) : null}
                      {limits.usageOn ? (
                        <>
                          <p>Usage limit for 1 day {formatDurationMin(limits.usageLimitMin)}</p>
                          <div className="focus-meter">
                            <span style={{ width: `${Math.min(100, (used / limits.usageLimitMin) * 100)}%` }} />
                          </div>
                          <p className="text-focus">{used < 0.2 ? "Today unused" : `${formatDurationMin(used)} today`}</p>
                        </>
                      ) : null}
                      {limits.periodOn && limits.periods[0] ? (
                        <p>
                          Time period restricting the app usage {limits.periods[0].start} – {limits.periods[0].end}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="grid gap-3 p-3 pb-36">
          {groups.length === 0 ? (
            <li className="focus-card text-sm text-muted-foreground">Name a group, pick apps, then set the same timer, daily cap, and windows for all of them.</li>
          ) : null}
          {groups.map((g) => (
            <li key={g.id}>
              <button type="button" className="focus-card lift w-full" onClick={() => onOpenGroup(g.id)}>
                <p className="font-semibold">{g.name}</p>
                <div className="flex flex-wrap gap-1">
                  {g.appIds.slice(0, 8).map((id) => {
                    const a = focus.apps.find((x) => x.id === id);
                    return a ? <Avatar key={id} app={a} className="size-8 text-xs" /> : null;
                  })}
                </div>
                <LimitIcons limits={g.limits} />
                <WeekChips days={g.limits.days} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="focus-fab" aria-label={tab === "apps" ? "Add app" : "Add group"} onClick={onAdd}>
        <Plus className="size-6" />
      </button>
    </div>
  );
}

function LimitsForm({
  limits,
  onChange,
  onDuration,
  onPeriods,
}: {
  limits: FocusLimits;
  onChange: (l: FocusLimits) => void;
  onDuration: (field: "off" | "wait" | "usage") => void;
  onPeriods: () => void;
}) {
  return (
    <div className="grid gap-1">
      <WeekChips
        days={limits.days}
        onToggle={(d) =>
          onChange({
            ...limits,
            days: limits.days.includes(d) ? limits.days.filter((x) => x !== d) : [...limits.days, d].sort((a, b) => a - b),
          })
        }
      />
      <Row icon={<Ban className="size-4" />} title="Disable this app" extra={<GoldSwitch checked={limits.disabled} onCheckedChange={(v) => onChange({ ...limits, disabled: v })} />}>
        <p className="mt-1 text-xs text-muted-foreground">Blocks it immediately on this device. SetPaper sections lock in real time. Other phone apps cannot be closed from the browser.</p>
      </Row>
      <Row icon={<Hourglass className="size-4" />} title="Timer settings" extra={<GoldSwitch checked={limits.timerOn} onCheckedChange={(v) => onChange({ ...limits, timerOn: v })} />}>
        {limits.timerOn ? (
          <div className="grid">
            <button type="button" className="flex h-12 items-center justify-between px-1 text-sm" onClick={() => onDuration("off")}>
              Off timer <span className="text-muted-foreground">{formatDurationMin(limits.offTimerMin)}</span>
            </button>
            <button type="button" className="flex h-12 items-center justify-between px-1 text-sm" onClick={() => onDuration("wait")}>
              Waiting time <span className="text-muted-foreground">{formatDurationMin(limits.waitMin)}</span>
            </button>
          </div>
        ) : null}
      </Row>
      <Row
        icon={<Clock3 className="size-4" />}
        title="Setting the limit on usage time"
        extra={<GoldSwitch checked={limits.usageOn} onCheckedChange={(v) => onChange({ ...limits, usageOn: v })} />}
      >
        {limits.usageOn ? (
          <button type="button" className="flex h-12 w-full items-center justify-between px-1 text-sm" onClick={() => onDuration("usage")}>
            Usage limit for 1 day <span className="text-muted-foreground">{formatDurationMin(limits.usageLimitMin)}</span>
          </button>
        ) : null}
      </Row>
      <Row
        icon={<PieChart className="size-4" />}
        title="Setting the time period limit"
        extra={
          <GoldSwitch
            checked={limits.periodOn}
            onCheckedChange={(v) => onChange(v ? withPeriodOn(limits) : { ...limits, periodOn: false })}
          />
        }
      >
        {limits.periodOn ? (
          <button type="button" className="flex h-12 w-full items-center justify-between px-1 text-sm" onClick={onPeriods}>
            Time period restricting the app usage
            <span className="text-muted-foreground">{limits.periods[0] ? `${limits.periods[0].start} – ${limits.periods[0].end}` : "Add"}</span>
          </button>
        ) : null}
      </Row>
    </div>
  );
}

function Row({ icon, title, extra, children }: { icon: ReactNode; title: string; extra?: ReactNode; children?: ReactNode }) {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-focus">{icon}</span>
        <p className="min-w-0 flex-1 text-sm font-medium">{title}</p>
        {extra}
      </div>
      {children}
    </div>
  );
}

function AppEditor({
  focus,
  app,
  onBack,
  onChange,
  onDelete,
  onStart,
  onStop,
  onPeriods,
  onDuration,
}: {
  focus: FocusState;
  app: FocusApp;
  onBack: () => void;
  onChange: (l: FocusLimits) => void;
  onDelete: () => void;
  onStart: () => void;
  onStop: () => void;
  onPeriods: () => void;
  onDuration: (field: "off" | "wait" | "usage") => void;
}) {
  const live = focus.session?.appId === app.id && !focus.session.waiting;
  const reason = whyBlocked(app, focus);
  return (
    <div>
      <BackRow
        label={`${app.name} settings`}
        onBack={onBack}
        extra={
          app.custom ? (
            <Button type="button" variant="ghost" size="icon" aria-label="Delete" onClick={onDelete}>
              <Trash2 />
            </Button>
          ) : null
        }
      />
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Avatar app={app} />
        <div>
          <p className="font-semibold">{app.name}</p>
          <p className="text-xs text-muted-foreground">{app.kind === "setpaper" ? "Study section" : "Tracked app"}</p>
        </div>
      </div>
      <LimitsForm limits={app.limits} onChange={onChange} onDuration={onDuration} onPeriods={onPeriods} />
      <div className="p-4 pb-36">
        {live ? (
          <Button className="w-full" variant="secondary" onClick={onStop}>
            Stop session · {formatDurationMin(Math.max(1, Math.ceil(remainingMs(focus.session) / 60000)))} left
          </Button>
        ) : (
          <Button className="w-full bg-focus text-focus-foreground hover:bg-focus/90" onClick={onStart}>
            Start session
          </Button>
        )}
        {reason !== "ok" ? <p className="mt-2 text-xs text-muted-foreground">{blockLabel(reason, app, focus)}</p> : null}
      </div>
    </div>
  );
}

function GroupEditor({
  focus,
  group,
  onBack,
  onSave,
  onLimits,
  onDelete,
  onPick,
  onPeriods,
  onDuration,
}: {
  focus: FocusState;
  group: FocusGroup;
  onBack: () => void;
  onSave: (g: FocusGroup) => void;
  onLimits: (l: FocusLimits) => void;
  onDelete: () => void;
  onPick: () => void;
  onPeriods: () => void;
  onDuration: (field: "off" | "wait" | "usage") => void;
}) {
  const [name, setName] = useState(group.name);
  return (
    <div>
      <BackRow
        label={group.name || "New group"}
        onBack={onBack}
        extra={
          <div className="flex">
            <Button type="button" variant="ghost" size="icon" aria-label="Delete" onClick={onDelete}>
              <Trash2 />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Save" onClick={() => onSave({ ...group, name: name.trim() || "Group" })}>
              <Check />
            </Button>
          </div>
        }
      />
      <div className="grid gap-2 border-b border-border bg-card px-4 py-3">
        <label className="text-xs font-medium text-focus">Group name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Target MCL 21 days" />
        <p className="text-xs text-muted-foreground">Apps</p>
        <button type="button" className="flex flex-wrap gap-1" onClick={onPick}>
          {group.appIds.length === 0 ? <span className="text-sm text-muted-foreground">Pick apps</span> : null}
          {group.appIds.map((id) => {
            const a = focus.apps.find((x) => x.id === id);
            return a ? <Avatar key={id} app={a} className="size-9 text-xs" /> : null;
          })}
        </button>
      </div>
      <LimitsForm limits={group.limits} onChange={onLimits} onDuration={onDuration} onPeriods={onPeriods} />
      <div className="p-4 pb-36">
        <Button className="w-full bg-focus text-focus-foreground hover:bg-focus/90" onClick={() => onSave({ ...group, name: name.trim() || "Group" })}>
          Save group
        </Button>
      </div>
    </div>
  );
}

function AppPicker({
  focus,
  selected,
  onBack,
  onToggle,
}: {
  focus: FocusState;
  selected: string[];
  onBack: () => void;
  onToggle: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = sortApps(focus.apps, "asc").filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <BackRow label="Pick apps" onBack={onBack} extra={<Button type="button" variant="ghost" size="icon" onClick={onBack}><Check /></Button>} />
      <div className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
      </div>
      <ul className="pb-36">
        {list.map((app) => {
          const on = selected.includes(app.id);
          return (
            <li key={app.id}>
              <button type="button" className="flex h-14 w-full items-center gap-3 border-b border-border px-4 text-left" onClick={() => onToggle(app.id)}>
                <Avatar app={app} />
                <span className="min-w-0 flex-1 truncate">{app.name}</span>
                {on ? <Check className="size-4 text-focus" /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PeriodEditor({
  focus,
  token,
  onBack,
  onChange,
  onClock,
}: {
  focus: FocusState;
  token: string;
  onBack: () => void;
  onChange: (periods: FocusState["apps"][number]["limits"]["periods"]) => void;
  onClock: (periodId: string, field: "start" | "end") => void;
}) {
  const [kind, id] = token.split(":");
  const limits = kind === "group" ? focus.groups.find((g) => g.id === id)?.limits : focus.apps.find((a) => a.id === id)?.limits;
  const periods = limits?.periods ?? [];
  return (
    <div>
      <BackRow label="Setting the time period limit" onBack={onBack} extra={<Button type="button" variant="ghost" size="icon" onClick={onBack}><Check /></Button>} />
      {periods.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-muted-foreground">
          When you tap + and register the time period you want to restrict, a list will be displayed here.
        </p>
      ) : (
        <ul className="grid gap-2 p-3 pb-36">
          {periods.map((p) => (
            <li key={p.id} className="focus-card">
              <button type="button" className="flex h-12 items-center justify-between text-sm" onClick={() => onClock(p.id, "start")}>
                Restriction start time <span>{p.start}</span>
              </button>
              <button type="button" className="flex h-12 items-center justify-between text-sm" onClick={() => onClock(p.id, "end")}>
                Restriction end time <span>{p.end}</span>
              </button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onChange(periods.filter((x) => x.id !== p.id))}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="focus-fab"
        aria-label="Add period"
        onClick={() => onChange([...periods, { id: uid(), start: "12:00", end: "00:00" }])}
      >
        <Plus className="size-6" />
      </button>
    </div>
  );
}

function UsageView({
  focus,
  range,
  onRange,
  onBack,
}: {
  focus: FocusState;
  range: FocusRange;
  onRange: (r: FocusRange) => void;
  onBack: () => void;
}) {
  const rows = usageWindow(focus, range);
  return (
    <div>
      <BackRow
        label={range === "24h" ? "24 hours app usage status" : "30 days app usage status"}
        onBack={onBack}
        extra={
          <Button type="button" variant="ghost" size="sm" onClick={() => onRange(range === "24h" ? "30d" : "24h")}>
            {range === "24h" ? "30 days" : "24 hours"}
          </Button>
        }
      />
      <p className="bg-focus px-4 py-3 text-center text-xs font-medium text-focus-foreground">
        Usage is counted from Focus sessions inside SetPaper. Phone-level blocking is not available in this web app.
      </p>
      <ul className="grid gap-3 p-3 pb-36">
        {rows.length === 0 ? <li className="focus-card text-sm text-muted-foreground">No sessions yet. Start one from an app.</li> : null}
        {rows.map((row) => (
          <li key={row.app.id} className="focus-card">
            <div className="flex items-center gap-3">
              <Avatar app={row.app} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold">{row.app.name}</p>
                  <p className="text-sm tabular-nums">{row.percent.toFixed(2)}%</p>
                </div>
                <div className="focus-meter mt-1">
                  <span style={{ width: `${Math.min(100, row.percent)}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Usage time {formatUsage(row.seconds)}</p>
              </div>
            </div>
            <WeekChips days={row.app.limits.days} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsView({
  focus,
  onBack,
  onPatch,
  onPin,
  onDuration,
}: {
  focus: FocusState;
  onBack: () => void;
  onPatch: (p: Partial<FocusState["settings"]>) => void;
  onPin: () => void;
  onDuration: (field: "off" | "wait" | "usage") => void;
}) {
  const navigate = useNavigate();
  const s = focus.settings;
  const theme = useExamStore((st) => st.prefs.theme);
  const setPrefs = useExamStore((st) => st.setPrefs);
  const copy = useAdminCopy();
  return (
    <div className="pb-36">
      <BackRow label="Setting" onBack={onBack} />
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">{copy.focus.modeLabel}</h3>
      <Row
        icon={<FocusMark className="size-4" />}
        title={s.modeOn ? "Focus is on" : "Focus is off"}
        extra={<GoldSwitch checked={s.modeOn} onCheckedChange={(v) => onPatch({ modeOn: v })} label="Focus mode" />}
      >
        <p className="mt-1 text-xs text-muted-foreground">
          Master switch. Off pauses every lock and session. On applies the timers and shield you already set.
        </p>
      </Row>
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Timer settings</h3>
      <button type="button" className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-sm" onClick={() => onDuration("off")}>
        <span>Off timer (initial value)</span>
        <span className="text-muted-foreground">{formatDurationMin(s.defaultOffMin)}</span>
      </button>
      <button type="button" className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-sm" onClick={() => onDuration("wait")}>
        <span>Waiting time (initial value)</span>
        <span className="text-muted-foreground">{formatDurationMin(s.defaultWaitMin)}</span>
      </button>
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Setting the limit on usage time</h3>
      <button type="button" className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-sm" onClick={() => onDuration("usage")}>
        <span>Usage limit for 1 day (initial value)</span>
        <span className="text-muted-foreground">{formatDurationMin(s.defaultUsageMin)}</span>
      </button>
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Notification settings</h3>
      <Row icon={<Bell className="size-4" />} title="Notify before the app closes" extra={<GoldSwitch checked={s.notifyBeforeClose} onCheckedChange={(v) => onPatch({ notifyBeforeClose: v })} />}>
        <p className="mt-1 text-xs text-muted-foreground">Notify 5 minutes before the app closes.</p>
      </Row>
      <Row icon={<Clock3 className="size-4" />} title="Display remaining available time" extra={<GoldSwitch checked={s.displayRemaining} onCheckedChange={(v) => onPatch({ displayRemaining: v })} />}>
        <p className="mt-1 text-xs text-muted-foreground">Show remaining session time on a gold bar.</p>
      </Row>
      <Row icon={<PieChart className="size-4" />} title="Notify the usage status of the app" extra={<GoldSwitch checked={s.notifyUsage} onCheckedChange={(v) => onPatch({ notifyUsage: v })} />} />
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Other settings</h3>
      <Row
        icon={<Lock className="size-4" />}
        title="Password settings"
        extra={
          <GoldSwitch
            checked={s.pinEnabled}
            onCheckedChange={(v) => {
              if (v) onPin();
              else onPatch({ pinEnabled: false, pinHash: "" });
            }}
          />
        }
      />
      <Row icon={<Pin className="size-4" />} title="Restrictions on pinned apps" extra={<GoldSwitch checked={s.restrictPinned} onCheckedChange={(v) => onPatch({ restrictPinned: v })} />}>
        <p className="mt-1 text-xs text-muted-foreground">Pinned study apps still follow timer, cap, and window limits.</p>
      </Row>
      <Row icon={<Volume2 className="size-4" />} title="Audio message" extra={<GoldSwitch checked={s.audioMessage} onCheckedChange={(v) => onPatch({ audioMessage: v })} />}>
        <p className="mt-1 text-xs text-muted-foreground">When a session is closed by Focus, a short spoken message plays.</p>
      </Row>
      <Row
        icon={<Moon className="size-4" />}
        title="Dark theme"
        extra={
          <select
            className="h-10 rounded-md border border-border bg-card px-2 text-sm"
            value={s.darkTheme}
            onChange={(e) => {
              const darkTheme = e.target.value as FocusState["settings"]["darkTheme"];
              onPatch({ darkTheme });
              if (darkTheme === "light" || darkTheme === "dark") setPrefs({ theme: darkTheme });
              else setPrefs({ theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" });
            }}
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        }
      >
        <p className="mt-1 text-xs text-muted-foreground">{theme === "dark" ? "Dark" : "Light"} on this device</p>
      </Row>
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Special app access</h3>
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-left text-sm"
        onClick={() => void navigate({ to: "/focus", search: { view: "access", id: "", range: "30d" } })}
      >
        <span className="flex items-center gap-3">
          <Shield className="size-4 text-focus" />
          Device access
        </span>
        <span className="text-muted-foreground">{s.shieldOn ? "Shield on" : "Grant"}</span>
      </button>
      <Row
        icon={<Shield className="size-4" />}
        title="Protect Focus"
        extra={
          <GoldSwitch
            checked={s.lockEnabled}
            onCheckedChange={(v) => {
              if (v && !s.pinEnabled) onPin();
              onPatch({ lockEnabled: v });
            }}
          />
        }
      >
        <p className="mt-1 text-xs text-muted-foreground">
          Locks Focus so limits cannot be turned off without your PIN. SetPaper cannot take phone admin rights, but this keeps the study lock on inside the app.
        </p>
      </Row>
      <div className="mt-8 grid place-items-center gap-2 px-4 pb-6 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-focus text-focus-foreground shadow-btn">
          <FocusMark className="size-8" />
        </span>
        <p className="font-display text-sm font-semibold">Focus {FOCUS_VERSION}</p>
        <p className="text-xs text-muted-foreground">SetPaper · study timers</p>
      </div>
    </div>
  );
}

function permLabel(state: DeviceAccess["notify"]) {
  if (state === "granted") return "Allowed on this device";
  if (state === "denied") return "Blocked in browser settings";
  if (state === "unsupported") return "Not available here";
  return "Tap Grant";
}

function DeviceAccess({
  focus,
  onBack,
  onArm,
  onDisarm,
  onPatch,
}: {
  focus: FocusState;
  onBack: () => void;
  onArm: () => void;
  onDisarm: () => void;
  onPatch: (p: Partial<FocusState["settings"]>) => void;
}) {
  const [access, setAccess] = useState<DeviceAccess | null>(null);
  const [busy, setBusy] = useState(false);
  const s = focus.settings;
  const copy = useAdminCopy();
  const locked = lockedCount(focus);

  useEffect(() => {
    setAccess(readDeviceAccess());
  }, [s.shieldOn, s.accessGrantedAt]);

  async function grantAndArm() {
    setBusy(true);
    try {
      const next = await grantDeviceAccess();
      setAccess(next);
      onArm();
    } finally {
      setBusy(false);
    }
  }

  async function grantOnly() {
    setBusy(true);
    try {
      setAccess(await grantDeviceAccess());
      onPatch({ accessGrantedAt: Date.now() });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-36">
      <BackRow label="Device access" onBack={onBack} />
      <div className={cn("px-4 py-4", s.shieldOn ? "bg-focus text-focus-foreground" : "bg-card")}>
        <p className="font-display text-lg font-semibold">{s.shieldOn ? "Shield is on" : "Shield is off"}</p>
        <p className="mt-1 text-sm opacity-90">
          {s.shieldOn
            ? `${locked} apps locked in real time on this device. SetPaper sections cannot open until you disarm.`
            : "Grant notifications, keep-awake, and the in-app lock. Then arm the shield to block listed apps as you use SetPaper."}
        </p>
      </div>
      <div className="grid gap-2 p-4">
        {s.shieldOn ? (
          <Button variant="secondary" className="h-12" onClick={onDisarm}>
            Disarm shield
          </Button>
        ) : (
          <Button className="h-12 bg-focus text-focus-foreground hover:bg-focus/90" disabled={busy} onClick={() => void grantAndArm()}>
            <ScanLine className="size-4" />
            {busy ? "Asking this device…" : "Grant access and lock every app"}
          </Button>
        )}
        <Button variant="outline" disabled={busy} onClick={() => void grantOnly()}>
          Grant permissions only
        </Button>
      </div>
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Live on this device</h3>
      <Row icon={<Bell className="size-4" />} title="Notifications" extra={<span className="text-xs text-muted-foreground">{access ? permLabel(access.notify) : "Checking"}</span>}>
        <p className="mt-1 text-xs text-muted-foreground">Timer warnings and close alerts use the real browser permission. It shows in site settings on your phone.</p>
      </Row>
      <Row icon={<Clock3 className="size-4" />} title="Keep screen awake" extra={<span className="text-xs text-muted-foreground">{access?.wakeSupported ? "Supported" : "Not available"}</span>}>
        <p className="mt-1 text-xs text-muted-foreground">While a session or the shield is on, this device is asked to stay awake so the timer keeps running.</p>
      </Row>
      <Row icon={<Pin className="size-4" />} title="Save Focus on this device" extra={<span className="text-xs text-muted-foreground">{access?.persistSupported ? "Ready" : "Not available"}</span>}>
        <p className="mt-1 text-xs text-muted-foreground">Asks the browser to keep Focus data when storage is tight.</p>
      </Row>
      <Row icon={<Shield className="size-4" />} title="Installed as app" extra={<span className="text-xs text-muted-foreground">{access?.standalone ? "Yes" : "Browser tab"}</span>} />
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">What this can lock</h3>
      <Row icon={<Lock className="size-4" />} title="SetPaper sections" extra={<span className="text-xs text-muted-foreground">Live</span>}>
        <p className="mt-1 text-xs text-muted-foreground">Tests, Notes, Connect, Coaching, and Target lock in real time when the shield or a disable switch is on.</p>
      </Row>
      <Row icon={<Ban className="size-4" />} title="Other phone apps" extra={<span className="text-xs text-muted-foreground">Not available</span>}>
        <p className="mt-1 text-xs text-muted-foreground">
          A website cannot read your full app list, close WhatsApp, or become a device administrator. Those names stay in the catalog so you can timer-lock habits inside SetPaper.
        </p>
      </Row>
      {access?.related.length ? (
        <Row icon={<ScanLine className="size-4" />} title="Related apps this browser can see">
          <p className="mt-1 text-xs text-muted-foreground">{access.related.join(", ")}</p>
        </Row>
      ) : null}
      <h3 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-focus">Shield options</h3>
      <Row
        icon={<Shield className="size-4" />}
        title={copy.focus.shieldLabel}
        extra={
          <GoldSwitch
            checked={s.shieldOn}
            onCheckedChange={(v) => {
              if (v) void grantOnly().then(() => onPatch({ shieldOn: true }));
              else onPatch({ shieldOn: false });
            }}
          />
        }
      >
        <p className="mt-1 text-xs text-muted-foreground">Enforces timers immediately. Switching away from SetPaper is counted as This device.</p>
      </Row>
      <Row
        icon={<Ban className="size-4" />}
        title={copy.focus.blockLabel}
        extra={
          <GoldSwitch
            checked={s.blockAllOn}
            onCheckedChange={(v) => onPatch({ blockAllOn: v, shieldOn: v ? true : s.shieldOn })}
          />
        }
      >
        <p className="mt-1 text-xs text-muted-foreground">Hard lock. Disarm to study again. PIN protects this switch when Protect Focus is on.</p>
      </Row>
    </div>
  );
}

function CopyView({ title, onBack, body }: { title: string; onBack: () => void; body: string }) {
  return (
    <div>
      <BackRow label={title} onBack={onBack} />
      <div className="grid gap-3 p-4 pb-36 text-sm leading-relaxed whitespace-pre-wrap">{body}</div>
    </div>
  );
}

function DurationDialog({ value, onClose, onPick }: { value: number; onClose: () => void; onPick: (n: number) => void }) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duration</DialogTitle>
          <DialogDescription>Off timer, waiting time, or daily usage cap.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-80 gap-1 overflow-auto">
          {DURATIONS.map((n) => (
            <button key={n} type="button" className={cn("flex h-11 items-center justify-between rounded-lg px-3 text-sm", n === value && "bg-focus/15 font-semibold")} onClick={() => onPick(n)}>
              {formatDurationMin(n)}
              {n === value ? <Check className="size-4 text-focus" /> : null}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClockDialog({ value, onClose, onPick }: { value: string; onClose: () => void; onPick: (hm: string) => void }) {
  const parsed = parseClock(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [pm, setPm] = useState(parsed.pm);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const label = `${String(to24(hour, pm)).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const ticks = mode === "hour" ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const active = mode === "hour" ? (hour % 12 === 0 ? 12 : hour) : Math.round(minute / 5) * 5 % 60;
  const angle = mode === "hour" ? (hour % 12) * 30 : (minute / 60) * 360;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Restriction time</DialogTitle>
          <DialogDescription>Set the start or end of a blocked window.</DialogDescription>
        </DialogHeader>
        <p className="text-center font-display text-4xl font-semibold tabular-nums tracking-tight">{label}</p>
        <div className="focus-clock">
          <span className="focus-clock-hand" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} />
          <span className="focus-clock-hub" />
          {ticks.map((n, i) => {
            const a = ((i / 12) * 360 - 90) * (Math.PI / 180);
            const x = 50 + Math.cos(a) * 38;
            const y = 50 + Math.sin(a) * 38;
            const on = n === active;
            return (
              <button
                key={n}
                type="button"
                className={cn(
                  "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-semibold",
                  on ? "bg-focus text-focus-foreground" : "text-foreground",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => {
                  if (mode === "hour") {
                    setHour(n === 12 ? 12 : n);
                    setMode("minute");
                  } else setMinute(n);
                }}
              >
                {mode === "hour" ? n : String(n).padStart(2, "0")}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center gap-2">
          <Button type="button" variant={pm ? "secondary" : "default"} className={!pm ? "bg-focus text-focus-foreground hover:bg-focus/90" : undefined} onClick={() => setPm(false)}>AM</Button>
          <Button type="button" variant={pm ? "default" : "secondary"} className={pm ? "bg-focus text-focus-foreground hover:bg-focus/90" : undefined} onClick={() => setPm(true)}>PM</Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="bg-focus text-focus-foreground hover:bg-focus/90" onClick={() => onPick(label)}>OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function parseClock(hm: string) {
  const [hRaw, mRaw] = hm.split(":").map(Number);
  const h24 = Number(hRaw) || 0;
  const minute = Number(mRaw) || 0;
  const pm = h24 >= 12;
  const hour = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hour, minute, pm };
}

function to24(hour: number, pm: boolean) {
  const h = hour % 12;
  return pm ? h + 12 : h;
}

function durationValue(focus: FocusState, dur: { target: "app" | "group" | "settings"; id: string; field: "off" | "wait" | "usage" }) {
  const limits = dur.target === "group" ? focus.groups.find((g) => g.id === dur.id)?.limits : focus.apps.find((a) => a.id === dur.id)?.limits;
  if (!limits) return 10;
  if (dur.field === "off") return limits.offTimerMin;
  if (dur.field === "wait") return limits.waitMin;
  return limits.usageLimitMin;
}

function applyDuration(setFocus: (fn: (f: FocusState) => FocusState) => void, dur: { target: "app" | "group" | "settings"; id: string; field: "off" | "wait" | "usage" }, min: number) {
  setFocus((f) => {
    if (dur.target === "settings") {
      const settings = { ...f.settings };
      if (dur.field === "off") settings.defaultOffMin = min;
      else if (dur.field === "wait") settings.defaultWaitMin = min;
      else settings.defaultUsageMin = min;
      return { ...f, settings };
    }
    const patch = (limits: FocusLimits) =>
      dur.field === "off" ? { ...limits, offTimerMin: min } : dur.field === "wait" ? { ...limits, waitMin: min } : { ...limits, usageLimitMin: min };
    if (dur.target === "group") return { ...f, groups: f.groups.map((g) => (g.id === dur.id ? { ...g, limits: patch(g.limits) } : g)) };
    return { ...f, apps: f.apps.map((a) => (a.id === dur.id ? { ...a, limits: patch(a.limits) } : a)) };
  });
}

function clockValue(focus: FocusState, clock: { target: "app" | "group"; id: string; periodId: string; field: "start" | "end" }) {
  const limits = clock.target === "group" ? focus.groups.find((g) => g.id === clock.id)?.limits : focus.apps.find((a) => a.id === clock.id)?.limits;
  const p = limits?.periods.find((x) => x.id === clock.periodId);
  return (clock.field === "start" ? p?.start : p?.end) ?? "12:00";
}

function applyClock(setFocus: (fn: (f: FocusState) => FocusState) => void, clock: { target: "app" | "group"; id: string; periodId: string; field: "start" | "end" }, hm: string) {
  setFocus((f) => {
    const patch = (limits: FocusLimits) => ({
      ...limits,
      periods: limits.periods.map((p) => (p.id === clock.periodId ? { ...p, [clock.field]: hm } : p)),
    });
    if (clock.target === "group") return { ...f, groups: f.groups.map((g) => (g.id === clock.id ? { ...g, limits: patch(g.limits) } : g)) };
    return { ...f, apps: f.apps.map((a) => (a.id === clock.id ? { ...a, limits: patch(a.limits) } : a)) };
  });
}

const HELP = `Focus is SetPaper’s study timer and device lock.

Use the switch at the top of Focus to turn the whole mode on or off. Off pauses every lock and session; your app timers stay saved. On applies them again.

Device access asks this browser for notifications, keep-awake, and stored Focus data. Those are real permissions — they appear in the site settings on your phone.

Arm the shield to lock listed apps in real time. SetPaper sections (Tests, Notes, Connect, Coaching, Target) cannot open while Focus and the shield are on. Switching away from SetPaper is counted as This device.

Apps lists common phone names plus every SetPaper section. A website cannot read every app installed on the phone or close WhatsApp. Add extra names with +.

Marks on each row:
• Ban — disable immediately
• Hourglass — off timer, then a waiting lock
• Clock — daily usage cap
• Pie — time windows when the app stays closed

Days run Sunday to Saturday. Gold means that day is on.`;

const FAQ = `How do I turn Focus off?
Open the Focus tab and flip “Focus is on”. Limits stay saved. Flip it back on when you want locks again. Protect Focus can require your PIN to turn it off.

Can Focus close WhatsApp on my phone?
No. Browsers cannot list or kill other apps, and they cannot become a device administrator. Grant Device access for real notifications and keep-awake, then arm the shield to lock SetPaper itself.

Does Grant access do anything on the device?
Yes. Notifications use the system permission dialog. Keep-awake uses the screen wake lock. Focus data can be marked persistent. Those show in the browser’s site settings.

How do I lock everything?
Turn Focus on, then Device access → Grant access and lock every app. Tests and the other SetPaper sections stay locked until you disarm or turn Focus off. PIN Protect Focus so those switches cannot be flipped by accident.

Why are some apps already in the list?
So you can timer-lock the same names you use on a phone. They are a catalog, not a scan of your installed packages.

Where did terms and privacy pages go?
They are not part of Focus.`;

const UPDATES = `Focus ${FOCUS_VERSION}
• On/off switch for the whole Focus mode
• Device access with real notifications and keep-awake
• Shield locks SetPaper sections in real time
• Disable switch per app
• Away time counted as This device
• Gold mark in the middle of the bar
• No terms page`;
