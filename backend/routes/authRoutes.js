const express = require("express")
const router = express.Router()

// Mock users database
const users = [
  { id: "1", email: "admin@school.com", password: "admin123", role: "admin", name: "Admin User" },
  { id: "2", email: "teacher@school.com", password: "teacher123", role: "teacher", name: "Teacher User" },
  { id: "3", email: "student@school.com", password: "student123", role: "student", name: "Student User" },
]

router.post("/login", (req, res) => {
  const { email, password } = req.body
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    res.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      token: `token-${user.id}`,
    })
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" })
  }
})

router.post("/logout", (req, res) => {
  res.json({ success: true })
})

module.exports = router
