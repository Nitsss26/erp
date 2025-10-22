"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { DataTable } from "@/components/common/DataTable"
import { Plus, X } from "lucide-react"

interface Grade {
  id: string
  studentName: string
  subject: string
  marks: number
  grade: string
  examType: string
}

export default function TeacherGradesPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState("10-A")
  const [grades, setGrades] = useState<Grade[]>([
    { id: "1", studentName: "Aarav Kumar", subject: "Mathematics", marks: 92, grade: "A+", examType: "Mid Term" },
    { id: "2", studentName: "Ananya Singh", subject: "Mathematics", marks: 88, grade: "A", examType: "Mid Term" },
    { id: "3", studentName: "Raj Patel", subject: "Mathematics", marks: 85, grade: "A", examType: "Mid Term" },
  ])

  const [formData, setFormData] = useState({
    studentName: "",
    subject: "Mathematics",
    marks: 0,
    examType: "Mid Term",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const grade = formData.marks >= 90 ? "A+" : formData.marks >= 80 ? "A" : formData.marks >= 70 ? "B" : "C"
    setGrades([
      ...grades,
      {
        id: Date.now().toString(),
        ...formData,
        grade,
      },
    ])
    setFormData({ studentName: "", subject: "Mathematics", marks: 0, examType: "Mid Term" })
    setShowForm(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">Grade Management</h1>
            <p className="text-neutral-dark-gray mt-1">Manage student grades and marks</p>
          </div>
          <button onClick={() => setShowForm(true)} className="icici-button-secondary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Grade
          </button>
        </div>

        {/* Class Filter */}
        <div className="icici-card p-6">
          <label className="block text-sm font-medium text-neutral-text mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {["10-A", "10-B", "9-A"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="bg-secondary text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Grade</h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary-burgundy-light rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Student Name</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {["Mathematics", "English", "Science"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Marks (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number.parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {["Mid Term", "Final", "Quiz", "Assignment"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="icici-button-secondary flex-1">
                    Add Grade
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="icici-button-accent flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grades Table */}
        <div className="icici-card p-6">
          <DataTable
            columns={[
              { key: "studentName", label: "Student" },
              { key: "subject", label: "Subject" },
              { key: "marks", label: "Marks" },
              { key: "grade", label: "Grade" },
              { key: "examType", label: "Exam Type" },
            ]}
            data={grades}
          />
        </div>
      </div>
    </MainLayout>
  )
}
