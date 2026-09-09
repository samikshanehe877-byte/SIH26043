import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Problem Submitted",    desc: "Received by the platform" },
  { label: "AI Analysis",          desc: "Automated categorization & priority" },
  { label: "Admin Verification",   desc: "Manual review by admin team" },
  { label: "University Assigned",  desc: "Routed to relevant institution" },
  { label: "Department Assigned",  desc: "Assigned to specific department" },
  { label: "Solution Development", desc: "Team working on solution" },
  { label: "Industry Collaboration", desc: "Industry partners engaged" },
  { label: "Solution Implemented", desc: "Solution deployed on ground" },
  { label: "Completed",            desc: "Problem fully resolved" },
];

interface ProgressTrackerProps {
  currentStep: number;
  progress: number;
}

export default function ProgressTracker({ currentStep, progress }: ProgressTrackerProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Solution Progress</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isDone    = stepNumber < currentStep;
          const isActive  = stepNumber === currentStep;

          return (
            <div key={step.label} className="flex gap-4">
              {/* Connector column */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <Check size={14} strokeWidth={3} />
                  ) : isActive ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mt-1 w-0.5 flex-1 min-h-[20px] rounded-full transition-colors ${
                      isDone ? "bg-green-300" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`pb-5 ${index === STEPS.length - 1 ? "pb-0" : ""}`}>
                <p
                  className={`text-sm font-semibold leading-tight ${
                    isDone ? "text-green-600" : isActive ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className={`mt-0.5 text-xs ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                  {step.desc}
                </p>
                {isActive && (
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    Currently Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
