"use client";

import { useState } from "react";
import { X, Handshake, Send, AlertCircle, Sparkles, UploadCloud } from "lucide-react";
import { useMentor } from "@/context/MentorContext";
import { IndustryHelpType } from "@/types/mentor";

interface IndustryRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChallengeId?: string;
  defaultTeamId?: string;
}

const helpTypes: IndustryHelpType[] = [
  "Funding",
  "Technical Expertise",
  "API",
  "Software Tool",
  "Cloud Resources",
  "Hardware",
  "Dataset",
  "Domain Expert",
  "Mentorship",
  "Other",
];

export default function IndustryRequestModal({
  isOpen,
  onClose,
  defaultChallengeId,
  defaultTeamId,
}: IndustryRequestModalProps) {
  const { challenges, teams, createIndustryRequest } = useMentor();

  const [challengeId, setChallengeId] = useState(
    defaultChallengeId || (challenges[0] ? challenges[0].id : "")
  );
  const [teamId, setTeamId] = useState(
    defaultTeamId || (teams[0] ? teams[0].id : "")
  );
  const [helpType, setHelpType] = useState<IndustryHelpType>("API");
  const [organization, setOrganization] = useState("Skymet Weather Services");
  const [requestTitle, setRequestTitle] = useState("");
  const [requirement, setRequirement] = useState("");
  const [whyNeeded, setWhyNeeded] = useState("");
  const [expectedSupport, setExpectedSupport] = useState("");
  const [requiredBy, setRequiredBy] = useState("2025-03-15");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [attachmentName, setAttachmentName] = useState<string>("");

  // Dynamic state for specific types
  const [fundingAmount, setFundingAmount] = useState("₹50,000");
  const [fundingPurpose, setFundingPurpose] = useState("Cloud computing & dataset acquisition");
  const [budgetDescription, setBudgetDescription] = useState("");

  const [expertiseArea, setExpertiseArea] = useState("");
  const [sessionsCount, setSessionsCount] = useState<number>(3);
  const [preferredDate, setPreferredDate] = useState("2025-03-01");

  const [apiToolName, setApiToolName] = useState("");
  const [accessDuration, setAccessDuration] = useState("6 Months");

  const [cloudSpecs, setCloudSpecs] = useState("GPU Cluster (Tesla V100 or A100)");
  const [hardwareSpecs, setHardwareSpecs] = useState("Industrial IP67 ultrasonic sensors");

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sync team when challenge changes
  const handleChallengeChange = (selectedCId: string) => {
    setChallengeId(selectedCId);
    const relatedTeam = teams.find((t) => t.challengeId === selectedCId);
    if (relatedTeam) {
      setTeamId(relatedTeam.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const titleToUse =
      requestTitle.trim() ||
      `${helpType} Request: ${challenges.find((c) => c.id === challengeId)?.title || "Project"}`;

    const reqText =
      requirement.trim() ||
      (helpType === "Funding"
        ? `Requesting funding grant of ${fundingAmount} for ${fundingPurpose}.`
        : helpType === "API"
        ? `Need access to ${apiToolName || "specialized developer API"} for project integration.`
        : `Requesting industry ${helpType} assistance for technical roadmap acceleration.`);

    const whyText =
      whyNeeded.trim() ||
      "Accelerates student research milestone and bridges real-world production gaps.";

    const expectedText =
      expectedSupport.trim() ||
      (helpType === "Funding"
        ? `Direct grant disbursement of ${fundingAmount} with milestone audits.`
        : helpType === "Technical Expertise"
        ? `${sessionsCount} technical consultation sessions with senior domain architect.`
        : `${accessDuration} license / access tokens with technical documentation.`);

    const details = {
      fundingAmount: helpType === "Funding" ? fundingAmount : undefined,
      purpose: helpType === "Funding" ? fundingPurpose : undefined,
      budgetDescription: helpType === "Funding" ? budgetDescription : undefined,
      expertiseArea: helpType === "Technical Expertise" ? expertiseArea : undefined,
      sessionsCount: helpType === "Technical Expertise" ? sessionsCount : undefined,
      preferredDate: helpType === "Technical Expertise" ? preferredDate : undefined,
      apiToolName: helpType === "API" || helpType === "Software Tool" ? apiToolName : undefined,
      accessDuration: helpType === "API" || helpType === "Software Tool" ? accessDuration : undefined,
      cloudSpecs: helpType === "Cloud Resources" ? cloudSpecs : undefined,
      hardwareSpecs: helpType === "Hardware" ? hardwareSpecs : undefined,
    };

    const res = createIndustryRequest({
      challengeId,
      teamId,
      helpType,
      organization: organization.trim() || "Industry Partner",
      requestTitle: titleToUse,
      requirement: reqText,
      whyNeeded: whyText,
      expectedSupport: expectedText,
      priority,
      requiredBy,
      attachmentName: attachmentName || undefined,
      details,
    });

    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Handshake size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Request Industry Collaboration
              </h2>
              <p className="text-xs text-slate-500">
                Procure funding, APIs, hardware, or expert mentorship for your student team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Target Challenge & Team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Challenge *
              </label>
              <select
                value={challengeId}
                onChange={(e) => handleChallengeChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Student Team *
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.challengeTitle.slice(0, 24)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Help Type Selector (10 types) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Help Type *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {helpTypes.map((type) => {
                const isSelected = helpType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setHelpType(type)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Organization & Request Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Industry / Organization *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Tata Consultancy Services, Skymet, AWS"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Request Title
              </label>
              <input
                type="text"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                placeholder="e.g. Real-Time Agri-Weather API Access"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* DYNAMIC FIELDS PER HELP TYPE */}
          {helpType === "Funding" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Sparkles size={16} />
                <span>Funding Requisition Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Amount Required (₹) *
                  </label>
                  <input
                    type="text"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    placeholder="e.g. ₹50,000"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Purpose *
                  </label>
                  <input
                    type="text"
                    value={fundingPurpose}
                    onChange={(e) => setFundingPurpose(e.target.value)}
                    placeholder="e.g. Cloud compute credits & sensor procurement"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Budget Line-Item Breakdown
                </label>
                <textarea
                  rows={2}
                  value={budgetDescription}
                  onChange={(e) => setBudgetDescription(e.target.value)}
                  placeholder="e.g. ₹20,000 for cloud instances, ₹30,000 for field sensors and battery packs"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {helpType === "Technical Expertise" && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-800">
                <Sparkles size={16} />
                <span>Technical Mentorship Requisition</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Expertise Area *
                  </label>
                  <input
                    type="text"
                    value={expertiseArea}
                    onChange={(e) => setExpertiseArea(e.target.value)}
                    placeholder="e.g. Quantized Computer Vision"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    No. of Sessions
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={sessionsCount}
                    onChange={(e) => setSessionsCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {(helpType === "API" || helpType === "Software Tool") && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
                <Sparkles size={16} />
                <span>API & Software Tool Specifications</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    API / Tool Required *
                  </label>
                  <input
                    type="text"
                    value={apiToolName}
                    onChange={(e) => setApiToolName(e.target.value)}
                    placeholder="e.g. Skymet Weather API / ArcGIS Enterprise"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Access Duration
                  </label>
                  <input
                    type="text"
                    value={accessDuration}
                    onChange={(e) => setAccessDuration(e.target.value)}
                    placeholder="e.g. 6 Months Academic Tier"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {helpType === "Cloud Resources" && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                <Sparkles size={16} />
                <span>Cloud Infrastructure Requisition</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Compute / Storage Specifications *
                </label>
                <input
                  type="text"
                  value={cloudSpecs}
                  onChange={(e) => setCloudSpecs(e.target.value)}
                  placeholder="e.g. AWS EC2 p3.2xlarge with Tesla V100 GPU"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {helpType === "Hardware" && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-800">
                <Sparkles size={16} />
                <span>Hardware Equipment Requisition</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Hardware Specifications / Sensors *
                </label>
                <input
                  type="text"
                  value={hardwareSpecs}
                  onChange={(e) => setHardwareSpecs(e.target.value)}
                  placeholder="e.g. 10 IP67 weather-sealed ultrasonic distance sensors"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Standard Fields */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Detailed Requirement *
            </label>
            <textarea
              rows={2}
              required
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Detail specifically what hardware, endpoints, dataset formats, or mentorship are needed..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Why is this needed?
              </label>
              <input
                type="text"
                value={whyNeeded}
                onChange={(e) => setWhyNeeded(e.target.value)}
                placeholder="e.g. Essential for accurate early spore prediction"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Expected Support
              </label>
              <input
                type="text"
                value={expectedSupport}
                onChange={(e) => setExpectedSupport(e.target.value)}
                placeholder="e.g. Sandbox API key + documentation"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Required By Date
              </label>
              <input
                type="date"
                value={requiredBy}
                onChange={(e) => setRequiredBy(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High" | "Critical")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Proposal / Spec Attachment (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="e.g. project_proposal_and_architecture.pdf"
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => setAttachmentName("technical_collaboration_spec.pdf")}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                <UploadCloud size={14} />
                Browse
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Send size={15} />
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

