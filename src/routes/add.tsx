import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { parseQuestionText } from "@/lib/exam/parser";
import { useExamStore } from "@/lib/exam/store";
import { useAdminCopy } from "@/lib/admin/use-copy";
import type { QuestionType } from "@/lib/exam/types";
import { HtmlDropzone } from "@/components/html-dropzone";
import { importGeneratedTest } from "@/lib/exam/html-import";

export const Route = createFileRoute("/add")({
  validateSearch: (raw: Record<string, unknown>) => ({
    deck: String(raw.deck ?? ""),
    tab: raw.tab === "html" || raw.tab === "paste" ? String(raw.tab) : "one",
    folder: String(raw.folder ?? ""),
  }),
  component: AddNote,
});

function AddNote() {
  const { tab: tabParam, folder } = Route.useSearch();
  const navigate = useNavigate();
  const copy = useAdminCopy();
  const [name, setName] = useState("New test");
  const [type, setType] = useState<QuestionType>("mcq");
  const [question, setQuestion] = useState("");
  const [rule, setRule] = useState("");
  const [tags, setTags] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [paste, setPaste] = useState("");
  const parsed = useMemo(() => parseQuestionText(paste), [paste]);

  async function createFrom(questions: { type: QuestionType; rule: string; question: string; options: string[]; correct: number | number[] | string; explanation: string }[]) {
    if (!questions.length) {
      toast.error("Add at least one question");
      return;
    }
    const result = await importGeneratedTest(name, questions, folder || null);
    toast.success(result.questions ? `${result.questions} questions imported. The test can use any saved template.` : "Test created");
    if (result.deckId) void navigate({ to: "/overview/$deckId", params: { deckId: result.deckId } });
  }

  function saveOne() {
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim()) {
      toast.error("Front (question) is empty");
      return;
    }
    if (type !== "numerical" && opts.length < 2) {
      toast.error("Need at least two options");
      return;
    }
    void createFrom([
      {
        type,
        rule: rule.trim() || "General",
        question: question.trim(),
        options: opts,
        correct,
        explanation: explanation.trim(),
      },
    ]);
  }

  return (
    <StudyShell title={copy.tests.addCreate}>
      <div className="mx-auto max-w-lg p-4">
        {copy.tests.importNotice ? (
        <p
          className="mb-4 rounded-md px-3 py-3 text-base font-semibold leading-6"
          style={{ background: copy.tests.headerColor, color: "#1a1400", boxShadow: "inset 0 0 0 2px #c9a000" }}
        >
          {copy.tests.importNotice}
        </p>
        ) : null}
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Type</Label>
            <select
              className="h-11 rounded-md border border-border bg-card px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as QuestionType)}
            >
              <option value="mcq">MCQ (one answer)</option>
              <option value="msq">MSQ (multi)</option>
              <option value="numerical">Numerical</option>
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="test-name">Test name</Label>
            <Input id="test-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <Tabs defaultValue={tabParam} className="mt-4">
          <TabsList>
            <TabsTrigger value="one">Add one</TabsTrigger>
            <TabsTrigger value="paste">Paste set</TabsTrigger>
            <TabsTrigger value="html">HTML test</TabsTrigger>
          </TabsList>
          <TabsContent value="one">
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Front</Label>
                <Textarea className="min-h-24" value={question} onChange={(e) => setQuestion(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Tags / topic</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={rule} onChange={(e) => setRule(e.target.value)} placeholder="Topic" />
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags space-separated" />
                </div>
              </div>
              {type !== "numerical" && (
                <div className="grid gap-2">
                  <Label>Options — tap letter for the answer</Label>
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Button type="button" size="icon" variant={correct === i ? "default" : "outline"} onClick={() => setCorrect(i)}>
                        {String.fromCharCode(65 + i)}
                      </Button>
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const next = [...options];
                          next[i] = e.target.value;
                          setOptions(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="grid gap-1.5">
                <Label>Back / explanation</Label>
                <Textarea className="min-h-20" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
              </div>
              <Button onClick={saveOne}>Create test</Button>
            </div>
          </TabsContent>
          <TabsContent value="paste">
            <Textarea
              className="min-h-56 font-mono text-[13px]"
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder={"1. Question\nA) ...\nB) ...\nAnswer: A\nExplanation: ..."}
            />
            <p className="mt-2 text-sm text-muted-foreground">{parsed.questions.length} questions detected</p>
            <Button
              className="mt-3"
              disabled={!parsed.questions.length}
              onClick={() => void createFrom(parsed.questions)}
            >
              Import and create HTML test
            </Button>
          </TabsContent>
          <TabsContent value="html">
            <HtmlDropzone
              onImported={(id) => {
                if (id && folder) useExamStore.getState().moveDeck(id, folder);
                if (id) void navigate({ to: "/overview/$deckId", params: { deckId: id } });
              }}
            />
          </TabsContent>
        </Tabs>
        <Button variant="ghost" className="mt-4" onClick={() => void navigate({ to: "/" })}>
          Close
        </Button>
      </div>
    </StudyShell>
  );
}
