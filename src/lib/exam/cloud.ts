import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { defaultPrefs, normalizeCoaching, normalizeExamPath, normalizeFocus, normalizeFolders, normalizeJourney, normalizeLinks, normalizeLudo, normalizeNotes, normalizeTemplates, type CollectionPayload } from "./types";
import { mergeFocus } from "./focus";
import { normalizeSessionSummary, normalizeSessions } from "./results";

export type CloudCollection = {
  payload: CollectionPayload;
  revision: number;
  updatedAt: string;
  email: string;
};

function asPayload(raw: unknown): CollectionPayload {
  const data = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid collection payload");
  }
  const d = data as Partial<CollectionPayload>;
  if (!Array.isArray(d.decks) || !Array.isArray(d.cards)) {
    throw new Error("Invalid collection payload");
  }
  return {
    decks: d.decks,
    cards: d.cards,
    configs: d.configs ?? {},
    prefs: d.prefs ?? defaultPrefs(),
    daily: d.daily ?? { day: "", byDeck: {} },
    revlog: Array.isArray(d.revlog) ? d.revlog : [],
    papers: Array.isArray(d.papers) ? d.papers : [],
    lastSession: normalizeSessionSummary(d.lastSession),
    sessions: normalizeSessions(
      Array.isArray(d.sessions) && d.sessions.length ? d.sessions : d.lastSession ? [d.lastSession] : [],
    ),
    notes: normalizeNotes(d.notes),
    folders: normalizeFolders(d.folders),
    links: normalizeLinks(d.links),
    templates: normalizeTemplates(d.templates, d.prefs),
    coaching: normalizeCoaching(d.coaching),
    journey: normalizeJourney(d.journey),
    path: normalizeExamPath(d.path),
    focus: mergeFocus(normalizeFocus(d.focus)),
    ludo: normalizeLudo(d.ludo),
  };
}

function validatePayload(data: unknown): CollectionPayload {
  return asPayload(data);
}

async function emailForUser(userId: string): Promise<string> {
  const sql = await getSql();
  const rows = await sql<{ email: string }>`
    select "email" as email from "user" where "id" = ${userId} limit 1
  `;
  return rows[0]?.email ?? "";
}

export const pullCollection = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CloudCollection | null> => {
    const sql = await getSql();
    const rows = await sql<{
      payload: unknown;
      revision: number;
      updated_at: string | Date;
      email: string;
    }>`
      select payload, revision, updated_at, email
      from collections
      where user_id = ${context.userId}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      payload: asPayload(row.payload),
      revision: Number(row.revision) || 1,
      updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date(row.updated_at).toISOString(),
      email: row.email,
    };
  });

export const pushCollection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(validatePayload)
  .handler(async ({ context, data }): Promise<{ revision: number; updatedAt: string; email: string }> => {
    const sql = await getSql();
    const email = await emailForUser(context.userId);
    const raw = JSON.stringify(data);
    const rows = await sql<{ revision: number; updated_at: string | Date }>`
      insert into collections (user_id, email, payload, revision, updated_at)
      values (${context.userId}, ${email}, cast(${raw} as jsonb), 1, now())
      on conflict (user_id) do update set
        email = excluded.email,
        payload = excluded.payload,
        revision = collections.revision + 1,
        updated_at = now()
      returning revision, updated_at
    `;
    const row = rows[0];
    return {
      revision: Number(row?.revision) || 1,
      updatedAt: row?.updated_at
        ? typeof row.updated_at === "string"
          ? row.updated_at
          : new Date(row.updated_at).toISOString()
        : new Date().toISOString(),
      email,
    };
  });
