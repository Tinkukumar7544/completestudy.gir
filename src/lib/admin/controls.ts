export const SECTION_IDS = [
  "tests",
  "notes",
  "focus",
  "connect",
  "coaching",
  "target",
  "templates",
  "settings",
  "browser",
  "subscriptions",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface AdminFunction {
  id: string;
  section: SectionId;
  name: string;
  hint: string;
  enabled: boolean;
  planId: string;
  builtin: boolean;
}

export interface AdminPlan {
  id: string;
  name: string;
  price: string;
  blurb: string;
  enabled: boolean;
}

export interface AdminControls {
  sections: Record<SectionId, boolean>;
  functions: AdminFunction[];
  plans: AdminPlan[];
  removedIds: string[];
}

export function defaultPlans(): AdminPlan[] {
  return [
    {
      id: "plus",
      name: "Plus",
      price: "₹199",
      blurb: "Unlock every function an admin assigns to Plus.",
      enabled: true,
    },
  ];
}

function fn(section: SectionId, id: string, name: string, hint: string): AdminFunction {
  return { id, section, name, hint, enabled: true, planId: "", builtin: true };
}

export function defaultFunctions(): AdminFunction[] {
  return [
    fn("tests", "tests.decks", "Test list", "Open decks and the 21-day header"),
    fn("tests", "tests.import", "Import HTML test", "Upload a paper from the menu"),
    fn("tests", "tests.create", "Create or import test", "Add questions or paste a set"),
    fn("tests", "tests.review", "Review folders", "3-day, 7-day, 14-day, and 21-day folders"),
    fn("tests", "tests.paste", "Paste", "Paste a copied test or folder"),
    fn("tests", "tests.folders", "Folders", "Add folders in Tests"),
    fn("tests", "tests.mail", "Mail", "Open mail from Tests"),
    fn("tests", "tests.phone", "Phone folders", "Link a phone folder"),
    fn("tests", "tests.desk", "Desk", "Open the desk"),
    fn("tests", "tests.custom", "Custom paper", "Start, random, and study options"),
    fn("tests", "tests.full", "Full test", "Take the full paper"),
    fn("tests", "tests.quiz", "Friend quiz", "Live test from a deck"),
    fn("notes", "notes.write", "Write a note", "Create a text note"),
    fn("notes", "notes.folder", "Folders", "New folder and subfolder"),
    fn("notes", "notes.files", "Files", "Photos, PDF, and video"),
    fn("notes", "notes.phone", "Phone link", "Show a phone folder"),
    fn("notes", "notes.email", "Email link", "Show an email folder"),
    fn("notes", "notes.study", "Study notes", "Study view"),
    fn("notes", "notes.progress", "File progress", "PDF and video completion"),
    fn("focus", "focus.mode", "Focus mode", "Master on/off switch"),
    fn("focus", "focus.shield", "Shield", "Arm the focus shield"),
    fn("focus", "focus.block", "Block listed apps", "Lock every listed app"),
    fn("focus", "focus.timers", "Timers", "Off timer, wait, and usage limits"),
    fn("focus", "focus.pin", "PIN", "Protect Focus with a PIN"),
    fn("connect", "connect.live", "Live test", "Create a live test"),
    fn("connect", "connect.join", "Join with a code", "Join a live test"),
    fn("connect", "connect.chat", "1-1 chat", "Start or join a chat"),
    fn("connect", "connect.share", "Share notes", "Send a note through Connect"),
    fn("connect", "connect.call", "Calls", "Video and audio before and after a live test"),
    fn("coaching", "coaching.live", "Live classes", "Host or join a class"),
    fn("coaching", "coaching.host", "Host a class", "Start a live class from this device"),
    fn("coaching", "coaching.raise", "Hand raise", "Ask to speak in a class or discussion"),
    fn("coaching", "coaching.recorded", "Recorded classes", "Play recordings"),
    fn("coaching", "coaching.meetings", "Live meetings", "Meetings list"),
    fn("coaching", "coaching.courses", "Courses", "Course lessons"),
    fn("coaching", "coaching.discussions", "Group discussions", "Discussion topics"),
    fn("coaching", "coaching.customize", "Customization", "Batch and schedule"),
    fn("coaching", "coaching.teacher", "Teacher contact", "Teacher details"),
    fn("target", "target.path", "Daily path", "The exam path"),
    fn("target", "target.river", "River board", "River game"),
    fn("target", "target.board", "Board race", "Board-race game"),
    fn("target", "target.rename", "Rename", "Rename the target section"),
    fn("templates", "templates.list", "Template list", "Exam templates"),
    fn("templates", "templates.edit", "Edit template", "Names and saved results"),
    fn("templates", "templates.pattern", "Paper pattern", "Sections, timer, and options"),
    fn("templates", "templates.upload", "Upload template", "Save an HTML template"),
    fn("settings", "settings.account", "Account", "Sign in and sync"),
    fn("settings", "settings.general", "General", "Language and new-question deck"),
    fn("settings", "settings.reviewing", "Reviewing", "Day start, timebox, and buttons"),
    fn("settings", "settings.appearance", "Appearance", "Night mode"),
    fn("settings", "settings.focus", "Focus settings", "Focus preferences in Settings"),
    fn("settings", "settings.target", "Target settings", "Path and board settings"),
    fn("browser", "browser.search", "Search questions", "Find a question in the test"),
    fn("browser", "browser.edit", "Edit questions", "Change the question, options, and answer"),
    fn("browser", "browser.delete", "Delete questions", "Remove a question"),
    fn("subscriptions", "subscriptions.view", "View plans", "See subscription plans"),
    fn("subscriptions", "subscriptions.buy", "Buy a plan", "Unlock a plan on this device"),
  ];
}

export function defaultControls(): AdminControls {
  const sections = {} as Record<SectionId, boolean>;
  for (const id of SECTION_IDS) sections[id] = true;
  return { sections, functions: defaultFunctions(), plans: defaultPlans(), removedIds: [] };
}

function asSection(value: unknown): SectionId {
  return SECTION_IDS.includes(value as SectionId) ? (value as SectionId) : "tests";
}

export function readControls(raw: unknown): AdminControls {
  const base = defaultControls();
  if (!raw || typeof raw !== "object") return base;
  const row = raw as Partial<AdminControls>;
  const removed = Array.isArray(row.removedIds) ? row.removedIds.filter((id) => typeof id === "string") : [];
  const saved = new Map<string, AdminFunction>();
  if (Array.isArray(row.functions)) {
    for (const item of row.functions) {
      if (!item || typeof item !== "object") continue;
      const fnRow = item as Partial<AdminFunction>;
      const id = typeof fnRow.id === "string" ? fnRow.id.trim() : "";
      if (!id) continue;
      saved.set(id, {
        id,
        section: asSection(fnRow.section),
        name: typeof fnRow.name === "string" && fnRow.name.trim() ? fnRow.name : id,
        hint: typeof fnRow.hint === "string" ? fnRow.hint : "",
        enabled: fnRow.enabled !== false,
        planId: typeof fnRow.planId === "string" ? fnRow.planId : "",
        builtin: fnRow.builtin !== false && base.functions.some((fn) => fn.id === id),
      });
    }
  }
  const functions: AdminFunction[] = [];
  for (const item of base.functions) {
    if (removed.includes(item.id)) continue;
    functions.push(saved.get(item.id) ?? item);
    saved.delete(item.id);
  }
  for (const item of saved.values()) {
    if (removed.includes(item.id)) continue;
    functions.push({ ...item, builtin: false });
  }
  const sections = { ...base.sections };
  if (row.sections && typeof row.sections === "object") {
    for (const id of SECTION_IDS) {
      const value = (row.sections as Record<string, unknown>)[id];
      if (typeof value === "boolean") sections[id] = value;
    }
  }
  const plans = Array.isArray(row.plans)
    ? row.plans
        .filter((item) => item && typeof item === "object" && typeof (item as AdminPlan).id === "string")
        .map((item) => {
          const plan = item as Partial<AdminPlan>;
          return {
            id: String(plan.id),
            name: typeof plan.name === "string" && plan.name.trim() ? plan.name : "Plan",
            price: typeof plan.price === "string" ? plan.price : "",
            blurb: typeof plan.blurb === "string" ? plan.blurb : "",
            enabled: plan.enabled !== false,
          };
        })
    : base.plans;
  return { sections, functions, plans: plans.length ? plans : base.plans, removedIds: removed };
}

export function hashAdminPassword(email: string, password: string) {
  const input = `${email.trim().toLowerCase()}::${password}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193);
    h2 = Math.imul(h2 ^ code, 0x85ebca6b);
  }
  return `${(h1 >>> 0).toString(16)}.${(h2 >>> 0).toString(16)}`;
}

export function functionAccess(admin: { controls: AdminControls; purchases: string[] }, id: string) {
  const item = admin.controls.functions.find((fn) => fn.id === id);
  const plan = admin.controls.plans.find((row) => row.id === item?.planId);
  if (!item || !item.enabled) return { allowed: false, reason: "off" as const, name: item?.name ?? "This function", planName: "", price: "" };
  if (item.planId && plan?.enabled && !admin.purchases.includes(item.planId)) {
    return { allowed: false, reason: "locked" as const, name: item.name, planName: plan.name, price: plan.price };
  }
  return { allowed: true, reason: "ok" as const, name: item.name, planName: "", price: "" };
}

export function sectionForPath(pathname: string): SectionId | null {
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;
  if (pathname.startsWith("/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/notes")) return "notes";
  if (pathname.startsWith("/focus")) return "focus";
  if (pathname.startsWith("/coaching") || pathname.startsWith("/discuss") || pathname.startsWith("/class")) return "coaching";
  if (pathname.startsWith("/target")) return "target";
  if (pathname.startsWith("/connect") || pathname.startsWith("/friends") || pathname.startsWith("/quiz") || pathname.startsWith("/chat")) return "connect";
  if (pathname.startsWith("/templates")) return "templates";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/browser")) return "browser";
  if (
    pathname === "/" ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/add") ||
    pathname.startsWith("/options") ||
    pathname.startsWith("/custom-study") ||
    pathname.startsWith("/session") ||
    pathname.startsWith("/study") ||
    pathname.startsWith("/mail") ||
    pathname.startsWith("/desk")
  ) {
    return "tests";
  }
  return null;
}

export function functionForPath(pathname: string): string | null {
  if (pathname.startsWith("/templates/")) return "templates.edit";
  if (pathname.startsWith("/templates")) return "templates.list";
  if (pathname.startsWith("/browser")) return "browser.search";
  if (pathname.startsWith("/friends")) return "connect.live";
  if (pathname.startsWith("/mail")) return "tests.mail";
  if (pathname.startsWith("/desk")) return "tests.desk";
  if (pathname.startsWith("/subscriptions")) return "subscriptions.view";
  return null;
}
