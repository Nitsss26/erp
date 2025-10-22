const express = require("express")
const router = express.Router()

const events = [
  { id: "1", title: "Annual Exam", date: "2025-02-01", type: "exam" },
  { id: "2", title: "Sports Day", date: "2025-02-15", type: "event" },
]

router.get("/", (req, res) => {
  res.json({ success: true, data: events })
})

module.exports = router
