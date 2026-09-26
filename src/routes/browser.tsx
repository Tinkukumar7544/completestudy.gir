import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useExamStore } from "@/lib/exam/store";
import { useFunctionAccess } from "@/lib/admin/use-copy";
import type { Card } from "@/lib/exam/types";

export const Route = createFileRoute("/browser")({
  validateSearch: (raw: Record<string, unknown>) => ({ deck: String(raw.deck ?? "") }),
  component: BrowseQuestions,
});

function isCorrect(card: Card, index: number) {
  if (Array.isArray(card.correct)) return card.correct.includes(index);
  return card.correct === index;
}

function BrowseQuestions() {
  const { deck: deckFilter } = Route.useSearch();
  const decks = useExamStore((s) => s.decks);
  const cards = useExamStore((s) => s.cards);
  const deleteCards = useExamStore((s) => s.deleteCards);
  const updateCard = useExamStore((s) => s.updateCard);
  const [query, setQuery] = useState("");
  const [edit, setEdit] = useState<Card | null>(null);
  const canEdit = useFunctionAccess("browser.edit");
  const canDelete = useFunctionAccess("browser.delete");
  const test = decks.find((deck) => deck.id === deckFilter);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((card) => {
      if (deckFilter && card.deckId !== deckFilter) return false;
      if (!q) return true;
      return card.question.toLowerCase().includes(q) || card.options.some((option) => option.toLowerCase().includes(q));
    });
  }, [cards, deckFilter, query]);

  function open(card: Card) {
    if (!canEdit.allowed) {
      toast.message(canEdit.reason === "locked" ? `${canEdit.name} is locked to ${canEdit.planName}` : "Editing is turned off");
      return;
    }
    setEdit({ ...card, options: [...card.options] });
  }

  return (
    <StudyShell title="Browse questions">
      <div className="border-b border-border bg-card p-3">
        <p className="text-sm font-medium">{test ? test.name.split("::").pop() : "All tests"}</p>
        <Input className="mt-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions" aria-label="Search questions" />
        <p className="mt-1 px-1 text-xs text-muted-foreground">{list.length} questions</p>
      </div>
      <ul>
        {list.map((card, index) => (
          <li key={card.id} className="flex items-start gap-2 border-b border-border bg-card px-3 py-3">
            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => open(card)}>
              <p className="text-xs text-muted-foreground">Question {index + 1}</p>
              <p className="text-sm">{card.question}</p>
            </button>
            {canDelete.allowed ? (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  deleteCards([card.id]);
                  toast.success("Question deleted");
                }}
              >
                Delete
              </Button>
            ) : null}
          </li>
        ))}
      </ul>

      <Dialog open={!!edit} onOpenChange={() => setEdit(null)}>
        <DialogContent className="max-h-[90dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit question</DialogTitle>
          </DialogHeader>
          {edit ? (
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="q-text">Question</Label>
                <Textarea id="q-text" value={edit.question} onChange={(e) => setEdit({ ...edit, question: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>{edit.type === "numerical" ? "Answer" : "Options"}</Label>
                {edit.type === "numerical" ? (
                  <Input value={String(edit.correct ?? "")} onChange={(e) => setEdit({ ...edit, correct: e.target.value })} aria-label="Correct answer" />
                ) : (
                  edit.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type={edit.type === "msq" ? "checkbox" : "radio"}
                        name="correct-option"
                        className="size-4"
                        checked={isCorrect(edit, index)}
                        aria-label={`Mark option ${index + 1} correct`}
                        onChange={() => {
                          if (edit.type === "msq") {
                            const current = Array.isArray(edit.correct) ? edit.correct : [];
                            const next = current.includes(index) ? current.filter((n) => n !== index) : [...current, index];
                            setEdit({ ...edit, correct: next });
                            return;
                          }
                          setEdit({ ...edit, correct: index });
                        }}
                      />
                      <Input
                        value={option}
                        aria-label={`Option ${index + 1}`}
                        onChange={(e) => {
                          const options = [...edit.options];
                          options[index] = e.target.value;
                          setEdit({ ...edit, options });
                        }}
                      />
                    </div>
                  ))
                )}
                {edit.type !== "numerical" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEdit({ ...edit, options: [...edit.options, ""] })}
                  >
                    Add option
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="q-explain">Explanation</Label>
                <Textarea id="q-explain" value={edit.explanation} onChange={(e) => setEdit({ ...edit, explanation: e.target.value })} />
              </div>
              <Button
                type="button"
                onClick={() => {
                  updateCard(edit);
                  setEdit(null);
                  toast.success("Question saved");
                }}
              >
                Save
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </StudyShell>
  );
}
