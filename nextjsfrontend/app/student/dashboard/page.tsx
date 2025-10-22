"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { StatCard } from "@/components/common/StatCard"
import { DataTable } from "@/components/common/DataTable"
import { BookOpen, TrendingUp, Calendar, Award } from "lucide-react"

export default function StudentDashboard() {
  const grades = [
    { id: "1", subject: "Mathematics", marks: 92, grade: "A+" },
    { id: "2", subject: "English", marks: 88, grade: "A" },
    { id: "3", subject: "Science", marks: 85, grade: "A" },
    { id: "4", subject: "Social Studies", marks: 90, grade: "A+" },
  ]

  const assignments = [
    { id: "1", title: "Algebra Chapter 5", subject: "Mathematics", dueDate: "2024-01-15", status: "Submitted" },
    { id: "2", title: "Essay on Democracy", subject: "Social Studies", dueDate: "2024-01-16", status: "Pending" },
    { id: "3", title: "Science Project", subject: "Science", dueDate: "2024-01-20", status: "In Progress" },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">My Dashboard</h1>
          <p className="text-neutral-dark-gray mt-1">Class 10-A | Roll No: 15</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="GPA" value="3.8" icon={<Award className="w-6 h-6" />} color="primary" />
          <StatCard title="Attendance" value="94%" icon={<Calendar className="w-6 h-6" />} color="secondary" />
          <StatCard title="Assignments" value="8/12" icon={<BookOpen className="w-6 h-6" />} color="accent" />
          <StatCard title="Rank" value="5th" icon={<TrendingUp className="w-6 h-6" />} color="primary" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">My Grades</h3>
            <DataTable
              columns={[
                { key: "subject", label: "Subject" },
                { key: "marks", label: "Marks" },
                { key: "grade", label: "Grade" },
              ]}
              data={grades}
              searchable={false}
              paginated={false}
            />
          </div>

          <div className="icici-card p-6">
            <h3 className="text-lg font-bold text-neutral-text mb-4">My Assignments</h3>
            <DataTable
              columns={[
                { key: "title", label: "Title" },
                { key: "subject", label: "Subject" },
                { key: "status", label: "Status" },
              ]}
              data={assignments}
              searchable={false}
              paginated={false}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
