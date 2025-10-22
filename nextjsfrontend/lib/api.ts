import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)

export const apiService = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => api.post("/auth/login", { email, password }),
    logout: () => api.post("/auth/logout"),
    register: (data: any) => api.post("/auth/register", data),
  },

  // Students endpoints
  students: {
    list: (params?: any) => api.get("/students", { params }),
    create: (data: any) => api.post("/students", data),
    update: (id: string, data: any) => api.put(`/students/${id}`, data),
    delete: (id: string) => api.delete(`/students/${id}`),
    getById: (id: string) => api.get(`/students/${id}`),
  },

  // Teachers endpoints
  teachers: {
    list: (params?: any) => api.get("/teachers", { params }),
    create: (data: any) => api.post("/teachers", data),
    update: (id: string, data: any) => api.put(`/teachers/${id}`, data),
    delete: (id: string) => api.delete(`/teachers/${id}`),
    getById: (id: string) => api.get(`/teachers/${id}`),
  },

  // Classes endpoints
  classes: {
    list: (params?: any) => api.get("/classes", { params }),
    create: (data: any) => api.post("/classes", data),
    update: (id: string, data: any) => api.put(`/classes/${id}`, data),
    delete: (id: string) => api.delete(`/classes/${id}`),
    getById: (id: string) => api.get(`/classes/${id}`),
  },

  // Attendance endpoints
  attendance: {
    list: (params?: any) => api.get("/attendance", { params }),
    create: (data: any) => api.post("/attendance", data),
    update: (id: string, data: any) => api.put(`/attendance/${id}`, data),
    getByStudent: (studentId: string) => api.get(`/attendance/student/${studentId}`),
  },

  // Grades endpoints
  grades: {
    list: (params?: any) => api.get("/grades", { params }),
    create: (data: any) => api.post("/grades", data),
    update: (id: string, data: any) => api.put(`/grades/${id}`, data),
    getByStudent: (studentId: string) => api.get(`/grades/student/${studentId}`),
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => api.get("/dashboard/stats"),
    getCharts: () => api.get("/dashboard/charts"),
  },

  // Assignments endpoints
  assignments: {
    list: (params?: any) => api.get("/assignments", { params }),
    create: (data: any) => api.post("/assignments", data),
    update: (id: string, data: any) => api.put(`/assignments/${id}`, data),
    submit: (id: string, data: any) => api.post(`/assignments/${id}/submit`, data),
  },

  // Finance endpoints
  finance: {
    getFees: (params?: any) => api.get("/finance/fees", { params }),
    getPayments: (params?: any) => api.get("/finance/payments", { params }),
    recordPayment: (data: any) => api.post("/finance/payments", data),
  },
}

export default api
