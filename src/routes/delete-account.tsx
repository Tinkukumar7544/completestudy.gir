import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminCopy } from "@/lib/admin/use-copy";
import { signOut } from "@/lib/auth/client";
import { useExamStore } from "@/lib/exam/store";

export const Route = createFileRoute("/delete-account")({ component: DeleteAccountPage });

function DeleteAccountPage() {
  const navigate = useNavigate();
  const legal = useAdminCopy().legal;
  const profiles = useExamStore((s) => s.profiles ?? []);
  const activeId = useExamStore((s) => s.activeProfileId);
  const profile = profiles.find((item) => item.id === activeId) ?? null;
  const deleteProfile = useExamStore((s) => s.deleteProfile);
  const resetCollection = useExamStore((s) => s.resetCollection);
  const [phrase, setPhrase] = useState("");
  const [wipe, setWipe] = useState(true);
  const [busy, setBusy] = useState(false);

  async function removeAccount() {
    if (!profile) {
      toast.error("Sign in to the account you want to delete");
      return;
    }
    if (phrase.trim().toUpperCase() !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    setBusy(true);
    deleteProfile(profile.id);
    if (wipe) resetCollection();
    try {
      await signOut("/");
    } catch {
      /* local account is already removed */
    }
    toast.success("Account and personal data deleted");
    setBusy(false);
    void navigate({ to: "/" });
  }

  return (
    <StudyShell title={legal.deletionTitle}>
      <div className="mx-auto grid max-w-lg gap-4 p-4 pb-8 text-sm leading-6">
        {legal.deletionBody.split(/\n\n+/).filter(Boolean).map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <p>
          Support: <a className="text-primary underline" href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a>
        </p>
        <p className="text-xs text-muted-foreground">
          <Link to="/privacy" className="underline">{legal.privacyTitle}</Link>
          {" · "}
          <Link to="/terms" className="underline">{legal.termsTitle}</Link>
        </p>
        {profile ? (
          <p>Signed in as <span className="font-medium">{profile.name}</span> ({profile.email || profile.phone}).</p>
        ) : (
          <Button variant="outline" onClick={() => void navigate({ to: "/login", search: { mode: "signin", via: "email" } })}>
            Sign in to delete an account
          </Button>
        )}
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" checked={wipe} onChange={(e) => setWipe(e.target.checked)} />
          <span>Also erase tests, notes, scores, and files on this device.</span>
        </label>
        <Input value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="Type DELETE" autoComplete="off" />
        <Button variant="outline" className="text-destructive" disabled={busy || !profile} onClick={() => void removeAccount()}>
          Delete account and data
        </Button>
      </div>
    </StudyShell>
  );
}
