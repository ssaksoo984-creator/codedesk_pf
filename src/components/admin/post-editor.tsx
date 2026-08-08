"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { createThought, updateThought, type Thought } from "@/lib/thoughts";

interface PostEditorProps {
  /** When set, the form edits this post instead of creating a new one. */
  thought?: Thought;
}

export function PostEditor({ thought }: PostEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(thought);

  const [title, setTitle] = useState(thought?.title ?? "");
  const [body, setBody] = useState(thought?.body ?? "");
  const [titleEn, setTitleEn] = useState(thought?.title_en ?? "");
  const [bodyEn, setBodyEn] = useState(thought?.body_en ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(thought?.thumbnail_url ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("한국어 제목과 내용은 필수입니다.");
      return;
    }
    setPending(true);
    setError(null);
    const input = {
      title: title.trim(),
      body: body.trim(),
      title_en: titleEn.trim(),
      body_en: bodyEn.trim(),
      photoFile,
    };
    try {
      if (isEdit && thought) {
        await updateThought(thought.id, input);
      } else {
        await createThought(input);
      }
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
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

        <h1 className="mb-10 font-display text-3xl italic text-ink">
          {isEdit ? "글 수정" : "새 글쓰기"}
        </h1>

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
            {isEdit ? (
              <p className="mt-2 text-[11px] text-ink/40">
                새 사진을 선택하지 않으면 기존 사진이 그대로 유지됩니다.
              </p>
            ) : null}
          </label>

          <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/70">
              한국어 (필수)
            </p>
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
                rows={10}
                placeholder="글 내용을 적어주세요."
                className="w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-ink/40"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/70">
              English (선택 — 비워두면 한국어 버전이 대신 보여요)
            </p>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-muted">Title</span>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Post title"
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink/40"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-muted">Body</span>
              <textarea
                value={bodyEn}
                onChange={(e) => setBodyEn(e.target.value)}
                rows={10}
                placeholder="Write the post."
                className="w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-ink/40"
              />
            </label>
          </div>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-ink py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "저장 중…" : isEdit ? "수정하기" : "등록하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
