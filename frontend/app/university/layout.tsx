import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ProblemsProvider } from "@/context/ProblemsContext";
import { UniversityProblemsProvider } from "@/context/UniversityProblemsContext";
import UniversitySidebar from "@/components/university/UniversitySidebar";
import UniversityBottomNavigation from "@/components/university/UniversityBottomNavigation";
import { requirePortalRole } from "@/lib/requirePortalRole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SamasyaLink — University Portal",
  description:
    "University coordinator dashboard for managing assigned societal challenges, mentor allocation, and solution progress.",
};

export default async function UniversityLayout({ children }: { children: React.ReactNode }) {
  await requirePortalRole(["FACULTY"], "/university");

  return (
    <AuthProvider>
      <ProblemsProvider>
        <UniversityProblemsProvider>
          <div className="flex min-h-screen bg-slate-50">
            <UniversitySidebar />
            <main className="min-w-0 flex-1 lg:ml-72">
              <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
            </main>
            <UniversityBottomNavigation />
          </div>
        </UniversityProblemsProvider>
      </ProblemsProvider>
    </AuthProvider>
  );
}
