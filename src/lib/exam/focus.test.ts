import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addCustomApp,
  armDeviceLock,
  blockLabel,
  disarmDeviceLock,
  effectiveLimits,
  focusCatalog,
  formatDurationMin,
  formatUsage,
  hashPin,
  inPeriod,
  lockedCount,
  mergeFocus,
  pinOk,
  setFocusMode,
  sortApps,
  startSession,
  whyBlocked,
  withPeriodOn,
} from "./focus.ts";
import { defaultFocus, defaultFocusLimits, type FocusApp } from "./types.ts";

function app(partial: Partial<FocusApp> & Pick<FocusApp, "id" | "name">): FocusApp {
  return {
    mark: "A",
    hue: 20,
    kind: "catalog",
    custom: false,
    route: null,
    pinned: false,
    createdAt: 1,
    limits: defaultFocusLimits(),
    ...partial,
  };
}

describe("focus mode", () => {
  it("catalog lists study apps and a full phone set", () => {
    const cats = focusCatalog();
    assert.ok(cats.some((a) => a.id === "sp-tests"));
    assert.ok(cats.some((a) => a.id === "sp-device"));
    assert.ok(cats.some((a) => a.id === "chrome"));
    assert.ok(cats.some((a) => a.id === "whatsapp"));
    assert.ok(cats.length > 80);
  });

  it("merge keeps custom limits and injects catalog", () => {
    const prev = defaultFocus();
    prev.apps = [
      app({
        id: "chrome",
        name: "Chrome",
        limits: { ...defaultFocusLimits(), timerOn: true, offTimerMin: 15 },
      }),
    ];
    const merged = mergeFocus(prev, 1);
    const chrome = merged.apps.find((a) => a.id === "chrome");
    assert.equal(chrome?.limits.timerOn, true);
    assert.equal(chrome?.limits.offTimerMin, 15);
    assert.ok(merged.apps.some((a) => a.id === "sp-notes"));
    assert.equal(merged.usageSeeded, true);
  });

  it("overnight period wraps past midnight", () => {
    assert.equal(inPeriod(23 * 60 + 10, "22:00", "01:00"), true);
    assert.equal(inPeriod(30, "22:00", "01:00"), true);
    assert.equal(inPeriod(12 * 60, "22:00", "01:00"), false);
  });

  it("blocks on cap, wait, and period", () => {
    const a = app({
      id: "chrome",
      name: "Chrome",
      limits: { ...defaultFocusLimits(), usageOn: true, usageLimitMin: 10, days: [0, 1, 2, 3, 4, 5, 6] },
    });
    const state = { ...defaultFocus(), apps: [a], todayUsed: { chrome: 10 } };
    assert.equal(whyBlocked(a, state, Date.parse("2026-08-31T12:00:00")), "cap");
    const waiting = { ...state, todayUsed: {}, waitUntil: { chrome: Date.parse("2026-08-31T13:00:00") } };
    assert.equal(whyBlocked(a, waiting, Date.parse("2026-08-31T12:00:00")), "wait");
    const periodApp = app({
      id: "yt",
      name: "YouTube",
      limits: withPeriodOn({
        ...defaultFocusLimits(),
        periodOn: true,
        days: [0, 1, 2, 3, 4, 5, 6],
        periods: [{ id: "p", start: "12:00", end: "00:00" }],
      }),
    });
    assert.equal(whyBlocked(periodApp, { ...defaultFocus(), apps: [periodApp] }, Date.parse("2026-08-31T15:00:00")), "period");
  });

  it("sorts names and keeps created order", () => {
    const apps = [app({ id: "b", name: "Beta", createdAt: 2 }), app({ id: "a", name: "Alpha", createdAt: 1 })];
    assert.equal(sortApps(apps, "asc")[0]?.name, "Alpha");
    assert.equal(sortApps(apps, "desc")[0]?.name, "Beta");
    assert.equal(sortApps(apps, "created")[0]?.id, "a");
  });

  it("starts a session when open, denies when capped", () => {
    const a = app({
      id: "chrome",
      name: "Chrome",
      limits: { ...defaultFocusLimits(), timerOn: true, days: [0, 1, 2, 3, 4, 5, 6] },
    });
    const open = startSession({ ...defaultFocus(), apps: [a] }, "chrome", Date.parse("2026-08-31T10:00:00"));
    assert.equal(open.reason, "ok");
    assert.equal(open.state.session?.appId, "chrome");
  });

  it("hashes a PIN and rejects a wrong one", () => {
    const h = hashPin("1234");
    assert.equal(pinOk(h, "1234"), true);
    assert.equal(pinOk(h, "0000"), false);
  });

  it("adds a custom app without dropping the catalog", () => {
    const next = addCustomApp(mergeFocus(defaultFocus(), 1), "Mine Act");
    assert.ok(next.apps.some((a) => a.name === "Mine Act" && a.custom));
    assert.ok(next.apps.some((a) => a.id === "chrome"));
  });

  it("formats durations the way the list reads them", () => {
    assert.equal(formatDurationMin(10), "10 minutes");
    assert.equal(formatDurationMin(60), "1 hour");
    assert.match(formatUsage(7038), /hour/);
  });

  it("group limits tighten the app", () => {
    const a = app({ id: "chrome", name: "Chrome" });
    const state = mergeFocus({
      ...defaultFocus(),
      apps: [a],
      groups: [
        {
          id: "g1",
          name: "Target MCL 21 days",
          appIds: ["chrome"],
          createdAt: 1,
          limits: { ...defaultFocusLimits(), usageOn: true, usageLimitMin: 30, days: [1, 2, 3, 4, 5] },
        },
      ],
    });
    const chrome = state.apps.find((x) => x.id === "chrome")!;
    const lim = effectiveLimits(chrome, state);
    assert.equal(lim.usageOn, true);
    assert.equal(lim.usageLimitMin, 30);
  });

  it("settings have no terms or policy fields", () => {
    const keys = Object.keys(defaultFocus().settings);
    assert.equal(keys.some((k) => k.toLowerCase().includes("term")), false);
    assert.equal(keys.some((k) => k.toLowerCase().includes("privacy")), false);
  });

  it("disabled and shield lock in real time", () => {
    const tests = app({
      id: "sp-tests",
      name: "SetPaper Tests",
      kind: "setpaper",
      route: "/",
      limits: { ...defaultFocusLimits(), disabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
    });
    const ts = Date.parse("2026-08-31T12:00:00");
    assert.equal(whyBlocked(tests, { ...defaultFocus(), apps: [tests] }, ts), "disabled");
    const open = startSession({ ...defaultFocus(), apps: [tests] }, "sp-tests", ts);
    assert.equal(open.reason, "disabled");

    const timed = app({
      id: "sp-notes",
      name: "SetPaper Notes",
      kind: "setpaper",
      route: "/notes",
      limits: { ...defaultFocusLimits(), timerOn: true, days: [0, 1, 2, 3, 4, 5, 6] },
    });
    const shielded = { ...defaultFocus(), apps: [timed], settings: { ...defaultFocus().settings, shieldOn: true } };
    assert.equal(whyBlocked(timed, shielded, ts), "shield");
    const started = startSession(shielded, "sp-notes", ts);
    assert.equal(started.reason, "ok");
    assert.equal(started.state.session?.appId, "sp-notes");
  });

  it("arming the shield locks every listed app until disarmed", () => {
    const state = mergeFocus(defaultFocus(), 1);
    const armed = armDeviceLock(state, 1);
    assert.equal(armed.settings.shieldOn, true);
    assert.equal(armed.settings.blockAllOn, true);
    const tests = armed.apps.find((a) => a.id === "sp-tests")!;
    assert.equal(whyBlocked(tests, armed, 1), "shield");
    assert.ok(lockedCount(armed, 1) > 50);
    const denied = startSession(armed, "sp-tests", 1);
    assert.equal(denied.reason, "shield");
    const off = disarmDeviceLock(armed);
    assert.equal(off.settings.shieldOn, false);
    assert.equal(whyBlocked(tests, off, 1), "ok");
    assert.match(blockLabel("shield", tests, armed), /shield/i);
  });

  it("master switch pauses every lock without wiping limits", () => {
    const tests = app({
      id: "sp-tests",
      name: "SetPaper Tests",
      kind: "setpaper",
      route: "/",
      limits: { ...defaultFocusLimits(), disabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
    });
    const ts = Date.parse("2026-08-31T12:00:00");
    const on = { ...defaultFocus(), apps: [tests] };
    assert.equal(on.settings.modeOn, true);
    assert.equal(whyBlocked(tests, on, ts), "disabled");
    const paused = setFocusMode(on, false, ts);
    assert.equal(paused.settings.modeOn, false);
    assert.equal(whyBlocked(tests, paused, ts), "ok");
    assert.equal(lockedCount(paused, ts), 0);
    assert.equal(startSession(paused, "sp-tests", ts).reason, "off");
    assert.match(blockLabel("off", tests, paused), /Focus is off/);
    const resumed = setFocusMode(paused, true, ts);
    assert.equal(resumed.settings.modeOn, true);
    assert.equal(whyBlocked(tests, resumed, ts), "disabled");
    assert.equal(resumed.apps[0]?.limits.disabled, true);
    const rearmed = armDeviceLock(paused, ts);
    assert.equal(rearmed.settings.modeOn, true);
    assert.equal(whyBlocked(tests, rearmed, ts), "shield");
  });
});
