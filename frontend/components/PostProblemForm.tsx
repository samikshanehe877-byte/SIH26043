"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  CheckCircle2,
  FileImage,
  FileText,
  AlertCircle,
  AlertTriangle,
  User,
  Users,
  Sparkles,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  DuplicateCheckResult,
  Problem,
  ProblemCategory,
  ProblemNature,
  SimilarProblemMatch,
} from "@/types/problem";
import { useLanguage } from "@/context/LanguageContext";

/** What a submission attempt resolved to. */
export type SubmitOutcome =
  | { status: "success"; problem: Problem }
  | { status: "duplicate"; problem: Problem }
  | { status: "error"; message: string };

const CATEGORIES: ProblemCategory[] = [
  "Infrastructure",
  "Environment",
  "Education",
  "Healthcare",
  "Transportation",
  "Public Safety",
  "Technology",
  "Water and Sanitation",
  "Other",
];

const LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Hindi", label: "हिंदी (Hindi)" },
];

const SAMPLE_PROBLEMS = [
  {
    label: "Village Road Landslide",
    icon: "🏔️",
    text: "Whenever it rains heavily, the road near our village gets blocked because mud and rocks come down from the hill. We have complained before but there isn't really any system to know when it is going to happen, leaving ambulances and school buses stranded.",
    location: "Kothrud Ghat Road, Pune District",
  },
  {
    label: "Contaminated Well Water",
    icon: "💧",
    text: "The primary community well in our hamlet has turned brownish and smells metallic over the last 3 months after a new industrial unit started discharging waste. Over 40 families rely on this well and several children have fallen sick.",
    location: "Rampur Village, Ward 3",
  },
  {
    label: "Rural School Teacher Shortage",
    icon: "🏫",
    text: "Our village government primary school has over 120 enrolled students across classes 1 to 5, but only one permanent teacher is appointed. Classes are combined and senior students end up dropping out to work in fields.",
    location: "Zilla Parishad School, Maval",
  },
];

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  type: "image" | "document";
}

interface PostProblemFormProps {
  onSubmitSuccess: (problem: Problem, files: File[]) => Promise<SubmitOutcome>;
  ownerUserId: string;
  regionId: string;
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">
          {value === null ? "N/A" : `${Math.round(value * 100)}%`}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            value === null ? "bg-slate-200" : "bg-amber-500"
          }`}
          style={{
            width: `${value === null ? 0 : Math.round(value * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function SimilarProblemCard({
  match,
  unavailableKeys = [],
}: {
  match: SimilarProblemMatch;
  unavailableKeys?: string[];
}) {
  const at = (key: string, value: number) =>
    unavailableKeys.includes(key) ? null : value;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-slate-900">{match.title}</p>

        <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
          {Math.round(match.overall * 100)}% similar
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        <ScoreBar
          label="Text similarity"
          value={at("semantic", match.semantic)}
        />
        <ScoreBar
          label="Location"
          value={at("location", match.location)}
        />
        <ScoreBar
          label="Category"
          value={at("domain", match.domain)}
        />
      </div>

      {match.reasons.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-2 text-xs text-slate-600">
          {match.reasons.slice(0, 4).map((reason, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
              {reason}
            </li>
          ))}
        </ul>
      )}

      {match.supporters > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          {match.supporters} people already support this report.
        </p>
      )}
    </div>
  );
}

