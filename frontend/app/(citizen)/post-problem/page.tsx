"use client";

import { Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import PostProblemForm from "@/components/PostProblemForm";
import { useProblems } from "@/context/ProblemsContext";
import { useAuth } from "@/context/AuthContext";
import { Problem } from "@/types/problem";

export default function PostProblemPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addProblem } = useProblems();

  const handleSubmitSuccess = async (problem: Problem, files: File[]): Promise<boolean> => {
    const problemId = await addProblem(problem);
    if (!problemId) return false;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const evidenceResponse = await fetch(`${apiUrl}/problems/${problemId}/evidence`, { method: "POST", body: formData });
      if (!evidenceResponse.ok) {
        const detail = await evidenceResponse.text();
        throw new Error(detail || `Evidence upload failed (${evidenceResponse.status})`);
      }
    }

    void fetch(`${apiUrl}/problems/${problemId}/analyze`, { method: "POST" }).catch(() => undefined);
    return true;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/signin?callbackUrl=/post-problem");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post a Problem</h1>
        <p className="mt-1 text-sm text-slate-500">
          Describe a real-world civic or community issue in plain language. Our AI converts your report into a structured challenge draft for your review before government submission.
        </p>
      </div>

      <div className="flex gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4">
        <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-blue-600" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-900">How it works</p>
          <ul className="space-y-0.5 text-xs text-blue-700 list-disc list-inside">
            <li>Be specific about the exact location of the problem</li>
            <li>Describe how long the problem has existed</li>
            <li>Mention how many people are affected</li>
            <li>Attach photos or documents if available — they can help verification</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <PostProblemForm 
          onSubmitSuccess={handleSubmitSuccess} 
          ownerUserId={user.id} 
          regionId={user.regionId ?? "region-1"} 
        />
      </div>
    </div>
  );
}