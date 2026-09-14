import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ProblemsProvider } from "@/context/ProblemsContext";

export const metadata: Metadata = {
  title: "SolveTogether — Citizen Portal",
  description: "Report societal problems and collaborate with universities and industries to find solutions.",
};

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProblemsProvider>
        {children}
      </ProblemsProvider>
    </AuthProvider>
  );
}