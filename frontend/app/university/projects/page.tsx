"use client";

import ProjectCards from "@/components/workspace/ProjectCards";
import { useProjects } from "@/lib/projects";

export default function UniversityProjectsPage() {
  const { projects, isLoading } = useProjects("university");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        <p className="mt-1 text-sm text-slate-500">
          Accepted problems you lead or collaborate on. Open a workspace to post updates and chat with partners.
        </p>
      </div>
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <ProjectCards
          projects={projects}
          basePath="/university"
          accent="indigo"
          emptyText="Once a citizen accepts your volunteer proposal, or you accept an industry partner's invitation, the project appears here."
        />
      )}
    </div>
  );
}
