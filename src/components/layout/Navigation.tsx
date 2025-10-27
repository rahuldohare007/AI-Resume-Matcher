"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Upload, Briefcase, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Upload Resume",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Job Descriptions",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Resume Matcher
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}