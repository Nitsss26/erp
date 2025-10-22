"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const attendanceReportData = [
  { month: "January", attendance: 92, target: 95 },
  { month: "February", attendance: 94, target: 95 },
  { month: "March", attendance: 89, target: 95 },
  { month: "April", attendance: 96, target: 95 },
  { month: "May", attendance: 93, target: 95 },
]

const performanceData = [
  { name: "A+", value: 25, color: "#10B981" },
  { name: "A", value: 35, color: "#3B82F6" },
  { name: "B+", value: 20, color: "#F59E0B" },
  { name: "B", value: 15, color: "#EF4444" },
  { name: "C", value: 5, color: "#8B5CF6" },
]

const feeCollectionData = [
  { month: "January", collected: 450000, pending: 50000 },
  { month: "February", collected: 480000, pending: 20000 },
  { month: "March", collected: 500000, pending: 0 },
  { month: "April", collected: 490000, pending: 10000 },
  { month: "May", collected: 510000, pending: 0 },
]

export default function Reports() {
  const [reportType, setReportType] = useState("attendance")
  const [dateRange, setDateRange] = useState("month")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive school performance reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="attendance">Attendance Report</option>
              <option value="performance">Performance Report</option>
              <option value="finance">Finance Report</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Reports */}
      {reportType === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#FF6B35" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#8B3A3A" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Average Attendance</span>
                <span className="text-2xl font-bold text-green-600">92.8%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Present Days</span>
                <span className="text-2xl font-bold text-blue-600">464</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Absent Days</span>
                <span className="text-2xl font-bold text-red-600">36</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Grade Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Average Score</span>
                <span className="text-2xl font-bold text-orange-600">78.5%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Top Performer</span>
                <span className="text-lg font-semibold text-gray-900">Rahul Kumar (95%)</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Students Improved</span>
                <span className="text-2xl font-bold text-green-600">45</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "finance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Fee Collection</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#EF4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Finance Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Collected</span>
                <span className="text-2xl font-bold text-green-600">₹24,30,000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pending Amount</span>
                <span className="text-2xl font-bold text-orange-600">₹80,000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Collection Rate</span>
                <span className="text-2xl font-bold text-blue-600">96.8%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
