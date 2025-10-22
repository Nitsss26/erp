"use client"

import type React from "react"

import { MainLayout } from "@/components/layout/MainLayout"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface GalleryImage {
  id: string
  title: string
  description: string
  date: string
  category: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: "1",
      title: "Annual Sports Day",
      description: "Students participating in various sports events",
      date: "2025-01-15",
      category: "Events",
    },
    {
      id: "2",
      title: "Science Fair",
      description: "Students showcasing their science projects",
      date: "2025-01-10",
      category: "Academic",
    },
    {
      id: "3",
      title: "Cultural Program",
      description: "Annual cultural program celebration",
      date: "2025-01-05",
      category: "Events",
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", category: "Events" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setImages([...images, { id: Date.now().toString(), ...formData, date: new Date().toISOString().split("T")[0] }])
    setFormData({ title: "", description: "", category: "Events" })
    setShowForm(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">School Gallery</h1>
            <p className="text-neutral-dark-gray mt-1">Manage school photos and memories</p>
          </div>
          <button onClick={() => setShowForm(true)} className="icici-button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Upload Photo
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="bg-primary text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Upload Photo</h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-primary-orange-dark rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Photo Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Events">Events</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                </select>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="icici-button-primary flex-1">
                    Upload
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="icici-button-accent flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="icici-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-primary to-primary-orange-dark h-48 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm opacity-75">{img.category}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-neutral-text mb-1">{img.title}</h3>
                <p className="text-sm text-neutral-dark-gray mb-3">{img.description}</p>
                <p className="text-xs text-neutral-dark-gray">{img.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
