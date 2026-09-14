"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleSignOut = async () => {
      await logout();
      router.push("/");
      router.refresh();
    };
    handleSignOut();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900">Signing out...</h2>
        <p className="mt-2 text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}