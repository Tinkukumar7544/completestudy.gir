import { r as createServerFn } from "./ssr.mjs";
import { C as normalizeFolders, D as normalizeNotes, E as normalizeLudo, S as normalizeFocus, T as normalizeLinks, b as normalizeCoaching, k as normalizeTemplates, m as defaultPrefs, w as normalizeJourney, x as normalizeExamPath } from "./types-XZVWHhWz.mjs";
import { a as authMiddleware, b as normalizeSessionSummary, v as mergeFocus, x as normalizeSessions } from "./results-DOq2AZyk.mjs";
import { r as getSql } from "./db-BF0K1Sep.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-DjAeTSnk.js
function asPayload(raw) {
	const data = typeof raw === "string" ? JSON.parse(raw) : raw;
	if (!data || typeof data !== "object") throw new Error("Invalid collection payload");
	const d = data;
	if (!Array.isArray(d.decks) || !Array.isArray(d.cards)) throw new Error("Invalid collection payload");
	return {
		decks: d.decks,
		cards: d.cards,
		configs: d.configs ?? {},
		prefs: d.prefs ?? defaultPrefs(),
		daily: d.daily ?? {
			day: "",
			byDeck: {}
		},
		revlog: Array.isArray(d.revlog) ? d.revlog : [],
		papers: Array.isArray(d.papers) ? d.papers : [],
		lastSession: normalizeSessionSummary(d.lastSession),
		sessions: normalizeSessions(Array.isArray(d.sessions) && d.sessions.length ? d.sessions : d.lastSession ? [d.lastSession] : []),
		notes: normalizeNotes(d.notes),
		folders: normalizeFolders(d.folders),
		links: normalizeLinks(d.links),
		templates: normalizeTemplates(d.templates, d.prefs),
		coaching: normalizeCoaching(d.coaching),
		journey: normalizeJourney(d.journey),
		path: normalizeExamPath(d.path),
		focus: mergeFocus(normalizeFocus(d.focus)),
		ludo: normalizeLudo(d.ludo)
	};
}
function validatePayload(data) {
	return asPayload(data);
}
async function emailForUser(userId) {
	return (await (await getSql())`
    select "email" as email from "user" where "id" = ${userId} limit 1
  `)[0]?.email ?? "";
}
var pullCollection_createServerFn_handler = createServerRpc({
	id: "ebbb2549730f02155ae741e61f373a70f222d72b6ae96dc6527acb25c0253352",
	name: "pullCollection",
	filename: "src/lib/exam/cloud.ts"
}, (opts) => pullCollection.__executeServer(opts));
var pullCollection = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(pullCollection_createServerFn_handler, async ({ context }) => {
	const row = (await (await getSql())`
      select payload, revision, updated_at, email
      from collections
      where user_id = ${context.userId}
      limit 1
    `)[0];
	if (!row) return null;
	return {
		payload: asPayload(row.payload),
		revision: Number(row.revision) || 1,
		updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date(row.updated_at).toISOString(),
		email: row.email
	};
});
var pushCollection_createServerFn_handler = createServerRpc({
	id: "a2b8ed49f2e74639610e1037ef5a82fbb1c6909c817e4be8cc2ec29ef33d499d",
	name: "pushCollection",
	filename: "src/lib/exam/cloud.ts"
}, (opts) => pushCollection.__executeServer(opts));
var pushCollection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(validatePayload).handler(pushCollection_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const email = await emailForUser(context.userId);
	const raw = JSON.stringify(data);
	const row = (await sql`
      insert into collections (user_id, email, payload, revision, updated_at)
      values (${context.userId}, ${email}, cast(${raw} as jsonb), 1, now())
      on conflict (user_id) do update set
        email = excluded.email,
        payload = excluded.payload,
        revision = collections.revision + 1,
        updated_at = now()
      returning revision, updated_at
    `)[0];
	return {
		revision: Number(row?.revision) || 1,
		updatedAt: row?.updated_at ? typeof row.updated_at === "string" ? row.updated_at : new Date(row.updated_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
		email
	};
});
//#endregion
export { pullCollection_createServerFn_handler, pushCollection_createServerFn_handler };
