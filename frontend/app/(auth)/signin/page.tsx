
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  BookOpen,
  Users,
} from "lucide-react";

// The four roles a reviewer needs to walk the whole workflow. A problem is posted by a citizen,
// verified by an officer, matched to organisations, and volunteered for by one of them -- so
// seeing any of it through requires switching accounts, which a login screen does not suggest.
const DEMO_ACCOUNTS = [
  { role: "Citizen", detail: "Posts problems", email: "rahul.citizen@example.com" },
  { role: "Government Officer", detail: "Verifies problems", email: "officer.patil@maharashtra.gov.in" },
  { role: "University Coordinator", detail: "ABC Institute, Pune", email: "coordinator@abcit.edu.in" },
  { role: "Industry Employee", detail: "TechSolutions, Pune", email: "amit.engineer@techsolutions.com" },
] as const;

const DEMO_PASSWORD = "password123";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const requestedPath =
        callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/";

      router.replace(
        requestedPath !== "/" ? requestedPath : result.redirectTo || "/"
      );

      router.refresh();
    } else {
      setError(
        result.message ||
          (language === "Hindi"
            ? "लॉगिन विफल हुआ। कृपया पुनः प्रयास करें।"
            : "Login failed. Please try again.")
      );
    }

    setIsLoading(false);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "English" | "Hindi")
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t("language")}
        >
          <option value="English">English</option>
          <option value="Hindi">हिन्दी</option>
        </select>
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mx-auto mb-6"
          >
            <svg
              className="h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">
            {language === "Hindi" ? "वापसी पर स्वागत है" : "Welcome back"}
          </h2>

          <p className="mt-2 text-gray-600">
            {language === "Hindi"
              ? "जारी रखने के लिए अपने खाते में साइन इन करें"
              : "Sign in to your account to continue"}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {language === "Hindi" ? "ईमेल पता" : "Email address"}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {language === "Hindi" ? "पासवर्ड" : "Password"}
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
                  aria-label={
                    showPassword
                      ? language === "Hindi"
                        ? "पासवर्ड छुपाएं"
                        : "Hide password"
                      : language === "Hindi"
                        ? "पासवर्ड दिखाएं"
                        : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />

              <span className="text-sm text-gray-600">
                {language === "Hindi" ? "मुझे याद रखें" : "Remember me"}
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {language === "Hindi"
                ? "पासवर्ड भूल गए?"
                : "Forgot password?"}
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}

            <span>
              {isLoading
                ? language === "Hindi"
                  ? "साइन इन हो रहा है..."
                  : "Signing in..."
                : t("sign_in")}
            </span>

            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0 text-blue-700" />
              <p className="text-sm font-semibold text-blue-900">
                {language === "Hindi" ? "डेमो खाते" : "Demo accounts"}
              </p>
            </div>
            <Link
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {language === "Hindi" ? "गाइड" : "Guide"}
            </Link>
          </div>

          <p className="mt-1.5 text-xs text-blue-800">
            {language === "Hindi"
              ? "भरने के लिए किसी भूमिका पर क्लिक करें। सभी का पासवर्ड: "
              : "Click a role to fill the form. Password for all: "}
            <span className="font-mono font-semibold">{DEMO_PASSWORD}</span>
          </p>

          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(DEMO_PASSWORD);
                  setError("");
                }}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  email === account.email
                    ? "border-blue-500 bg-white shadow-sm"
                    : "border-blue-200 bg-white/70 hover:border-blue-400 hover:bg-white"
                }`}
              >
                <span className="block text-xs font-semibold text-gray-900">{account.role}</span>
                <span className="block text-[11px] text-gray-500">{account.detail}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {language === "Hindi"
              ? "क्या आपका खाता नहीं है?"
              : "Don't have an account?"}{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {language === "Hindi" ? "खाता बनाएं" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
