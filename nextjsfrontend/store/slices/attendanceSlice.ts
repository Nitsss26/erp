import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: "present" | "absent" | "leave"
  remarks?: string
}

interface AttendanceState {
  records: AttendanceRecord[]
  isLoading: boolean
  error: string | null
}

const initialState: AttendanceState = {
  records: [],
  isLoading: false,
  error: null,
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchAttendanceSuccess: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.isLoading = false
      state.records = action.payload
    },
    fetchAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    markAttendance: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.records[index] = action.payload
      } else {
        state.records.push(action.payload)
      }
    },
  },
})

export const { fetchAttendanceStart, fetchAttendanceSuccess, fetchAttendanceFailure, markAttendance } =
  attendanceSlice.actions
export default attendanceSlice.reducer
