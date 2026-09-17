"use client";

import { useEffect, useState } from "react";
import { X, Factory, CheckCircle2 } from "lucide-react";
import { getOrganizationName, useAuth } from "@/context/AuthContext";
import { UniversityChallenge } from "@/types/universityChallenge";

const COLLAB_TYPES = [
  "Funding",
  "Technical Expertise",
  "Hardware",
  "Software Tool",
  "Cloud Resources",
  "Dataset",
  "Domain Expert",
  "Mentorship",
];

interface IndustryPartner {
  id: string;
  companyName: string;
  industryType: string;
}

export default function IndustryCollabModal({
  challenge,
  onClose,
}: {
  challenge: UniversityChallenge;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const [partners, setPartners] = useState<IndustryPartner[]>([]);
  const [industryName, setIndustryName] = useState("");
  const [collabFor, setCollabFor] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/directory/industries", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((records) => setPartners(Array.isArray(records) ? records : []))
      .catch(() => setPartners([]));
  }, []);

  const toggleCollab = (item: string) =>
    setCollabFor((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );

  // Creates the request; the industry partner gets a "New collaboration request" alert
  // and this university is alerted again when they accept, decline or ask for details.
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/collaboration-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_by: "university",
          university_name: getOrganizationName(user),
          industry_name: industryName,
          requester_contact: user?.name,
          // Stored problems have string ids; numeric ids are demo challenges with no backend record.
          problem_id: typeof challenge.id === "string" ? challenge.id : undefined,
          challenge_title: challenge.title,
          problem_description: challenge.description,
          category: challenge.category,
          support_types: collabFor,
          description: description.trim() || undefined,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(String(body.detail ?? "Could not send the request"));
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <CheckCircle2 size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Request Submitted!</h3>
          <p className="mt-2 text-sm text-slate-500">
            {industryName} has been notified. You will get an alert when they respond.
          </p>
          <div className="mt-3 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            Status: Awaiting Industry Partner
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Factory size={18} className="text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">Request Industry Collaboration</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-purple-50 px-4 py-3">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
              Challenge
            </p>
            <p className="mt-0.5 text-sm font-semibold text-purple-800">{challenge.title}</p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Industry Partner <span className="text-red-500">*</span>
            </label>
            <select
              value={industryName}
              onChange={(e) => setIndustryName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="">Select industry partner...</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.companyName}>
                  {partner.companyName} ({partner.industryType})
                </option>
              ))}
            </select>
            {partners.length === 0 && (
              <p className="mt-1 text-xs text-slate-400">No registered industry partners found.</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Collaboration Required For <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COLLAB_TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleCollab(item)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    collabFor.includes(item)
                      ? "bg-purple-600 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what kind of industry support is needed..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!industryName || collabFor.length === 0 || isSubmitting}
            className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition disabled:opacity-40"
          >
            {isSubmitting ? "Sending..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
