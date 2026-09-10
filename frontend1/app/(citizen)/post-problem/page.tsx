"use client";

import { Lightbulb } from "lucide-react";
import PostProblemForm from "@/components/PostProblemForm";
import { useProblems } from "@/context/ProblemsContext";
import { Problem } from "@/types/problem";

export default function PostProblemPage() {
  const { addProblem } = useProblems();

  const handleSubmitSuccess = async (problem: Problem, files: File[]): Promise<boolean> => {
    const problemId = await addProblem(problem);
    if (!problemId) return false;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const evidenceResponse = await fetch(`${apiUrl}/problems/${problemId}/evidence`, { method: "POST", body: formData });
      if (!evidenceResponse.ok) return false;
    }

    // Analysis enriches a saved submission; it should not make submission appear to fail.
    // This also keeps citizens unblocked when the optional AI provider is unavailable.
    void fetch(`${apiUrl}/problems/${problemId}/analyze`, { method: "POST" }).catch(() => undefined);
    return true;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post a Problem</h1>
        <p className="mt-1 text-sm text-slate-500">
          Report a real-world societal issue in your community. Your report will be reviewed and assigned to the right experts.
        </p>
      </div>

      <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-blue-500" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-800">Tips for a strong submission</p>
          <ul className="space-y-0.5 text-xs text-blue-700 list-disc list-inside">
            <li>Be specific about the exact location of the problem</li>
            <li>Describe how long the problem has existed</li>
            <li>Mention how many people are affected</li>
            <li>Attach photos or documents if available — they can help verification</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <PostProblemForm onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
}
