import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/custom-study/$deckId")({ component: CustomStudy });

function CustomStudy() {
  const { deckId } = Route.useParams();
  return <Navigate to="/overview/$deckId" params={{ deckId }} />;
}
