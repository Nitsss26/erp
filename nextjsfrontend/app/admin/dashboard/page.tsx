"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchStatsSuccess } from "@/store/slices/dashboardSlice"
import { MainLayout } from "@/components/layout/MainLayout"
import { StatCard } from "@/components/common/StatCard"
import { Users, BookOpen, Calendar, DollarSign, AlertCircle } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { stats } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    // Mock data - replace with actual API call
    dispatch(
      fetchStatsSuccess({
        totalStudents: 1250,
        totalTeachers: 85,
        totalClasses: 45,
        presentToday: 1180,
        absentToday: 70,
        pendingFees: 125000,
        totalRevenue: 2500000,
      }),
    )
  }, [dispatch])

  const attendanceData = [
    { name: "Mon", present: 1180, absent: 70 },
    { name: "Tue", present: 1190, absent: 60 },
    { name: "Wed", present: 1175, absent: 75 },
    { name: "Thu", present: 1200, absent: 50 },
    { name: "Fri", present: 1185, absent: 65 },
  ]

  const revenueData = [
    { name: "Jan", revenue: 180000 },
    { name: "Feb", revenue: 220000 },
    { name: "Mar", revenue: 250000 },
    { name: "Apr", revenue: 210000 },
    { name: "May", revenue: 290000 },
    { name: "Jun", revenue: 300000 },
  ]

  const feeStatusData = [
    { name: "Paid", value: 1125, fill: "#FF6B35" },
    { name: "Pending", value: 125, fill: "#FFB84D" },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Dashboard</h1>
          <p className="text-neutral-dark-gray mt-1">Welcome back! Here's your school overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<Users className="w-6 h-6" />}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Teachers"
            value={stats?.totalTeachers || 0}
            icon={<BookOpen className="w-6 h-6" />}
            color="secondary"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Total Classes"
            value={stats?.totalClasses || 0}
            icon={<Calendar className="w-6 h-6" />}
            color="accent"
            trend={{ value: 2, isPositive: false }}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0) / 100000}L`}
            icon={<DollarSign className="w-6 h-6" />}
            color="primary"
            trend={{ value: 18, isPositive: true }}
          />
        </div>

        {/* Attendance & Revenue Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">Weekly Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                <XAxis stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#FF6B35" strokeWidth={2} />
                <Line type="monotone" dataKey="absent" stroke="#8B3A3A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                <XAxis stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#FF6B35" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Status & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Fee Status */}
          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">Fee Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="icici-card p-6">
              <h3 className="text-lg font-bold text-neutral-text mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="icici-button-primary">Add Student</button>
                <button className="icici-button-secondary">Add Teacher</button>
                <button className="icici-button-accent">Mark Attendance</button>
                <button className="icici-button-primary">Generate Report</button>
              </div>
            </div>

            {/* Alerts */}
            <div className="icici-card p-6">
              <h3 className="text-lg font-bold text-neutral-text mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Alerts
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-sm font-semibold text-red-700">125 pending fee payments</p>
                  <p className="text-xs text-red-600">Total: ₹1,25,000</p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-sm font-semibold text-yellow-700">5 teachers absent today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
