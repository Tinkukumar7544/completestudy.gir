import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatAccountLabel } from "@/lib/exam/account";
import { applyActiveColors, applyPlayerMode, isActiveSeat, LUDO_COLOR_LABEL } from "@/lib/exam/ludo-path";
import { DAILY_GOAL_OPTIONS } from "@/lib/exam/exam-path";
import { useExamStore } from "@/lib/exam/store";
import { useFunctionAccess } from "@/lib/admin/use-copy";
import { syncNow, toastOutcome, useSyncUi } from "@/lib/exam/sync";
import { defaultExamPath, defaultLudo, LUDO_COLORS, normalizeExamPath, normalizeLudo, type AnswerButtonSize, type LudoColor, type LudoPlayerMode, type NewPosition, type PathDailyGoal, type ThemeName } from "@/lib/exam/types";

export const Route = createFileRoute("/settings")({ component: Settings });

function Locked({ name, plan, onOpen }: { name: string; plan: string; onOpen: () => void }) {
  return (
    <button type="button" className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-left" onClick={onOpen}>
      <span>
        <span className="block text-sm">{name}</span>
        <span className="text-xs text-muted-foreground">Locked to {plan}</span>
      </span>
      <span className="text-sm text-primary">Unlock</span>
    </button>
  );
}

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm">{title}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Group({ title }: { title: string }) {
  return <h2 className="bg-background px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h2>;
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
  const general = useFunctionAccess("settings.general");
  const reviewing = useFunctionAccess("settings.reviewing");
  const appearance = useFunctionAccess("settings.appearance");
  const focusSettings = useFunctionAccess("settings.focus");
  const targetSettings = useFunctionAccess("settings.target");
  const syncing = useSyncUi((s) => s.syncing);
  const lastError = useSyncUi((s) => s.lastError);

  async function runSync() {
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

  const syncedLabel = lastSyncedAt
    ? `Last saved ${new Date(lastSyncedAt).toLocaleString()}`
    : "Changes save automatically after you connect";

  return (
    <StudyShell title="Settings">
      <Group title="Account" />
      <div className="border-b border-border bg-card px-4 py-3">
        {user ? (
          <div className="grid gap-3">
            <div>
              <p className="text-sm font-medium">{formatAccountLabel(user.primaryEmail) || user.displayName || "Signed in"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{syncedLabel}. New decks, questions, notes, and reviews stay on this account.</p>
              {lastError ? <p className="mt-1 text-xs text-destructive">{lastError}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => void runSync()} disabled={syncing}>
                {syncing ? "Syncing…" : "Sync now"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void signOut("/login?mode=signin&via=email").catch(() => toast.error("Could not log out"));
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm">Not signed in</p>
            <p className="text-xs text-muted-foreground">
              Create an account with an email ID or a 10-digit mobile number. You only do this once on this device — after that, every change saves in the background.
            </p>
            <Button
              size="sm"
              className="w-fit"
              onClick={() => void navigate({ to: "/login", search: { mode: "signup", via: "email" } })}
            >
              Create account or sign in
            </Button>
          </div>
        )}
      </div>
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3 text-left"
        onClick={() => void navigate({ to: "/admin" })}
      >
        <span>
          <span className="block text-sm">Admin</span>
          <span className="text-xs text-muted-foreground">Email and password required. Turn sections and functions on or off, and choose what a subscription unlocks.</span>
        </span>
        <span className="text-sm text-primary">Open</span>
      </button>

      {general.allowed ? (
      <>
      <Group title="General" />
      <Row title="Language" hint="Interface language">
        <select
          className="h-10 rounded-md border border-border bg-card px-2 text-sm"
          value={prefs.language}
          onChange={(e) => setPrefs({ language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </Row>
      <Row title="Deck for new questions" hint="Used when adding a note">
        <span className="text-xs text-muted-foreground">Current deck</span>
      </Row>
      <Row title="Error reporting" hint="Off — local only">
        <Switch checked={false} disabled />
      </Row>
      </>
      ) : general.reason === "locked" ? <Locked name={general.name} plan={general.planName} onOpen={() => void navigate({ to: "/subscriptions" })} /> : null}

      {reviewing.allowed ? (
      <>
      <Group title="Notifications" />
      <Row title="Notify when due" hint="Browser notification if allowed">
        <Switch
          checked={prefs.notifyWhenDue}
          onCheckedChange={(v) => {
            setPrefs({ notifyWhenDue: v });
            if (v && typeof Notification !== "undefined") void Notification.requestPermission();
          }}
        />
      </Row>

      <Group title="Reviewing" />
      <Row title="New question position">
        <select
          className="h-10 rounded-md border border-border bg-card px-2 text-sm"
          value={prefs.newPosition}
          onChange={(e) => setPrefs({ newPosition: e.target.value as NewPosition })}
        >
          <option value="mixed">Mix with reviews</option>
          <option value="after">After reviews</option>
          <option value="before">Before reviews</option>
        </select>
      </Row>
      <Row title="Start of next day" hint="Hour (0–23)">
        <Input
          className="w-20"
          type="number"
          min={0}
          max={23}
          value={prefs.dayStartHour}
          onChange={(e) => setPrefs({ dayStartHour: Number(e.target.value) })}
        />
      </Row>
      <Row title="Learn ahead limit (min)">
        <Input
          className="w-20"
          type="number"
          value={prefs.learnAheadMinutes}
          onChange={(e) => setPrefs({ learnAheadMinutes: Number(e.target.value) })}
        />
      </Row>
      <Row title="Timebox (min)" hint="0 = off">
        <Input
          className="w-20"
          type="number"
          value={prefs.timeboxMinutes}
          onChange={(e) => setPrefs({ timeboxMinutes: Number(e.target.value) })}
        />
      </Row>
      <Row title="Keep screen on">
        <Switch checked={prefs.keepScreenOn} onCheckedChange={(v) => setPrefs({ keepScreenOn: v })} />
      </Row>
      <Row title="Fullscreen review">
        <Switch checked={prefs.fullscreenReview} onCheckedChange={(v) => setPrefs({ fullscreenReview: v })} />
      </Row>
      <Row title="Show remaining count">
        <Switch checked={prefs.showRemaining} onCheckedChange={(v) => setPrefs({ showRemaining: v })} />
      </Row>
      <Row title="Show button time">
        <Switch checked={prefs.showButtonTime} onCheckedChange={(v) => setPrefs({ showButtonTime: v })} />
      </Row>
      <Row title="Answer button size">
        <select
          className="h-10 rounded-md border border-border bg-card px-2 text-sm"
          value={prefs.answerButtonSize}
          onChange={(e) => setPrefs({ answerButtonSize: e.target.value as AnswerButtonSize })}
        >
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
        </select>
      </Row>
      <Row title="Card zoom %">
        <Input className="w-20" type="number" value={prefs.cardZoom} onChange={(e) => setPrefs({ cardZoom: Number(e.target.value) })} />
      </Row>
      </>
      ) : reviewing.reason === "locked" ? <Locked name={reviewing.name} plan={reviewing.planName} onOpen={() => void navigate({ to: "/subscriptions" })} /> : null}

      {appearance.allowed ? (
      <>
      <Group title="Appearance" />
      <Row title="Night mode">
        <Switch
          checked={prefs.theme === "dark"}
          onCheckedChange={(v) => setPrefs({ theme: (v ? "dark" : "light") as ThemeName })}
        />
      </Row>

      <Group title="Gestures" />
      <div className="border-b border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        Study runs inside the exam paper. Use the paper buttons (Next, Mark, Clear) and keyboard M / C / arrows. Deck list: tap name to study, tap counts for overview, long-press for actions.
      </div>
      </>
      ) : appearance.reason === "locked" ? <Locked name={appearance.name} plan={appearance.planName} onOpen={() => void navigate({ to: "/subscriptions" })} /> : null}

      <Group title="Exam templates" />
      <div className="border-b border-border bg-card px-4 py-3">
        <p className="text-sm">
          {active ? (
            <>
              Active: <span className="font-medium">{active.name}</span>
              {active.kind === "bundled" ? " · TCS iON paper" : active.fileName ? ` · ${active.fileName}` : ""}
            </>
          ) : (
            "TCS iON paper"
          )}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Bookmark one template for study. Add, edit, or replace others without changing the rest. Pattern, timers, options, and candidate details are set per template.
        </p>
        <Button
          className="mt-3"
          onClick={() => void navigate({ to: "/templates" })}
        >
          <Bookmark className="size-4" />
          Manage templates
        </Button>
      </div>

      {focusSettings.allowed ? (
      <>
      <Group title="Focus" />
      <div className="border-b border-border bg-card px-4 py-3">
        <p className="text-sm">Off timer, daily caps, and time windows</p>
        <p className="mt-1 text-xs text-muted-foreground">Gold tab in the middle of the bar. Privacy, terms, and account deletion are in the three-dot menu.</p>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={() => void navigate({ to: "/focus", search: { view: "settings", id: "", range: "30d" } })}
        >
          Open Focus settings
        </Button>
      </div>
      </>
      ) : focusSettings.reason === "locked" ? <Locked name={focusSettings.name} plan={focusSettings.planName} onOpen={() => void navigate({ to: "/subscriptions" })} /> : null}

      {targetSettings.allowed ? (
      <>
      <Group title="Target path" />
      <Row title="Daily steps" hint="How many path steps count as a full day">
        <select
          className="h-10 rounded-md border border-border bg-card px-2 text-sm"
          value={path.intake.dailyGoal}
          disabled={!path.intake.completed}
          onChange={(e) => {
            const dailyGoal = Number(e.target.value) as PathDailyGoal;
            updatePath((p) => ({ ...p, intake: { ...p.intake, dailyGoal } }));
          }}
        >
          {DAILY_GOAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} · {opt.hint}
            </option>
          ))}
        </select>
      </Row>
      <Row title="Weekly checks" hint="A checkpoint after each subject on the path">
        <Switch
          checked={path.intake.weeklyTests}
          disabled={!path.intake.completed}
          onCheckedChange={(v) => updatePath((p) => ({ ...p, intake: { ...p.intake, weeklyTests: v } }))}
        />
      </Row>
      <Row title="Path sound" hint="Taps, unlocks, and finished steps">
        <Switch
          checked={path.progress.sound}
          onCheckedChange={(v) => updatePath((p) => ({ ...p, progress: { ...p.progress, sound: v } }))}
        />
      </Row>
      <div className="border-b border-border bg-card px-4 py-3">
        <p className="text-sm">Redo the setup questions</p>
        <p className="mt-1 text-xs text-muted-foreground">The path is created only after every question is answered.</p>
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={() => {
            updatePath((p) => ({ ...p, intake: { ...p.intake, completed: false } }));
            void navigate({ to: "/target", search: { game: "home" } });
          }}
        >
          Open setup
        </Button>
      </div>

      <Group title="Target exam" />
      <Row title="Players on the target" hint="Two uses you and the opposite colour. Four uses every column. Custom lets you pick any mix — empty seats never play themselves.">
        <select
          className="h-10 rounded-md border border-border bg-card px-2 text-sm"
          value={ludo.playerMode}
          data-ludo-mode={ludo.playerMode}
          onChange={(e) => {
            const mode = e.target.value as LudoPlayerMode;
            updateLudo((b) => applyPlayerMode(b, mode));
            toast.success(
              mode === "two" ? "Two columns stay on the target" : mode === "four" ? "All four columns are on the target" : "Pick which columns stay on the target",
            );
          }}
        >
          <option value="two">Two player</option>
          <option value="four">Four player</option>
          <option value="custom">Custom</option>
        </select>
      </Row>
      {LUDO_COLORS.map((color) => {
        const on = isActiveSeat(ludo, color);
        const yours = color === ludo.playerColor;
        return (
          <Row
            key={color}
            title={`${LUDO_COLOR_LABEL[color]} column`}
            hint={yours ? "Your column" : on ? "On this target" : "Off this target"}
          >
            <span data-ludo-seat={color} data-live={on ? "1" : "0"}>
              <Switch
                checked={on}
                onCheckedChange={(v) => {
                  const next: LudoColor[] = v ? [...ludo.activeColors, color] : ludo.activeColors.filter((c) => c !== color);
                  if (!next.length) {
                    toast.message("Keep at least one column on the target");
                    return;
                  }
                  updateLudo((b) => applyActiveColors(b, next));
                }}
              />
            </span>
          </Row>
        );
      })}
      </>
      ) : targetSettings.reason === "locked" ? <Locked name={targetSettings.name} plan={targetSettings.planName} onOpen={() => void navigate({ to: "/subscriptions" })} /> : null}

      <Group title="Advanced" />
      <Row title="Collection path" hint={user?.primaryEmail ? `Synced to ${formatAccountLabel(user.primaryEmail)}` : "On this device until you sign in"}>
        <span className="text-xs text-muted-foreground">setpaper-v3</span>
      </Row>
    </StudyShell>
  );
}
