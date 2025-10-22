const express = require("express")
const router = express.Router()

const inventory = [
  { id: "1", name: "Notebooks", quantity: 500, minStock: 100, supplier: "ABC Supplies" },
  { id: "2", name: "Pens", quantity: 1000, minStock: 200, supplier: "XYZ Traders" },
]

router.get("/", (req, res) => {
  res.json({ success: true, data: inventory })
})

router.post("/", (req, res) => {
  const newItem = { id: Date.now().toString(), ...req.body }
  inventory.push(newItem)
  res.json({ success: true, data: newItem })
})

module.exports = router
