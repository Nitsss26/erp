import React, { useState } from 'react';
import type { User } from '../types';
import Sidebar from './Sidebar';
import Header from './Header';

// Dynamically import all page components for code splitting (though not truly effective in this setup, it's good practice)
const pageImports = {
  'Dashboard': React.lazy(() => import('./pages/Dashboard')),
  'All Students': React.lazy(() => import('./pages/students/AllStudents')),
  'Prefects': React.lazy(() => import('./pages/students/Prefects')),
  'Upgrading': React.lazy(() => import('./pages/students/Upgrading')),
  'Campuses': React.lazy(() => import('./pages/students/Campuses')),
  'Transport': React.lazy(() => import('./pages/students/Transport')),
  'Admit Card': React.lazy(() => import('./pages/students/AdmitCard')),
  'All Staff': React.lazy(() => import('./pages/teachers/AllStaff')),
  'Salary Deduction': React.lazy(() => import('./pages/teachers/SalaryDeduction')),
  'Salary Payment': React.lazy(() => import('./pages/teachers/SalaryPayment')),
  'Staff Payroll': React.lazy(() => import('./pages/teachers/StaffPayroll')),
  'Classes': React.lazy(() => import('./pages/academics/Classes')),
  'Courses': React.lazy(() => import('./pages/academics/Courses')),
  'Class Groups': React.lazy(() => import('./pages/academics/ClassGroups')),
  'Year Groups': React.lazy(() => import('./pages/academics/YearGroups')),
  'Divisions': React.lazy(() => import('./pages/academics/Divisions')),
  'School Calendar': React.lazy(() => import('./pages/academics/SchoolCalendar')),
  'Make Report Card': React.lazy(() => import('./pages/academics/MakeReportCard')),
  'Reports': React.lazy(() => import('./pages/reports/Reports')),
  'Combined Report Card': React.lazy(() => import('./pages/academics/CombinedReportCard')),
  'Students History': React.lazy(() => import('./pages/attendance/StudentsHistory')),
  'Teachers History': React.lazy(() => import('./pages/attendance/TeachersHistory')),
  'Record Attendance': React.lazy(() => import('./pages/attendance/RecordAttendance')),
  'Record Teacher Attendance': React.lazy(() => import('./pages/attendance/RecordTeacher')),
  'Leave Management': React.lazy(() => import('./pages/leave/LeaveManagement')),
  'All Quizzes': React.lazy(() => import('./pages/quiz/AllQuizzes')),
  'Homework': React.lazy(() => import('./pages/homework/Homework')),
  'Set Fees': React.lazy(() => import('./pages/finance/SetFees')),
  'Set Payroll': React.lazy(() => import('./pages/finance/SetPayroll')),
  'Fee Collection': React.lazy(() => import('./pages/finance/FeeCollection')),
  'Financial Records': React.lazy(() => import('./pages/finance/FinancialRecord')),
  'Fee Bill Reminder': React.lazy(() => import('./pages/finance/FeeBillReminder')),
  'Banking': React.lazy(() => import('./pages/finance/Banking')),
  'Record Sale': React.lazy(() => import('./pages/store/RecordSale')),
  'Inventory': React.lazy(() => import('./pages/store/Inventory')),
  'Sales Record': React.lazy(() => import('./pages/store/SalesRecord')),
  'Image Gallery': React.lazy(() => import('./pages/ImageGallery')),
  'Chat': React.lazy(() => import('./pages/sms/Chat')),
  'SMS Count': React.lazy(() => import('./pages/sms/SmsCount')),
  'Notice Board': React.lazy(() => import('./pages/sms/NoticeBoard')),
  'Settings': React.lazy(() => import('./pages/settings/AccountSettings')),
  'Sections': React.lazy(() => import('./pages/students/Sections')),
};


interface LayoutProps {
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const PageComponent = pageImports[activePage as keyof typeof pageImports] || pageImports['Dashboard'];

  return (
    <div className="flex h-screen bg-[--background]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        onLogout={onLogout}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header
          user={user}
          pageTitle={activePage}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-6 overflow-y-auto">
           <React.Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-[--primary] border-t-transparent rounded-full animate-spin"></div></div>}>
            <PageComponent />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;