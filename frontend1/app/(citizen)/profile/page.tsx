"use client";

import { useState } from "react";
import { Edit2, Mail, MapPin, Calendar, FileText, Clock, CheckCircle2, X, Save } from "lucide-react";
import { currentUser } from "@/data/problems";
import { User } from "@/types/problem";
import StatsCard from "@/components/StatsCard";

export default function ProfilePage() {
  const [user, setUser] = useState<User>(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, city: user.city });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser((prev) => ({ ...prev, ...form }));
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({ name: user.name, email: user.email, city: user.city });
    setIsEditing(false);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={16} />
            Profile updated successfully!
          </div>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white shadow-md">
                {user.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-600">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={15} className="flex-shrink-0 text-slate-400" />
              {user.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin size={15} className="flex-shrink-0 text-slate-400" />
              {user.city}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={15} className="flex-shrink-0 text-slate-400" />
              Member since {user.joinedDate}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            Your Contribution
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatsCard label="Problems Submitted" value={user.totalSubmitted} icon={FileText}      color="blue"  />
            <StatsCard label="In Progress"         value={user.inProgress}     icon={Clock}        color="amber" />
            <StatsCard label="Completed"           value={user.completed}       icon={CheckCircle2} color="green" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-800">Impact Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Problems resolved",        value: user.completed,       max: user.totalSubmitted, color: "bg-green-500" },
              { label: "Problems being worked on", value: user.inProgress,      max: user.totalSubmitted, color: "bg-blue-500"  },
              { label: "Awaiting assignment",      value: user.totalSubmitted - user.inProgress - user.completed, max: user.totalSubmitted, color: "bg-amber-400" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-700">{item.value}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full ${item.color}`}
                    style={{ width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <button
                onClick={handleCancel}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Full Name",       key: "name",  type: "text",  placeholder: "Your full name" },
                { label: "Email Address",   key: "email", type: "email", placeholder: "your@email.com" },
                { label: "City / Location", key: "city",  type: "text",  placeholder: "City, State"    },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
