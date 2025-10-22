"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import Button from "@/components/shared/Button"
import FormInput from "@/components/shared/FormInput"

export default function Settings() {
  const [settings, setSettings] = useState({
    schoolName: "New School",
    schoolEmail: "info@newschool.com",
    schoolPhone: "+91-9876543210",
    schoolAddress: "123 Education Street, City",
    academicYear: "2025-2026",
    sessionStart: "2025-04-01",
    sessionEnd: "2026-03-31",
    workingDays: 240,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage school settings and configuration</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">School Information</h2>
          <div className="space-y-4">
            <FormInput
              label="School Name"
              value={settings.schoolName}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
            />
            <FormInput
              label="Email"
              type="email"
              value={settings.schoolEmail}
              onChange={(e) => setSettings({ ...settings, schoolEmail: e.target.value })}
            />
            <FormInput
              label="Phone"
              value={settings.schoolPhone}
              onChange={(e) => setSettings({ ...settings, schoolPhone: e.target.value })}
            />
            <FormInput
              label="Address"
              value={settings.schoolAddress}
              onChange={(e) => setSettings({ ...settings, schoolAddress: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Year</h2>
          <div className="space-y-4">
            <FormInput
              label="Academic Year"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
            />
            <FormInput
              label="Session Start Date"
              type="date"
              value={settings.sessionStart}
              onChange={(e) => setSettings({ ...settings, sessionStart: e.target.value })}
            />
            <FormInput
              label="Session End Date"
              type="date"
              value={settings.sessionEnd}
              onChange={(e) => setSettings({ ...settings, sessionEnd: e.target.value })}
            />
            <FormInput
              label="Working Days"
              type="number"
              value={settings.workingDays}
              onChange={(e) => setSettings({ ...settings, workingDays: Number.parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
