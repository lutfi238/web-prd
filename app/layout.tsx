import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PRD Generator Personal",
  description: "Generator PRD pribadi dengan wizard multi-step dan multi-provider AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={cn(sans.variable, mono.variable, "font-sans")}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
