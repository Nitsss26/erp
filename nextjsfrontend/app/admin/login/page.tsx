"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { loginSuccess } from "@/store/slices/authSlice"
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Mock login - replace with actual API call
      if (email && password) {
        const mockUser = {
          id: "1",
          email,
          name: "Admin User",
          role: "admin" as const,
        }
        dispatch(loginSuccess({ user: mockUser, token: "mock-token-admin" }))
        router.push("/admin/dashboard")
      } else {
        setError("Please enter email and password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-orange-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">School ERP</h1>
          <p className="text-primary-orange-light mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-dark-gray" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.com"
                  className="w-full pl-10 pr-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-dark-gray" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-dark-gray"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-medium-gray" />
                <span className="text-sm text-neutral-dark-gray">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={isLoading} className="w-full icici-button-primary mt-6 disabled:opacity-50">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-neutral-light-gray rounded-lg">
            <p className="text-xs font-semibold text-neutral-text mb-2">Demo Credentials:</p>
            <p className="text-xs text-neutral-dark-gray">Email: admin@school.com</p>
            <p className="text-xs text-neutral-dark-gray">Password: admin123</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            Not an admin?{" "}
            <Link href="/" className="text-accent hover:underline font-semibold">
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
