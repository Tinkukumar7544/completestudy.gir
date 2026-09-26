import { hashAdminPassword } from "@/lib/admin/controls";
import { digitsFromPhoneEmail, parseAccountId, type AccountId } from "@/lib/exam/account";

export interface UserProfile {
  id: string;
  kind: "email" | "phone";
  login: string;
  email: string;
  phone: string;
  passwordHash: string;
  name: string;
  photo: string;
  about: string;
  city: string;
  status: "active" | "suspended";
  createdAt: number;
  acceptedTermsAt: number;
}

const OTP_KEY = "setpaper-otp";

export function issueOtp(target: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const record = {
    target: target.trim().toLowerCase(),
    hash: hashAdminPassword(target.trim().toLowerCase(), code),
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  sessionStorage.setItem(OTP_KEY, JSON.stringify(record));
  return code;
}

export function checkOtp(target: string, code: string): boolean {
  const raw = sessionStorage.getItem(OTP_KEY);
  if (!raw) return false;
  try {
    const record = JSON.parse(raw) as { target?: string; hash?: string; expiresAt?: number };
    if (!record.hash || !record.expiresAt || record.expiresAt < Date.now()) return false;
    if (record.target !== target.trim().toLowerCase()) return false;
    const ok = record.hash === hashAdminPassword(target.trim().toLowerCase(), code.trim());
    if (ok) sessionStorage.removeItem(OTP_KEY);
    return ok;
  } catch {
    return false;
  }
}

export function profileFromAccount(account: AccountId, password: string, id: string): UserProfile {
  const phone = account.kind === "mobile" ? account.name : "";
  return {
    id,
    kind: account.kind === "mobile" ? "phone" : "email",
    login: account.email,
    email: account.kind === "email" ? account.email : "",
    phone,
    passwordHash: hashAdminPassword(account.email, password),
    name: account.name,
    photo: "",
    about: "",
    city: "",
    status: "active",
    createdAt: Date.now(),
    acceptedTermsAt: Date.now(),
  };
}

export function passwordMatches(profile: UserProfile, password: string): boolean {
  return profile.passwordHash === hashAdminPassword(profile.login, password);
}

export function readProfiles(raw: unknown): UserProfile[] {
  if (!Array.isArray(raw)) return [];
  const out: UserProfile[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<UserProfile>;
    if (typeof row.id !== "string" || typeof row.login !== "string") continue;
    const phone = typeof row.phone === "string" ? row.phone : digitsFromPhoneEmail(row.login) ?? "";
    out.push({
      id: row.id,
      kind: row.kind === "phone" || phone ? "phone" : "email",
      login: row.login,
      email: typeof row.email === "string" ? row.email : row.kind === "email" ? row.login : "",
      phone,
      passwordHash: typeof row.passwordHash === "string" ? row.passwordHash : "",
      name: typeof row.name === "string" && row.name.trim() ? row.name : "Student",
      photo: typeof row.photo === "string" && row.photo.startsWith("data:image/") ? row.photo : "",
      about: typeof row.about === "string" ? row.about : "",
      city: typeof row.city === "string" ? row.city : "",
      status: row.status === "suspended" ? "suspended" : "active",
      createdAt: typeof row.createdAt === "number" ? row.createdAt : Date.now(),
      acceptedTermsAt: typeof row.acceptedTermsAt === "number" ? row.acceptedTermsAt : 0,
    });
  }
  return out;
}

export function findProfile(profiles: UserProfile[], raw: string, kind?: "email" | "mobile"): UserProfile | undefined {
  const account = parseAccountId(raw, kind);
  return profiles.find((profile) => profile.login === account.email);
}
