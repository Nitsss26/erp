"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface Column {
  key: string
  label: string
  render?: (value: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  searchable?: boolean
  paginated?: boolean
  itemsPerPage?: number
}

export function DataTable({
  columns,
  data,
  onRowClick,
  searchable = true,
  paginated = true,
  itemsPerPage = 10,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = data.filter((row) =>
    columns.some((col) => String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-dark-gray" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      <div className="icici-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-medium-gray bg-neutral-light-gray">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-neutral-text">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className="border-b border-neutral-medium-gray hover:bg-neutral-light-gray transition-colors cursor-pointer"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-neutral-text">
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-dark-gray">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-neutral-medium-gray rounded-lg hover:bg-neutral-light-gray disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-neutral-medium-gray rounded-lg hover:bg-neutral-light-gray disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
