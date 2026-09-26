import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, LogOut, Share2 } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { DiscussStage } from "@/components/discuss-stage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  endDiscussion,
  joinDiscussion,
  leaveDiscussion,
  listDiscussion,
  MAX_DISC_PLAYERS,
  readyDiscussion,
  type DiscRoom,
} from "@/lib/exam/discussion";
import { discModeHint, discModeLabel, waitingConnect } from "@/lib/exam/discussion-room";
import { quizPlayerId, rememberQuizName, rememberedQuizName } from "@/lib/exam/quiz-client";

export const Route = createFileRoute("/discuss/$code")({
  component: DiscussRoomPage,
});

function DiscussRoomPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<DiscRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const me = quizPlayerId();

  useEffect(() => {
    setName(rememberedQuizName());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const next = await listDiscussion({ data: { code, playerId: me } });
        if (!cancelled) {
          setRoom(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Discussion not found");
      }
    }
    void refresh();
    const t = window.setInterval(() => void refresh(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [code, me]);

  const present = room?.players.filter((p) => !p.leftAt) ?? [];
  const joined = present.some((p) => p.playerId === me);
  const waiting = room ? waitingConnect(present) : 0;
  const display = name.trim() || rememberedQuizName() || "You";

  async function join() {
    const nextName = name.trim() || "Friend";
    setJoining(true);
    try {
      rememberQuizName(nextName);
      setRoom(await joinDiscussion({ data: { code, playerId: me, name: nextName } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setJoining(false);
    }
  }

  async function connect() {
    try {
      rememberQuizName(display);
      setRoom(await readyDiscussion({ data: { code, playerId: me, name: display } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not connect");
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(room?.code ?? code);
      toast.success("Code copied");
    } catch {
      toast.message(room?.code ?? code);
    }
  }

  async function shareCode() {
    const url = `${window.location.origin}/discuss/${room?.code ?? code}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: room?.title ?? "Discussion", text: room?.code, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      /* cancelled */
    }
  }

  if (error && !room) {
    return (
      <StudyShell title="Group discussion">
        <p className="p-6 text-sm text-muted-foreground">{error}</p>
      </StudyShell>
    );
  }

  if (!room) {
    return (
      <StudyShell title="Group discussion">
        <p className="p-6 text-sm text-muted-foreground">Loading room…</p>
      </StudyShell>
    );
  }

  return (
    <StudyShell title={room.title}>
      <div className="mx-auto grid max-w-md gap-4 p-4 pb-10">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Room code</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-[0.3em]">{room.code}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void copyCode()}>
              <Copy className="size-4" /> Copy code
            </Button>
            <Button variant="outline" size="sm" onClick={() => void shareCode()}>
              <Share2 className="size-4" /> Share
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {discModeLabel(room.mode)} · {present.length}/{MAX_DISC_PLAYERS}
          </p>
          {room.prompt ? <p className="mt-3 text-sm">{room.prompt}</p> : null}
          <p className="mt-2 text-xs text-muted-foreground">{discModeHint(room.mode)}</p>
          {room.endedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">This discussion has ended</p>
          ) : room.startedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">Live. The highlighted box is the active speaker.</p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Join first. Then each person taps Connect. The discussion starts when every name is connected.
            </p>
          )}
        </div>

        {!joined && !room.endedAt ? (
          <div className="grid gap-3">
            <Label htmlFor="disc-name">Your name</Label>
            <Input id="disc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown on the tiles" />
            <Button onClick={() => void join()} disabled={joining}>
              {joining ? "Joining…" : "Join this discussion"}
            </Button>
          </div>
        ) : null}

        {joined && !room.startedAt && !room.endedAt ? (
          <section>
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Participants</h2>
            <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
              {present.map((p) => (
                <li key={p.playerId} className="flex min-h-14 items-center gap-3 px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {p.name}
                    {p.playerId === me ? " (you)" : ""}
                  </span>
                  {p.readyAt ? (
                    <span className="text-xs font-medium text-review">Connected</span>
                  ) : p.playerId === me ? (
                    <Button className="h-11 px-5" onClick={() => void connect()}>
                      Connect
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Waiting</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              {waiting ? `Still waiting on ${waiting} to tap Connect.` : "Starting…"}
            </p>
          </section>
        ) : null}

        {joined && room.startedAt && !room.endedAt ? (
          <DiscussStage room={room} me={me} name={display} onRoom={setRoom} />
        ) : null}

        {joined ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                void leaveDiscussion({ data: { code: room.code, playerId: me } })
                  .then(() => void navigate({ to: "/coaching", search: { view: "discussions" } }))
                  .catch((err) => toast.error(err instanceof Error ? err.message : "Could not leave"));
              }}
            >
              <LogOut className="size-4" />
              Leave
            </Button>
            {room.isHost && !room.endedAt ? (
              <Button
                variant="outline"
                onClick={() => {
                  void endDiscussion({ data: { code: room.code, playerId: me } })
                    .then(setRoom)
                    .catch((err) => toast.error(err instanceof Error ? err.message : "Could not end"));
                }}
              >
                End discussion
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </StudyShell>
  );
}
