import type { Metadata } from "next";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentBottomNavigation from "@/components/student/StudentBottomNavigation";
import { StudentProvider } from "@/context/StudentContext";

export const metadata: Metadata = {
  title: "SolveTogether — Student Portal",
  description: "Student portal for collaborating on societal challenges.",
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <div className="flex min-h-screen bg-slate-50">
        <StudentSidebar />
        <main className="flex-1 lg:ml-72 min-w-0">
          <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">{children}</div>
        </main>
        <StudentBottomNavigation />
      </div>
    </StudentProvider>
  );
}

