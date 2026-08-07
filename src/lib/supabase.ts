import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False when env vars are absent — Thought falls back to mock content so layout work can happen without a live project. */
export const isConfigured = Boolean(url && key);

export const supabase = isConfigured
  ? createClient(url!, key!, { auth: { persistSession: true } })
  : (null as unknown as ReturnType<typeof createClient>);

/** The one admin account. "code" in the login form is just a label — the real secret is the Supabase password. */
export const ADMIN_EMAIL = "admin@codedesk-studio.com";
