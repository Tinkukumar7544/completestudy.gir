import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Inbox, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { getMailMessage, listMailLabels, listMailMessages, type MailResult } from "@/lib/exam/mail";
import { useExamStore } from "@/lib/exam/store";
import { cn } from "@/lib/utils";

type Search = { from: "tests" | "notes"; label: string; message: string; connector: string };

export const Route = createFileRoute("/mail")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    from: raw.from === "notes" ? "notes" : "tests",
    label: String(raw.label ?? ""),
    message: String(raw.message ?? ""),
    connector: raw.connector === "Outlook" ? "Outlook" : "Gmail",
  }),
  component: MailPage,
});

type LabelRow = { id: string; name: string };
type MessageRow = { id: string; subject: string; from: string; snippet: string; date: string };

function asList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const key of ["labels", "folders", "messages", "emails", "threads", "items", "data", "results"]) {
      if (Array.isArray(o[key])) return o[key] as unknown[];
    }
  }
  return [];
}

function asLabels(data: unknown): LabelRow[] {
  return asList(data)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const id = String(o.id ?? o.labelId ?? o.folder_id ?? o.name ?? "").trim();
      const name = String(o.name ?? o.label ?? o.path ?? o.id ?? "").trim();
      if (!id || !name) return null;
      return { id, name };
    })
    .filter((x): x is LabelRow => Boolean(x));
}

function asMessages(data: unknown): MessageRow[] {
  return asList(data)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const id = String(o.id ?? o.message_id ?? o.threadId ?? "").trim();
      if (!id) return null;
      const fromObj = o.from && typeof o.from === "object" ? (o.from as Record<string, unknown>) : null;
      return {
        id,
        subject: String(o.subject ?? o.title ?? "(no subject)"),
        from: String(fromObj?.email ?? fromObj?.name ?? o.from ?? o.sender ?? ""),
        snippet: String(o.snippet ?? o.preview ?? o.body ?? "").slice(0, 240),
        date: String(o.date ?? o.internalDate ?? o.received ?? ""),
      };
    })
    .filter((x): x is MessageRow => Boolean(x));
}

function payload(res: MailResult): unknown {
  try {
    return JSON.parse(res.json) as unknown;
  } catch {
    return null;
  }
}

function MailPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const addLink = useExamStore((s) => s.addLink);
  const links = useExamStore((s) => s.links ?? []);
  const [labels, setLabels] = useState<LabelRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [body, setBody] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  const linked = useMemo(
    () => links.filter((l) => l.kind === "email"),
    [links],
  );

  function go(patch: Partial<Search>) {
    void navigate({ to: "/mail", search: { ...search, ...patch } });
  }

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    setError(null);
    setLoginUrl(null);
    void (async () => {
      try {
        if (search.message) {
          const res = await getMailMessage({ data: { connector: search.connector, id: search.message } });
          if (cancelled) return;
          if (res.loginRequired) {
            setLoginUrl(res.loginUrl || null);
            setError("Sign in to open mail.");
            return;
          }
          if (!res.ok) {
            setError(res.errorMessage || "Could not open this message.");
            return;
          }
          const data = payload(res);
          const row = asMessages(data)[0];
          const raw = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
          setBody(String(raw.body ?? raw.html ?? raw.text ?? row?.snippet ?? "No body."));
          return;
        }
        if (search.label) {
          const res = await listMailMessages({
            data: { connector: search.connector, labelId: search.label },
          });
          if (cancelled) return;
          if (res.loginRequired) {
            setLoginUrl(res.loginUrl || null);
            setError("Sign in to open mail.");
            return;
          }
          if (!res.ok) {
            setError(res.errorMessage || "Could not list messages.");
            return;
          }
          setMessages(asMessages(payload(res)));
          return;
        }
        const res = await listMailLabels({ data: { connector: search.connector } });
        if (cancelled) return;
        if (res.loginRequired) {
          setLoginUrl(res.loginUrl || null);
          setError("Sign in to browse mail here without importing.");
          return;
        }
        if (!res.ok) {
          setError(res.errorMessage || "Could not list folders.");
          return;
        }
        setLabels(asLabels(payload(res)));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Mail is unavailable.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search.connector, search.label, search.message]);

  function pinLabel(label: LabelRow) {
    if (linked.some((l) => l.remoteId === label.id)) {
      toast.message("Already shown on Tests and Notes");
      return;
    }
    addLink({ kind: "email", name: label.name, remoteId: label.id });
    toast.success(`${label.name} stays linked. Mail is not copied in.`);
  }

  const title = search.message ? "Message" : search.label ? "Folder" : "Mail";

  return (
    <StudyShell title={title}>
      <div className="mx-auto max-w-md p-4 pb-28">
        <div className="flex items-center gap-2 text-sm">
          <button type="button" className="text-primary" onClick={() => go({ label: "", message: "" })}>
            {search.connector}
          </button>
          {search.label ? (
            <>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <button type="button" className="text-primary" onClick={() => go({ message: "" })}>
                Folder
              </button>
            </>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse mail live. Selecting a folder shows it on Tests and Notes without importing the messages.
        </p>
        {loginUrl ? (
          <Button className="mt-4 h-12 w-full" onClick={() => window.location.assign(loginUrl)}>
            Sign in to mail
          </Button>
        ) : null}
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
        {busy ? <p className="mt-4 text-sm text-muted-foreground">Opening mail…</p> : null}

        {!search.label && !search.message ? (
          <ul className="mt-4 grid gap-2">
            {labels.map((label) => (
              <li key={label.id} className="surface-3d lift flex items-stretch overflow-hidden">
                <button
                  type="button"
                  className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 text-left"
                  onClick={() => go({ label: label.id, message: "" })}
                >
                  <Inbox className="size-5 text-primary" />
                  <span className="truncate text-sm font-medium">{label.name}</span>
                </button>
                <Button variant="ghost" className="h-14 px-3 text-xs" onClick={() => pinLabel(label)}>
                  Link
                </Button>
              </li>
            ))}
            {!busy && !error && labels.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">No folders yet.</p>
            ) : null}
          </ul>
        ) : null}

        {search.label && !search.message ? (
          <ul className="mt-4 grid gap-2">
            {messages.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className="surface-3d lift flex min-h-16 w-full flex-col items-start gap-0.5 px-4 py-3 text-left"
                  onClick={() => go({ message: row.id })}
                >
                  <span className="truncate text-sm font-semibold">{row.subject}</span>
                  <span className="truncate text-xs text-muted-foreground">{row.from}</span>
                  {row.snippet ? (
                    <span className="line-clamp-2 text-xs text-muted-foreground">{row.snippet}</span>
                  ) : null}
                </button>
              </li>
            ))}
            {!busy && !error && messages.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">This folder is empty.</p>
            ) : null}
          </ul>
        ) : null}

        {search.message ? (
          <article className="surface-3d mt-4 whitespace-pre-wrap p-4 text-sm leading-relaxed">{body}</article>
        ) : null}

        {search.label && !search.message ? (
          <Button
            variant="outline"
            className="mt-4 h-12 w-full"
            onClick={() => {
              const label = labels.find((l) => l.id === search.label);
              pinLabel({ id: search.label, name: label?.name || "Mail folder" });
            }}
          >
            <Mail className="size-4" /> Keep this folder on Tests and Notes
          </Button>
        ) : null}

        <Button
          variant="ghost"
          className={cn("mt-3 h-11 w-full")}
          onClick={() => void navigate({ to: search.from === "notes" ? "/notes" : "/" })}
        >
          Back to {search.from === "notes" ? "Notes" : "Tests"}
        </Button>
        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 text-xs text-muted-foreground"
          onClick={() => go({})}
        >
          <RefreshCw className="size-3.5" /> Reload
        </button>
      </div>
    </StudyShell>
  );
}
