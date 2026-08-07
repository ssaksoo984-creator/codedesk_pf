import { supabase, isConfigured, ADMIN_EMAIL } from "./supabase";
import { MOCK_THOUGHTS } from "./mock-thoughts";

export interface Thought {
  id: string;
  title: string;
  body: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Stats {
  totalViews: number;
  todayViews: number;
  todayVisitors: number;
  totalVisitors: number;
}

export function excerpt(body: string, max = 160): string {
  const flat = body.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export async function listThoughts(): Promise<Thought[]> {
  if (!isConfigured) return MOCK_THOUGHTS;
  const { data, error } = await supabase
    .from("thoughts")
    .select("id, title, body, thumbnail_url, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Thought[];
}

export async function getThought(id: string): Promise<Thought | null> {
  if (!isConfigured) return MOCK_THOUGHTS.find((t) => t.id === id) ?? null;
  const { data, error } = await supabase
    .from("thoughts")
    .select("id, title, body, thumbnail_url, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Thought | null;
}

/** Uploads to the `thought-photos` bucket and returns its public URL. */
export async function uploadThoughtPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("thought-photos")
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("thought-photos").getPublicUrl(path).data.publicUrl;
}

export async function createThought(input: {
  title: string;
  body: string;
  photoFile: File | null;
}): Promise<Thought> {
  if (!isConfigured) throw new Error("Supabase가 설정되지 않았습니다.");

  const thumbnail_url = input.photoFile ? await uploadThoughtPhoto(input.photoFile) : null;

  const { data, error } = await supabase
    .from("thoughts")
    .insert({ title: input.title, body: input.body, thumbnail_url })
    .select("id, title, body, thumbnail_url, created_at")
    .single();
  if (error) throw error;
  return data as Thought;
}

export async function deleteThought(id: string): Promise<void> {
  if (!isConfigured) return;
  const { error } = await supabase.from("thoughts").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------- auth

/** "code" is just the label shown in the form — the real secret is the Supabase password. */
export async function adminSignIn(username: string, password: string) {
  if (username.trim() !== "code") {
    return { ok: false as const, reason: "아이디가 올바르지 않습니다." };
  }
  if (!isConfigured) {
    return { ok: false as const, reason: "Supabase가 설정되지 않아 로그인할 수 없습니다." };
  }
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (error) return { ok: false as const, reason: "비밀번호가 올바르지 않습니다." };
  return { ok: true as const };
}

export async function adminSignOut() {
  if (!isConfigured) return;
  await supabase.auth.signOut();
}

// ---------------------------------------------------------------- view tracking

const VISITOR_KEY = "cd_visitor_id";

function visitorId(): string {
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** Logs one page view. Fire-and-forget — never blocks or throws into the caller. */
export async function trackPageView(path: string) {
  if (!isConfigured || typeof window === "undefined") return;
  try {
    await supabase.from("page_views").insert({ path, visitor_id: visitorId() });
  } catch {
    // Analytics is best-effort — a failed insert should never break the page.
  }
}

export async function getStats(): Promise<Stats> {
  if (!isConfigured) {
    return { totalViews: 128, todayViews: 6, todayVisitors: 4, totalVisitors: 37 };
  }

  const todayStartUtc = new Date();
  todayStartUtc.setUTCHours(todayStartUtc.getUTCHours() - 9, 0, 0, 0); // midnight KST, in UTC terms
  if (new Date() < todayStartUtc) todayStartUtc.setUTCDate(todayStartUtc.getUTCDate() - 1);

  const [{ count: totalViews }, { data: todayRows }, { data: allRows }] = await Promise.all([
    supabase.from("page_views").select("id", { count: "exact", head: true }),
    supabase.from("page_views").select("visitor_id").gte("created_at", todayStartUtc.toISOString()),
    supabase.from("page_views").select("visitor_id"),
  ]);

  return {
    totalViews: totalViews ?? 0,
    todayViews: todayRows?.length ?? 0,
    todayVisitors: new Set((todayRows ?? []).map((r) => r.visitor_id)).size,
    totalVisitors: new Set((allRows ?? []).map((r) => r.visitor_id)).size,
  };
}
