import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Send } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinChat, listChat, sendChat, type ChatRoom } from "@/lib/exam/chat";
import { quizPlayerId, rememberQuizName, rememberedQuizName } from "@/lib/exam/quiz-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$code")({
  component: ChatRoomPage,
});

function ChatRoomPage() {
  const { code } = Route.useParams();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [joining, setJoining] = useState(false);
  const [sending, setSending] = useState(false);
  const me = quizPlayerId();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(rememberedQuizName());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const next = await listChat({ data: code });
        if (!cancelled) {
          setRoom(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Chat not found");
      }
    }
    void refresh();
    const t = window.setInterval(() => void refresh(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [code]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [room?.messages.length]);

  const joined = Boolean(room?.members.some((m) => m.playerId === me));

  async function join() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name");
      return;
    }
    rememberQuizName(display);
    setJoining(true);
    try {
      const next = await joinChat({ data: { code, playerId: me, name: display } });
      setRoom(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setJoining(false);
    }
  }

  async function send() {
    const body = draft.trim();
    if (!body) return;
    const display = rememberedQuizName() || name.trim() || "You";
    setSending(true);
    setDraft("");
    try {
      const next = await sendChat({ data: { code, playerId: me, name: display, body } });
      setRoom(next);
    } catch (err) {
      setDraft(body);
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setSending(false);
    }
  }

  function copyCode() {
    void navigator.clipboard.writeText(code.toUpperCase());
    toast.success("Code copied — send it to your friend");
  }

  return (
    <StudyShell title={room?.title || "1-1 chat"}>
      <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <div>
            <p className="font-mono text-lg tracking-widest">{code.toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">
              {room ? `${room.members.length}/2 in this chat` : "Connecting…"}
            </p>
          </div>
          <Button size="icon" variant="outline" onClick={copyCode} aria-label="Copy code">
            <Copy className="size-4" />
          </Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {!joined && !error ? (
          <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
            <Label htmlFor="chat-join-name">Your name</Label>
            <Input id="chat-join-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown in chat" />
            <Button onClick={() => void join()} disabled={joining}>
              {joining ? "Joining…" : "Join chat"}
            </Button>
          </div>
        ) : null}

        {joined ? (
          <>
            <div ref={scroller} className="min-h-64 flex-1 space-y-2 overflow-y-auto rounded-lg border border-border bg-card p-3">
              {room && room.messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No messages yet. Say hello.</p>
              ) : null}
              {room?.messages.map((m) => {
                const mine = m.playerId === me;
                return (
                  <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
                    <p className="mb-0.5 text-[11px] text-muted-foreground">{m.name}</p>
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
              })}
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
                placeholder="Message"
                aria-label="Message"
                maxLength={800}
              />
              <Button type="submit" size="icon" disabled={sending || !draft.trim()} aria-label="Send">
                <Send className="size-4" />
              </Button>
            </form>
          </>
        ) : null}
      </div>
    </StudyShell>
  );
}
