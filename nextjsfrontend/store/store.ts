import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import studentReducer from "./slices/studentSlice"
import teacherReducer from "./slices/teacherSlice"
import classReducer from "./slices/classSlice"
import attendanceReducer from "./slices/attendanceSlice"
import dashboardReducer from "./slices/dashboardSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    classes: classReducer,
    attendance: attendanceReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
