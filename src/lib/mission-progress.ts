"use client";

import { useSyncExternalStore } from "react";

/* The site's "save the world" loop: every project detail page a visitor
   opens marks that sector as restored. Progress lives in localStorage so it
   survives between visits, and every subscriber (the HUD integrity meter,
   the sector map) re-renders the moment a sector flips. */

const KEY = "rp-restored";
const EVENT = "rp-restored-change";
const EMPTY: string[] = [];

let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function subscribe(cb: () => void) {
  const onChange = () => {
    cache = null;
    cb();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function markRestored(id: string) {
  const current = read();
  if (current.includes(id)) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...current, id]));
  } catch {
    // Private mode / blocked storage: progress just won't persist.
  }
  cache = [...current, id];
  window.dispatchEvent(new Event(EVENT));
}

export function resetRestored() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  cache = [];
  window.dispatchEvent(new Event(EVENT));
}

export function useRestored(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
