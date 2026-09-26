import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Plus, Radio, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { ExamPathHome } from "@/components/exam-path";
import { LudoGame } from "@/components/ludo-game";
import { RiverMap, type RiverAvatar } from "@/components/river-map";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRiver, joinRiver, listRiver, MAX_RIVER_STUDENTS, pushRiverJourney, pushRiverProgress, type RiverRoom } from "@/lib/exam/river";
import { quizPlayerId, rememberedQuizName, rememberQuizName } from "@/lib/exam/quiz-client";
import { useExamStore } from "@/lib/exam/store";
import { useAdminCopy } from "@/lib/admin/use-copy";
import { sectionLabel } from "@/lib/admin/copy";
import { functionAccess } from "@/lib/admin/controls";
import { useAdminState } from "@/lib/admin/use-copy";
import {
  daysToExam,
  floodIsOpen,
  journeyProgress,
  layoutRiverNodes,
  MAX_RIVER_NODES,
  withAutoFlood,
  type RiverKind,
  type RiverNode,
  type TargetJourney,
} from "@/lib/exam/types";
import { uid } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/use-current-user";

const GAMES = ["home", "pick", "river", "ludo"] as const;
type Game = (typeof GAMES)[number];

export const Route = createFileRoute("/target")({
  validateSearch: (raw: Record<string, unknown>): { game: Game } => ({
    game: GAMES.includes(raw.game as Game) ? (raw.game as Game) : "home",
  }),
  component: TargetExamPage,
});

