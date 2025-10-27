import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "react-hot-toast";

// ✅ Load Outfit font (preferred)
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ✅ Page metadata
export const metadata: Metadata = {
  title: "AI Resume Matcher",
  description: "Intelligent resume and job description matching using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ✅ Apply Outfit font globally */}
      <body className={`${outfit.className} bg-gray-50`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
