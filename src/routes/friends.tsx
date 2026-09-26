import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { PaperStartFields } from "@/components/paper-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import {
  cardsForQuizFolder,
  clampTimeLimitMin,
  groupQuizSections,
  pickSectionCards,
  quizFolderOptions,
  todayIsoDate,
} from "@/lib/exam/quiz-assign";
import { createQuiz, joinQuiz } from "@/lib/exam/quiz";
import { quizPlayerId, rememberQuizName, rememberedQuizName } from "@/lib/exam/quiz-client";
import { rememberPaperPrefs } from "@/lib/exam/clipboard";
import { activeExamTemplate, useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/friends")({
  validateSearch: (raw: Record<string, unknown>) => ({ deck: String(raw.deck ?? "") }),
  component: FriendsHub,
});

type SectionDraft = { name: string; total: number; selected: boolean; count: string };

function FriendsHub() {
  const { deck: deckParam } = Route.useSearch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const decks = useExamStore((s) => s.decks);
  const cards = useExamStore((s) => s.cards);
  const folders = useExamStore((s) => s.folders ?? []);
  const hydrated = useExamStore((s) => s.hydrated);
  const folderOptions = useMemo(() => quizFolderOptions(decks, cards, folders), [decks, cards, folders]);
  const [folderId, setFolderId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [testDay, setTestDay] = useState(todayIsoDate);
  const [timeLimit, setTimeLimit] = useState("20");
  const [templateId, setTemplateId] = useState(() => activeExamTemplate()?.id ?? "");
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (folderId) return;
    const fromDeck = deckParam ? `deck:${deckParam}` : "";
    if (fromDeck && folderOptions.some((o) => o.id === fromDeck)) {
      setFolderId(fromDeck);
      return;
    }
    const first = folderOptions.find((o) => o.kind === "deck" && o.count > 0) ?? folderOptions[0];
    if (first) setFolderId(first.id);
  }, [deckParam, folderOptions, folderId]);

  useEffect(() => {
    const remembered = rememberedQuizName();
    if (remembered) setName(remembered);
    else if (user?.primaryEmail) setName(user.primaryEmail.split("@")[0] || "");
    else if (user?.displayName) setName(user.displayName);
  }, [user]);

  const packed = useMemo(
    () => cardsForQuizFolder(folderId, decks, cards, folders),
    [folderId, decks, cards, folders],
  );

  useEffect(() => {
    const groups = groupQuizSections(packed.cards);
    setSections(
      groups.map((g) => ({
        name: g.name,
        total: g.cards.length,
        selected: true,
        count: String(g.cards.length),
      })),
    );
  }, [packed.cards]);

  const groups = useMemo(() => groupQuizSections(packed.cards), [packed.cards]);
  const picks = sections
    .filter((s) => s.selected)
    .map((s) => ({ name: s.name, count: Math.max(0, Math.min(s.total, Number(s.count) || 0)) }));
  const chosen = pickSectionCards(groups, picks);
  const selectedCount = chosen.length;

  function toggleSection(name: string, on: boolean) {
    setSections((prev) =>
      prev.map((s) =>
        s.name === name ? { ...s, selected: on, count: on ? String(s.total) : "0" } : s,
      ),
    );
  }

  function setSectionCount(name: string, count: string) {
    setSections((prev) =>
      prev.map((s) => {
        if (s.name !== name) return s;
        const n = count.replace(/[^\d]/g, "");
        return { ...s, selected: true, count: n };
      }),
    );
  }

  async function createRoom() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name so friends can see you");
      return;
    }
    if (!chosen.length) {
      toast.error("Pick at least one question from a section");
      return;
    }
    rememberQuizName(display);
    rememberPaperPrefs({ template: templateId, minutes: clampTimeLimitMin(timeLimit) });
    setBusy(true);
    setError(null);
    try {
      const room = await createQuiz({
        data: {
          title: packed.label || "Friends quiz",
          hostId: quizPlayerId(),
          hostName: display,
          testDay,
          folder: packed.label,
          sectionPicks: picks.filter((p) => p.count > 0),
          timeLimitMin: clampTimeLimitMin(timeLimit),
          questions: chosen.map((c) => ({
            id: c.id,
            type: c.type,
            rule: c.rule,
            question: c.question,
            options: c.options,
            correct: c.correct,
            explanation: c.explanation,
            sourceSection: c.sourceSection,
          })),
        },
      });
      void navigate({ to: "/quiz/$code", params: { code: room.code }, search: { view: "" } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create quiz";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function joinRoom() {
    const display = name.trim();
    if (!display) {
      toast.error("Enter your name so friends can see you");
      return;
    }
    rememberQuizName(display);
    setBusy(true);
    try {
      const room = await joinQuiz({
        data: { code, playerId: quizPlayerId(), name: display },
      });
      void navigate({ to: "/quiz/$code", params: { code: room.code }, search: { view: "" } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(false);
    }
  }

  return (
    <StudyShell title="Friends quiz">
      <div className="mx-auto grid max-w-md gap-4 p-4">
        <div className="grid gap-2">
          <Label htmlFor="friend-name">Your name</Label>
          <Input id="friend-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown on the scoreboard" />
        </div>
        <section className="surface-3d grid gap-3 p-5">
          <h2 className="text-base font-semibold tracking-tight">Create a live test</h2>
          <Label htmlFor="friend-day">Test day</Label>
          <Input id="friend-day" type="date" value={testDay} onChange={(e) => setTestDay(e.target.value)} />
          <Label htmlFor="friend-folder">Folder</Label>
          <select
            id="friend-folder"
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm shadow-raised"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
          >
            {folderOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.kind === "notes" ? `Notes · ${opt.label}` : `${opt.label} (${opt.count})`}
              </option>
            ))}
          </select>
          <div className="grid gap-2">
            <Label>Questions from sections</Label>
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground">This folder has no questions.</p>
            ) : (
              <ul className="max-h-64 divide-y divide-border overflow-auto rounded-lg border border-border bg-card">
                {sections.map((section, i) => (
                  <li key={section.name} className="flex items-start gap-3 px-3 py-3">
                    <input
                      id={`section-${i}`}
                      type="checkbox"
                      className="mt-1 size-4 accent-primary"
                      checked={section.selected}
                      onChange={(e) => toggleSection(section.name, e.target.checked)}
                    />
                    <label htmlFor={`section-${i}`} className="min-w-0 flex-1 text-sm leading-snug">
                      {section.name}
                      <span className="mt-0.5 block text-xs text-muted-foreground">{section.total} in section</span>
                    </label>
                    <Input
                      aria-label={`Questions from ${section.name}`}
                      inputMode="numeric"
                      className={cn("h-10 w-16 text-center tabular-nums", !section.selected && "opacity-40")}
                      value={section.selected ? section.count : "0"}
                      disabled={!section.selected}
                      onChange={(e) => setSectionCount(section.name, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Questions</Label>
              <p className="flex h-11 items-center rounded-lg border border-border bg-card px-3 text-sm tabular-nums">
                {selectedCount}
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="friend-limit">Time limit (minutes)</Label>
              <Input
                id="friend-limit"
                inputMode="numeric"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value.replace(/[^\d]/g, ""))}
                onBlur={() => setTimeLimit(String(clampTimeLimitMin(timeLimit)))}
              />
              <p className="text-xs text-muted-foreground">1–180. Paper stays open until this ends.</p>
            </div>
          </div>
          <PaperStartFields
            total={selectedCount}
            count={String(selectedCount)}
            onCount={() => undefined}
            minutes={timeLimit}
            onMinutes={(v) => setTimeLimit(v)}
            templateId={templateId}
            onTemplate={setTemplateId}
            showCount={false}
            showMinutes={false}
          />
          <Button onClick={() => void createRoom()} disabled={busy || !hydrated || !selectedCount}>
            {busy ? "Creating…" : !hydrated ? "Loading…" : !selectedCount ? "Pick questions" : "Create room code"}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </section>
        <section className="surface-3d grid gap-3 p-5">
          <h2 className="text-base font-semibold tracking-tight">Join friends</h2>
          <Label htmlFor="friend-code">Room code</Label>
          <Input
            id="friend-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="font-mono tracking-widest"
            autoCapitalize="characters"
          />
          <Button variant="outline" onClick={() => void joinRoom()} disabled={busy}>
            Join
          </Button>
        </section>
      </div>
    </StudyShell>
  );
}
