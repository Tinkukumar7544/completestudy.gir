import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/options/$deckId")({ component: Options });

function Options() {
  const { deckId } = Route.useParams();
  return <Navigate to="/overview/$deckId" params={{ deckId }} />;
}
