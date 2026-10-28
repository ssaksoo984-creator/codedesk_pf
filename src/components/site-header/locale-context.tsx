"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "ko" | "en";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // English is the default; <html lang="en"> is what the server renders, so
  // the client starts there too and only switches after mount if the
  // visitor previously chose Korean.
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    try {
      if (window.localStorage.getItem("locale") === "ko") setTimeout(() => setLocale("ko"), 0);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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
