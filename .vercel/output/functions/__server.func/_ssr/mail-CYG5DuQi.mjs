import { c as __exportAll, r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mail-CYG5DuQi.js
var ConnectorType = {
	GoogleDrive: "GoogleDrive",
	Gmail: "Gmail",
	GoogleCalendar: "GoogleCalendar",
	Outlook: "Outlook",
	OutlookCalendar: "OutlookCalendar",
	MicrosoftTeams: "MicrosoftTeams",
	Mcp: "Mcp"
};
var GoogleDriveTools = {
	search: "google_drive_search",
	readFile: "google_drive_read_file",
	listFolder: "google_drive_list_folder",
	createFolder: "google_drive_create_folder",
	trashFile: "google_drive_trash_file"
};
var mail_exports = /* @__PURE__ */ __exportAll({
	getMailMessage_createServerFn_handler: () => getMailMessage_createServerFn_handler,
	listDriveFolder_createServerFn_handler: () => listDriveFolder_createServerFn_handler,
	listMailLabels_createServerFn_handler: () => listMailLabels_createServerFn_handler,
	listMailMessages_createServerFn_handler: () => listMailMessages_createServerFn_handler
});
function asMail(res) {
	let json = "null";
	try {
		json = JSON.stringify(res.data ?? null);
	} catch {
		json = "null";
	}
	return {
		ok: Boolean(res.ok),
		json,
		errorMessage: res.errorMessage ?? "",
		loginRequired: Boolean(res.loginRequired),
		loginUrl: res.loginUrl ?? ""
	};
}
async function tool(toolName, args, connectorType) {
	const { callTool } = await import("./client.server-J2Ax7yaS.mjs");
	return asMail(await callTool(toolName, args, { connectorType }));
}
async function firstOk(names, args, connectorType) {
	let last = {
		ok: false,
		json: "null",
		errorMessage: "No matching mail tool",
		loginRequired: false,
		loginUrl: ""
	};
	for (const name of names) {
		last = await tool(name, args, connectorType);
		if (last.ok || last.loginRequired) return last;
	}
	return last;
}
var listMailLabels_createServerFn_handler = createServerRpc({
	id: "4edafe0783c13752a110a2fc1e26c74844d1b82a39c27a7e289efc36f47701a4",
	name: "listMailLabels",
	filename: "src/lib/exam/mail.ts"
}, (opts) => listMailLabels.__executeServer(opts));
var listMailLabels = createServerFn({ method: "POST" }).validator((data = {}) => ({ connector: data.connector === "Outlook" ? "Outlook" : "Gmail" })).handler(listMailLabels_createServerFn_handler, async ({ data }) => {
	if (data.connector === "Outlook") return firstOk([
		"outlook_list_folders",
		"outlook_list_mail_folders",
		"list_mail_folders"
	], {}, ConnectorType.Outlook);
	return firstOk([
		"gmail_list_labels",
		"gmail_list_folders",
		"list_labels"
	], {}, ConnectorType.Gmail);
});
var listMailMessages_createServerFn_handler = createServerRpc({
	id: "e7e8c85339c3be07f370d81470b952f95672ca9c36c9fccfe555a83c883fb403",
	name: "listMailMessages",
	filename: "src/lib/exam/mail.ts"
}, (opts) => listMailMessages.__executeServer(opts));
var listMailMessages = createServerFn({ method: "POST" }).validator((data = {}) => ({
	connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
	labelId: String(data.labelId ?? ""),
	query: String(data.query ?? "")
})).handler(listMailMessages_createServerFn_handler, async ({ data }) => {
	const q = data.query.trim() || (data.labelId ? `label:${data.labelId}` : "in:inbox");
	if (data.connector === "Outlook") return firstOk([
		"outlook_search_emails",
		"outlook_list_messages",
		"outlook_search"
	], {
		query: q,
		folder_id: data.labelId || void 0,
		max_results: 40
	}, ConnectorType.Outlook);
	return firstOk([
		"gmail_search",
		"gmail_search_emails",
		"gmail_list_messages"
	], {
		query: q,
		label_ids: data.labelId ? [data.labelId] : void 0,
		max_results: 40
	}, ConnectorType.Gmail);
});
var getMailMessage_createServerFn_handler = createServerRpc({
	id: "acb9a5b5ab8635d02813444fe5057ce93310df710f41d4c63d9f1ebb00b2ece9",
	name: "getMailMessage",
	filename: "src/lib/exam/mail.ts"
}, (opts) => getMailMessage.__executeServer(opts));
var getMailMessage = createServerFn({ method: "POST" }).validator((data) => ({
	connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
	id: String(data.id || "").trim()
})).handler(getMailMessage_createServerFn_handler, async ({ data }) => {
	if (!data.id) return {
		ok: false,
		json: "null",
		errorMessage: "Missing message",
		loginRequired: false,
		loginUrl: ""
	};
	if (data.connector === "Outlook") return firstOk([
		"outlook_get_email",
		"outlook_get_message",
		"outlook_read_email"
	], {
		id: data.id,
		message_id: data.id
	}, ConnectorType.Outlook);
	return firstOk([
		"gmail_get_email",
		"gmail_get_message",
		"gmail_read_email"
	], {
		id: data.id,
		message_id: data.id
	}, ConnectorType.Gmail);
});
var listDriveFolder_createServerFn_handler = createServerRpc({
	id: "c4c744217054c7be8feb923d776ba9924116c772ea6d19e079f063f640a8f748",
	name: "listDriveFolder",
	filename: "src/lib/exam/mail.ts"
}, (opts) => listDriveFolder.__executeServer(opts));
var listDriveFolder = createServerFn({ method: "POST" }).validator((data = {}) => ({ folderId: String(data.folderId || "root") })).handler(listDriveFolder_createServerFn_handler, async ({ data }) => {
	return tool(GoogleDriveTools.listFolder, { folder_id: data.folderId }, ConnectorType.GoogleDrive);
});
//#endregion
export { ConnectorType as r, mail_exports as t };
