import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { StudyShell } from "@/components/study-shell";
import { TestFolderView } from "@/components/test-folder";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAdminCopy } from "@/lib/admin/use-copy";

export const Route = createFileRoute("/")({ component: TestsPage });

function TestsPage() {
  const navigate = useNavigate();
  const copy = useAdminCopy();
  const [title, setTitle] = useState(copy.tests.name);
  return (
    <StudyShell title={title}>
      <AccountBanner onOpen={() => void navigate({ to: "/login", search: { mode: "signup", via: "email" } })} />
      <TestFolderView onTitle={setTitle} />
    </StudyShell>
  );
}

function AccountBanner({ onOpen }: { onOpen: () => void }) {
  const { user } = useCurrentUserState();
  if (user) return null;
  return (
    <div className="px-4 pt-4">
      <button type="button" className="surface-3d lift flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left" onClick={onOpen}>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-btn">
          <UserPlus className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">Create account or sign in</span>
          <span className="block text-xs text-muted-foreground">Email ID or mobile number — tests and notes stay on this account</span>
        </span>
      </button>
    </div>
  );
}
