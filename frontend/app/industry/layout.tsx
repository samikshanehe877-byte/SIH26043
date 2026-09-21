import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ProblemsProvider } from "@/context/ProblemsContext";
import { IndustryProvider } from "@/context/IndustryContext";
import { IndustryProblemsProvider } from "@/context/IndustryProblemsContext";
import IndustrySidebar from "@/components/industry/IndustrySidebar";
import IndustryBottomNavigation from "@/components/industry/IndustryBottomNavigation";
import { requirePortalRole } from "@/lib/requirePortalRole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SamasyaLink — Industry Portal",
  description: "Industry portal for collaborating on societal challenges.",
};

export default async function IndustryLayout({ children }: { children: React.ReactNode }) {
  await requirePortalRole(["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"], "/industry");

  return (
    <AuthProvider>
      <IndustryProvider>
        <ProblemsProvider>
          <IndustryProblemsProvider>
            <div className="flex min-h-screen bg-slate-50">
              <IndustrySidebar />
              <main className="flex-1 lg:ml-72 min-w-0">
                <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
              </main>
              <IndustryBottomNavigation />
            </div>
          </IndustryProblemsProvider>
        </ProblemsProvider>
      </IndustryProvider>
    </AuthProvider>
  );
}
