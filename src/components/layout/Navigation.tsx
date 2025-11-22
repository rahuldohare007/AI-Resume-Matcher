// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Brain, Upload, Briefcase, BarChart3 } from "lucide-react"
// import { cn } from "@/lib/utils"

// const navItems = [
//   {
//     title: "Upload Resume",
//     href: "/upload",
//     icon: Upload,
//   },
//   {
//     title: "Job Descriptions",
//     href: "/jobs",
//     icon: Briefcase,
//   },
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: BarChart3,
//   },
// ]

// export function Navigation() {
//   const pathname = usePathname()

//   return (
//     <nav className="bg-white border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 font-bold text-xl">
//             <Brain className="w-8 h-8 text-blue-600" />
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               AI Resume Matcher
//             </span>
//           </Link>

//           {/* Nav Links */}
//           <div className="flex items-center gap-1">
//             {navItems.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
//                     isActive
//                       ? "bg-blue-50 text-blue-600 font-medium"
//                       : "text-gray-600 hover:bg-gray-100"
//                   )}
//                 >
//                   <Icon className="w-4 h-4" />
//                   {item.title}
//                 </Link>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Brain, Upload, Briefcase, BarChart3, Sparkles } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/theme/ThemeToggle";

// const navItems = [
//   { title: "Upload Resume", href: "/upload", icon: Upload },
//   { title: "Job Descriptions", href: "/jobs", icon: Briefcase },
//   { title: "Dashboard", href: "/dashboard", icon: BarChart3 },
// ];

// export function Navigation() {
//   const pathname = usePathname();
//   const isHome = pathname === "/";

//   return (
//     <nav className="bg-white/80 dark:bg-black/60 backdrop-blur border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link href="/" className="flex items-center gap-2 font-bold text-xl">
//             <Brain className="w-7 h-7 text-blue-600 dark:text-blue-500" />
//             <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//               AI Resume Matcher
//             </span>
//           </Link>

//           <div className="flex items-center gap-2">
//             {isHome ? (
//               <Link href="/upload">
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
//                 >
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   Get Started
//                 </Button>
//               </Link>
//             ) : (
//               <>
//                 {navItems.map((item) => {
//                   const Icon = item.icon;
//                   const isActive = pathname === item.href;
//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={cn(
//                         "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors",
//                         isActive
//                           ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                           : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//                       )}
//                     >
//                       <Icon className="w-4 h-4" />
//                       <span className="hidden sm:inline">{item.title}</span>
//                     </Link>
//                   );
//                 })}
//               </>
//             )}
//             <ThemeToggle />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Upload, Briefcase, BarChart3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { title: "Upload Resume", href: "/upload", icon: Upload },
  { title: "Job Descriptions", href: "/jobs", icon: Briefcase },
  { title: "Dashboard", href: "/dashboard", icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo – Premium Indigo (No Gradient Bullshit) */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-indigo-600 dark:text-indigo-400">
              AI Resume Matcher
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isHome ? (
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            ) : (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium transition-all duration-200",
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  );
                })}
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}