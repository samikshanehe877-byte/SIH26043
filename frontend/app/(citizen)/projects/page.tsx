"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectCards from "@/components/workspace/ProjectCards";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/lib/projects";

/** Workspaces for problems this citizen reported that have an accepted volunteer. */
export default function CitizenWorkspacesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { projects, isLoading } = useProjects("citizen");

  useEffect(() => {
    if (!authLoading && !user) router.push("/signin?callbackUrl=/projects");
  }, [authLoading, router, user]);

  if (authLoading || !user) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workspaces</h1>
        <p className="mt-1 text-sm text-slate-500">
          Follow the progress on your problems, see who is working on them, and chat with the teams.
        </p>
      </div>
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <ProjectCards
          projects={projects}
          basePath=""
          accent="blue"
          emptyText="A workspace opens when you accept a volunteer for one of your problems. Review volunteers from My Problems."
        />
      )}
    </div>
  );
}
