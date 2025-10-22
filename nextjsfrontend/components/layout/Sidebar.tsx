"use client"

import type React from "react"

import { useAppSelector } from "@/lib/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  DollarSign,
  MessageSquare,
  Package,
  ImageIcon,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["admin", "teacher", "student"],
  },
  { label: "Students", href: "/admin/students", icon: <Users className="w-5 h-5" />, roles: ["admin", "teacher"] },
  { label: "Teachers", href: "/admin/teachers", icon: <BookOpen className="w-5 h-5" />, roles: ["admin"] },
  { label: "Classes", href: "/admin/classes", icon: <Calendar className="w-5 h-5" />, roles: ["admin", "teacher"] },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: <FileText className="w-5 h-5" />,
    roles: ["admin", "teacher", "student"],
  },
  {
    label: "Academics",
    href: "/admin/academics",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["admin", "teacher", "student"],
  },
  { label: "Finance", href: "/admin/finance", icon: <DollarSign className="w-5 h-5" />, roles: ["admin"] },
  {
    label: "Notices",
    href: "/admin/notices",
    icon: <MessageSquare className="w-5 h-5" />,
    roles: ["admin", "teacher", "student"],
  },
  { label: "Inventory", href: "/admin/inventory", icon: <Package className="w-5 h-5" />, roles: ["admin"] },
  { label: "Gallery", href: "/admin/gallery", icon: <ImageIcon className="w-5 h-5" />, roles: ["admin"] },
  { label: "Reports", href: "/admin/reports", icon: <FileText className="w-5 h-5" />, roles: ["admin", "teacher"] },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" />, roles: ["admin"] },
]

export function Sidebar() {
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const pathname = usePathname()

  const filteredItems = navItems.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <aside
      className={`icici-sidebar fixed left-0 top-16 h-[calc(100vh-64px)] transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} overflow-y-auto`}
    >
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive ? "bg-primary text-white" : "text-neutral-text hover:bg-neutral-light-gray"
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
