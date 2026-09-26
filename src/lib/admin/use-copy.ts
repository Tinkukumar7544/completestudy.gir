import { useMemo } from "react";
import { readAdmin, type AdminCopy, type AdminState } from "@/lib/admin/copy";
import { functionAccess, functionForPath, sectionForPath, type SectionId } from "@/lib/admin/controls";
import { useExamStore } from "@/lib/exam/store";

export function useAdminState(): AdminState {
  const admin = useExamStore((s) => s.admin);
  return useMemo(() => readAdmin(admin), [admin]);
}

export function useAdminCopy(): AdminCopy {
  return useAdminState().copy;
}

export function usePlusUnlocked() {
  return useAdminState().purchases.length > 0;
}

export function useFunctionAccess(id: string) {
  const admin = useAdminState();
  return functionAccess(admin, id);
}

export function useSectionAccess(id: SectionId | null) {
  const admin = useAdminState();
  if (!id) return { allowed: true, name: "" };
  return { allowed: admin.controls.sections[id] !== false, name: id };
}

export function useRouteAccess(pathname: string) {
  const section = sectionForPath(pathname);
  const sectionAccess = useSectionAccess(section);
  const fnId = functionForPath(pathname);
  const fnAccess = useFunctionAccess(fnId ?? "__none__");
  if (!sectionAccess.allowed) return { state: "off" as const, section };
  if (fnId && !fnAccess.allowed) return { state: fnAccess.reason, section, ...fnAccess };
  return { state: "ok" as const, section };
}

