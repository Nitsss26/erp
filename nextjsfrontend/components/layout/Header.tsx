"use client"

import { Menu, LogOut, User, Bell } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout } from "@/store/slices/authSlice"
import { toggleSidebar } from "@/store/slices/uiSlice"

export function Header() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="icici-header sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-primary-orange-dark rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">School ERP</h1>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-primary-orange-dark rounded-lg transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-primary-orange-light">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs opacity-75 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-neutral-text" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-primary-orange-dark rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
