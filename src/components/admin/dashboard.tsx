"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  listThoughts,
  deleteThought,
  getStats,
  getPathStats,
  getDailyStats,
  getReferrerStats,
  adminSignOut,
  excerpt,
  type Thought,
  type Stats,
  type PathStat,
  type DayStat,
  type ReferrerStat,
} from "@/lib/thoughts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function pageLabel(path: string): string {
  if (path === "/") return "Home";
  if (path === "/thought") return "Thought 목록";
  if (path.startsWith("/thought/view")) return "Thought 글 상세";
  return path;
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function DailyTrend({ data }: { data: DayStat[] }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  return (
    <div className="flex h-28 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.date} className="group relative flex-1">
          <div
            className="w-full rounded-t bg-ink/60 transition-colors group-hover:bg-ink"
            style={{ height: `${Math.max(4, (d.views / max) * 100)}%` }}
          />
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] text-paper opacity-0 transition-opacity group-hover:opacity-100">
            {d.date.slice(5)} · {d.views}
          </div>
        </div>
      ))}
    </div>
  );
}

function BreakdownTable({
  rows,
  labelHeader,
}: {
  rows: { label: string; views: number; visitors?: number }[];
  labelHeader: string;
}) {
  if (rows.length === 0) return <p className="text-xs text-muted">아직 데이터가 없습니다.</p>;
  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="text-muted">
          <th className="pb-2 font-medium">{labelHeader}</th>
          <th className="pb-2 font-medium">조회수</th>
          {rows[0].visitors != null ? <th className="pb-2 font-medium">방문자</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-t border-ink/5">
            <td className="truncate py-2 pr-2 text-ink">{r.label}</td>
            <td className="py-2 text-ink">{r.views}</td>
            {r.visitors != null ? <td className="py-2 text-ink">{r.visitors}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Dashboard() {
  const [thoughts, setThoughts] = useState<Thought[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pathStats, setPathStats] = useState<PathStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DayStat[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStat[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  function reload() {
    listThoughts().then(setThoughts);
    getStats().then(setStats);
    getPathStats().then(setPathStats);
    getDailyStats(14).then(setDailyStats);
    getReferrerStats().then(setReferrerStats);
  }

  useEffect(reload, []);

  async function handleDelete(id: string) {
    if (!window.confirm("이 글을 삭제할까요? 되돌릴 수 없습니다.")) return;
    setBusyId(id);
    await deleteThought(id);
    setBusyId(null);
    reload();
  }

  function viewsFor(thoughtId: string): number {
    const stat = pathStats.find((p) => p.path === `/thought/view?id=${thoughtId}`);
    return stat?.views ?? 0;
  }

  const pageRows = (() => {
    const grouped = new Map<string, { views: number; visitors: number }>();
    for (const p of pathStats) {
      const label = pageLabel(p.path);
      const e = grouped.get(label) ?? { views: 0, visitors: 0 };
      e.views += p.views;
      e.visitors += p.visitors;
      grouped.set(label, e);
    }
    return [...grouped.entries()]
      .map(([label, v]) => ({ label, ...v }))
      .sort((a, b) => b.views - a.views);
  })();

  const referrerRows = referrerStats.map((r) => ({ label: r.source, views: r.views }));

  return (
    <main className="min-h-screen bg-paper pb-24">
      <div className="wrap max-w-4xl pt-16">
        <div className="mb-10 flex items-center justify-between">
          <Logo tone="ink" />
          <button
            onClick={() => adminSignOut()}
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            로그아웃
          </button>
        </div>

        <h1 className="mb-8 font-display text-3xl italic text-ink">오늘의 통계</h1>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile label="오늘 방문자" value={stats?.todayVisitors ?? 0} />
          <StatTile label="오늘 조회수" value={stats?.todayViews ?? 0} />
          <StatTile label="전체 방문자" value={stats?.totalVisitors ?? 0} />
          <StatTile label="전체 조회수" value={stats?.totalViews ?? 0} />
        </div>

        <div className="mb-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card title="최근 14일 방문 추이">
            <DailyTrend data={dailyStats} />
          </Card>
          <Card title="페이지별 방문">
            <BreakdownTable rows={pageRows} labelHeader="페이지" />
          </Card>
          <Card title="유입 경로">
            <BreakdownTable rows={referrerRows} labelHeader="어디서 왔는지" />
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl italic text-ink">Thought 글 목록</h2>
          <Link
            href="/admin/new"
            className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            + 새 글쓰기
          </Link>
        </div>

        {thoughts === null ? (
          <p className="text-sm text-muted">불러오는 중…</p>
        ) : thoughts.length === 0 ? (
          <p className="text-sm text-muted">아직 글이 없습니다. 첫 글을 작성해보세요.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {thoughts.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink/5">
                  {t.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.thumbnail_url}
                      alt={t.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                  <p className="mt-1 truncate text-xs text-muted">{excerpt(t.body, 80)}</p>
                  <p className="mt-1 text-[11px] text-ink/40">
                    {formatDate(t.created_at)} · 조회 {viewsFor(t.id)}회
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/thought/view?id=${t.id}`}
                    target="_blank"
                    className="text-xs text-muted transition-colors hover:text-ink"
                  >
                    보기
                  </Link>
                  <Link
                    href={`/admin/new?id=${t.id}`}
                    className="text-xs text-muted transition-colors hover:text-ink"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={busyId === t.id}
                    className="text-xs text-red-600 transition-opacity hover:opacity-70 disabled:opacity-40"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
