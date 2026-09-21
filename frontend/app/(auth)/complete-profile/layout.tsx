import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Complete Profile — SamasyaLink",
  description: "Complete your university or industry profile to get started.",
};

export default function CompleteProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}