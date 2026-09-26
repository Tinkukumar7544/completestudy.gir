import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkOtp, findProfile, issueOtp, passwordMatches, profileFromAccount } from "@/lib/account/directory";
import { digitsFromPhoneEmail, parseAccountId, type AccountKind, type AccountMode } from "@/lib/exam/account";
import { connectAccount, rememberedEmail, toastOutcome } from "@/lib/exam/sync";
import { useExamStore } from "@/lib/exam/store";
import { useAdminCopy } from "@/lib/admin/use-copy";
import { uid } from "@/lib/utils";

export function AccountForm({
  idPrefix,
  defaultMode = "signup",
  defaultVia = "email",
  onSuccess,
}: {
  idPrefix: string;
  defaultMode?: AccountMode;
  defaultVia?: AccountKind;
  onSuccess?: () => void;
}) {
  const copy = useAdminCopy();
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode === "signin" ? "signin" : "signup");
  const [via, setVia] = useState<AccountKind>(defaultVia);
  const [signMethod, setSignMethod] = useState<"password" | "otp">("password");
  const [emailId, setEmailId] = useState("");
  const [mobileId, setMobileId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const remembered = rememberedEmail();
    if (!remembered) return;
    const digits = digitsFromPhoneEmail(remembered) ?? (/^[6-9]\d{9}$/.test(remembered) ? remembered : null);
    if (digits) {
      setVia("mobile");
      setMobileId(digits);
    } else if (remembered.includes("@")) {
      setVia("email");
      setEmailId(remembered);
    }
  }, []);

  function rawId() {
    return via === "mobile" ? mobileId : emailId;
  }

  function sendCode() {
    setError(null);
    try {
      const account = parseAccountId(rawId(), via);
      const code = issueOtp(account.email);
      setSentCode(code);
      setOtp("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enter an email or phone number");
    }
  }

  async function finish(accountPassword: string, creating: boolean) {
    const account = parseAccountId(rawId(), via);
    const profiles = useExamStore.getState().profiles ?? [];
    const existing = findProfile(profiles, account.email, account.kind);
    if (existing?.status === "suspended") {
      throw new Error("This account is suspended. Ask the admin to restore it.");
    }
    if (creating) {
      if (!accepted) throw new Error("Accept the Terms and the Privacy Policy to create an account");
      if (existing) throw new Error("This account already exists. Sign in with the password or a code.");
      useExamStore.getState().saveProfile(profileFromAccount(account, accountPassword, uid()));
    } else if (existing) {
      if (!passwordMatches(existing, accountPassword)) throw new Error("Wrong password.");
      useExamStore.getState().setActiveProfile(existing.id);
    } else {
      useExamStore.getState().saveProfile(profileFromAccount(account, accountPassword, uid()));
    }
    try {
      const { outcome, account: saved } = await connectAccount(rawId(), accountPassword, creating ? "signup" : "signin", via);
      toastOutcome(outcome, saved.label);
    } catch {
      toastOutcome("in-sync", account.label);
    }
    onSuccess?.();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (mode === "signup" || signMethod === "otp") {
      if (!sentCode) {
        sendCode();
        return;
      }
      try {
        const account = parseAccountId(rawId(), via);
        if (!checkOtp(account.email, otp)) {
          setError("That code is wrong or expired. Send a new code.");
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Enter an email or phone number");
        return;
      }
    }
    setBusy(true);
    try {
      if (mode === "signin" && signMethod === "otp") {
        const account = parseAccountId(rawId(), via);
        const existing = findProfile(useExamStore.getState().profiles ?? [], account.email, account.kind);
        if (!existing) throw new Error("No account for that email or phone. Create one first.");
        if (existing.status === "suspended") throw new Error("This account is suspended.");
        useExamStore.getState().setActiveProfile(existing.id);
        onSuccess?.();
        return;
      }
      if (mode === "signin" && signMethod === "password") {
        const account = parseAccountId(rawId(), via);
        const existing = findProfile(useExamStore.getState().profiles ?? [], account.email, account.kind);
        if (existing?.status === "suspended") throw new Error("This account is suspended.");
      }
      await finish(password, mode === "signup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open this account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={(e) => void onSubmit(e)}>
      <Tabs value={via} onValueChange={(v) => { setVia(v as AccountKind); setSentCode(""); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Google email</TabsTrigger>
          <TabsTrigger value="mobile">Phone number</TabsTrigger>
        </TabsList>
      </Tabs>

      {via === "email" ? (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-email`}>Google email ID</Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@gmail.com"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
            autoFocus
          />
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-mobile`}>Phone number</Label>
          <div className="flex gap-2">
            <span className="grid h-11 shrink-0 place-items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">+91</span>
            <Input
              id={`${idPrefix}-mobile`}
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={mobileId}
              onChange={(e) => setMobileId(e.target.value.replace(/[^\d+\s-]/g, ""))}
              required
              autoFocus
              maxLength={14}
            />
          </div>
        </div>
      )}

      <Tabs value={mode} onValueChange={(v) => { setMode(v as "signup" | "signin"); setSentCode(""); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Create account</TabsTrigger>
          <TabsTrigger value="signin">Sign in</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "signin" ? (
        <Tabs value={signMethod} onValueChange={(v) => { setSignMethod(v as "password" | "otp"); setSentCode(""); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <p className="text-xs text-muted-foreground">Create with a phone number or Google email. We verify it with a one-time code, then you set a password.</p>
      )}

      {mode === "signup" || signMethod === "password" ? (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-password`}>Password</Label>
          <div className="relative">
            <Input
              id={`${idPrefix}-password`}
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className="pr-11"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      ) : null}

      {mode === "signup" ? (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-confirm`}>Confirm password</Label>
          <Input
            id={`${idPrefix}-confirm`}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </div>
      ) : null}

      {sentCode ? (
        <div className="grid gap-2 rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Verification code for this device. It expires in 5 minutes.</p>
          <p className="font-mono text-lg tracking-widest">{sentCode}</p>
          <Label htmlFor={`${idPrefix}-otp`}>Enter the code</Label>
          <Input id={`${idPrefix}-otp`} inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} required />
        </div>
      ) : null}

      {mode === "signup" ? (
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          <span>
            I agree to the <Link to="/terms" className="text-primary underline">{copy.legal.termsTitle}</Link> and{" "}
            <Link to="/privacy" className="text-primary underline">{copy.legal.privacyTitle}</Link>.
          </span>
        </label>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={busy}>
        {busy ? "Please wait…" : sentCode ? (mode === "signup" ? "Create account" : "Sign in") : mode === "signin" && signMethod === "password" ? "Sign in" : "Send code"}
      </Button>
    </form>
  );
}
