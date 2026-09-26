import { defaultControls, readControls, type AdminControls } from "@/lib/admin/controls";

export const COACHING_VIEWS = ["live", "recorded", "meetings", "courses", "discussions", "customize", "teacher", "page"] as const;
export type CoachingSectionView = (typeof COACHING_VIEWS)[number];

export interface AdminCoachingSection {
  id: string;
  view: CoachingSectionView;
  name: string;
  blurb: string;
  logoText: string;
  enabled: boolean;
}

export interface AdminCopy {
  appName: string;
  tests: {
    name: string;
    intro: string;
    empty: string;
    day3Name: string;
    day7Name: string;
    day14Name: string;
    day21Name: string;
    day21Hint: string;
    importNotice: string;
    addCreate: string;
    addEmail: string;
    addPhone: string;
    addDesk: string;
    addPaste: string;
    addFiles: string;
    practice: string;
    practiced: string;
    pending: string;
    labelDay: string;
    labelRemain: string;
    labelIncorrect: string;
    labelTransfer: string;
    labelPending: string;
    labelCorrect: string;
    headerColor: string;
    ringDay: string;
    ringRemain: string;
    ringIncorrect: string;
    ringTransfer: string;
    ringPending: string;
    ringCorrect: string;
  };
  notes: {
    name: string;
    intro: string;
    logoText: string;
    accent: string;
    newNote: string;
    newFolder: string;
    empty: string;
  };
  focus: {
    name: string;
    intro: string;
    logoText: string;
    shieldLabel: string;
    modeLabel: string;
    blockLabel: string;
  };
  connect: {
    name: string;
    intro: string;
    liveTitle: string;
    liveBody: string;
    liveButton: string;
    joinLabel: string;
    joinButton: string;
    chatTitle: string;
    chatBody: string;
    chatButton: string;
    notesTitle: string;
    notesBody: string;
    notesButton: string;
    shareDialogTitle: string;
    shareDialogBody: string;
  };
  coaching: {
    name: string;
    intro: string;
    logoText: string;
    sections: AdminCoachingSection[];
  };
  target: {
    name: string;
    intro: string;
    riverTitle: string;
    riverHint: string;
    ludoTitle: string;
    ludoHint: string;
  };
  logos: {
    tests: string;
    notes: string;
    focus: string;
    connect: string;
    coaching: string;
    target: string;
    subscriptions: string;
  };
  legal: {
    privacyTitle: string;
    privacyBody: string;
    termsTitle: string;
    termsBody: string;
    deletionTitle: string;
    deletionBody: string;
    supportEmail: string;
  };
}

export interface AdminPayout {
  upi: string;
  phonePe: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
}

export interface AdminState {
  ownerEmail: string;
  passwordHash: string;
  copy: AdminCopy;
  controls: AdminControls;
  purchases: string[];
  payout: AdminPayout;
}

function section(
  id: string,
  view: CoachingSectionView,
  name: string,
  blurb: string,
  logoText: string,
): AdminCoachingSection {
  return { id, view, name, blurb, logoText, enabled: true };
}

