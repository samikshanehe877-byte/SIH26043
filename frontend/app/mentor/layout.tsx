import type { Metadata } from "next";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import MentorBottomNavigation from "@/components/mentor/MentorBottomNavigation";
import { MentorProvider } from "@/context/MentorContext";

export const metadata: Metadata = {
  title: "SolveTogether — Mentor Portal",
  description:
    "Mentor portal for managing assigned challenges, student teams, industry collaboration, and university progress updates.",
};

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <MentorProvider>
      <div className="flex min-h-screen bg-slate-50">
        <MentorSidebar />
        <main className="flex-1 lg:ml-72 min-w-0">
          <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
        </main>
        <MentorBottomNavigation />
      </div>
    </MentorProvider>
  );
}

