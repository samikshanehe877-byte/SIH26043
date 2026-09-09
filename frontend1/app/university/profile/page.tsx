"use client";

import { useState } from "react";
import {
  Edit2, MapPin, Mail, Globe, Building2, Users, GraduationCap,
  BookOpen, CheckCircle2, Activity, X, Save,
} from "lucide-react";
import { universityProfile, universityCoordinator } from "@/data/universityAppData";
import { UniversityProfile } from "@/types/universityChallenge";

export default function UniversityProfilePage() {
  const [profile, setProfile] = useState<UniversityProfile>(universityProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:         profile.name,
    location:     profile.location,
    description:  profile.description,
    contactEmail: profile.contactEmail,
    website:      profile.website,
  });

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, ...form }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">University Profile</h1>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={16} /> Profile updated successfully!
          </div>
        )}

        {/* University card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-lg font-black text-white shadow-md">
                {profile.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                <span className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-600">
                  {profile.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          </div>

          <div className="mt-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={15} className="text-slate-400" />
              {profile.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={15} className="text-slate-400" />
              {profile.contactEmail}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Globe size={15} className="text-slate-400" />
              {profile.website}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 size={15} className="text-slate-400" />
              Established {profile.establishedYear}
            </div>
          </div>

          {profile.description && (
            <p className="mt-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
              {profile.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Departments",        value: profile.departmentCount,    icon: Building2,     color: "text-indigo-600 bg-indigo-50"  },
            { label: "Mentors",            value: profile.mentorCount,        icon: Users,         color: "text-blue-600 bg-blue-50"      },
            { label: "Students",           value: profile.studentCount,       icon: GraduationCap, color: "text-violet-600 bg-violet-50"  },
            { label: "Active Challenges",  value: profile.activeChallenges,   icon: BookOpen,      color: "text-amber-600 bg-amber-50"    },
            { label: "Completed",          value: profile.completedChallenges,icon: CheckCircle2,  color: "text-green-600 bg-green-50"    },
            { label: "Coordinator",        value: universityCoordinator.name, icon: Activity,      color: "text-slate-600 bg-slate-100"   },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`flex items-center gap-3 rounded-2xl p-4 ${color}`}>
              <Icon size={18} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-bold truncate">{value}</p>
                <p className="text-xs font-medium opacity-80">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Coordinator card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-700">University Coordinator</h3>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-sm">
              {universityCoordinator.avatar}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{universityCoordinator.name}</p>
              <p className="text-xs text-indigo-600 font-medium">{universityCoordinator.role}</p>
              <p className="text-xs text-slate-500">{universityCoordinator.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Edit University Profile</h3>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "University Name", key: "name",         type: "text",  placeholder: "University name"    },
                { label: "Location",        key: "location",     type: "text",  placeholder: "City, State"        },
                { label: "Contact Email",   key: "contactEmail", type: "email", placeholder: "contact@university" },
                { label: "Website",         key: "website",      type: "text",  placeholder: "www.university.edu" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
