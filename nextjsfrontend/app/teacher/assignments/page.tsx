"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { DataTable } from "@/components/common/DataTable"
import { Plus, X } from "lucide-react"

interface Assignment {
  id: string
  title: string
  class: string
  subject: string
  dueDate: string
  description: string
  submissions: number
  totalStudents: number
}

export default function AssignmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Algebra Chapter 5 Problems",
      class: "10-A",
      subject: "Mathematics",
      dueDate: "2024-01-15",
      description: "Solve all problems from page 45-50",
      submissions: 42,
      totalStudents: 45,
    },
    {
      id: "2",
      title: "Geometry Project",
      class: "10-B",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      description: "Create a 3D model of geometric shapes",
      submissions: 38,
      totalStudents: 42,
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    class: "10-A",
    subject: "Mathematics",
    dueDate: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAssignments([
      ...assignments,
      {
        id: Date.now().toString(),
        ...formData,
        submissions: 0,
        totalStudents: 45,
      },
    ])
    setFormData({ title: "", class: "10-A", subject: "Mathematics", dueDate: "", description: "" })
    setShowForm(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">Assignments</h1>
            <p className="text-neutral-dark-gray mt-1">Create and manage assignments for your classes</p>
          </div>
          <button onClick={() => setShowForm(true)} className="icici-button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="bg-secondary text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Create New Assignment</h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary-burgundy-light rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-text mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Class</label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
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
                    <label className="block text-sm font-medium text-neutral-text mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-text mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="icici-button-secondary flex-1">
                    Create Assignment
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="icici-button-accent flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignments Table */}
        <div className="icici-card p-6">
          <DataTable
            columns={[
              { key: "title", label: "Title" },
              { key: "class", label: "Class" },
              { key: "subject", label: "Subject" },
              { key: "dueDate", label: "Due Date" },
              {
                key: "submissions",
                label: "Submissions",
                render: (val, row) => `${val}/${row.totalStudents}`,
              },
            ]}
            data={assignments}
          />
        </div>
      </div>
    </MainLayout>
  )
}
