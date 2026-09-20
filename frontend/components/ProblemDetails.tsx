"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  Calendar,
  Building2,
  ThumbsUp,
  Send,
  Users,
  Handshake,
  CheckCircle2,
  Trash2,
  FolderKanban,
} from "lucide-react";
import { Problem } from "@/types/problem";
import { formatOwners, isOwner, ownerNames } from "@/lib/owners";
import { useAuth } from "@/context/AuthContext";
import { useProblems } from "@/context/ProblemsContext";
import { useLanguage } from "@/context/LanguageContext";
import StatusBadge from "./StatusBadge";
import ProgressTracker from "./ProgressTracker";

interface ProblemDetailsProps {
  problem: Problem;
  onClose: () => void;
  onToggleSupport: (id: number | string) => void;
}

const categoryHindi: Record<string, string> = {
  Infrastructure: "बुनियादी ढाँचा",
  Environment: "पर्यावरण",
  Education: "शिक्षा",
  Healthcare: "स्वास्थ्य सेवा",
  Transportation: "परिवहन",
  "Public Safety": "सार्वजनिक सुरक्षा",
  Technology: "प्रौद्योगिकी",
  "Water and Sanitation": "जल और स्वच्छता",
  Other: "अन्य",
};

export default function ProblemDetails({
  problem,
  onClose,
  onToggleSupport,
}: ProblemDetailsProps) {
  const { user } = useAuth();
  const { selectVolunteer, withdrawVolunteerRequest } = useProblems();
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const [localProblem, setLocalProblem] = useState<Problem | null>(null);
  const displayProblem = localProblem ?? problem;
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(problem.comments);

  const isGiver = user
    ? isOwner(
        displayProblem.citizenName,
        displayProblem.coOwners,
        user.name
      )
    : false;

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    setLocalComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: user?.name || "You",
        avatar: user?.name.charAt(0).toUpperCase() || "U",
        text: commentText.trim(),
        timeAgo: "Just now",
      },
    ]);

    setCommentText("");
  };

  const [selectError, setSelectError] = useState<string | null>(null);

  const handleSelectVolunteer = async (
    solverType: "university" | "industry",
    solverName: string
  ) => {
    setSelectError(null);

    const success = await selectVolunteer(
      displayProblem.id,
      solverType,
      solverName
    );

    if (!success) {
      setSelectError(
        tr(
          "Could not accept this volunteer. The problem must be verified and you must be its owner.",
          "इस स्वयंसेवक को स्वीकार नहीं किया जा सका। समस्या सत्यापित होनी चाहिए और आप इसके स्वामी होने चाहिए।"
        )
      );
    }

    if (success) {
      const updatedVolunteers = (displayProblem.volunteers ?? []).map(
        (v) => {
          if (
            v.solverType === solverType &&
            v.solverName === solverName
          ) {
            return { ...v, status: "accepted" as const };
          }

          if (v.status === "volunteered") {
            return { ...v, status: "rejected" as const };
          }

          return v;
        }
      );

      setLocalProblem({
        ...displayProblem,
        volunteers: updatedVolunteers,
        status: "Assigned to University",
        assignedByGiver: true,
      });
    }
  };

  const handleWithdrawVolunteer = async (
    solverType: "university" | "industry",
    solverName: string
  ) => {
    const success = await withdrawVolunteerRequest(
      displayProblem.id,
      solverType,
      solverName
    );

    if (success) {
      const updatedVolunteers = (displayProblem.volunteers ?? []).map(
        (v) =>
          v.solverType === solverType && v.solverName === solverName
            ? { ...v, status: "withdrawn" as const }
            : v
      );

      setLocalProblem({
        ...displayProblem,
        volunteers: updatedVolunteers,
      });
    }
  };

  const activeVolunteers = (displayProblem.volunteers ?? []).filter(
    (v) =>
      v.status === "volunteered" || v.status === "accepted"
  );

  const acceptedVolunteer = (
    displayProblem.volunteers ?? []
  ).find((v) => v.status === "accepted");

  const displayCategory = hindi
    ? categoryHindi[displayProblem.category] ?? displayProblem.category
    : displayProblem.category;

  const displayNature =
    displayProblem.problemNature === "Technical"
      ? tr("⚙️ Technical", "⚙️ तकनीकी")
      : displayProblem.problemNature === "Non-Technical"
      ? tr("🤝 Non-Technical", "🤝 गैर-तकनीकी")
      : tr("🌐 Hybrid", "🌐 हाइब्रिड");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-slate-100 p-5">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={displayProblem.status} />

              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {displayCategory}
              </span>

              {displayProblem.problemNature && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    displayProblem.problemNature === "Technical"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : displayProblem.problemNature === "Non-Technical"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {displayNature}
                </span>
              )}

              {displayProblem.problemGiverType &&
                displayProblem.problemGiverType !== "individual" && (
                  <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold">
                    👥{" "}
                    {displayProblem.communityGroupName ||
                      tr("Community Group", "सामुदायिक समूह")}
                  </span>
                )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {displayProblem.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label={tr("Close", "बंद करें")}
            className="flex-shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-5">
            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                {displayProblem.location}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                {tr("Posted", "प्रस्तुत किया गया")}{" "}
                {displayProblem.date}
              </span>

              <span className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {displayProblem.citizenAvatar}
                </div>

                {formatOwners(
                  displayProblem.citizenName,
                  displayProblem.coOwners
                )}
              </span>
            </div>

            {(displayProblem.coOwners?.length ?? 0) > 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2">
                <Users
                  size={14}
                  className="mt-0.5 flex-shrink-0 text-indigo-600"
                />

                <p className="text-xs text-indigo-900">
                  <span className="font-semibold">
                    {tr("Jointly owned.", "संयुक्त स्वामित्व।")}
                  </span>{" "}
                  {tr(
                    `Duplicate reports of this problem were merged, so ${ownerNames(
                      displayProblem.citizenName,
                      displayProblem.coOwners
                    ).join(", ")} share ownership and can each act on it.`,
                    `इस समस्या की डुप्लिकेट रिपोर्ट को मर्ज किया गया है, इसलिए ${ownerNames(
                      displayProblem.citizenName,
                      displayProblem.coOwners
                    ).join(", ")} इसका संयुक्त स्वामित्व रखते हैं और प्रत्येक इस पर कार्रवाई कर सकता है।`
                  )}
                </p>
              </div>
            )}

            {/* Structured Scope Card */}
            {(displayProblem.affectedPopulation ||
              displayProblem.frequency ||
              displayProblem.suggestedIntervention ||
              (displayProblem.requiredCapabilities &&
                displayProblem.requiredCapabilities.length > 0)) && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {tr(
                      "AI-Structured Scope & Requirements",
                      "AI-संरचित दायरा और आवश्यकताएँ"
                    )}
                  </h4>

                  {displayProblem.confirmedByGiver && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ {tr("Citizen Confirmed", "नागरिक द्वारा पुष्टि की गई")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {displayProblem.affectedPopulation && (
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                      <span className="font-semibold text-slate-400 block mb-0.5">
                        {tr(
                          "Affected Population",
                          "प्रभावित जनसंख्या"
                        )}
                      </span>

                      <span className="font-medium text-slate-800">
                        {displayProblem.affectedPopulation}
                      </span>
                    </div>
                  )}

                  {displayProblem.frequency && (
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                      <span className="font-semibold text-slate-400 block mb-0.5">
                        {tr(
                          "Recurrence Pattern",
                          "पुनरावृत्ति पैटर्न"
                        )}
                      </span>

                      <span className="font-medium text-slate-800">
                        {displayProblem.frequency}
                      </span>
                    </div>
                  )}
                </div>

                {displayProblem.requiredCapabilities &&
                  displayProblem.requiredCapabilities.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-500 text-[11px] block mb-1.5">
                        {tr(
                          "Required Capabilities & Skills:",
                          "आवश्यक क्षमताएँ और कौशल:"
                        )}
                      </span>

                      <div className="flex flex-wrap gap-1">
                        {displayProblem.requiredCapabilities.map(
                          (cap, i) => (
                            <span
                              key={i}
                              className="rounded-lg bg-white border border-blue-100 text-blue-700 px-2 py-0.5 text-[11px] font-semibold shadow-2xs"
                            >
                              {cap}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {displayProblem.suggestedIntervention && (
                  <div className="rounded-xl bg-blue-50/60 border border-blue-100/80 p-2.5 text-xs text-blue-900">
                    <span className="font-bold block mb-0.5">
                      {tr(
                        "Suggested Intervention Vector:",
                        "सुझाया गया हस्तक्षेप:"
                      )}
                    </span>

                    <span>{displayProblem.suggestedIntervention}</span>
                  </div>
                )}

                {displayProblem.rawInput &&
                  displayProblem.rawInput !==
                    displayProblem.description && (
                    <details className="text-xs text-slate-500 cursor-pointer pt-1">
                      <summary className="font-semibold hover:text-slate-800">
                        {tr(
                          "View original raw citizen report",
                          "नागरिक की मूल रिपोर्ट देखें"
                        )}
                      </summary>

                      <p className="mt-1.5 rounded-lg bg-white p-2.5 border border-slate-200/80 italic text-slate-700">
                        &ldquo;{displayProblem.rawInput}&rdquo;
                      </p>
                    </details>
                  )}
              </div>
            )}

            {/* Image */}
            {displayProblem.image && (
              <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-6xl border border-slate-100">
                {displayProblem.image}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-700">
                {tr("Detailed Statement", "विस्तृत विवरण")}
              </h4>

              <p className="text-sm text-slate-600 leading-relaxed">
                {displayProblem.description}
              </p>
            </div>

            {/* Current Assignment */}
            {acceptedVolunteer && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  {acceptedVolunteer.solverType === "university" ? (
                    <Building2
                      size={16}
                      className="text-emerald-600"
                    />
                  ) : (
                    <Users size={16} className="text-emerald-600" />
                  )}

                  <span className="text-sm font-bold text-emerald-800">
                    {tr("Assigned Solver", "नियुक्त समाधानकर्ता")}
                  </span>
                </div>

                <p className="text-sm text-emerald-700 leading-relaxed">
                  <span className="font-semibold">
                    {acceptedVolunteer.solverName}
                  </span>{" "}
                  ({acceptedVolunteer.solverType}){" "}
                  {tr(
                    "has been selected to solve this problem.",
                    "को इस समस्या को हल करने के लिए चुना गया है।"
                  )}

                  {acceptedVolunteer.proposal && (
                    <>
                      <br />
                      <span className="mt-1 block italic">
                        &ldquo;{acceptedVolunteer.proposal}&rdquo;
                      </span>
                    </>
                  )}
                </p>

                {isGiver && displayProblem.assignedByGiver && (
                  <Link
                    href={`/projects/${displayProblem.id}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <FolderKanban size={14} />
                    {tr(
                      "Open project workspace",
                      "प्रोजेक्ट वर्कस्पेस खोलें"
                    )}
                  </Link>
                )}
              </div>
            )}

            {/* Previous Assignment */}
            {displayProblem.assignedUniversity &&
              !acceptedVolunteer && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Building2
                      size={16}
                      className="text-blue-600"
                    />

                    <span className="text-sm font-bold text-blue-700">
                      {tr("Current Action", "वर्तमान कार्रवाई")}
                    </span>
                  </div>

                  <p className="text-sm text-blue-600 leading-relaxed">
                    {tr(
                      "This problem has been assigned to",
                      "यह समस्या"
                    )}{" "}
                    <span className="font-semibold">
                      {displayProblem.assignedUniversity}
                    </span>{" "}
                    {tr(
                      "and is currently being reviewed by the",
                      "को सौंपी गई है और वर्तमान में"
                    )}{" "}
                    <span className="font-semibold">
                      {displayProblem.assignedDepartment}
                    </span>{" "}
                    {tr(
                      "department.",
                      "द्वारा इसकी समीक्षा की जा रही है।"
                    )}
                  </p>
                </div>
              )}

            {/* Volunteer Applications — Giver */}
            {isGiver &&
              activeVolunteers.length > 0 &&
              !acceptedVolunteer && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Handshake
                      size={18}
                      className="text-amber-600"
                    />

                    <h4 className="text-sm font-bold text-amber-900">
                      {tr(
                        "Volunteer Solutions",
                        "स्वयंसेवक समाधान"
                      )}
                    </h4>
                  </div>

                  <p className="text-xs text-amber-800">
                    {activeVolunteers.length}{" "}
                    {activeVolunteers.length === 1
                      ? tr(
                          "institution has volunteered.",
                          "संस्था ने स्वयंसेवा की है।"
                        )
                      : tr(
                          "institutions have volunteered.",
                          "संस्थाओं ने स्वयंसेवा की है।"
                        )}{" "}
                    {tr(
                      "Review and accept the best fit — the selected solver and the others will be notified, and a project workspace opens for you and the solver.",
                      "समीक्षा करके उपयुक्त विकल्प स्वीकार करें — चयनित समाधानकर्ता और अन्य संस्थाओं को सूचित किया जाएगा, और आपके तथा समाधानकर्ता के लिए एक प्रोजेक्ट वर्कस्पेस खुल जाएगा।"
                    )}
                  </p>

                  {selectError && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                      {selectError}
                    </p>
                  )}

                  {activeVolunteers.map((v, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {v.solverType === "university" ? (
                            <Building2
                              size={14}
                              className="text-blue-600"
                            />
                          ) : (
                            <Users
                              size={14}
                              className="text-green-600"
                            />
                          )}

                          <span className="text-sm font-semibold text-slate-900">
                            {v.solverName}{" "}
                            <span className="text-xs text-slate-500 font-normal">
                              ({v.solverType})
                            </span>
                          </span>
                        </div>

                        {isGiver &&
                          displayProblem.status === "Verified" && (
                            <button
                              onClick={() =>
                                handleSelectVolunteer(
                                  v.solverType,
                                  v.solverName
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              <CheckCircle2 size={12} />
                              {tr("Accept", "स्वीकार करें")}
                            </button>
                          )}
                      </div>

                      {v.proposal && (
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          &ldquo;{v.proposal}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar size={10} />

                        <span>
                          {tr(
                            "Volunteered",
                            "स्वयंसेवा की"
                          )}{" "}
                          {v.submittedAt
                            ? new Date(
                                v.submittedAt
                              ).toLocaleDateString()
                            : tr("recently", "हाल ही में")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Volunteer Applications — Non-Giver */}
            {!isGiver &&
              activeVolunteers.length > 0 &&
              !acceptedVolunteer && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Handshake
                      size={16}
                      className="text-slate-600"
                    />

                    <h4 className="text-sm font-bold text-slate-700">
                      {tr(
                        "Volunteer Solutions",
                        "स्वयंसेवक समाधान"
                      )}
                    </h4>
                  </div>

                  {activeVolunteers.map((v, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      {v.solverType === "university" ? (
                        <Building2
                          size={12}
                          className="text-blue-600"
                        />
                      ) : (
                        <Users
                          size={12}
                          className="text-green-600"
                        />
                      )}

                      <span className="font-medium">
                        {v.solverName}
                      </span>

                      <span className="text-slate-400">
                        ({v.solverType})
                      </span>

                      <span className="text-amber-600 font-medium">
                        •{" "}
                        {tr(
                          "Pending giver selection",
                          "समस्या देने वाले के चयन की प्रतीक्षा"
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {/* My own volunteer application */}
            {!isGiver &&
              displayProblem.volunteers &&
              displayProblem.volunteers.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-xs text-slate-600">
                    {tr(
                      "Your proposal is awaiting the problem giver's decision.",
                      "आपका प्रस्ताव समस्या देने वाले के निर्णय की प्रतीक्षा कर रहा है।"
                    )}
                  </span>

                  {displayProblem.volunteers.some(
                    (v) => v.status === "volunteered"
                  ) && (
                    <button
                      onClick={() =>
                        displayProblem.volunteers?.forEach(
                          (v) =>
                            v.status === "volunteered" &&
                            handleWithdrawVolunteer(
                              v.solverType,
                              v.solverName
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={12} />
                      {tr("Withdraw", "वापस लें")}
                    </button>
                  )}
                </div>
              )}

            {/* Support */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  onToggleSupport(displayProblem.id)
                }
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  displayProblem.isSupported
                    ? "bg-blue-600 text-white shadow-md"
                    : "border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <ThumbsUp
                  size={15}
                  className={
                    displayProblem.isSupported
                      ? "fill-white"
                      : ""
                  }
                />

                {displayProblem.isSupported
                  ? tr("Supported", "समर्थित")
                  : tr(
                      "Support this Problem",
                      "इस समस्या का समर्थन करें"
                    )}{" "}
                · {displayProblem.supporters}
              </button>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker
              currentStep={displayProblem.currentStep}
              progress={displayProblem.progress}
            />

            {/* Comments */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-slate-700">
                {tr("Community Comments", "सामुदायिक टिप्पणियाँ")} (
                {localComments.length})
              </h4>

              {localComments.length === 0 ? (
                <p className="rounded-xl bg-slate-50 py-6 text-center text-sm text-slate-400">
                  {tr(
                    "No comments yet. Be the first to comment.",
                    "अभी तक कोई टिप्पणी नहीं है। टिप्पणी करने वाले पहले व्यक्ति बनें।"
                  )}
                </p>
              ) : (
                <div className="space-y-3">
                  {localComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-xs font-bold text-white">
                        {comment.avatar}
                      </div>

                      <div className="flex-1 rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">
                            {comment.author}
                          </span>

                          <span className="text-xs text-slate-400">
                            {comment.timeAgo}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="mt-4 flex gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {user?.name.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <input
                    type="text"
                    placeholder={tr(
                      "Add a comment...",
                      "एक टिप्पणी जोड़ें..."
                    )}
                    value={commentText}
                    onChange={(e) =>
                      setCommentText(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddComment()
                    }
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  />

                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    aria-label={tr(
                      "Send comment",
                      "टिप्पणी भेजें"
                    )}
                    className="flex-shrink-0 rounded-lg p-1 text-blue-600 transition hover:bg-blue-100 disabled:opacity-30"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}