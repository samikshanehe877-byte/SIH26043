import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Challenge Accepted",   desc: "Team assigned to the challenge" },
  { label: "Research",             desc: "Understanding the problem & requirements" },
  { label: "Prototype",            desc: "Initial design and feasibility study" },
  { label: "Development",          desc: "Writing code & building the solution" },
  { label: "Testing",              desc: "Quality assurance & bug fixing" },
  { label: "Final Solution",       desc: "Project ready for review" },
  { label: "Verification",         desc: "Mentor & University review" },
  { label: "Certificate",          desc: "Issue of completion certificate" },
];

interface StudentProjectTimelineProps {
  currentStep: number;
  progress: number;
}

export default function StudentProjectTimeline({ currentStep, progress }: StudentProjectTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Project Timeline</h3>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-600">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700"
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
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
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
                    isDone ? "text-green-600" : isActive ? "text-indigo-600" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className={`mt-0.5 text-xs ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                  {step.desc}
                </p>
                {isActive && (
                  <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
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

