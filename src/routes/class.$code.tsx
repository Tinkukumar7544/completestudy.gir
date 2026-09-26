import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, LogOut } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { ClassStage } from "@/components/class-stage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  endDiscussion,
  joinDiscussion,
  leaveDiscussion,
  listDiscussion,
  type DiscRoom,
} from "@/lib/exam/discussion";
import { quizPlayerId, rememberQuizName, rememberedQuizName } from "@/lib/exam/quiz-client";

export const Route = createFileRoute("/class/$code")({
  component: LiveClassPage,
});

function LiveClassPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<DiscRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const me = quizPlayerId();

  useEffect(() => {
    setName(rememberedQuizName() || "Student");
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
        if (!cancelled) setError(err instanceof Error ? err.message : "Class not found");
      }
    }
    void refresh();
    const id = window.setInterval(() => void refresh(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [code, me]);

  const joined = Boolean(room?.players.some((p) => p.playerId === me && !p.leftAt));
  const live = Boolean(room && room.startedAt && !room.endedAt && joined);

  async function join() {
    const label = name.trim() || "Student";
    setJoining(true);
    try {
      rememberQuizName(label);
      const next = await joinDiscussion({ data: { code, playerId: me, name: label } });
      setRoom(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join");
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setJoining(false);
    }
  }

  async function leave() {
    try {
      if (room?.isHost) await endDiscussion({ data: { code, playerId: me } });
      else await leaveDiscussion({ data: { code, playerId: me } });
    } catch {
      /* still leave the page */
    }
    void navigate({ to: "/coaching", search: { view: "live" } });
  }

  if (live && room) {
    return (
      <StudyShell title={room.title} immersive hideHeader>
        <ClassStage
          room={room}
          me={me}
          name={name.trim() || "You"}
          onRoom={setRoom}
          onLeave={() => void leave()}
        />
      </StudyShell>
    );
  }

  return (
    <StudyShell title="Live class">
      <div className="mx-auto grid max-w-md gap-4 p-4">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {room?.endedAt ? <p className="text-sm text-muted-foreground">This class has ended.</p> : null}
        <div className="surface-3d grid gap-3 p-4">
          <div>
            <p className="font-semibold tracking-tight">{room?.title ?? "Joining…"}</p>
            <p className="font-mono text-sm tracking-widest text-muted-foreground">{code}</p>
            {room ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {room.players.filter((p) => !p.leftAt).length} connected
              </p>
            ) : null}
          </div>
          {!joined && !room?.endedAt ? (
            <>
              <div>
                <Label htmlFor="class-name">Your name</Label>
                <Input id="class-name" className="mt-2" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <Button onClick={() => void join()} disabled={joining}>
                Join class
              </Button>
            </>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(code).then(
                  () => toast.success("Code copied"),
                  () => toast.error("Could not copy"),
                );
              }}
            >
              <Copy className="size-4" />
              Copy code
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => void leave()}>
              <LogOut className="size-4" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </StudyShell>
  );
}
