"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { Accent, ACCENTS, useProjects, ViewerType } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";

/** Sidebar list of workspaces the viewer can open (accepted problems), each linking to its workspace. */
export default function ProjectsNavSection({
  partyType,
  basePath,
  accent,
  label = "My Projects",
  emptyText = "No accepted problems yet",
}: {
  partyType: ViewerType;
  basePath: string;
  accent: Accent;
  label?: string;
  emptyText?: string;
}) {
  const pathname = usePathname();
  const { projects, isLoading } = useProjects(partyType);
  const colors = ACCENTS[accent];

  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const listHref = `${basePath}/projects`;
  const isListActive = pathname === listHref;

  const displayLabel =
    label === "My Projects"
      ? tr("My Projects", "मेरे प्रोजेक्ट")
      : label;

  const displayEmptyText =
    emptyText === "No accepted problems yet"
      ? tr("No accepted problems yet", "अभी तक कोई स्वीकृत समस्या नहीं है")
      : emptyText;

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <Link
        href={listHref}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          isListActive ? colors.active : colors.hover
        }`}
      >
        <FolderKanban
          size={17}
          className={
            isListActive ? "text-white" : "text-slate-400"
          }
        />

        <span className="flex-1">{displayLabel}</span>

        {projects.length > 0 && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isListActive
                ? "bg-white/20 text-white"
                : colors.soft
            }`}
          >
            {projects.length}
          </span>
        )}
      </Link>

      <div className="mt-1 space-y-0.5 pl-3">
        {isLoading && (
          <div className="mx-3 my-1 h-8 animate-pulse rounded-lg bg-slate-100" />
        )}

        {!isLoading && projects.length === 0 && (
          <p className="px-3 py-1.5 text-xs text-slate-400">
            {displayEmptyText}
          </p>
        )}

        {projects.map((project) => {
          const href = `${basePath}/projects/${project.id}`;
          const isActive = pathname === href;

          return (
            <Link
              key={project.id}
              href={href}
              title={project.title}
              className={`block rounded-lg px-3 py-1.5 text-xs transition ${
                isActive
                  ? `${colors.soft} font-semibold`
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {/* Project title is data — keep unchanged */}
              <span className="block truncate">
                {project.title}
              </span>

              <span className="mt-1 flex items-center gap-2">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className={`block h-full rounded-full ${colors.bar}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </span>

                <span className="text-[10px] text-slate-400">
                  {project.progress}%
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}