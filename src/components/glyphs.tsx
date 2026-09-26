import { cn } from "@/lib/utils";

const SRC = {
  folder: "/glyphs/folder.png",
  "folder-open": "/glyphs/folder-open.png",
  deck: "/glyphs/deck.png",
  subdeck: "/glyphs/subdeck.png",
  note: "/glyphs/note.png",
} as const;

export function Glyph3D({
  name,
  alt,
  className,
  size = "md",
}: {
  name: keyof typeof SRC;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "glyph-stage inline-grid shrink-0 place-items-center overflow-hidden",
        size === "sm" && "size-10",
        size === "md" && "size-16",
        size === "lg" && "size-24",
        className,
      )}
    >
      <img src={SRC[name]} alt={alt} className="size-full object-contain" draggable={false} />
    </span>
  );
}
