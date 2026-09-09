import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Challenge Submitted",      desc: "Received from citizen"          },
  { label: "AI Analysis",              desc: "Automated categorization"        },
  { label: "Admin Verification",       desc: "Manual review by admin"          },
  { label: "University Assigned",      desc: "Routed to institution"           },
  { label: "University Accepted",      desc: "Accepted by coordinator"         },
  { label: "AI Department Assignment", desc: "AI recommends departments"       },
  { label: "Mentor Assigned",          desc: "Lead mentor allocated"           },
  { label: "Student Team Formation",   desc: "Team formed by mentor"           },
  { label: "Research & Analysis",      desc: "Problem scope study"             },
  { label: "Solution Development",     desc: "Building the solution"           },
  { label: "Testing",                  desc: "Validation & quality assurance"  },
  { label: "Industry Collaboration",   desc: "Partner engagement if required"  },
  { label: "Solution Implementation",  desc: "Deployed on ground"              },
  { label: "Completed",                desc: "Challenge fully resolved"        },
];

export default function ChallengeProgressTracker({
  currentStep,
  progress,
}: {
  currentStep: number;
  progress: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Solution Progress</h3>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-600">
          {progress}%
        </span>
      </div>
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const n = i + 1;
          const done = n < currentStep;
          const active = n === currentStep;
          return (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    done
                      ? "bg-green-500 text-white"
                      : active
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? (
                    <Check size={12} strokeWidth={3} />
                  ) : active ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    n
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mt-0.5 w-0.5 flex-1 min-h-[16px] rounded-full ${
                      done ? "bg-green-300" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    done ? "text-green-600" : active ? "text-indigo-600" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400">{step.desc}</p>
                {active && (
                  <span className="mt-0.5 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    Active
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
