"use client";

import { useParams } from "next/navigation";
import ProjectWorkspace from "@/components/workspace/ProjectWorkspace";

export default function UniversityProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  return <ProjectWorkspace problemId={id} partyType="university" basePath="/university" accent="indigo" />;
}
