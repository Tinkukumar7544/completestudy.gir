import { useEffect, useMemo, useRef, useState } from "react";
import { Hand, MessageCircle, Mic, MicOff, PhoneOff, Send, Users, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  grantFloor,
  raiseDiscussionHand,
  releaseFloor,
  sendDiscussionChat,
  type DiscRoom,
} from "@/lib/exam/discussion";
import { allowsVideo, floorRemainingMs, formatFloorLeft } from "@/lib/exam/discussion-room";
import { useDiscussCall } from "@/lib/multiplayer/use-discuss-call";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "Y";
}

export function ClassStage({
  room,
  me,
  name,
  onRoom,
  onLeave,
}: {
  room: DiscRoom;
  me: string;
  name: string;
  onRoom: (next: DiscRoom) => void;
  onLeave: () => void;
}) {
  const { setMedia, localStream, remoteStreams, speaking, endCall } = useDiscussCall({
    code: room.code,
    selfId: me,
    name,
    enabled: Boolean(room.startedAt && !room.endedAt),
  });
  const videoOk = allowsVideo(room.mode);
  const [mic, setMic] = useState(false);
  const [video, setVideo] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [handsOpen, setHandsOpen] = useState(false);
  const [roster, setRoster] = useState(false);
  const [draft, setDraft] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const clickTimer = useRef(0);
  const hostVideo = useRef<HTMLVideoElement>(null);
  const floorVideo = useRef<HTMLVideoElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const present = room.players.filter((p) => !p.leftAt);
  const connected = present.length;
  const host = present.find((p) => p.playerId === room.hostId) ?? present[0];
  const mine = present.find((p) => p.playerId === me);
  const handOn = Boolean(mine?.handAt);
  const floor = present.find((p) => p.playerId === room.floorPlayerId);
  const onFloor = room.floorPlayerId === me;
  const leftMs = floorRemainingMs(room.floorUntil, now);
  const hands = present.filter((p) => p.handAt && p.playerId !== room.hostId);
  const questions = room.messages.filter((m) => m.kind === "question");

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [room.messages.length, chatOpen, askOpen]);

  useEffect(() => {
    if (!room.isHost || room.endedAt) return;
    let cancelled = false;
    void (async () => {
      try {
        await setMedia(true, videoOk);
        if (!cancelled) {
          setMic(true);
          setVideo(videoOk);
        }
      } catch {
        if (!cancelled) toast.error("Allow camera so the class can go live");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [room.endedAt, room.isHost, setMedia, videoOk]);

  useEffect(() => {
    if (room.isHost || room.endedAt) return;
    if (onFloor && room.floorKind === "audio") {
      void setMedia(true, video).then(() => setMic(true)).catch(() => undefined);
    }
  }, [onFloor, room.endedAt, room.floorKind, room.isHost, setMedia, video]);

  const hostStream = host?.playerId === me ? localStream : (host ? remoteStreams[host.playerId] ?? null : null);
  const floorStream = floor ? (floor.playerId === me ? localStream : remoteStreams[floor.playerId] ?? null) : null;
  const hostVideoOn = Boolean(
    hostStream?.getVideoTracks().some((t) => t.enabled && t.readyState === "live"),
  );

  useEffect(() => {
    const el = hostVideo.current;
    if (!el) return;
    el.srcObject = hostStream;
  }, [hostStream]);

  useEffect(() => {
    const el = floorVideo.current;
    if (!el) return;
    el.srcObject = floorStream;
  }, [floorStream]);

  async function toggleMic() {
    const next = !mic;
    try {
      await setMedia(next, video && videoOk);
      setMic(next);
    } catch {
      toast.error("Microphone permission is needed");
      setMic(false);
    }
  }

  async function toggleVideo() {
    if (!videoOk) return;
    const next = !video;
    try {
      await setMedia(mic || next, next);
      setVideo(next);
      if (next && !mic) setMic(true);
    } catch {
      toast.error("Camera permission is needed");
      setVideo(false);
    }
  }

  async function toggleHand() {
    try {
      onRoom(await raiseDiscussionHand({ data: { code: room.code, playerId: me, on: !handOn } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not raise hand");
    }
  }

  async function send(kind: "chat" | "question") {
    const body = (kind === "question" ? question : draft).trim();
    if (!body) return;
    setSending(true);
    if (kind === "question") setQuestion("");
    else setDraft("");
    try {
      let next = await sendDiscussionChat({ data: { code: room.code, playerId: me, name, body, kind } });
      if (kind === "question" && !room.isHost) {
        next = await raiseDiscussionHand({ data: { code: room.code, playerId: me, on: true } });
      }
      onRoom(next);
    } catch (err) {
      if (kind === "question") setQuestion(body);
      else setDraft(body);
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setSending(false);
    }
  }

  async function openFloor(playerId: string, kind: "audio" | "question") {
    try {
      onRoom(await grantFloor({ data: { code: room.code, hostId: me, playerId, kind } }));
      setHandsOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open one-to-one");
    }
  }

  async function closeFloor() {
    try {
      onRoom(await releaseFloor({ data: { code: room.code, playerId: me } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not end turn");
    }
  }

  const speakingHost = Boolean(host && speaking[host.playerId]);
  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of present) map.set(p.playerId, p.name);
    return map;
  }, [present]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <video
        ref={hostVideo}
        className={cn("size-full object-cover", hostVideoOn ? "" : "hidden")}
        autoPlay
        playsInline
        muted={host?.playerId === me}
      />
      {!hostVideoOn ? (
        <div className="grid size-full place-items-center bg-neutral-950">
          <div className="grid size-28 place-items-center rounded-full bg-neutral-800 text-3xl font-semibold">
            {initials(host?.name ?? "Live")}
          </div>
          <p className="mt-3 text-sm text-white/70">{room.isHost ? "Going live…" : "Waiting for the teacher’s camera"}</p>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-3">
        <div className="pointer-events-auto min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">{room.title}</p>
          <p className="font-mono text-xs tracking-widest text-white/80">{room.code}</p>
        </div>
        <button
          type="button"
          className="pointer-events-auto rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur"
          aria-label={`${connected} connected`}
          aria-expanded={roster}
          onClick={(e) => {
            if (e.detail >= 2) {
              window.clearTimeout(clickTimer.current);
              setRoster(false);
              return;
            }
            window.clearTimeout(clickTimer.current);
            clickTimer.current = window.setTimeout(() => setRoster(true), 220);
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" />
            {connected} connected
          </span>
        </button>
      </div>

      {floor ? (
        <div className="absolute top-16 right-3 w-36 overflow-hidden rounded-xl border border-white/20 bg-black/60 shadow-lg">
          <div className="relative aspect-[3/4]">
            {floorStream?.getVideoTracks().some((t) => t.enabled) ? (
              <video ref={floorVideo} className="size-full object-cover" autoPlay playsInline muted={floor.playerId === me} />
            ) : (
              <div className="grid size-full place-items-center text-lg font-semibold">
                <span>{initials(floor.name)}</span>
                <video ref={floorVideo} className="hidden" autoPlay playsInline muted={floor.playerId === me} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-[11px]">
              <p className="truncate">{floor.name}</p>
              <p className="text-white/70">
                {room.floorKind === "question" ? "Question" : "Audio"} · {formatFloorLeft(leftMs)}
              </p>
            </div>
          </div>
          {room.isHost || onFloor ? (
            <button type="button" className="w-full py-1 text-xs text-white/80" onClick={() => void closeFloor()}>
              End turn
            </button>
          ) : null}
        </div>
      ) : null}

      {roster ? (
        <div className="absolute inset-y-0 right-0 top-14 z-20 flex w-64 max-w-[80vw] flex-col bg-black/85 p-3 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">{connected} connected</p>
          <button type="button" className="mb-2 text-left text-[11px] text-white/50" onClick={() => setRoster(false)}>
            Hide list (or double-click the counter)
          </button>
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto text-sm">
            {present.map((p) => (
              <li key={p.playerId} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-white/10">
                <span className="min-w-0 truncate">
                  {p.name}
                  {p.playerId === me ? " · you" : ""}
                  {p.playerId === room.hostId ? " · teacher" : ""}
                </span>
                {p.handAt ? <Hand className="size-3.5 shrink-0" /> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {handsOpen && room.isHost ? (
        <div className="absolute inset-y-0 left-0 z-20 flex w-72 max-w-[85vw] flex-col gap-3 bg-black/85 p-3 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">Hands & questions</p>
          {hands.length === 0 && questions.length === 0 ? (
            <p className="text-sm text-white/60">No hands or questions yet.</p>
          ) : null}
          {hands.map((p) => (
            <div key={p.playerId} className="rounded-lg bg-white/10 p-2">
              <p className="text-sm font-medium">{p.name}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => void openFloor(p.playerId, "audio")}>
                  Audio 1:1
                </Button>
              </div>
            </div>
          ))}
          {questions.slice(-8).map((q) => (
            <div key={q.id} className="rounded-lg bg-white/10 p-2">
              <p className="text-xs text-white/60">{nameById.get(q.playerId) ?? q.name}</p>
              <p className="text-sm">{q.body}</p>
              {q.playerId !== room.hostId ? (
                <Button size="sm" className="mt-2" onClick={() => void openFloor(q.playerId, "question")}>
                  Answer live
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {chatOpen || askOpen ? (
        <div className="absolute inset-x-0 bottom-24 z-20 mx-3 max-h-[40vh] overflow-hidden rounded-xl bg-black/80 p-3 backdrop-blur">
          {chatOpen ? (
            <>
              <div ref={scroller} className="max-h-40 space-y-2 overflow-y-auto text-sm">
                {room.messages.filter((m) => m.kind === "chat").map((m) => (
                  <p key={m.id}>
                    <span className="font-medium">{m.name}: </span>
                    {m.body}
                  </p>
                ))}
              </div>
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send("chat");
                }}
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Message the class"
                  className="border-white/20 bg-white/10 text-white"
                />
                <Button type="submit" size="icon" disabled={sending}>
                  <Send className="size-4" />
                </Button>
              </form>
            </>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send("question");
              }}
            >
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask the teacher"
                className="border-white/20 bg-white/10 text-white"
              />
              <Button type="submit" disabled={sending}>
                Ask
              </Button>
            </form>
          )}
        </div>
      ) : null}

      {onFloor && !room.isHost ? (
        <p className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          You’re with the teacher · {formatFloorLeft(leftMs)}
        </p>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 py-4">
        <Button
          type="button"
          variant={chatOpen ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            setChatOpen((v) => !v);
            setAskOpen(false);
          }}
        >
          <MessageCircle className="size-4" />
          Chat
        </Button>
        <Button type="button" variant={mic ? "default" : "secondary"} size="sm" onClick={() => void toggleMic()}>
          {mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          Mic
        </Button>
        {videoOk ? (
          <Button type="button" variant={video ? "default" : "secondary"} size="sm" onClick={() => void toggleVideo()}>
            {video ? <Video className="size-4" /> : <VideoOff className="size-4" />}
            Camera
          </Button>
        ) : null}
        {room.isHost ? (
          <Button type="button" variant={handsOpen ? "default" : "secondary"} size="sm" onClick={() => setHandsOpen((v) => !v)}>
            <Hand className="size-4" />
            Hands{hands.length ? ` ${hands.length}` : ""}
          </Button>
        ) : (
          <>
            <Button type="button" variant={handOn ? "default" : "secondary"} size="sm" onClick={() => void toggleHand()}>
              <Hand className="size-4" />
              Hand
            </Button>
            <Button
              type="button"
              variant={askOpen ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                setAskOpen((v) => !v);
                setChatOpen(false);
              }}
            >
              Ask
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            endCall();
            onLeave();
          }}
        >
          <PhoneOff className="size-4" />
          {room.isHost ? "End class" : "Leave"}
        </Button>
      </div>
      {speakingHost ? <span className="sr-only">Teacher is speaking</span> : null}
    </div>
  );
}
