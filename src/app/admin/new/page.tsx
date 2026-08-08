"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminSession } from "@/lib/use-admin-session";
import { LoginForm } from "@/components/admin/login-form";
import { PostEditor } from "@/components/admin/post-editor";
import { NoScrollSnap } from "@/components/ui/no-scroll-snap";
import { getThought, type Thought } from "@/lib/thoughts";

function EditorLoader() {
  const id = useSearchParams().get("id");
  const [thought, setThought] = useState<Thought | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    getThought(id)
      .then(setThought)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-muted">불러오는 중…</p>
      </main>
    );
  }

  return <PostEditor thought={thought ?? undefined} />;
}

export default function AdminNewPage() {
  const { session, loading } = useAdminSession();

  if (loading) {
    return (
      <>
        <NoScrollSnap />
        <main className="flex min-h-screen items-center justify-center bg-paper">
          <p className="text-sm text-muted">불러오는 중…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NoScrollSnap />
      {session ? (
        <Suspense fallback={null}>
          <EditorLoader />
        </Suspense>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
