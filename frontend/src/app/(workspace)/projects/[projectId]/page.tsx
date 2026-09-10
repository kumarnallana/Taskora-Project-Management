import { Suspense } from "react";
import { ProjectWorkspace } from "@/components/projects/ProjectWorkspace";
import { Loading } from "@/components/shared/Feedback";
export const metadata = { title: "Project workspace" };
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <ProjectWorkspace id={projectId} />
    </Suspense>
  );
}
