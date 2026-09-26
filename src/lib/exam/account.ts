export type AccountKind = "email" | "mobile";
export type AccountMode = "signup" | "signin" | "auto";

export type AccountId = {
  kind: AccountKind;
  email: string;
  label: string;
  name: string;
};

const PHONE_DOMAIN = "phone.setpaper.app";

export function formatMobile(digits: string): string {
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function parseMobileDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("91")) digits = digits.slice(-10);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new Error("Enter a valid 10-digit mobile number");
  }
  return digits;
}

export function phoneEmail(digits: string): string {
  return `${digits}@${PHONE_DOMAIN}`;
}

export function digitsFromPhoneEmail(email: string): string | null {
  const lower = email.trim().toLowerCase();
  const suffix = `@${PHONE_DOMAIN}`;
  if (!lower.endsWith(suffix)) return null;
  const digits = lower.slice(0, -suffix.length);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function formatAccountLabel(email: string | null | undefined): string {
  if (!email) return "your account";
  const digits = digitsFromPhoneEmail(email);
  if (digits) return formatMobile(digits);
  return email;
}

export function parseAccountId(raw: string, prefer?: AccountKind): AccountId {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error(prefer === "mobile" ? "Enter your mobile number" : "Enter your email ID");
  }
  const looksEmail = trimmed.includes("@");
  if (prefer === "mobile" || (!prefer && !looksEmail)) {
    try {
      const digits = parseMobileDigits(trimmed);
      return {
        kind: "mobile",
        email: phoneEmail(digits),
        label: formatMobile(digits),
        name: digits,
      };
    } catch (err) {
      if (prefer === "mobile" || !looksEmail) throw err;
    }
  }
  const email = trimmed.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email ID");
  }
  return {
    kind: "email",
    email,
    label: email,
    name: email.split("@")[0] || "Student",
  };
}
