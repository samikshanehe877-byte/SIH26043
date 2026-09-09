"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Sliders,
  User,
  Check,
  Smartphone,
  Mail,
  Lock,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import { useMentor } from "@/context/MentorContext";

export default function MentorSettingsPage() {
  const { profile } = useMentor();

  const [activeTab, setActiveTab] = useState<"notifications" | "account" | "security" | "preferences">(
    "notifications"
  );

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskNotifs, setTaskNotifs] = useState(true);
  const [industryNotifs, setIndustryNotifs] = useState(true);
  const [universityNotifs, setUniversityNotifs] = useState(true);
  const [studentActivityNotifs, setStudentActivityNotifs] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <MentorHeader
        title="Mentor Portal Settings"
        subtitle="Configure alerts, dispatch preferences, security, and account preferences"
      >
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
        >
          <Check size={15} />
          Save Preferences
        </button>
      </MentorHeader>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 text-center animate-fadeIn">
          Settings updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs">
        {[
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "account", label: "Account & University", icon: User },
          { id: "security", label: "Security & Access", icon: Shield },
          { id: "preferences", label: "Dashboard Preferences", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                isActive
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Notification Channels & Triggers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control when and how you receive alerts regarding your assigned students and industry partners.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {/* Email notifications */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                <p className="text-[11px] text-slate-500">
                  Receive daily digests and urgent task alerts at {profile.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  emailNotifs ? "bg-emerald-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    emailNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Task notifications */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Task Submission Alerts</p>
                <p className="text-[11px] text-slate-500">
                  Notify immediately when a student submits work packages for mentor code review
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTaskNotifs(!taskNotifs)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  taskNotifs ? "bg-emerald-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    taskNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Industry collaboration notifications */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Industry Collaboration Updates
                </p>
                <p className="text-[11px] text-slate-500">
                  Alerts when corporate partners respond to API, compute, or funding requests
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIndustryNotifs(!industryNotifs)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  industryNotifs ? "bg-emerald-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    industryNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* University updates */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-slate-800">University Coordinator Requests</p>
                <p className="text-[11px] text-slate-500">
                  Reminders for bi-weekly milestone audits and Dean evaluations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUniversityNotifs(!universityNotifs)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  universityNotifs ? "bg-emerald-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    universityNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Student activity notifications */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Student Activity Stream</p>
                <p className="text-[11px] text-slate-500">
                  Notify when students push dataset revisions or request feedback
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStudentActivityNotifs(!studentActivityNotifs)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  studentActivityNotifs ? "bg-emerald-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    studentActivityNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      {activeTab === "account" && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Academic Affiliation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">University Institution</label>
              <input
                type="text"
                disabled
                value={profile.university}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Assigned Department</label>
              <input
                type="text"
                disabled
                value={profile.department}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Security & Credentials</h3>
          <p className="text-xs text-slate-500">
            Manage your faculty institutional single-sign-on (SSO) and authentication settings.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">BVU Institutional SSO</p>
                <p className="text-[11px] text-slate-500">Connected to Microsoft Entra ID</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Active
            </span>
          </div>
        </div>
      )}

      {/* Preferences */}
      {activeTab === "preferences" && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Mentor Dashboard Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Default Task View</label>
              <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <option>Kanban Board View</option>
                <option>Table / List View</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Max Students per Team</label>
              <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <option>6 Students (Recommended)</option>
                <option>4 Students</option>
                <option>8 Students</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

