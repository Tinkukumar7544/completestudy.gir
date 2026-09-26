import { useEffect, useRef } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { playFocusSfx, speakFocusClose } from "@/lib/exam/focus-sfx";
import {
  AWAY_APP_ID,
  holdWakeLock,
  releaseWakeLock,
  showFocusNotice,
} from "@/lib/exam/focus-device";
import {
  blockLabel,
  formatDurationMin,
  remainingMs,
  setpaperAppForPath,
  startAway,
  tickFocus,
  whyBlocked,
} from "@/lib/exam/focus";
import { mergeFocus } from "@/lib/exam/focus";
import { useExamStore } from "@/lib/exam/store";
import { defaultFocus, normalizeFocus } from "@/lib/exam/types";

export function FocusGuard() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname });
  const raw = useExamStore((s) => s.focus);
  const updateFocus = useExamStore((s) => s.updateFocus);
  const focus = mergeFocus(normalizeFocus(raw ?? defaultFocus()));
  const lastEvent = useRef<string>("");

  useEffect(() => {
    const applyTick = () => {
      const current = useExamStore.getState().focus;
      const { state, event } = tickFocus(mergeFocus(current ?? defaultFocus()), Date.now());
      if (event !== "none" || state.session?.lastTick !== current?.session?.lastTick || state.lastDayKey !== current?.lastDayKey) {
        updateFocus(() => state);
      }
      if (event === "warn" && lastEvent.current !== `warn-${state.session?.appId}`) {
        lastEvent.current = `warn-${state.session?.appId}`;
        const app = state.apps.find((a) => a.id === state.session?.appId);
        const title = `${app?.name ?? "App"} closes in 5 minutes`;
        toast.message(title);
        playFocusSfx("warn");
        if (state.settings.notifyBeforeClose) void showFocusNotice("Focus", title);
      }
      if (event === "close" && lastEvent.current !== `close-${state.session?.appId}-${state.session?.waitUntil}`) {
        lastEvent.current = `close-${state.session?.appId}-${state.session?.waitUntil}`;
        const app = state.apps.find((a) => a.id === state.session?.appId);
        const wait = app ? Math.max(1, app.limits.waitMin) : 10;
        const title = `${app?.name ?? "App"} is paused for ${formatDurationMin(wait)}`;
        toast.message(title);
        playFocusSfx("close");
        void showFocusNotice("Focus", title);
        if (state.settings.audioMessage && app) speakFocusClose(app.name, wait);
      }
      return state;
    };

    const id = window.setInterval(() => {
      const state = applyTick();
      if (state.settings.shieldOn || (state.session && !state.session.waiting)) void holdWakeLock();
    }, 1000);

    const onVisibility = () => {
      const next = applyTick();
      if (document.visibilityState === "hidden") {
        if (next.settings.shieldOn) {
          const away = startAway(next, Date.now());
          if (away !== next) updateFocus(() => away);
        }
      } else {
        void holdWakeLock();
        if (next.session?.appId === AWAY_APP_ID && !next.session.waiting) {
          updateFocus((f) => ({ ...f, session: null }));
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    void holdWakeLock();

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      releaseWakeLock();
    };
  }, [updateFocus]);

  const session = focus.session;
  const sessionApp = session ? focus.apps.find((a) => a.id === session.appId) : undefined;
  const left = remainingMs(session);
  const skip =
    pathname.startsWith("/focus") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth");

  const routed = skip ? undefined : setpaperAppForPath(pathname, focus.apps);
  const routeReason = routed ? whyBlocked(routed, focus) : "ok";
  const waiting = Boolean(session?.waiting);
  const armed = focus.settings.modeOn;
  const globalLock = armed && !skip && focus.settings.shieldOn && focus.settings.blockAllOn;
  const showLock = armed && (waiting || globalLock || (!skip && routed && routeReason !== "ok"));

  return (
    <>
      {armed && session && !session.waiting && focus.settings.displayRemaining ? (
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 bg-focus px-3 py-2 text-sm font-semibold text-focus-foreground">
          <span className="truncate">{sessionApp?.name ?? "Session"}</span>
          <span className="tabular-nums">{formatDurationMin(Math.max(1, Math.ceil(left / 60000)))} left</span>
        </div>
      ) : null}
      {showLock ? (
        <div className="focus-lock">
          <div className="focus-lock-card grid gap-3">
            <p className="font-display text-lg font-semibold tracking-tight">Locked on this device</p>
            <p className="text-sm text-muted-foreground">
              {waiting
                ? `${sessionApp?.name ?? "This app"} hit its off timer. Wait ${formatDurationMin(Math.max(1, Math.ceil(((session?.waitUntil ?? 0) - Date.now()) / 60000)))} before opening it again.`
                : globalLock
                  ? "Focus shield is locking every listed app in real time. Disarm it from Device access."
                  : routed
                    ? blockLabel(routeReason, routed, focus)
                    : "Focus limits are on."}
            </p>
            <Button
              className="bg-focus text-focus-foreground hover:bg-focus/90"
              onClick={() => void navigate({ to: "/focus", search: { view: "apps", id: "", range: "30d" } })}
            >
              Turn Focus off
            </Button>
            <Button
              variant="outline"
              onClick={() => void navigate({ to: "/focus", search: { view: "access", id: "", range: "30d" } })}
            >
              Open Device access
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
