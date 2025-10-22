const express = require("express")
const router = express.Router()

const grades = [
  { id: "1", studentId: "1", subject: "Mathematics", marks: 85, grade: "A" },
  { id: "2", studentId: "1", subject: "English", marks: 78, grade: "B+" },
  { id: "3", studentId: "2", subject: "Mathematics", marks: 92, grade: "A+" },
]

router.get("/", (req, res) => {
  res.json({ success: true, data: grades })
})

router.post("/", (req, res) => {
  const newGrade = { id: Date.now().toString(), ...req.body }
  grades.push(newGrade)
  res.json({ success: true, data: newGrade })
})

router.get("/student/:studentId", (req, res) => {
  const studentGrades = grades.filter((g) => g.studentId === req.params.studentId)
  res.json({ success: true, data: studentGrades })
})

module.exports = router
