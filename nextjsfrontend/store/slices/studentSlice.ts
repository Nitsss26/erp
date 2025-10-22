import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Student {
  id: string
  name: string
  email: string
  rollNumber: string
  class: string
  section: string
  fatherName: string
  motherName: string
  phone: string
  address: string
  dateOfBirth: string
  admissionDate: string
  avatar?: string
}

interface StudentState {
  students: Student[]
  selectedStudent: Student | null
  isLoading: boolean
  error: string | null
  totalCount: number
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  isLoading: false,
  error: null,
  totalCount: 0,
}

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    fetchStudentsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchStudentsSuccess: (state, action: PayloadAction<{ students: Student[]; total: number }>) => {
      state.isLoading = false
      state.students = action.payload.students
      state.totalCount = action.payload.total
    },
    fetchStudentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    selectStudent: (state, action: PayloadAction<Student>) => {
      state.selectedStudent = action.payload
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload)
      state.totalCount += 1
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) {
        state.students[index] = action.payload
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((s) => s.id !== action.payload)
      state.totalCount -= 1
    },
  },
})

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  selectStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = studentSlice.actions
export default studentSlice.reducer
