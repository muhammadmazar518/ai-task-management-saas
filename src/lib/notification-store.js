import { useSyncExternalStore } from "react";
import { notificationStorageKey } from "@/lib/notifications";

const EMPTY_IDS = new Set();

const UNHYDRATED = { hydrated: false, ids: EMPTY_IDS };

const CACHE = { key: null, value: UNHYDRATED };

const LISTENERS = new Set();

function emit() {
  LISTENERS.forEach((listener) => listener());
}

function handleStorageEvent(event) {
  if (
    event.key === null ||
    (typeof event.key === "string" &&
      event.key.startsWith("taskflow:notifications:read:"))
  ) {
    CACHE.key = null;
    emit();
  }
}

function parseIds(raw) {
  if (!raw) return EMPTY_IDS;

  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    return list.length > 0 ? new Set(list) : EMPTY_IDS;
  } catch {
    return EMPTY_IDS;
  }
}

function readState(userId) {
  if (typeof window === "undefined") return UNHYDRATED;

  let raw = null;

  try {
    raw = window.localStorage.getItem(notificationStorageKey(userId));
  } catch {
    return UNHYDRATED;
  }
  const key = `${userId || "anon"}|${raw ?? ""}`;

  if (CACHE.key === key) return CACHE.value;

  CACHE.key = key;
  CACHE.value = { hydrated: true, ids: parseIds(raw) };

  return CACHE.value;
}

function subscribe(callback) {
  LISTENERS.add(callback);

  if (LISTENERS.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
  }

  return () => {
    LISTENERS.delete(callback);

    if (LISTENERS.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

export function saveReadIds(userId, ids) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      notificationStorageKey(userId),
      JSON.stringify([...(ids instanceof Set ? ids : new Set(ids ?? []))])
    );
  } catch {
    console.error("Could not persist notification read state");
  }

  CACHE.key = null;
  emit();
}

export function useReadIds(userId) {
  return useSyncExternalStore(
    subscribe,
    () => readState(userId),
    () => UNHYDRATED
  );
}
