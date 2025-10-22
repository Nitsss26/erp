# School ERP Backend

Professional backend API for School ERP System built with Express.js

## Features

- Student Management
- Teacher Management
- Class Management
- Attendance Tracking
- Grade Management
- Assignment Management
- Finance Management
- Inventory Management
- Notices & Calendar

## Installation

\`\`\`bash
cd backend
npm install
\`\`\`

## Running the Server

\`\`\`bash
npm start        # Production
npm run dev      # Development with nodemon
\`\`\`

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Students
- GET `/api/students` - List all students
- POST `/api/students` - Create student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Teachers
- GET `/api/teachers` - List all teachers
- POST `/api/teachers` - Create teacher
- PUT `/api/teachers/:id` - Update teacher
- DELETE `/api/teachers/:id` - Delete teacher

### Classes
- GET `/api/classes` - List all classes
- POST `/api/classes` - Create class
- PUT `/api/classes/:id` - Update class

### Attendance
- GET `/api/attendance` - List attendance
- POST `/api/attendance` - Mark attendance
- GET `/api/attendance/student/:studentId` - Get student attendance

### Grades
- GET `/api/grades` - List grades
- POST `/api/grades` - Add grade
- GET `/api/grades/student/:studentId` - Get student grades

### Assignments
- GET `/api/assignments` - List assignments
- POST `/api/assignments` - Create assignment
- POST `/api/assignments/:id/submit` - Submit assignment

### Finance
- GET `/api/finance/fees` - List fees
- POST `/api/finance/payments` - Record payment

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics

### Inventory
- GET `/api/inventory` - List inventory
- POST `/api/inventory` - Add item

### Notices
- GET `/api/notices` - List notices
- POST `/api/notices` - Create notice

### Calendar
- GET `/api/calendar` - List events
\`\`\`

```tsx file="" isHidden
