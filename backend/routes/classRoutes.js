const express = require("express")
const router = express.Router()

const classes = [
  { id: "1", name: "10A", teacher: "Mr. Smith", students: 45, room: "101" },
  { id: "2", name: "10B", teacher: "Ms. Johnson", students: 42, room: "102" },
]

router.get("/", (req, res) => {
  res.json({ success: true, data: classes })
})

router.post("/", (req, res) => {
  const newClass = { id: Date.now().toString(), ...req.body }
  classes.push(newClass)
  res.json({ success: true, data: newClass })
})

router.put("/:id", (req, res) => {
  const index = classes.findIndex((c) => c.id === req.params.id)
  if (index !== -1) {
    classes[index] = { ...classes[index], ...req.body }
    res.json({ success: true, data: classes[index] })
  }
})

module.exports = router
