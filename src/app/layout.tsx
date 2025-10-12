import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Configure Outfit font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Resume Matcher",
  description: "Match resumes to job descriptions using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
