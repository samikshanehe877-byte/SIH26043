"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

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
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    statusUpdates: true,
    communityAlerts: false,
    weeklyDigest: false,
    profileVisibility: true,
    showLocation: true,
    dataSharing: false,
    highContrast: false,
    compactView: false,
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
      title: tr("Notifications", "सूचनाएँ"),
      icon: Bell,
      items: [
        {
          key: "emailNotifications",
          label: tr("Email Notifications", "ईमेल सूचनाएँ"),
          description: tr(
            "Receive updates about your problems via email",
            "ईमेल के माध्यम से अपनी समस्याओं के अपडेट प्राप्त करें"
          ),
        },
        {
          key: "pushNotifications",
          label: tr("Push Notifications", "पुश सूचनाएँ"),
          description: tr(
            "Browser push notifications for real-time updates",
            "रीयल-टाइम अपडेट के लिए ब्राउज़र पुश सूचनाएँ प्राप्त करें"
          ),
        },
        {
          key: "statusUpdates",
          label: tr("Status Updates", "स्थिति अपडेट"),
          description: tr(
            "Notify when your problem status changes",
            "जब आपकी समस्या की स्थिति बदले तो सूचित करें"
          ),
        },
        {
          key: "communityAlerts",
          label: tr("Community Alerts", "सामुदायिक अलर्ट"),
          description: tr(
            "Get notified about new problems in your area",
            "अपने क्षेत्र में नई समस्याओं के बारे में सूचित हों"
          ),
        },
        {
          key: "weeklyDigest",
          label: tr("Weekly Digest", "साप्ताहिक सारांश"),
          description: tr(
            "A weekly summary of platform activity",
            "प्लेटफ़ॉर्म की गतिविधियों का साप्ताहिक सारांश"
          ),
        },
      ],
    },
    {
      title: tr("Privacy", "गोपनीयता"),
      icon: Shield,
      items: [
        {
          key: "profileVisibility",
          label: tr("Public Profile", "सार्वजनिक प्रोफ़ाइल"),
          description: tr(
            "Allow other citizens to view your profile",
            "अन्य नागरिकों को आपकी प्रोफ़ाइल देखने की अनुमति दें"
          ),
        },
        {
          key: "showLocation",
          label: tr("Show Location", "स्थान दिखाएँ"),
          description: tr(
            "Display your city on your public profile",
            "अपनी सार्वजनिक प्रोफ़ाइल पर अपना शहर दिखाएँ"
          ),
        },
        {
          key: "dataSharing",
          label: tr("Anonymous Analytics", "अनाम विश्लेषण"),
          description: tr(
            "Share anonymous usage data to improve the platform",
            "प्लेटफ़ॉर्म को बेहतर बनाने के लिए अनाम उपयोग डेटा साझा करें"
          ),
        },
      ],
    },
    {
      title: tr("Appearance", "दिखावट"),
      icon: Palette,
      items: [
        {
          key: "highContrast",
          label: tr("High Contrast Mode", "उच्च कंट्रास्ट मोड"),
          description: tr(
            "Increase contrast for better readability",
            "बेहतर पठनीयता के लिए कंट्रास्ट बढ़ाएँ"
          ),
        },
        {
          key: "compactView",
          label: tr("Compact View", "कॉम्पैक्ट दृश्य"),
          description: tr(
            "Show more content with reduced spacing",
            "कम अंतराल के साथ अधिक सामग्री दिखाएँ"
          ),
        },
      ],
    },
  ];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/signin?callbackUrl=/settings");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {tr("Settings", "सेटिंग्स")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {tr(
            "Manage your notification preferences, privacy, and appearance.",
            "अपनी सूचना प्राथमिकताओं, गोपनीयता और दिखावट को प्रबंधित करें।"
          )}
        </p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <Check size={16} />
          {tr(
            "Settings saved successfully!",
            "सेटिंग्स सफलतापूर्वक सहेजी गईं!"
          )}
        </div>
      )}

      {/* Setting sections */}
      {sections.map(({ title, icon: Icon, items }) => (
        <div
          key={title}
          className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
        >
          {/* Section header */}
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Icon size={16} className="text-blue-600" />
            </div>

            <h2 className="text-sm font-bold text-slate-800">
              {title}
            </h2>
          </div>

          {/* Items */}
          <div className="divide-y divide-slate-50">
            {items.map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {description}
                  </p>
                </div>

                <Toggle
                  checked={settings[key as keyof typeof settings]}
                  onChange={() =>
                    toggle(key as keyof typeof settings)
                  }
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

          <h2 className="text-sm font-bold text-slate-800">
            {tr("Language & Region", "भाषा और क्षेत्र")}
          </h2>
        </div>

        {[
          {
            label: tr("Language", "भाषा"),
            value: hindi ? "हिन्दी (भारत)" : "English (India)",
          },
          {
            label: tr("Region", "क्षेत्र"),
            value: "India",
          },
          {
            label: tr("Timezone", "समय क्षेत्र"),
            value: "IST (UTC +5:30)",
          },
        ].map(({ label, value }) => (
          <button
            key={label}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 border-b border-slate-50 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {label}
              </p>

              <p className="text-xs text-slate-500">
                {value}
              </p>
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
        {tr("Save Settings", "सेटिंग्स सहेजें")}
      </button>
    </div>
  );
}