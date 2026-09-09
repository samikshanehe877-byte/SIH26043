import type { Metadata } from "next";
import UniversitySidebar from "@/components/university/UniversitySidebar";
import UniversityBottomNavigation from "@/components/university/UniversityBottomNavigation";

export const metadata: Metadata = {
  title: "SolveTogether — University Portal",
  description:
    "University coordinator dashboard for managing assigned societal challenges, mentor allocation, and solution progress.",
};

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <UniversitySidebar />
      <main className="flex-1 lg:ml-72">
        <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
      </main>
      <UniversityBottomNavigation />
    </div>
  );
}
