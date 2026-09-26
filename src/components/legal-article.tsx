import { Link } from "@tanstack/react-router";
import { StudyShell } from "@/components/study-shell";
import { useAdminCopy } from "@/lib/admin/use-copy";

export function LegalArticle({ kind }: { kind: "privacy" | "terms" | "deletion" }) {
  const legal = useAdminCopy().legal;
  const title = kind === "privacy" ? legal.privacyTitle : kind === "terms" ? legal.termsTitle : legal.deletionTitle;
  const body = kind === "privacy" ? legal.privacyBody : kind === "terms" ? legal.termsBody : legal.deletionBody;
  return (
    <StudyShell title={title}>
      <article className="mx-auto grid max-w-lg gap-4 p-4 pb-8 text-sm leading-6">
        {body.split(/\n\n+/).filter(Boolean).map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <p>
          Support: <a className="text-primary underline" href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a>
        </p>
        <p className="text-xs text-muted-foreground">
          <Link to="/privacy" className="underline">{legal.privacyTitle}</Link>
          {" · "}
          <Link to="/terms" className="underline">{legal.termsTitle}</Link>
          {" · "}
          <Link to="/delete-account" className="underline">Delete account</Link>
        </p>
      </article>
    </StudyShell>
  );
}
