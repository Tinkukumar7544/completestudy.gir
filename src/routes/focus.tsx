import { createFileRoute } from "@tanstack/react-router";
import { FOCUS_VIEWS, FocusMode, type FocusRange, type FocusSearch, type FocusView } from "@/components/focus-mode";

export const Route = createFileRoute("/focus")({
  validateSearch: (raw: Record<string, unknown>): FocusSearch => ({
    view: FOCUS_VIEWS.includes(raw.view as FocusView) ? (raw.view as FocusView) : "apps",
    id: String(raw.id ?? ""),
    range: raw.range === "24h" ? "24h" : "30d",
  }),
  component: FocusPage,
});

function FocusPage() {
  const search = Route.useSearch();
  return <FocusMode search={search} />;
}
