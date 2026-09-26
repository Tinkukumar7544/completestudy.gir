import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Copy,
  GraduationCap,
  Hand,
  MessageCircle,
  MessagesSquare,
  Phone,
  PlayCircle,
  Plus,
  Radio,
  SlidersHorizontal,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { NoteFileViewer } from "@/components/note-file-preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { persistBrowserFile } from "@/lib/exam/note-files";
import { createDiscussion, createLiveClass, MAX_DISC_PLAYERS } from "@/lib/exam/discussion";
import { DISC_MODES, asDiscMode, discModeHint, discModeLabel, type DiscMode } from "@/lib/exam/discussion-room";
import { quizPlayerId, rememberedQuizName } from "@/lib/exam/quiz-client";
import { useExamStore } from "@/lib/exam/store";
import { useAdminCopy, useAdminState } from "@/lib/admin/use-copy";
import { functionAccess } from "@/lib/admin/controls";
import type { CoachingSectionView } from "@/lib/admin/copy";
import type { CoachingCourse, CoachingDiscussion, NoteFileMeta } from "@/lib/exam/types";
import { cn, uid } from "@/lib/utils";

const VIEWS = ["hub", "live", "recorded", "meetings", "courses", "discussions", "customize", "teacher"] as const;
type View = (typeof VIEWS)[number];

