import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Smartphone, UserPlus } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AccountForm } from "@/components/account-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatAccountLabel } from "@/lib/exam/account";

type Search = { mode: "signup" | "signin"; via: "email" | "mobile" };

export const Route = createFileRoute("/login")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    mode: raw.mode === "signin" ? "signin" : "signup",
    via: raw.via === "mobile" ? "mobile" : "email",
  }),
  component: Login,
});

function Login() {
  const { mode, via } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();

  return (
    <div className="app-canvas relative min-h-dvh text-foreground">
      <header className="relative z-10 flex h-14 items-center border-b border-bar-foreground/10 bg-bar px-4 text-bar-foreground shadow-dock">
        <h1 className="text-lg font-semibold tracking-tight">SetPaper</h1>
      </header>
      <main className="relative z-10 mx-auto max-w-md px-4 py-10">
        <div className="surface-3d grid gap-6 p-6">
        <div className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-btn">
          <UserPlus className="size-6" />
        </div>
        {user ? (
          <div className="grid gap-4">
            <div>
              <h2 className="text-xl font-semibold">You are signed in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This collection is saved to <span className="font-medium text-foreground">{formatAccountLabel(user.primaryEmail)}</span>.
              </p>
            </div>
            <Button onClick={() => void navigate({ to: "/" })}>Continue to Tests</Button>
            <Button
              variant="outline"
              onClick={() => {
                void signOut("/login").catch(() => undefined);
              }}
            >
              Use a different account
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-semibold">Create account or sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use an email ID or a mobile number. A new account keeps your tests, notes, and scores permanently.
              </p>
            </div>
            {authEnabled ? (
              <>
                <AccountForm
                  idPrefix="login"
                  defaultMode={mode}
                  defaultVia={via}
                  onSuccess={() => {
                    void navigate({ to: "/" });
                  }}
                />
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-2">
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
                    >
                      Continue with {p.label}
                    </Button>
                  ))}
                </div>
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Smartphone className="mt-0.5 size-3.5 shrink-0" />
                  Mobile accounts use your number + password. No SMS code is sent.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
            )}
          </>
        )}
        <Link to="/" className="text-sm text-primary underline-offset-4 hover:underline">
          Back to Tests
        </Link>
        </div>
      </main>
    </div>
  );
}
