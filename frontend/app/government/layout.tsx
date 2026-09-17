import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import GovernmentSidebar from "@/components/government/GovernmentSidebar";
import GovernmentBottomNavigation from "@/components/government/GovernmentBottomNavigation";
import { requirePortalRole } from "@/lib/requirePortalRole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SolveTogether — Government Portal",
  description:
    "Government-governed regional platform for verification, monitoring, and impact oversight of societal problem-solving projects.",
};

export default async function GovernmentLayout({ children }: { children: React.ReactNode }) {
  await requirePortalRole(["GOVERNMENT_OFFICER", "ADMIN"], "/government");

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50">
        <GovernmentSidebar />
        <main className="min-w-0 flex-1 lg:ml-72">
          <div className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
        </main>
        <GovernmentBottomNavigation />
      </div>
    </AuthProvider>
  );
}
