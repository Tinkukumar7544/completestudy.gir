import { useEffect, useState, type ChangeEvent, type RefObject } from "react";

export function DirectoryInput({
  inputRef,
  onFiles,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  onFiles: (files: FileList | null) => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <input
      ref={inputRef}
      type="file"
      className="sr-only"
      multiple
      aria-hidden="true"
      tabIndex={-1}
      {...{ webkitdirectory: "", directory: "" }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );
}