export default function PostProblemForm({
  onSubmitSuccess,
  ownerUserId,
  regionId,
}: PostProblemFormProps) {
  const { language: uiLanguage } = useLanguage();
  const hindi = uiLanguage === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const [step, setStep] = useState(1);
  const [giverType, setGiverType] = useState<
    "individual" | "community_group"
  >("individual");
  const [communityGroupName, setCommunityGroupName] = useState("");
  const [rawText, setRawText] = useState("");
  const [language, setLanguage] = useState("English");

  const [draftTitle, setDraftTitle] = useState("");
  const [draftNature, setDraftNature] = useState<ProblemNature | "">("");
  const [draftCategory, setDraftCategory] = useState<ProblemCategory | "">("");
  const [draftStatement, setDraftStatement] = useState("");
  const [draftArea, setDraftArea] = useState("");
  const [draftPopulation, setDraftPopulation] = useState("");
  const [draftFrequency, setDraftFrequency] = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapabilityInput, setNewCapabilityInput] = useState("");
  const [draftIntervention, setDraftIntervention] = useState("");
  const [showRawAccordion, setShowRawAccordion] = useState(false);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [confirmedByGiver, setConfirmedByGiver] = useState(false);
  const [isStructuring, setIsStructuring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedProblemId, setSubmittedProblemId] = useState<string | number>(
    ""
  );

  const [duplicateCheck, setDuplicateCheck] =
    useState<DuplicateCheckResult | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [blockedMatch, setBlockedMatch] =
    useState<SimilarProblemMatch | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const fileIcons = {
    image: FileImage,
    document: FileText,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    const mapped: UploadedFile[] = selected.map((f) => ({
      file: f,
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
          : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type.startsWith("image/") ? "image" : "document",
    }));

    setFiles((prev) => [...prev, ...mapped]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleAddCapability = () => {
    const trimmed = newCapabilityInput.trim();

    if (trimmed && !capabilities.includes(trimmed)) {
      setCapabilities((prev) => [...prev, trimmed]);
    }

    setNewCapabilityInput("");
  };

  const handleRemoveCapability = (cap: string) => {
    setCapabilities((prev) => prev.filter((c) => c !== cap));
  };

  const handleStructureWithAI = async () => {
    if (!rawText.trim()) {
      setErrors({
        rawInput: tr(
          "Please describe your problem first.",
          "कृपया पहले अपनी समस्या का विवरण दें।"
        ),
      });
      return;
    }

    setErrors({});
    setIsStructuring(true);
    setSubmitError("");

    try {
      const response = await fetch(
        `${apiUrl}/ai/structure-problem`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            raw_text: rawText,
            source_language: language,
            location_hint: draftArea || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Structuring request failed");
      }

      const draft: Record<string, unknown> = await response.json();

      setDraftTitle(String(draft.title ?? ""));
      setDraftNature(
        (draft.problem_nature as ProblemNature) || "Hybrid"
      );
      setDraftCategory(
        (draft.category as ProblemCategory) || "Other"
      );
      setDraftStatement(
        String(draft.problem_statement ?? rawText)
      );
      setDraftArea(String(draft.affected_area ?? ""));
      setDraftPopulation(
        String(draft.affected_population ?? "")
      );
      setDraftFrequency(String(draft.frequency ?? ""));
      setCapabilities(
        Array.isArray(draft.required_capabilities)
          ? (draft.required_capabilities as string[])
          : []
      );
      setDraftIntervention(
        String(draft.suggested_intervention ?? "")
      );

      setStep(2);
    } catch {
      setSubmitError(
        tr(
          "Could not reach the AI service. You can review and edit the fields below manually.",
          "AI सेवा से संपर्क नहीं हो सका। आप नीचे दिए गए फ़ील्ड को स्वयं देख और संपादित कर सकते हैं।"
        )
      );

      setDraftTitle("");
      setDraftNature("Hybrid");
      setDraftCategory("Other");
      setDraftStatement(rawText);
      setDraftArea("");
      setDraftPopulation("");
      setDraftFrequency("");
      setCapabilities([]);
      setDraftIntervention("");
      setStep(2);
    } finally {
      setIsStructuring(false);
    }
  };

  const buildProblem = (): Problem => {
    const citizenName =
      giverType === "individual"
        ? "Sarthak Nehe"
        : communityGroupName.trim() || "Community Action Group";

    return {
      id: crypto.randomUUID(),
      title:
        draftTitle.trim() || "Community Societal Challenge",
      description: draftStatement.trim(),
      category: draftCategory || "Other",
      location:
        draftArea.trim() || "Location not specified",
      citizenName,
      citizenAvatar: "",
      date: new Date().toISOString(),
      status: "Submitted",
      supporters: 0,
      comments: [],
      progress: 0,
      currentStep: 1,
      rawInput:
        rawText.trim() || draftStatement.trim(),
      problemNature: draftNature || "Hybrid",
      affectedArea: draftArea.trim(),
      affectedPopulation: draftPopulation.trim(),
      frequency: draftFrequency.trim(),
      requiredCapabilities: capabilities,
      suggestedIntervention: draftIntervention.trim(),
      confirmedByGiver: true,
      problemGiverType: giverType,
      communityGroupName:
        giverType !== "individual"
          ? communityGroupName.trim()
          : undefined,
    };
  };

  const submitNow = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    const problem = buildProblem();

    try {
      const outcome = await onSubmitSuccess(
        problem,
        files.map((item) => item.file)
      );

      if (outcome.status === "success") {
        setSubmittedProblemId(outcome.problem.id);
        setStep(3);
      } else if (outcome.status === "duplicate") {
        setBlockedMatch({
          problem_id: outcome.problem.duplicateOfId ?? "",
          title: "an existing report",
          status: "verified",
          citizen_name: "",
          supporters: 0,
          semantic:
            outcome.problem.duplicateBreakdown?.semantic ?? 0,
          location:
            outcome.problem.duplicateBreakdown?.location ?? 0,
          domain:
            outcome.problem.duplicateBreakdown?.domain ?? 0,
          affected_area:
            outcome.problem.duplicateBreakdown?.affected_area ?? 0,
          characteristics:
            outcome.problem.duplicateBreakdown?.characteristics ?? 0,
          overall:
            outcome.problem.duplicateScore ?? 0.9,
          reasons:
            outcome.problem.duplicateReasons ?? [],
          unavailable:
            outcome.problem.duplicateBreakdown?.unavailable ?? [],
        });

        setDuplicateCheck(null);
        setStep(4);
      } else {
        setSubmitError(outcome.message);
      }
    } catch (err) {
      console.error("Submit error:", err);

      setSubmitError(
        err instanceof Error
          ? err.message
          : tr(
              "Failed to submit problem. Please try again.",
              "समस्या दर्ज नहीं हो सकी। कृपया पुनः प्रयास करें।"
            )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (step !== 2 || !confirmedByGiver) return;

    setIsCheckingDuplicates(true);
    setSubmitError("");

    try {
      const response = await fetch(
        `${apiUrl}/problems/check-duplicates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: draftTitle.trim(),
            problem_text:
              draftStatement.trim() || rawText.trim(),
            category: draftCategory || undefined,
            location:
              draftArea.trim() || undefined,
            affected_population:
              draftPopulation.trim() || undefined,
            required_capabilities: capabilities,
            problem_nature:
              draftNature || undefined,
          }),
        }
      );

      const result: DuplicateCheckResult = response.ok
        ? await response.json()
        : {
            tier: "normal",
            best_match: null,
            candidates: [],
          };

      if (result.tier === "block" && result.best_match) {
        setBlockedMatch(result.best_match);
        setStep(4);
        return;
      }

      if (
        result.tier === "warning" &&
        result.best_match
      ) {
        setDuplicateCheck(result);
        setShowDuplicateWarning(true);
        return;
      }

      await submitNow();
    } catch (err) {
      console.error(
        "Duplicate check failed, submitting anyway:",
        err
      );

      await submitNow();
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setGiverType("individual");
    setCommunityGroupName("");
    setRawText("");
    setLanguage("English");
    setDraftTitle("");
    setDraftNature("");
    setDraftCategory("");
    setDraftStatement("");
    setDraftArea("");
    setDraftPopulation("");
    setDraftFrequency("");
    setCapabilities([]);
    setNewCapabilityInput("");
    setDraftIntervention("");
    setShowRawAccordion(false);
    setFiles([]);
    setErrors({});
    setConfirmedByGiver(false);
    setSubmitError("");
    setSubmittedProblemId("");
    setDuplicateCheck(null);
    setShowDuplicateWarning(false);
    setBlockedMatch(null);
  };

  // -------------------------------------------------------------
  // STEP 4: BLOCKED DUPLICATE
  // -------------------------------------------------------------
  if (step === 4 && blockedMatch) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-amber-200 bg-amber-50/60 p-8 text-center shadow-sm sm:p-10">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm">
          <AlertTriangle size={32} />
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          {tr(
            "Similar Problem Already Reported",
            "इसी तरह की समस्या पहले ही दर्ज की जा चुकी है"
          )}
        </h3>

        <p className="mt-3 max-w-lg text-sm text-slate-600">
          {tr(
            "This looks like the same issue as a report already on file, so it was not sent for government review. If this is genuinely a different problem, go back and add more specific details (exact location, who is affected, what makes it different) and try again.",
            "यह समस्या पहले से दर्ज की गई रिपोर्ट के समान लगती है, इसलिए इसे सरकारी समीक्षा के लिए नहीं भेजा गया। यदि यह वास्तव में अलग समस्या है, तो वापस जाएँ और अधिक विशिष्ट विवरण जोड़ें (सटीक स्थान, कौन प्रभावित है और यह समस्या अलग क्यों है) और पुनः प्रयास करें।"
          )}
        </p>

        <div className="mt-6 w-full max-w-lg text-left">
          <SimilarProblemCard
            match={blockedMatch}
            unavailableKeys={blockedMatch.unavailable}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={14} />
            {tr("Edit and Try Again", "संपादित करें और पुनः प्रयास करें")}
          </button>

          <a
            href="/explore"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Search size={14} />
            {tr(
              "Find and Support the Existing Report",
              "मौजूदा रिपोर्ट देखें और समर्थन करें"
            )}
          </a>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 3: SUCCESS
  // -------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-emerald-100 bg-emerald-50/70 p-10 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <span className="mb-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          {tr(
            "Status: Submitted (Pending Government Verification)",
            "स्थिति: दर्ज की गई (सरकारी सत्यापन लंबित)"
          )}
        </span>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {tr(
            "Problem Successfully Submitted!",
            "समस्या सफलतापूर्वक दर्ज की गई!"
          )}
        </h3>

        <p className="mt-3 max-w-md text-sm text-slate-600">
          {tr(
            "Your problem statement has been formatted, confirmed, and sent to the Government Verification Queue.",
            "आपकी समस्या को व्यवस्थित और सत्यापित करके सरकारी सत्यापन कतार में भेज दिया गया है।"
          )}
        </p>

        <div className="my-6 w-full max-w-md space-y-2 rounded-2xl border border-emerald-200/80 bg-white p-4 text-left text-xs text-slate-600 shadow-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">
              {tr("Problem ID:", "समस्या ID:")}
            </span>
            <span className="font-mono font-bold text-slate-800">
              {submittedProblemId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">
              {tr("Title:", "शीर्षक:")}
            </span>
            <span className="max-w-[240px] truncate font-medium text-slate-800">
              {draftTitle}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">
              {tr("Problem Nature:", "समस्या का प्रकार:")}
            </span>

            <span
              className={`font-semibold ${
                draftNature === "Technical"
                  ? "text-purple-600"
                  : draftNature === "Non-Technical"
                  ? "text-emerald-600"
                  : "text-blue-600"
              }`}
            >
              {draftNature}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">
              {tr("Next Step:", "अगला चरण:")}
            </span>
            <span className="font-medium text-emerald-700">
              {tr(
                "Regional Officer Audit & Solver Routing",
                "क्षेत्रीय अधिकारी ऑडिट और समाधानकर्ता रूटिंग"
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="border border-slate-200 bg-white px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {tr(
              "Submit Another Problem",
              "एक और समस्या दर्ज करें"
            )}
          </button>

          <a
            href="/my-problems"
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            {tr(
              "Track in My Problems",
              "मेरी समस्याओं में देखें"
            )}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleFinalSubmit}
        className="space-y-5"
        noValidate
      >
        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">

            {/* Problem Giver */}
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <label className="block text-sm font-bold text-slate-800">
                {tr(
                  "Who is submitting this problem?",
                  "यह समस्या कौन दर्ज कर रहा है?"
                )}
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setGiverType("individual")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                    giverType === "individual"
                      ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100"
                      : "border-slate-200 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded-lg p-2 ${
                      giverType === "individual"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {tr(
                        "Individual Citizen",
                        "व्यक्तिगत नागरिक"
                      )}
                    </p>

                    <p className="text-xs text-slate-500">
                      {tr(
                        "Reporting as an individual resident or local commuter.",
                        "एक स्थानीय निवासी या यात्री के रूप में समस्या दर्ज करें।"
                      )}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGiverType("community_group")}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                    giverType !== "individual"
                      ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100"
                      : "border-slate-200 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded-lg p-2 ${
                      giverType !== "individual"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Users size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {tr(
                        "Community Group / NGO / Gram Panchayat",
                        "सामुदायिक समूह / NGO / ग्राम पंचायत"
                      )}
                    </p>

                    <p className="text-xs text-slate-500">
                      {tr(
                        "Problem belongs to a collective civic group, RWA, or local committee.",
                        "समस्या किसी सामुदायिक समूह, RWA या स्थानीय समिति से संबंधित है।"
                      )}
                    </p>
                  </div>
                </button>
              </div>

              {giverType !== "individual" && (
                <div className="pt-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    {tr(
                      "Organization / Group Name",
                      "संगठन / समूह का नाम"
                    )}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={communityGroupName}
                    onChange={(e) =>
                      setCommunityGroupName(e.target.value)
                    }
                    placeholder={tr(
                      "e.g. Green Pune Action Committee, Gram Panchayat Rampur, River Protection Forum",
                      "उदाहरण: ग्रीन पुणे एक्शन कमेटी, ग्राम पंचायत रामपुर, रिवर प्रोटेक्शन फोरम"
                    )}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}
            </div>

            {/* Raw Input */}
            <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Sparkles size={18} className="text-blue-600" />
                    {tr(
                      "Describe the Problem in Your Own Words",
                      "समस्या को अपने शब्दों में बताएँ"
                    )}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {tr(
                      "No bureaucratic formatting required. Our AI converts this into a structured challenge draft for your review.",
                      "किसी विशेष सरकारी प्रारूप की आवश्यकता नहीं है। हमारा AI इसे समीक्षा के लिए एक व्यवस्थित समस्या के रूप में तैयार करेगा।"
                    )}
                  </p>
                </div>

                {/* Language */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {tr("Language:", "भाषा:")}
                  </span>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Raw Text */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {tr(
                    "Your Problem in Plain Language",
                    "अपनी समस्या सरल भाषा में बताएँ"
                  )}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setErrors((p) => ({
                      ...p,
                      rawInput: "",
                    }));
                  }}
                  placeholder={tr(
                    "Describe the problem in your own words — what is happening, how long it has been occurring, who is affected, and what impact it is having on your community...",
                    "समस्या को अपने शब्दों में बताएँ — क्या हो रहा है, यह कितने समय से हो रहा है, कौन प्रभावित है और इसका समुदाय पर क्या प्रभाव पड़ रहा है..."
                  )}
                  rows={5}
                  className={`w-full resize-none rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 ${
                    errors.rawInput
                      ? "border-red-300"
                      : "border-slate-200 focus:border-blue-400"
                  }`}
                />

                {errors.rawInput && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.rawInput}
                  </p>
                )}
              </div>

              {/* Samples */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500">
                  {tr(
                    "Not sure how to start? Try a sample:",
                    "शुरुआत समझ नहीं आ रही? एक उदाहरण आज़माएँ:"
                  )}
                </span>

                <div className="flex flex-col gap-2">
                  {SAMPLE_PROBLEMS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setRawText(sample.text)}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-xs text-slate-700 transition hover:border-blue-400 hover:bg-white"
                    >
                      <span className="font-medium">
                        {sample.icon} {sample.label}
                      </span>

                      <p className="mt-1 line-clamp-2 text-slate-500">
                        {sample.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                {tr("Attachments", "संलग्नक")}{" "}
                <span className="font-normal text-slate-400">
                  ({tr("optional", "वैकल्पिक")})
                </span>
              </label>

              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <Upload size={24} className="text-slate-400" />

                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {tr(
                      "Click to upload files",
                      "फ़ाइलें अपलोड करने के लिए क्लिक करें"
                    )}
                  </p>

                  <p className="text-xs text-slate-400">
                    {tr(
                      "Images or Documents (PDF, DOC)",
                      "चित्र या दस्तावेज़ (PDF, DOC)"
                    )}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, idx) => {
                    const Icon = fileIcons[file.type];

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm"
                      >
                        <Icon
                          size={16}
                          className="flex-shrink-0 text-blue-500"
                        />

                        <span className="flex-1 truncate text-sm text-slate-700">
                          {file.name}
                        </span>

                        <span className="flex-shrink-0 text-xs text-slate-400">
                          {file.size}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Button */}
            <div>
              <button
                type="button"
                onClick={handleStructureWithAI}
                disabled={
                  isStructuring || !rawText.trim()
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStructuring ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    {tr(
                      "Structuring with AI...",
                      "AI द्वारा व्यवस्थित किया जा रहा है..."
                    )}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    {tr(
                      "Structure with AI",
                      "AI से व्यवस्थित करें"
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">

            {/* Human review banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
              <ShieldAlert
                size={20}
                className="mt-0.5 flex-shrink-0 text-amber-600"
              />

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900">
                  {tr(
                    "AI-Generated Draft — Problem Giver Review Required",
                    "AI द्वारा तैयार मसौदा — समस्या दर्ज करने वाले की समीक्षा आवश्यक है"
                  )}
                </h4>

                <p className="text-xs leading-relaxed text-amber-800">
                  {tr(
                    "The AI has standardized your raw input into an objective problem statement. Review, edit any field below, and confirm before sending to government officers. No AI-generated draft is published without your explicit confirmation.",
                    "AI ने आपके इनपुट को एक स्पष्ट और वस्तुनिष्ठ समस्या विवरण में व्यवस्थित किया है। सरकारी अधिकारियों को भेजने से पहले नीचे दिए गए फ़ील्ड की समीक्षा, संपादन और पुष्टि करें। आपकी स्पष्ट पुष्टि के बिना कोई भी AI-निर्मित मसौदा प्रकाशित नहीं किया जाएगा।"
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {tr(
                    "Standardized Problem Title",
                    "मानकीकृत समस्या शीर्षक"
                  )}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) =>
                    setDraftTitle(e.target.value)
                  }
                  placeholder={tr(
                    "e.g. Predictive Landslide Risk Monitoring for Village Road Connectivity",
                    "उदाहरण: गाँव की सड़क कनेक्टिविटी के लिए भूस्खलन जोखिम निगरानी"
                  )}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Nature */}
              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>
                    {tr(
                      "Problem Nature",
                      "समस्या का प्रकार"
                    )}{" "}
                    <span className="text-red-500">*</span>
                  </span>

                  <span className="text-[11px] font-normal text-slate-400">
                    {tr(
                      "Determines required solver disciplines",
                      "आवश्यक समाधानकर्ता विशेषज्ञता निर्धारित करता है"
                    )}
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDraftNature("Technical")
                    }
                    className={`rounded-xl border p-2.5 text-center transition ${
                      draftNature === "Technical"
                        ? "border-purple-500 bg-purple-50 font-bold text-purple-800 ring-2 ring-purple-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">
                      ⚙️{" "}
                      {tr(
                        "Technical",
                        "तकनीकी"
                      )}
                    </span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {tr(
                        "Engineering, IoT, Software",
                        "इंजीनियरिंग, IoT, सॉफ्टवेयर"
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDraftNature("Non-Technical")
                    }
                    className={`rounded-xl border p-2.5 text-center transition ${
                      draftNature === "Non-Technical"
                        ? "border-emerald-500 bg-emerald-50 font-bold text-emerald-800 ring-2 ring-emerald-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">
                      🤝{" "}
                      {tr(
                        "Non-Technical",
                        "गैर-तकनीकी"
                      )}
                    </span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {tr(
                        "Policy, Awareness, Social",
                        "नीति, जागरूकता, सामाजिक"
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDraftNature("Hybrid")
                    }
                    className={`rounded-xl border p-2.5 text-center transition ${
                      draftNature === "Hybrid"
                        ? "border-blue-500 bg-blue-50 font-bold text-blue-800 ring-2 ring-blue-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">
                      🌐{" "}
                      {tr("Hybrid", "मिश्रित")}
                    </span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {tr(
                        "Tech Tool + Community Action",
                        "तकनीकी साधन + सामुदायिक कार्रवाई"
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {tr(
                    "Domain Category",
                    "क्षेत्र श्रेणी"
                  )}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  value={draftCategory}
                  onChange={(e) =>
                    setDraftCategory(
                      e.target.value as ProblemCategory
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {hindi
                        ? {
                            Infrastructure: "बुनियादी ढाँचा",
                            Environment: "पर्यावरण",
                            Education: "शिक्षा",
                            Healthcare: "स्वास्थ्य सेवा",
                            Transportation: "परिवहन",
                            "Public Safety": "सार्वजनिक सुरक्षा",
                            Technology: "प्रौद्योगिकी",
                            "Water and Sanitation":
                              "जल और स्वच्छता",
                            Other: "अन्य",
                          }[c]
                        : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Statement */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {tr(
                    "Structured Problem Statement",
                    "व्यवस्थित समस्या विवरण"
                  )}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={draftStatement}
                  onChange={(e) =>
                    setDraftStatement(e.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Scope */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {tr(
                      "Affected Area / Location",
                      "प्रभावित क्षेत्र / स्थान"
                    )}
                  </label>

                  <input
                    type="text"
                    value={draftArea}
                    onChange={(e) =>
                      setDraftArea(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {tr(
                      "Affected Population / Scope",
                      "प्रभावित जनसंख्या / दायरा"
                    )}
                  </label>

                  <input
                    type="text"
                    value={draftPopulation}
                    onChange={(e) =>
                      setDraftPopulation(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {tr(
                      "Recurrence / Frequency",
                      "पुनरावृत्ति / आवृत्ति"
                    )}
                  </label>

                  <input
                    type="text"
                    value={draftFrequency}
                    onChange={(e) =>
                      setDraftFrequency(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Intervention */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {tr(
                    "Suggested Intervention Vector",
                    "सुझाया गया समाधान / हस्तक्षेप"
                  )}
                </label>

                <textarea
                  value={draftIntervention}
                  onChange={(e) =>
                    setDraftIntervention(e.target.value)
                  }
                  rows={2}
                  placeholder={tr(
                    "How should this problem be approached? (e.g. Deploy early warning sensors, establish village disaster response committee)",
                    "इस समस्या का समाधान कैसे किया जाना चाहिए? (उदाहरण: शुरुआती चेतावनी सेंसर लगाना, ग्राम आपदा प्रतिक्रिया समिति बनाना)"
                  )}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Capabilities */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  {tr(
                    "Suggested Capabilities & Skills Needed",
                    "आवश्यक कौशल और क्षमताएँ"
                  )}
                </label>

                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  {capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                    >
                      {cap}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCapability(cap)
                        }
                        className="ml-0.5 hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCapabilityInput}
                    onChange={(e) =>
                      setNewCapabilityInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCapability();
                      }
                    }}
                    placeholder={tr(
                      "Add a required skill or capability (e.g. IoT, Hydrology)...",
                      "आवश्यक कौशल या क्षमता जोड़ें (उदाहरण: IoT, जल विज्ञान)..."
                    )}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={handleAddCapability}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    {tr("Add", "जोड़ें")}
                  </button>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {tr(
                    "Evidence Attachments (Photos, Documents, Reports)",
                    "प्रमाण संलग्नक (फोटो, दस्तावेज़, रिपोर्ट)"
                  )}
                </label>

                <div
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <Upload
                    size={20}
                    className="text-slate-400"
                  />

                  <p className="text-xs font-semibold text-slate-700">
                    {tr(
                      "Attach photos or documents for verification",
                      "सत्यापन के लिए फोटो या दस्तावेज़ संलग्न करें"
                    )}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    PDF, JPG, PNG up to 20 MB
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-1.5 text-xs shadow-xs"
                      >
                        <span className="max-w-[280px] truncate font-medium text-slate-800">
                          {file.name}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {file.size}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeFile(idx)
                          }
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Original input */}
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowRawAccordion(
                      !showRawAccordion
                    )
                  }
                  className="flex w-full items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <span>
                    {tr(
                      "Compare with your original raw input",
                      "अपने मूल इनपुट से तुलना करें"
                    )}
                  </span>

                  {showRawAccordion ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>

                {showRawAccordion && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs italic text-slate-700">
                    &ldquo;{rawText}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* Confirmation */}
            <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <label className="flex cursor-pointer select-none items-start gap-3">
                <input
                  type="checkbox"
                  checked={confirmedByGiver}
                  onChange={(e) =>
                    setConfirmedByGiver(
                      e.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-xs font-bold leading-relaxed text-slate-800">
                  {tr(
                    "I confirm that this statement accurately represents the societal problem. I authorize its submission to government authorities for regional verification and solver assignment.",
                    "मैं पुष्टि करता/करती हूँ कि यह विवरण सामाजिक समस्या को सही रूप से दर्शाता है। मैं इसे क्षेत्रीय सत्यापन और समाधानकर्ता नियुक्ति के लिए सरकारी अधिकारियों को भेजने की अनुमति देता/देती हूँ।"
                  )}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none"
                >
                  <ArrowLeft size={14} />
                  {tr(
                    "Edit Raw Input",
                    "मूल इनपुट संपादित करें"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStructureWithAI}
                  disabled={isStructuring}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none"
                >
                  <RefreshCw
                    size={14}
                    className={
                      isStructuring
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {tr(
                    "Regenerate",
                    "पुनः तैयार करें"
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={
                  !confirmedByGiver ||
                  isSubmitting ||
                  isCheckingDuplicates
                }
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-md transition sm:w-auto ${
                  confirmedByGiver &&
                  !isSubmitting &&
                  !isCheckingDuplicates
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 hover:shadow-lg active:scale-[0.98]"
                    : "cursor-not-allowed bg-slate-300 text-slate-500 shadow-none"
                }`}
              >
                {isCheckingDuplicates ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    {tr(
                      "Checking for similar reports...",
                      "समान रिपोर्ट की जाँच की जा रही है..."
                    )}
                  </>
                ) : isSubmitting ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    {tr(
                      "Submitting for Verification...",
                      "सत्यापन के लिए भेजा जा रहा है..."
                    )}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    {tr(
                      "Confirm & Submit to Government",
                      "पुष्टि करें और सरकार को भेजें"
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Duplicate warning */}
      {showDuplicateWarning &&
        duplicateCheck?.best_match && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {tr(
                      "A Similar Problem Already Exists",
                      "इसी तरह की समस्या पहले से मौजूद है"
                    )}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {tr(
                      "It may still be worth reporting separately if the details genuinely differ. Government will review both and decide.",
                      "यदि विवरण वास्तव में अलग हैं, तो इसे अलग से दर्ज करना उचित हो सकता है। सरकार दोनों रिपोर्ट की समीक्षा करेगी।"
                    )}
                  </p>
                </div>
              </div>

              <SimilarProblemCard
                match={duplicateCheck.best_match}
                unavailableKeys={
                  duplicateCheck.best_match.unavailable
                }
              />

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    setStep(2);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {tr(
                    "Go Back and Edit",
                    "वापस जाएँ और संपादित करें"
                  )}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setShowDuplicateWarning(false);
                    await submitNow();
                  }}
                  className="flex-1 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
                >
                  {tr(
                    "Continue Anyway, Submit for Review",
                    "फिर भी जारी रखें और समीक्षा के लिए भेजें"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}