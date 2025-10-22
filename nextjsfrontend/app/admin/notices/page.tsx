"use client"

import { useState } from "react"
import { Plus, Trash2, Calendar, User } from "lucide-react"
import Button from "@/components/shared/Button"
import Modal from "@/components/shared/Modal"
import FormInput from "@/components/shared/FormInput"

const noticesData = [
  {
    id: 1,
    title: "Annual Sports Day",
    content: "Annual sports day will be held on November 15, 2025. All students are requested to participate.",
    author: "Principal",
    date: "2025-10-20",
    priority: "high",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    content: "PTM scheduled for October 25, 2025. Parents are requested to attend.",
    author: "Admin",
    date: "2025-10-18",
    priority: "medium",
  },
  {
    id: 3,
    title: "Holiday Announcement",
    content: "School will remain closed on November 1st for Diwali celebration.",
    author: "Principal",
    date: "2025-10-15",
    priority: "high",
  },
]

export default function Notices() {
  const [notices, setNotices] = useState(noticesData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "", priority: "medium" })

  const handleAddNotice = () => {
    if (formData.title && formData.content) {
      setNotices([
        ...notices,
        {
          id: Math.max(...notices.map((n) => n.id), 0) + 1,
          ...formData,
          author: "Admin",
          date: new Date().toISOString().split("T")[0],
        },
      ])
      setFormData({ title: "", content: "", priority: "medium" })
      setIsModalOpen(false)
    }
  }

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter((notice) => notice.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notices & Announcements</h1>
          <p className="text-gray-600">Manage school notices and announcements</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Notice
        </Button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(notice.priority)}`}>
                    {notice.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{notice.content}</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{notice.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{notice.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteNotice(notice.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Notice" size="lg">
        <div className="space-y-4">
          <FormInput
            label="Notice Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter notice title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter notice content"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <Button onClick={handleAddNotice} className="flex-1">
              Post Notice
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
