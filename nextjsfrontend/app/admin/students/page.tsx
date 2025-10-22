"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchStudentsSuccess, addStudent, updateStudent, deleteStudent } from "@/store/slices/studentSlice"
import { MainLayout } from "@/components/layout/MainLayout"
import { DataTable } from "@/components/common/DataTable"
import { Plus, Edit2, Trash2, X } from "lucide-react"

interface StudentForm {
  id?: string
  name: string
  email: string
  rollNumber: string
  class: string
  section: string
  fatherName: string
  motherName: string
  phone: string
  address: string
  dateOfBirth: string
  admissionDate: string
}

export default function StudentsPage() {
  const dispatch = useAppDispatch()
  const { students } = useAppSelector((state) => state.students)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<StudentForm>({
    name: "",
    email: "",
    rollNumber: "",
    class: "",
    section: "",
    fatherName: "",
    motherName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    admissionDate: "",
  })

  useEffect(() => {
    // Mock data - replace with API call
    dispatch(
      fetchStudentsSuccess({
        students: [
          {
            id: "1",
            name: "Aarav Kumar",
            email: "aarav@school.com",
            rollNumber: "001",
            class: "10",
            section: "A",
            fatherName: "Rajesh Kumar",
            motherName: "Priya Kumar",
            phone: "9876543210",
            address: "123 Main St, City",
            dateOfBirth: "2008-05-15",
            admissionDate: "2020-06-01",
          },
          {
            id: "2",
            name: "Ananya Singh",
            email: "ananya@school.com",
            rollNumber: "002",
            class: "10",
            section: "A",
            fatherName: "Vikram Singh",
            motherName: "Neha Singh",
            phone: "9876543211",
            address: "456 Oak Ave, City",
            dateOfBirth: "2008-07-20",
            admissionDate: "2020-06-01",
          },
        ],
        total: 2,
      }),
    )
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      dispatch(updateStudent({ ...formData, id: editingId } as any))
      setEditingId(null)
    } else {
      dispatch(addStudent({ ...formData, id: Date.now().toString() } as any))
    }
    resetForm()
  }

  const handleEdit = (student: any) => {
    setFormData(student)
    setEditingId(student.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent(id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rollNumber: "",
      class: "",
      section: "",
      fatherName: "",
      motherName: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      admissionDate: "",
    })
    setShowForm(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">Students Management</h1>
            <p className="text-neutral-dark-gray mt-1">Manage all students in the school</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="icici-button-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-primary text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingId ? "Edit Student" : "Add New Student"}</h2>
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
                    <label className="block text-sm font-medium text-neutral-text mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Class</label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Class</option>
                      {[9, 10, 11, 12].map((c) => (
                        <option key={c} value={c}>
                          Class {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select Section</option>
                      {["A", "B", "C", "D"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
                    <label className="block text-sm font-medium text-neutral-text mb-1">Father Name</label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Mother Name</label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">Admission Date</label>
                    <input
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-text mb-1">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="icici-button-primary flex-1">
                    {editingId ? "Update Student" : "Add Student"}
                  </button>
                  <button type="button" onClick={resetForm} className="icici-button-accent flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="icici-card p-6">
          <DataTable
            columns={[
              { key: "rollNumber", label: "Roll No" },
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "class", label: "Class" },
              { key: "section", label: "Section" },
              {
                key: "id",
                label: "Actions",
                render: (id: string) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(students.find((s) => s.id === id))}
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
            data={students}
          />
        </div>
      </div>
    </MainLayout>
  )
}
