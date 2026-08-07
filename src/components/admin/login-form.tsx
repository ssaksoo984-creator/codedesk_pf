"use client";

import { useState } from "react";
import { Logo } from "@/components/logo";
import { isConfigured } from "@/lib/supabase";
import { adminSignIn } from "@/lib/thoughts";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await adminSignIn(username, password);
    setPending(false);
    if (!result.ok) setError(result.reason);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-8 shadow-xl shadow-ink/5"
      >
        <Logo tone="ink" className="mb-8" />
        <h1 className="mb-1 font-display text-2xl italic text-ink">관리자 로그인</h1>
        <p className="mb-8 text-sm text-muted">Thought 글을 관리하려면 로그인하세요.</p>

        {!isConfigured ? (
          <p className="mb-6 rounded-xl bg-ink/5 p-3 text-xs leading-relaxed text-muted">
            Supabase 환경변수가 설정되지 않아 로그인할 수 없습니다. .env.local에
            NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 채워주세요.
          </p>
        ) : null}

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-medium text-muted">아이디</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink/40"
            placeholder="code"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1.5 block text-xs font-medium text-muted">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink/40"
            placeholder="••••"
          />
        </label>

        {error ? <p className="mb-4 text-xs text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </main>
  );
}
