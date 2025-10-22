"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchTeachersSuccess, addTeacher, updateTeacher, deleteTeacher } from "@/store/slices/teacherSlice"
import { MainLayout } from "@/components/layout/MainLayout"
import { DataTable } from "@/components/common/DataTable"
import { Plus, Edit2, Trash2, X } from "lucide-react"

interface TeacherForm {
  id?: string
  name: string
  email: string
  phone: string
  subject: string
  qualification: string
  experience: number
  joinDate: string
}

export default function TeachersPage() {
  const dispatch = useAppDispatch()
  const { teachers } = useAppSelector((state) => state.teachers)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TeacherForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: 0,
    joinDate: "",
  })

  useEffect(() => {
    dispatch(
      fetchTeachersSuccess({
        teachers: [
          {
            id: "1",
            name: "Dr. Rajesh Sharma",
            email: "rajesh@school.com",
            phone: "9876543210",
            subject: "Mathematics",
            qualification: "M.Sc, B.Ed",
            experience: 15,
            joinDate: "2010-06-01",
          },
          {
            id: "2",
            name: "Ms. Priya Verma",
            email: "priya@school.com",
            phone: "9876543211",
            subject: "English",
            qualification: "M.A, B.Ed",
            experience: 10,
            joinDate: "2015-06-01",
          },
        ],
        total: 2,
      }),
    )
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      dispatch(updateTeacher({ ...formData, id: editingId } as any))
      setEditingId(null)
    } else {
      dispatch(addTeacher({ ...formData, id: Date.now().toString() } as any))
    }
    resetForm()
  }

  const handleEdit = (teacher: any) => {
    setFormData(teacher)
    setEditingId(teacher.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      dispatch(deleteTeacher(id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      qualification: "",
      experience: 0,
      joinDate: "",
    })
    setShowForm(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">Teachers Management</h1>
            <p className="text-neutral-dark-gray mt-1">Manage all teachers in the school</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="icici-button-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Teacher
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="bg-primary text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingId ? "Edit Teacher" : "Add New Teacher"}</h2>
                <button onClick={resetForm} className="p-1 hover:bg-primary-orange-dark rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                      {["Mathematics", "English", "Science", "Social Studies", "Hindi", "Physical Education"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., M.Sc, B.Ed"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: Number.parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-text mb-1">Join Date</label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="icici-button-primary flex-1">
                    {editingId ? "Update Teacher" : "Add Teacher"}
                  </button>
                  <button type="button" onClick={resetForm} className="icici-button-accent flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teachers Table */}
        <div className="icici-card p-6">
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "subject", label: "Subject" },
              { key: "qualification", label: "Qualification" },
              { key: "experience", label: "Experience (Yrs)" },
              {
                key: "id",
                label: "Actions",
                render: (id: string) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(teachers.find((t) => t.id === id))}
                      className="p-2 text-primary hover:bg-neutral-light-gray rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={teachers}
          />
        </div>
      </div>
    </MainLayout>
  )
}
