"use client"

import type { ReactNode } from "react"

interface CardProps {
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export default function Card({ title, children, footer, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>}
    </div>
  )
}
