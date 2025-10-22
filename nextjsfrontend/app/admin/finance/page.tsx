"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { StatCard } from "@/components/common/StatCard"
import { DataTable } from "@/components/common/DataTable"
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function FinancePage() {
  const feeData = [
    { id: "1", studentName: "Aarav Kumar", class: "10-A", amount: 50000, status: "Paid", dueDate: "2024-01-15" },
    { id: "2", studentName: "Ananya Singh", class: "10-A", amount: 50000, status: "Pending", dueDate: "2024-01-15" },
    { id: "3", studentName: "Raj Patel", class: "10-B", amount: 50000, status: "Paid", dueDate: "2024-01-15" },
  ]

  const monthlyRevenue = [
    { month: "Jan", revenue: 2500000 },
    { month: "Feb", revenue: 2450000 },
    { month: "Mar", revenue: 2600000 },
    { month: "Apr", revenue: 2550000 },
    { month: "May", revenue: 2700000 },
    { month: "Jun", revenue: 2750000 },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Finance Management</h1>
          <p className="text-neutral-dark-gray mt-1">Track fees and financial records</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="₹25L"
            icon={<DollarSign className="w-6 h-6" />}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pending Fees"
            value="₹1.25L"
            icon={<AlertCircle className="w-6 h-6" />}
            color="secondary"
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Collected This Month"
            value="₹2.75L"
            icon={<CheckCircle className="w-6 h-6" />}
            color="accent"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard title="Collection Rate" value="95%" icon={<TrendingUp className="w-6 h-6" />} color="primary" />
        </div>

        {/* Revenue Chart */}
        <div className="icici-card p-6">
          <h3 className="text-lg font-bold text-neutral-text mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
              <XAxis stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection Table */}
        <div className="icici-card p-6">
          <h3 className="text-lg font-bold text-neutral-text mb-4">Fee Collection Status</h3>
          <DataTable
            columns={[
              { key: "studentName", label: "Student" },
              { key: "class", label: "Class" },
              { key: "amount", label: "Amount", render: (val) => `₹${val}` },
              {
                key: "status",
                label: "Status",
                render: (val) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      val === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {val}
                  </span>
                ),
              },
            ]}
            data={feeData}
          />
        </div>
      </div>
    </MainLayout>
  )
}