export function defaultAdminCopy(): AdminCopy {
  return {
    appName: "SetPaper",
    tests: {
      name: "Tests",
      intro: "Tap a test for a custom paper, full paper, or Friend Quiz.",
      empty: "No decks. Tap + to create one.",
      day3Name: "3-day",
      day7Name: "7-day",
      day14Name: "14-day",
      day21Name: "21-day",
      day21Hint: "Clears only after a correct answer",
      importNotice: "Convert any book MCQs into text using AI and paste them here, or generate questions using AI and paste them here to conduct an online test.",
      addCreate: "Create or import test",
      addEmail: "From email",
      addPhone: "Phone folder",
      addDesk: "Desk folder",
      addPaste: "Paste",
      addFiles: "Add files",
      practice: "Practice",
      practiced: "All questions practiced",
      pending: "Questions still pending",
      labelDay: "Day",
      labelRemain: "Remain",
      labelIncorrect: "Incorrect",
      labelTransfer: "Transfer",
      labelPending: "Pending",
      labelCorrect: "Correct",
      headerColor: "#ffe14a",
      ringDay: "#111111",
      ringRemain: "#2b6fe8",
      ringIncorrect: "#e23b3b",
      ringTransfer: "#f2d012",
      ringPending: "#e23b3b",
      ringCorrect: "#2f9d5c",
    },
    notes: {
      name: "Notes",
      intro: "Write a note, or add photos, PDFs, and video. Folders stay on this device.",
      logoText: "N",
      accent: "#1d4ed8",
      newNote: "New note",
      newFolder: "New folder",
      empty: "No notes in this folder yet.",
    },
    focus: {
      name: "Focus",
      intro: "Turn Focus on to lock study time. Shield and app timers stay inside this app.",
      logoText: "F",
      shieldLabel: "Focus shield",
      modeLabel: "Focus mode",
      blockLabel: "Block listed apps",
    },
    connect: {
      name: "Connect",
      intro: "Take live tests with friends, chat 1-1, share notes, and share a room code.",
      liveTitle: "Live tests together",
      liveBody: "Host a paper from Tests. Friends join with a code. Everyone taps Start. The paper runs until time is up, then auto-submits.",
      liveButton: "Create a live test",
      joinLabel: "Join with a code",
      joinButton: "Join live test",
      chatTitle: "1-1 chat",
      chatBody: "Private room for two people. Share the code with one friend.",
      chatButton: "Start a chat",
      notesTitle: "Share notes",
      notesBody: "Send a note through Connect. Your friend joins with the chat code and reads the text in the room.",
      notesButton: "Share a note",
      shareDialogTitle: "Share a note",
      shareDialogBody: "Opens a 1-1 chat with the note as the first message.",
    },
    coaching: {
      name: "Coaching",
      intro: "Classes, recordings, meetings, and teacher contact — kept with your account.",
      logoText: "C",
      sections: [
        section("live", "live", "Live classes", "Host or join a class with a code.", "L"),
        section("recorded", "recorded", "Recorded classes", "Play saved class recordings.", "R"),
        section("meetings", "meetings", "Live meetings", "One-to-one or small meetings.", "M"),
        section("courses", "courses", "Courses", "Lessons grouped into a course.", "K"),
        section("discussions", "discussions", "Group discussions", "Topics with video, audio, chat, and hand raise.", "D"),
        section("customize", "customize", "Customization", "Batch, schedule, and language.", "S"),
        section("teacher", "teacher", "Teacher contact", "Name, phone, and hours.", "T"),
      ],
    },
    target: {
      name: "Target Exam",
      intro: "Optional boards alongside the daily path.",
      riverTitle: "River Game Target Achieve",
      riverHint: "Subjects, tests, and floods along a river to the sea.",
      ludoTitle: "Ludo Game Target Achieve",
      ludoHint: "Play like a board race — label every square with exam notes.",
    },
    logos: { tests: "", notes: "", focus: "", connect: "", coaching: "", target: "", subscriptions: "" },
    legal: {
      privacyTitle: "Privacy Policy",
      privacyBody: [
        "SetPaper stores the account details you give us: email address or mobile number, password (stored only as a hash), display name, profile photo, and the extra profile text you choose to add.",
        "Study data on this device includes tests, notes, files you attach, focus timers, and subscription unlocks. That data stays on the device unless you sign in and sync.",
        "We do not sell personal information. We do not use it for advertising. OTP codes exist only long enough to verify the email or phone number and are then discarded.",
        "You can review and edit your profile inside the app. You can permanently delete the account and its personal data from the three-dot menu, or open Delete account at any time. Deletion removes the profile, photo, and sign-in. You can also erase tests, notes, and scores on this device in the same step.",
        "To ask a question about this policy, use the support email shown in the app.",
      ].join("\n\n"),
      termsTitle: "Terms and Conditions",
      termsBody: [
        "SetPaper is a study app. You must use an email address or a mobile number that you can verify with a one-time code, and you must choose a password.",
        "You are responsible for keeping that password private. Do not share OTP codes.",
        "Subscriptions, when offered, unlock only the functions an administrator assigns to a plan. Unlocking a plan on this device does not transfer it to another device unless you use the same account and the app syncs that purchase.",
        "You may stop using the app at any time. You may delete your account from the Delete account page. Deletion is permanent and cannot be undone.",
        "The administrator may suspend or delete an account that breaks these terms. Study content you add must be yours to use.",
        "These terms and the privacy policy can be updated inside the app. The text you see on the Privacy Policy and Terms pages is the current version.",
      ].join("\n\n"),
      deletionTitle: "Delete your account",
      deletionBody: [
        "You can delete your SetPaper account inside the app. Open the three-dot menu and choose Delete account, or open this page directly.",
        "Deletion is permanent. It removes your profile, photo, email or phone sign-in, and password. It does not require you to email support first.",
        "You can also erase tests, notes, and scores stored on this device in the same step. Synced copies tied to this account are removed from this device when you confirm.",
        "If you cannot open the app, use the support email and ask for account deletion. Include the email or phone number on the account. We will delete the account and its personal data.",
      ].join("\n\n"),
      supportEmail: "support@setpaper.app",
    },
  };
}

