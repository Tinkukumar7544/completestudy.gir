import { Link, useRouterState } from "@tanstack/react-router";
import { BadgeCheck, ClipboardList, GraduationCap, Radio, StickyNote, Target } from "lucide-react";
import { sectionLabel } from "@/lib/admin/copy";
import { useAdminCopy, useAdminState, usePlusUnlocked } from "@/lib/admin/use-copy";
import { AdminLogo } from "@/components/admin-logo";
import { useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

function sectionOf(pathname: string): "tests" | "notes" | "focus" | "connect" | "coaching" | "target" | "subscriptions" | "none" {
  if (pathname.startsWith("/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/notes")) return "notes";
  if (pathname.startsWith("/focus")) return "focus";
  if (pathname.startsWith("/coaching") || pathname.startsWith("/discuss") || pathname.startsWith("/class")) return "coaching";
  if (pathname.startsWith("/target")) return "target";
  if (
    pathname.startsWith("/connect") ||
    pathname.startsWith("/friends") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/chat")
  ) {
    return "connect";
  }
  if (
    pathname === "/" ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/add") ||
    pathname.startsWith("/options") ||
    pathname.startsWith("/custom-study") ||
    pathname.startsWith("/session") ||
    pathname.startsWith("/mail") ||
    pathname.startsWith("/desk")
  ) {
    return "tests";
  }
  return "none";
}

export function FocusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.2v3.1M12 13.7v3.1M9.4 10.2h5.2M10.1 13.8h3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SectionNav() {
  const pathname = useRouterState({
    select: (s: { location: { pathname: string } }) => s.location.pathname,
  });
  const current = sectionOf(pathname);
  const copy = useAdminCopy();
  const admin = useAdminState();
  const targetPref = useExamStore((s) => s.prefs.targetExamName);
  const targetName = sectionLabel(copy.target.name, targetPref, "Target Exam");
  const open = admin.controls.sections;

  const tabs = [
    { to: "/", label: copy.tests.name, icon: ClipboardList, match: "tests" as const, gold: false, on: open.tests },
    { to: "/notes", label: copy.notes.name, icon: StickyNote, match: "notes" as const, gold: false, on: open.notes },
    { to: "/focus", label: copy.focus.name, icon: FocusMark, match: "focus" as const, gold: false, on: open.focus },
    { to: "/connect", label: copy.connect.name, icon: Radio, match: "connect" as const, gold: true, on: open.connect },
    { to: "/coaching", label: copy.coaching.name, icon: GraduationCap, match: "coaching" as const, gold: false, on: open.coaching },
    { to: "/target", label: targetName, icon: Target, match: "target" as const, gold: false, on: open.target },
    { to: "/subscriptions", label: "Subscriptions", icon: BadgeCheck, match: "subscriptions" as const, gold: false, on: open.subscriptions },
  ].filter((tab) => tab.on);

  const plus = usePlusUnlocked();

  return (
    <nav
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 rounded-2xl border bg-bar text-bar-foreground shadow-dock",
        plus
          ? "border-amber-300 shadow-[0_0_0_1px_rgba(212,175,55,0.95),0_0_18px_rgba(212,175,55,0.55)]"
          : "border-bar-foreground/10",
      )}
      aria-label="Sections"
    >
      <div className="mx-auto grid h-16 max-w-xl" style={{ gridTemplateColumns: `repeat(${Math.max(tabs.length, 1)}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => {
          const active = current === tab.match;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              search={
                tab.to === "/notes"
                  ? { view: "list", folder: "" }
                  : tab.to === "/coaching"
                    ? { view: "hub" }
                    : tab.to === "/target"
                      ? { game: "home" }
                      : tab.to === "/focus"
                  ? { view: "apps", id: "", range: "30d" }
                  : undefined
              }
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-center text-xs leading-tight",
                active ? "font-medium text-bar-foreground" : "text-bar-foreground/60",
                tab.gold && "font-semibold text-focus",
                !active && "shadow-[inset_0_0_0_1px_rgba(210,214,220,0.95),0_0_8px_rgba(200,204,210,0.55)]",
                active && "shadow-[inset_0_0_0_1px_rgba(232,196,92,1),0_0_12px_rgba(212,175,55,0.75)]",
              )}
            >
              <AdminLogo
                src={copy.logos[tab.match]}
                label={tab.label}
                className="size-8 rounded-full bg-transparent"
                onChange={(logo) =>
                  useExamStore.getState().setAdminCopy((current) => ({
                    ...current,
                    logos: { ...current.logos, [tab.match]: logo },
                  }))
                }
                fallback={<tab.icon className="size-5 shrink-0" />}
              />
              <span className="line-clamp-2 w-full">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
