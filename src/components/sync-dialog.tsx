import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountForm } from "@/components/account-form";
import { useSyncUi } from "@/lib/exam/sync";

export function SyncDialog() {
  const open = useSyncUi((s) => s.dialogOpen);
  const closeDialog = useSyncUi((s) => s.closeDialog);
  const syncing = useSyncUi((s) => s.syncing);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (syncing) return;
        if (next) useSyncUi.getState().openDialog();
        else closeDialog();
      }}
    >
      <DialogContent className="max-w-md gap-5">
        <DialogHeader className="pr-8">
          <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          <DialogTitle>Create account or sign in</DialogTitle>
          <DialogDescription>
            Use an email ID or a 10-digit mobile number. New account? Choose Create account. Same details later restore this collection.
          </DialogDescription>
        </DialogHeader>
        <AccountForm idPrefix="sync" defaultMode="signup" onSuccess={() => closeDialog()} />
      </DialogContent>
    </Dialog>
  );
}
