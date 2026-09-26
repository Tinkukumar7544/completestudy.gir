import { createServerFn } from "@tanstack/react-start";
import { ConnectorType, GoogleDriveTools, type CallToolResult } from "@/lib/app-data";

export type MailResult = {
  ok: boolean;
  json: string;
  errorMessage: string;
  loginRequired: boolean;
  loginUrl: string;
};

function asMail(res: CallToolResult): MailResult {
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
    loginUrl: res.loginUrl ?? "",
  };
}

async function tool(
  toolName: string,
  args: Record<string, unknown>,
  connectorType: (typeof ConnectorType)[keyof typeof ConnectorType],
): Promise<MailResult> {
  const { callTool } = await import("@/lib/app-data/client.server");
  return asMail(await callTool(toolName, args, { connectorType }));
}

async function firstOk(
  names: string[],
  args: Record<string, unknown>,
  connectorType: (typeof ConnectorType)[keyof typeof ConnectorType],
): Promise<MailResult> {
  let last: MailResult = { ok: false, json: "null", errorMessage: "No matching mail tool", loginRequired: false, loginUrl: "" };
  for (const name of names) {
    last = await tool(name, args, connectorType);
    if (last.ok || last.loginRequired) return last;
  }
  return last;
}

export const listMailLabels = createServerFn({ method: "POST" })
  .validator((data: { connector?: string } = {}) => ({
    connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
  }))
  .handler(async ({ data }): Promise<MailResult> => {
    if (data.connector === "Outlook") {
      return firstOk(
        ["outlook_list_folders", "outlook_list_mail_folders", "list_mail_folders"],
        {},
        ConnectorType.Outlook,
      );
    }
    return firstOk(["gmail_list_labels", "gmail_list_folders", "list_labels"], {}, ConnectorType.Gmail);
  });

export const listMailMessages = createServerFn({ method: "POST" })
  .validator((data: { connector?: string; labelId?: string; query?: string } = {}) => ({
    connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
    labelId: String(data.labelId ?? ""),
    query: String(data.query ?? ""),
  }))
  .handler(async ({ data }): Promise<MailResult> => {
    const q = data.query.trim() || (data.labelId ? `label:${data.labelId}` : "in:inbox");
    if (data.connector === "Outlook") {
      return firstOk(
        ["outlook_search_emails", "outlook_list_messages", "outlook_search"],
        { query: q, folder_id: data.labelId || undefined, max_results: 40 },
        ConnectorType.Outlook,
      );
    }
    return firstOk(
      ["gmail_search", "gmail_search_emails", "gmail_list_messages"],
      { query: q, label_ids: data.labelId ? [data.labelId] : undefined, max_results: 40 },
      ConnectorType.Gmail,
    );
  });

export const getMailMessage = createServerFn({ method: "POST" })
  .validator((data: { connector?: string; id: string }) => ({
    connector: data.connector === "Outlook" ? "Outlook" : "Gmail",
    id: String(data.id || "").trim(),
  }))
  .handler(async ({ data }): Promise<MailResult> => {
    if (!data.id) return { ok: false, json: "null", errorMessage: "Missing message", loginRequired: false, loginUrl: "" };
    if (data.connector === "Outlook") {
      return firstOk(
        ["outlook_get_email", "outlook_get_message", "outlook_read_email"],
        { id: data.id, message_id: data.id },
        ConnectorType.Outlook,
      );
    }
    return firstOk(
      ["gmail_get_email", "gmail_get_message", "gmail_read_email"],
      { id: data.id, message_id: data.id },
      ConnectorType.Gmail,
    );
  });

export const listDriveFolder = createServerFn({ method: "POST" })
  .validator((data: { folderId?: string } = {}) => ({
    folderId: String(data.folderId || "root"),
  }))
  .handler(async ({ data }): Promise<MailResult> => {
    return tool(GoogleDriveTools.listFolder, { folder_id: data.folderId }, ConnectorType.GoogleDrive);
  });
