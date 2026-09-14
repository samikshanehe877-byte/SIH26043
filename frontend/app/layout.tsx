import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StudentProvider } from "@/context/StudentContext";
import { MentorProvider } from "@/context/MentorContext";
import { IndustryProvider } from "@/context/IndustryContext";
import { ProblemsProvider } from "@/context/ProblemsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolveTogether",
  description: "Crowdsourcing societal challenges and facilitating collaborative problem-solving.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <StudentProvider>
            <MentorProvider>
              <IndustryProvider>
                <ProblemsProvider>
                  {children}
                </ProblemsProvider>
              </IndustryProvider>
            </MentorProvider>
          </StudentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}