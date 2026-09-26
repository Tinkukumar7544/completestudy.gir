export type NotifyState = "granted" | "denied" | "default" | "unsupported";

export type DeviceAccess = {
  notify: NotifyState;
  persist: boolean;
  persistSupported: boolean;
  wakeSupported: boolean;
  standalone: boolean;
  related: string[];
  hidden: boolean;
};

export const AWAY_APP_ID = "sp-device";

let wakeSentinel: WakeLockSentinel | null = null;

function notifyState(): NotifyState {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

export function readDeviceAccess(): DeviceAccess {
  if (typeof window === "undefined") {
    return {
      notify: "unsupported",
      persist: false,
      persistSupported: false,
      wakeSupported: false,
      standalone: false,
      related: [],
      hidden: false,
    };
  }
  const nav = navigator as Navigator & { wakeLock?: WakeLock; getInstalledRelatedApps?: () => Promise<Array<{ id?: string; platform?: string }>> };
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((nav as Navigator & { standalone?: boolean }).standalone);
  return {
    notify: notifyState(),
    persist: false,
    persistSupported: Boolean(nav.storage?.persist),
    wakeSupported: Boolean(nav.wakeLock),
    standalone,
    related: [],
    hidden: document.visibilityState === "hidden",
  };
}

export async function grantDeviceAccess(): Promise<DeviceAccess> {
  const access = readDeviceAccess();
  if (typeof window === "undefined") return access;
  if (access.notify !== "unsupported" && access.notify !== "granted") {
    try {
      await Notification.requestPermission();
    } catch {
      /* ignore */
    }
  }
  let persist = false;
  try {
    persist = (await navigator.storage?.persist?.()) ?? false;
  } catch {
    persist = false;
  }
  await holdWakeLock();
  const related = await readRelatedApps();
  return {
    ...readDeviceAccess(),
    persist,
    related,
    notify: notifyState(),
  };
}

async function readRelatedApps(): Promise<string[]> {
  const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<Array<{ id?: string; url?: string; platform?: string }>> };
  if (!nav.getInstalledRelatedApps) return [];
  try {
    const list = await nav.getInstalledRelatedApps();
    return list
      .map((a) => a.id || a.url || a.platform || "")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function holdWakeLock(): Promise<boolean> {
  const nav = navigator as Navigator & { wakeLock?: WakeLock };
  if (!nav.wakeLock) return false;
  try {
    if (wakeSentinel && wakeSentinel.released === false) return true;
    wakeSentinel = await nav.wakeLock.request("screen");
    wakeSentinel.addEventListener("release", () => {
      wakeSentinel = null;
    });
    return true;
  } catch {
    wakeSentinel = null;
    return false;
  }
}

export function releaseWakeLock() {
  if (!wakeSentinel) return;
  void wakeSentinel.release().catch(() => undefined);
  wakeSentinel = null;
}

export async function showFocusNotice(title: string, body: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof Notification === "undefined") return false;
  if (Notification.permission !== "granted") return false;
  try {
    const registration = await navigator.serviceWorker?.getRegistration?.();
    if (registration?.showNotification) {
      await registration.showNotification(title, {
        body,
        tag: "setpaper-focus",
        silent: false,
      });
      return true;
    }
    const note = new Notification(title, { body, tag: "setpaper-focus" });
    window.setTimeout(() => note.close(), 8000);
    return true;
  } catch {
    return false;
  }
}
