"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle2, FileImage, FileText, AlertCircle } from "lucide-react";
import { Problem, ProblemCategory } from "@/types/problem";

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
  { code: "Marathi", label: "मराठी (Marathi)" },
  { code: "Nagpuri / Sadri", label: "नागपुरी / सादरी (Sadri)" },
  { code: "Santali", label: "संथाली (Santali)" },
  { code: "Mundari", label: "मुंडारी (Mundari)" },
  { code: "Ho", label: "हो (Ho)" },
  { code: "Kurukh (Oraon)", label: "कुड़ुख़ (Kurukh)" },
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
  onSubmitSuccess: (problem: Problem, files: File[]) => boolean | Promise<boolean>;
}

export default function PostProblemForm({ onSubmitSuccess }: PostProblemFormProps) {
  const [title, setTitle]           = useState("");
  const [category, setCategory]     = useState<ProblemCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation]     = useState("");
  const [files, setFiles]           = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const MAX_DESC = 1000;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())       e.title       = "Problem title is required.";
    if (!category)           e.category    = "Please select a category.";
    if (!description.trim()) e.description = "Description is required.";
    else if (description.length < 50) e.description = "Please provide at least 50 characters.";
    if (!location.trim())    e.location    = "Location is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const mapped: UploadedFile[] = selected.map((f) => ({
      file: f,
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type.startsWith("image/") ? "image" : "document",
    }));
    setFiles((prev) => [...prev, ...mapped]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedByGiver) return;

    setIsSubmitting(true);
    setSubmitError("");

    const citizenName = giverType === "individual" ? "Sarthak Nehe" : communityGroupName.trim() || "Community Action Group";

    const problemToSubmit: Problem = {
      id: Date.now(),
      title: draftTitle.trim() || "Community Societal Challenge",
      description: draftStatement.trim(),
      category: draftCategory,
      location: draftArea.trim() || "Location pending",
      citizenName,
      citizenAvatar: giverType === "individual" ? "SN" : "👥",
      date: "Just now",
      status: "Submitted",
      supporters: 0,
      comments: [],
      progress: 5,
      currentStep: 1,
      // Structured metadata
      rawInput: rawText.trim() || draftStatement.trim(),
      problemNature: draftNature,
      affectedArea: draftArea.trim(),
      affectedPopulation: draftPopulation.trim(),
      frequency: draftFrequency.trim(),
      requiredCapabilities: capabilities,
      suggestedIntervention: draftIntervention.trim(),
      confirmedByGiver: true,
      problemGiverType: giverType,
      communityGroupName: giverType !== "individual" ? communityGroupName.trim() : undefined,
      image: "📋",
    };

    setSubmitError("");
    const success = await onSubmitSuccess(newProblem, files.map((item) => item.file));
    if (success) setSubmitted(true);
    else setSubmitError("We could not submit your problem. Check that the API is running and try again.");
  };

  const handleReset = () => {
    setTitle(""); setCategory(""); setDescription("");
    setLocation(""); setFiles([]); setErrors({}); setSubmitted(false); setSubmitError("");
  };

  // -------------------------------------------------------------
  // Step 3: Submission Success View
  // -------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-emerald-100 bg-emerald-50/70 p-10 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={36} />
        </div>
        <span className="mb-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          Status: Submitted (Pending Government Verification)
        </span>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">Problem Successfully Submitted!</h3>
        <p className="mt-3 max-w-md text-sm text-slate-600">
          Your problem statement has been formatted, confirmed, and sent to the{" "}
          <strong className="text-slate-800">Government Verification Queue</strong>.
        </p>

        <div className="my-6 w-full max-w-md rounded-2xl border border-emerald-200/80 bg-white p-4 text-left text-xs text-slate-600 space-y-2 shadow-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Problem ID:</span>
            <span className="font-mono font-bold text-slate-800">{submittedProblemId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Title:</span>
            <span className="font-medium text-slate-800 truncate max-w-[240px]">{draftTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Problem Nature:</span>
            <span className={`font-semibold ${
              draftNature === "Technical" ? "text-purple-600" : draftNature === "Non-Technical" ? "text-emerald-600" : "text-blue-600"
            }`}>{draftNature}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Next Step:</span>
            <span className="text-emerald-700 font-medium">Regional Officer Audit & Solver Routing</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Submit Another Problem
          </button>
          <a
            href="/my-problems"
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            Track in My Problems
          </a>
        </div>
      </div>
    );
  }

  const fileIcons = { image: FileImage, document: FileText };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {submitError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Problem Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
          placeholder="e.g. Broken streetlights on Main Road causing safety issues"
          className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 ${errors.title ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
        />
        {errors.title && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{errors.title}</p>}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: RAW INPUT FLOW                                        */}
      {/* ------------------------------------------------------------- */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Problem Giver Entity Selector */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <label className="block text-sm font-bold text-slate-800">
              Who is submitting this problem?
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
                <div className={`mt-0.5 rounded-lg p-2 ${giverType === "individual" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Individual Citizen</p>
                  <p className="text-xs text-slate-500">Reporting as an individual resident or local commuter.</p>
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
                <div className={`mt-0.5 rounded-lg p-2 ${giverType !== "individual" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Community Group / NGO / Gram Panchayat</p>
                  <p className="text-xs text-slate-500">Problem belongs to a collective civic group, RWA, or local committee.</p>
                </div>
              </button>
            </div>

            {giverType !== "individual" && (
              <div className="pt-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Organization / Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={communityGroupName}
                  onChange={(e) => setCommunityGroupName(e.target.value)}
                  placeholder="e.g. Green Pune Action Committee, Gram Panchayat Rampur, River Protection Forum"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>

          {/* Raw Input Box */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" />
                  Describe the Problem in Your Own Words
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  No bureaucratic formatting required. Our AI converts this into a structured challenge draft for your review.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Language:</span>
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

      {/* File Upload */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Attachments <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
        >
          <Upload size={24} className="text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-600">Click to upload files</p>
            <p className="text-xs text-slate-400">Images or Documents (PDF, DOC)</p>
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: AI DRAFT REVIEW & CONFIRMATION GATE                   */}
      {/* ------------------------------------------------------------- */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          {/* Important Human-in-the-loop Banner */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">
                AI-Generated Draft — Problem Giver Review Required
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                The AI has standardized your raw input into an objective problem statement.
                <strong> Review, edit any field below, and confirm</strong> before sending to government officers.
                No AI-generated draft is published without your explicit confirmation.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            {/* Title & Nature Row */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Standardized Problem Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. Predictive Landslide Risk Monitoring for Village Road Connectivity"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Problem Nature Selection: Technical / Non-Technical / Hybrid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Problem Nature <span className="text-red-500">*</span></span>
                  <span className="text-[11px] font-normal text-slate-400">Determines required solver disciplines</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftNature("Technical")}
                    className={`rounded-xl border p-2.5 text-center transition ${
                      draftNature === "Technical"
                        ? "border-purple-500 bg-purple-50 text-purple-800 font-bold ring-2 ring-purple-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">⚙️ Technical</span>
                    <span className="text-[10px] text-slate-500 font-normal">Engineering, IoT, Software</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraftNature("Non-Technical")}
                    className={`rounded-xl border p-2.5 text-center transition ${
                      draftNature === "Non-Technical"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">🤝 Non-Technical</span>
                    <span className="text-[10px] text-slate-500 font-normal">Policy, Awareness, Social</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraftNature("Hybrid")}
                    className={`rounded-xl border p-2.5 text-center transition ${
                      draftNature === "Hybrid"
                        ? "border-blue-500 bg-blue-50 text-blue-800 font-bold ring-2 ring-blue-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">🌐 Hybrid</span>
                    <span className="text-[10px] text-slate-500 font-normal">Tech Tool + Community Action</span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Domain Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as ProblemCategory)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Objective Statement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Structured Problem Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={draftStatement}
                  onChange={(e) => setDraftStatement(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Scope Grid: Area, Population, Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Affected Area / Location
                  </label>
                  <input
                    type="text"
                    value={draftArea}
                    onChange={(e) => setDraftArea(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Affected Population / Scope
                  </label>
                  <input
                    type="text"
                    value={draftPopulation}
                    onChange={(e) => setDraftPopulation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recurrence / Frequency
                  </label>
                  <input
                    type="text"
                    value={draftFrequency}
                    onChange={(e) => setDraftFrequency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Required Capabilities Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Suggested Capabilities & Skills Needed
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"
                    >
                      {cap}
                      <button
                        type="button"
                        onClick={() => handleRemoveCapability(cap)}
                        className="hover:text-red-600 ml-0.5"
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
                    onChange={(e) => setNewCapabilityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCapability();
                      }
                    }}
                    placeholder="Add a required skill or capability (e.g. IoT, Hydrology)..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCapability}
                    className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* File Upload / Attachments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evidence Attachments (Photos, Documents, Reports)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 py-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <Upload size={20} className="text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700">Attach photos or documents for verification</p>
                  <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 10 MB</p>
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
                        <span className="truncate font-medium text-slate-800 max-w-[280px]">{file.name}</span>
                        <span className="text-slate-400 text-[10px]">{file.size}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Original Raw Input Collapsible */}
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRawAccordion(!showRawAccordion)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <span>Compare with your original raw input</span>
                  {showRawAccordion ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showRawAccordion && (
                  <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 italic">
                    &ldquo;{rawText}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={14} />
                {submitError}
              </p>
            )}

            {/* MANDATORY CONFIRMATION CHECKBOX */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedByGiver}
                  onChange={(e) => setConfirmedByGiver(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-800 leading-relaxed">
                  I confirm that this statement accurately represents the societal problem. I authorize its submission to government authorities for regional verification and solver assignment.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <ArrowLeft size={14} />
                  Edit Raw Input
                </button>

                <button
                  type="button"
                  onClick={handleStructureWithAI}
                  disabled={isStructuring}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw size={14} className={isStructuring ? "animate-spin" : ""} />
                  Regenerate
                </button>
              </div>

              <button
                type="submit"
                disabled={!confirmedByGiver || isSubmitting}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-md transition ${
                  confirmedByGiver && !isSubmitting
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 hover:shadow-lg active:scale-[0.98]"
                    : "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Submitting for Verification...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Confirm & Submit to Government
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
