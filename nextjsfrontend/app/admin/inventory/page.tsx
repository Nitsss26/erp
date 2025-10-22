"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import Modal from "@/components/shared/Modal"
import Button from "@/components/shared/Button"
import FormInput from "@/components/shared/FormInput"

const inventoryData = [
  {
    id: 1,
    name: "Notebooks",
    category: "Stationery",
    quantity: 500,
    minStock: 100,
    price: 50,
    supplier: "ABC Supplies",
  },
  { id: 2, name: "Pens", category: "Stationery", quantity: 1200, minStock: 200, price: 10, supplier: "XYZ Corp" },
  {
    id: 3,
    name: "Projectors",
    category: "Equipment",
    quantity: 15,
    minStock: 5,
    price: 25000,
    supplier: "Tech Solutions",
  },
  {
    id: 4,
    name: "Chairs",
    category: "Furniture",
    quantity: 200,
    minStock: 50,
    price: 2000,
    supplier: "Furniture Plus",
  },
  { id: 5, name: "Desks", category: "Furniture", quantity: 150, minStock: 40, price: 5000, supplier: "Furniture Plus" },
]

export default function Inventory() {
  const [items, setItems] = useState(inventoryData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<(typeof inventoryData)[0] | null>(null)
  const [formData, setFormData] = useState({ name: "", category: "", quantity: 0, minStock: 0, price: 0, supplier: "" })

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({ name: "", category: "", quantity: 0, minStock: 0, price: 0, supplier: "" })
    setIsModalOpen(true)
  }

  const handleEditItem = (item: (typeof inventoryData)[0]) => {
    setEditingItem(item)
    setFormData(item)
    setIsModalOpen(true)
  }

  const handleSaveItem = () => {
    if (editingItem) {
      setItems(items.map((item) => (item.id === editingItem.id ? { ...formData, id: item.id } : item)))
    } else {
      setItems([...items, { ...formData, id: Math.max(...items.map((i) => i.id), 0) + 1 }])
    }
    setIsModalOpen(false)
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage school inventory and supplies</p>
        </div>
        <Button onClick={handleAddItem} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">{lowStockItems.length} item(s) below minimum stock level</p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Item Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Quantity</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Min Stock</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Supplier</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-orange-50 transition">
                  <td className="py-4 px-6 text-gray-900 font-medium">{item.name}</td>
                  <td className="py-4 px-6 text-gray-700">{item.category}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.quantity <= item.minStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">{item.minStock}</td>
                  <td className="py-4 px-6 text-right text-gray-900 font-semibold">₹{item.price}</td>
                  <td className="py-4 px-6 text-gray-700">{item.supplier}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Item" : "Add New Item"}
      >
        <div className="space-y-4">
          <FormInput
            label="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter item name"
          />
          <FormInput
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Stationery, Equipment"
          />
          <FormInput
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
            placeholder="Enter quantity"
          />
          <FormInput
            label="Minimum Stock Level"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: Number.parseInt(e.target.value) })}
            placeholder="Enter minimum stock"
          />
          <FormInput
            label="Price per Unit"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) })}
            placeholder="Enter price"
          />
          <FormInput
            label="Supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Enter supplier name"
          />
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSaveItem} className="flex-1">
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
