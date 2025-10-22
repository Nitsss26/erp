import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Class {
  id: string
  name: string
  section: string
  teacherId: string
  studentCount: number
  capacity: number
}

interface ClassState {
  classes: Class[]
  selectedClass: Class | null
  isLoading: boolean
  error: string | null
}

const initialState: ClassState = {
  classes: [],
  selectedClass: null,
  isLoading: false,
  error: null,
}

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    fetchClassesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchClassesSuccess: (state, action: PayloadAction<Class[]>) => {
      state.isLoading = false
      state.classes = action.payload
    },
    fetchClassesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    selectClass: (state, action: PayloadAction<Class>) => {
      state.selectedClass = action.payload
    },
  },
})

export const { fetchClassesStart, fetchClassesSuccess, fetchClassesFailure, selectClass } = classSlice.actions
export default classSlice.reducer
