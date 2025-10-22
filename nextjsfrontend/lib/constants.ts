// Color Palette - ICICI Bank Theme
export const COLORS = {
  primary: "#FF6B35", // Orange
  secondary: "#8B3A3A", // Burgundy
  accent: "#FFB84D", // Light Orange
  success: "#10B981", // Green
  warning: "#F59E0B", // Amber
  danger: "#EF4444", // Red
  info: "#3B82F6", // Blue
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
}

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
}

// Demo Credentials
export const DEMO_CREDENTIALS = {
  admin: { email: "admin@school.com", password: "admin123" },
  teacher: { email: "teacher@school.com", password: "teacher123" },
  student: { email: "student@school.com", password: "student123" },
}

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
  },
  students: {
    list: "/api/students",
    create: "/api/students",
    update: "/api/students/:id",
    delete: "/api/students/:id",
  },
  teachers: {
    list: "/api/teachers",
    create: "/api/teachers",
    update: "/api/teachers/:id",
    delete: "/api/teachers/:id",
  },
  classes: {
    list: "/api/classes",
    create: "/api/classes",
    update: "/api/classes/:id",
    delete: "/api/classes/:id",
  },
  attendance: {
    list: "/api/attendance",
    create: "/api/attendance",
    update: "/api/attendance/:id",
  },
  grades: {
    list: "/api/grades",
    create: "/api/grades",
    update: "/api/grades/:id",
  },
}
