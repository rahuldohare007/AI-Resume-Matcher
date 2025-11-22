// // import type { Metadata } from "next";
// // import { Outfit } from "next/font/google";
// // import "./globals.css";
// // import { Navigation } from "@/components/layout/Navigation";
// // import { Toaster } from "react-hot-toast";

// // // ✅ Load Outfit font (preferred)
// // const outfit = Outfit({
// //   subsets: ["latin"],
// //   weight: ["300", "400", "500", "600", "700"],
// //   display: "swap",
// // });

// // // ✅ Page metadata
// // export const metadata: Metadata = {
// //   title: "AI Resume Matcher",
// //   description: "Intelligent resume and job description matching using AI",
// // };

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en">
// //       {/* ✅ Apply Outfit font globally */}
// //       <body className={`${outfit.className} bg-gray-50`}>
// //         <Navigation />
// //         <main className="min-h-screen">
// //           {children}
// //         </main>
// //         <Toaster position="top-right" />
// //       </body>
// //     </html>
// //   );
// // }

// import type { Metadata } from "next";
// import { Outfit } from "next/font/google";
// import "./globals.css";
// import { Providers } from "./providers";
// import { Navigation } from "@/components/layout/Navigation";
// import { Footer } from "@/components/layout/Footer";
// import { Toaster } from "react-hot-toast";

// const outfit = Outfit({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "AI Resume Matcher",
//   description: "Intelligent resume and job description matching using AI",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${outfit.className} min-h-screen flex flex-col`}>
        
//         {/* Must wrap EVERYTHING */}
//         <Providers>
//           <Navigation />
//           <main className="flex-1">{children}</main>
//           <Footer />
//           <Toaster position="top-right" />
//         </Providers>

//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/core/ToastProvider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Resume Matcher",
  description: "Intelligent resume and job description matching using AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${outfit.className} min-h-screen flex flex-col`}> */}
        <body className={`${outfit.className} min-h-screen flex flex-col bg-gradient-to-br from-[hsl(var(--background))] via-white to-zinc-50 dark:via-transparent dark:to-transparent`}>
        <Providers>
          <Navigation />
          <ToastProvider />
          <main className="flex-1 pt-6 md:pt-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}