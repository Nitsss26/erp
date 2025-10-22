"use client"

import { useState } from "react"
import { Search, Download, TrendingUp } from "lucide-react"

const gradesData = [
  { id: 1, subject: "Mathematics", exam: "Midterm", marks: 92, total: 100, grade: "A+", percentage: 92 },
  { id: 2, subject: "English", exam: "Midterm", marks: 88, total: 100, grade: "A", percentage: 88 },
  { id: 3, subject: "Physics", exam: "Midterm", marks: 85, total: 100, grade: "A", percentage: 85 },
  { id: 4, subject: "Chemistry", exam: "Midterm", marks: 90, total: 100, grade: "A+", percentage: 90 },
  { id: 5, subject: "History", exam: "Midterm", marks: 78, total: 100, grade: "B+", percentage: 78 },
  { id: 6, subject: "Geography", exam: "Midterm", marks: 82, total: 100, grade: "A", percentage: 82 },
]

export default function StudentGrades() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterExam, setFilterExam] = useState("all")

  const filteredGrades = gradesData.filter((grade) => {
    const matchesSearch = grade.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesExam = filterExam === "all" || grade.exam === filterExam
    return matchesSearch && matchesExam
  })

  const averageGrade = (gradesData.reduce((sum, g) => sum + g.percentage, 0) / gradesData.length).toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Grades</h1>
        <p className="text-gray-600">View your academic performance and grades</p>
      </div>

      {/* Average Grade Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Average Grade</p>
            <p className="text-5xl font-bold mt-2">{averageGrade}%</p>
            <p className="text-orange-100 mt-2">Excellent Performance</p>
          </div>
          <TrendingUp className="w-20 h-20 opacity-20" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Exams</option>
            <option value="Midterm">Midterm</option>
            <option value="Final">Final</option>
            <option value="Quiz">Quiz</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Exam</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Marks</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Percentage</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="border-b border-gray-100 hover:bg-orange-50 transition">
                  <td className="py-4 px-6 text-gray-900 font-medium">{grade.subject}</td>
                  <td className="py-4 px-6 text-gray-700">{grade.exam}</td>
                  <td className="py-4 px-6 text-center text-gray-900 font-semibold">
                    {grade.marks}/{grade.total}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${grade.percentage}%` }}></div>
                      </div>
                      <span className="text-gray-900 font-semibold">{grade.percentage}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${grade.grade.startsWith("A") ? "bg-green-100 text-green-800" : grade.grade.startsWith("B") ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {grade.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
