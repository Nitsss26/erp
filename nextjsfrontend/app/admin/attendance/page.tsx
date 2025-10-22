"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchAttendanceSuccess, markAttendance } from "@/store/slices/attendanceSlice"
import { MainLayout } from "@/components/layout/MainLayout"
import { Calendar, Save } from "lucide-react"

export default function AttendancePage() {
  const dispatch = useAppDispatch()
  const { records } = useAppSelector((state) => state.attendance)
  const { students } = useAppSelector((state) => state.students)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedClass, setSelectedClass] = useState("10")
  const [selectedSection, setSelectedSection] = useState("A")
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "leave">>({})

  useEffect(() => {
    // Mock data
    dispatch(
      fetchAttendanceSuccess([
        { id: "1", studentId: "1", date: selectedDate, status: "present" },
        { id: "2", studentId: "2", date: selectedDate, status: "present" },
      ]),
    )
  }, [dispatch, selectedDate])

  const filteredStudents = students.filter((s) => s.class === selectedClass && s.section === selectedSection)

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleSave = () => {
    Object.entries(attendance).forEach(([studentId, status]) => {
      dispatch(
        markAttendance({
          id: Date.now().toString(),
          studentId,
          date: selectedDate,
          status,
        }),
      )
    })
    alert("Attendance saved successfully!")
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Mark Attendance</h1>
          <p className="text-neutral-dark-gray mt-1">Record daily attendance for students</p>
        </div>

        {/* Filters */}
        <div className="icici-card p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-neutral-dark-gray" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[9, 10, 11, 12].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {["A", "B", "C", "D"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSave}
                className="icici-button-primary w-full flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="icici-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-medium-gray bg-neutral-light-gray">
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Roll No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Present</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Absent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">Leave</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-neutral-medium-gray hover:bg-neutral-light-gray">
                  <td className="px-6 py-4 text-sm text-neutral-text">{student.rollNumber}</td>
                  <td className="px-6 py-4 text-sm text-neutral-text">{student.name}</td>
                  <td className="px-6 py-4">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      value="present"
                      checked={attendance[student.id] === "present"}
                      onChange={() => handleAttendanceChange(student.id, "present")}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      value="absent"
                      checked={attendance[student.id] === "absent"}
                      onChange={() => handleAttendanceChange(student.id, "absent")}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      value="leave"
                      checked={attendance[student.id] === "leave"}
                      onChange={() => handleAttendanceChange(student.id, "leave")}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}
