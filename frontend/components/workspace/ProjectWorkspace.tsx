"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Crown,
  Download,
  Factory,
  Handshake,
  Link2,
  Loader2,
  MapPin,
  Megaphone,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatOwners, ownerNames } from "@/lib/owners";
import AttachmentGallery, {
  DownloadStatus,
  useDownloader,
} from "./AttachmentGallery";
import CollaborationRequestList from "./CollaborationRequestList";
import {
  FilePickerButton,
  RejectedFilesNotice,
  StagedFilesGrid,
  UploadFailedNotice,
  UploadPhase,
  UploadProgress,
  UploadSucceededNotice,
  useStagedFiles,
} from "./UploadStaging";
import {
  Accent,
  ACCENTS,
  apiJson,
  CollaborationRequestRecord,
  formatRelativeTime,
  MAX_ATTACHMENT_SIZE_MB,
  MAX_UPDATE_ATTACHMENTS,
  PartyType,
  partyQuery,
  PROJECT_STATUS_LABELS,
  ProjectMessageRecord,
  ProjectSummary,
  ProjectUpdateRecord,
  UploadError,
  uploadForm,
  useParty,
  ViewerType,
  workspaceDownloadPaths,
} from "@/lib/projects";
import {
  joinProject, MAX_MILESTONE_ATTACHMENTS, MAX_MILESTONE_LINKS, MILESTONE_LABELS, MILESTONE_TYPES, MilestoneType,
  submitMilestone, useMilestones, useProjectMembers,
} from "@/lib/points";
import MilestoneEvidence from "@/components/points/MilestoneEvidence";
import { useLanguage } from "@/context/LanguageContext";

type Tab = "updates" | "milestones" | "chat" | "collaboration";
type ColorSet = (typeof ACCENTS)[Accent];

const ROLE_LABELS: Record<ProjectSummary["my_role"], string> = {
  lead: "You are the project lead",
  collaborator: "You are a collaborator",
  owner: "You reported this problem",
  invitee: "Invited",
};

const ROLE_LABELS_HINDI: Record<ProjectSummary["my_role"], string> = {
  lead: "आप इस प्रोजेक्ट के मुख्य सदस्य हैं",
  collaborator: "आप सहयोगी हैं",
  owner: "आपने यह समस्या रिपोर्ट की है",
  invitee: "आमंत्रित",
};

const SUPPORT_TYPES = [
  "Funding",
  "Technical Expertise",
  "Hardware",
  "Software Tool",
  "Cloud Resources",
  "Dataset",
  "Domain Expert",
  "Mentorship",
  "Research Partnership",
  "Field Testing",
];

const SUPPORT_TYPES_HINDI: Record<string, string> = {
  Funding: "वित्तीय सहायता",
  "Technical Expertise": "तकनीकी विशेषज्ञता",
  Hardware: "हार्डवेयर",
  "Software Tool": "सॉफ्टवेयर टूल",
  "Cloud Resources": "क्लाउड संसाधन",
  Dataset: "डेटासेट",
  "Domain Expert": "क्षेत्र विशेषज्ञ",
  Mentorship: "मार्गदर्शन",
  "Research Partnership": "शोध साझेदारी",
  "Field Testing": "फील्ड परीक्षण",
};

function useWorkspaceLanguage() {
  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  return { hindi, tr };
}

/**
 * Workspace for one accepted problem, shared by the university, industry and citizen portals.
 * Open to the project lead (accepted volunteer), accepted collaborators, and the citizen who
 * reported the problem. The citizen can follow updates and chat but does not post updates or invite partners.
 */
export default function ProjectWorkspace({
  problemId,
  partyType,
  basePath,
  accent,
  backHref = `${basePath}/projects`,
  backLabel = "My Projects",
}: {
  problemId: string;
  partyType: ViewerType;
  basePath: string;
  accent: Accent;
  backHref?: string;
  backLabel?: string;
}) {
  const { partyName, userName } = useParty(partyType);
  const colors = ACCENTS[accent];
  const { tr } = useWorkspaceLanguage();

  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("updates");

  const loadProject = useCallback(async () => {
    if (!partyName) return;

    try {
      setProject(
        await apiJson<ProjectSummary>(
          `/projects/${problemId}?${partyQuery(partyType, partyName)}`
        )
      );
      setLoadError(null);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load this project"
      );
    }
  }, [problemId, partyType, partyName]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProject(), 0);
    return () => window.clearTimeout(timer);
  }, [loadProject]);

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">{loadError}</p>
        <Link
          href={backHref}
          className={`mt-3 inline-block text-sm font-semibold ${colors.text}`}
        >
          {tr("Back to", "वापस जाएँ")}{" "}
          {backLabel === "My Projects"
            ? tr("My Projects", "मेरे प्रोजेक्ट")
            : backLabel}
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

    const isLead = project.my_role === "lead";
  const isOwner = project.my_role === "owner";
  const tabs: {
    id: Tab;
    label: string;
    icon: typeof Megaphone;
  }[] = [
    {
      id: "updates",
      label: tr("Updates", "अपडेट"),
      icon: Megaphone,
    },
    {
      id: "milestones",
      label: tr("Milestones", "माइलस्टोन"),
      icon: Award,
    },
    {
      id: "chat",
      label: tr("Chat", "चैट"),
      icon: MessageSquare,
    },
    // Inviting partners is the solving organisations' job; the citizen sees partners in the header.
    ...(isOwner
      ? []
      : [
          {
            id: "collaboration" as const,
            label: tr("Collaboration", "सहयोग"),
            icon: Handshake,
          },
        ]),
  ];

  const displayBackLabel =
    backLabel === "My Projects"
      ? tr("My Projects", "मेरे प्रोजेक्ट")
      : backLabel;

  const roleLabel = tr(
    ROLE_LABELS[project.my_role],
    ROLE_LABELS_HINDI[project.my_role]
  );

  return (
    <div className="space-y-5">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={15} /> {displayBackLabel}
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.soft}`}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </span>

          {project.category && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {project.category}
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {isLead && <Crown size={11} />} {roleLabel}
          </span>
        </div>

        {/* Project title and description are backend data — unchanged */}
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {project.title}
        </h1>

        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User size={13} />
            {(project.co_owners?.length ?? 0) > 0
              ? tr("Jointly reported by", "संयुक्त रूप से रिपोर्ट किया गया:")
              : tr("Reported by", "रिपोर्ट किया गया:")}{" "}
            {formatOwners(project.citizen_name, project.co_owners)}
          </span>

          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {project.location}
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-semibold">
            <span className="text-slate-500">
              {tr("Overall progress", "कुल प्रगति")}
            </span>
            <span className={colors.text}>{project.progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${colors.bar} transition-all`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ownerNames(project.citizen_name, project.co_owners).map(
            (name, index) => (
              <span
                key={`owner-${name}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs text-indigo-800"
              >
                <User size={13} />
                <span className="font-semibold">{name}</span>
                <span className="text-indigo-400">
                  ·{" "}
                  {index === 0
                    ? tr("Reported by", "रिपोर्टकर्ता")
                    : tr("Co-owner", "सह-स्वामी")}
                </span>
              </span>
            )
          )}

          {project.parties.map((party) => (
            <span
              key={`${party.type}-${party.name}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
            >
              {party.type === "university" ? (
                <Building2 size={13} />
              ) : (
                <Factory size={13} />
              )}

              <span className="font-semibold">{party.name}</span>

              <span className="text-slate-400">
                ·{" "}
                {party.role === "lead"
                  ? tr("Lead", "मुख्य")
                  : tr("Collaborator", "सहयोगी")}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tab === id
                ? colors.active
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "updates" && (
        <UpdatesPanel
          project={project}
          partyType={partyType}
          partyName={partyName}
          userName={userName}
          accent={accent}
          onPosted={loadProject}
        />
      )}
      {tab === "milestones" && (
        <MilestonesPanel project={project} partyType={partyType} partyName={partyName} userName={userName} accent={accent} />
      )}

      {tab === "chat" && (
        <ChatPanel
          problemId={problemId}
          partyType={partyType}
          partyName={partyName}
          userName={userName}
          accent={accent}
        />
      )}

      {tab === "collaboration" && partyType !== "citizen" && (
        <CollaborationPanel
          project={project}
          partyType={partyType}
          partyName={partyName}
          userName={userName}
          accent={accent}
          basePath={basePath}
        />
      )}
    </div>
  );
}

