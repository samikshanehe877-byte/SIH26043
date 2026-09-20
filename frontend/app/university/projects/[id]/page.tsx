"use client";

import { useParams } from "next/navigation";
import TeamMatches from "@/components/people/TeamMatches";
import ProjectWorkspace from "@/components/workspace/ProjectWorkspace";

export default function UniversityProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="space-y-10">
      <ProjectWorkspace problemId={id} partyType="university" basePath="/university" accent="indigo" />
      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-900">Suggested people</h2>
        <p className="mb-4 text-sm text-slate-500">Who, across universities and industries, has the experience this project needs.</p>
        <TeamMatches problemId={id} />
      </section>
    </div>
  );
}