function toDateInput(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function kindLabel(kind: RiverKind) {
  if (kind === "bridge") return "Bridge · exam test";
  if (kind === "flood") return "Flood · accelerated study";
  return "River encounter · subject";
}

function TargetExamPage() {
  const { game } = Route.useSearch();
  if (game === "river") return <RiverGame />;
  if (game === "ludo") return <LudoGame />;
  if (game === "pick") return <TargetPicker />;
  return <ExamPathHome />;
}

function GameBack() {
  const navigate = useNavigate();
  return (
    <div className="border-b border-border bg-card px-3 py-2">
      <Button type="button" variant="ghost" onClick={() => void navigate({ to: "/target", search: { game: "home" } })}>
        Back
      </Button>
    </div>
  );
}

function TargetPicker() {
  const navigate = useNavigate();
  const prefs = useExamStore((s) => s.prefs);
  const copy = useAdminCopy();
  const admin = useAdminState();
  const name = sectionLabel(copy.target.name, prefs.targetExamName, "Target Exam");

  const games = [
    {
      game: "river" as const,
      title: copy.target.riverTitle,
      hint: copy.target.riverHint,
      image: "/river/sea.png",
      access: functionAccess(admin, "target.river"),
    },
    {
      game: "ludo" as const,
      title: copy.target.ludoTitle,
      hint: copy.target.ludoHint,
      image: "/river/ludo.jpg",
      access: functionAccess(admin, "target.board"),
    },
  ].filter((item) => item.access.reason !== "off");

  return (
    <StudyShell title={name}>
      <div className="mx-auto grid max-w-lg gap-4 p-4 pb-8">
        <ul className="grid gap-4">
          {games.map((item) => (
            <li key={item.game}>
              <button
                type="button"
                className="surface-3d lift flex min-h-36 w-full items-center gap-4 px-4 py-4 text-left"
                onClick={() => {
                  if (item.access.reason === "locked") void navigate({ to: "/subscriptions" });
                  else void navigate({ to: "/target", search: { game: item.game } });
                }}
              >
                <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary">
                  <img src={item.image} alt="" className="size-20 object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-lg font-semibold tracking-tight">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.hint}</span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="outline" onClick={() => void navigate({ to: "/target", search: { game: "home" } })}>
          Back to the path
        </Button>
      </div>
    </StudyShell>
  );
}

function RiverGame() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const prefs = useExamStore((s) => s.prefs);
  const decks = useExamStore((s) => s.decks);
  const journey = useExamStore((s) => s.journey);
  const updateJourney = useExamStore((s) => s.updateJourney);
  const lastSession = useExamStore((s) => s.lastSession);
  const [addKind, setAddKind] = useState<RiverKind | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [deckId, setDeckId] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [room, setRoom] = useState<RiverRoom | null>(null);
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [playerId, setPlayerId] = useState("you");
  const [classOpen, setClassOpen] = useState(false);

  const liveJourney = withAutoFlood(room?.journey ?? journey ?? { examDate: null, floodDays: 14, nodes: [] });
  const canEdit = !room || room.hostId === playerId;
  const me = room?.students.find((s) => s.playerId === playerId);
  const myDone = useMemo(() => {
    if (me) return new Set(me.doneIds);
    return new Set((liveJourney.nodes ?? []).filter((n) => n.done).map((n) => n.id));
  }, [me, liveJourney.nodes]);

  const displayNodes: RiverNode[] = useMemo(
    () => (liveJourney.nodes ?? []).map((n) => ({ ...n, done: myDone.has(n.id) })),
    [liveJourney.nodes, myDone],
  );

  const myProgress = journeyProgress(displayNodes, [...myDone]);
  const selected = displayNodes.find((n) => n.id === selectedId) ?? null;
  const days = daysToExam(liveJourney.examDate);
  const floodOpen = floodIsOpen(liveJourney);

  const avatars: RiverAvatar[] = room
    ? room.students.map((s) => ({
        id: s.playerId,
        name: s.name,
        progress: s.progress,
        self: s.playerId === playerId,
        hue: s.hue,
      }))
    : [
        {
          id: playerId,
          name: studentName.trim() || "You",
          progress: myProgress,
          self: true,
          hue: 0,
        },
      ];

  useEffect(() => {
    setPlayerId(quizPlayerId());
  }, []);

  useEffect(() => {
    const remembered = rememberedQuizName();
    if (remembered) setStudentName(remembered);
    else if (user?.primaryEmail) setStudentName(user.primaryEmail.split("@")[0] || "");
    else if (user?.displayName) setStudentName(user.displayName);
  }, [user]);

  useEffect(() => {
    updateJourney((j) => withAutoFlood(j));
  }, [updateJourney, journey?.examDate, journey?.floodDays]);

  useEffect(() => {
    const last = lastSession;
    if (!last?.deckId) return;
    updateJourney((j) => ({
      ...j,
      nodes: j.nodes.map((n) => (n.kind === "bridge" && n.deckId === last.deckId ? { ...n, done: true } : n)),
    }));
  }, [lastSession?.id, lastSession?.deckId, updateJourney]);

  useEffect(() => {
    if (!room) return;
    let alive = true;
    const refresh = async () => {
      try {
        const next = await listRiver({ data: room.code });
        if (alive) setRoom(next);
      } catch {
        /* room may have expired */
      }
    };
    const t = window.setInterval(() => void refresh(), 2000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, [room?.code]);

  function persist(next: TargetJourney) {
    const laid = { ...next, nodes: layoutRiverNodes(next.nodes) };
    updateJourney(() => laid);
    if (room && room.hostId === playerId) {
      void pushRiverJourney({ data: { code: room.code, hostId: playerId, journey: laid } })
        .then(setRoom)
        .catch((err) => toast.error(err instanceof Error ? err.message : "Could not update the river"));
    }
  }

  function addNode() {
    if (!addKind) return;
    const label = title.trim();
    if (!label) {
      toast.error("Give this encounter a name");
      return;
    }
    if ((liveJourney.nodes?.length ?? 0) >= MAX_RIVER_NODES) {
      toast.error(`This river is full (${MAX_RIVER_NODES} encounters)`);
      return;
    }
    const node: RiverNode = {
      id: uid(),
      kind: addKind,
      title: label,
      t: 0.5,
      done: false,
      deckId: deckId || null,
      notes: notes.trim(),
      createdAt: Date.now(),
    };
    persist({ ...liveJourney, nodes: [...(liveJourney.nodes ?? []), node] });
    setAddKind(null);
    setTitle("");
    setNotes("");
    setDeckId("");
    setSelectedId(node.id);
    toast.success(
      addKind === "bridge" ? "Bridge added" : addKind === "flood" ? "Flood stretch added" : "Subject added to the river",
    );
  }

  async function toggleDone(node: RiverNode) {
    const nextDone = new Set(myDone);
    if (nextDone.has(node.id)) nextDone.delete(node.id);
    else nextDone.add(node.id);
    if (room) {
      try {
        const display = studentName.trim() || "Student";
        rememberQuizName(display);
        const updated = await pushRiverProgress({
          data: { code: room.code, playerId, name: display, doneIds: [...nextDone] },
        });
        setRoom(updated);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update progress");
      }
      return;
    }
    persist({
      ...liveJourney,
      nodes: (liveJourney.nodes ?? []).map((n) => (n.id === node.id ? { ...n, done: !n.done } : n)),
    });
  }

  function removeNode(id: string) {
    persist({ ...liveJourney, nodes: (liveJourney.nodes ?? []).filter((n) => n.id !== id) });
    setSelectedId(null);
  }

  function setExamDate(value: string) {
    persist({ ...liveJourney, examDate: value ? new Date(`${value}T12:00:00`).getTime() : null });
  }

  async function startClass() {
    const display = studentName.trim();
    if (!display) {
      toast.error("Enter your name so classmates can see you");
      return;
    }
    rememberQuizName(display);
    setBusy("create");
    try {
      const snap = withAutoFlood(useExamStore.getState().journey);
      const next = await createRiver({
        data: { title: prefs.targetExamName?.trim() || "Target Exam", hostId: playerId, hostName: display, journey: snap },
      });
      const doneIds = snap.nodes.filter((n) => n.done).map((n) => n.id);
      const synced =
        doneIds.length > 0
          ? await pushRiverProgress({ data: { code: next.code, playerId, name: display, doneIds } })
          : next;
      setRoom(synced);
      toast.success("Class river is live — share the code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the river");
    } finally {
      setBusy(null);
    }
  }

  async function joinClass() {
    const display = studentName.trim();
    if (!display) {
      toast.error("Enter your name so classmates can see you");
      return;
    }
    rememberQuizName(display);
    setBusy("join");
    try {
      const next = await joinRiver({ data: { code: joinCode, playerId, name: display } });
      setRoom(next);
      toast.success("You are on the river");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(null);
    }
  }

  function openAdd(kind: RiverKind) {
    if (!canEdit) {
      toast.message("Only the host can add encounters on a shared river");
      return;
    }
    setAddKind(kind);
    setTitle("");
    setNotes("");
    setDeckId(kind === "bridge" || kind === "flood" ? decks[0]?.id ?? "" : "");
  }

  function startEncounter(node: RiverNode) {
    if (node.deckId) {
      void navigate({ to: "/study/$deckId", params: { deckId: node.deckId }, search: { mode: "study", pick: "due", count: 0, paper: "", quiz: "", session: "" } });
      return;
    }
    if (node.kind === "bridge") {
      void navigate({ to: "/" });
      toast.message("Pick a paper from Tests, or edit this bridge and attach a deck");
      return;
    }
    toast.message("Mark this stretch done after you study");
  }

  return (
    <StudyShell title="River Game Target Achieve">
      <GameBack />
      <div className="mx-auto grid max-w-lg gap-4 p-4 pb-8">
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            {days != null
              ? days < 0
                ? "Exam date has passed"
                : days < 1
                  ? "Exam is today · flood open"
                  : `${Math.ceil(days)} days to the exam${floodOpen ? " · flood open" : ""}`
              : "Set the exam date"}
          </p>
          <Label htmlFor="exam-date" className="sr-only">
            Exam date
          </Label>
          <Input
            id="exam-date"
            type="date"
            value={toDateInput(liveJourney.examDate)}
            onChange={(e) => setExamDate(e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <RiverMap
          nodes={displayNodes}
          avatars={avatars}
          selectedId={selectedId}
          onSelectNode={(id) => setSelectedId(id || null)}
        />

        {selected ? (
          <div className="surface-3d p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kindLabel(selected.kind)}</p>
            <p className="font-display mt-1 text-base font-semibold">{selected.title}</p>
            {selected.notes ? <p className="mt-1 text-sm text-muted-foreground">{selected.notes}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={() => void toggleDone(selected)}>
                {selected.done ? "Mark not done" : "Mark done"}
              </Button>
              {(selected.kind === "bridge" || selected.kind === "flood") && (
                <Button type="button" size="sm" variant="outline" onClick={() => startEncounter(selected)}>
                  {selected.kind === "flood" ? "Start sprint" : "Start test"}
                </Button>
              )}
              {canEdit ? (
                <Button type="button" size="sm" variant="ghost" onClick={() => removeNode(selected.id)}>
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-4 gap-2">
          <Button type="button" variant="secondary" className="h-auto min-h-14 flex-col gap-1 py-2" onClick={() => openAdd("subject")}>
            <img src="/river/subject.png" alt="" className="size-8 object-contain" />
            <span className="text-xs">Add subject</span>
          </Button>
          <Button type="button" variant="secondary" className="h-auto min-h-14 flex-col gap-1 py-2" onClick={() => openAdd("bridge")}>
            <img src="/river/bridge.png" alt="" className="size-8 object-contain" />
            <span className="text-xs">Add test</span>
          </Button>
          <Button type="button" variant="secondary" className="h-auto min-h-14 flex-col gap-1 py-2" onClick={() => openAdd("flood")}>
            <img src="/river/flood.png" alt="" className="size-8 object-contain" />
            <span className="text-xs">Add flood</span>
          </Button>
          <Button type="button" variant="secondary" className="h-auto min-h-14 flex-col gap-1 py-2" onClick={() => setClassOpen(true)}>
            <Users className="size-5" />
            <span className="text-xs">{room ? `${room.students.length}/${MAX_RIVER_STUDENTS}` : "Class"}</span>
          </Button>
        </div>
      </div>

      <Dialog open={classOpen} onOpenChange={setClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class river</DialogTitle>
            <DialogDescription>Up to {MAX_RIVER_STUDENTS} students float together toward the sea.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="river-name">Your name on the river</Label>
              <Input
                id="river-name"
                className="mt-2"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Shown on your avatar"
              />
            </div>
            {room ? (
              <div className="grid gap-3">
                <p className="font-mono text-lg tracking-widest">{room.code}</p>
                <p className="text-sm text-muted-foreground">
                  {room.students.length}/{MAX_RIVER_STUDENTS} on the water
                  {room.hostId === playerId ? " · you are hosting" : ""}.
                </p>
                <ul className="grid gap-2">
                  {room.students.map((s) => (
                    <li key={s.playerId} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium">
                        {s.name}
                        {s.playerId === playerId ? " (you)" : ""}
                      </span>
                      <span className="text-muted-foreground">{Math.round(s.progress * 100)}%</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      void navigator.clipboard?.writeText(room.code);
                      toast.success("Code copied");
                    }}
                  >
                    <Radio className="size-4" />
                    Copy code
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setRoom(null)}>
                    Leave river
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                <Button type="button" onClick={() => void startClass()} disabled={busy === "create"}>
                  {busy === "create" ? "Starting…" : "Start a class river"}
                </Button>
                <Label htmlFor="river-code">Join with a code</Label>
                <Input
                  id="river-code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="font-mono tracking-widest"
                  autoCapitalize="characters"
                />
                <Button type="button" variant="outline" onClick={() => void joinClass()} disabled={busy === "join"}>
                  {busy === "join" ? "Joining…" : "Join class river"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addKind != null} onOpenChange={(open) => !open && setAddKind(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addKind === "bridge" ? "Add a bridge test" : addKind === "flood" ? "Add a flood sprint" : "Add a subject"}
            </DialogTitle>
            <DialogDescription>
              {addKind === "bridge"
                ? "Bridges are exam tests across the river."
                : addKind === "flood"
                  ? "Floods are accelerated study when the exam date is close."
                  : "Subjects appear as encounters along the current."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="encounter-title">Name</Label>
              <Input
                id="encounter-title"
                className="mt-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={addKind === "bridge" ? "Paper 1 mock" : addKind === "flood" ? "Final sprint" : "Rock Mechanics"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNode();
                }}
              />
            </div>
            {(addKind === "bridge" || addKind === "flood") && (
              <div>
                <Label htmlFor="encounter-deck">Test deck</Label>
                <select
                  id="encounter-deck"
                  className="mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                  value={deckId}
                  onChange={(e) => setDeckId(e.target.value)}
                >
                  <option value="">None yet</option>
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="encounter-notes">Notes</Label>
              <Input id="encounter-notes" className="mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
            </div>
            <Button type="button" onClick={addNode}>
              <Plus className="size-4" />
              Add to river
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}
