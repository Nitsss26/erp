"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchClassesSuccess } from "@/store/slices/classSlice"
import { MainLayout } from "@/components/layout/MainLayout"
import { Users, BookOpen } from "lucide-react"

export default function ClassesPage() {
  const dispatch = useAppDispatch()
  const { classes } = useAppSelector((state) => state.classes)

  useEffect(() => {
    dispatch(
      fetchClassesSuccess([
        { id: "1", name: "Class 10-A", section: "A", teacherId: "1", studentCount: 45, capacity: 50 },
        { id: "2", name: "Class 10-B", section: "B", teacherId: "2", studentCount: 42, capacity: 50 },
        { id: "3", name: "Class 9-A", section: "A", teacherId: "1", studentCount: 48, capacity: 50 },
      ]),
    )
  }, [dispatch])

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Classes Management</h1>
          <p className="text-neutral-dark-gray mt-1">View all classes and their details</p>
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="icici-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-text">{cls.name}</h3>
                  <p className="text-sm text-neutral-dark-gray">Section {cls.section}</p>
                </div>
                <div className="bg-primary text-white p-3 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-dark-gray flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Students
                  </span>
                  <span className="font-semibold text-neutral-text">
                    {cls.studentCount}/{cls.capacity}
                  </span>
                </div>
                <div className="w-full bg-neutral-medium-gray rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(cls.studentCount / cls.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <button className="w-full mt-4 icici-button-accent text-sm">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
