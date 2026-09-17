"use client";

import { useParams } from "next/navigation";
import ProjectWorkspace from "@/components/workspace/ProjectWorkspace";

export default function IndustryProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  return <ProjectWorkspace problemId={id} partyType="industry" basePath="/industry" accent="blue" />;
}
