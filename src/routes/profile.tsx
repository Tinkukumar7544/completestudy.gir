import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudyShell } from "@/components/study-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExamStore } from "@/lib/exam/store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const navigate = useNavigate();
  const profiles = useExamStore((s) => s.profiles ?? []);
  const activeId = useExamStore((s) => s.activeProfileId);
  const profile = profiles.find((item) => item.id === activeId) ?? null;
  const updateProfile = useExamStore((s) => s.updateProfile);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setAbout(profile.about);
    setCity(profile.city);
    setPhoto(profile.photo);
  }, [profile]);

  if (!profile) {
    return (
      <StudyShell title="Profile">
        <div className="mx-auto grid max-w-md gap-3 p-4">
          <p className="text-sm text-muted-foreground">Create an account with a Google email or phone number to add a photo and details.</p>
          <Button onClick={() => void navigate({ to: "/login", search: { mode: "signup", via: "email" } })}>Create account</Button>
        </div>
      </StudyShell>
    );
  }

  return (
    <StudyShell title="Profile">
      <form
        className="mx-auto grid max-w-md gap-4 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          updateProfile(profile.id, { name: name.trim() || profile.name, about, city, photo });
          toast.success("Profile saved");
        }}
      >
        <div className="flex items-center gap-3">
          {photo ? (
            <img src={photo} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-secondary text-lg font-semibold">{(name || "S").slice(0, 1)}</span>
          )}
          <label className="text-sm text-primary">
            Add photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 350_000) {
                  toast.error("Use a photo under 350 KB");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : "");
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
        <label className="grid gap-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <Label>City</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <Label>About</Label>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" />
        </label>
        <p className="text-xs text-muted-foreground">Sign-in: {profile.email || profile.phone}. This is the same account the admin can suspend or delete.</p>
        <Button type="submit">Save profile</Button>
      </form>
    </StudyShell>
  );
}
