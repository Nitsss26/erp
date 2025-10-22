"use client"

import { useState } from "react"
import { Search, Upload, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"

const assignmentsData = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Calculus Problem Set",
    description: "Solve 50 problems on derivatives and integrals",
    dueDate: "2025-10-25",
    submittedDate: null,
    status: "pending",
    marks: null,
    totalMarks: 50,
  },
  {
    id: 2,
    subject: "English",
    title: "Essay on Shakespeare",
    description: "Write a 2000-word essay analyzing Hamlet",
    dueDate: "2025-10-28",
    submittedDate: null,
    status: "pending",
    marks: null,
    totalMarks: 100,
  },
  {
    id: 3,
    subject: "Physics",
    title: "Lab Report",
    description: "Document the pendulum experiment",
    dueDate: "2025-10-30",
    submittedDate: "2025-10-29",
    status: "submitted",
    marks: 45,
    totalMarks: 50,
  },
  {
    id: 4,
    subject: "Chemistry",
    title: "Reaction Mechanism",
    description: "Explain organic reaction mechanisms",
    dueDate: "2025-11-02",
    submittedDate: "2025-10-31",
    status: "graded",
    marks: 48,
    totalMarks: 50,
  },
]

export default function StudentAssignments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedAssignment, setSelectedAssignment] = useState<(typeof assignmentsData)[0] | null>(null)

  const filteredAssignments = assignmentsData.filter((assignment) => {
    const matchesSearch =
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "graded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "submitted":
        return <Upload className="w-4 h-4" />
      case "graded":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Assignments</h1>
        <p className="text-gray-600">Track and submit your assignments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
            onClick={() => setSelectedAssignment(assignment)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">{assignment.subject}</p>
                  <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                </div>
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}
                >
                  {getStatusIcon(assignment.status)}
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{assignment.description}</p>

              <div className="flex items-center gap-2 text-gray-700 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>Due: {assignment.dueDate}</span>
              </div>

              {assignment.status === "graded" && (
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">Marks Obtained</p>
                  <p className="text-2xl font-bold text-green-600">
                    {assignment.marks}/{assignment.totalMarks}
                  </p>
                </div>
              )}

              <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
                {assignment.status === "pending" ? "Submit Assignment" : "View Details"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">{selectedAssignment.subject}</p>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                </div>
                <button onClick={() => setSelectedAssignment(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <p className="text-gray-700 mb-6">{selectedAssignment.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAssignment.dueDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Marks</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAssignment.totalMarks}</p>
                </div>
              </div>

              {selectedAssignment.status === "pending" && (
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center mb-6">
                  <Upload className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <p className="text-gray-700 font-medium">Click to upload your assignment</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
              )}

              <div className="flex gap-4">
                <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
                  {selectedAssignment.status === "pending" ? "Submit" : "Download"}
                </button>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
