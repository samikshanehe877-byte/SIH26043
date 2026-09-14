"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Building, GraduationCap, Mail, MapPin, Phone, Globe, FileText, AlertCircle, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UniversityData {
  name: string;
  registrationNumber: string;
  description: string;
  website: string;
  address: string;
  district: string;
  state: string;
  regionId: string;
  department: string;
  phone: string;
}

const initialUniversityData: UniversityData = {
  name: "",
  registrationNumber: "",
  description: "",
  website: "",
  address: "",
  district: "",
  state: "",
  regionId: "",
  department: "",
  phone: "",
};

export default function CompleteUniversityProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [universityData, setUniversityData] = useState<UniversityData>(initialUniversityData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== "FACULTY") {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = () => {
    if (!universityData.name.trim()) return "University name is required";
    if (!universityData.registrationNumber.trim()) return "Registration number is required";
    if (!universityData.state.trim()) return "State is required";
    if (!universityData.regionId.trim()) return "Region ID is required";
    if (!universityData.department.trim()) return "Department is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/complete-university-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(universityData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("University profile created successfully! Redirecting to dashboard...");
        await refreshUser();
        setTimeout(() => {
          router.push("/university");
          router.refresh();
        }, 1500);
      } else {
        setError(data.message || "Failed to create university profile");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  if (!user || user.role !== "FACULTY") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mx-auto mb-6">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Complete University Profile</h1>
          <p className="mt-3 text-lg text-gray-600">Welcome {user.name}! Set up your university details to get started.</p>
        </div>

        <form className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-600 rounded-lg text-sm border border-green-200">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">University Information</h3>
            </div>
            <p className="text-sm text-gray-500 ml-10">This creates your university profile. Team members and mentors can be added later from the dashboard.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="univName" className="block text-sm font-medium text-gray-700 mb-1">
                  University name <span className="text-red-500">*</span>
                </label>
                <input
                  id="univName"
                  type="text"
                  value={universityData.name}
                  onChange={(e) => setUniversityData({ ...universityData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., ABC Institute of Technology"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="univRegNum" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration number <span className="text-red-500">*</span>
                </label>
                <input
                  id="univRegNum"
                  type="text"
                  value={universityData.registrationNumber}
                  onChange={(e) => setUniversityData({ ...universityData, registrationNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., UNIV-001"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="univDept" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary department <span className="text-red-500">*</span>
                </label>
                <input
                  id="univDept"
                  type="text"
                  value={universityData.department}
                  onChange={(e) => setUniversityData({ ...universityData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., Computer Science"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="univPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  id="univPhone"
                  type="tel"
                  value={universityData.phone}
                  onChange={(e) => setUniversityData({ ...universityData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="+91-XX-XXXXXXXX"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="univAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="univAddress"
                  type="text"
                  value={universityData.address}
                  onChange={(e) => setUniversityData({ ...universityData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="Street address, area"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="univDistrict" className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  id="univDistrict"
                  type="text"
                  value={universityData.district}
                  onChange={(e) => setUniversityData({ ...universityData, district: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., Pune"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="univState" className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="univState"
                  type="text"
                  value={universityData.state}
                  onChange={(e) => setUniversityData({ ...universityData, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., Maharashtra"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="univRegion" className="block text-sm font-medium text-gray-700 mb-1">
                  Region ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="univRegion"
                  type="text"
                  value={universityData.regionId}
                  onChange={(e) => setUniversityData({ ...universityData, regionId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., region-1"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="univWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  id="univWebsite"
                  type="url"
                  value={universityData.website}
                  onChange={(e) => setUniversityData({ ...universityData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="https://example.edu.in"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="univDesc" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="univDesc"
                  value={universityData.description}
                  onChange={(e) => setUniversityData({ ...universityData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors resize-none"
                  placeholder="Brief description of your university"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            <span>{isLoading ? "Creating profile..." : "Complete Profile"}</span>
            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link href="/signout" className="font-medium text-blue-600 hover:text-blue-500">
              Sign out
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}