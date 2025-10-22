# School ERP System - Complete Documentation

## Overview
A professional, full-stack school management system built with Next.js, Redux, and Axios. Features three complete portals for Admin, Teachers, and Students with comprehensive management capabilities.

## Project Structure

\`\`\`
├── app/
│   ├── admin/              # Admin Portal
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── attendance/
│   │   ├── academics/
│   │   ├── finance/
│   │   ├── inventory/
│   │   ├── notices/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── login/
│   ├── teacher/            # Teacher Portal
│   │   ├── dashboard/
│   │   ├── classes/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   ├── grades/
│   │   └── login/
│   ├── student/            # Student Portal
│   │   ├── dashboard/
│   │   ├── grades/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   └── login/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── shared/             # Reusable Components
│   │   ├── StatCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── Modal.tsx
│   │   ├── FormInput.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Card.tsx
│   └── layout/
│       └── MainLayout.tsx
├── store/                  # Redux Store
│   ├── store.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── studentSlice.ts
│       ├── teacherSlice.ts
│       ├── classSlice.ts
│       ├── attendanceSlice.ts
│       ├── dashboardSlice.ts
│       └── uiSlice.ts
├── hooks/
│   └── useApi.ts           # Custom API Hooks
├── lib/
│   ├── api.ts              # Axios Configuration & API Service
│   └── constants.ts        # Constants & Configuration
└── scripts/                # Backend Scripts (if needed)
\`\`\`

## Features

### Admin Portal
- Dashboard with KPIs and analytics
- Student Management (CRUD)
- Teacher Management (CRUD)
- Class Management
- Attendance Tracking with charts
- Academic Management (Grades, Courses)
- Finance Management (Fee tracking, payments)
- Inventory Management with low-stock alerts
- Notices & Announcements
- Reports & Analytics
- School Settings

### Teacher Portal
- Class Management
- Assignment Creation & Tracking
- Attendance Monitoring with analytics
- Grade Management
- Student Performance Analytics

### Student Portal
- Personal Dashboard with GPA
- Grades Tracking with analytics
- Assignment Submission & Status
- Attendance Records with trends

## Demo Credentials

\`\`\`
Admin:
Email: admin@school.com
Password: admin123

Teacher:
Email: teacher@school.com
Password: teacher123

Student:
Email: student@school.com
Password: student123
\`\`\`

## Color Scheme (ICICI Bank Theme)

- **Primary**: #FF6B35 (Orange)
- **Secondary**: #8B3A3A (Burgundy)
- **Accent**: #FFB84D (Light Orange)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the application.

### 4. Backend Integration
Update the API endpoints in `lib/api.ts` to connect to your backend:

\`\`\`typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
\`\`\`

## API Integration

The system uses Axios with automatic token management. All API calls are centralized in `lib/api.ts`:

\`\`\`typescript
// Example: Fetch students
const response = await apiService.students.list()

// Example: Create student
const newStudent = await apiService.students.create(studentData)

// Example: Update student
await apiService.students.update(studentId, updatedData)

// Example: Delete student
await apiService.students.delete(studentId)
\`\`\`

## Custom Hooks

Use the provided hooks for data fetching:

\`\`\`typescript
import { useStudents, useTeachers, useAttendance, useGrades } from "@/hooks/useApi"

// In your component
const { students, loading, error, fetchStudents, createStudent } = useStudents()
\`\`\`

## Redux State Management

Redux slices are organized by feature:

\`\`\`typescript
import { useDispatch, useSelector } from "react-redux"
import { setUser, logout } from "@/store/slices/authSlice"

// In your component
const dispatch = useDispatch()
const user = useSelector(state => state.auth.user)
\`\`\`

## Shared Components

### StatCard
\`\`\`tsx
<StatCard 
  title="Students" 
  value="250" 
  icon={<Users />} 
  color="orange"
  trend={{ value: 5, isPositive: true }}
/>
\`\`\`

### DataTable
\`\`\`tsx
<DataTable
  columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" }
  ]}
  data={data}
  searchable={true}
  searchFields={["name", "email"]}
/>
\`\`\`

### Modal
\`\`\`tsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose} 
  title="Add Student"
>
  {/* Modal content */}
</Modal>
\`\`\`

## Responsive Design

The system is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Optimizations

- Redux for efficient state management
- Axios interceptors for automatic token refresh
- Pagination in data tables
- Lazy loading of components
- Optimized images and assets

## Troubleshooting

### API Connection Issues
- Ensure backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS settings on backend

### Authentication Issues
- Clear browser localStorage
- Check demo credentials
- Verify token storage in localStorage

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check globals.css for theme variables
- Verify color classes are applied correctly

## Future Enhancements

- SMS notifications integration
- Email notifications
- Advanced reporting with PDF export
- Mobile app version
- Real-time notifications with WebSockets
- Multi-language support
- Dark mode theme

## Support

For issues or questions, please refer to the inline code comments and component documentation.

---

**Built with**: Next.js 15, React 19, TypeScript, Redux Toolkit, Tailwind CSS v4, Recharts
