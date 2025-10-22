"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("10-A")
  const [selectedMonth, setSelectedMonth] = useState("January")

  const attendanceStats = [
    { name: "Week 1", present: 42, absent: 3 },
    { name: "Week 2", present: 44, absent: 1 },
    { name: "Week 3", present: 43, absent: 2 },
    { name: "Week 4", present: 45, absent: 0 },
  ]

  const studentAttendance = [
    { name: "Aarav Kumar", present: 18, absent: 2, percentage: 90 },
    { name: "Ananya Singh", present: 19, absent: 1, percentage: 95 },
    { name: "Raj Patel", present: 17, absent: 3, percentage: 85 },
    { name: "Priya Sharma", present: 20, absent: 0, percentage: 100 },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Attendance Tracking</h1>
          <p className="text-neutral-dark-gray mt-1">View and analyze class attendance</p>
        </div>

        {/* Filters */}
        <div className="icici-card p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {["10-A", "10-B", "9-A"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {["January", "February", "March", "April", "May", "June"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="icici-card p-6">
          <h3 className="text-lg font-bold text-neutral-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            Weekly Attendance - {selectedMonth}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
              <XAxis stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip />
              <Bar dataKey="present" fill="#FF6B35" />
              <Bar dataKey="absent" fill="#8B3A3A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Attendance Table */}
        <div className="icici-card p-6">
          <h3 className="text-lg font-bold text-neutral-text mb-4">Student Attendance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-medium-gray bg-neutral-light-gray">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Present</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Absent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendance.map((student, idx) => (
                  <tr key={idx} className="border-b border-neutral-medium-gray hover:bg-neutral-light-gray">
                    <td className="px-6 py-4 text-sm text-neutral-text">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-text">{student.present}</td>
                    <td className="px-6 py-4 text-sm text-neutral-text">{student.absent}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-medium-gray rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${student.percentage}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-neutral-text">{student.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
