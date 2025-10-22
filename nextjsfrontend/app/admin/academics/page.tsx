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

export default function AcademicsPage() {
  const [showForm, setShowForm] = useState(false)
  const [grades, setGrades] = useState<Grade[]>([
    { id: "1", studentName: "Aarav Kumar", subject: "Mathematics", marks: 92, grade: "A+", examType: "Mid Term" },
    { id: "2", studentName: "Ananya Singh", subject: "English", marks: 88, grade: "A", examType: "Mid Term" },
    { id: "3", studentName: "Aarav Kumar", subject: "Science", marks: 85, grade: "A", examType: "Mid Term" },
  ])

  const [formData, setFormData] = useState({
    studentName: "",
    subject: "",
    marks: 0,
    examType: "Mid Term",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const grade = Math.round(formData.marks / 10) >= 9 ? "A+" : Math.round(formData.marks / 10) >= 8 ? "A" : "B"
    setGrades([
      ...grades,
      {
        id: Date.now().toString(),
        ...formData,
        grade,
      },
    ])
    setFormData({ studentName: "", subject: "", marks: 0, examType: "Mid Term" })
    setShowForm(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">Academics Management</h1>
            <p className="text-neutral-dark-gray mt-1">Manage grades and academic records</p>
          </div>
          <button onClick={() => setShowForm(true)} className="icici-button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Grade
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="bg-primary text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Grade</h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-primary-orange-dark rounded">
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
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Subject</option>
                    {["Mathematics", "English", "Science", "Social Studies"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Marks</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number.parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-1">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Mid Term">Mid Term</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="icici-button-primary flex-1">
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
