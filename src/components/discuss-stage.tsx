import { useEffect, useMemo, useRef, useState } from "react";
import { Hand, MessageCircle, Mic, MicOff, PhoneOff, Send, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  raiseDiscussionHand,
  sendDiscussionChat,
  type DiscPlayer,
  type DiscRoom,
} from "@/lib/exam/discussion";
import { allowsVideo } from "@/lib/exam/discussion-room";
import { useDiscussCall } from "@/lib/multiplayer/use-discuss-call";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "Y";
}

function Tile({
  name,
  you,
  stream,
  speaking,
  hand,
  micOn,
  videoOn,
  large,
}: {
  name: string;
  you?: boolean;
  stream: MediaStream | null;
  speaking: boolean;
  hand: boolean;
  micOn: boolean;
  videoOn: boolean;
  large?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.srcObject = stream;
  }, [stream]);
  const showVideo = Boolean(stream && videoOn && stream.getVideoTracks().some((t) => t.enabled && t.readyState === "live"));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-raised",
        large ? "aspect-video min-h-52 w-full" : "size-20 shrink-0",
        speaking ? "border-primary ring-2 ring-primary" : "border-border",
      )}
    >
      {showVideo ? (
        <video ref={video} className="size-full object-cover" autoPlay playsInline muted={you} />
      ) : (
        <div className={cn("grid size-full place-items-center bg-secondary text-secondary-foreground", large ? "text-2xl" : "text-sm")}>
          <span className="font-semibold tracking-tight">{initials(name)}</span>
        </div>
      )}
      {!showVideo ? <video ref={video} className="hidden" autoPlay playsInline muted={you} /> : null}
      <div className={cn("absolute inset-x-0 bottom-0 flex items-center gap-1 bg-bar/80 px-1.5 py-1 text-bar-foreground", large ? "px-3 py-2" : "")}>
        <span className={cn("min-w-0 truncate font-medium", large ? "text-sm" : "text-xs")}>
          {name}
          {you ? " · you" : ""}
        </span>
        <span className="ml-auto flex items-center gap-1">
          {hand ? <Hand className={cn(large ? "size-4" : "size-3")} /> : null}
          {micOn ? <Mic className={cn(large ? "size-4" : "size-3")} /> : <MicOff className={cn("opacity-70", large ? "size-4" : "size-3")} />}
          {videoOn ? <Video className={cn(large ? "size-4" : "size-3")} /> : null}
        </span>
      </div>
    </div>
  );
}

