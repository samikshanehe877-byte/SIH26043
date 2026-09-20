"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectCards from "@/components/workspace/ProjectCards";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";

/** Workspaces for problems this citizen reported that have an accepted volunteer. */
export default function CitizenWorkspacesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { projects, isLoading } = useProjects("citizen");
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin?callbackUrl=/projects");
    }
  }, [authLoading, router, user]);

  if (authLoading || !user) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {tr("Workspaces", "वर्कस्पेस")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {tr(
            "Follow the progress on your problems, see who is working on them, and chat with the teams.",
            "अपनी समस्याओं की प्रगति देखें, जानें कि उन पर कौन काम कर रहा है और टीमों के साथ बातचीत करें।"
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <ProjectCards
          projects={projects}
          basePath=""
          accent="blue"
          emptyText={tr(
            "A workspace opens when you accept a volunteer for one of your problems. Review volunteers from My Problems.",
            "जब आप अपनी किसी समस्या के लिए किसी स्वयंसेवक को स्वीकार करते हैं, तब एक वर्कस्पेस खुलता है। स्वयंसेवकों की समीक्षा मेरी समस्याएँ से करें।"
          )}
        />
      )}
    </div>
  );
}