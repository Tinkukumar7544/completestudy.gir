import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Radio, Share2, StickyNote, Users } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { createChat, joinChat, sendChat } from "@/lib/exam/chat";
import { joinQuiz } from "@/lib/exam/quiz";
import { quizPlayerId, rememberQuizName, rememberedQuizName } from "@/lib/exam/quiz-client";
import { useExamStore } from "@/lib/exam/store";
import { useAdminCopy, useFunctionAccess } from "@/lib/admin/use-copy";

export const Route = createFileRoute("/connect")({
  component: ConnectHub,
});

function ConnectHub() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [name, setName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [chatCode, setChatCode] = useState("");
  const [busy, setBusy] = useState<"quiz" | "chat" | "join-chat" | "notes" | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const notes = useExamStore((s) => s.notes ?? []);
  const copy = useAdminCopy();
  const live = useFunctionAccess("connect.live");
  const join = useFunctionAccess("connect.join");
  const chat = useFunctionAccess("connect.chat");
  const share = useFunctionAccess("connect.share");
  const recentNotes = useMemo(
    () => notes.slice().sort((a, b) => b.modifiedAt - a.modifiedAt).slice(0, 40),
    [notes],
  );

  useEffect(() => {
    const remembered = rememberedQuizName();
    if (remembered) setName(remembered);
    else if (user?.primaryEmail) setName(user.primaryEmail.split("@")[0] || "");
    else if (user?.displayName) setName(user.displayName);
  }, [user]);

  async function joinLiveTest() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name so friends can see you");
      return;
    }
    rememberQuizName(display);
    setBusy("quiz");
    try {
      const room = await joinQuiz({
        data: { code: quizCode, playerId: quizPlayerId(), name: display },
      });
      void navigate({ to: "/quiz/$code", params: { code: room.code }, search: { view: "" } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(null);
    }
  }

  async function startChat() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name so your friend can see you");
      return;
    }
    rememberQuizName(display);
    setBusy("chat");
    try {
      const room = await createChat({
        data: { hostId: quizPlayerId(), hostName: display, title: "1-1 chat" },
      });
      void navigate({ to: "/chat/$code", params: { code: room.code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start chat");
    } finally {
      setBusy(null);
    }
  }

  async function joinExistingChat() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name so your friend can see you");
      return;
    }
    rememberQuizName(display);
    setBusy("join-chat");
    try {
      const room = await joinChat({
        data: { code: chatCode, playerId: quizPlayerId(), name: display },
      });
      void navigate({ to: "/chat/$code", params: { code: room.code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join chat");
    } finally {
      setBusy(null);
    }
  }

  async function shareNote(noteId: string) {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name so your friend can see you");
      return;
    }
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    rememberQuizName(display);
    setBusy("notes");
    try {
      const room = await createChat({
        data: { hostId: quizPlayerId(), hostName: display, title: note.title.trim() || "Shared note" },
      });
      const files = (note.files ?? []).map((f) => f.name).filter(Boolean);
      const body =
        [note.title.trim() || "Untitled", note.body.trim(), files.length ? `Files: ${files.join(", ")}` : ""]
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 8000) || "Empty note";
      await sendChat({
        data: { code: room.code, playerId: quizPlayerId(), name: display, body },
      });
      setShareOpen(false);
      void navigate({ to: "/chat/$code", params: { code: room.code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not share this note");
    } finally {
      setBusy(null);
    }
  }

  return (
    <StudyShell title={copy.connect.name}>
      <div className="mx-auto grid max-w-md gap-5 p-4">
        <div className="surface-3d grid gap-2 p-4">
          <Label htmlFor="connect-name">Your name</Label>
          <Input
            id="connect-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Shown to friends"
          />
        </div>

        <section className="surface-3d lift grid gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn">
              <Radio className="size-5" />
            </span>
            <h2 className="text-base font-semibold tracking-tight">{copy.connect.liveTitle}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{copy.connect.liveBody}</p>
          {live.allowed ? (
          <Button onClick={() => void navigate({ to: "/friends", search: { deck: "" } })}>
            <Users className="size-4" />
            {copy.connect.liveButton}
          </Button>
          ) : live.reason === "locked" ? (
            <Button variant="outline" onClick={() => void navigate({ to: "/subscriptions" })}>Unlock {live.planName}</Button>
          ) : null}
          {join.allowed || join.reason === "locked" ? <Label htmlFor="connect-quiz">{copy.connect.joinLabel}</Label> : null}
          {join.allowed ? (
          <>
          <Input
            id="connect-quiz"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="font-mono tracking-widest"
            autoCapitalize="characters"
          />
          <Button variant="outline" onClick={() => void joinLiveTest()} disabled={busy === "quiz"}>
            {busy === "quiz" ? "Joining…" : copy.connect.joinButton}
          </Button>
          </>
          ) : join.reason === "locked" ? (
            <Button variant="outline" onClick={() => void navigate({ to: "/subscriptions" })}>Unlock {join.planName}</Button>
          ) : null}
        </section>

        <section className="surface-3d lift grid gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn">
              <MessageCircle className="size-5" />
            </span>
            <h2 className="text-base font-semibold tracking-tight">{copy.connect.chatTitle}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{copy.connect.chatBody}</p>
          {chat.allowed ? (
          <Button onClick={() => void startChat()} disabled={busy === "chat"}>
            {busy === "chat" ? "Starting…" : copy.connect.chatButton}
          </Button>
          ) : chat.reason === "locked" ? (
            <Button variant="outline" onClick={() => void navigate({ to: "/subscriptions" })}>Unlock {chat.planName}</Button>
          ) : null}
          {chat.allowed ? (
          <>
          <Label htmlFor="connect-chat">Join a chat</Label>
          <Input
            id="connect-chat"
            value={chatCode}
            onChange={(e) => setChatCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="font-mono tracking-widest"
            autoCapitalize="characters"
          />
          <Button variant="outline" onClick={() => void joinExistingChat()} disabled={busy === "join-chat"}>
            {busy === "join-chat" ? "Joining…" : "Join chat"}
          </Button>
          </>
          ) : null}
        </section>

        <section className="surface-3d lift grid gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn">
              <Share2 className="size-5" />
            </span>
            <h2 className="text-base font-semibold tracking-tight">{copy.connect.notesTitle}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{copy.connect.notesBody}</p>
          {share.allowed ? (
          <Button variant="outline" onClick={() => setShareOpen(true)} disabled={busy === "notes"}>
            <StickyNote className="size-4" />
            {busy === "notes" ? "Sharing…" : copy.connect.notesButton}
          </Button>
          ) : share.reason === "locked" ? (
            <Button variant="outline" onClick={() => void navigate({ to: "/subscriptions" })}>Unlock {share.planName}</Button>
          ) : null}
        </section>
      </div>
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.connect.shareDialogTitle}</DialogTitle>
            <DialogDescription>{copy.connect.shareDialogBody}</DialogDescription>
          </DialogHeader>
          <ul className="max-h-72 divide-y divide-border overflow-auto rounded-lg border border-border">
            {recentNotes.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">No notes yet.</li>
            ) : (
              recentNotes.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-center px-3 py-2 text-left text-sm"
                    onClick={() => void shareNote(note.id)}
                  >
                    <span className="truncate">{note.title.trim() || "Untitled"}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}