export function DiscussStage({
  room,
  me,
  name,
  onRoom,
}: {
  room: DiscRoom;
  me: string;
  name: string;
  onRoom: (next: DiscRoom) => void;
}) {
  const call = useDiscussCall({ code: room.code, selfId: me, name, enabled: Boolean(room.startedAt && !room.endedAt) });
  const videoOk = allowsVideo(room.mode);
  const [mic, setMic] = useState(false);
  const [video, setVideo] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const present = room.players.filter((p) => !p.leftAt);
  const mine = present.find((p) => p.playerId === me);
  const handOn = Boolean(mine?.handAt);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [room.messages.length, chatOpen, askOpen]);

  async function toggleMic() {
    const next = !mic;
    try {
      await call.setMedia(next, video && videoOk);
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
      await call.setMedia(mic || next, next);
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
      onRoom(await sendDiscussionChat({ data: { code: room.code, playerId: me, name, body, kind } }));
    } catch (err) {
      if (kind === "question") setQuestion(body);
      else setDraft(body);
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setSending(false);
    }
  }

  const speakerId = useMemo(() => {
    const live = Object.entries(call.speaking).filter(([, on]) => on).map(([id]) => id);
    if (live.includes(me)) return me;
    if (live[0]) return live[0];
    const hand = present.find((p) => p.handAt);
    return hand?.playerId ?? present[0]?.playerId ?? me;
  }, [call.speaking, me, present]);

  const speaker = present.find((p) => p.playerId === speakerId) ?? present[0];
  const others = present.filter((p) => p.playerId !== speaker?.playerId);
  const failed = call.peers.filter((p) => p.connectionState === "failed");
  const questions = room.messages.filter((m) => m.kind === "question");

  function streamFor(player: DiscPlayer): MediaStream | null {
    if (player.playerId === me) return call.localStream;
    return call.remoteStreams[player.playerId] ?? null;
  }

  function videoFlag(player: DiscPlayer) {
    if (player.playerId === me) return video;
    const stream = call.remoteStreams[player.playerId];
    return Boolean(stream?.getVideoTracks().some((t) => t.enabled && t.readyState === "live"));
  }

  function micFlag(player: DiscPlayer) {
    if (player.playerId === me) return mic;
    const stream = call.remoteStreams[player.playerId];
    return Boolean(stream?.getAudioTracks().some((t) => t.enabled && t.readyState === "live")) || Boolean(call.speaking[player.playerId]);
  }

  return (
    <div className="grid gap-3">
      {speaker ? (
        <Tile
          name={speaker.name}
          you={speaker.playerId === me}
          stream={streamFor(speaker)}
          speaking={Boolean(call.speaking[speaker.playerId])}
          hand={Boolean(speaker.handAt)}
          micOn={micFlag(speaker)}
          videoOn={videoFlag(speaker)}
          large
        />
      ) : null}
      {others.length ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {others.map((p) => (
            <Tile
              key={p.playerId}
              name={p.name}
              you={p.playerId === me}
              stream={streamFor(p)}
              speaking={Boolean(call.speaking[p.playerId])}
              hand={Boolean(p.handAt)}
              micOn={micFlag(p)}
              videoOn={videoFlag(p)}
            />
          ))}
        </div>
      ) : null}
      {failed.length ? (
        <p className="text-xs text-muted-foreground">
          Camera may not reach every pair past a small group. Chat, hands, and questions still reach all {present.length}.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant={chatOpen ? "default" : "outline"} onClick={() => { setChatOpen((v) => !v); setAskOpen(false); }}>
          <MessageCircle className="size-4" />
          Chat
        </Button>
        <Button type="button" variant={mic ? "default" : "outline"} onClick={() => void toggleMic()}>
          {mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          Mic
        </Button>
        {videoOk ? (
          <Button type="button" variant={video ? "default" : "outline"} onClick={() => void toggleVideo()}>
            {video ? <Video className="size-4" /> : <VideoOff className="size-4" />}
            Camera
          </Button>
        ) : null}
        <Button type="button" variant={handOn ? "default" : "outline"} onClick={() => void toggleHand()}>
          <Hand className="size-4" />
          Hand
        </Button>
        <Button type="button" variant={askOpen ? "default" : "outline"} onClick={() => { setAskOpen((v) => !v); setChatOpen(false); }}>
          Ask
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            call.endCall();
            setMic(false);
            setVideo(false);
            toast.success("Call ended — chat is still open");
          }}
        >
          <PhoneOff className="size-4" />
          End call
        </Button>
      </div>
      {chatOpen ? (
        <div className="grid gap-2 rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Chat</p>
          <div ref={scroller} className="grid max-h-48 gap-2 overflow-y-auto">
            {room.messages.filter((m) => m.kind === "chat").map((m) => (
              <p key={m.id} className="text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground"> · {m.body}</span>
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the group"
              onKeyDown={(e) => {
                if (e.key === "Enter") void send("chat");
              }}
            />
            <Button type="button" variant="outline" disabled={sending} onClick={() => void send("chat")}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
      {askOpen ? (
        <div className="grid gap-2 rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Questions</p>
          <ul className="grid max-h-48 gap-2 overflow-y-auto">
            {questions.length === 0 ? <li className="text-sm text-muted-foreground">No questions yet.</li> : null}
            {questions.map((m) => (
              <li key={m.id} className="rounded-lg bg-muted px-3 py-2 text-sm">
                <p className="text-xs text-muted-foreground">{m.name}</p>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the group"
              onKeyDown={(e) => {
                if (e.key === "Enter") void send("question");
              }}
            />
            <Button type="button" disabled={sending} onClick={() => void send("question")}>
              Ask
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
