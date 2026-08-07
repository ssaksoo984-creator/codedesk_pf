"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { createThought } from "@/lib/thoughts";

export function PostEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await createThought({ title: title.trim(), body: body.trim(), photoFile });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했습니다.");
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <div className="wrap max-w-2xl pt-16">
        <div className="mb-10 flex items-center justify-between">
          <Logo tone="ink" />
          <Link href="/admin" className="text-sm text-muted transition-colors hover:text-ink">
            목록으로
          </Link>
        </div>

        <h1 className="mb-10 font-display text-3xl italic text-ink">새 글쓰기</h1>

        <form onSubmit={submit} className="flex flex-col gap-6">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">사진</span>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink/5">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="text-sm text-muted file:mr-4 file:rounded-xl file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-semibold file:text-paper"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">타이틀</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="글 제목"
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">내용</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder="글 내용을 적어주세요."
              className="w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-ink/40"
            />
          </label>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-ink py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "등록 중…" : "등록하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
