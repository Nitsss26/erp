"use client"

import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: "orange" | "green" | "blue" | "red" | "purple"
  trend?: {
    value: number
    isPositive: boolean
  }
}

const colorClasses = {
  orange: "border-orange-500 bg-orange-50",
  green: "border-green-500 bg-green-50",
  blue: "border-blue-500 bg-blue-50",
  red: "border-red-500 bg-red-50",
  purple: "border-purple-500 bg-purple-50",
}

const iconColorClasses = {
  orange: "text-orange-600",
  green: "text-green-600",
  blue: "text-blue-600",
  red: "text-red-600",
  purple: "text-purple-600",
}

export default function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <div className={`rounded-lg shadow-md p-6 border-l-4 ${colorClasses[color]} bg-white`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`${iconColorClasses[color]} opacity-20`}>{icon}</div>
      </div>
    </div>
  )
}
