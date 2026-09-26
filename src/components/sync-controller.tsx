import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useExamStore } from "@/lib/exam/store";
import {
  didCollectionChange,
  isApplyingRemote,
  pushCurrentCollection,
  restoreFromCloud,
  useSyncUi,
} from "@/lib/exam/sync";
import { SyncDialog } from "@/components/sync-dialog";

export function SyncController() {
  const { user, isPending } = useCurrentUserState();
  const hydrated = useExamStore((s) => s.hydrated);
  const pulledFor = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || isPending) return;
    if (!user) {
      pulledFor.current = null;
      return;
    }
    if (pulledFor.current === user.id) return;
    const recent = useSyncUi.getState().lastSyncedAt;
    if (recent && Date.now() - recent < 8000) {
      pulledFor.current = user.id;
      return;
    }
    pulledFor.current = user.id;
    void restoreFromCloud().catch(() => {
      pulledFor.current = null;
    });
  }, [hydrated, isPending, user]);

  useEffect(() => {
    if (!user) return;
    let timer: number | undefined;
    const unsub = useExamStore.subscribe((state, prev) => {
      if (isApplyingRemote()) return;
      if (!didCollectionChange(state, prev)) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void pushCurrentCollection();
      }, 800);
    });
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(timer);
        void pushCurrentCollection();
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHide);
      unsub();
    };
  }, [user]);

  return <SyncDialog />;
}
