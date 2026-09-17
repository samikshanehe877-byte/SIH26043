"use client";

import ProjectCards from "@/components/workspace/ProjectCards";
import { useProjects } from "@/lib/projects";

export default function IndustryProjectsPage() {
  const { projects, isLoading } = useProjects("industry");

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        <p className="mt-1 text-slate-500">
          Accepted problems you lead or support. Open a workspace to post updates and chat with partners.
        </p>
      </div>
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <ProjectCards
          projects={projects}
          basePath="/industry"
          accent="blue"
          emptyText="Once a citizen accepts your volunteer proposal, or you accept a university's collaboration request, the project appears here."
        />
      )}
    </div>
  );
}
