"use client";

import { useAdminSession } from "@/lib/use-admin-session";
import { LoginForm } from "@/components/admin/login-form";
import { Dashboard } from "@/components/admin/dashboard";
import { NoScrollSnap } from "@/components/ui/no-scroll-snap";

export default function AdminPage() {
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
      {session ? <Dashboard /> : <LoginForm />}
    </>
  );
}
