"use client"

import type React from "react"

import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { useAppSelector } from "@/lib/hooks"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-neutral-light-gray">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} p-6`}>{children}</main>
      </div>
    </div>
  )
}