export const Route = createFileRoute("/coaching")({
  validateSearch: (raw: Record<string, unknown>): { view: View } => ({
    view: VIEWS.includes(raw.view as View) ? (raw.view as View) : "hub",
  }),
  component: CoachingPage,
});

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalInput(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string) {
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

function whenLabel(ts: number) {
  return new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function CoachingPage() {
  const { view } = Route.useSearch();
  if (view === "live") return <LiveClasses />;
  if (view === "recorded") return <RecordedClasses />;
  if (view === "meetings") return <LiveMeetings />;
  if (view === "courses") return <CoursesView />;
  if (view === "discussions") return <DiscussionsView />;
  if (view === "customize") return <CustomizeView />;
  if (view === "teacher") return <TeacherView />;
  return <CoachingHub />;
}

function Back({ to = "hub" }: { to?: View }) {
  const navigate = useNavigate();
  return (
    <div className="border-b border-border bg-card px-3 py-2">
      <Button type="button" variant="ghost" onClick={() => void navigate({ to: "/coaching", search: { view: to } })}>
        Back
      </Button>
    </div>
  );
}

function CoachingHub() {
  const navigate = useNavigate();
  const coaching = useExamStore((s) => s.coaching);
  const copy = useAdminCopy();
  const admin = useAdminState();
  const [pageId, setPageId] = useState<string | null>(null);
  const liveCount = (coaching?.classes ?? []).filter((c) => c.live).length;
  const courseDone = (coaching?.courses ?? []).reduce((n, c) => n + c.lessons.filter((l) => l.done).length, 0);
  const courseTotal = (coaching?.courses ?? []).reduce((n, c) => n + c.lessons.length, 0);
  const hints: Partial<Record<CoachingSectionView, string>> = {
    live: liveCount ? `${liveCount} live now` : `${coaching?.classes.length ?? 0} scheduled`,
    recorded: `${coaching?.recordings.length ?? 0} recordings`,
    meetings: `${coaching?.meetings.length ?? 0} meetings`,
    courses: courseTotal ? `${courseDone}/${courseTotal} lessons done` : "Add a course",
    discussions: `${coaching?.discussions.length ?? 0} topics`,
    customize: coaching?.customization.institute || coaching?.customization.batch || "Batch, schedule, language",
    teacher: coaching?.teacher.name || "Add your teacher",
  };
  const icons: Partial<Record<CoachingSectionView, typeof Radio>> = {
    live: Radio,
    recorded: PlayCircle,
    meetings: Video,
    courses: BookOpen,
    discussions: MessagesSquare,
    customize: SlidersHorizontal,
    teacher: Phone,
    page: GraduationCap,
  };
  const sections = copy.coaching.sections.filter((item) => item.enabled);
  const openPage = sections.find((item) => item.id === pageId && item.view === "page");

  return (
    <StudyShell title={copy.coaching.name}>
      <div className="mx-auto grid max-w-lg gap-3 p-4 pb-8">
        {openPage ? (
          <div className="surface-3d grid gap-2 p-4">
            <p className="font-semibold">{openPage.name}</p>
            <p className="text-sm text-muted-foreground">{openPage.blurb || "No text yet."}</p>
            <Button type="button" variant="outline" onClick={() => setPageId(null)}>
              Back
            </Button>
          </div>
        ) : null}
        <ul className="grid gap-3">
          {sections.map((item) => {
            const Icon = icons[item.view] ?? GraduationCap;
            const access = item.view === "page" ? null : functionAccess(admin, `coaching.${item.view}`);
            if (access?.reason === "off") return null;
            const hint = access?.reason === "locked" ? `Locked to ${access.planName}` : item.view === "page" ? item.blurb || "Custom section" : item.blurb || hints[item.view] || "";
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="surface-3d lift flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left"
                  onClick={() => {
                    if (access?.reason === "locked") {
                      void navigate({ to: "/subscriptions" });
                      return;
                    }
                    if (item.view === "page") {
                      setPageId(item.id);
                      return;
                    }
                    void navigate({ to: "/coaching", search: { view: item.view } });
                  }}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground">
                    {item.logoText || <Icon className="size-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold tracking-tight">{item.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{hint}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </StudyShell>
  );
}

function LiveClasses() {
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [when, setWhen] = useState(toLocalInput(Date.now() + 60 * 60 * 1000));
  const [mins, setMins] = useState("45");
  const [notes, setNotes] = useState("");
  const [timeoutSec, setTimeoutSec] = useState("60");
  const [mode, setMode] = useState<DiscMode>("video");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);

  function add() {
    const name = title.trim();
    if (!name) {
      toast.error("Give the class a title");
      return;
    }
    updateCoaching((c) => ({
      ...c,
      classes: [
        {
          id: uid(),
          title: name,
          subject: subject.trim(),
          startsAt: fromLocalInput(when),
          durationMin: Math.max(1, Number(mins) || 45),
          live: false,
          notes: notes.trim(),
          createdAt: Date.now(),
          roomCode: "",
          timeoutSec: Math.max(15, Math.min(300, Number(timeoutSec) || 60)),
        },
        ...c.classes,
      ],
    }));
    setOpen(false);
    setTitle("");
    setSubject("");
    setNotes("");
    toast.success("Live class scheduled");
  }

  async function goLive(opts?: { title?: string; subject?: string; durationMin?: number; timeoutSec?: number; classId?: string }) {
    const name = (opts?.title ?? title).trim();
    if (!name) {
      toast.error("Give the class a title");
      return;
    }
    setBusy(true);
    try {
      const room = await createLiveClass({
        data: {
          hostId: quizPlayerId(),
          hostName: rememberedQuizName() || "Teacher",
          title: name,
          subject: (opts?.subject ?? subject).trim(),
          mode,
          durationMin: opts?.durationMin ?? (Number(mins) || 45),
          timeoutSec: opts?.timeoutSec ?? (Number(timeoutSec) || 60),
        },
      });
      updateCoaching((c) => {
        if (opts?.classId) {
          return {
            ...c,
            classes: c.classes.map((x) =>
              x.id === opts.classId ? { ...x, live: true, roomCode: room.code, timeoutSec: room.timeoutSec } : x,
            ),
          };
        }
        return {
          ...c,
          classes: [
            {
              id: uid(),
              title: name,
              subject: (opts?.subject ?? subject).trim(),
              startsAt: Date.now(),
              durationMin: opts?.durationMin ?? (Number(mins) || 45),
              live: true,
              notes: notes.trim(),
              createdAt: Date.now(),
              roomCode: room.code,
              timeoutSec: room.timeoutSec,
            },
            ...c.classes,
          ],
        };
      });
      setHostOpen(false);
      toast.success(`Live · code ${room.code}`);
      void navigate({ to: "/class/$code", params: { code: room.code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not go live");
    } finally {
      setBusy(false);
    }
  }

  function joinWithCode() {
    const code = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length < 4) {
      toast.error("Enter the class code");
      return;
    }
    setJoinOpen(false);
    void navigate({ to: "/class/$code", params: { code } });
  }

  return (
    <StudyShell title="Live classes">
      <Back />
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <button type="button" className="surface-3d grid gap-2 p-4 text-left" onClick={() => setHostOpen(true)}>
          <p className="flex items-center gap-2 font-semibold tracking-tight">
            <Video className="size-4" />
            Host a class
          </p>
          <p className="text-sm text-muted-foreground">
            Teacher goes live. Camera turns on, a code is created, and students join with that code.
          </p>
        </button>
        <button type="button" className="surface-3d grid gap-2 p-4 text-left" onClick={() => setJoinOpen(true)}>
          <p className="flex items-center gap-2 font-semibold tracking-tight">
            <GraduationCap className="size-4" />
            Join as student
          </p>
          <p className="text-sm text-muted-foreground">Enter the teacher’s code. No cap on how many can connect.</p>
        </button>
      </div>
      <ul className="grid gap-3 px-4 pb-4">
        {(coaching?.classes ?? []).length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-muted-foreground">No live classes yet. Host one or schedule it.</p>
        ) : null}
        {(coaching?.classes ?? []).map((cls) => (
          <li key={cls.id} className="surface-3d grid gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold tracking-tight">{cls.title}</p>
                <p className="text-xs text-muted-foreground">
                  {cls.subject ? `${cls.subject} · ` : ""}
                  {whenLabel(cls.startsAt)} · {cls.durationMin} min
                  {cls.roomCode ? ` · ${cls.roomCode}` : ""}
                </p>
              </div>
              {cls.live ? (
                <span className="rounded-md bg-learn/10 px-2 py-1 text-xs font-medium text-learn">Live</span>
              ) : null}
            </div>
            {cls.notes ? <p className="text-sm text-muted-foreground">{cls.notes}</p> : null}
            <div className="flex flex-wrap gap-2">
              {cls.live && cls.roomCode ? (
                <Button size="sm" onClick={() => void navigate({ to: "/class/$code", params: { code: cls.roomCode } })}>
                  Open live
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void goLive({
                      title: cls.title,
                      subject: cls.subject,
                      durationMin: cls.durationMin,
                      timeoutSec: cls.timeoutSec,
                      classId: cls.id,
                    })
                  }
                >
                  Host this class
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  updateCoaching((c) => ({ ...c, classes: c.classes.filter((x) => x.id !== cls.id) }));
                  toast.success("Class removed");
                }}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-8">
        <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Schedule live class
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule live class</DialogTitle>
            <DialogDescription>Shown in Coaching. Host it when you go live.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="lc-title">Title</Label>
              <Input id="lc-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lc-subject">Subject</Label>
              <Input id="lc-subject" className="mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lc-when">Starts</Label>
              <Input id="lc-when" className="mt-2" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lc-mins">Duration (min)</Label>
              <Input id="lc-mins" className="mt-2" type="number" min={1} value={mins} onChange={(e) => setMins(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lc-to">1:1 timeout (sec)</Label>
              <Input id="lc-to" className="mt-2" type="number" min={15} max={300} value={timeoutSec} onChange={(e) => setTimeoutSec(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lc-notes">Notes</Label>
              <Textarea id="lc-notes" className="mt-2 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button onClick={add}>Save class</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={hostOpen} onOpenChange={setHostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Host a class</DialogTitle>
            <DialogDescription>
              Camera turns on and a join code is created. Students connect with that code. Hands open a timed one-to-one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="hc-title">Title</Label>
              <Input id="hc-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="hc-subject">Subject</Label>
              <Input id="hc-subject" className="mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="hc-mins">Duration (min)</Label>
              <Input id="hc-mins" className="mt-2" type="number" min={1} value={mins} onChange={(e) => setMins(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="hc-to">Hand-raise timeout (sec)</Label>
              <Input id="hc-to" className="mt-2" type="number" min={15} max={300} value={timeoutSec} onChange={(e) => setTimeoutSec(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["video", "audio"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={cn("rounded-lg border p-3 text-left text-sm", mode === m ? "border-primary bg-primary/10" : "border-border")}
                  onClick={() => setMode(m)}
                >
                  <p className="font-medium">{discModeLabel(m)}</p>
                  <p className="text-xs text-muted-foreground">{m === "video" ? "Camera on for the teacher." : "Voice only."}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Chat and hand-raise stay on. 1:1 audio or a live question uses the timeout above.</p>
            <Button disabled={busy} onClick={() => void goLive()}>
              Go live
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join as student</DialogTitle>
            <DialogDescription>Enter the code the teacher shared. Anyone with the code can connect.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="jc-code">Class code</Label>
              <Input
                id="jc-code"
                className="mt-2 font-mono tracking-widest uppercase"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
            </div>
            <Button onClick={joinWithCode}>Join class</Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}

function RecordedClasses() {
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [mins, setMins] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<NoteFileMeta | null>(null);
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState<NoteFileMeta | null>(null);
  const allow = coaching?.customization.allowRecordings !== false;

  async function onFile(list: FileList | null) {
    const picked = list?.[0];
    if (!picked) return;
    setBusy(true);
    try {
      setFile(await persistBrowserFile(picked));
    } catch {
      toast.error("Could not attach this file");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function add() {
    const name = title.trim() || file?.name;
    if (!name) {
      toast.error("Give the recording a title");
      return;
    }
    updateCoaching((c) => ({
      ...c,
      recordings: [
        {
          id: uid(),
          title: name,
          subject: subject.trim(),
          durationMin: Math.max(0, Number(mins) || 0),
          file,
          notes: notes.trim(),
          createdAt: Date.now(),
        },
        ...c.recordings,
      ],
    }));
    setOpen(false);
    setTitle("");
    setSubject("");
    setMins("");
    setNotes("");
    setFile(null);
    toast.success("Recording added");
  }

  return (
    <StudyShell title="Recorded classes">
      <Back />
      {!allow ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">Recordings are turned off in Customization.</p>
      ) : null}
      <ul className="grid gap-3 p-4">
        {(coaching?.recordings ?? []).length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-muted-foreground">No recordings yet.</p>
        ) : null}
        {(coaching?.recordings ?? []).map((rec) => (
          <li key={rec.id} className="surface-3d grid gap-3 p-4">
            <div>
              <p className="font-semibold tracking-tight">{rec.title}</p>
              <p className="text-xs text-muted-foreground">
                {rec.subject ? `${rec.subject} · ` : ""}
                {rec.durationMin ? `${rec.durationMin} min` : "Recording"}
              </p>
            </div>
            {rec.notes ? <p className="text-sm text-muted-foreground">{rec.notes}</p> : null}
            <div className="flex flex-wrap gap-2">
              {rec.file ? (
                <Button size="sm" onClick={() => setViewer(rec.file)}>
                  Open recording
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateCoaching((c) => ({ ...c, recordings: c.recordings.filter((x) => x.id !== rec.id) }))}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-8">
        <Button className="w-full" disabled={!allow} onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add recording
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add recorded class</DialogTitle>
            <DialogDescription>Attach a video or audio file from this device.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="rc-title">Title</Label>
              <Input id="rc-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rc-subject">Subject</Label>
              <Input id="rc-subject" className="mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rc-mins">Length (min)</Label>
              <Input id="rc-mins" className="mt-2" type="number" min={0} value={mins} onChange={(e) => setMins(e.target.value)} />
            </div>
            <input ref={fileRef} type="file" accept="video/*,audio/*" className="sr-only" onChange={(e) => void onFile(e.target.files)} />
            <Button type="button" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
              {file ? file.name : busy ? "Attaching…" : "Attach video or audio"}
            </Button>
            <div>
              <Label htmlFor="rc-notes">Notes</Label>
              <Textarea id="rc-notes" className="mt-2 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button onClick={add} disabled={busy}>
              Save recording
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {viewer ? <NoteFileViewer files={[viewer]} open onOpenChange={(v) => !v && setViewer(null)} /> : null}
    </StudyShell>
  );
}

function LiveMeetings() {
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [withWhom, setWithWhom] = useState("");
  const [when, setWhen] = useState(toLocalInput(Date.now() + 30 * 60 * 1000));
  const [notes, setNotes] = useState("");

  function add() {
    const name = title.trim();
    if (!name) {
      toast.error("Give the meeting a title");
      return;
    }
    updateCoaching((c) => ({
      ...c,
      meetings: [
        {
          id: uid(),
          title: name,
          withWhom: withWhom.trim(),
          at: fromLocalInput(when),
          notes: notes.trim(),
          live: false,
          createdAt: Date.now(),
        },
        ...c.meetings,
      ],
    }));
    setOpen(false);
    setTitle("");
    setWithWhom("");
    setNotes("");
    toast.success("Meeting added");
  }

  return (
    <StudyShell title="Live meetings">
      <Back />
      <ul className="grid gap-3 p-4">
        {(coaching?.meetings ?? []).length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-muted-foreground">No meetings yet.</p>
        ) : null}
        {(coaching?.meetings ?? []).map((m) => (
          <li key={m.id} className="surface-3d grid gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold tracking-tight">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  {m.withWhom ? `With ${m.withWhom} · ` : ""}
                  {whenLabel(m.at)}
                </p>
              </div>
              {m.live ? (
                <span className="rounded-md bg-learn/10 px-2 py-1 text-xs font-medium text-learn">In meeting</span>
              ) : null}
            </div>
            {m.notes ? <p className="text-sm text-muted-foreground">{m.notes}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={m.live ? "secondary" : "default"}
                onClick={() =>
                  updateCoaching((c) => ({
                    ...c,
                    meetings: c.meetings.map((x) => (x.id === m.id ? { ...x, live: !x.live } : x)),
                  }))
                }
              >
                {m.live ? "Leave meeting" : "Join meeting"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateCoaching((c) => ({ ...c, meetings: c.meetings.filter((x) => x.id !== m.id) }))}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-8">
        <Button className="w-full" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Schedule meeting
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Live meeting</DialogTitle>
            <DialogDescription>For teacher or batch meetings. Join when it starts.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="mt-title">Title</Label>
              <Input id="mt-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="mt-with">With</Label>
              <Input id="mt-with" className="mt-2" value={withWhom} onChange={(e) => setWithWhom(e.target.value)} placeholder="Teacher / batch" />
            </div>
            <div>
              <Label htmlFor="mt-when">When</Label>
              <Input id="mt-when" className="mt-2" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="mt-notes">Agenda</Label>
              <Textarea id="mt-notes" className="mt-2 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button onClick={add}>Save meeting</Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}

function CoursesView() {
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [lessons, setLessons] = useState("Lesson 1\nLesson 2\nLesson 3");
  const [lessonDraft, setLessonDraft] = useState<Record<string, string>>({});

  function add() {
    const name = title.trim();
    if (!name) {
      toast.error("Give the course a title");
      return;
    }
    const items = lessons
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ id: uid(), title: line, done: false }));
    updateCoaching((c) => ({
      ...c,
      courses: [{ id: uid(), title: name, subject: subject.trim(), lessons: items, createdAt: Date.now() }, ...c.courses],
    }));
    setOpen(false);
    setTitle("");
    setSubject("");
    toast.success("Course added");
  }

  function addLesson(course: CoachingCourse) {
    const name = (lessonDraft[course.id] ?? "").trim();
    if (!name) return;
    updateCoaching((c) => ({
      ...c,
      courses: c.courses.map((x) =>
        x.id === course.id ? { ...x, lessons: [...x.lessons, { id: uid(), title: name, done: false }] } : x,
      ),
    }));
    setLessonDraft((d) => ({ ...d, [course.id]: "" }));
  }

  return (
    <StudyShell title="Courses">
      <Back />
      <ul className="grid gap-3 p-4">
        {(coaching?.courses ?? []).length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-muted-foreground">No courses yet.</p>
        ) : null}
        {(coaching?.courses ?? []).map((course) => {
          const done = course.lessons.filter((l) => l.done).length;
          return (
            <li key={course.id} className="surface-3d grid gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold tracking-tight">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.subject ? `${course.subject} · ` : ""}
                    {done}/{course.lessons.length} lessons
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCoaching((c) => ({ ...c, courses: c.courses.filter((x) => x.id !== course.id) }))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <ul className="grid gap-2">
                {course.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex min-h-11 items-center gap-3">
                    <Switch
                      checked={lesson.done}
                      onCheckedChange={(v) =>
                        updateCoaching((c) => ({
                          ...c,
                          courses: c.courses.map((x) =>
                            x.id === course.id
                              ? { ...x, lessons: x.lessons.map((l) => (l.id === lesson.id ? { ...l, done: v } : l)) }
                              : x,
                          ),
                        }))
                      }
                    />
                    <span className={lesson.done ? "text-sm text-muted-foreground line-through" : "text-sm"}>{lesson.title}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  value={lessonDraft[course.id] ?? ""}
                  onChange={(e) => setLessonDraft((d) => ({ ...d, [course.id]: e.target.value }))}
                  placeholder="Add a lesson"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addLesson(course);
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addLesson(course)}>
                  Add
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="px-4 pb-8">
        <Button className="w-full" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New course
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New course</DialogTitle>
            <DialogDescription>One lesson per line. Tick them off as you finish.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="co-title">Title</Label>
              <Input id="co-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="co-subject">Subject</Label>
              <Input id="co-subject" className="mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="co-lessons">Lessons</Label>
              <Textarea id="co-lessons" className="mt-2" value={lessons} onChange={(e) => setLessons(e.target.value)} />
            </div>
            <Button onClick={add}>Save course</Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}

function DiscussionsView() {
  const navigate = useNavigate();
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [first, setFirst] = useState("");
  const [mode, setMode] = useState<DiscMode>("video");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const allow = coaching?.customization.allowDiscussions !== false;

  async function add() {
    const name = title.trim();
    if (!name) {
      toast.error("Give the topic a title");
      return;
    }
    const promptText = prompt.trim() || first.trim();
    if (!promptText) {
      toast.error("Define the topic prompt");
      return;
    }
    setBusy(true);
    const posts = first.trim()
      ? [{ id: uid(), author: "You", body: first.trim(), at: Date.now() }]
      : [{ id: uid(), author: "You", body: promptText, at: Date.now() }];
    let roomCode = "";
    try {
      const room = await createDiscussion({
        data: {
          hostId: quizPlayerId(),
          hostName: rememberedQuizName() || "You",
          title: name,
          prompt: promptText,
          mode,
        },
      });
      roomCode = room.code;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open a live room");
    }
    updateCoaching((c) => ({
      ...c,
      discussions: [
        { id: uid(), title: name, prompt: promptText, mode, roomCode, posts, createdAt: Date.now() },
        ...c.discussions,
      ],
    }));
    setOpen(false);
    setTitle("");
    setPrompt("");
    setFirst("");
    setBusy(false);
    toast.success(roomCode ? `Topic opened · ${roomCode}` : "Topic saved");
    if (roomCode) void navigate({ to: "/discuss/$code", params: { code: roomCode } });
  }

  async function openRoom(topic: CoachingDiscussion) {
    if (topic.roomCode) {
      void navigate({ to: "/discuss/$code", params: { code: topic.roomCode } });
      return;
    }
    setBusy(true);
    try {
      const room = await createDiscussion({
        data: {
          hostId: quizPlayerId(),
          hostName: rememberedQuizName() || "You",
          title: topic.title,
          prompt: topic.prompt || topic.title,
          mode: asDiscMode(topic.mode),
        },
      });
      updateCoaching((c) => ({
        ...c,
        discussions: c.discussions.map((d) => (d.id === topic.id ? { ...d, roomCode: room.code, prompt: d.prompt || topic.title, mode: asDiscMode(d.mode) } : d)),
      }));
      void navigate({ to: "/discuss/$code", params: { code: room.code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open a live room");
    } finally {
      setBusy(false);
    }
  }

  function post(topic: CoachingDiscussion) {
    const body = (drafts[topic.id] ?? "").trim();
    if (!body) return;
    updateCoaching((c) => ({
      ...c,
      discussions: c.discussions.map((d) =>
        d.id === topic.id ? { ...d, posts: [...d.posts, { id: uid(), author: "You", body, at: Date.now() }] } : d,
      ),
    }));
    setDrafts((d) => ({ ...d, [topic.id]: "" }));
  }

  const modeIcon = { video: Video, audio: Phone, chat: MessageCircle, hand: Hand };

  return (
    <StudyShell title="Group discussions">
      <Back />
      {!allow ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">Discussions are turned off in Customization.</p>
      ) : null}
      <div className="grid gap-3 px-4 pt-4">
        <p className="text-sm text-muted-foreground">
          Define a topic, pick how people connect, then join. Up to {MAX_DISC_PLAYERS} names. The live room starts only after everyone has tapped Connect.
        </p>
        <div className="flex gap-2">
          <Input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Room code"
            className="font-mono tracking-widest"
            aria-label="Join with room code"
          />
          <Button
            type="button"
            variant="outline"
            disabled={!joinCode.trim()}
            onClick={() => void navigate({ to: "/discuss/$code", params: { code: joinCode.trim() } })}
          >
            Join
          </Button>
        </div>
      </div>
      <ul className="grid gap-3 p-4">
        {(coaching?.discussions ?? []).length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-muted-foreground">No topics yet.</p>
        ) : null}
        {(coaching?.discussions ?? []).map((topic) => {
          const ModeIcon = modeIcon[asDiscMode(topic.mode)];
          return (
            <li key={topic.id} className="surface-3d grid gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight">{topic.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <ModeIcon className="size-3.5" />
                    {discModeLabel(asDiscMode(topic.mode))}
                    {topic.roomCode ? ` · ${topic.roomCode}` : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCoaching((c) => ({ ...c, discussions: c.discussions.filter((x) => x.id !== topic.id) }))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {topic.prompt ? <p className="text-sm">{topic.prompt}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button type="button" disabled={!allow || busy} onClick={() => void openRoom(topic)}>
                  {topic.roomCode ? "Open room" : "Connect"}
                </Button>
                {topic.roomCode ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      void navigator.clipboard.writeText(topic.roomCode).then(
                        () => toast.success("Code copied"),
                        () => toast.message(topic.roomCode),
                      );
                    }}
                  >
                    <Copy className="size-4" />
                    Copy code
                  </Button>
                ) : null}
              </div>
              <ul className="grid gap-2">
                {topic.posts.map((p) => (
                  <li key={p.id} className="rounded-lg bg-muted px-3 py-2">
                    <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {p.author} · {whenLabel(p.at)}
                    </p>
                    <p className="text-sm">{p.body}</p>
                  </li>
                ))}
              </ul>
              {allow ? (
                <div className="flex gap-2">
                  <Input
                    value={drafts[topic.id] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [topic.id]: e.target.value }))}
                    placeholder="Write a reply"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") post(topic);
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => post(topic)}>
                    Post
                  </Button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="px-4 pb-8">
        <Button className="w-full" disabled={!allow} onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New topic
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New discussion</DialogTitle>
            <DialogDescription>Define the topic, then pick how the group connects. Max {MAX_DISC_PLAYERS}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="gd-title">Topic</Label>
              <Input id="gd-title" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gd-prompt">Prompt</Label>
              <Textarea
                id="gd-prompt"
                className="mt-2 min-h-24"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="The question everyone will discuss"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Connect with</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {DISC_MODES.map((id) => {
                  const Icon = modeIcon[id];
                  const on = mode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={cn(
                        "flex min-h-16 flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left text-sm",
                        on ? "border-primary bg-primary/10" : "border-border bg-card",
                      )}
                      onClick={() => setMode(id)}
                      aria-pressed={on}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Icon className="size-4" />
                        {discModeLabel(id)}
                      </span>
                      <span className="text-xs text-muted-foreground">{discModeHint(id)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="gd-first">First post</Label>
              <Textarea id="gd-first" className="mt-2 min-h-20" value={first} onChange={(e) => setFirst(e.target.value)} />
            </div>
            <Button onClick={() => void add()} disabled={busy}>
              {busy ? "Opening…" : "Open topic"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}

function CustomizeView() {
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const custom = coaching?.customization;

  function patch(next: Partial<typeof custom>) {
    updateCoaching((c) => ({ ...c, customization: { ...c.customization, ...next } }));
  }

  return (
    <StudyShell title="Customization">
      <Back />
      <div className="grid gap-0 pb-8">
        <p className="px-4 py-3 text-sm text-muted-foreground">
          These settings apply across live classes, recordings, and discussions.
        </p>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="cu-inst">Institute / coaching</Label>
          <Input
            id="cu-inst"
            className="mt-2"
            value={custom?.institute ?? ""}
            onChange={(e) => patch({ institute: e.target.value })}
          />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="cu-batch">Batch</Label>
          <Input id="cu-batch" className="mt-2" value={custom?.batch ?? ""} onChange={(e) => patch({ batch: e.target.value })} />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="cu-sched">Weekly schedule</Label>
          <Textarea
            id="cu-sched"
            className="mt-2 min-h-24"
            value={custom?.schedule ?? ""}
            onChange={(e) => patch({ schedule: e.target.value })}
            placeholder="Mon–Fri 6–8 pm"
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm">Instruction language</p>
            <p className="text-xs text-muted-foreground">Used for class notes and discussions</p>
          </div>
          <select
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm"
            value={custom?.language ?? "en"}
            onChange={(e) => patch({ language: e.target.value })}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm">Group discussions</p>
            <p className="text-xs text-muted-foreground">Allow topics and replies</p>
          </div>
          <Switch checked={custom?.allowDiscussions !== false} onCheckedChange={(v) => patch({ allowDiscussions: v })} />
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm">Recorded classes</p>
            <p className="text-xs text-muted-foreground">Allow adding video and audio</p>
          </div>
          <Switch checked={custom?.allowRecordings !== false} onCheckedChange={(v) => patch({ allowRecordings: v })} />
        </div>
      </div>
    </StudyShell>
  );
}

function TeacherView() {
  const coaching = useExamStore((s) => s.coaching);
  const updateCoaching = useExamStore((s) => s.updateCoaching);
  const teacher = coaching?.teacher;
  const messages = coaching?.teacherMessages ?? [];
  const [note, setNote] = useState("");

  function patch(next: Partial<NonNullable<typeof teacher>>) {
    updateCoaching((c) => ({ ...c, teacher: { ...c.teacher, ...next } }));
  }

  function send() {
    const body = note.trim();
    if (!body) return;
    updateCoaching((c) => ({
      ...c,
      teacherMessages: [{ id: uid(), body, at: Date.now() }, ...c.teacherMessages].slice(0, 80),
    }));
    setNote("");
    toast.success("Note saved for your teacher");
  }

  const tel = teacher?.phone.replace(/\s+/g, "");
  const mail = teacher?.email.trim();

  return (
    <StudyShell title="Teacher contact">
      <Back />
      <div className="grid gap-0 pb-8">
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="tc-name">Teacher name</Label>
          <Input id="tc-name" className="mt-2" value={teacher?.name ?? ""} onChange={(e) => patch({ name: e.target.value })} />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="tc-subject">Subject</Label>
          <Input id="tc-subject" className="mt-2" value={teacher?.subject ?? ""} onChange={(e) => patch({ subject: e.target.value })} />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="tc-phone">Phone</Label>
          <Input id="tc-phone" className="mt-2" inputMode="tel" value={teacher?.phone ?? ""} onChange={(e) => patch({ phone: e.target.value })} />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="tc-email">Email</Label>
          <Input id="tc-email" className="mt-2" type="email" value={teacher?.email ?? ""} onChange={(e) => patch({ email: e.target.value })} />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="tc-hours">Hours</Label>
          <Input id="tc-hours" className="mt-2" value={teacher?.hours ?? ""} onChange={(e) => patch({ hours: e.target.value })} placeholder="Weekdays 5–7 pm" />
        </div>
        <div className="border-b border-border bg-card px-4 py-3">
          <Label htmlFor="tc-note">Notes</Label>
          <Textarea id="tc-note" className="mt-2 min-h-24" value={teacher?.note ?? ""} onChange={(e) => patch({ note: e.target.value })} />
        </div>
        <div className="flex flex-wrap gap-2 border-b border-border bg-card px-4 py-3">
          {tel ? (
            <Button size="sm" asChild>
              <a href={`tel:${tel}`}>Call</a>
            </Button>
          ) : null}
          {mail ? (
            <Button size="sm" variant="outline" asChild>
              <a href={`mailto:${mail}`}>Email</a>
            </Button>
          ) : null}
        </div>
        <div className="px-4 py-4">
          <Label htmlFor="tc-msg">Send a note</Label>
          <Textarea id="tc-msg" className="mt-2 min-h-24" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Question or reminder for your teacher" />
          <Button className="mt-3" onClick={send}>
            Save note
          </Button>
          <ul className="mt-4 grid gap-2">
            {messages.map((m) => (
              <li key={m.id} className="surface-3d px-4 py-3">
                <p className="text-xs text-muted-foreground">{whenLabel(m.at)}</p>
                <p className="text-sm">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudyShell>
  );
}