export function defaultAdminState(): AdminState {
  return {
    ownerEmail: "",
    passwordHash: "",
    copy: defaultAdminCopy(),
    controls: defaultControls(),
    purchases: [],
    payout: { upi: "", phonePe: "", accountName: "", accountNumber: "", ifsc: "" },
  };
}

function readPayout(raw: unknown): AdminPayout {
  const base = defaultAdminState().payout;
  if (!raw || typeof raw !== "object") return base;
  const row = raw as Partial<AdminPayout>;
  return {
    upi: typeof row.upi === "string" ? row.upi : "",
    phonePe: typeof row.phonePe === "string" ? row.phonePe : "",
    accountName: typeof row.accountName === "string" ? row.accountName : "",
    accountNumber: typeof row.accountNumber === "string" ? row.accountNumber : "",
    ifsc: typeof row.ifsc === "string" ? row.ifsc : "",
  };
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function keep(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function color(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function mergeCoachingSections(raw: unknown, fallback: AdminCoachingSection[]): AdminCoachingSection[] {
  if (!Array.isArray(raw)) return fallback;
  const next: AdminCoachingSection[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<AdminCoachingSection>;
    const view = COACHING_VIEWS.includes(row.view as CoachingSectionView) ? (row.view as CoachingSectionView) : "page";
    const id = text(row.id, "");
    if (!id) continue;
    next.push({
      id,
      view,
      name: text(row.name, "Section"),
      blurb: typeof row.blurb === "string" ? row.blurb : "",
      logoText: text(row.logoText, nameMark(text(row.name, "S"))),
      enabled: row.enabled !== false,
    });
  }
  return next.length ? next : fallback;
}

function nameMark(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "S";
}

let cachedAdminRaw: unknown = Symbol("admin-empty");
let cachedAdmin: AdminState = defaultAdminState();

export function readAdmin(raw: unknown): AdminState {
  if (raw === cachedAdminRaw) return cachedAdmin;
  const next = normalizeAdmin(raw);
  cachedAdminRaw = raw;
  cachedAdmin = next;
  return next;
}

function normalizeAdmin(raw: unknown): AdminState {
  const base = defaultAdminState();
  if (!raw || typeof raw !== "object") return base;
  const row = raw as { ownerEmail?: unknown; copy?: Partial<AdminCopy> };
  const copy = row.copy ?? {};
  const tests = { ...base.copy.tests, ...(copy.tests ?? {}) };
  const notes = { ...base.copy.notes, ...(copy.notes ?? {}) };
  const focus = { ...base.copy.focus, ...(copy.focus ?? {}) };
  const connect = { ...base.copy.connect, ...(copy.connect ?? {}) };
  const target = { ...base.copy.target, ...(copy.target ?? {}) };
  const logos = { ...base.copy.logos, ...(copy.logos ?? {}) };
  const legal = { ...base.copy.legal, ...(copy.legal ?? {}) };
  const coachingRaw: Partial<AdminCopy["coaching"]> = copy.coaching ?? {};
  return {
    ownerEmail: typeof row.ownerEmail === "string" ? row.ownerEmail.trim().toLowerCase() : "",
    passwordHash: typeof (row as { passwordHash?: unknown }).passwordHash === "string" ? (row as { passwordHash: string }).passwordHash : "",
    purchases: Array.isArray((row as { purchases?: unknown }).purchases)
      ? (row as { purchases: unknown[] }).purchases.filter((id) => typeof id === "string")
      : [],
    payout: readPayout((row as { payout?: unknown }).payout),
    controls: readControls((row as { controls?: unknown }).controls),
    copy: {
      appName: text(copy.appName, base.copy.appName),
      tests: {
        name: text(tests.name, base.copy.tests.name),
        intro: typeof tests.intro === "string" ? tests.intro : base.copy.tests.intro,
        empty: text(tests.empty, base.copy.tests.empty),
        day3Name: text(tests.day3Name, base.copy.tests.day3Name),
        day7Name: text(tests.day7Name, base.copy.tests.day7Name),
        day14Name: text(tests.day14Name, base.copy.tests.day14Name),
        day21Name: text(tests.day21Name, base.copy.tests.day21Name),
        day21Hint: keep(tests.day21Hint, base.copy.tests.day21Hint),
        importNotice: keep(tests.importNotice, base.copy.tests.importNotice),
        addCreate: text(tests.addCreate, base.copy.tests.addCreate),
        addEmail: text(tests.addEmail, base.copy.tests.addEmail),
        addPhone: text(tests.addPhone, base.copy.tests.addPhone),
        addDesk: text(tests.addDesk, base.copy.tests.addDesk),
        addPaste: text(tests.addPaste, base.copy.tests.addPaste),
        addFiles: text(tests.addFiles, base.copy.tests.addFiles),
        practice: text(tests.practice, base.copy.tests.practice),
        practiced: text(tests.practiced, base.copy.tests.practiced),
        pending: text(tests.pending, base.copy.tests.pending),
        labelDay: text(tests.labelDay, base.copy.tests.labelDay),
        labelRemain: text(tests.labelRemain, base.copy.tests.labelRemain),
        labelIncorrect: text(tests.labelIncorrect, base.copy.tests.labelIncorrect),
        labelTransfer: text(tests.labelTransfer, base.copy.tests.labelTransfer),
        labelPending: text(tests.labelPending, base.copy.tests.labelPending),
        labelCorrect: text(tests.labelCorrect, base.copy.tests.labelCorrect),
        headerColor: color(tests.headerColor, base.copy.tests.headerColor),
        ringDay: color(tests.ringDay, base.copy.tests.ringDay),
        ringRemain: color(tests.ringRemain, base.copy.tests.ringRemain),
        ringIncorrect: color(tests.ringIncorrect, base.copy.tests.ringIncorrect),
        ringTransfer: color(tests.ringTransfer, base.copy.tests.ringTransfer),
        ringPending: color(tests.ringPending, base.copy.tests.ringPending),
        ringCorrect: color(tests.ringCorrect, base.copy.tests.ringCorrect),
      },
      notes: {
        name: text(notes.name, base.copy.notes.name),
        intro: typeof notes.intro === "string" ? notes.intro : base.copy.notes.intro,
        logoText: text(notes.logoText, base.copy.notes.logoText).slice(0, 3),
        accent: /^#[0-9a-fA-F]{6}$/.test(notes.accent ?? "") ? notes.accent : base.copy.notes.accent,
        newNote: text(notes.newNote, base.copy.notes.newNote),
        newFolder: text(notes.newFolder, base.copy.notes.newFolder),
        empty: text(notes.empty, base.copy.notes.empty),
      },
      focus: {
        name: text(focus.name, base.copy.focus.name),
        intro: typeof focus.intro === "string" ? focus.intro : base.copy.focus.intro,
        logoText: text(focus.logoText, base.copy.focus.logoText).slice(0, 3),
        shieldLabel: text(focus.shieldLabel, base.copy.focus.shieldLabel),
        modeLabel: text(focus.modeLabel, base.copy.focus.modeLabel),
        blockLabel: text(focus.blockLabel, base.copy.focus.blockLabel),
      },
      connect: {
        name: text(connect.name, base.copy.connect.name),
        intro: typeof connect.intro === "string" ? connect.intro : base.copy.connect.intro,
        liveTitle: text(connect.liveTitle, base.copy.connect.liveTitle),
        liveBody: typeof connect.liveBody === "string" ? connect.liveBody : base.copy.connect.liveBody,
        liveButton: text(connect.liveButton, base.copy.connect.liveButton),
        joinLabel: text(connect.joinLabel, base.copy.connect.joinLabel),
        joinButton: text(connect.joinButton, base.copy.connect.joinButton),
        chatTitle: text(connect.chatTitle, base.copy.connect.chatTitle),
        chatBody: typeof connect.chatBody === "string" ? connect.chatBody : base.copy.connect.chatBody,
        chatButton: text(connect.chatButton, base.copy.connect.chatButton),
        notesTitle: text(connect.notesTitle, base.copy.connect.notesTitle),
        notesBody: typeof connect.notesBody === "string" ? connect.notesBody : base.copy.connect.notesBody,
        notesButton: text(connect.notesButton, base.copy.connect.notesButton),
        shareDialogTitle: text(connect.shareDialogTitle, base.copy.connect.shareDialogTitle),
        shareDialogBody: typeof connect.shareDialogBody === "string" ? connect.shareDialogBody : base.copy.connect.shareDialogBody,
      },
      coaching: {
        name: text(coachingRaw.name, base.copy.coaching.name),
        intro: typeof coachingRaw.intro === "string" ? coachingRaw.intro : base.copy.coaching.intro,
        logoText: text(coachingRaw.logoText, base.copy.coaching.logoText).slice(0, 3),
        sections: mergeCoachingSections(coachingRaw.sections, base.copy.coaching.sections),
      },
      target: {
        name: text(target.name, base.copy.target.name),
        intro: typeof target.intro === "string" ? target.intro : base.copy.target.intro,
        riverTitle: text(target.riverTitle, base.copy.target.riverTitle),
        riverHint: typeof target.riverHint === "string" ? target.riverHint : base.copy.target.riverHint,
        ludoTitle: text(target.ludoTitle, base.copy.target.ludoTitle),
        ludoHint: typeof target.ludoHint === "string" ? target.ludoHint : base.copy.target.ludoHint,
      },
      logos: {
        tests: typeof logos.tests === "string" ? logos.tests : "",
        notes: typeof logos.notes === "string" ? logos.notes : "",
        focus: typeof logos.focus === "string" ? logos.focus : "",
        connect: typeof logos.connect === "string" ? logos.connect : "",
        coaching: typeof logos.coaching === "string" ? logos.coaching : "",
        target: typeof logos.target === "string" ? logos.target : "",
        subscriptions: typeof logos.subscriptions === "string" ? logos.subscriptions : "",
      },
      legal: {
        privacyTitle: text(legal.privacyTitle, base.copy.legal.privacyTitle),
        privacyBody: typeof legal.privacyBody === "string" ? legal.privacyBody : base.copy.legal.privacyBody,
        termsTitle: text(legal.termsTitle, base.copy.legal.termsTitle),
        termsBody: typeof legal.termsBody === "string" ? legal.termsBody : base.copy.legal.termsBody,
        deletionTitle: text(legal.deletionTitle, base.copy.legal.deletionTitle),
        deletionBody: typeof legal.deletionBody === "string" ? legal.deletionBody : base.copy.legal.deletionBody,
        supportEmail: text(legal.supportEmail, base.copy.legal.supportEmail),
      },
    },
  };
}

export function sectionLabel(copyName: string, prefName: string | undefined, fallback: string) {
  const custom = copyName.trim();
  if (custom && custom !== fallback) return custom;
  return prefName?.trim() || custom || fallback;
}

export const ADMIN_SESSION_KEY = "setpaper-admin-ok";
