// Aligned with backend/models/NonTeacherModel.js and backend/models/TeacherModel.js
export interface User {
  _id: string;
  userID: string;
  name: string;
  surname: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'support-staff';
  campusID?: { _id: string; name: string; };
}

// Aligned with backend/controllers/dashboardController.js
export interface DashboardStats {
  students: number;
  staff: number;
  classes: number;
  totalRevenue: number;
  attendance: number; // This is a percentage
}

// Aligned with backend/models/StudentModel.js
export interface Student {
  _id: string;
  userID: string;
  name: string;
  surname: string;
  email?: string;
  mobilenumber?: string;
  dateofBirth?: string;
  physicalAddress?: string;
  classID?: {
    _id: string;
    name: string;
  };
  guardian?: {
    name: string;
    mobile: string;
    relationship: string;
  }[];
  enrollmentStatus: 'active' | 'withdrawn' | 'graduated';
}

// Aligned with backend/models/TeacherModel.js
export interface Staff {
  _id: string;
  userID: string;
  name: string;
  surname: string;
  email: string;
  role: 'teacher' | 'admin' | 'support-staff';
  mobilenumber: string;
  qualifications?: string;
  position?: string;
}

// Aligned with backend/models/TransactionsModel.js
export interface Transaction {
  _id: string;
  studentID?: {
    _id: string;
    name: string;
  };
  teacherID?: {
    _id: string;
    name: string;
  };
  amount: number;
  netAmount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  createdAt?: string;
  transactionDate?: string;
  paymentMethod: 'cash' | 'cheque' | 'bank_transfer' | 'mobile_money' | 'online_gateway' | 'upi';
}

// Aligned with backend/models/ClassesModel.js
export interface Class {
  _id: string;
  name: string;
  classCode: string;
  academicYear: string;
  teacherID?: { _id: string; name: string };
  isArchived: boolean;
}

// Aligned with backend/models/CoursesModel.js
export interface Course {
    _id: string;
    name: string;
    courseCode: string;
    type: string;
}

// Aligned with backend/models/HomeWorkModel.js
export interface Homework {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  classID: {
    _id: string;
    name: string;
  };
  courseID: {
    _id: string;
    name: string;
  };
  teacherID: {
    _id: string;
    name: string;
  };
}

// Aligned with backend/models/LeaveApplicationModel.js
export interface LeaveApplication {
    _id: string;
    applicant: {
        _id: string;
        name: string;
        userID: string;
    };
    applicantType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Aligned with backend/models/SBAModel.js
export interface StudentScore {
    studentID: {
        _id: string;
        name: string;
        surname: string;
        userID: string;
    };
    classWorkScore: number;
    examScore: number;
    totalScore: number;
    grade?: string;
    remarks?: string;
}

// Aligned with backend/models/SBAModel.js
export interface SBA {
    _id: string;
    maxClassWorkScore: number;
    maxExamScore: number;
    scores: StudentScore[];
    classID: string;
    courseID: string;
    academicYear: string;
    term: string;
}

// Aligned with backend/models/FeesModel.js
export interface FeeStructure {
    _id: string;
    name: string;
    academicYear: string;
    term: string;
    totalAmount: number;
    applicableClasses: string[];
    feeItems: { name: string, amount: number }[];
}

// Aligned with backend/models/BankingModel.js
export interface BankAccount {
    _id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    accountType: 'checking' | 'savings' | 'loan' | 'other';
    isActive?: boolean;
}

// Aligned with backend/models/CampusesModel.js
export interface Campus {
    _id: string;
    name: string;
    location?: string;
    description?: string;
}

// Aligned with backend/models/TransportModel.js
export interface TransportFee {
    _id: string;
    uniqueId: string;
    village: string;
    amount: number;
}

// Aligned with backend/models/PrefectsModel.js
export interface Prefect {
    _id: string;
    userID: string;
    name: string;
    position: string;
    startYear: string;
    endYear: string;
}

// Aligned with backend/models/PayRow.Model.js
export interface Payrow {
    _id: string;
    name: string;
    code: string;
    basicSalary: number;
    allowance: number;
    bonus: number;
}

// Aligned with backend/models/DeductionsModel.js
export interface Deduction {
    _id: string;
    name: string;
    amount: number;
    date: string;
    person: {
        _id: string;
        name: string;
        userID: string;
    };
    personType: 'students' | 'teachers';
}

// Aligned with backend/models/CalenderModel.js
export interface CalendarEvent {
    _id: string;
    title: string;
    description?: string;
    date: string;
    type: 'Event' | 'Holiday' | 'Exam' | 'Other';
}

// Aligned with backend/models/QuizModel.js
export interface Question {
    question: string;
    options: string[];
    answer: string;
}

export interface Quiz {
    _id: string;
    title: string;
    description: string;
    classID: { _id: string; name: string; };
    courseID: { _id: string; name: string; };
    questions: Question[];
}

// Aligned with backend/models/NoticeModel.js
export interface Notice {
    _id: string;
    title: string;
    description: string;
    publishDate: string;
    expiryDate?: string;
    target: {
        roles: string[];
        classes?: string[];
    }
}

// Aligned with backend/models/StoreItemsModel.js
export interface StoreItem {
    _id: string;
    name: string;
    sku: string;
    category: string;
    sellingPrice: number;
    stockQuantity: number;
    lowStockThreshold: number;
}

// Aligned with backend/models/StoreSalesModel.js
export interface Sale {
    _id: string;
    customer: { _id: string, name: string, userID: string };
    customerType: 'students' | 'teachers' | 'other';
    soldBy: { _id: string, name: string };
    items: { itemID: string, quantity: number, priceAtSale: number, totalAmount: number }[];
    totalAmount: number;
    amountPaid: number;
    balance: number;
    createdAt: string;
}

// Aligned with backend/models/YearGroupModel.js
export interface YearGroup {
    _id: string;
    name: string;
    year: string;
}
