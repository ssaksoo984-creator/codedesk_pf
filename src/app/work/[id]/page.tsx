import { notFound } from "next/navigation";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { WorkDetailClient } from "./work-detail-client";

export function generateStaticParams() {
  return VISIBLE_WORK_PROJECTS.map((project) => ({ id: project.index }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = VISIBLE_WORK_PROJECTS.findIndex((p) => p.index === id);
  if (index === -1) notFound();

  return (
    <WorkDetailClient
      project={VISIBLE_WORK_PROJECTS[index]}
      prev={VISIBLE_WORK_PROJECTS[index - 1] ?? null}
      next={VISIBLE_WORK_PROJECTS[index + 1] ?? null}
    />
  );
}
