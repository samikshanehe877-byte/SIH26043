"use client";

import { useState } from "react";
import { X, Factory, CheckCircle2 } from "lucide-react";

const INDUSTRY_TYPES = [
  "Software & Technology",
  "Manufacturing",
  "Construction",
  "Environmental Services",
  "Healthcare",
  "Transportation",
  "Energy & Utilities",
  "Telecommunications",
];

const COLLAB_TYPES = [
  "Funding",
  "Technical Expertise",
  "Equipment",
  "Testing & Validation",
  "Implementation Support",
  "Research Partnership",
];

export default function IndustryCollabModal({
  challengeTitle,
  onClose,
}: {
  challengeTitle: string;
  onClose: () => void;
}) {
  const [industryType, setIndustryType] = useState("");
  const [collabFor, setCollabFor] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleCollab = (item: string) =>
    setCollabFor((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );

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
            Industry collaboration request has been created successfully.
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
            <p className="mt-0.5 text-sm font-semibold text-purple-800">{challengeTitle}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Industry Type <span className="text-red-500">*</span>
            </label>
            <select
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="">Select industry type...</option>
              {INDUSTRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
            onClick={() => setSubmitted(true)}
            disabled={!industryType || collabFor.length === 0}
            className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition disabled:opacity-40"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
