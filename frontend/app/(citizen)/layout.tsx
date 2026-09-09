import type { Metadata } from "next";
import { ProblemsProvider } from "@/context/ProblemsContext";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";

export const metadata: Metadata = {
  title: "SolveTogether — Citizen Portal",
  description: "Report societal problems and collaborate with universities and industries to find solutions.",
};

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProblemsProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 lg:ml-72">
          <div className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </ProblemsProvider>
  );
}
