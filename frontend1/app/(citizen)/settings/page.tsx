"use client";

import { useState } from "react";
import { Bell, Shield, Palette, Globe, ChevronRight, Check } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-600" : "bg-slate-200"
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

interface SettingItem {
  key: string;
  label: string;
  description: string;
}

interface SettingSection {
  title: string;
  icon: React.ElementType;
  items: SettingItem[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications:   true,
    pushNotifications:    true,
    statusUpdates:        true,
    communityAlerts:      false,
    weeklyDigest:         false,
    profileVisibility:    true,
    showLocation:         true,
    dataSharing:          false,
    highContrast:         false,
    compactView:          false,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections: SettingSection[] = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { key: "emailNotifications", label: "Email Notifications",  description: "Receive updates about your problems via email"         },
        { key: "pushNotifications",  label: "Push Notifications",   description: "Browser push notifications for real-time updates"      },
        { key: "statusUpdates",      label: "Status Updates",       description: "Notify when your problem status changes"               },
        { key: "communityAlerts",    label: "Community Alerts",     description: "Get notified about new problems in your area"          },
        { key: "weeklyDigest",       label: "Weekly Digest",        description: "A weekly summary of platform activity"                 },
      ],
    },
    {
      title: "Privacy",
      icon: Shield,
      items: [
        { key: "profileVisibility", label: "Public Profile",   description: "Allow other citizens to view your profile"              },
        { key: "showLocation",      label: "Show Location",    description: "Display your city on your public profile"               },
        { key: "dataSharing",       label: "Anonymous Analytics", description: "Share anonymous usage data to improve the platform"  },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { key: "highContrast", label: "High Contrast Mode", description: "Increase contrast for better readability" },
        { key: "compactView",  label: "Compact View",       description: "Show more content with reduced spacing"   },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your notification preferences, privacy, and appearance.
        </p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <Check size={16} />
          Settings saved successfully!
        </div>
      )}

      {/* Setting sections */}
      {sections.map(({ title, icon: Icon, items }) => (
        <div key={title} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Icon size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          </div>

          {/* Items */}
          <div className="divide-y divide-slate-50">
            {items.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{description}</p>
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

      {/* Language & Region */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <Globe size={16} className="text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Language & Region</h2>
        </div>
        {[
          { label: "Language",  value: "English (India)" },
          { label: "Region",    value: "India"           },
          { label: "Timezone",  value: "IST (UTC +5:30)" },
        ].map(({ label, value }) => (
          <button
            key={label}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 border-b border-slate-50 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500">{value}</p>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.99]"
      >
        Save Settings
      </button>
    </div>
  );
}
