"use client"

import { useState, useCallback } from "react"
import { apiService } from "@/lib/api"

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useApi(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const execute = useCallback(
    async (apiCall: Promise<any>) => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiCall
        setData(response.data)
        options.onSuccess?.(response.data)
        return response.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred"
        setError(errorMessage)
        options.onError?.(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [options],
  )

  return { execute, loading, error, data }
}

export function useStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      const response = await apiService.students.list(params)
      setStudents(response.data)
      return response.data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createStudent = useCallback(
    async (data: any) => {
      try {
        const response = await apiService.students.create(data)
        setStudents([...students, response.data])
        return response.data
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [students],
  )

  const updateStudent = useCallback(
    async (id: string, data: any) => {
      try {
        const response = await apiService.students.update(id, data)
        setStudents(students.map((s) => (s.id === id ? response.data : s)))
        return response.data
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [students],
  )

  const deleteStudent = useCallback(
    async (id: string) => {
      try {
        await apiService.students.delete(id)
        setStudents(students.filter((s) => s.id !== id))
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [students],
  )

  return { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent }
}

export function useTeachers() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeachers = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      const response = await apiService.teachers.list(params)
      setTeachers(response.data)
      return response.data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTeacher = useCallback(
    async (data: any) => {
      try {
        const response = await apiService.teachers.create(data)
        setTeachers([...teachers, response.data])
        return response.data
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [teachers],
  )

  const updateTeacher = useCallback(
    async (id: string, data: any) => {
      try {
        const response = await apiService.teachers.update(id, data)
        setTeachers(teachers.map((t) => (t.id === id ? response.data : t)))
        return response.data
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [teachers],
  )

  const deleteTeacher = useCallback(
    async (id: string) => {
      try {
        await apiService.teachers.delete(id)
        setTeachers(teachers.filter((t) => t.id !== id))
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [teachers],
  )

  return { teachers, loading, error, fetchTeachers, createTeacher, updateTeacher, deleteTeacher }
}

export function useAttendance() {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendance = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      const response = await apiService.attendance.list(params)
      setAttendance(response.data)
      return response.data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const recordAttendance = useCallback(
    async (data: any) => {
      try {
        const response = await apiService.attendance.create(data)
        setAttendance([...attendance, response.data])
        return response.data
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [attendance],
  )

  return { attendance, loading, error, fetchAttendance, recordAttendance }
}

export function useGrades() {
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGrades = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      const response = await apiService.grades.list(params)
      setGrades(response.data)
      return response.data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const recordGrade = useCallback(
    async (data: any) => {
      try {
        const response = await apiService.grades.create(data)
        setGrades([...grades, response.data])
        return response.data
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    [grades],
  )

  return { grades, loading, error, fetchGrades, recordGrade }
}
