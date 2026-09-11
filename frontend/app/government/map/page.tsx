"use client";

import { MapPin, Users, Building2, CheckCircle2, Clock, TrendingUp, Shield, Activity } from "lucide-react";
import { regionalProblems, governmentProjects, regionalStats } from "@/data/governmentData";

export default function MapPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <h1 className="text-3xl font-bold text-slate-900">Regional Problem Map</h1>
        <p className="text-slate-600 max-w-xl">
          Interactive map showing problem distribution, active projects, and verification status across Maharashtra districts.
        </p>
      </div>

      {/* Map Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Maharashtra Problem Overview</h2>
                <p className="text-sm text-slate-500">Real-time geographic distribution</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                <Activity size={16} />
                Live Updates
              </button>
              <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                <MapPin size={16} />
                Full Screen
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end space-x-3">
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
            <option>All Districts</option>
            <option>Pune</option>
            <option>Mumbai</option>
            <option>Nagpur</option>
            <option>Nashik</option>
            <option>Aurangabad</option>
          </select>
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
            <option>All Categories</option>
            <option>Disaster Management</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Infrastructure</option>
            <option>Environment</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Map visualization would go here - using placeholder for now */}
          <div className="flex h-full items-center justify-center text-slate-400">
            <div className="text-center">
              <MapPin size={48} className="mb-4" />
              <h3 className="font-semibold text-slate-700">Interactive Map Visualization</h3>
              <p className="text-sm text-slate-500">
                Geographic problem distribution and project tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overlay */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{regionalProblems.length}</p>
          <p className="text-sm text-slate-500">Total Problems Mapped</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {regionalProblems.filter(p => p.verificationStatus === "Verified").length}
          </p>
          <p className="text-sm text-slate-500">Verified Locations</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Building2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{governmentProjects.length}</p>
          <p className="text-sm text-slate-500">Active Projects</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Shield size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {regionalStats.critical + regionalStats.high}
          </p>
          <p className="text-sm text-slate-500">High Priority Areas</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Geographic Activity</h2>
          <span className="text-sm text-slate-500">Last 24 hours</span>
        </div>
        <div className="space-y-4">
          {regionalProblems
            .slice(0, 5)
            .map((problem, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-600">
                    <MapPin size={12} />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900">{problem.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold">
                      {problem.verificationStatus === "Verified" ? (
                        <span className="bg-green-50 text-green-600">Verified</span>
                      ) : problem.verificationStatus === "Under Review" ? (
                        <span className="bg-blue-50 text-blue-600">Under Review</span>
                      ) : (
                        <span className="bg-yellow-50 text-yellow-600">Pending</span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {problem.location}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Users size={10} className="text-slate-400" />
                      <span>{problem.supporters}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-slate-400" />
                      <span>{problem.dateSubmitted}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}