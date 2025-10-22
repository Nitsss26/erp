"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { StatCard } from "@/components/common/StatCard"
import { DataTable } from "@/components/common/DataTable"
import { Users, BookOpen, Calendar, CheckCircle } from "lucide-react"

export default function TeacherDashboard() {
  const classes = [
    { id: "1", name: "Class 10-A", students: 45, subject: "Mathematics" },
    { id: "2", name: "Class 10-B", students: 42, subject: "Mathematics" },
    { id: "3", name: "Class 9-A", students: 48, subject: "Mathematics" },
  ]

  const recentAssignments = [
    { id: "1", title: "Algebra Chapter 5", class: "Class 10-A", dueDate: "2024-01-15", submissions: 42 },
    { id: "2", title: "Geometry Problems", class: "Class 10-B", dueDate: "2024-01-16", submissions: 38 },
    { id: "3", title: "Trigonometry Quiz", class: "Class 9-A", dueDate: "2024-01-17", submissions: 45 },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Teacher Dashboard</h1>
          <p className="text-neutral-dark-gray mt-1">Manage your classes and assignments</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Classes" value="3" icon={<BookOpen className="w-6 h-6" />} color="primary" />
          <StatCard title="Total Students" value="135" icon={<Users className="w-6 h-6" />} color="secondary" />
          <StatCard title="Assignments" value="12" icon={<Calendar className="w-6 h-6" />} color="accent" />
          <StatCard title="Attendance Rate" value="94%" icon={<CheckCircle className="w-6 h-6" />} color="primary" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">My Classes</h3>
            <DataTable
              columns={[
                { key: "name", label: "Class Name" },
                { key: "students", label: "Students" },
                { key: "subject", label: "Subject" },
              ]}
              data={classes}
              searchable={false}
              paginated={false}
            />
          </div>

          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">Recent Assignments</h3>
            <DataTable
              columns={[
                { key: "title", label: "Title" },
                { key: "class", label: "Class" },
                { key: "submissions", label: "Submissions" },
              ]}
              data={recentAssignments}
              searchable={false}
              paginated={false}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
