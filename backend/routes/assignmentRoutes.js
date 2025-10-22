const express = require("express")
const router = express.Router()

const assignments = [
  { id: "1", title: "Math Assignment 1", subject: "Mathematics", dueDate: "2025-01-20", status: "pending" },
  { id: "2", title: "English Essay", subject: "English", dueDate: "2025-01-22", status: "submitted" },
]

router.get("/", (req, res) => {
  res.json({ success: true, data: assignments })
})

router.post("/", (req, res) => {
  const newAssignment = { id: Date.now().toString(), ...req.body }
  assignments.push(newAssignment)
  res.json({ success: true, data: newAssignment })
})

router.post("/:id/submit", (req, res) => {
  const assignment = assignments.find((a) => a.id === req.params.id)
  if (assignment) {
    assignment.status = "submitted"
    res.json({ success: true, data: assignment })
  }
})

module.exports = router
