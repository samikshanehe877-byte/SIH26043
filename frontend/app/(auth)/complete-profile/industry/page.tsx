"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Building, Mail, MapPin, Phone, Globe, AlertCircle, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface IndustryData {
  companyName: string;
  registrationNumber: string;
  industryType: string;
  description: string;
  website: string;
  address: string;
  district: string;
  state: string;
  regionId: string;
  department: string;
  phone: string;
}

const initialIndustryData: IndustryData = {
  companyName: "",
  registrationNumber: "",
  industryType: "",
  description: "",
  website: "",
  address: "",
  district: "",
  state: "",
  regionId: "",
  department: "",
  phone: "",
};

export default function CompleteIndustryProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [industryData, setIndustryData] = useState<IndustryData>(initialIndustryData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || !["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"].includes(user.role)) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = () => {
    if (!industryData.companyName.trim()) return "Company name is required";
    if (!industryData.registrationNumber.trim()) return "Registration number is required";
    if (!industryData.industryType.trim()) return "Industry type is required";
    if (!industryData.state.trim()) return "State is required";
    if (!industryData.regionId.trim()) return "Region ID is required";
    if (!industryData.department.trim()) return "Department is required";
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
      const res = await fetch("/api/auth/complete-industry-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(industryData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Company profile created successfully! Redirecting to dashboard...");
        await refreshUser();
        setTimeout(() => {
          router.push("/industry");
          router.refresh();
        }, 1500);
      } else {
        setError(data.message || "Failed to create company profile");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  if (!user || !["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"].includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mx-auto mb-6">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Complete Company Profile</h1>
          <p className="mt-3 text-lg text-gray-600">Welcome {user.name}! Set up your company details to get started.</p>
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
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            </div>
            <p className="text-sm text-gray-500 ml-10">This creates your company profile. Team members and mentors can be added later from the dashboard.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="indName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company name <span className="text-red-500">*</span>
                </label>
                <input
                  id="indName"
                  type="text"
                  value={industryData.companyName}
                  onChange={(e) => setIndustryData({ ...industryData, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., TechSolutions Pvt Ltd"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indRegNum" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration number <span className="text-red-500">*</span>
                </label>
                <input
                  id="indRegNum"
                  type="text"
                  value={industryData.registrationNumber}
                  onChange={(e) => setIndustryData({ ...industryData, registrationNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., IND-001"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indType" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry type <span className="text-red-500">*</span>
                </label>
                <input
                  id="indType"
                  type="text"
                  value={industryData.industryType}
                  onChange={(e) => setIndustryData({ ...industryData, industryType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., Information Technology"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indDept" className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  id="indDept"
                  type="text"
                  value={industryData.department}
                  onChange={(e) => setIndustryData({ ...industryData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., R&D"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  id="indPhone"
                  type="tel"
                  value={industryData.phone}
                  onChange={(e) => setIndustryData({ ...industryData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="+91-XX-XXXXXXXX"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="indAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="indAddress"
                  type="text"
                  value={industryData.address}
                  onChange={(e) => setIndustryData({ ...industryData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="Street address, area"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indDistrict" className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  id="indDistrict"
                  type="text"
                  value={industryData.district}
                  onChange={(e) => setIndustryData({ ...industryData, district: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., Pune"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indState" className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="indState"
                  type="text"
                  value={industryData.state}
                  onChange={(e) => setIndustryData({ ...industryData, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., Maharashtra"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="indRegion" className="block text-sm font-medium text-gray-700 mb-1">
                  Region ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="indRegion"
                  type="text"
                  value={industryData.regionId}
                  onChange={(e) => setIndustryData({ ...industryData, regionId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="e.g., region-1"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="indWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  id="indWebsite"
                  type="url"
                  value={industryData.website}
                  onChange={(e) => setIndustryData({ ...industryData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                  placeholder="https://example.com"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="indDesc" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="indDesc"
                  value={industryData.description}
                  onChange={(e) => setIndustryData({ ...industryData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors resize-none"
                  placeholder="Brief description of your company"
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