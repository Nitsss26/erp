const express = require("express")
const router = express.Router()

const notices = [
  {
    id: "1",
    title: "School Closed",
    content: "School will be closed on 26th January",
    priority: "high",
    date: "2025-01-15",
  },
  {
    id: "2",
    title: "Sports Day",
    content: "Annual sports day on 1st February",
    priority: "medium",
    date: "2025-01-14",
  },
]

router.get("/", (req, res) => {
  res.json({ success: true, data: notices })
})

router.post("/", (req, res) => {
  const newNotice = { id: Date.now().toString(), ...req.body }
  notices.push(newNotice)
  res.json({ success: true, data: newNotice })
})

module.exports = router
