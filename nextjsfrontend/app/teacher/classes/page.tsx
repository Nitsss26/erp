"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { useAppSelector } from "@/lib/hooks"
import { Users, BookOpen, Calendar } from "lucide-react"

export default function TeacherClassesPage() {
  const { classes } = useAppSelector((state) => state.classes)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">My Classes</h1>
          <p className="text-neutral-dark-gray mt-1">Manage your assigned classes</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="icici-card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-text">{cls.name}</h3>
                  <p className="text-sm text-neutral-dark-gray">Section {cls.section}</p>
                </div>
                <div className="bg-secondary text-white p-3 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-dark-gray flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Students
                  </span>
                  <span className="font-semibold text-neutral-text">{cls.studentCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-dark-gray flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Capacity
                  </span>
                  <span className="font-semibold text-neutral-text">{cls.capacity}</span>
                </div>

                <div className="pt-4 border-t border-neutral-medium-gray space-y-2">
                  <button className="w-full icici-button-primary text-sm">View Students</button>
                  <button className="w-full icici-button-accent text-sm">Mark Attendance</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
