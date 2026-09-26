const ID_KEY = "setpaper-quiz-player";
const NAME_KEY = "setpaper-quiz-name";

export function quizPlayerId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(ID_KEY);
    if (!id) {
      id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now().toString(36)}`;
      window.localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return `p-${Date.now().toString(36)}`;
  }
}

export function rememberedQuizName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberQuizName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name.trim().slice(0, 40));
  } catch {
    /* ignore */
  }
}
