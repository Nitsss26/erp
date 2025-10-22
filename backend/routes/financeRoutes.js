const express = require("express")
const router = express.Router()

const fees = [
  { id: "1", studentId: "1", amount: 50000, status: "paid", dueDate: "2025-01-15" },
  { id: "2", studentId: "2", amount: 50000, status: "pending", dueDate: "2025-01-15" },
]

router.get("/fees", (req, res) => {
  res.json({ success: true, data: fees })
})

router.post("/payments", (req, res) => {
  const payment = { id: Date.now().toString(), ...req.body, status: "completed" }
  res.json({ success: true, data: payment })
})

module.exports = router
