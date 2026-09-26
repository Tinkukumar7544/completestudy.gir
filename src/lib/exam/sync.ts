import { create } from "zustand";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { collectionSnapshot, useExamStore, type ExamState } from "./store";
import { pullCollection, pushCollection } from "./cloud";
import {
  formatAccountLabel,
  parseAccountId,
  type AccountKind,
  type AccountMode,
  type AccountId,
} from "./account";

const EMAIL_KEY = "setpaper-sync-email";

export type SyncOutcome = "restored" | "uploaded" | "in-sync";

type SyncUi = {
  dialogOpen: boolean;
  syncing: boolean;
  lastError: string | null;
  lastSyncedAt: number | null;
  openDialog: () => void;
  closeDialog: () => void;
  setSyncing: (v: boolean) => void;
  setResult: (error: string | null, at?: number | null) => void;
};

export const useSyncUi = create<SyncUi>((set) => ({
  dialogOpen: false,
  syncing: false,
  lastError: null,
  lastSyncedAt: null,
  openDialog: () => set({ dialogOpen: true, lastError: null }),
  closeDialog: () => set({ dialogOpen: false }),
  setSyncing: (syncing) => set({ syncing }),
  setResult: (lastError, at) =>
    set((s) => ({
      lastError,
      syncing: false,
      lastSyncedAt: at === undefined ? s.lastSyncedAt : at,
    })),
}));

export function rememberedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberEmail(email: string) {
  try {
    window.localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    /* ignore */
  }
}

function errMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  return fallback;
}

function isUnauthorized(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const anyErr = err as { message?: string; status?: number };
  return anyErr.status === 401 || anyErr.message === "Unauthorized";
}

let applyingRemote = false;
let lastPushedJson = "";
let restoreInFlight: Promise<SyncOutcome> | null = null;
let pushInFlight: Promise<void> | null = null;
let pushQueued = false;

export function isApplyingRemote(): boolean {
  return applyingRemote;
}

const WATCH: (keyof Pick<
  ExamState,
  "decks" | "cards" | "configs" | "prefs" | "daily" | "revlog" | "papers" | "lastSession" | "sessions" | "notes" | "folders" | "templates" | "coaching" | "journey" | "ludo"
>)[] = ["decks", "cards", "configs", "prefs", "daily", "revlog", "papers", "lastSession", "sessions", "notes", "folders", "templates", "coaching", "journey", "ludo"];

export function didCollectionChange(state: ExamState, prev: ExamState): boolean {
  return WATCH.some((key) => state[key] !== prev[key]);
}

export async function restoreFromCloud(): Promise<SyncOutcome> {
  if (restoreInFlight) return restoreInFlight;
  restoreInFlight = (async () => {
    useSyncUi.getState().setSyncing(true);
    try {
      const remote = await pullCollection();
      if (remote?.payload) {
        applyingRemote = true;
        lastPushedJson = JSON.stringify(remote.payload);
        useExamStore.getState().applyCloudPayload(remote.payload);
        applyingRemote = false;
        useSyncUi.getState().setResult(null, Date.now());
        return "restored";
      }
      await pushCurrentCollection();
      return "uploaded";
    } catch (err) {
      applyingRemote = false;
      if (isUnauthorized(err)) {
        useSyncUi.getState().setResult("Sign in to sync");
        throw err;
      }
      const message = errMessage(err, "Could not sync");
      useSyncUi.getState().setResult(message);
      throw err;
    } finally {
      useSyncUi.getState().setSyncing(false);
    }
  })().finally(() => {
    restoreInFlight = null;
  });
  return restoreInFlight;
}

export async function pushCurrentCollection(): Promise<void> {
  if (applyingRemote) return;
  if (pushInFlight) {
    pushQueued = true;
    return pushInFlight;
  }

  pushInFlight = (async () => {
    try {
      do {
        pushQueued = false;
        if (applyingRemote) return;
        const payload = collectionSnapshot();
        const json = JSON.stringify(payload);
        if (json === lastPushedJson) continue;
        useSyncUi.getState().setSyncing(true);
        try {
          await pushCollection({ data: payload });
          lastPushedJson = json;
          const at = Date.now();
          useExamStore.setState({ lastSyncedAt: at });
          useSyncUi.getState().setResult(null, at);
        } catch (err) {
          if (isUnauthorized(err)) {
            useSyncUi.getState().setResult(null);
            return;
          }
          useSyncUi.getState().setResult(errMessage(err, "Could not save to your account"));
          return;
        }
      } while (pushQueued);
    } finally {
      useSyncUi.getState().setSyncing(false);
    }
  })().finally(() => {
    pushInFlight = null;
  });

  await pushInFlight;
}

export async function syncNow(): Promise<SyncOutcome> {
  const outcome = await restoreFromCloud();
  if (outcome !== "restored") return outcome;
  await pushCurrentCollection();
  return "in-sync";
}

export async function connectAccount(
  raw: string,
  password: string,
  mode: AccountMode = "auto",
  prefer?: AccountKind,
): Promise<{ outcome: SyncOutcome; account: AccountId }> {
  const account = parseAccountId(raw, prefer);
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (mode === "signup") {
    const signUpRes = await authClient.signUp.email({
      email: account.email,
      password,
      name: account.name,
    });
    if (signUpRes.error) {
      const msg = signUpRes.error.message ?? "";
      if (/already|exist|registered/i.test(msg)) {
        throw new Error(
          account.kind === "mobile"
            ? "This mobile number already has an account. Sign in."
            : "This email ID already has an account. Sign in.",
        );
      }
      throw new Error(signUpRes.error.message ?? "Could not create this account");
    }
  } else if (mode === "signin") {
    const signInRes = await authClient.signIn.email({ email: account.email, password });
    if (signInRes.error) {
      throw new Error(
        account.kind === "mobile"
          ? "Wrong password, or no account for this mobile number. Create a new account."
          : "Wrong password, or no account for this email ID. Create a new account.",
      );
    }
  } else {
    const signInRes = await authClient.signIn.email({ email: account.email, password });
    if (signInRes.error) {
      const signUpRes = await authClient.signUp.email({
        email: account.email,
        password,
        name: account.name,
      });
      if (signUpRes.error) {
        const msg = signUpRes.error.message ?? "";
        if (/already|exist|registered/i.test(msg)) {
          throw new Error(
            account.kind === "mobile"
              ? "Wrong password for this mobile number. Try again."
              : "Wrong password for this email ID. Try again.",
          );
        }
        throw new Error(signUpRes.error.message ?? "Could not open this account");
      }
    }
  }

  try {
    await authClient.getSession();
  } catch {
    /* session store recovers on the next useSession fetch */
  }

  rememberEmail(account.kind === "mobile" ? account.name : account.email);
  const outcome = await restoreFromCloud();
  return { outcome, account };
}

export async function connectWithEmail(email: string, password: string): Promise<SyncOutcome> {
  const { outcome } = await connectAccount(email, password, "auto", "email");
  return outcome;
}

export function describeOutcome(outcome: SyncOutcome, email: string): string {
  const label = formatAccountLabel(email);
  if (outcome === "restored") return `Restored collection from ${label}`;
  if (outcome === "uploaded") return `Saved collection to ${label}`;
  return `Synced with ${label}`;
}

export function toastOutcome(outcome: SyncOutcome, email: string) {
  toast.success(describeOutcome(outcome, email));
}
