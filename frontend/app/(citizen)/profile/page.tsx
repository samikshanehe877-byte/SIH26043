"use client";

import { useState } from "react";
import {
  Edit2,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import StatsCard from "@/components/StatsCard";

export default function ProfilePage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    city: user?.location || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // In a real app, you'd call an API to update the profile
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      city: user?.location || "",
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {tr("Profile", "प्रोफ़ाइल")}
        </h1>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={16} />
            {tr(
              "Profile updated successfully!",
              "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!"
            )}
          </div>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user.name}
                </h2>

                <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-600">
                  {tr(
                    "Problem Giver (Citizen)",
                    "समस्या देने वाला (नागरिक)"
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <Edit2 size={14} />
              {tr("Edit Profile", "प्रोफ़ाइल संपादित करें")}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail
                size={15}
                className="flex-shrink-0 text-slate-400"
              />
              {user.email}
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin
                size={15}
                className="flex-shrink-0 text-slate-400"
              />
              {user.location || tr("Not set", "सेट नहीं है")}
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar
                size={15}
                className="flex-shrink-0 text-slate-400"
              />
              {tr("Member since", "सदस्य बने")}{" "}
              {new Date(
                user.createdAt || Date.now()
              ).toLocaleDateString(
                hindi ? "hi-IN" : "en-US",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            {tr("Your Contribution", "आपका योगदान")}
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatsCard
              label={tr("Problems Submitted", "प्रस्तुत समस्याएँ")}
              value={0}
              icon={FileText}
              color="blue"
            />

            <StatsCard
              label={tr("In Progress", "प्रगति पर")}
              value={0}
              icon={Clock}
              color="amber"
            />

            <StatsCard
              label={tr("Completed", "पूर्ण")}
              value={0}
              icon={CheckCircle2}
              color="green"
            />
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
              <h3 className="text-lg font-bold text-slate-900">
                {tr("Edit Profile", "प्रोफ़ाइल संपादित करें")}
              </h3>

              <button
                onClick={handleCancel}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100"
                aria-label={tr("Close", "बंद करें")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: tr("Full Name", "पूरा नाम"),
                  key: "name",
                  type: "text",
                  placeholder: tr("Your full name", "अपना पूरा नाम"),
                },
                {
                  label: tr("Email Address", "ईमेल पता"),
                  key: "email",
                  type: "email",
                  placeholder: "your@email.com",
                },
                {
                  label: tr("City / Location", "शहर / स्थान"),
                  key: "city",
                  type: "text",
                  placeholder: tr("City, State", "शहर, राज्य"),
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {label}
                  </label>

                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
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
                {tr("Cancel", "रद्द करें")}
              </button>

              <button
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Save size={14} />
                {tr("Save Changes", "परिवर्तन सहेजें")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}