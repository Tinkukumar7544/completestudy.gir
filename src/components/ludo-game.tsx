import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Dices, MoreVertical, Plus, Radio, RotateCcw, Settings2, SlidersHorizontal, Trash2, Users, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { LudoBoardView } from "@/components/ludo-board";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createLudo, joinLudo, listLudo, MAX_LUDO_STUDENTS, pushLudoBoard, pushLudoColumn, type LudoRoom } from "@/lib/exam/ludo";
import {
  addCustomRule,
  applyActiveColors,
  applyPlayerMode,
  applyRoll,
  canColorRoll,
  cellKey,
  cellNote,
  daysToLudoExam,
  dismissChallenge,
  dismissStudy,
  flashesFromBoards,
  isActiveSeat,
  isBotColumn,
  legalMoves,
  ludoHasStarted,
  ludoIsResting,
  ludoSeatName,
  passTurn,
  patchCustomRule,
  pickBotMove,
  placeArrayBox,
  placeSundayBox,
  playMove,
  removeCustomRule,
  resetMatch,
  rolledToday,
  rollDie,
  setCellNote,
  setChallengeTest,
  tickLudoFromActivity,
  tokenCell,
  whyCantRoll,
  type LudoFlash,
} from "@/lib/exam/ludo-path";
import { quizPlayerId, rememberedQuizName, rememberQuizName } from "@/lib/exam/quiz-client";
import { cueLudoSfx, isLudoMuted, playLudoSfx, setLudoMuted, unlockLudoSfx, type LudoSfx } from "@/lib/exam/ludo-sfx";
import { useExamStore } from "@/lib/exam/store";
import {
  LUDO_COLORS,
  LUDO_HOME_STEPS,
  MAX_LUDO_TOKENS,
  MIN_LUDO_TOKENS,
  makeLudoTokens,
  defaultLudo,
  normalizeLudo,
  type LudoBoard,
  type LudoCellKind,
  type LudoColor,
  type LudoLogo,
  type LudoStudyRules,
  type LudoToken,
} from "@/lib/exam/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LOGOS: LudoLogo[] = ["none", "book", "flask", "scale", "pick"];

function sfxKinds(events: LudoFlash[]): LudoSfx[] {
  const out: LudoSfx[] = [];
  for (const event of events) {
    if (event.kind === "roll") continue;
    if (event.kind === "threeSix") out.push("skip");
    else out.push(event.kind);
  }
  return out;
}

