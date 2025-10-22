import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  qualification: string
  experience: number
  joinDate: string
  avatar?: string
}

interface TeacherState {
  teachers: Teacher[]
  selectedTeacher: Teacher | null
  isLoading: boolean
  error: string | null
  totalCount: number
}

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
  isLoading: false,
  error: null,
  totalCount: 0,
}

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    fetchTeachersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchTeachersSuccess: (state, action: PayloadAction<{ teachers: Teacher[]; total: number }>) => {
      state.isLoading = false
      state.teachers = action.payload.teachers
      state.totalCount = action.payload.total
    },
    fetchTeachersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    selectTeacher: (state, action: PayloadAction<Teacher>) => {
      state.selectedTeacher = action.payload
    },
    addTeacher: (state, action: PayloadAction<Teacher>) => {
      state.teachers.push(action.payload)
      state.totalCount += 1
    },
    updateTeacher: (state, action: PayloadAction<Teacher>) => {
      const index = state.teachers.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.teachers[index] = action.payload
      }
    },
    deleteTeacher: (state, action: PayloadAction<string>) => {
      state.teachers = state.teachers.filter((t) => t.id !== action.payload)
      state.totalCount -= 1
    },
  },
})

export const {
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  selectTeacher,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} = teacherSlice.actions
export default teacherSlice.reducer
