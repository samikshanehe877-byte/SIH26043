"use client";

import { Save, Bell, Lock, Eye, Monitor } from "lucide-react";

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">Manage your account preferences and notifications.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Navigation Tabs Mock */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          <button className="flex items-center gap-2 border-b-2 border-indigo-600 px-6 py-4 text-sm font-semibold text-indigo-600">
            <Monitor size={16} /> Preferences
          </button>
          <button className="flex items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700">
            <Bell size={16} /> Notifications
          </button>
          <button className="flex items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700">
            <Lock size={16} /> Privacy
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1 */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Theme</p>
                  <p className="text-sm text-slate-500">Select your preferred interface theme.</p>
                </div>
                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>System Default</option>
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <p className="font-semibold text-slate-800">Task Updates</p>
                  <p className="text-sm text-slate-500">Receive emails when your tasks are updated or reviewed.</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <p className="font-semibold text-slate-800">Team Messages</p>
                  <p className="text-sm text-slate-500">Receive emails for new messages in the team chat.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <p className="font-semibold text-slate-800">New Resources</p>
                  <p className="text-sm text-slate-500">Receive emails when new resources are added to the project.</p>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

