import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ADMIN_SESSION_KEY, readAdmin, type AdminCoachingSection, type AdminCopy } from "@/lib/admin/copy";
import { readLogoFile } from "@/lib/admin/logo";
import type { AdminFunction, AdminPlan, SectionId } from "@/lib/admin/controls";
import { useExamStore } from "@/lib/exam/store";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Category = SectionId | "accounts" | "legal" | "logos";

const CATEGORIES: { id: Category; label: string; hint: string }[] = [
  { id: "tests", label: "Tests", hint: "Folders, review days, import, colors" },
  { id: "notes", label: "Notes", hint: "Notes, folders, files, links" },
  { id: "focus", label: "Focus", hint: "Mode, shield, timers, PIN" },
  { id: "connect", label: "Connect", hint: "Live test, chat, share notes" },
  { id: "coaching", label: "Coaching", hint: "Classes, courses, discussions" },
  { id: "target", label: "Target exam", hint: "Path, boards, rename" },
  { id: "templates", label: "Exam templates", hint: "List, edit, pattern, upload" },
  { id: "settings", label: "Settings", hint: "Account, review, appearance" },
  { id: "browser", label: "Questions", hint: "Search, edit, and delete questions" },
  { id: "subscriptions", label: "Subscriptions", hint: "Plans and what they unlock" },
  { id: "accounts", label: "Accounts", hint: "Suspend or delete user profiles" },
  { id: "legal", label: "Terms and privacy", hint: "Play Console policy text" },
  { id: "logos", label: "Logos", hint: "Section, folder, and deck images" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Area({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
    />
  );
}

function patchCopy(fn: (copy: AdminCopy) => AdminCopy) {
  useExamStore.getState().setAdminCopy(fn);
}

function AdminPage() {
  const rawAdmin = useExamStore((s) => s.admin);
  const admin = useMemo(() => readAdmin(rawAdmin), [rawAdmin]);
  const claimAdminOwner = useExamStore((s) => s.claimAdminOwner);
  const setAdminPassword = useExamStore((s) => s.setAdminPassword);
  const checkAdminLogin = useExamStore((s) => s.checkAdminLogin);
  const focus = useExamStore((s) => s.focus);
  const updateFocus = useExamStore((s) => s.updateFocus);
  const setPrefs = useExamStore((s) => s.setPrefs);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(() => {
    if (typeof sessionStorage === "undefined") return false;
    const saved = readAdmin(useExamStore.getState().admin);
    return Boolean(saved.passwordHash) && sessionStorage.getItem(ADMIN_SESSION_KEY) === saved.ownerEmail;
  });
  const [category, setCategory] = useState<Category>("tests");

  const owner = admin.ownerEmail;

  function unlock(nextEmail: string) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, nextEmail);
    setPassword("");
    setConfirm("");
    setOpen(true);
  }

  function createOwner(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!claimAdminOwner(email, password)) {
      toast.error("Use a real email and a password of at least 4 characters");
      return;
    }
    unlock(email.trim().toLowerCase());
    toast.success("Admin email and password saved");
  }

  function signIn(event: FormEvent) {
    event.preventDefault();
    if (!checkAdminLogin(email, password)) {
      toast.error("Email or password is wrong");
      return;
    }
    unlock(email.trim().toLowerCase());
  }

  function savePassword(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!setAdminPassword(email, password, "")) {
      toast.error("That email is not the admin");
      return;
    }
    unlock(email.trim().toLowerCase());
    toast.success("Password saved");
  }

  const copy = admin.copy;

  return (
    <StudyShell title="Admin">
      {!open ? (
        <div className="mx-auto grid max-w-md gap-4 p-4">
          <div className="surface-3d grid gap-3 p-5">
            <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="size-5" />
            </span>
            <h2 className="text-lg font-semibold tracking-tight">Admin sign in</h2>
            <p className="text-sm text-muted-foreground">
              Only one admin email can change the app. Email and password are both required.
            </p>
            {!owner ? (
              <form className="grid gap-3" onSubmit={createOwner}>
                <Field label="Admin email">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" required />
                </Field>
                <Field label="Password">
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required />
                </Field>
                <Field label="Confirm password">
                  <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" autoComplete="new-password" required />
                </Field>
                <Button type="submit">Create admin login</Button>
              </form>
            ) : null}
            {owner && !admin.passwordHash ? (
              <form className="grid gap-3" onSubmit={savePassword}>
                <p className="text-sm">This admin has no password yet. Set one for {owner}.</p>
                <Field label="Admin email">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" required />
                </Field>
                <Field label="New password">
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required />
                </Field>
                <Field label="Confirm password">
                  <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" required />
                </Field>
                <Button type="submit">Save password</Button>
              </form>
            ) : null}
            {owner && admin.passwordHash ? (
              <form className="grid gap-3" onSubmit={signIn}>
                <Field label="Admin email">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" required />
                </Field>
                <Field label="Password">
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
                </Field>
                <Button type="submit">Open admin</Button>
              </form>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-lg gap-4 p-4 pb-8">
          <p className="px-1 text-xs text-muted-foreground">Signed in as {owner}. Changes apply across the app immediately.</p>
          <section className="surface-3d grid gap-3 p-4">
            <Field label="App name">
              <Input value={copy.appName} onChange={(e) => patchCopy((c) => ({ ...c, appName: e.target.value }))} />
            </Field>
          </section>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`rounded-xl border px-3 py-3 text-left ${category === item.id ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{item.hint}</span>
              </button>
            ))}
          </div>
          {category === "accounts" || category === "legal" || category === "logos" ? null : <FunctionBoard section={category} />}
          {category === "accounts" ? <AccountsBoard /> : null}
          {category === "legal" ? <LegalBoard /> : null}
          {category === "logos" ? <LogosBoard /> : null}

          {category === "tests" ? (
            <section className="surface-3d grid gap-3 p-4">
              <Field label="Section name">
                <Input value={copy.tests.name} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, name: e.target.value } }))} />
              </Field>
              <Field label="Intro">
                <Area value={copy.tests.intro} onChange={(value) => patchCopy((c) => ({ ...c, tests: { ...c.tests, intro: value } }))} />
              </Field>
              <Field label="Empty text">
                <Area value={copy.tests.empty} onChange={(value) => patchCopy((c) => ({ ...c, tests: { ...c.tests, empty: value } }))} />
              </Field>
              <Field label="21-day name">
                <Input value={copy.tests.day21Name} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, day21Name: e.target.value } }))} />
              </Field>
              <Field label="21-day sentence">
                <Input value={copy.tests.day21Hint} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, day21Hint: e.target.value } }))} />
              </Field>
              <Field label="3-day name">
                <Input value={copy.tests.day3Name} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, day3Name: e.target.value } }))} />
              </Field>
              <Field label="7-day name">
                <Input value={copy.tests.day7Name} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, day7Name: e.target.value } }))} />
              </Field>
              <Field label="14-day name">
                <Input value={copy.tests.day14Name} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, day14Name: e.target.value } }))} />
              </Field>
              <Field label="Create or import notice">
                <Area value={copy.tests.importNotice} onChange={(value) => patchCopy((c) => ({ ...c, tests: { ...c.tests, importNotice: value } }))} />
              </Field>
              <Field label="Create or import label">
                <Input value={copy.tests.addCreate} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, addCreate: e.target.value } }))} />
              </Field>
              <Field label="Email label">
                <Input value={copy.tests.addEmail} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, addEmail: e.target.value } }))} />
              </Field>
              <Field label="Phone folder label">
                <Input value={copy.tests.addPhone} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, addPhone: e.target.value } }))} />
              </Field>
              <Field label="Desk folder label">
                <Input value={copy.tests.addDesk} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, addDesk: e.target.value } }))} />
              </Field>
              <Field label="Paste label">
                <Input value={copy.tests.addPaste} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, addPaste: e.target.value } }))} />
              </Field>
              <Field label="Add files label">
                <Input value={copy.tests.addFiles} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, addFiles: e.target.value } }))} />
              </Field>
              <Field label="Practice button">
                <Input value={copy.tests.practice} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, practice: e.target.value } }))} />
              </Field>
              <Field label="Practiced sentence">
                <Input value={copy.tests.practiced} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, practiced: e.target.value } }))} />
              </Field>
              <Field label="Pending sentence">
                <Input value={copy.tests.pending} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, pending: e.target.value } }))} />
              </Field>
              <Field label="Header highlight">
                <Input value={copy.tests.headerColor} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, headerColor: e.target.value } }))} />
              </Field>
              <Field label="Day ring">
                <Input value={copy.tests.ringDay} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, ringDay: e.target.value } }))} />
              </Field>
              <Field label="Remaining ring">
                <Input value={copy.tests.ringRemain} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, ringRemain: e.target.value } }))} />
              </Field>
              <Field label="Incorrect ring">
                <Input value={copy.tests.ringIncorrect} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, ringIncorrect: e.target.value } }))} />
              </Field>
              <Field label="Transfer ring">
                <Input value={copy.tests.ringTransfer} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, ringTransfer: e.target.value } }))} />
              </Field>
              <Field label="Pending ring">
                <Input value={copy.tests.ringPending} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, ringPending: e.target.value } }))} />
              </Field>
              <Field label="Correct ring">
                <Input value={copy.tests.ringCorrect} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, ringCorrect: e.target.value } }))} />
              </Field>
              <Field label="Day label">
                <Input value={copy.tests.labelDay} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, labelDay: e.target.value } }))} />
              </Field>
              <Field label="Remaining label">
                <Input value={copy.tests.labelRemain} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, labelRemain: e.target.value } }))} />
              </Field>
              <Field label="Incorrect label">
                <Input value={copy.tests.labelIncorrect} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, labelIncorrect: e.target.value } }))} />
              </Field>
              <Field label="Transfer label">
                <Input value={copy.tests.labelTransfer} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, labelTransfer: e.target.value } }))} />
              </Field>
              <Field label="Pending label">
                <Input value={copy.tests.labelPending} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, labelPending: e.target.value } }))} />
              </Field>
              <Field label="Correct label">
                <Input value={copy.tests.labelCorrect} onChange={(e) => patchCopy((c) => ({ ...c, tests: { ...c.tests, labelCorrect: e.target.value } }))} />
              </Field>
            </section>
          ) : null}

          {category === "notes" ? (
            <section className="surface-3d grid gap-3 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl text-sm font-semibold text-white" style={{ background: copy.notes.accent }}>
                  {copy.notes.logoText || "N"}
                </span>
                <p className="text-sm text-muted-foreground">Logo preview</p>
              </div>
              <Field label="Section name">
                <Input value={copy.notes.name} onChange={(e) => patchCopy((c) => ({ ...c, notes: { ...c.notes, name: e.target.value } }))} />
              </Field>
              <Field label="Logo letters">
                <Input value={copy.notes.logoText} maxLength={3} onChange={(e) => patchCopy((c) => ({ ...c, notes: { ...c.notes, logoText: e.target.value } }))} />
              </Field>
              <Field label="Logo colour">
                <Input value={copy.notes.accent} onChange={(e) => patchCopy((c) => ({ ...c, notes: { ...c.notes, accent: e.target.value } }))} />
              </Field>
              <Field label="Intro">
                <Area value={copy.notes.intro} onChange={(value) => patchCopy((c) => ({ ...c, notes: { ...c.notes, intro: value } }))} />
              </Field>
              <Field label="New note label">
                <Input value={copy.notes.newNote} onChange={(e) => patchCopy((c) => ({ ...c, notes: { ...c.notes, newNote: e.target.value } }))} />
              </Field>
              <Field label="New folder label">
                <Input value={copy.notes.newFolder} onChange={(e) => patchCopy((c) => ({ ...c, notes: { ...c.notes, newFolder: e.target.value } }))} />
              </Field>
              <Field label="Empty folder text">
                <Area value={copy.notes.empty} onChange={(value) => patchCopy((c) => ({ ...c, notes: { ...c.notes, empty: value } }))} />
              </Field>
            </section>
          ) : null}

          {category === "focus" ? (
            <section className="surface-3d grid gap-3 p-4">
              <Field label="Section name">
                <Input value={copy.focus.name} onChange={(e) => patchCopy((c) => ({ ...c, focus: { ...c.focus, name: e.target.value } }))} />
              </Field>
              <Field label="Logo letters">
                <Input value={copy.focus.logoText} maxLength={3} onChange={(e) => patchCopy((c) => ({ ...c, focus: { ...c.focus, logoText: e.target.value } }))} />
              </Field>
              <Field label="Intro">
                <Area value={copy.focus.intro} onChange={(value) => patchCopy((c) => ({ ...c, focus: { ...c.focus, intro: value } }))} />
              </Field>
              <Field label="Mode label">
                <Input value={copy.focus.modeLabel} onChange={(e) => patchCopy((c) => ({ ...c, focus: { ...c.focus, modeLabel: e.target.value } }))} />
              </Field>
              <Field label="Shield label">
                <Input value={copy.focus.shieldLabel} onChange={(e) => patchCopy((c) => ({ ...c, focus: { ...c.focus, shieldLabel: e.target.value } }))} />
              </Field>
              <Field label="Block label">
                <Input value={copy.focus.blockLabel} onChange={(e) => patchCopy((c) => ({ ...c, focus: { ...c.focus, blockLabel: e.target.value } }))} />
              </Field>
              <Toggle
                title={copy.focus.modeLabel}
                checked={Boolean(focus?.settings.modeOn)}
                onChange={(v) => updateFocus((state) => ({ ...state, settings: { ...state.settings, modeOn: v } }))}
              />
              <Toggle
                title={copy.focus.shieldLabel}
                checked={Boolean(focus?.settings.shieldOn)}
                onChange={(v) => updateFocus((state) => ({ ...state, settings: { ...state.settings, shieldOn: v } }))}
              />
              <Toggle
                title={copy.focus.blockLabel}
                checked={Boolean(focus?.settings.blockAllOn)}
                onChange={(v) => updateFocus((state) => ({ ...state, settings: { ...state.settings, blockAllOn: v } }))}
              />
              <Toggle
                title="Notify before close"
                checked={Boolean(focus?.settings.notifyBeforeClose)}
                onChange={(v) => updateFocus((state) => ({ ...state, settings: { ...state.settings, notifyBeforeClose: v } }))}
              />
              <Toggle
                title="Show remaining time"
                checked={Boolean(focus?.settings.displayRemaining)}
                onChange={(v) => updateFocus((state) => ({ ...state, settings: { ...state.settings, displayRemaining: v } }))}
              />
            </section>
          ) : null}

          {category === "connect" ? (
            <section className="surface-3d grid gap-3 p-4">
              <Field label="Section name">
                <Input value={copy.connect.name} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, name: e.target.value } }))} />
              </Field>
              <Field label="Intro">
                <Area value={copy.connect.intro} onChange={(value) => patchCopy((c) => ({ ...c, connect: { ...c.connect, intro: value } }))} />
              </Field>
              <Field label="Live test title">
                <Input value={copy.connect.liveTitle} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, liveTitle: e.target.value } }))} />
              </Field>
              <Field label="Live test sentence">
                <Area value={copy.connect.liveBody} onChange={(value) => patchCopy((c) => ({ ...c, connect: { ...c.connect, liveBody: value } }))} />
              </Field>
              <Field label="Create button">
                <Input value={copy.connect.liveButton} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, liveButton: e.target.value } }))} />
              </Field>
              <Field label="Join label">
                <Input value={copy.connect.joinLabel} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, joinLabel: e.target.value } }))} />
              </Field>
              <Field label="Join button">
                <Input value={copy.connect.joinButton} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, joinButton: e.target.value } }))} />
              </Field>
              <Field label="Chat title">
                <Input value={copy.connect.chatTitle} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, chatTitle: e.target.value } }))} />
              </Field>
              <Field label="Chat sentence">
                <Area value={copy.connect.chatBody} onChange={(value) => patchCopy((c) => ({ ...c, connect: { ...c.connect, chatBody: value } }))} />
              </Field>
              <Field label="Chat button">
                <Input value={copy.connect.chatButton} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, chatButton: e.target.value } }))} />
              </Field>
              <Field label="Share notes title">
                <Input value={copy.connect.notesTitle} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, notesTitle: e.target.value } }))} />
              </Field>
              <Field label="Share notes sentence">
                <Area value={copy.connect.notesBody} onChange={(value) => patchCopy((c) => ({ ...c, connect: { ...c.connect, notesBody: value } }))} />
              </Field>
              <Field label="Share notes button">
                <Input value={copy.connect.notesButton} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, notesButton: e.target.value } }))} />
              </Field>
              <Field label="Share dialog title">
                <Input value={copy.connect.shareDialogTitle} onChange={(e) => patchCopy((c) => ({ ...c, connect: { ...c.connect, shareDialogTitle: e.target.value } }))} />
              </Field>
              <Field label="Share dialog sentence">
                <Area value={copy.connect.shareDialogBody} onChange={(value) => patchCopy((c) => ({ ...c, connect: { ...c.connect, shareDialogBody: value } }))} />
              </Field>
            </section>
          ) : null}

          {category === "coaching" ? <CoachingEditor copy={copy} /> : null}

          {category === "target" ? (
            <section className="surface-3d grid gap-3 p-4">
              <Field label="Section name">
                <Input
                  value={copy.target.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    patchCopy((c) => ({ ...c, target: { ...c.target, name } }));
                    setPrefs({ targetExamName: name.trim() || "Target Exam" });
                  }}
                />
              </Field>
              <Field label="Intro">
                <Area value={copy.target.intro} onChange={(value) => patchCopy((c) => ({ ...c, target: { ...c.target, intro: value } }))} />
              </Field>
              <Field label="River board name">
                <Input value={copy.target.riverTitle} onChange={(e) => patchCopy((c) => ({ ...c, target: { ...c.target, riverTitle: e.target.value } }))} />
              </Field>
              <Field label="River sentence">
                <Area value={copy.target.riverHint} onChange={(value) => patchCopy((c) => ({ ...c, target: { ...c.target, riverHint: value } }))} />
              </Field>
              <Field label="Board-race name">
                <Input value={copy.target.ludoTitle} onChange={(e) => patchCopy((c) => ({ ...c, target: { ...c.target, ludoTitle: e.target.value } }))} />
              </Field>
              <Field label="Board-race sentence">
                <Area value={copy.target.ludoHint} onChange={(value) => patchCopy((c) => ({ ...c, target: { ...c.target, ludoHint: value } }))} />
              </Field>
            </section>
          ) : null}

          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
              setOpen(false);
            }}
          >
            Lock admin
          </Button>
        </div>
      )}
    </StudyShell>
  );
}

function Toggle({ title, checked, onChange }: { title: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
      <Label>{title}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function CoachingEditor({ copy }: { copy: AdminCopy }) {
  function update(id: string, patch: Partial<AdminCoachingSection>) {
    patchCopy((c) => ({
      ...c,
      coaching: {
        ...c.coaching,
        sections: c.coaching.sections.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      },
    }));
  }

  return (
    <section className="surface-3d grid gap-3 p-4">
      <Field label="Section name">
        <Input value={copy.coaching.name} onChange={(e) => patchCopy((c) => ({ ...c, coaching: { ...c.coaching, name: e.target.value } }))} />
      </Field>
      <Field label="Logo letters">
        <Input value={copy.coaching.logoText} maxLength={3} onChange={(e) => patchCopy((c) => ({ ...c, coaching: { ...c.coaching, logoText: e.target.value } }))} />
      </Field>
      <Field label="Intro">
        <Area value={copy.coaching.intro} onChange={(value) => patchCopy((c) => ({ ...c, coaching: { ...c.coaching, intro: value } }))} />
      </Field>
      <ul className="grid gap-3">
        {copy.coaching.sections.map((item) => (
          <li key={item.id} className="grid gap-2 rounded-xl border border-border p-3">
            <div className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-lg bg-secondary text-xs font-semibold">{item.logoText || "S"}</span>
              <Input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} aria-label="Subsection name" />
            </div>
            <Input value={item.logoText} maxLength={3} onChange={(e) => update(item.id, { logoText: e.target.value })} aria-label="Logo" />
            <Area value={item.blurb} onChange={(value) => update(item.id, { blurb: value })} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item.view === "page" ? "Custom page" : "Built-in"}</span>
              <div className="flex items-center gap-2">
                <Switch checked={item.enabled} onCheckedChange={(v) => update(item.id, { enabled: v })} aria-label="Show section" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    patchCopy((c) => ({
                      ...c,
                      coaching: { ...c.coaching, sections: c.coaching.sections.filter((row) => row.id !== item.id) },
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          patchCopy((c) => ({
            ...c,
            coaching: {
              ...c.coaching,
              sections: [
                ...c.coaching.sections,
                { id: uid(), view: "page", name: "New section", blurb: "", logoText: "N", enabled: true },
              ],
            },
          }))
        }
      >
        Add section
      </Button>
    </section>
  );
}

function patchControls(fn: (controls: ReturnType<typeof readAdmin>["controls"]) => ReturnType<typeof readAdmin>["controls"]) {
  useExamStore.getState().setAdminControls(fn);
}

function FunctionBoard({ section }: { section: SectionId }) {
  const raw = useExamStore((s) => s.admin);
  const admin = useMemo(() => readAdmin(raw), [raw]);
  const controls = admin.controls;
  const rows = controls.functions.filter((item) => item.section === section);

  function update(id: string, patch: Partial<AdminFunction>) {
    patchControls((current) => ({
      ...current,
      functions: current.functions.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function updatePlan(id: string, patch: Partial<AdminPlan>) {
    patchControls((current) => ({
      ...current,
      plans: current.plans.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan)),
    }));
  }

  return (
    <section className="surface-3d grid gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Section switch</p>
          <p className="text-xs text-muted-foreground">Off hides this section and blocks its pages.</p>
        </div>
        <Switch
          checked={controls.sections[section] !== false}
          onCheckedChange={(enabled) =>
            patchControls((current) => ({ ...current, sections: { ...current.sections, [section]: enabled } }))
          }
          aria-label="Section enabled"
        />
      </div>
      <ul className="grid gap-3">
        {rows.map((item) => (
          <li key={item.id} className="grid gap-2 rounded-xl border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <Input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} aria-label="Function name" />
              <Switch checked={item.enabled} onCheckedChange={(enabled) => update(item.id, { enabled })} aria-label="Function enabled" />
            </div>
            <Area value={item.hint} onChange={(hint) => update(item.id, { hint })} />
            <label className="grid gap-1 text-xs text-muted-foreground">
              Subscription
              <select
                className="h-10 rounded-md border border-border bg-card px-2 text-sm text-foreground"
                value={item.planId}
                onChange={(e) => update(item.id, { planId: e.target.value })}
              >
                <option value="">Free</option>
                {controls.plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                    {plan.enabled ? "" : " (hidden)"}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                patchControls((current) => ({
                  ...current,
                  functions: current.functions.filter((row) => row.id !== item.id),
                  removedIds: current.removedIds.includes(item.id) ? current.removedIds : [...current.removedIds, item.id],
                }))
              }
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          patchControls((current) => ({
            ...current,
            functions: [
              ...current.functions,
              { id: uid(), section, name: "New function", hint: "", enabled: true, planId: "", builtin: false },
            ],
          }))
        }
      >
        Add function
      </Button>
      {section === "subscriptions" ? (
        <div className="grid gap-3 border-t border-border pt-3">
          <p className="text-sm font-semibold">Where fees are paid</p>
          <PayoutFields />
          <p className="text-sm font-semibold">Plans</p>
          {controls.plans.map((plan) => (
            <div key={plan.id} className="grid gap-2 rounded-xl border border-border p-3">
              <div className="flex items-center gap-2">
                <Input value={plan.name} onChange={(e) => updatePlan(plan.id, { name: e.target.value })} aria-label="Plan name" />
                <Switch checked={plan.enabled} onCheckedChange={(enabled) => updatePlan(plan.id, { enabled })} aria-label="Plan visible" />
              </div>
              <Input value={plan.price} onChange={(e) => updatePlan(plan.id, { price: e.target.value })} aria-label="Price" />
              <Area value={plan.blurb} onChange={(blurb) => updatePlan(plan.id, { blurb })} />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  patchControls((current) => ({
                    ...current,
                    plans: current.plans.filter((row) => row.id !== plan.id),
                    functions: current.functions.map((item) => (item.planId === plan.id ? { ...item, planId: "" } : item)),
                  }))
                }
              >
                Remove plan
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              patchControls((current) => ({
                ...current,
                plans: [...current.plans, { id: uid(), name: "New plan", price: "", blurb: "", enabled: true }],
              }))
            }
          >
            Add plan
          </Button>
          {admin.purchases.length ? (
            <Button type="button" variant="outline" onClick={() => admin.purchases.forEach((id) => useExamStore.getState().revokePlan(id))}>
              Revoke purchases on this device
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function PayoutFields() {
  const raw = useExamStore((s) => s.admin);
  const payout = useMemo(() => readAdmin(raw).payout, [raw]);
  const setAdminPayout = useExamStore((s) => s.setAdminPayout);
  return (
    <div className="grid gap-2">
      <Field label="UPI ID">
        <Input value={payout.upi} onChange={(e) => setAdminPayout({ upi: e.target.value.trim() })} placeholder="name@upi" />
      </Field>
      <Field label="PhonePe number">
        <Input value={payout.phonePe} onChange={(e) => setAdminPayout({ phonePe: e.target.value.trim() })} placeholder="10-digit number" />
      </Field>
      <Field label="Account name">
        <Input value={payout.accountName} onChange={(e) => setAdminPayout({ accountName: e.target.value })} />
      </Field>
      <Field label="Account number">
        <Input value={payout.accountNumber} onChange={(e) => setAdminPayout({ accountNumber: e.target.value.replace(/\s/g, "") })} />
      </Field>
      <Field label="IFSC">
        <Input value={payout.ifsc} onChange={(e) => setAdminPayout({ ifsc: e.target.value.trim().toUpperCase() })} />
      </Field>
      <p className="text-xs text-muted-foreground">Plan fees are the prices on each plan below. Payments use these details.</p>
    </div>
  );
}

function AccountsBoard() {
  const profiles = useExamStore((s) => s.profiles ?? []);
  const updateProfile = useExamStore((s) => s.updateProfile);
  const setProfileStatus = useExamStore((s) => s.setProfileStatus);
  const deleteProfile = useExamStore((s) => s.deleteProfile);

  return (
    <section className="surface-3d grid gap-3 p-4">
      <p className="text-sm text-muted-foreground">Every new profile is listed here. Suspend blocks sign-in. Delete removes the account and its photo permanently.</p>
      {profiles.length === 0 ? <p className="text-sm">No accounts yet.</p> : null}
      <ul className="grid gap-3">
        {profiles.map((profile) => (
          <li key={profile.id} className="grid gap-2 rounded-xl border border-border p-3">
            <div className="flex items-center gap-3">
              {profile.photo ? <img src={profile.photo} alt="" className="size-10 rounded-full object-cover" /> : <span className="grid size-10 place-items-center rounded-full bg-secondary text-xs font-semibold">{profile.name.slice(0, 1)}</span>}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.name}</p>
                <p className="truncate text-xs text-muted-foreground">{profile.email || profile.phone} · {profile.status}</p>
              </div>
            </div>
            <Input value={profile.name} onChange={(e) => updateProfile(profile.id, { name: e.target.value })} aria-label="Account name" />
            <Input value={profile.about} onChange={(e) => updateProfile(profile.id, { about: e.target.value })} aria-label="About" />
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setProfileStatus(profile.id, profile.status === "suspended" ? "active" : "suspended")}>
                {profile.status === "suspended" ? "Restore" : "Suspend"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => deleteProfile(profile.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LegalBoard() {
  const raw = useExamStore((s) => s.admin);
  const legal = useMemo(() => readAdmin(raw).copy.legal, [raw]);
  function setLegal(patch: Partial<typeof legal>) {
    patchCopy((copy) => ({ ...copy, legal: { ...copy.legal, ...patch } }));
  }
  return (
    <section className="surface-3d grid gap-3 p-4">
      <p className="text-sm text-muted-foreground">These pages are what users and Play Console review see. Edits here show on Privacy, Terms, and Delete account immediately.</p>
      <Field label="Support email">
        <Input value={legal.supportEmail} onChange={(e) => setLegal({ supportEmail: e.target.value })} />
      </Field>
      <Field label="Privacy title">
        <Input value={legal.privacyTitle} onChange={(e) => setLegal({ privacyTitle: e.target.value })} />
      </Field>
      <Field label="Privacy policy">
        <Area value={legal.privacyBody} onChange={(privacyBody) => setLegal({ privacyBody })} />
      </Field>
      <Field label="Terms title">
        <Input value={legal.termsTitle} onChange={(e) => setLegal({ termsTitle: e.target.value })} />
      </Field>
      <Field label="Terms and conditions">
        <Area value={legal.termsBody} onChange={(termsBody) => setLegal({ termsBody })} />
      </Field>
      <Field label="Deletion title">
        <Input value={legal.deletionTitle} onChange={(e) => setLegal({ deletionTitle: e.target.value })} />
      </Field>
      <Field label="Account deletion">
        <Area value={legal.deletionBody} onChange={(deletionBody) => setLegal({ deletionBody })} />
      </Field>
    </section>
  );
}

const LOGO_KEYS = ["tests", "notes", "focus", "connect", "coaching", "target", "subscriptions"] as const;

function LogoField({ label, value, onChange }: { label: string; value: string; onChange: (logo: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
      <div className="flex items-center gap-3">
        {value ? <img src={value} alt="" className="size-10 rounded-lg object-cover" /> : <span className="grid size-10 place-items-center rounded-lg bg-secondary text-xs">None</span>}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex gap-2">
        <label className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs">
          Upload
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void readLogoFile(file).then(onChange).catch(() => toast.error("Could not use that image"));
            }}
          />
        </label>
        {value ? (
          <Button type="button" size="sm" variant="outline" onClick={() => onChange("")}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function LogosBoard() {
  const raw = useExamStore((s) => s.admin);
  const logos = useMemo(() => readAdmin(raw).copy.logos, [raw]);
  const decks = useExamStore((s) => s.decks);
  const folders = useExamStore((s) => s.folders ?? []);
  const setDeckLogo = useExamStore((s) => s.setDeckLogo);
  const setFolderLogo = useExamStore((s) => s.setFolderLogo);
  return (
    <section className="surface-3d grid gap-3 p-4">
      <p className="text-sm text-muted-foreground">Upload a logo from this device. Section logos show on the bottom bar. Deck, subdeck, and folder logos show on Tests and Notes. Only the admin can change them.</p>
      {LOGO_KEYS.map((key) => (
        <LogoField
          key={key}
          label={key}
          value={logos[key]}
          onChange={(logo) => patchCopy((copy) => ({ ...copy, logos: { ...copy.logos, [key]: logo } }))}
        />
      ))}
      <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Decks and subdecks</p>
      {decks.filter((deck) => !deck.id.startsWith("review-")).map((deck) => (
        <LogoField key={deck.id} label={deck.name.split("::").join(" / ")} value={deck.logo ?? ""} onChange={(logo) => setDeckLogo(deck.id, logo)} />
      ))}
      <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Note folders</p>
      {folders.map((folder) => (
        <LogoField key={folder.id} label={folder.name} value={folder.logo ?? ""} onChange={(logo) => setFolderLogo(folder.id, logo)} />
      ))}
    </section>
  );
}



