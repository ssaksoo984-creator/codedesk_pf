"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "ko" | "en";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // <html lang="ko"> is what the server renders, so the client has to start
  // there too — reading localStorage synchronously here would mismatch SSR
  // output. Correct it right after mount instead.
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    const saved = window.localStorage.getItem("locale");
    if (saved === "en") {
      setTimeout(() => setLocale("en"), 0);
    }
  }, []);

  function toggleLocale() {
    setLocale((prev) => {
      const next: Locale = prev === "ko" ? "en" : "ko";
      window.localStorage.setItem("locale", next);
      return next;
    });
  }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
