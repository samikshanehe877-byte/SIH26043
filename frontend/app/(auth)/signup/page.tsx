"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Building, GraduationCap, AlertCircle, Loader2, CheckCircle, ArrowRight } from "lucide-react";

type Role = "CITIZEN" | "UNIVERSITY" | "INDUSTRY";

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

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();
  const initialRole = (searchParams.get("role") as Role) || "CITIZEN";

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [universityData, setUniversityData] = useState<UniversityData>(initialUniversityData);
  const [industryData, setIndustryData] = useState<IndustryData>(initialIndustryData);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const validateForm = () => {
    if (!name.trim()) return "Full name is required";
    if (!email.trim()) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    if (role === "UNIVERSITY") {
      if (!universityData.name.trim()) return "University name is required";
      if (!universityData.registrationNumber.trim()) return "Registration number is required";
      if (!universityData.state.trim()) return "State is required";
      if (!universityData.regionId.trim()) return "Region ID is required";
      if (!universityData.department.trim()) return "Department is required";
    }

    if (role === "INDUSTRY") {
      if (!industryData.companyName.trim()) return "Company name is required";
      if (!industryData.registrationNumber.trim()) return "Registration number is required";
      if (!industryData.industryType.trim()) return "Industry type is required";
      if (!industryData.state.trim()) return "State is required";
      if (!industryData.regionId.trim()) return "Region ID is required";
      if (!industryData.department.trim()) return "Department is required";
    }

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

    const data = {
      name,
      email,
      password,
      phone: phone || undefined,
      role,
      universityData: role === "UNIVERSITY" ? universityData : undefined,
      industryData: role === "INDUSTRY" ? industryData : undefined,
    };

    const result = await register(data);

    if (result.success) {
      setSuccess(result.message || "Registration successful!");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }

    setIsLoading(false);
  };

  if (isAuthenticated) {
    return null;
  }

  const roleOptions: { value: Role; label: string; icon: React.ReactNode; description: string; details: string[] }[] = [
    {
      value: "CITIZEN",
      label: "Problem Giver (Citizen)",
      icon: <User className="h-5 w-5" />,
      description: "Report civic issues in your community",
      details: ["Post problems with photos & location", "Track problem status", "Connect with solvers"],
    },
    {
      value: "UNIVERSITY",
      label: "University",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Academic institution solving problems",
      details: ["Create student teams", "Assign faculty mentors", "Collaborate with industry"],
    },
    {
      value: "INDUSTRY",
      label: "Industry",
      icon: <Building className="h-5 w-5" />,
      description: "Company providing technical expertise",
      details: ["Provide mentorship & resources", "Sponsor challenges", "Hire talent from projects"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mx-auto mb-6">
            <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-3 text-lg text-gray-600">Join the platform to solve civic challenges together</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Register as</label>
              <div className="grid grid-cols-3 gap-4">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`relative p-5 border-2 rounded-xl text-left transition-all h-full ${
                      role === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={role === option.value}
                      onChange={() => setRole(option.value)}
                      className="sr-only"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${role === option.value ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <ul className="pl-10 space-y-1 text-xs text-gray-500">
                        {option.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="text-blue-500">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {role === option.value && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                    placeholder="+91 98765 43210"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {role === "UNIVERSITY" && (
              <div className="border-t border-gray-200 pt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">University Details</h3>
                </div>
                <p className="text-sm text-gray-500 ml-10">This information will create your university profile. Team members and mentors can be added later from the dashboard.</p>
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
            )}

            {role === "INDUSTRY" && (
              <div className="border-t border-gray-200 pt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Industry Details</h3>
                </div>
                <p className="text-sm text-gray-500 ml-10">This information will create your company profile. Team members and mentors can be added later from the dashboard.</p>
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
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            <span>{isLoading ? "Creating account..." : "Create account"}</span>
            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </button>

          <p className="text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            .
          </p>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}