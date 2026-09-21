import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { MentorProvider } from "@/context/MentorContext";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import MentorBottomNavigation from "@/components/mentor/MentorBottomNavigation";
import { requirePortalRole } from "@/lib/requirePortalRole";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SamasyaLink — Mentor Portal",
  description:
    "Mentor portal for managing assigned challenges, student teams, industry collaboration, and university progress updates.",
};

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  await requirePortalRole(["MENTOR"], "/mentor");

  return (
    <AuthProvider>
      <MentorProvider>
        <div className="flex min-h-screen bg-slate-50">
          <MentorSidebar />
          <main className="flex-1 lg:ml-72 min-w-0">
            <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
          </main>
          <MentorBottomNavigation />
        </div>
      </MentorProvider>
    </AuthProvider>
  );
}
