"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectWorkspace from "@/components/workspace/ProjectWorkspace";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

/** Workspace for a problem this citizen reported, once a volunteer has been accepted. */
export default function CitizenProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/signin?callbackUrl=/projects/${id}`);
    }
  }, [id, isLoading, router, user]);

  if (isLoading || !user) return null;

  return (
    <ProjectWorkspace
      problemId={id}
      partyType="citizen"
      basePath=""
      accent="blue"
      backHref={`/my-problems?problemId=${encodeURIComponent(id)}`}
      backLabel={hindi ? "मेरी समस्याएँ" : "My Problems"}
    />
  );
}