import { useEffect, useRef, useState, type RefObject } from "react";
import { MessageCircle, Mic, MicOff, Phone, PhoneOff, Send, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendQuizChat, type QuizChatMessage } from "@/lib/exam/quiz";
import { quizPlayerId, rememberedQuizName } from "@/lib/exam/quiz-client";
import { useQuizCall } from "@/lib/multiplayer/use-quiz-call";
import { cn } from "@/lib/utils";

export function QuizLiveBar({
  code,
  name,
  messages,
  onRoom,
  compact = false,
  phase = "before",
}: {
  code: string;
  name: string;
  messages: QuizChatMessage[];
  onRoom?: (next: Awaited<ReturnType<typeof sendQuizChat>>) => void;
  compact?: boolean;
  phase?: "before" | "during" | "after";
}) {
  const me = quizPlayerId();
  const display = name.trim() || rememberedQuizName() || "You";
  const call = useQuizCall({ code, selfId: me, name: display, enabled: Boolean(code && me && me !== "ssr") });
  const [mic, setMic] = useState(false);
  const [video, setVideo] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const [handsFree, setHandsFree] = useState(false);

  useEffect(() => {
    if (phase !== "during") return;
    call.endCall();
    setMic(false);
    setVideo(false);
    setHandsFree(false);
  }, [phase]);

  useEffect(() => {
    const el = localVideo.current;
    if (!el) return;
    el.srcObject = call.localStream;
  }, [call.localStream]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, chatOpen]);

  async function toggleMic() {
    const next = !mic;
    try {
      await call.setMedia(next, video);
      setMic(next);
    } catch {
      toast.error("Microphone permission is needed");
      setMic(false);
    }
  }

  async function toggleVideo() {
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

  async function toggleHandsFree() {
    const next = !handsFree;
    try {
      await call.setMedia(next, video);
      setMic(next);
      setHandsFree(next);
    } catch {
      toast.error("Microphone permission is needed");
      setHandsFree(false);
    }
  }

  function endCall() {
    call.endCall();
    setMic(false);
    setVideo(false);
    toast.success("Call ended — chat is still open");
  }

  useEffect(() => {
    function onEnd() {
      call.endCall();
      setMic(false);
      setVideo(false);
      toast.success("Call ended — chat is still open");
    }
    window.addEventListener("setpaper-end-call", onEnd);
    return () => window.removeEventListener("setpaper-end-call", onEnd);
  }, [call.endCall]);

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    setDraft("");
    try {
      const next = await sendQuizChat({ data: { code, playerId: me, name: display, body } });
      onRoom?.(next);
    } catch (err) {
      setDraft(body);
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setSending(false);
    }
  }

  const tiles = Object.entries(call.remoteStreams);
  const callsOn = phase !== "during";
  const controls = callsOn ? (
    <div className={cn("flex flex-wrap items-center gap-2", compact ? "justify-end" : "justify-center")}>
      <Button type="button" variant={chatOpen ? "default" : "outline"} size="sm" onClick={() => setChatOpen((v) => !v)}>
        <MessageCircle className="size-4" />
        Chat
      </Button>
      <Button type="button" variant={mic ? "default" : "outline"} size="sm" onClick={() => void toggleMic()}>
        {mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}
        Mute
      </Button>
      <Button type="button" variant={video ? "default" : "outline"} size="sm" onClick={() => void toggleVideo()}>
        {video ? <Video className="size-4" /> : <VideoOff className="size-4" />}
        Video
      </Button>
      <Button type="button" variant={handsFree ? "default" : "outline"} size="sm" onClick={() => void toggleHandsFree()}>
        <Phone className="size-4" />
        Hands-free
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={endCall}>
        <PhoneOff className="size-4" />
        Disconnect
      </Button>
    </div>
  ) : (
    <p className="text-center text-xs text-muted-foreground">Video and audio stay off while the test is running.</p>
  );

  return (
    <section className={cn(compact ? "border-b border-border bg-card px-2 py-2" : "mt-6")}>
      {!compact ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Room chat and call</h2>
          <p className="text-xs text-muted-foreground">{call.joined ? `${call.peers.length} on call` : "Connecting…"}</p>
        </div>
      ) : null}
      {controls}
      {callsOn && (video || tiles.length > 0) ? (
        <MeetStrip
          local={video && call.localStream ? localVideo : null}
          tiles={tiles.map(([id, stream]) => ({ id, stream, name: call.peers.find((p) => p.id === id)?.name || "Friend" }))}
          roomy={phase === "after"}
        />
      ) : null}
      {call.peers.some((p) => p.connectionState === "failed") ? (
        <p className="mt-2 text-xs text-muted-foreground">Some friends cannot connect on video — chat still works.</p>
      ) : null}
      {chatOpen ? (
        <div className={cn("mt-3 grid gap-2", compact && "rounded-lg border border-border bg-card p-3 text-foreground")}>
          <div ref={scroller} className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border bg-card p-3">
            {messages.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              messages.map((m) => {
                const mine = m.playerId === me;
                return (
                  <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
                    <p className="mb-0.5 text-xs text-muted-foreground">{m.name}</p>
                    <p
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                        mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                      )}
                    >
                      {m.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message everyone"
              aria-label="Message everyone"
              maxLength={400}
            />
            <Button type="submit" size="icon" disabled={sending || !draft.trim()} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
          <Button type="button" variant="outline" onClick={endCall}>
            <PhoneOff className="size-4" />
            End call
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function MeetStrip({
  local,
  tiles,
  roomy,
}: {
  local: RefObject<HTMLVideoElement | null> | null;
  tiles: { id: string; stream: MediaStream; name: string }[];
  roomy: boolean;
}) {
  const people = tiles.length + (local ? 1 : 0);
  const packed = people > 2;
  return (
    <div className="mt-3 grid gap-2">
      {local ? (
        <video
          ref={local}
          className={cn("w-full rounded-lg bg-bar object-cover", roomy ? "max-h-56 aspect-video" : "max-h-36 aspect-video")}
          autoPlay
          muted
          playsInline
        />
      ) : null}
      {tiles.length ? (
        <div className={cn("flex gap-2 overflow-x-auto", packed ? "" : "grid grid-cols-2")}>
          {tiles.map((tile) => (
            <RemoteTile key={tile.id} stream={tile.stream} name={tile.name} small={packed} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RemoteTile({ stream, name, small }: { stream: MediaStream; name: string; small?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="relative">
      <video ref={ref} className={cn("rounded-lg bg-bar object-cover", small ? "size-16 shrink-0" : "aspect-video w-full")} autoPlay playsInline />
      <span className={cn("absolute bottom-1 left-1 truncate rounded bg-bar/80 px-1.5 text-[10px] text-bar-foreground", small ? "max-w-14" : "max-w-[80%]")}>{name}</span>
    </div>
  );
}
