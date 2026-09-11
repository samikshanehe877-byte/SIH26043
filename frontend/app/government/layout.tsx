import type { Metadata } from "next";
import GovernmentSidebar from "@/components/government/GovernmentSidebar";
import GovernmentBottomNavigation from "@/components/government/GovernmentBottomNavigation";

export const metadata: Metadata = {
  title: "SolveTogether — Government Portal",
  description:
    "Government-governed regional platform for verification, monitoring, and impact oversight of societal problem-solving projects.",
};

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <GovernmentSidebar />
      <main className="flex-1 lg:ml-72">
        <div className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
      </main>
      <GovernmentBottomNavigation />
    </div>
  );
}