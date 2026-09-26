import { createFileRoute } from "@tanstack/react-router";
import { LegalArticle } from "@/components/legal-article";

export const Route = createFileRoute("/privacy")({
  component: () => <LegalArticle kind="privacy" />,
});
