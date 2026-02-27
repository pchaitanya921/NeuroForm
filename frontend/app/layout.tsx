import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroForm",
  description:
    "AI-native form and survey platform that auto-creates adaptive questions and converts responses into actionable business intelligence.",
  keywords: ["AI forms", "survey platform", "adaptive forms", "business intelligence", "AI insights"],
  openGraph: {
    title: "NeuroForm",
    description: "Forms that think, adapt, and decide for you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}


