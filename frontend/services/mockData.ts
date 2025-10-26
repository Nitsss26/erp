// FIX: Export mockData
export const mockData = {
  classes: [
      { _id: 'C01', id: 'C01', name: 'Class I', classCode: 'C1', teacherID: 'STF01', academicYear: '2024-25', isArchived: false },
      { _id: 'C02', id: 'C02', name: 'Class II', classCode: 'C2', teacherID: 'STF02', academicYear: '2024-25', isArchived: false },
      { _id: 'C03', id: 'C03', name: 'Class III', classCode: 'C3', teacherID: 'STF03', academicYear: '2024-25', isArchived: false },
      { _id: 'C04', id: 'C04', name: 'Class IV', classCode: 'C4', teacherID: 'STF04', academicYear: '2024-25', isArchived: false },
      { _id: 'C05', id: 'C05', name: 'Class V', classCode: 'C5', teacherID: 'STF01', academicYear: '2024-25', isArchived: false },
  ],
  students: [
    { _id: 'STU001', id: 'STU001', userID: 'ZEN1001', name: 'Aarav', surname: 'Sharma', classID: 'C05', section: 'A', rollNumber: 1, guardian: [{ name: 'Rakesh Sharma', mobile: '9876543210', relationship: 'Father' }], admissionDate: '2022-04-01', enrollmentStatus: 'active' },
    { _id: 'STU002', id: 'STU002', userID: 'ZEN1002', name: 'Diya', surname: 'Patel', classID: 'C05', section: 'B', rollNumber: 2, guardian: [{ name: 'Mitesh Patel', mobile: '9876543211', relationship: 'Father' }], admissionDate: '2022-04-01', enrollmentStatus: 'active' },
    { _id: 'STU003', id: 'STU003', userID: 'ZEN1003', name: 'Rohan', surname: 'Singh', classID: 'C04', section: 'A', rollNumber: 3, guardian: [{ name: 'Suresh Singh', mobile: '9876543212', relationship: 'Father' }], admissionDate: '2022-04-05', enrollmentStatus: 'active' },
    { _id: 'STU004', id: 'STU004', userID: 'ZEN1004', name: 'Priya', surname: 'Kumar', classID: 'C03', section: 'C', rollNumber: 4, guardian: [{ name: 'Anil Kumar', mobile: '9876543213', relationship: 'Father' }], admissionDate: '2023-05-10', enrollmentStatus: 'active' },
    { _id: 'STU005', id: 'STU005', userID: 'ZEN1005', name: 'Aryan', surname: 'Gupta', classID: 'C05', section: 'A', rollNumber: 5, guardian: [{ name: 'Sunil Gupta', mobile: '9876543214', relationship: 'Father' }], admissionDate: '2022-04-02', enrollmentStatus: 'withdrawn' },
  ],
  staff: [
    { _id: 'STF01', id: 'STF01', userID: 'STF2001', name: 'Anjali', surname: 'Verma', role: 'teacher', position: 'Senior Teacher', subject: 'Mathematics', employmentDate: '2020-07-15', mobilenumber: '9876543210', employmentStatus: 'active' },
    { _id: 'STF02', id: 'STF02', userID: 'STF2002', name: 'Vikram', surname: 'Rathore', role: 'teacher', position: 'Junior Teacher', subject: 'Science', employmentDate: '2019-03-10', mobilenumber: '9876543211', employmentStatus: 'active' },
    { _id: 'STF03', id: 'STF03', userID: 'STF2003', name: 'Suman', surname: 'Mishra', role: 'admin', position: 'Head of Administration', employmentDate: '2018-01-20', mobilenumber: '9876543212', employmentStatus: 'active' },
    { _id: 'STF04', id: 'STF04', userID: 'STF2004', name: 'Rajesh', surname: 'Kumar', role: 'support-staff', position: 'Librarian', employmentDate: '2021-11-01', mobilenumber: '9876543213', employmentStatus: 'on-leave' },
  ],
  fees: [],
  feeStructures: [
    { _id: 'FS01', id: 'FS01', name: 'Primary School Fees Term 1', academicYear: '2024-25', term: 'Term 1', applicableClasses: ['C01', 'C02', 'C03', 'C04', 'C05'], feeItems: [{name: 'Tuition Fee', amount: 4000}, {name: 'Library Fee', amount: 500}, {name: 'Sports Fee', amount: 500}], totalAmount: 5000 }
  ],
  courses: [
    { _id: 'CRS01', id: 'CRS01', name: 'Mathematics Grade 5', courseCode: 'MATH5', type: 'Core', classAssignments: [{ classID: 'C05', teacherID: 'STF01' }] },
    { _id: 'CRS02', id: 'CRS02', name: 'Science Grade 4', courseCode: 'SCI4', type: 'Core', classAssignments: [{ classID: 'C04', teacherID: 'STF02' }] },
    { _id: 'CRS03', id: 'CRS03', name: 'English Grade 5', courseCode: 'ENG5', type: 'Core', classAssignments: [{ classID: 'C05', teacherID: 'STF01' }] },
  ],
  transactions: [
      { _id: 'TRN01', id: 'TRN01', amount: 5000, category: 'fees', type: 'income', description: 'Fee payment for Aarav Sharma', studentID: { _id: 'STU001' }, paymentMethod: 'online_gateway', transactionDate: '2024-08-05', academicYear: '2024-25', term: 'Term 1' },
      { _id: 'TRN02', id: 'TRN02', amount: 45000, category: 'payroll', type: 'expense', description: 'Salary for Anjali Verma - July', teacherID: { _id: 'STF01' }, paymentMethod: 'bank_transfer', transactionDate: '2024-08-01', academicYear: '2024-25', term: 'Term 1' },
      { _id: 'TRN03', id: 'TRN03', amount: 850, category: 'utilities', type: 'expense', description: 'Electricity Bill', paymentMethod: 'online_gateway', transactionDate: '2024-08-03', academicYear: '2024-25', term: 'Term 1' }
  ],
  notices: [
      { _id: 'NTC01', id: 'NTC01', title: 'Annual Sports Day Announcement', description: 'The annual sports day will be held on the 15th of September. All students are requested to participate in various events. Registration closes on 5th September.', publishDate: '2024-08-01', target: { roles: ['all'] } },
      { _id: 'NTC02', id: 'NTC02', title: 'Parent-Teacher Meeting Schedule', description: 'The PTM for the first term will be on Saturday, August 20th, from 9 AM to 1 PM. Please adhere to your time slots.', publishDate: '2024-08-05', target: { roles: ['all'] } },
  ],
  attendance: [],
  homework: [
    { _id: 'HW01', id: 'HW01', title: 'Algebra Chapter 5', description: 'Complete exercises 1 to 20.', dueDate: '2024-09-10', classID: { _id: 'C05', name: 'Class V' }, courseID: { _id: 'CRS01', name: 'Mathematics Grade 5' }, teacherID: { _id: 'STF01', name: 'Anjali Verma' } }
  ],
  leaveApplications: [
    { _id: 'LA01', id: 'LA01', applicant: { _id: 'STF02', name: 'Vikram Rathore', userID: 'STF2002' }, applicantType: 'teachers', startDate: '2024-08-20', endDate: '2024-08-22', reason: 'Family emergency', status: 'approved' },
    { _id: 'LA02', id: 'LA02', applicant: { _id: 'STU003', name: 'Rohan Singh', userID: 'ZEN1003' }, applicantType: 'students', startDate: '2024-08-25', endDate: '2024-08-26', reason: 'Fever', status: 'pending' }
  ],
  sba: [
    { _id: 'SBA01', id: 'SBA01', maxClassWorkScore: 40, maxExamScore: 60, scores: [ { studentID: 'STU001', name: 'Aarav Sharma', userID: 'ZEN1001', classWorkScore: 35, examScore: 55 } ], classID: 'C05', courseID: 'CRS01', academicYear: '2024-2025', term: '1' }
  ],
  storeItems: [],
  storeSales: [],
  bankAccounts: [
      { id: 'BA01', _id: 'BA01', bankName: 'State Bank of India', accountName: 'Zenith School Main Account', accountNumber: '...XXXX1234', branch: 'Main Branch', accountType: 'checking', isActive: true },
      { id: 'BA02', _id: 'BA02', bankName: 'HDFC Bank', accountName: 'Zenith School Salary Account', accountNumber: '...XXXX5678', branch: 'City Branch', accountType: 'checking', isActive: true },
      { id: 'BA03', _id: 'BA03', bankName: 'ICICI Bank', accountName: 'Zenith School Savings', accountNumber: '...XXXX9012', branch: 'Main Branch', accountType: 'savings', isActive: false }
  ],
  calendarEvents: [],
  quizzes: [],
  prefects: [
      { id: 'PRF01', _id: 'PRF01', studentId: 'STU001', userID: 'ZEN1001', name: 'Aarav Sharma', position: 'Head Boy', startYear: '2024', endYear: '2025' }
  ],
  payrows: [
    { _id: 'PR01', id: 'PR01', name: 'Senior Teacher', code: 'ST', basicSalary: 45000, allowance: 5000, bonus: 2000 },
    { _id: 'PR02', id: 'PR02', name: 'Junior Teacher', code: 'JT', basicSalary: 35000, allowance: 3000, bonus: 1500 },
    { _id: 'PR03', id: 'PR03', name: 'Head of Administration', code: 'HA', basicSalary: 60000, allowance: 7000, bonus: 3000 },
    { _id: 'PR04', id: 'PR04', name: 'Librarian', code: 'LB', basicSalary: 28000, allowance: 2000, bonus: 1000 },
  ],
  deductions: [
    { _id: 'DED01', id: 'DED01', name: 'Late Arrival Fine', amount: 500, date: '2024-08-15', person: { _id: 'STF02', name: 'Vikram Rathore', userID: 'STF2002'}, personType: 'teachers' }
  ],
  yearGroups: [
      { _id: 'YG01', id: 'YG01', name: '2024 Graduates', year: '2024' },
      { _id: 'YG02', id: 'YG02', name: '2025 Batch', year: '2025' },
  ],
  transportFees: [
    { _id: 'TF01', uniqueId: 'TF01', village: 'Sector 15', amount: 1200 },
    { _id: 'TF02', uniqueId: 'TF02', village: 'Sector 22', amount: 1500 },
  ],
  reportCard: {},
};

// FIX: Export generateInitialData
export const generateInitialData = () => {
    // Deep copy to prevent mutation issues
    return JSON.parse(JSON.stringify(mockData));
}

export const initializeMockData = () => {
    if (!localStorage.getItem('school_data')) {
        localStorage.setItem('school_data', JSON.stringify(mockData));
    }
}