import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ADMIN_SESSION_KEY } from "@/lib/admin/copy";
import { readLogoFile } from "@/lib/admin/logo";
import { useAdminState } from "@/lib/admin/use-copy";
import { cn } from "@/lib/utils";

export function useAdminUnlocked() {
  const owner = useAdminState().ownerEmail;
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(Boolean(owner) && sessionStorage.getItem(ADMIN_SESSION_KEY) === owner);
  }, [owner]);
  return on;
}

export function AdminLogo({
  src,
  fallback,
  label,
  onChange,
  className,
}: {
  src?: string;
  fallback: ReactNode;
  label: string;
  onChange: (logo: string) => void;
  className?: string;
}) {
  const admin = useAdminUnlocked();
  return (
    <span className={cn("relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary", className)}>
      {src ? <img src={src} alt="" className="size-full object-cover" /> : fallback}
      {admin ? (
        <label
          className="absolute right-0 bottom-0 grid size-5 cursor-pointer place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
          title={`Upload ${label} logo`}
          onClick={(event) => event.stopPropagation()}
        >
          +
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void readLogoFile(file)
                .then((logo) => {
                  onChange(logo);
                  toast.success(`${label} logo updated`);
                })
                .catch((err) => toast.error(err instanceof Error ? err.message : "Could not use that image"));
            }}
          />
        </label>
      ) : null}
    </span>
  );
}
