import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ClipboardPaste, FilePlus, FileUp, FolderPlus, Mail, Monitor, MoreVertical, Plus, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { AdminLogo } from "@/components/admin-logo";
import { DirectoryInput } from "@/components/directory-input";
import { Glyph3D } from "@/components/glyphs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAdminCopy, useAdminState } from "@/lib/admin/use-copy";
import { functionAccess } from "@/lib/admin/controls";
import { clearClip, getClip, setClip } from "@/lib/exam/clipboard";
import { importBrowserDirectory } from "@/lib/exam/folder-import";
import { importHtmlTest } from "@/lib/exam/html-import";
import { deckReviewDays, isReviewDayFolder, isReviewDays, reviewLocked, reviewStatsFor, type ReviewStats } from "@/lib/exam/review-ladder";
import type { Card, Deck } from "@/lib/exam/types";
import { useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

type Arrange = "name" | "date" | "type" | "manual";
type IconSize = "sm" | "md" | "lg";

function leafName(name: string) {
  return name.split("::").pop() ?? name;
}

function parentPath(name: string) {
  const cut = name.lastIndexOf("::");
  return cut === -1 ? "" : name.slice(0, cut);
}

function isFolder(deck: Deck) {
  return deck.kind === "folder" || deck.description === "Folder";
}

function fileKind(deck: Deck) {
  const text = `${deck.name} ${deck.description}`.toLowerCase();
  if (text.includes(".html") || text.includes("uploaded")) return "HTML";
  if (text.includes(".txt") || text.includes(".md") || text.includes(".csv") || text.includes("text ")) return "TXT";
  return "TEST";
}

function TextFileIcon({ kind }: { kind: string }) {
  return (
    <span className="grid size-10 place-items-center rounded-xl bg-muted text-[10px] font-semibold tracking-wide text-primary">
      {kind}
    </span>
  );
}

export function TestFolderView({ onTitle }: { onTitle?: (title: string) => void }) {
  const navigate = useNavigate();
  const decks = useExamStore((s) => s.decks);
  const cards = useExamStore((s) => s.cards);
  const createDeck = useExamStore((s) => s.createDeck);
  const renameDeck = useExamStore((s) => s.renameDeck);
  const deleteDeck = useExamStore((s) => s.deleteDeck);
  const moveDeck = useExamStore((s) => s.moveDeck);
  const duplicateDeck = useExamStore((s) => s.duplicateDeck);
  const reorderDecks = useExamStore((s) => s.reorderDecks);
  const setDeckLogo = useExamStore((s) => s.setDeckLogo);
  const addCards = useExamStore((s) => s.addCards);
  const rollReviews = useExamStore((s) => s.rollReviews);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [arrange, setArrange] = useState<Arrange>("name");
  const [size, setSize] = useState<IconSize>("md");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);
  const copy = useAdminCopy();
  const admin = useAdminState();
  const allow = (id: string) => functionAccess(admin, id).allowed;
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const deskRef = useRef<HTMLInputElement>(null);
  const [fab, setFab] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    rollReviews();
  }, [rollReviews]);

  const visible = decks;
  const current = visible.find((deck) => deck.id === currentId && isFolder(deck)) ?? null;
  const currentPath = current?.name ?? "";

  const items = useMemo(() => {
    const rows = visible.filter((deck) => parentPath(deck.name) === currentPath);
    const foldersFirst = (a: Deck, b: Deck) => Number(isFolder(b)) - Number(isFolder(a));
    const copy = rows.slice();
    if (arrange === "date") copy.sort((a, b) => foldersFirst(a, b) || b.createdAt - a.createdAt);
    else if (arrange === "type") copy.sort((a, b) => foldersFirst(a, b) || fileKind(a).localeCompare(fileKind(b)) || leafName(a.name).localeCompare(leafName(b.name)));
    else if (arrange === "manual") copy.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || leafName(a.name).localeCompare(leafName(b.name)));
    else copy.sort((a, b) => foldersFirst(a, b) || leafName(a.name).localeCompare(leafName(b.name)));
    copy.sort((a, b) => reviewRank(a.id) - reviewRank(b.id));
    return copy;
  }, [visible, currentPath, arrange]);

  function openItem(deck: Deck) {
    if (isFolder(deck)) {
      setCurrentId(deck.id);
      return;
    }
    void navigate({ to: "/overview/$deckId", params: { deckId: deck.id } });
  }

  function makeFolder() {
    if (current?.id.startsWith("review-")) {
      toast.message("These folders are created automatically");
      setFolderOpen(false);
      return;
    }
    const name = folderName.trim();
    if (!name) return;
    const full = current ? `${current.name}::${name}` : name;
    createDeck(full, "Folder", "folder");
    setFolderName("");
    setFolderOpen(false);
    toast.success(current ? "Subfolder created" : "Folder created");
  }

  function pasteHere() {
    const clip = getClip();
    if (!clip || clip.kind !== "deck") {
      toast.message("Cut or copy an item first");
      return;
    }
    if (clip.action === "cut") {
      moveDeck(clip.id, current?.id ?? null);
      clearClip();
      toast.success("Moved");
    } else {
      const id = duplicateDeck(clip.id, current?.id ?? null);
      if (!id) toast.error("Could not paste here");
      else toast.success("Pasted");
    }
  }

  async function onUpload(file: File) {
    const lower = file.name.toLowerCase();
    if (lower.endsWith(".html") || lower.endsWith(".htm")) {
      const result = await importHtmlTest(file);
      if (result.deckId && current) moveDeck(result.deckId, current.id);
      toast.success(result.questions ? `${result.questions} questions from ${result.title}` : `${file.name} added`);
      return;
    }
    const text = await file.text();
    const full = current ? `${current.name}::${file.name}` : file.name;
    const id = createDeck(full, `Text ${file.name}`, "deck");
    addCards(id, [
      {
        type: "mcq",
        rule: "",
        question: text.slice(0, 4000) || file.name,
        options: ["Seen"],
        correct: 0,
        explanation: "",
      },
    ]);
    toast.success(`${file.name} added`);
  }

  function dropOn(target: Deck) {
    if (!dragId || dragId === target.id) return;
    if (isFolder(target)) {
      moveDeck(dragId, target.id);
      setDragId(null);
      return;
    }
    const next = items.map((item) => item.id).filter((id) => id !== dragId);
    const at = next.indexOf(target.id);
    next.splice(at < 0 ? next.length : at, 0, dragId);
    reorderDecks(next);
    setArrange("manual");
    setDragId(null);
  }

  useEffect(() => {
    onTitle?.(current ? leafName(current.name) : copy.tests.name);
  }, [current, copy.tests.name, onTitle]);

  const crumbs = current ? current.name.split("::") : [];
  const rowHeight = size === "sm" ? "min-h-14" : size === "lg" ? "min-h-20" : "min-h-16";

  function goRoot() {
    setCurrentId(null);
  }

  function goCrumb(index: number) {
    const path = crumbs.slice(0, index + 1).join("::");
    const folder = visible.find((deck) => deck.name === path && isFolder(deck));
    setCurrentId(folder?.id ?? null);
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".html,.htm,.txt,.md,.csv,text/html,text/plain"
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          void (async () => {
            for (const file of files) {
              try {
                await onUpload(file);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : `Could not add ${file.name}`);
              }
            }
            if (files.length > 1) toast.message(`${files.length} files added`);
          })();
        }}
      />
      <DirectoryInput
        inputRef={phoneRef}
        onFiles={(list) => {
          if (!list?.length) return;
          void importBrowserDirectory(list, { source: "phone" })
            .then((result) => {
              toast.success(`${result.files} files from ${result.name}`);
              void navigate({ to: "/desk", search: { folder: result.folderId, from: "tests" } });
            })
            .catch((err) => toast.error(err instanceof Error ? err.message : "Could not link that folder"));
        }}
      />
      <DirectoryInput
        inputRef={deskRef}
        onFiles={(list) => {
          if (!list?.length) return;
          void importBrowserDirectory(list, { source: "desk" })
            .then((result) => {
              toast.success(`${result.files} files from ${result.name}`);
              void navigate({ to: "/desk", search: { folder: result.folderId, from: "tests" } });
            })
            .catch((err) => toast.error(err instanceof Error ? err.message : "Could not link that folder"));
        }}
      />
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
        <button type="button" className={cn("shrink-0 rounded-sm px-1 text-sm", currentId ? "text-primary" : "font-medium")} onClick={goRoot}>
          {copy.tests.name}
        </button>
        {crumbs.map((name, index) => (
          <span key={`${name}-${index}`} className="flex shrink-0 items-center gap-2">
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              type="button"
              className={cn("max-w-32 truncate rounded-sm px-1 text-sm", index === crumbs.length - 1 ? "font-medium" : "text-primary")}
              onClick={() => goCrumb(index)}
            >
              {name}
            </button>
          </span>
        ))}
        <select className="ml-auto h-8 shrink-0 rounded-md border border-border bg-card px-2 text-xs" value={arrange} onChange={(e) => setArrange(e.target.value as Arrange)} aria-label="Arrange">
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="type">Type</option>
          <option value="manual">Order</option>
        </select>
        <select className="h-8 shrink-0 rounded-md border border-border bg-card px-2 text-xs" value={size} onChange={(e) => setSize(e.target.value as IconSize)} aria-label="Size">
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>
      <div className="min-h-72">
        {current && deckReviewDays(current) ? (
          <ReviewTools
            deck={current}
            decks={decks}
            cards={cards}
            onPractice={
              isReviewDayFolder(current)
                ? () => {
                    if (current.reviewDays && isReviewDays(current.reviewDays) && reviewLocked(current.createdAt, current.reviewDays)) {
                      toast.message("This folder is locked. The attempt window has ended.");
                      return;
                    }
                    void navigate({ to: "/overview/$deckId", params: { deckId: current.id } });
                  }
                : undefined
            }
          />
        ) : null}
        {items.length === 0 ? (
          <p className="px-6 py-12 pb-40 text-center text-sm text-muted-foreground">
            {current ? "This folder is empty. Add a subfolder or an HTML file." : copy.tests.empty}
          </p>
        ) : (
          <ul className="grid gap-3 px-4 pb-36" onDragOver={(event) => event.preventDefault()}>
            {items.filter((item) => allow("tests.review") || !item.id.startsWith("review-")).map((item) => {
              const folder = isFolder(item);
              const system = item.id.startsWith("review-");
              const stats = reviewStatsFor(item, decks, cards);
              const nested = visible.filter((deck) => deck.name.startsWith(`${item.name}::`));
              const folderCount = nested.filter(isFolder).length;
              const fileCount = nested.filter((deck) => !isFolder(deck)).length;
              return (
                <li
                  key={item.id}
                  draggable={!system}
                  onDragStart={() => { if (!system) setDragId(item.id); }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    dropOn(item);
                  }}
                  className={cn("surface-3d flex items-stretch overflow-hidden", system ? "border border-zinc-300 shadow-[inset_0_0_0_1px_rgba(210,214,220,0.95)]" : "lift")}
                >
                  <button type="button" className={cn("flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left", rowHeight)} onClick={() => openItem(item)}>
                    <AdminLogo
                      src={item.logo}
                      label={leafName(item.name)}
                      onChange={(logo) => setDeckLogo(item.id, logo)}
                      fallback={
                        <span className="relative">
                          {folder ? <Glyph3D name={folderCount ? "folder-open" : "folder"} alt="" size="md" /> : <TextFileIcon kind={fileKind(item)} />}
                          {stats ? (
                            <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-card text-[8px] font-semibold" style={{ color: copy.tests.ringPending, boxShadow: `inset 0 0 0 1.5px ${copy.tests.ringPending}` }}>
                              {stats.pending}
                            </span>
                          ) : null}
                        </span>
                      }
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-semibold tracking-tight">{reviewTitle(item, copy)}</span>
                      <span className="text-xs text-muted-foreground">
                        {stats
                          ? `${stats.daysLeft} day${stats.daysLeft === 1 ? "" : "s"} left · ${stats.correct} correct · ${stats.pending} pending`
                          : folder
                          ? `${folderCount ? `${folderCount} folder${folderCount === 1 ? "" : "s"}` : "Folder"}${fileCount ? ` · ${fileCount} item${fileCount === 1 ? "" : "s"}` : ""}`
                          : fileKind(item)}
                      </span>
                      {stats ? <PendingDots count={stats.pending} color={copy.tests.ringPending} /> : null}
                    </span>
                    {stats ? <StatCircles stats={stats} /> : null}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="flex w-10 items-center justify-center text-muted-foreground" aria-label={`${leafName(item.name)} menu`}>
                        <MoreVertical className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openItem(item)}>{folder ? "Open" : "Open test"}</DropdownMenuItem>
                      {system ? null : (
                        <>
                      <DropdownMenuItem
                        onSelect={() => {
                          setClip({ kind: "deck", action: "cut", id: item.id });
                          toast.success("Cut");
                        }}
                      >
                        Cut
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setClip({ kind: "deck", action: "copy", id: item.id });
                          toast.success("Copied");
                        }}
                      >
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={pasteHere}>Paste here</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setRenameId(item.id);
                          setRenameValue(leafName(item.name));
                        }}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onSelect={() => { deleteDeck(item.id); toast.success(folder ? "Folder deleted" : "Deleted"); }}>
                        {folder ? "Delete folder" : "Delete"}
                      </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="fixed right-4 bottom-28 z-20 flex flex-col items-end gap-3">
        {fab ? (
          <div className="mb-1 flex flex-col items-end gap-2">
            {allow("tests.mail") ? (
            <FabLabel
              label={copy.tests.addEmail}
              onClick={() => {
                setFab(false);
                void navigate({ to: "/mail", search: { from: "tests", label: "", message: "", connector: "Gmail" } });
              }}
            >
              <Mail className="size-4" />
            </FabLabel>
            ) : null}
            {allow("tests.phone") ? (
            <FabLabel label={copy.tests.addPhone} onClick={() => { setFab(false); phoneRef.current?.click(); }}>
              <Smartphone className="size-4" />
            </FabLabel>
            ) : null}
            {allow("tests.desk") ? (
            <FabLabel label={copy.tests.addDesk} onClick={() => { setFab(false); deskRef.current?.click(); }}>
              <Monitor className="size-4" />
            </FabLabel>
            ) : null}
            {allow("tests.create") ? (
            <FabLabel
              label={copy.tests.addCreate}
              onClick={() => {
                setFab(false);
                void navigate({ to: "/add", search: { deck: "", tab: "paste", folder: current?.id ?? "" } });
              }}
            >
              <FilePlus className="size-4" />
            </FabLabel>
            ) : null}
            {allow("tests.paste") ? (
            <FabLabel label={copy.tests.addPaste} onClick={() => { setFab(false); pasteHere(); }}>
              <ClipboardPaste className="size-4" />
            </FabLabel>
            ) : null}
            {allow("tests.import") ? (
            <FabLabel label={copy.tests.addFiles} onClick={() => { setFab(false); fileRef.current?.click(); }}>
              <FileUp className="size-4" />
            </FabLabel>
            ) : null}
          </div>
        ) : null}
        <Button
          size="icon"
          variant="secondary"
          className="size-12 rounded-full shadow-raised"
          aria-label={current ? "New subfolder" : "New folder"}
          onClick={() => {
            if (!allow("tests.folders")) {
              toast.message("Folders are turned off");
              return;
            }
            setFolderName("");
            setFolderOpen(true);
          }}
        >
          <FolderPlus className="size-5" />
        </Button>
        <Button size="icon" className="size-14 rounded-full shadow-btn" onClick={() => setFab((value) => !value)} aria-label="Add">
          <Plus className={cn("size-7 transition-transform", fab && "rotate-45")} />
        </Button>
      </div>

      <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{current ? "New subfolder" : "New folder"}</DialogTitle>
            <DialogDescription>
              {current ? `Created inside ${leafName(current.name)}.` : "Add subfolders later by opening a folder and tapping the folder button again."}
            </DialogDescription>
          </DialogHeader>
          <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder name" />
          <Button type="button" onClick={makeFolder}>Create</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renameId} onOpenChange={() => setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
          <Button
            type="button"
            onClick={() => {
              if (renameId && renameValue.trim()) renameDeck(renameId, renameValue.trim());
              setRenameId(null);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function reviewTitle(deck: Deck, copy: ReturnType<typeof useAdminCopy>) {
  if (deck.id === "review-3") return copy.tests.day3Name;
  if (deck.id === "review-7") return copy.tests.day7Name;
  if (deck.id === "review-14") return copy.tests.day14Name;
  if (deck.id === "review-21") return copy.tests.day21Name;
  return leafName(deck.name);
}

function reviewRank(id: string) {
  if (id === "review-3") return 0;
  if (id === "review-7") return 1;
  if (id === "review-14") return 2;
  if (id === "review-21") return 3;
  return 4;
}

function FabLabel({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="flex items-center gap-3" onClick={onClick}>
      <span className="surface-3d px-3 py-1.5 text-xs font-medium">{label}</span>
      <span className="flex size-11 items-center justify-center rounded-full bg-card text-primary shadow-raised">{children}</span>
    </button>
  );
}

function PendingDots({ count, color }: { count: number; color: string }) {
  const shown = Math.min(count, 12);
  if (!shown) return null;
  return (
    <span className="mt-1 flex items-center gap-1" aria-label={`${count} pending`}>
      {Array.from({ length: shown }, (_, index) => (
        <span key={index} className="size-1.5 rounded-full" style={{ background: color }} />
      ))}
      {count > shown ? <span className="text-[10px] text-muted-foreground">+{count - shown}</span> : null}
    </span>
  );
}

function StatCircles({ stats }: { stats: ReviewStats }) {
  const tests = useAdminCopy().tests;
  const circles = [
    { label: tests.labelDay, value: stats.daysLeft, ring: tests.ringDay },
    { label: tests.labelRemain, value: stats.remaining, ring: tests.ringRemain },
    { label: tests.labelIncorrect, value: stats.incorrect, ring: tests.ringIncorrect },
    { label: tests.labelTransfer, value: stats.transfer, ring: tests.ringTransfer },
    { label: tests.labelPending, value: stats.pending, ring: tests.ringPending },
    { label: tests.labelCorrect, value: stats.correct, ring: tests.ringCorrect },
  ];
  return (
    <span className="flex shrink-0 items-center gap-1">
      <input type="checkbox" checked={stats.practiced} readOnly aria-label={stats.practiced ? "All questions practiced" : "Questions still pending"} className="size-3.5" />
      {circles.map((circle) => (
        <span key={circle.label} className="grid justify-items-center gap-0.5" title={`${circle.label} ${circle.value}`}>
          <span
            className="grid size-7 place-items-center rounded-full bg-transparent text-[10px] leading-none font-semibold tabular-nums"
            style={{ color: circle.ring, boxShadow: `inset 0 0 0 2px ${circle.ring}` }}
          >
            {circle.value}
          </span>
          <span className="text-[8px] leading-none text-muted-foreground">{circle.label}</span>
        </span>
      ))}
    </span>
  );
}

function ReviewTools({
  deck,
  decks,
  cards,
  onPractice,
}: {
  deck: Deck;
  decks: Deck[];
  cards: Card[];
  onPractice?: () => void;
}) {
  const stats = reviewStatsFor(deck, decks, cards);
  const days = deckReviewDays(deck);
  const tests = useAdminCopy().tests;
  if (!stats || !days) return null;
  const today = Math.min(days, Math.max(1, days - stats.daysLeft + (stats.daysLeft > 0 ? 1 : 0)));
  return (
    <div className="mx-4 mt-2 rounded-xl border border-zinc-300 bg-card px-3 py-3">
      <div className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={stats.practiced} readOnly aria-label="All questions practiced" className="size-4" />
        <span>{stats.practiced ? tests.practiced : tests.pending}</span>
        {onPractice ? (
          <button type="button" className="ml-auto text-primary" onClick={onPractice}>
            {tests.practice}
          </button>
        ) : null}
      </div>
      {isReviewDayFolder(deck) ? (
        <div className="mt-2 flex flex-wrap gap-1" aria-label={`${stats.daysLeft} days left`}>
          {Array.from({ length: days }, (_, index) => (
            <span
              key={index}
              className={cn(
                "grid size-6 place-items-center rounded-full border-2 bg-transparent text-[10px]",
                index + 1 < today
                  ? "border-zinc-400 bg-transparent text-zinc-700"
                  : index + 1 === today
                    ? "border-black bg-transparent text-black"
                    : "border-blue-600 bg-transparent text-blue-700",
              )}
            >
              {index + 1}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-2">
        <StatCircles stats={stats} />
      </div>
      <PendingDots count={stats.pending} color={tests.ringPending} />
      <p className="mt-2 text-[11px]">
        <span className="mr-2 inline-flex items-center gap-1"><span className="inline-block size-2 rounded-full bg-black" /> {stats.daysLeft} days</span>
        <span className="mr-2 inline-flex items-center gap-1 text-blue-700"><span className="inline-block size-2 rounded-full bg-blue-600" /> Remaining {stats.remaining}</span>
        <span className="mr-2 inline-flex items-center gap-1 text-red-600"><span className="inline-block size-2 rounded-full bg-red-600" /> Incorrect {stats.incorrect}</span>
        <span className="mr-2 inline-flex items-center gap-1" style={{ color: "#8a6a00" }}><span className="inline-block size-2 rounded-full" style={{ background: "#f2d012" }} /> Transfer {stats.transfer}</span>
        <span className="mr-2 inline-flex items-center gap-1 text-red-600"><span className="inline-block size-2 rounded-full bg-red-600" /> Pending {stats.pending}</span>
        <span className="inline-flex items-center gap-1 text-green-700"><span className="inline-block size-2 rounded-full bg-green-600" /> Correct {stats.correct}</span>
      </p>
    </div>
  );
}

