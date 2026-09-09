"use client";

import { useState } from "react";
import {
  UserCircle2,
  Building2,
  Mail,
  Phone,
  Calendar,
  Award,
  Users2,
  GraduationCap,
  Briefcase,
  Edit3,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import { useMentor } from "@/context/MentorContext";

export default function MentorProfilePage() {
  const { profile, updateProfile, challenges, teams, students } = useMentor();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    designation: profile.designation,
    department: profile.department,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <MentorHeader
        title="Mentor Academic Profile"
        subtitle="Manage personal academic credentials, research specializations, and mentorship statistics"
      >
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          {isEditing ? (
            <>
              <X size={15} />
              Cancel
            </>
          ) : (
            <>
              <Edit3 size={15} className="text-emerald-600" />
              Edit Profile
            </>
          )}
        </button>
      </MentorHeader>

      {/* Main Profile Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-2xl font-black text-white shadow-md">
              {profile.avatar}
            </div>
            <span
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white bg-emerald-500"
              title="Faculty Mentor Active"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {profile.name}
              </h2>
              <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                Lead Project Mentor
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {profile.designation} • {profile.department}
            </p>
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <Building2 size={13} />
              {profile.university}
            </p>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <Mail size={15} className="text-slate-400" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <Phone size={15} className="text-slate-400" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <Briefcase size={15} className="text-slate-400" />
            <span>{profile.experienceYears} Years Research Experience</span>
          </div>
        </div>

        {/* Editable Form or Read-only Bio */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Edit Basic Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Bio / Research Focus
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <Check size={14} />
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Faculty Biography & Research Focus
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}
      </div>

      {/* Mentorship Track Record Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-3xl border border-emerald-100 bg-white p-4 text-center shadow-xs">
          <p className="text-3xl font-black text-emerald-600">
            {challenges.length}
          </p>
          <p className="text-xs font-bold text-slate-700 mt-1">Assigned Challenges</p>
          <p className="text-[11px] text-slate-400">BVU Societal Mandates</p>
        </div>

        <div className="rounded-3xl border border-teal-100 bg-white p-4 text-center shadow-xs">
          <p className="text-3xl font-black text-teal-600">
            {teams.length}
          </p>
          <p className="text-xs font-bold text-slate-700 mt-1">Active Teams</p>
          <p className="text-[11px] text-slate-400">Supervised Squads</p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-4 text-center shadow-xs">
          <p className="text-3xl font-black text-blue-600">
            {students.length}
          </p>
          <p className="text-xs font-bold text-slate-700 mt-1">Students Mentored</p>
          <p className="text-[11px] text-slate-400">Engineering Roster</p>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-white p-4 text-center shadow-xs">
          <p className="text-3xl font-black text-indigo-600">
            {profile.completedProjectsCount}
          </p>
          <p className="text-xs font-bold text-slate-700 mt-1">Completed Solutions</p>
          <p className="text-[11px] text-slate-400">Production Deployed</p>
        </div>
      </div>

      {/* Skills & Specializations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-600" />
            Core Academic Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.expertise.map((item) => (
              <span
                key={item}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Award size={14} className="text-indigo-600" />
            Specialized Applied Domains
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((item) => (
              <span
                key={item}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

