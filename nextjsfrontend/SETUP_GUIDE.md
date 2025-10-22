# School ERP System - Complete Setup Guide

## 📦 Project Structure

\`\`\`
school-erp/
├── app/                          # Frontend (Next.js)
│   ├── admin/                    # Admin Portal
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── attendance/
│   │   ├── academics/
│   │   ├── finance/
│   │   ├── inventory/
│   │   ├── gallery/
│   │   ├── notices/
│   │   └── settings/
│   ├── teacher/                  # Teacher Portal
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── classes/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   └── grades/
│   ├── student/                  # Student Portal
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── grades/
│   │   ├── assignments/
│   │   └── attendance/
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/                   # React Components
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── common/
│       ├── StatCard.tsx
│       ├── DataTable.tsx
│       └── Modal.tsx
├── store/                        # Redux Store
│   ├── store.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── studentSlice.ts
│       ├── teacherSlice.ts
│       ├── classSlice.ts
│       ├── attendanceSlice.ts
│       ├── dashboardSlice.ts
│       └── uiSlice.ts
├── lib/                          # Utilities
│   ├── api.ts                    # Axios API client
│   └── constants.ts
├── hooks/                        # Custom Hooks
│   └── useApi.ts
├── backend/                      # Backend (Express.js)
│   ├── server.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── classRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── gradeRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── financeRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── noticeRoutes.js
│   │   └── calendarRoutes.js
│   ├── controllers/              # 28+ Controllers
│   ├── models/                   # 35+ Data Models
│   └── middlewares/              # Authentication & Validation
├── public/                       # Static Assets
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
\`\`\`

## 🚀 Quick Start

### Frontend Setup
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
\`\`\`

### Backend Setup
\`\`\`bash
cd backend

# Install dependencies
npm install

# Run backend server
npm start

# Backend runs on http://localhost:5000
\`\`\`

## 🔐 Demo Credentials

### Admin Portal
- **URL**: http://localhost:3000/admin/login
- **Email**: admin@school.com
- **Password**: admin123

### Teacher Portal
- **URL**: http://localhost:3000/teacher/login
- **Email**: teacher@school.com
- **Password**: teacher123

### Student Portal
- **URL**: http://localhost:3000/student/login
- **Email**: student@school.com
- **Password**: student123

## 📋 Features

### Admin Portal
- Dashboard with KPIs and analytics
- Student Management (CRUD)
- Teacher Management
- Class Management
- Attendance Tracking
- Grade Management
- Finance & Fee Tracking
- Inventory Management
- Gallery Management
- Notices & Announcements
- School Settings

### Teacher Portal
- Dashboard with class overview
- Class Management
- Assignment Creation & Tracking
- Attendance Monitoring
- Grade Management
- Student Performance Analytics

### Student Portal
- Personal Dashboard
- Grade Tracking
- Assignment Submission
- Attendance Records
- Performance Analytics

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15 (React Framework)
- TypeScript
- Redux Toolkit (State Management)
- Axios (HTTP Client)
- Tailwind CSS v4 (Styling)
- Recharts (Charts & Analytics)

**Backend:**
- Express.js (Node.js Framework)
- Mock Data (Ready for Database Integration)
- RESTful API Architecture

**Design:**
- ICICI Bank Color Scheme
- Professional UI Components
- Responsive Design
- Interactive Charts

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

## 🔄 API Integration

All API endpoints are configured in `lib/api.ts`. To connect to your backend:

1. Update `NEXT_PUBLIC_API_URL` in environment variables
2. Replace mock data with actual API calls
3. Update Redux slices to handle real data

## 📦 Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=School ERP
\`\`\`

## 🎨 Color Scheme

- **Primary**: #FF6B35 (Orange)
- **Secondary**: #8B3A3A (Burgundy)
- **Accent**: #FFB84D (Light Orange)
- **Background**: #F5F5F5 (Light Gray)
- **Text**: #333333 (Dark Gray)

## 📞 Support

For issues or questions:
1. Check the README.md file
2. Review the component documentation
3. Check Redux store structure
4. Verify API endpoints

## 🚀 Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
# Deploy to Vercel
\`\`\`

### Backend (Any Node.js Host)
\`\`\`bash
cd backend
npm install
npm start
\`\`\`

## 📝 License

This project is provided as-is for educational purposes.

---

**Happy Coding! 🎉**
