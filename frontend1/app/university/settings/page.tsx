"use client";

import { useState } from "react";
import { Bell, Eye, SlidersHorizontal, Check, ChevronRight } from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-indigo-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function UniversitySettingsPage() {
  const [settings, setSettings] = useState({
    newChallengeAssigned:      true,
    challengeAcceptanceAlerts: true,
    aiDepartmentAnalysis:      true,
    mentorAssignmentUpdates:   true,
    mentorCapacityAlerts:      true,
    challengeProgressUpdates:  true,
    industryCollabUpdates:     false,
    weeklyEmailDigest:         false,
    compactView:               false,
    showAIScores:              true,
    autoFlagLowPriority:       false,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      title: "Notification Preferences",
      icon: Bell,
      items: [
        {
          key: "newChallengeAssigned",
          label: "New Challenge Assigned",
          desc: "Alert when a new challenge is assigned to the university",
        },
        {
          key: "challengeAcceptanceAlerts",
          label: "Challenge Acceptance Updates",
          desc: "Notify when challenges are accepted or rejected",
        },
        {
          key: "aiDepartmentAnalysis",
          label: "AI Department Analysis",
          desc: "Notify when AI completes department assignment analysis",
        },
        {
          key: "mentorAssignmentUpdates",
          label: "Mentor Assignment Updates",
          desc: "Notify when mentors are assigned to challenges",
        },
        {
          key: "mentorCapacityAlerts",
          label: "Mentor Capacity Alerts",
          desc: "Alert when a mentor is approaching maximum capacity",
        },
        {
          key: "challengeProgressUpdates",
          label: "Challenge Progress Updates",
          desc: "Notify when challenge progress is updated by mentors",
        },
        {
          key: "industryCollabUpdates",
          label: "Industry Collaboration Updates",
          desc: "Updates on industry collaboration requests and responses",
        },
        {
          key: "weeklyEmailDigest",
          label: "Weekly Email Digest",
          desc: "Receive a weekly summary of all university activity",
        },
      ],
    },
    {
      title: "Display Preferences",
      icon: Eye,
      items: [
        {
          key: "compactView",
          label: "Compact View",
          desc: "Show more content with reduced card spacing",
        },
        {
          key: "showAIScores",
          label: "Show AI Match Scores",
          desc: "Display AI relevance scores on challenge cards",
        },
        {
          key: "autoFlagLowPriority",
          label: "Auto-flag Low Priority",
          desc: "Automatically flag low-priority challenges for later review",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your notification and display preferences.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      {sections.map(({ title, icon: Icon, items }) => (
        <div
          key={title}
          className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <Icon size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {items.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                </div>
                <Toggle
                  checked={settings[key as keyof typeof settings]}
                  onChange={() => toggle(key as keyof typeof settings)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Default sort */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
            <SlidersHorizontal size={16} className="text-indigo-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Default Sort</h2>
        </div>
        {[
          { label: "Default Challenge Sort", value: "Highest Priority" },
          { label: "Default Mentor Sort",    value: "By Availability"  },
        ].map(({ label, value }) => (
          <button
            key={label}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500">{value}</p>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition active:scale-[0.99]"
      >
        Save Settings
      </button>
    </div>
  );
}
