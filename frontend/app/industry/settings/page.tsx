"use client";

import { Save, Bell, Lock, UserCog, Monitor } from "lucide-react";

export default function IndustrySettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">Manage your company account preferences and security.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          <button className="flex items-center gap-2 border-b-2 border-blue-600 px-6 py-4 text-sm font-semibold text-blue-600">
            <Monitor size={16} /> Preferences
          </button>
          <button className="flex items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700">
            <Bell size={16} /> Notifications
          </button>
          <button className="flex items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700">
            <UserCog size={16} /> Collaboration
          </button>
          <button className="flex items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700">
            <Lock size={16} /> Security
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Collaboration Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="font-semibold text-slate-800">Receive New Requests</p>
                  <p className="text-sm text-slate-500">Allow universities to send new collaboration requests to your company.</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="font-semibold text-slate-800">Auto-match using AI</p>
                  <p className="text-sm text-slate-500">Allow our AI to recommend your company for relevant challenges automatically.</p>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="font-semibold text-slate-800">New Request Alerts</p>
                  <p className="text-sm text-slate-500">Get notified via email when a new collaboration request is received.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="font-semibold text-slate-800">Milestone Updates</p>
                  <p className="text-sm text-slate-500">Receive weekly summaries of milestone progress on active collaborations.</p>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
              <Save size={16} /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
