import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolveTogether",
  description: "Crowdsourcing societal challenges and facilitating collaborative problem-solving.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
