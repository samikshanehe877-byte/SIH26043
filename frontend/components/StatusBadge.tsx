"use client";

import { ProblemStatus } from "@/types/problem";
import { useLanguage } from "@/context/LanguageContext";

const styles: Record<ProblemStatus, string> = {
  Submitted: "bg-slate-100 text-slate-600",
  Verified:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Needs Proof":
    "bg-amber-50 text-amber-700 border border-amber-200",
  Rejected:
    "bg-red-50 text-red-700 border border-red-200",
  "Under Review":
    "bg-amber-50 text-amber-700 border border-amber-200",
  "Assigned to University":
    "bg-blue-50 text-blue-700 border border-blue-200",
  "In Progress":
    "bg-orange-50 text-orange-700 border border-orange-200",
  "Collaboration with Industry":
    "bg-purple-50 text-purple-700 border border-purple-200",
  "Solution Implemented":
    "bg-teal-50 text-teal-700 border border-teal-200",
  Completed:
    "bg-green-50 text-green-700 border border-green-200",
  Duplicate:
    "bg-slate-100 text-slate-600 border border-slate-200",
  Merged:
    "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

const dots: Record<ProblemStatus, string> = {
  Submitted: "bg-slate-400",
  Verified: "bg-emerald-500",
  "Needs Proof": "bg-amber-500",
  Rejected: "bg-red-500",
  "Under Review": "bg-amber-500",
  "Assigned to University": "bg-blue-500",
  "In Progress": "bg-orange-500",
  "Collaboration with Industry": "bg-purple-500",
  "Solution Implemented": "bg-teal-500",
  Completed: "bg-green-500",
  Duplicate: "bg-slate-400",
  Merged: "bg-indigo-500",
};

const statusHindi: Record<ProblemStatus, string> = {
  Submitted: "प्रस्तुत",
  Verified: "सत्यापित",
  "Needs Proof": "प्रमाण आवश्यक",
  Rejected: "अस्वीकृत",
  "Under Review": "समीक्षाधीन",
  "Assigned to University": "विश्वविद्यालय को सौंपा गया",
  "In Progress": "प्रगति पर",
  "Collaboration with Industry": "उद्योग के साथ सहयोग",
  "Solution Implemented": "समाधान लागू किया गया",
  Completed: "पूर्ण",
  Duplicate: "डुप्लिकेट",
  Merged: "मर्ज किया गया",
};

export default function StatusBadge({
  status,
}: {
  status: ProblemStatus;
}) {
  const { language } = useLanguage();

  const displayStatus =
    language === "Hindi" ? statusHindi[status] : status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[status]}`}
      />
      {displayStatus}
    </span>
  );
}