function toDateInput(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromDateInput(value: string, hour = 12): number | null {
  if (!value) return null;
  const hh = String(hour).padStart(2, "0");
  const t = new Date(`${value}T${hh}:00:00`).getTime();
  return Number.isFinite(t) ? t : null;
}

function logoLabel(logo: LudoLogo) {
  if (logo === "book") return "Book";
  if (logo === "flask") return "Flask";
  if (logo === "scale") return "Scale";
  if (logo === "pick") return "Pick";
  return "None";
}

function destCellKey(color: LudoColor, steps: number): string {
  const token = { steps } as LudoToken;
  const cell = tokenCell(color, token, 0, 1);
  return cellKey({ r: Math.round(cell.r), c: Math.round(cell.c) });
}

function parseSundayPick(raw: string, board: LudoBoard): { tokenId: string; color: LudoColor } | null {
  const [color, ...rest] = raw.split(":");
  const tokenId = rest.join(":");
  if (!color || !tokenId) return null;
  if (!LUDO_COLORS.includes(color as LudoColor)) return null;
  const col = board.columns.find((c) => c.color === color);
  if (!col?.tokens.some((t) => t.id === tokenId)) return null;
  return { tokenId, color: color as LudoColor };
}

const RULE_COPY: Array<{ key: "oncePerDay" | "enterOnOneOrSix" | "captureTest" | "skipArray" | "sundayBoxes" | "standardLudo"; title: string; detail: string }> = [
  { key: "oncePerDay", title: "One roll a day", detail: "Each student may complete one Ludo turn per calendar day. The shared die in the centre passes from player to player." },
  { key: "enterOnOneOrSix", title: "Enter on 1 or 6", detail: "A subject leaves the yard only on a 1 or a 6. You may bring a new piece out or advance another piece, as in Ludo." },
  { key: "captureTest", title: "Capture test", detail: "If you send another student's subject home, they must pass a test you set. The passing score is set in these rules." },
  { key: "skipArray", title: "Array skip", detail: "Landing on an array box skips the subject ahead. The skipped study day becomes a rest day." },
  { key: "sundayBoxes", title: "Sunday boxes", detail: "Each stump can place its Sunday rest on a separate board square from Manage." },
  { key: "standardLudo", title: "Standard Ludo", detail: "Classic extras still apply in study mode: extra roll on 6, on a capture, and on reaching home. Three sixes in a row forfeit the turn." },
];

function GameBack() {
  const navigate = useNavigate();
  return (
    <div className="border-b border-border bg-card px-3 py-2">
      <Button type="button" variant="ghost" onClick={() => void navigate({ to: "/target", search: { game: "pick" } })}>
        Back
      </Button>
    </div>
  );
}

export function LudoGame() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const prefs = useExamStore((s) => s.prefs);
  const decks = useExamStore((s) => s.decks);
  const notes = useExamStore((s) => s.notes);
  const lastSession = useExamStore((s) => s.lastSession);
  const stored = useExamStore((s) => s.ludo);
  const updateLudo = useExamStore((s) => s.updateLudo);
  const [selected, setSelected] = useState<{ token: LudoToken; color: LudoColor } | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [manageTab, setManageTab] = useState<"pieces" | "rules">("pieces");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [room, setRoom] = useState<LudoRoom | null>(null);
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [playerId, setPlayerId] = useState("you");
  const [manageColor, setManageColor] = useState<LudoColor>("red");
  const [rolling, setRolling] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editKind, setEditKind] = useState<LudoCellKind>("note");
  const [editSkip, setEditSkip] = useState(4);
  const [editSundayToken, setEditSundayToken] = useState("");
  const [placeMode, setPlaceMode] = useState<null | { kind: "sunday"; tokenId: string; color: LudoColor } | { kind: "array" }>(null);
  const [challengeDeck, setChallengeDeck] = useState("");
  const [challengeScore, setChallengeScore] = useState(50);
  const [flashQueue, setFlashQueue] = useState<LudoFlash[]>([]);
  const [sfxOn, setSfxOn] = useState(() => !isLudoMuted());
  const introFlash = useRef(false);
  const roomRef = useRef(room);
  roomRef.current = room;

  const board = normalizeLudo(room?.board ?? stored ?? defaultLudo());
  const canEdit = !room || room.hostId === playerId;
  const myColor = room?.students.find((s) => s.playerId === playerId)?.color ?? board.playerColor;
  const days = daysToLudoExam(board.examDate);
  const resting = ludoIsResting(board);
  const started = ludoHasStarted(board);
  const humanTurn = !isBotColumn(board, board.turnColor, myColor);
  const canRoll = canColorRoll(board, board.turnColor) && humanTurn && !rolling && !placeMode;
  const dayLocked =
    board.rules.oncePerDay &&
    board.phase === "roll" &&
    board.extraTurns === 0 &&
    !isBotColumn(board, board.turnColor, myColor) &&
    rolledToday(board, board.turnColor);
  const moves = board.phase === "move" ? legalMoves(board, board.turnColor, board.lastPips) : [];
  const legalTokenIds = useMemo(() => new Set(moves.map((m) => m.tokenId)), [moves]);
  const legalCellKeys = useMemo(
    () => new Set(moves.map((m) => destCellKey(board.turnColor, m.toSteps))),
    [moves, board.turnColor],
  );
  const study = board.phase === "study" && board.pendingCell ? cellNote(board, board.pendingCell) : null;
  const challenge = board.challenge;
  const settingTest = challenge?.status === "pending-set" && challenge.capturerColor === myColor;
  const takingTest = challenge?.status === "pending-take" && challenge.capturedColor === myColor;
  const flash = flashQueue[0] ?? null;
  const holdBots = Boolean(flash && (flash.kind === "turn" || flash.kind === "extra" || flash.kind === "skip" || flash.kind === "threeSix"));

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
    const current = useExamStore.getState().ludo ?? defaultLudo();
    const result = tickLudoFromActivity(current, lastSession, notes);
    if (result.moved || result.board !== current) {
      if (result.board === current) return;
      updateLudo(() => result.board);
      if (result.moved) {
        if (result.reason === "test") toast.success("Test complete — bonus roll");
        if (result.reason === "note") toast.success("Notes reviewed — bonus roll");
        if (result.reason === "challenge") {
          if (!result.board.challenge) toast.success("Capture test passed — subject stays in the yard until a 1 or 6");
          else toast.message("Score was below the pass mark — retake the capture test");
        }
        const r = roomRef.current;
        if (r) {
          const display = studentName.trim() || "Student";
          if (r.hostId === playerId) {
            void pushLudoBoard({ data: { code: r.code, hostId: playerId, board: result.board } }).then(setRoom).catch(() => undefined);
          } else {
            void pushLudoColumn({ data: { code: r.code, playerId, name: display, board: result.board } }).then(setRoom).catch(() => undefined);
          }
        }
      }
    }
  }, [lastSession?.id, notes, updateLudo, playerId, studentName]);

  useEffect(() => {
    if (!room) return;
    let alive = true;
    const refresh = async () => {
      try {
        const next = await listLudo({ data: room.code });
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

  function persist(next: LudoBoard, flashes?: LudoFlash[] | "none") {
    const events = flashes === "none" ? [] : flashes ?? flashesFromBoards(board, next);
    const clean = normalizeLudo(next);
    if (events.length) setFlashQueue(events);
    const rolled = board.phase === "roll" && next.lastPips !== board.lastPips;
    const moved = board.phase === "move" && (next.phase !== "move" || Boolean(next.challenge && next.challenge.id !== board.challenge?.id));
    cueLudoSfx(sfxKinds(events), rolled, moved);
    updateLudo(() => clean);
    if (room) {
      if (room.hostId === playerId) {
        void pushLudoBoard({ data: { code: room.code, hostId: playerId, board: clean } })
          .then(setRoom)
          .catch((err) => toast.error(err instanceof Error ? err.message : "Could not update the board"));
      } else {
        void pushLudoColumn({
          data: { code: room.code, playerId, name: studentName.trim() || "Student", board: clean },
        })
          .then(setRoom)
          .catch((err) => toast.error(err instanceof Error ? err.message : "Could not update your column"));
      }
    }
  }

  function patchBoard(fn: (b: LudoBoard) => LudoBoard) {
    persist(fn(board));
  }

  useEffect(() => {
    if (!flash || flash.kind === "win") return;
    const ms = flash.kind === "turn" ? 1400 : flash.kind === "roll" ? 1100 : 1500;
    const t = window.setTimeout(() => setFlashQueue((q) => q.slice(1)), ms);
    return () => window.clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    if (introFlash.current) return;
    if (!started || resting || board.phase === "won") return;
    introFlash.current = true;
    if (board.phase === "roll") setFlashQueue([{ kind: "turn", actor: board.turnColor }]);
  }, [started, resting, board.phase, board.turnColor]);

  useEffect(() => {
    if (!challenge) return;
    setChallengeScore(challenge.passingScore);
    setChallengeDeck(challenge.deckId ?? "");
  }, [challenge?.id, challenge?.status, challenge?.deckId, challenge?.passingScore]);

  useEffect(() => {
    if (!board.bots) return;
    if (board.phase === "won" || rolling) return;
    if (!started || resting) return;
    if (holdBots) return;
    if (board.phase === "challenge") {
      if (challenge?.status === "pending-set" && isBotColumn(board, challenge.capturerColor, myColor)) {
        const t = window.setTimeout(() => {
          persist(setChallengeTest(board, challenge.deckId, board.rules.passingScore));
        }, 400);
        return () => window.clearTimeout(t);
      }
      return;
    }
    if (!isBotColumn(board, board.turnColor, myColor)) return;
    if (board.phase === "roll" && !canColorRoll(board, board.turnColor)) return;
    const delay = board.phase === "roll" ? 700 : board.phase === "study" ? 400 : 550;
    const t = window.setTimeout(() => {
      if (board.phase === "roll") {
        persist(applyRoll(board, rollDie()));
        return;
      }
      if (board.phase === "move") {
        const pick = pickBotMove(board, board.turnColor, board.lastPips);
        if (pick) persist(playMove(board, board.turnColor, pick.tokenId, board.lastPips));
        else persist(passTurn(board));
        return;
      }
      if (board.phase === "study") persist(dismissStudy(board));
    }, delay);
    return () => window.clearTimeout(t);
  }, [board.phase, board.turnColor, board.lastMoveAt, board.bots, board.lastPips, myColor, rolling, started, resting, holdBots]);

  function roll() {
    if (rolling) return;
    unlockLudoSfx();
    if (placeMode) {
      toast.message("Tap a path square to place the box, or cancel");
      return;
    }
    if (board.phase === "move" && humanTurn) {
      const pick = pickBotMove(board, board.turnColor, board.lastPips);
      if (pick) persist(playMove(board, board.turnColor, pick.tokenId, board.lastPips));
      else persist(passTurn(board));
      return;
    }
    const blocked = whyCantRoll(board, board.turnColor);
    if (blocked || !canColorRoll(board, board.turnColor)) {
      toast.message(blocked ?? "The die is waiting");
      return;
    }
    setRolling(true);
    playLudoSfx("dice");
    window.setTimeout(() => {
      try {
        const next = applyRoll(board, rollDie());
        persist(next);
      } finally {
        setRolling(false);
      }
    }, 520);
  }

  function tryMove(token: LudoToken, color: LudoColor) {
    if (board.phase === "move" && color === board.turnColor && legalTokenIds.has(token.id) && humanTurn) {
      persist(playMove(board, color, token.id, board.lastPips));
      setSelected({ token, color });
      return;
    }
    setSelected({ token, color });
  }

  function onCell(key: string, _r: number, _c: number) {
    if (placeMode) {
      if (placeMode.kind === "sunday") {
        persist(placeSundayBox(board, placeMode.color, placeMode.tokenId, key));
        toast.success("Sunday box placed on the board");
      } else {
        persist(placeArrayBox(board, key));
        toast.success("Array skip placed — landing here jumps ahead");
      }
      setPlaceMode(null);
      return;
    }
    if (board.phase === "move" && humanTurn && legalCellKeys.has(key)) {
      const match = moves.filter((m) => destCellKey(board.turnColor, m.toSteps) === key);
      const chosen =
        selected && match.find((m) => m.tokenId === selected.token.id)
          ? match.find((m) => m.tokenId === selected.token.id)
          : match[0];
      if (chosen) {
        persist(playMove(board, board.turnColor, chosen.tokenId, board.lastPips));
        return;
      }
    }
    const note = board.cells[key];
    setEditKey(key);
    setEditLabel(note?.label ?? "");
    setEditContent(note?.content ?? "");
    setEditKind(note?.kind ?? "note");
    setEditSkip(note?.skip || board.rules.skipSteps);
    setEditSundayToken(note?.sundayTokenId ?? "");
  }

  function saveCell() {
    if (!editKey) return;
    const sunday = editKind === "sunday" ? parseSundayPick(editSundayToken, board) : null;
    persist(
      setCellNote(board, editKey, {
        label: editLabel,
        content: editContent,
        kind: editKind,
        skip: editKind === "array" ? editSkip : 0,
        sundayTokenId: sunday?.tokenId ?? null,
        sundayColor: sunday?.color ?? null,
      }),
    );
    setEditKey(null);
    toast.success(editKind === "array" ? "Array box saved" : editKind === "sunday" ? "Sunday box saved" : "Notebook box saved");
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
      const snap = useExamStore.getState().ludo;
      const next = await createLudo({
        data: { title: prefs.targetExamName?.trim() || "Target Exam", hostId: playerId, hostName: display, board: snap },
      });
      setRoom(next);
      toast.success("Class board is live — share the code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the board");
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
      const next = await joinLudo({ data: { code: joinCode, playerId, name: display } });
      setRoom(next);
      toast.success("You joined the board");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(null);
    }
  }

  const selectedCol = selected ? board.columns.find((c) => c.color === selected.color) : null;

  const status = useMemo(() => {
    if (board.phase === "won" && board.winner) {
      const name = ludoSeatName(board, board.winner, myColor);
      return `${name} reached home — exam target cleared`;
    }
    if (placeMode) {
      return placeMode.kind === "sunday"
        ? "Tap a path square to place this stump's Sunday box"
        : "Tap a path square to place an array skip";
    }
    if (board.phase === "challenge" && challenge) {
      const who = ludoSeatName(board, challenge.capturedColor, myColor);
      const by = ludoSeatName(board, challenge.capturerColor, myColor);
      return `${by} captured ${who} — pass a ${challenge.passingScore}% test`;
    }
    if (takingTest) return `You were captured — pass the test at ${challenge?.passingScore ?? 50}%`;
    if (!started) return "Target has not started yet — pieces stay still";
    if (resting) return "Rest day — pieces stay still";
    if (dayLocked) return "Everyone has played today — the centre die waits until tomorrow";
    if (board.phase === "move") return `Rolled ${board.lastPips} — tap a glowing piece to move`;
    if (board.phase === "study") return "Landed on a notebook box — review then continue";
    const who = ludoSeatName(board, board.turnColor, myColor);
    if (board.rules.oncePerDay && rolledToday(board, board.turnColor)) {
      return `${who} already played today`;
    }
    const extra = board.extraTurns ? ` · ${board.extraTurns} bonus roll${board.extraTurns > 1 ? "s" : ""}` : "";
    if (days != null) {
      if (days < 0) return `${who} to roll${extra}`;
      if (days < 1) return `Exam is today · ${who} to roll${extra}`;
      return `${Math.ceil(days)} days to the exam · ${who} to roll${extra}`;
    }
    return `${who} to roll${extra}`;
  }, [started, resting, days, board, myColor, placeMode, challenge, takingTest, dayLocked]);

  return (
    <StudyShell title="Ludo Game Target Achieve">
      <GameBack />
      <div className="mx-auto grid max-w-lg gap-4 p-4 pb-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold tracking-tight">Ludo Game Target Achieve</h2>
            <p className="mt-1 text-sm text-muted-foreground">{status}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label="Target schedule">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setScheduleOpen(true)}>When the target starts</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setManageColor(myColor);
                  setManageTab("pieces");
                  setManageOpen(true);
                }}
              >
                Open TargetXPED
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setManageColor(myColor);
                  setManageTab("rules");
                  setManageOpen(true);
                }}
              >
                Manage rules
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  persist(applyPlayerMode(board, "two"));
                  toast.success("Two player — only two columns stay on the target");
                }}
              >
                {board.playerMode === "two" ? <Check className="size-4" /> : <Users className="size-4" />}
                Two player
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  persist(applyPlayerMode(board, "four"));
                  toast.success("Four player — all four columns are on the target");
                }}
              >
                {board.playerMode === "four" ? <Check className="size-4" /> : <Users className="size-4" />}
                Four player
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void navigate({ to: "/settings" });
                }}
              >
                {board.playerMode === "custom" ? <Check className="size-4" /> : <Settings2 className="size-4" />}
                Custom seats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => patchBoard((b) => ({ ...b, fastMode: !b.fastMode }))}
              >
                {board.fastMode ? "Turn fast mode off" : "Turn fast mode on"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  const next = !sfxOn;
                  setSfxOn(next);
                  setLudoMuted(!next);
                  unlockLudoSfx();
                  if (next) playLudoSfx("turn");
                }}
              >
                {sfxOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                {sfxOn ? "Sound off" : "Sound on"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  persist(resetMatch(board), [{ kind: "turn", actor: board.playerColor }]);
                  toast.success("Pieces returned to yards");
                }}
              >
                New match
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {placeMode ? (
          <div className="surface-3d flex items-center justify-between gap-3 p-3">
            <p className="text-sm">
              {placeMode.kind === "sunday"
                ? "Tap any path square for this stump's Sunday."
                : "Tap any path square to mark an array skip."}
            </p>
            <Button type="button" size="sm" variant="outline" onClick={() => setPlaceMode(null)}>
              Cancel
            </Button>
          </div>
        ) : null}

        <LudoBoardView
          board={board}
          selectedId={selected?.token.id}
          legalTokenIds={legalTokenIds}
          legalCellKeys={legalCellKeys}
          rolling={rolling}
          canRoll={canRoll || (board.phase === "move" && humanTurn)}
          canEditNames={canEdit}
          myColor={myColor}
          popup={flash}
          onSelectToken={tryMove}
          onSelectCell={onCell}
          onOpenSeat={(color) => {
            setManageColor(color);
            setManageTab("pieces");
            setManageOpen(true);
          }}
          onRename={(color, name) => {
            patchBoard((b) => ({
              ...b,
              columns: b.columns.map((c) => (c.color === color ? { ...c, studentName: name.slice(0, 40) } : c)),
            }));
            if (color === myColor) {
              setStudentName(name);
              rememberQuizName(name);
            }
          }}
          onRoll={roll}
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            className="h-auto min-h-12"
            onClick={roll}
            disabled={rolling || Boolean(placeMode)}
          >
            <Dices className="size-4" />
            {rolling
              ? "Rolling…"
              : canRoll
                ? "Roll die"
                : board.phase === "move" && humanTurn
                  ? `Move ${board.lastPips}`
                  : takingTest
                    ? "Take test"
                    : dayLocked
                      ? "Tomorrow"
                      : "Die"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-12"
            onClick={() => {
              persist(resetMatch(board), [{ kind: "turn", actor: board.playerColor }]);
              toast.success("New match — tap the die");
            }}
          >
            <RotateCcw className="size-4" />
            New match
          </Button>
        </div>

        {selected && selectedCol ? (
          <div className="surface-3d p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {selected.color} · {selected.token.dayName || "subject"}
            </p>
            <p className="font-display mt-1 text-base font-semibold">{selected.token.name || "Unnamed subject"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.token.steps < 0
                ? `In the yard — needs a ${board.rules.enterOnOneOrSix ? "1 or 6" : selectedCol.entryTurn} to start`
                : selected.token.steps >= LUDO_HOME_STEPS
                  ? "Home"
                  : `Step ${selected.token.steps} of ${LUDO_HOME_STEPS}`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.token.deckId ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    void navigate({
                      to: "/study/$deckId",
                      params: { deckId: selected.token.deckId! },
                      search: { mode: "study", pick: "due", count: 0, paper: "", quiz: "", session: "" },
                    })
                  }
                >
                  Start test
                </Button>
              ) : (
                <Button type="button" size="sm" variant="outline" onClick={() => void navigate({ to: "/notes", search: { view: "list", folder: "" } })}>
                  Review notes
                </Button>
              )}
              {canEdit ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setManageColor(selected.color);
                      setManageTab("pieces");
                      setManageOpen(true);
                    }}
                  >
                    Edit in TargetXPED
                  </Button>
                  {board.rules.sundayBoxes ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPlaceMode({ kind: "sunday", tokenId: selected.token.id, color: selected.color });
                        toast.message("Tap a path square for this Sunday box");
                      }}
                    >
                      Place Sunday
                    </Button>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tap any path square to name it, mark an array skip, or place a Sunday. The die in the centre is shared — one column at a time, once a day. Empty seats wait for you.
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-auto min-h-12"
            onClick={() => {
              setManageColor(myColor);
              setManageTab("pieces");
              setManageOpen(true);
            }}
          >
            <SlidersHorizontal className="size-4" />
            TargetXPED
          </Button>
          <Button type="button" variant="secondary" className="h-auto min-h-12" onClick={() => setClassOpen(true)}>
            <Users className="size-4" />
            {room ? `${room.students.length}/${MAX_LUDO_STUDENTS}` : "Class"}
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(study && board.pendingCell)} onOpenChange={(open) => !open && persist(dismissStudy(board))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{study?.label || "Notebook box"}</DialogTitle>
            <DialogDescription>You landed on a study square. Review it, then keep playing.</DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{study?.content || "No notes on this box yet."}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => persist(dismissStudy(board))}>
              Got it — continue
            </Button>
            <Button type="button" variant="outline" onClick={() => void navigate({ to: "/notes", search: { view: "list", folder: "" } })}>
              Open notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editKey != null} onOpenChange={(open) => !open && setEditKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage box</DialogTitle>
            <DialogDescription>
              Notebook, array skip, or Sunday rest. Array skips the subject ahead and makes that study day a rest day.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="box-label">Box name</Label>
              <Input
                id="box-label"
                className="mt-2"
                value={editLabel}
                maxLength={24}
                placeholder="e.g. Ventilation"
                onChange={(e) => setEditLabel(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="box-kind">Box type</Label>
              <select
                id="box-kind"
                className="mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                value={editKind}
                disabled={!canEdit}
                onChange={(e) => setEditKind(e.target.value as LudoCellKind)}
              >
                <option value="note">Notebook</option>
                <option value="array">Array skip</option>
                <option value="sunday">Sunday rest</option>
              </select>
            </div>
            {editKind === "array" ? (
              <div>
                <Label htmlFor="box-skip">Skip ahead (steps)</Label>
                <Input
                  id="box-skip"
                  className="mt-2"
                  type="number"
                  min={1}
                  max={12}
                  value={editSkip}
                  disabled={!canEdit}
                  onChange={(e) => setEditSkip(Math.min(12, Math.max(1, Number(e.target.value) || 4)))}
                />
              </div>
            ) : null}
            {editKind === "sunday" ? (
              <div>
                <Label htmlFor="box-sunday">Stump that rests here</Label>
                <select
                  id="box-sunday"
                  className="mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                  value={editSundayToken}
                  disabled={!canEdit}
                  onChange={(e) => setEditSundayToken(e.target.value)}
                >
                  <option value="">Choose a stump</option>
                  {board.columns.flatMap((col) =>
                    col.tokens.map((token, i) => (
                      <option key={token.id} value={`${col.color}:${token.id}`}>
                        {col.color} · {token.name || `Piece ${i + 1}`}
                      </option>
                    )),
                  )}
                </select>
              </div>
            ) : null}
            <div>
              <Label htmlFor="box-content">Notes or question</Label>
              <Textarea
                id="box-content"
                className="mt-2 min-h-32"
                value={editContent}
                placeholder="Paste a formula, definition, or practice question"
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
            <Button type="button" onClick={saveCell} disabled={!canEdit}>
              Save box
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>When the target starts</DialogTitle>
            <DialogDescription>Pieces stay still until this date, and on rest days. Choose two or four columns from the menu, or pick exact seats in Settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="ludo-start">Target start</Label>
              <Input
                id="ludo-start"
                className="mt-2"
                type="date"
                value={toDateInput(board.startedAt)}
                disabled={!canEdit}
                onChange={(e) => patchBoard((b) => ({ ...b, startedAt: fromDateInput(e.target.value, 0) }))}
              />
            </div>
            <div>
              <Label htmlFor="ludo-exam">Exam date</Label>
              <Input
                id="ludo-exam"
                className="mt-2"
                type="date"
                value={toDateInput(board.examDate)}
                disabled={!canEdit}
                onChange={(e) => patchBoard((b) => ({ ...b, examDate: fromDateInput(e.target.value) }))}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Fast mode</p>
                <p className="text-xs text-muted-foreground">Extra bonus rolls from tests</p>
              </div>
              <Switch checked={board.fastMode} disabled={!canEdit} onCheckedChange={(v) => patchBoard((b) => ({ ...b, fastMode: v }))} />
            </div>
            <div>
              <p className="text-sm font-medium">Rest days</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DAY_LABELS.map((label, i) => {
                  const on = board.restDays.includes(i);
                  return (
                    <Button
                      key={label}
                      type="button"
                      size="sm"
                      variant={on ? "default" : "outline"}
                      disabled={!canEdit}
                      onClick={() =>
                        patchBoard((b) => ({
                          ...b,
                          restDays: on ? b.restDays.filter((d) => d !== i) : [...b.restDays, i].sort(),
                        }))
                      }
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
            {board.restDates.length ? (
              <div>
                <p className="text-sm font-medium">Skipped rest dates</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Added when a subject hits an array or Sunday box.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {board.restDates.map((d) => (
                    <Button
                      key={d}
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={!canEdit}
                      onClick={() => patchBoard((b) => ({ ...b, restDates: b.restDates.filter((x) => x !== d) }))}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-h-dvh max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{manageTab === "rules" ? "Manage rules" : "TargetXPED"}</DialogTitle>
            <DialogDescription>
              {manageTab === "rules"
                ? "Enable, disable, or edit study-mode rules. Custom rules can be added for this exam."
                : "Edit columns, subjects, Sunday boxes, and stamps. Up to 10 subjects per student."}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={manageTab} onValueChange={(v) => setManageTab(v === "rules" ? "rules" : "pieces")}>
            <TabsList className="w-full">
              <TabsTrigger value="pieces" className="flex-1">
                Manage sections
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex-1">
                Rules
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pieces">
              <TargetXped
                board={board}
                color={manageColor}
                onColor={setManageColor}
                canEdit={canEdit}
                decks={decks.map((d) => ({ id: d.id, name: d.name }))}
                myColor={myColor}
                onChange={persist}
                onPlaceSunday={(color, tokenId) => {
                  setManageOpen(false);
                  setPlaceMode({ kind: "sunday", tokenId, color });
                }}
                onPlaceArray={() => {
                  setManageOpen(false);
                  setPlaceMode({ kind: "array" });
                }}
              />
            </TabsContent>
            <TabsContent value="rules">
              <LudoRulesPanel
                board={board}
                canEdit={canEdit}
                onChange={persist}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(settingTest && challenge)}
        onOpenChange={(open) => {
          if (!open && settingTest) persist(setChallengeTest(board, challenge?.deckId ?? null, challengeScore));
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {challenge
                ? `${ludoSeatName(board, challenge.capturerColor, myColor)} captured ${ludoSeatName(board, challenge.capturedColor, myColor)}`
                : "Set a capture test"}
            </DialogTitle>
            <DialogDescription>
              {challenge
                ? `${challenge.tokenName || "A subject"} was sent home. Set a test at ${challengeScore}% for ${ludoSeatName(board, challenge.capturedColor, myColor)}.`
                : "Set a passing score for the captured student."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="cap-deck">Test paper</Label>
              <select
                id="cap-deck"
                className="mt-2 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                value={challengeDeck}
                onChange={(e) => setChallengeDeck(e.target.value)}
              >
                <option value="">Notes only — mark after review</option>
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="cap-score">Passing score (%)</Label>
              <Input
                id="cap-score"
                className="mt-2"
                type="number"
                min={1}
                max={100}
                value={challengeScore}
                onChange={(e) => setChallengeScore(Math.min(100, Math.max(1, Number(e.target.value) || 50)))}
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                persist(setChallengeTest(board, challengeDeck || null, challengeScore));
                toast.success("Capture test set");
              }}
            >
              Set test
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(takingTest && challenge)} onOpenChange={() => undefined}>
        <DialogContent showClose={false}>
          <DialogHeader>
            <DialogTitle>
              {challenge ? `${ludoSeatName(board, challenge.capturerColor, myColor)} captured you` : "Capture test"}
            </DialogTitle>
            <DialogDescription>
              {challenge
                ? `${ludoSeatName(board, challenge.capturerColor, myColor)} sent ${challenge.tokenName || "your subject"} home. Pass at ${challenge.passingScore}% to keep playing on your next day.`
                : "Pass the capture test to keep playing."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {challenge?.deckId ? (
              <Button
                type="button"
                onClick={() =>
                  void navigate({
                    to: "/study/$deckId",
                    params: { deckId: challenge.deckId! },
                    search: { mode: "study", pick: "all", count: 0, paper: "", quiz: "", session: "" },
                  })
                }
              >
                Start test
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void navigate({ to: "/notes", search: { view: "list", folder: "" } })}
              >
                Review notes
              </Button>
            )}
            {!challenge?.deckId ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  persist(dismissChallenge({ ...board, challenge: { ...challenge!, status: "pending-take" } }));
                  toast.success("Marked as reviewed");
                }}
              >
                I reviewed — continue
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={classOpen} onOpenChange={setClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class board</DialogTitle>
            <DialogDescription>Up to {MAX_LUDO_STUDENTS} students, one color each.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="ludo-name">Your name on the board</Label>
              <Input
                id="ludo-name"
                className="mt-2"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Shown on your column"
              />
            </div>
            {room ? (
              <div className="grid gap-3">
                <p className="font-mono text-lg tracking-widest">{room.code}</p>
                <p className="text-sm text-muted-foreground">
                  {room.students.length}/{MAX_LUDO_STUDENTS} playing
                  {room.hostId === playerId ? " · you are hosting" : ""}.
                </p>
                <ul className="grid gap-2">
                  {room.students.map((s) => (
                    <li key={s.playerId} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 truncate font-medium">
                        <span className="ludo-chip-dot" data-color={s.color} />
                        {s.name}
                        {s.playerId === playerId ? " (you)" : ""}
                      </span>
                      <span className="capitalize text-muted-foreground">{s.color}</span>
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
                    Leave board
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                <Button type="button" onClick={() => void startClass()} disabled={busy === "create"}>
                  {busy === "create" ? "Starting…" : "Start a class board"}
                </Button>
                <Label htmlFor="ludo-code">Join with a code</Label>
                <Input
                  id="ludo-code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="font-mono tracking-widest"
                  autoCapitalize="characters"
                />
                <Button type="button" variant="outline" onClick={() => void joinClass()} disabled={busy === "join"}>
                  {busy === "join" ? "Joining…" : "Join class board"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}

function TargetXped({
  board,
  color,
  onColor,
  canEdit,
  decks,
  myColor,
  onChange,
  onPlaceSunday,
  onPlaceArray,
}: {
  board: LudoBoard;
  color: LudoColor;
  onColor: (c: LudoColor) => void;
  canEdit: boolean;
  decks: Array<{ id: string; name: string }>;
  myColor: LudoColor;
  onChange: (b: LudoBoard) => void;
  onPlaceSunday: (color: LudoColor, tokenId: string) => void;
  onPlaceArray: () => void;
}) {
  const col = board.columns.find((c) => c.color === color);
  if (!col) return null;
  const column = col;
  const canEditTokens = canEdit || color === myColor;

  function patchColumn(patch: Partial<typeof column>) {
    onChange({
      ...board,
      columns: board.columns.map((c) => (c.color === color ? { ...c, ...patch } : c)),
    });
  }

  function setTokenCount(n: number) {
    const tokenCount = Math.min(MAX_LUDO_TOKENS, Math.max(MIN_LUDO_TOKENS, n));
    patchColumn({ tokenCount, tokens: makeLudoTokens(color, tokenCount, column.tokens) });
  }

  function patchToken(id: string, patch: Partial<LudoToken>) {
    patchColumn({ tokens: column.tokens.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 gap-1">
        {LUDO_COLORS.map((c) => (
          <Button
            key={c}
            type="button"
            size="sm"
            variant={c === color ? "default" : "outline"}
            onClick={() => onColor(c)}
            className={`capitalize${!isActiveSeat(board, c) ? " opacity-40" : ""}`}
          >
            {c}
          </Button>
        ))}
      </div>

      <div>
        <Label htmlFor="xped-student">Student on this column</Label>
        <Input
          id="xped-student"
          className="mt-2"
          value={col.studentName}
          disabled={!canEditTokens}
          onChange={(e) => patchColumn({ studentName: e.target.value })}
          placeholder="Open seat"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="xped-count">Subjects (pieces)</Label>
          <Input
            id="xped-count"
            className="mt-2"
            type="number"
            min={MIN_LUDO_TOKENS}
            max={MAX_LUDO_TOKENS}
            value={col.tokenCount}
            disabled={!canEdit}
            onChange={(e) => setTokenCount(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="xped-daily">Daily target</Label>
          <Input
            id="xped-daily"
            className="mt-2"
            type="number"
            min={1}
            max={40}
            value={col.dailyTarget}
            disabled={!canEdit}
            onChange={(e) => patchColumn({ dailyTarget: Math.min(40, Math.max(1, Number(e.target.value) || 1)) })}
          />
        </div>
        <div>
          <Label htmlFor="xped-entry">Arrow · entry turn</Label>
          <Input
            id="xped-entry"
            className="mt-2"
            type="number"
            min={1}
            max={6}
            value={col.entryTurn}
            disabled={!canEdit}
            onChange={(e) => patchColumn({ entryTurn: Math.min(6, Math.max(1, Number(e.target.value) || 6)) })}
          />
        </div>
        <div className="flex items-end">
          <label className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border px-3">
            <span className="text-sm">Show arrows</span>
            <Switch checked={col.arrowEnabled} disabled={!canEdit} onCheckedChange={(v) => patchColumn({ arrowEnabled: v })} />
          </label>
        </div>
      </div>

      <Button type="button" variant="outline" size="sm" disabled={!canEdit} onClick={onPlaceArray}>
        Place array skip on the board
      </Button>

      {color === myColor ? null : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canEdit}
          onClick={() => {
            let next: LudoBoard = { ...board, playerColor: color };
            if (board.playerMode === "two") next = applyPlayerMode(next, "two");
            else if (!isActiveSeat(board, color)) next = applyActiveColors(next, [...board.activeColors, color]);
            else next = { ...next, turnColor: color };
            onChange(next);
          }}
        >
          Make this your column
        </Button>
      )}

      <ul className="grid gap-3">
        {col.tokens.map((token, i) => (
          <li key={token.id} className="grid gap-2 rounded-lg border border-border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Piece {i + 1}</p>
            <Input
              value={token.name}
              disabled={!canEditTokens}
              onChange={(e) => patchToken(token.id, { name: e.target.value })}
              placeholder="Subject name"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Linked test</Label>
                <select
                  className="mt-1 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                  value={token.deckId ?? ""}
                  disabled={!canEditTokens}
                  onChange={(e) => patchToken(token.id, { deckId: e.target.value || null })}
                >
                  <option value="">Notes only</option>
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">Day stamp</Label>
                <Input
                  className="mt-1"
                  value={token.dayName}
                  disabled={!canEditTokens}
                  onChange={(e) => patchToken(token.id, { dayName: e.target.value })}
                  placeholder="Mon"
                />
              </div>
              <div>
                <Label className="text-xs">Stamp color</Label>
                <select
                  className="mt-1 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                  value={token.stampColor}
                  disabled={!canEditTokens}
                  onChange={(e) => patchToken(token.id, { stampColor: e.target.value as LudoToken["stampColor"] })}
                >
                  <option value="inherit">Column color</option>
                  {LUDO_COLORS.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">Logo</Label>
                <select
                  className="mt-1 flex h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-raised"
                  value={token.logo}
                  disabled={!canEditTokens}
                  onChange={(e) => patchToken(token.id, { logo: e.target.value as LudoLogo })}
                >
                  {LOGOS.map((logo) => (
                    <option key={logo} value={logo}>
                      {logoLabel(logo)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Sunday box</Label>
                <div className="mt-1 flex gap-2">
                  <Input value={token.sundayKey || "Not placed"} readOnly className="font-mono text-xs" />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    disabled={!canEditTokens}
                    onClick={() => onPlaceSunday(color, token.id)}
                  >
                    Place
                  </Button>
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Arrangement (steps, −1 yard · 57 home)</Label>
                <Input
                  className="mt-1"
                  type="number"
                  min={-1}
                  max={LUDO_HOME_STEPS}
                  value={token.steps}
                  disabled={!canEdit}
                  onChange={(e) =>
                    patchToken(token.id, {
                      steps: Math.min(LUDO_HOME_STEPS, Math.max(-1, Number(e.target.value))),
                    })
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LudoRulesPanel({
  board,
  canEdit,
  onChange,
}: {
  board: LudoBoard;
  canEdit: boolean;
  onChange: (b: LudoBoard) => void;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  function patchRules(patch: Partial<LudoStudyRules>) {
    onChange({ ...board, rules: { ...board.rules, ...patch } });
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Study mode keeps the Ludo die in the centre. Toggle a rule off if it does not fit this exam.
      </p>
      {RULE_COPY.map((rule) => {
        const on = Boolean(board.rules[rule.key]);
        return (
          <div key={rule.key} className="grid gap-2 rounded-lg border border-border p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{rule.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{rule.detail}</p>
              </div>
              <Switch checked={on} disabled={!canEdit} onCheckedChange={(v) => patchRules({ [rule.key]: v })} />
            </div>
            {rule.key === "captureTest" && on ? (
              <div>
                <Label htmlFor="rule-pass">Passing score (%)</Label>
                <Input
                  id="rule-pass"
                  className="mt-2"
                  type="number"
                  min={1}
                  max={100}
                  value={board.rules.passingScore}
                  disabled={!canEdit}
                  onChange={(e) => patchRules({ passingScore: Math.min(100, Math.max(1, Number(e.target.value) || 50)) })}
                />
              </div>
            ) : null}
            {rule.key === "skipArray" && on ? (
              <div>
                <Label htmlFor="rule-skip">Default skip (steps)</Label>
                <Input
                  id="rule-skip"
                  className="mt-2"
                  type="number"
                  min={1}
                  max={12}
                  value={board.rules.skipSteps}
                  disabled={!canEdit}
                  onChange={(e) => patchRules({ skipSteps: Math.min(12, Math.max(1, Number(e.target.value) || 4)) })}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="grid gap-3 rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Custom rules</p>
          <p className="mt-1 text-xs text-muted-foreground">Add exam-specific rules. They can be switched on or off like the defaults.</p>
        </div>
        {board.customRules.length ? (
          <ul className="grid gap-2">
            {board.customRules.map((rule) => (
              <li key={rule.id} className="grid gap-2 rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{rule.title}</p>
                    {rule.detail ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{rule.detail}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      disabled={!canEdit}
                      onCheckedChange={(v) => onChange(patchCustomRule(board, rule.id, { enabled: v }))}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!canEdit}
                      aria-label={`Remove ${rule.title}`}
                      onClick={() => onChange(removeCustomRule(board, rule.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No custom rules yet.</p>
        )}
        <div>
          <Label htmlFor="custom-title">Rule title</Label>
          <Input
            id="custom-title"
            className="mt-2"
            value={title}
            disabled={!canEdit}
            maxLength={80}
            placeholder="e.g. No phones on rest days"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="custom-detail">Detail</Label>
          <Textarea
            id="custom-detail"
            className="mt-2 min-h-20"
            value={detail}
            disabled={!canEdit}
            placeholder="How this rule applies during the exam run-up"
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={!canEdit || !title.trim()}
          onClick={() => {
            onChange(addCustomRule(board, title, detail));
            setTitle("");
            setDetail("");
          }}
        >
          <Plus className="size-4" />
          Add custom rule
        </Button>
      </div>
    </div>
  );
}