interface PanelProps {
  partyType: ViewerType;
  partyName: string;
  userName: string;
  accent: Accent;
}

function UpdatesPanel({
  project,
  partyType,
  partyName,
  userName,
  accent,
  onPosted,
}: PanelProps & {
  project: ProjectSummary;
  onPosted: () => void;
}) {
  const colors = ACCENTS[accent];
  const { tr } = useWorkspaceLanguage();

  const isLead = project.my_role === "lead";
  const [updates, setUpdates] = useState<ProjectUpdateRecord[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [changeProgress, setChangeProgress] = useState(false);
  const [progress, setProgress] = useState(project.progress);
  const staged = useStagedFiles(MAX_UPDATE_ATTACHMENTS);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [uploadFraction, setUploadFraction] = useState(0);
  const [failure, setFailure] = useState<{
    error: UploadError | Error;
    hadFiles: boolean;
  } | null>(null);

  const [succeeded, setSucceeded] = useState<{
    updateId: string;
    title: string;
    fileNames: string[];
  } | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [justPostedIds, setJustPostedIds] = useState<Set<string>>(
    new Set()
  );
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const workspaceDownloader = useDownloader();

  const seenRef = useRef<Map<string, number> | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  const loadUpdates = useCallback(async () => {
    try {
      const records = await apiJson<ProjectUpdateRecord[]>(
        `/projects/${project.id}/updates?${partyQuery(
          partyType,
          partyName
        )}`
      );

      const seen = seenRef.current;

      if (seen) {
        const arrived = records
          .filter(
            (u) =>
              !(
                u.author_type === partyType &&
                u.author_org === partyName
              )
          )
          .filter(
            (u) =>
              !seen.has(u.id) ||
              (seen.get(u.id) ?? 0) < u.attachments.length
          )
          .map((u) => u.id);

        if (arrived.length > 0) {
          setFreshIds(
            (prev) => new Set([...prev, ...arrived])
          );
        }
      }

      seenRef.current = new Map(
        records.map((u) => [u.id, u.attachments.length])
      );

      setUpdates(records);
    } catch (err) {
      console.error("Failed to load updates:", err);
    }
  }, [project.id, partyType, partyName]);

  useEffect(() => {
    const load = () => void loadUpdates();

    const initial = window.setTimeout(load, 0);

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 10_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadUpdates]);

  useEffect(() => {
    if (freshIds.size === 0 && justPostedIds.size === 0) return;

    const timer = window.setTimeout(() => {
      setFreshIds(new Set());
      setJustPostedIds(new Set());
    }, 60_000);

    return () => window.clearTimeout(timer);
  }, [freshIds, justPostedIds]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 6000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!scrollToId || !updates.some((u) => u.id === scrollToId))
      return;

    document
      .getElementById(`update-${scrollToId}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    const timer = window.setTimeout(
      () => setScrollToId(null),
      0
    );

    return () => window.clearTimeout(timer);
  }, [scrollToId, updates]);

  const post = async () => {
    const files = staged.files;

    setPhase("uploading");
    setUploadFraction(0);
    setFailure(null);
    setSucceeded(null);

    try {
      const form = new FormData();

      form.set("party_type", partyType);
      form.set("party_name", partyName);
      form.set("author_name", userName);
      form.set("title", title.trim());
      form.set("body", body.trim());

      if (isLead && changeProgress) {
        form.set("progress", String(progress));
      }

      files.forEach((file) => form.append("files", file));

      const created = await uploadForm<ProjectUpdateRecord>(
        `/projects/${project.id}/updates/with-attachments`,
        form,
        setUploadFraction
      );

      const saved = created.attachments.map((a) => a.name);

      if (saved.length !== files.length) {
        throw new UploadError(
          0,
          `Only ${saved.length} of ${files.length} files were saved. Check the update below and add the missing ones again.`
        );
      }

      setSucceeded({
        updateId: created.id,
        title: created.title,
        fileNames: saved,
      });

      setToast(
        saved.length > 0
          ? tr(
              `Update posted. ${saved.length} file${
                saved.length === 1 ? "" : "s"
              } uploaded and shared with everyone in this workspace.`,
              `अपडेट पोस्ट किया गया। ${saved.length} फ़ाइल${
                saved.length === 1 ? "" : "ें"
              } अपलोड की गई और इस वर्कस्पेस में सभी के साथ साझा की गई।`
            )
          : tr(
              "Update posted and shared with everyone in this workspace.",
              "अपडेट पोस्ट किया गया और इस वर्कस्पेस में सभी के साथ साझा किया गया।"
            )
      );

      setJustPostedIds(
        (prev) => new Set([...prev, created.id])
      );

      setScrollToId(created.id);
      setTitle("");
      setBody("");
      setChangeProgress(false);
      staged.clear();
      setPhase("idle");

      await loadUpdates();
      onPosted();
    } catch (err) {
      setFailure({
        error:
          err instanceof Error
            ? err
            : new Error("Could not post the update."),
        hadFiles: files.length > 0,
      });

      setPhase("failed");
    }
  };

  const uploading = phase === "uploading";

  const failedFileName =
    failure?.error instanceof UploadError
      ? failure.error.fileName
      : null;

  const totalFiles = updates.reduce(
    (sum, u) => sum + u.attachments.length,
    0
  );

  const workspaceZipPath =
    workspaceDownloadPaths.workspace(
      project.id,
      partyType,
      partyName
    );

  return (
    <div className="space-y-4">
      {project.my_role === "owner" ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
          {tr(
            "The organisations solving your problem post their progress here. Use the Chat tab to ask them questions.",
            "आपकी समस्या का समाधान करने वाले संगठन यहाँ अपनी प्रगति पोस्ट करते हैं। उनसे प्रश्न पूछने के लिए चैट टैब का उपयोग करें।"
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-800">
            {tr("Post an update", "अपडेट पोस्ट करें")}
          </h2>

          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              placeholder={tr(
                "e.g. Prototype installed at the first junction",
                "उदाहरण: पहले चौराहे पर प्रोटोटाइप स्थापित किया गया"
              )}
              maxLength={140}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none disabled:opacity-60 ${colors.ring}`}
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={uploading}
              rows={3}
              placeholder={tr(
                "Details, findings, blockers or next steps (optional)",
                "विवरण, निष्कर्ष, बाधाएँ या अगले कदम (वैकल्पिक)"
              )}
              className={`w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none disabled:opacity-60 ${colors.ring}`}
            />

            {isLead ? (
              <div className="rounded-xl bg-slate-50 p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={changeProgress}
                    disabled={uploading}
                    onChange={(e) =>
                      setChangeProgress(e.target.checked)
                    }
                  />
                  {tr(
                    "Update overall progress",
                    "कुल प्रगति अपडेट करें"
                  )}
                </label>

                {changeProgress && (
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={progress}
                      onChange={(e) =>
                        setProgress(Number(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span
                      className={`w-12 text-right text-sm font-bold ${colors.text}`}
                    >
                      {progress}%
                    </span>
                  </div>
                )}

                {changeProgress && progress === 100 && (
                  <p className="mt-1 text-xs text-emerald-700">
                    {tr(
                      "Setting 100% marks the problem as completed and tells the citizen it is solved.",
                      "100% सेट करने से समस्या पूर्ण हो जाती है और नागरिक को बताया जाता है कि समस्या हल हो गई है।"
                    )}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                {tr(
                  "The project lead sets overall progress. Your update is shared with every party and the citizen.",
                  "प्रोजेक्ट का मुख्य सदस्य कुल प्रगति निर्धारित करता है। आपका अपडेट सभी संबंधित पक्षों और नागरिक के साथ साझा किया जाता है।"
                )}
              </p>
            )}

            <div className="space-y-2">
              <FilePickerButton
                label={
                  staged.files.length > 0
                    ? tr(
                        `Add more files (${staged.files.length}/${MAX_UPDATE_ATTACHMENTS} selected)`,
                        `और फ़ाइलें जोड़ें (${staged.files.length}/${MAX_UPDATE_ATTACHMENTS} चयनित)`
                      )
                    : tr(
                        "Attach photos, videos, PDFs or Office docs",
                        "फ़ोटो, वीडियो, PDF या Office दस्तावेज़ जोड़ें"
                      )
                }
                disabled={
                  uploading ||
                  staged.files.length >= MAX_UPDATE_ATTACHMENTS
                }
                onPick={(picked) => {
                  staged.add(picked);
                  if (phase === "failed") setPhase("idle");
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
              />

              <p className="text-[11px] text-slate-400">
                {tr(
                  `Up to ${MAX_UPDATE_ATTACHMENTS} files, ${MAX_ATTACHMENT_SIZE_MB} MB each. Click a file to preview it before uploading.`,
                  `अधिकतम ${MAX_UPDATE_ATTACHMENTS} फ़ाइलें, प्रत्येक ${MAX_ATTACHMENT_SIZE_MB} MB तक। अपलोड करने से पहले फ़ाइल का पूर्वावलोकन करने के लिए उस पर क्लिक करें।`
                )}
              </p>

              <RejectedFilesNotice
                rejected={staged.rejected}
                onDismiss={staged.dismissRejected}
              />

              <StagedFilesGrid
                files={staged.files}
                phase={phase}
                failedFileName={failedFileName}
                onRemove={(index) => {
                  staged.remove(index);
                  if (phase === "failed") setPhase("idle");
                }}
              />
            </div>

            {uploading && staged.files.length > 0 && (
              <UploadProgress
                fileCount={staged.files.length}
                fraction={uploadFraction}
              />
            )}

            {failure && (
              <UploadFailedNotice
                error={failure.error}
                hadFiles={failure.hadFiles}
                onRetry={() => void post()}
                onDismiss={() => setFailure(null)}
              />
            )}

            {succeeded && (
              <UploadSucceededNotice
                message={
                  succeeded.fileNames.length > 0
                    ? tr(
                        `Update "${succeeded.title}" posted. ${succeeded.fileNames.length} file${
                          succeeded.fileNames.length === 1
                            ? " was"
                            : "s were"
                        } uploaded and ${
                          succeeded.fileNames.length === 1
                            ? "is"
                            : "are"
                        } now visible to everyone in this workspace:`,
                        `अपडेट "${succeeded.title}" पोस्ट किया गया। ${succeeded.fileNames.length} फ़ाइल${
                          succeeded.fileNames.length === 1
                            ? ""
                            : "ें"
                        } अपलोड की गई और अब इस वर्कस्पेस में सभी को दिखाई दे रही हैं:`
                      )
                    : tr(
                        `Update "${succeeded.title}" posted and shared with everyone in this workspace.`,
                        `अपडेट "${succeeded.title}" पोस्ट किया गया और इस वर्कस्पेस में सभी के साथ साझा किया गया।`
                      )
                }
                fileNames={succeeded.fileNames}
                onView={() =>
                  setScrollToId(succeeded.updateId)
                }
                onDismiss={() => setSucceeded(null)}
              />
            )}

            <div className="flex justify-end">
              <button
                onClick={() => void post()}
                disabled={uploading || !title.trim()}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition disabled:opacity-40 ${colors.solid}`}
              >
                {uploading && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                )}

                {uploading
                  ? staged.files.length > 0
                    ? tr("Uploading...", "अपलोड हो रहा है...")
                    : tr("Posting...", "पोस्ट किया जा रहा है...")
                  : staged.files.length > 0
                    ? tr(
                        `Post update with ${staged.files.length} file${
                          staged.files.length === 1 ? "" : "s"
                        }`,
                        `${staged.files.length} फ़ाइल${
                          staged.files.length === 1 ? "" : "ें"
                        } के साथ अपडेट पोस्ट करें`
                      )
                    : tr(
                        "Post update",
                        "अपडेट पोस्ट करें"
                      )}
              </button>
            </div>
          </div>
        </div>
      )}

      {totalFiles > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm text-slate-600">
              <Paperclip
                size={14}
                className="text-slate-400"
              />
              <span className="font-semibold text-slate-800">
                {totalFiles}{" "}
                {tr(
                  totalFiles === 1 ? "file" : "files",
                  totalFiles === 1 ? "फ़ाइल" : "फ़ाइलें"
                )}
              </span>{" "}
              {tr(
                "shared in this workspace",
                "इस वर्कस्पेस में साझा की गई"
              )}
            </p>

            <button
              onClick={() =>
                void workspaceDownloader.download(
                  workspaceZipPath,
                  `${project.title.slice(0, 60)} - all files.zip`
                )
              }
              disabled={
                workspaceDownloader.busyPath !== null
              }
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {workspaceDownloader.busyPath ? (
                <Loader2
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <Download size={13} />
              )}

              {workspaceDownloader.busyPath
                ? tr("Preparing zip...", "ZIP तैयार हो रही है...")
                : tr(
                    "Download all files (zip)",
                    "सभी फ़ाइलें डाउनलोड करें (zip)"
                  )}
            </button>
          </div>

          <DownloadStatus
            error={workspaceDownloader.error}
            saved={workspaceDownloader.saved}
            onDismiss={workspaceDownloader.clearError}
          />
        </div>
      )}

      <div className="space-y-3">
        {updates.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
            {tr(
              "No updates yet. Share the first milestone with your partners.",
              "अभी तक कोई अपडेट नहीं है। अपने सहयोगियों के साथ पहली उपलब्धि साझा करें।"
            )}
          </p>
        )}

        {updates.map((update) => {
          const isFresh = freshIds.has(update.id);
          const isJustPosted = justPostedIds.has(update.id);

          return (
            <div
              key={update.id}
              id={`update-${update.id}`}
              className={`scroll-mt-24 rounded-2xl border bg-white p-4 shadow-sm transition ${
                isJustPosted
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : isFresh
                    ? "border-amber-300 ring-2 ring-amber-100"
                    : "border-slate-100"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                    {update.title}

                    {isJustPosted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        <CheckCircle2 size={10} />
                        {tr("Just posted", "अभी पोस्ट किया गया")}
                        {update.attachments.length > 0 &&
                          ` · ${update.attachments.length} ${tr(
                            update.attachments.length === 1
                              ? "file"
                              : "files",
                            update.attachments.length === 1
                              ? "फ़ाइल"
                              : "फ़ाइलें"
                          )} ${tr("uploaded", "अपलोड की गई")}`}
                      </span>
                    )}

                    {isFresh && !isJustPosted && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        {tr("New", "नया")}
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-slate-500">
                    {update.author_name} · {update.author_org} ·{" "}
                    {formatRelativeTime(update.created_at)}
                  </p>
                </div>

                {update.progress !== null && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.soft}`}
                  >
                    {tr("Progress", "प्रगति")} →{" "}
                    {update.progress}%
                  </span>
                )}
              </div>

              {update.body && (
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                  {update.body}
                </p>
              )}

              {update.attachments.length > 0 && (
                <div className="mt-3">
                  <AttachmentGallery
                    attachments={update.attachments}
                    downloads={{
                      filePath: (index) =>
                        workspaceDownloadPaths.file(
                          project.id,
                          update.id,
                          index,
                          partyType,
                          partyName
                        ),
                      zipPath:
                        workspaceDownloadPaths.update(
                          project.id,
                          update.id,
                          partyType,
                          partyName
                        ),
                      zipName: `${update.title.slice(
                        0,
                        60
                      )} - files.zip`,
                    }}
                  />
                </div>
              )}

              <AddMoreAttachments
                problemId={project.id}
                update={update}
                partyType={partyType}
                partyName={partyName}
                colors={colors}
                onAdded={(names) => {
                  setJustPostedIds(
                    (prev) =>
                      new Set([...prev, update.id])
                  );

                  setToast(
                    tr(
                      `${names.length} file${
                        names.length === 1 ? "" : "s"
                      } added to "${update.title}" and shared with everyone in this workspace.`,
                      `${names.length} फ़ाइल${
                        names.length === 1 ? "" : "ें"
                      } "${update.title}" में जोड़ी गई और इस वर्कस्पेस में सभी के साथ साझा की गई।`
                    )
                  );

                  void loadUpdates();
                }}
              />
            </div>
          );
        })}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-20 right-4 z-[60] flex max-w-sm items-start gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg lg:bottom-6"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 flex-shrink-0"
          />

          <span className="flex-1">{toast}</span>

          <button
            onClick={() => setToast(null)}
            aria-label={tr("Dismiss", "बंद करें")}
            className="flex-shrink-0 text-white/80 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Lets an update's own author attach further files to it after the fact.
 */
function AddMoreAttachments({
  problemId,
  update,
  partyType,
  partyName,
  colors,
  onAdded,
}: {
  problemId: string;
  update: ProjectUpdateRecord;
  partyType: ViewerType;
  partyName: string;
  colors: ColorSet;
  onAdded: (fileNames: string[]) => void;
}) {
  const { tr } = useWorkspaceLanguage();

  const isAuthor =
    update.author_type === partyType &&
    update.author_org === partyName;

  const remaining =
    MAX_UPDATE_ATTACHMENTS - update.attachments.length;

  const staged = useStagedFiles(
    Math.max(remaining, 0)
  );

  const [phase, setPhase] =
    useState<UploadPhase>("idle");

  const [fraction, setFraction] = useState(0);

  const [failure, setFailure] = useState<
    UploadError | Error | null
  >(null);

  const [confirmed, setConfirmed] =
    useState<string[] | null>(null);

  if (!isAuthor) return null;

  const upload = async () => {
    const files = staged.files;

    setPhase("uploading");
    setFraction(0);
    setFailure(null);
    setConfirmed(null);

    try {
      const form = new FormData();

      form.set("party_type", partyType);
      form.set("party_name", partyName);

      files.forEach((file) =>
        form.append("files", file)
      );

      const result =
        await uploadForm<ProjectUpdateRecord>(
          `/projects/${problemId}/updates/${update.id}/attachments`,
          form,
          setFraction
        );

      const added = result.attachments
        .slice(update.attachments.length)
        .map((a) => a.name);

      if (added.length !== files.length) {
        throw new UploadError(
          0,
          `Only ${added.length} of ${files.length} files were saved. Check the update and add the missing ones again.`
        );
      }

      setConfirmed(added);
      staged.clear();
      setPhase("idle");
      onAdded(added);
    } catch (err) {
      setFailure(
        err instanceof Error
          ? err
          : new Error("Could not attach the files.")
      );
      setPhase("failed");
    }
  };

  const uploading = phase === "uploading";

  const failedFileName =
    failure instanceof UploadError
      ? failure.fileName
      : null;

  return (
    <div className="mt-3 space-y-2">
      {remaining > 0 ? (
        <FilePickerButton
          label={
            staged.files.length > 0
              ? tr("Pick more files", "और फ़ाइलें चुनें")
              : tr("Add more files", "और फ़ाइलें जोड़ें")
          }
          disabled={
            uploading ||
            staged.files.length >= remaining
          }
          onPick={(picked) => {
            staged.add(picked);
            setConfirmed(null);

            if (phase === "failed") {
              setPhase("idle");
            }
          }}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition hover:underline ${colors.text}`}
        />
      ) : (
        <p className="text-[11px] text-slate-400">
          {tr(
            `This update has the maximum of ${MAX_UPDATE_ATTACHMENTS} files.`,
            `इस अपडेट में अधिकतम ${MAX_UPDATE_ATTACHMENTS} फ़ाइलें हैं।`
          )}
        </p>
      )}

      <RejectedFilesNotice
        rejected={staged.rejected}
        onDismiss={staged.dismissRejected}
      />

      {staged.files.length > 0 && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-600">
            {tr(
              `Preview before adding to this update (${staged.files.length} of ${remaining} remaining):`,
              `इस अपडेट में जोड़ने से पहले पूर्वावलोकन करें (${staged.files.length} में से ${remaining} शेष):`
            )}
          </p>

          <StagedFilesGrid
            files={staged.files}
            phase={phase}
            failedFileName={failedFileName}
            onRemove={(index) => {
              staged.remove(index);

              if (phase === "failed") {
                setPhase("idle");
              }
            }}
          />

          {uploading && (
            <UploadProgress
              fileCount={staged.files.length}
              fraction={fraction}
            />
          )}

          {failure && (
            <UploadFailedNotice
              error={failure}
              hadFiles
              onRetry={() => void upload()}
              onDismiss={() => setFailure(null)}
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                staged.clear();
                setFailure(null);
                setPhase("idle");
              }}
              disabled={uploading}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white disabled:opacity-40"
            >
              {tr("Cancel", "रद्द करें")}
            </button>

            <button
              onClick={() => void upload()}
              disabled={uploading}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-40 ${colors.solid}`}
            >
              {uploading && (
                <Loader2
                  size={12}
                  className="animate-spin"
                />
              )}

              {uploading
                ? tr("Uploading...", "अपलोड हो रहा है...")
                : tr(
                    `Upload ${staged.files.length} file${
                      staged.files.length === 1
                        ? ""
                        : "s"
                    }`,
                    `${staged.files.length} फ़ाइल${
                      staged.files.length === 1
                        ? ""
                        : "ें"
                    } अपलोड करें`
                  )}
            </button>
          </div>
        </div>
      )}

      {confirmed && confirmed.length > 0 && (
        <UploadSucceededNotice
          message={tr(
            `${confirmed.length} file${
              confirmed.length === 1 ? "" : "s"
            } were added to this update and are now visible to everyone in this workspace:`,
            `${confirmed.length} फ़ाइल${
              confirmed.length === 1 ? "" : "ें"
            } इस अपडेट में जोड़ी गई और अब इस वर्कस्पेस में सभी को दिखाई दे रही हैं:`
          )}
          fileNames={confirmed}
          onDismiss={() => setConfirmed(null)}
        />
      )}
    </div>
  );
}

const MILESTONE_STATUS_STYLE: Record<"verified" | "rejected" | "submitted", string> = {
  verified: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  submitted: "bg-amber-50 text-amber-700",
};
const MILESTONE_STATUS_LABEL: Record<"verified" | "rejected" | "submitted", string> = {
  verified: "Verified",
  rejected: "Needs resubmission",
  submitted: "Awaiting verification",
};

/**
 * Team roster + milestone submission history, shared by the university and industry workspace.
 * Citizens (my_role "owner") see the same history read-only -- it's their problem's progress --
 * but only the lead/collaborator side can join the team or submit a milestone for verification.
 */
function MilestonesPanel({ project, partyType, partyName, accent }: PanelProps & { project: ProjectSummary }) {
  const colors = ACCENTS[accent];
  const { user } = useAuth();
  const isReadOnly = project.my_role === "owner";
  const { data: members, refresh: refreshMembers } = useProjectMembers(project.id, partyType);
  const { data: milestoneData, refresh: refreshMilestones } = useMilestones(project.id, partyType);
  const [selectedType, setSelectedType] = useState<MilestoneType>(MILESTONE_TYPES[0]);
  const [note, setNote] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Evidence: links typed in, and files picked but not uploaded until the milestone is submitted.
  const [links, setLinks] = useState<string[]>([]);
  const [linkDraft, setLinkDraft] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const staged = useStagedFiles(MAX_MILESTONE_ATTACHMENTS);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [uploadFraction, setUploadFraction] = useState(0);
  const [failure, setFailure] = useState<{ error: UploadError | Error; hadFiles: boolean } | null>(null);
  const submitting = phase === "uploading";

  const isMember = user ? members.some((m) => m.user_id === user.id) : false;
  const verifiedTypes = new Set(milestoneData.milestones.filter((m) => m.status === "verified").map((m) => m.milestone_type));
  const submittableTypes = MILESTONE_TYPES.filter((type) => !verifiedTypes.has(type));
  // The dropdown only offers milestones that aren't verified yet, so the remembered choice has to fall
  // back to the first of those once its own option is gone (e.g. "Project Accepted" after it's verified).
  // Without this the box shows one milestone while a different, no-longer-offered one gets submitted.
  const chosenType: MilestoneType | undefined = submittableTypes.includes(selectedType) ? selectedType : submittableTypes[0];
  // Points this organisation itself earned per milestone, straight from the ledger -- never a
  // locally duplicated point table, so there's nothing here that can drift from ai/points_storage.py.
  const myPointsByMilestone = new Map(
    milestoneData.point_events
      .filter((event) => event.actor_type === partyType && event.actor_id === partyName)
      .map((event) => [event.milestone_id, event.points]),
  );

  const handleJoin = async () => {
    setIsJoining(true);
    setError(null);
    setNotice(null);
    try {
      await joinProject(project.id);
      setNotice("You've joined this project's team. Verified milestones now credit you individually too.");
      await refreshMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the team");
    } finally {
      setIsJoining(false);
    }
  };

  /** A typed link as a full http(s) URL, or null if it isn't one. "www.example.com" gets https:// added,
   * the same as the server does, so what's shown here is what gets stored. */
  const parseLink = (value: string): string | null => {
    const trimmed = value.trim();
    const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const url = new URL(withScheme);
      return (url.protocol === "http:" || url.protocol === "https:") && url.hostname ? withScheme : null;
    } catch {
      return null;
    }
  };

  const addLink = () => {
    if (!linkDraft.trim()) return;
    const parsed = parseLink(linkDraft);
    if (!parsed) {
      setLinkError("That doesn't look like a web link. Links must start with http:// or https://");
      return;
    }
    if (!links.includes(parsed)) {
      if (links.length >= MAX_MILESTONE_LINKS) {
        setLinkError(`You can add up to ${MAX_MILESTONE_LINKS} links.`);
        return;
      }
      setLinks((prev) => [...prev, parsed]);
    }
    setLinkDraft("");
    setLinkError(null);
  };

  const handleSubmit = async () => {
    if (!chosenType) return;
    // A link that was typed but never added with "Add" still counts; dropping it silently would be worse.
    let linksToSend = links;
    if (linkDraft.trim()) {
      const parsed = parseLink(linkDraft);
      if (!parsed) {
        setLinkError("That doesn't look like a web link. Links must start with http:// or https://");
        return;
      }
      linksToSend = links.includes(parsed) ? links : [...links, parsed];
    }
    const files = staged.files;
    setPhase("uploading");
    setUploadFraction(0);
    setFailure(null);
    setError(null);
    setNotice(null);
    setLinkError(null);
    try {
      await submitMilestone(
        project.id, chosenType, { note: note.trim() || undefined, links: linksToSend, files }, setUploadFraction,
      );
      const evidenceCount = files.length + linksToSend.length;
      setNotice(
        `"${MILESTONE_LABELS[chosenType]}" submitted for government verification` +
          (evidenceCount > 0 ? ` with ${evidenceCount} piece${evidenceCount === 1 ? "" : "s"} of evidence.` : "."),
      );
      setNote("");
      setLinks([]);
      setLinkDraft("");
      staged.clear();
      setPhase("idle");
      await refreshMilestones();
    } catch (err) {
      setFailure({ error: err instanceof Error ? err : new Error("Could not submit the milestone."), hadFiles: files.length > 0 });
      setPhase("failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-800">Team</h2>
          {!isReadOnly && !isMember && (
            <button
              onClick={() => void handleJoin()}
              disabled={isJoining}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition disabled:opacity-40 ${colors.solid}`}
            >
              {isJoining ? "Joining..." : "Join this project"}
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Everyone listed here is credited individually when a milestone is verified, on top of the points
          your organisation earns as a whole.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {members.length === 0 && <p className="text-xs text-slate-400">No one has joined the team yet.</p>}
          {members.map((member) => (
            <span key={member.id} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
              <User size={13} />
              <span className="font-semibold">{member.user_name}</span>
              {member.role && <span className="text-slate-400">· {member.role}</span>}
            </span>
          ))}
        </div>
      </div>

      {!isReadOnly && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800">Submit a milestone</h2>
          <p className="mt-0.5 text-xs text-slate-500">A government officer verifies it before it counts toward your points.</p>
          <div className="mt-3 space-y-3">
            <select
              value={chosenType ?? ""}
              onChange={(e) => setSelectedType(e.target.value as MilestoneType)}
              disabled={submittableTypes.length === 0}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none disabled:opacity-60 ${colors.ring}`}
            >
              {submittableTypes.length === 0 && <option>Every milestone is already verified</option>}
              {submittableTypes.map((type) => (
                <option key={type} value={type}>{MILESTONE_LABELS[type]}</option>
              ))}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={submitting}
              rows={2}
              placeholder="Notes for the reviewing officer (optional)"
              className={`w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none disabled:opacity-60 ${colors.ring}`}
            />

            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <p className="text-xs font-semibold text-slate-700">
                Evidence <span className="font-normal text-slate-400">(optional, but helps the officer verify faster)</span>
              </p>
              <FilePickerButton
                label={staged.files.length > 0
                  ? `Add more files (${staged.files.length}/${MAX_MILESTONE_ATTACHMENTS} selected)`
                  : "Attach photos, videos, PDFs or Office docs"}
                disabled={submitting || staged.files.length >= MAX_MILESTONE_ATTACHMENTS}
                onPick={(picked) => {
                  staged.add(picked);
                  if (phase === "failed") setPhase("idle");
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
              />
              <p className="text-[11px] text-slate-400">
                Up to {MAX_MILESTONE_ATTACHMENTS} files, {MAX_ATTACHMENT_SIZE_MB} MB each. Click a file to preview it before submitting.
              </p>
              <RejectedFilesNotice rejected={staged.rejected} onDismiss={staged.dismissRejected} />
              <StagedFilesGrid
                files={staged.files}
                phase={phase}
                failedFileName={failure?.error instanceof UploadError ? failure.error.fileName : null}
                onRemove={(index) => {
                  staged.remove(index);
                  if (phase === "failed") setPhase("idle");
                }}
              />

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={linkDraft}
                    onChange={(e) => {
                      setLinkDraft(e.target.value);
                      setLinkError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLink();
                      }
                    }}
                    disabled={submitting}
                    placeholder="Paste a link (demo video, shared folder, repository...)"
                    className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none disabled:opacity-60 ${colors.ring}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={addLink}
                  disabled={submitting || !linkDraft.trim()}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {linkError && <p className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">{linkError}</p>}
              {links.length > 0 && (
                <ul className="space-y-1">
                  {links.map((url) => (
                    <li key={url} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 text-xs text-slate-700">
                      <Link2 size={12} className="flex-shrink-0 text-slate-400" />
                      <span className="min-w-0 flex-1 truncate" title={url}>{url}</span>
                      <button
                        type="button"
                        onClick={() => setLinks((prev) => prev.filter((l) => l !== url))}
                        disabled={submitting}
                        aria-label={`Remove ${url}`}
                        className="flex-shrink-0 text-slate-400 hover:text-red-500 disabled:opacity-40"
                      >
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {submitting && staged.files.length > 0 && <UploadProgress fileCount={staged.files.length} fraction={uploadFraction} />}
            {failure && (
              <UploadFailedNotice
                error={failure.error}
                hadFiles={failure.hadFiles}
                failedTitle="Couldn't submit the milestone."
                onRetry={() => void handleSubmit()}
                onDismiss={() => setFailure(null)}
              />
            )}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{notice}</p>}
            <div className="flex justify-end">
              <button
                onClick={() => void handleSubmit()}
                disabled={submitting || submittableTypes.length === 0}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition disabled:opacity-40 ${colors.solid}`}
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? (staged.files.length > 0 ? "Uploading..." : "Submitting...") : "Submit for verification"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {milestoneData.milestones.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
            No milestones submitted yet.
          </p>
        )}
        {MILESTONE_TYPES.map((type) => {
          const milestone = milestoneData.milestones.find((m) => m.milestone_type === type);
          if (!milestone) return null;
          const points = myPointsByMilestone.get(milestone.id);
          return (
            <div key={type} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{MILESTONE_LABELS[type]}</p>
                <div className="flex items-center gap-2">
                  {milestone.status === "verified" && points !== undefined && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.soft}`}>+{points} pts</span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${MILESTONE_STATUS_STYLE[milestone.status]}`}>
                    {MILESTONE_STATUS_LABEL[milestone.status]}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Submitted by {milestone.submitted_by_name} ({milestone.submitted_by_org_name}) · {formatRelativeTime(milestone.submitted_at)}
              </p>
              {milestone.submitted_note && <p className="mt-1 text-xs text-slate-600">{milestone.submitted_note}</p>}
              <MilestoneEvidence milestone={milestone} />
              {milestone.decision_note && (
                <p className="mt-1 text-xs text-slate-600">
                  <span className="font-semibold">Officer note:</span> {milestone.decision_note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChatPanel({
  problemId,
  partyType,
  partyName,
  userName,
  accent,
}: PanelProps & { problemId: string }) {
  const colors = ACCENTS[accent];
  const { tr } = useWorkspaceLanguage();

  const [messages, setMessages] =
    useState<ProjectMessageRecord[]>([]);

  const [text, setText] = useState("");
  const [error, setError] =
    useState<string | null>(null);

  const [isSending, setIsSending] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const lastMessageId =
    messages[messages.length - 1]?.id;

  const loadMessages = useCallback(async () => {
    try {
      setMessages(
        await apiJson<ProjectMessageRecord[]>(
          `/projects/${problemId}/messages?${partyQuery(
            partyType,
            partyName
          )}`
        )
      );
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [problemId, partyType, partyName]);

  useEffect(() => {
    const load = () => void loadMessages();

    const initial = window.setTimeout(load, 0);
    const interval = window.setInterval(
      load,
      5_000
    );

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [lastMessageId]);

  const send = async () => {
    if (!text.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const message =
        await apiJson<ProjectMessageRecord>(
          `/projects/${problemId}/messages`,
          {
            method: "POST",
            body: JSON.stringify({
              party_type: partyType,
              party_name: partyName,
              author_name: userName,
              text,
            }),
          }
        );

      setMessages((prev) => [...prev, message]);
      setText("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send the message"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[32rem] flex-col rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            {tr(
              "No messages yet. Say hello to your project partners.",
              "अभी तक कोई संदेश नहीं है। अपने प्रोजेक्ट सहयोगियों को नमस्ते कहें।"
            )}
          </p>
        )}

        {messages.map((message) => {
          const isMine =
            message.author_type === partyType &&
            message.author_org === partyName;

          return (
            <div
              key={message.id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? colors.mine
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    isMine
                      ? "text-white/80"
                      : "text-slate-500"
                  }`}
                >
                  {message.author_name} ·{" "}
                  {message.author_type === "citizen"
                    ? tr(
                        "Problem owner",
                        "समस्या के स्वामी"
                      )
                    : message.author_org}
                </p>

                <p className="whitespace-pre-line text-sm">
                  {message.text}
                </p>

                <p
                  className={`mt-0.5 text-right text-[10px] ${
                    isMine
                      ? "text-white/70"
                      : "text-slate-400"
                  }`}
                >
                  {formatRelativeTime(
                    message.created_at
                  )}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mx-4 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-end gap-2 border-t border-slate-100 p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              void send();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder={tr(
            "Message all project partners... (Shift+Enter for a new line)",
            "सभी प्रोजेक्ट सहयोगियों को संदेश भेजें... (नई लाइन के लिए Shift+Enter)"
          )}
          className={`max-h-32 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none ${colors.ring}`}
        />

        <button
          onClick={send}
          disabled={
            isSending || !text.trim()
          }
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition disabled:opacity-40 ${colors.solid}`}
          aria-label={tr(
            "Send message",
            "संदेश भेजें"
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

interface DirectoryEntry {
  id: string;
  name: string;
  detail: string;
}

function CollaborationPanel({
  project,
  partyType,
  partyName,
  userName,
  accent,
  basePath,
}: Omit<PanelProps, "partyType"> & {
  partyType: PartyType;
  project: ProjectSummary;
  basePath: string;
}) {
  const colors = ACCENTS[accent];
  const { hindi, tr } = useWorkspaceLanguage();

  const isLead = project.my_role === "lead";

  const partnerType: PartyType =
    partyType === "university"
      ? "industry"
      : "university";

  const [requests, setRequests] =
    useState<CollaborationRequestRecord[]>([]);

  const [directory, setDirectory] =
    useState<DirectoryEntry[]>([]);

  const [partnerName, setPartnerName] =
    useState("");

  const [supportTypes, setSupportTypes] =
    useState<string[]>([]);

  const [description, setDescription] =
    useState("");

  const [progressSummary, setProgressSummary] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [notice, setNotice] =
    useState<string | null>(null);

  const [isSending, setIsSending] =
    useState(false);

  const loadRequests = useCallback(async () => {
    try {
      const records =
        await apiJson<CollaborationRequestRecord[]>(
          `/collaboration-requests?problem_id=${encodeURIComponent(
            project.id
          )}`
        );

      setRequests(
        records.filter(
          (r) =>
            (partyType === "university"
              ? r.university_name
              : r.industry_name) === partyName
        )
      );
    } catch (err) {
      console.error(
        "Failed to load collaboration requests:",
        err
      );
    }
  }, [project.id, partyType, partyName]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => void loadRequests(),
      0
    );

    return () =>
      window.clearTimeout(timer);
  }, [loadRequests]);

  useEffect(() => {
    if (!isLead) return;

    const path =
      partnerType === "industry"
        ? "/api/directory/industries"
        : "/api/directory/universities";

    fetch(path, { cache: "no-store" })
      .then((response) =>
        response.ok ? response.json() : []
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((records: any[]) =>
        setDirectory(
          (Array.isArray(records)
            ? records
            : []
          ).map((r) => ({
            id: r.id,
            name:
              partnerType === "industry"
                ? r.companyName
                : r.name,
            detail:
              partnerType === "industry"
                ? r.industryType
                : [
                    r.district,
                    r.state,
                  ]
                    .filter(Boolean)
                    .join(", "),
          }))
        )
      )
      .catch(() => setDirectory([]));
  }, [isLead, partnerType]);

  const currentPartners = new Set(
    project.parties
      .filter((p) => p.type === partnerType)
      .map((p) => p.name)
  );

  const awaitingReply = new Set(
    requests
      .filter(
        (r) =>
          r.status === "pending" ||
          r.status === "clarification_needed"
      )
      .map((r) =>
        partnerType === "industry"
          ? r.industry_name
          : r.university_name
      )
  );

  const invite = async () => {
    setIsSending(true);
    setError(null);
    setNotice(null);

    try {
      await apiJson(
        "/collaboration-requests",
        {
          method: "POST",
          body: JSON.stringify({
            requested_by: partyType,
            university_name:
              partyType === "university"
                ? partyName
                : partnerName,
            industry_name:
              partyType === "industry"
                ? partyName
                : partnerName,
            requester_contact: userName,
            problem_id: project.id,
            challenge_title: project.title,
            problem_description:
              project.description,
            category: project.category,
            support_types: supportTypes,
            description:
              description.trim() || undefined,
            progress_summary:
              progressSummary.trim(),
          }),
        }
      );

      setNotice(
        tr(
          `Invitation sent. ${partnerName} can review the problem and your progress, and joins the workspace if they accept.`,
          `आमंत्रण भेजा गया। ${partnerName} समस्या और आपकी प्रगति की समीक्षा कर सकता है और स्वीकार करने पर वर्कस्पेस से जुड़ जाएगा।`
        )
      );

      setPartnerName("");
      setSupportTypes([]);
      setDescription("");
      setProgressSummary("");

      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send the invitation"
      );
    } finally {
      setIsSending(false);
    }
  };

  const partnerLabel =
    partnerType === "industry"
      ? tr("industry partner", "उद्योग सहयोगी")
      : tr("university", "विश्वविद्यालय");

  const partnerLabelPlural =
    partnerType === "industry"
      ? tr("industry partners", "उद्योग सहयोगी")
      : tr("universities", "विश्वविद्यालय");

  return (
    <div className="space-y-4">
      {isLead ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800">
            {tr(
              `Invite a ${partnerLabel}`,
              `${partnerLabel} को आमंत्रित करें`
            )}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {tr(
              "As the accepted volunteer you lead this project. Partners who accept join this workspace, its chat and updates.",
              "स्वीकृत स्वयंसेवक के रूप में आप इस प्रोजेक्ट का नेतृत्व करते हैं। स्वीकार करने वाले सहयोगी इस वर्कस्पेस, चैट और अपडेट्स से जुड़ जाते हैं।"
            )}
          </p>

          <div className="mt-4 space-y-3">
            <select
              value={partnerName}
              onChange={(e) =>
                setPartnerName(e.target.value)
              }
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none ${colors.ring}`}
            >
              <option value="">
                {tr(
                  `Select a ${partnerLabel}...`,
                  `${partnerLabel} चुनें...`
                )}
              </option>

              {directory.map((entry) => (
                <option
                  key={entry.id}
                  value={entry.name}
                  disabled={awaitingReply.has(
                    entry.name
                  )}
                >
                  {entry.name}
                  {entry.detail
                    ? ` (${entry.detail})`
                    : ""}
                  {awaitingReply.has(entry.name)
                    ? tr(
                        " · request awaiting reply",
                        " · अनुरोध के उत्तर की प्रतीक्षा"
                      )
                    : currentPartners.has(entry.name)
                      ? tr(
                          " · current partner",
                          " · वर्तमान सहयोगी"
                        )
                      : ""}
                </option>
              ))}
            </select>

            {currentPartners.has(partnerName) && (
              <p className="text-xs text-slate-500">
                {tr(
                  `${partnerName} already works on this project. This sends them a new request for additional support.`,
                  `${partnerName} पहले से इस प्रोजेक्ट पर काम कर रहा है। यह उन्हें अतिरिक्त सहायता के लिए नया अनुरोध भेजेगा।`
                )}
              </p>
            )}

            {directory.length === 0 && (
              <p className="text-xs text-slate-400">
                {tr(
                  `No registered ${partnerLabelPlural} found.`,
                  `कोई पंजीकृत ${partnerLabelPlural} नहीं मिला।`
                )}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {SUPPORT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSupportTypes((prev) =>
                      prev.includes(type)
                        ? prev.filter(
                            (t) => t !== type
                          )
                        : [...prev, type]
                    )
                  }
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    supportTypes.includes(type)
                      ? colors.active
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {hindi
                    ? SUPPORT_TYPES_HINDI[type] ??
                      type
                    : type}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                {tr(
                  "Progress so far",
                  "अब तक की प्रगति"
                )}{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                value={progressSummary}
                onChange={(e) =>
                  setProgressSummary(e.target.value)
                }
                rows={3}
                placeholder={tr(
                  `What has been done so far (currently ${project.progress}%)? The ${partnerLabel} sees this before deciding.`,
                  `अब तक क्या किया गया है (वर्तमान में ${project.progress}%)? निर्णय लेने से पहले ${partnerLabel} इसे देखेगा।`
                )}
                className={`w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none ${colors.ring}`}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                {tr(
                  "What you need from them",
                  "आपको उनसे क्या चाहिए"
                )}
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={3}
                placeholder={tr(
                  `What do you need from the ${partnerLabel}?`,
                  `${partnerLabel} से आपको क्या चाहिए?`
                )}
                className={`w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none ${colors.ring}`}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            {notice && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {notice}
              </p>
            )}

            <div className="flex justify-end">
              <button
                onClick={invite}
                disabled={
                  isSending ||
                  !partnerName ||
                  supportTypes.length === 0 ||
                  !progressSummary.trim()
                }
                className={`rounded-xl px-5 py-2 text-sm font-bold transition disabled:opacity-40 ${colors.solid}`}
              >
                {isSending
                  ? tr("Sending...", "भेजा जा रहा है...")
                  : tr(
                      "Send invitation",
                      "आमंत्रण भेजें"
                    )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-sm">
          {tr(
            "You joined this project as a collaborator. The project lead invites further partners.",
            "आप इस प्रोजेक्ट में सहयोगी के रूप में शामिल हुए हैं। प्रोजेक्ट का मुख्य सदस्य अन्य सहयोगियों को आमंत्रित करता है।"
          )}
        </div>
      )}

      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-800">
          {tr(
            "Collaboration requests",
            "सहयोग अनुरोध"
          )}
        </h2>

        <CollaborationRequestList
          requests={requests}
          viewerType={partyType}
          viewerName={partyName}
          onChanged={loadRequests}
          workspaceBasePath={basePath}
          emptyText={
            isLead
              ? tr(
                  "No invitations sent yet.",
                  "अभी तक कोई आमंत्रण नहीं भेजा गया है।"
                )
              : tr(
                  "No requests.",
                  "कोई अनुरोध नहीं है।"
                )
          }
        />
      </div>
    </div>
  );
}