"use client"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const attendanceData = [
  { month: "January", present: 18, absent: 2, leave: 0 },
  { month: "February", present: 19, absent: 1, leave: 0 },
  { month: "March", present: 17, absent: 2, leave: 1 },
  { month: "April", present: 20, absent: 0, leave: 0 },
  { month: "May", present: 18, absent: 1, leave: 1 },
]

const monthlyAttendance = [
  { date: "2025-10-01", status: "present" },
  { date: "2025-10-02", status: "present" },
  { date: "2025-10-03", status: "absent" },
  { date: "2025-10-04", status: "present" },
  { date: "2025-10-05", status: "present" },
  { date: "2025-10-06", status: "leave" },
  { date: "2025-10-07", status: "present" },
  { date: "2025-10-08", status: "present" },
]

export default function StudentAttendance() {
  const totalDays = 100
  const presentDays = 90
  const absentDays = 7
  const leaveDays = 3
  const attendancePercentage = (presentDays / totalDays) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4" />
      case "absent":
        return <XCircle className="w-4 h-4" />
      case "leave":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance</h1>
        <p className="text-gray-600">Track your attendance record</p>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm font-medium">Overall Attendance</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{attendancePercentage.toFixed(1)}%</p>
          <p className="text-gray-500 text-sm mt-2">
            {presentDays} out of {totalDays} days
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Present</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{presentDays}</p>
          <p className="text-gray-500 text-sm mt-2">Days present</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium">Absent</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{absentDays}</p>
          <p className="text-gray-500 text-sm mt-2">Days absent</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-medium">Leave</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{leaveDays}</p>
          <p className="text-gray-500 text-sm mt-2">Days on leave</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#FF6B35" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="leave" fill="#FBBF24" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#FF6B35" strokeWidth={2} dot={{ fill: "#FF6B35" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Attendance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">October 2025 Attendance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {monthlyAttendance.map((record, index) => (
            <div key={index} className={`p-4 rounded-lg text-center ${getStatusColor(record.status)}`}>
              <p className="text-xs font-medium mb-2">{record.date.split("-")[2]}</p>
              <div className="flex justify-center">{getStatusIcon(record.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
