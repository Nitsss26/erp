import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: "primary" | "secondary" | "accent"
  trend?: { value: number; isPositive: boolean }
}

export function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-neutral-text",
  }

  return (
    <div className="icici-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-dark-gray text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-neutral-text mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-4 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}
