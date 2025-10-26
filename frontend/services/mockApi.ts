// FIX: import `generateInitialData` and `mockData`
import { generateInitialData, mockData } from './mockData';
import type { Student, Staff, Class, Course, Transaction, FeeStructure, BankAccount, Campus, TransportFee, Prefect, Payrow, Deduction, CalendarEvent, Quiz, Notice, Homework, LeaveApplication, StoreItem, Sale, YearGroup } from '../types';

class MockApiService {
    private data: any;
    private initialized: boolean = false;

    constructor() {
        this.data = {};
    }

    init() {
        if (this.initialized) return;
        const storedData = sessionStorage.getItem('school_erp_data');
        if (storedData) {
            this.data = JSON.parse(storedData);
        } else {
            this.data = generateInitialData();
            this.save();
        }
        this.initialized = true;
    }

    private save() {
        sessionStorage.setItem('school_erp_data', JSON.stringify(this.data));
    }

    private generateId() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    private generateUserID(prefix: string, count: number) {
        const year = new Date().getFullYear();
        return `${prefix}${year}${count + 1}`;
    }

    async get(url: string) {
        console.log(`MOCK GET: ${url}`);
        const [_, main, sub, id, year, term] = url.split('/');
        
        switch (main) {
            case 'dashboard':
                if (sub === 'counts') {
                    const totalRevenue = this.data.transactions
                        .filter((t: Transaction) => t.type === 'income')
                        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
                    return {
                        data: {
                            students: this.data.students.length,
                            staff: this.data.staff.length,
                            classes: this.data.classes.length,
                            totalRevenue: totalRevenue,
                            attendance: 95, // mock percentage
                        }
                    };
                }
                break;
            case 'students':
                if(sub === 'student' && id === 'report') {
                     return { data: { report: mockData.reportCard }};
                }
                 if(sub === 'class' && id) {
                    // FIX: The mock data for students has classID as a string, but the Student type expects an object.
                    // This now filters by string and then populates the classID to match the type.
                    const studentsInClass = this.data.students
                        .filter((s: any) => s.classID === id)
                        .map((s: any) => {
                            const classInfo = this.data.classes.find((c: Class) => c._id === s.classID);
                            return {
                                ...s,
                                classID: classInfo ? { _id: classInfo._id, name: classInfo.name } : undefined,
                            };
                        });
                    return { data: { users: studentsInClass } };
                }
                // FIX: Populate all student data to match the Student type, which expects classID to be an object.
                const allStudentsPopulated = this.data.students.map((student: any) => {
                    const classInfo = this.data.classes.find((c: Class) => c._id === student.classID);
                    return {
                        ...student,
                        classID: classInfo ? { _id: classInfo._id, name: classInfo.name } : undefined,
                    };
                });
                return { data: allStudentsPopulated };
            case 'teachers':
            case 'staff': // Alias for teachers
                 return { data: this.data.staff };
            case 'classes':
                return { data: this.data.classes };
            case 'courses':
                return { data: this.data.courses };
            case 'transactions':
                return { data: this.data.transactions };
            case 'fees':
                return { data: this.data.feeStructures };
            case 'banking':
                return { data: this.data.bankAccounts };
            case 'campuses':
                return { data: this.data.campuses };
            case 'transport':
                if(sub === 'all-fees') return { data: this.data.transportFees };
                break;
            case 'prefects':
                return { data: this.data.prefects };
            case 'payrow':
                return { data: this.data.payrows };
            case 'deductions':
                return { data: this.data.deductions };
            case 'year-groups':
                return { data: this.data.yearGroups };
            case 'calendar':
                if(sub === 'upcoming') return { data: this.data.calendarEvents };
                break;
            case 'quiz':
                return { data: this.data.quizzes };
            case 'notification':
                if(sub === 'upcoming') return { data: this.data.notices };
                break;
            case 'homeworks':
                return { data: this.data.homeworks };
            case 'leave-applications':
                return { data: this.data.leaveApplications };
            case 'store':
                if(sub === 'items') return { data: this.data.storeItems };
                if(sub === 'sales') return { data: this.data.storeSales };
                break;
            case 'sba':
                const [,,,classId, courseId, academicYear, sbaTerm] = url.split('/');
                const sba = this.data.sba.find((s: any) => s.classID === classId && s.courseID === courseId && s.academicYear === academicYear && s.term === sbaTerm);
                return { data: { doc: sba } };
            case 'attendance':
                if (sub === 'user' && id) {
                    const attendance = this.data.attendance.filter((a: any) => a.attendee === id);
                    return { data: { attendance } };
                }
                if (sub === 'class' && id && year) { // year is date string here
                    const rec = this.data.attendance.find((a: any) => a.classID === id && a.date === year);
                    return { data: { doc: rec || { attendees: [] } } };
                }
        }
        return { data: [] };
    }

    async post(url: string, payload: any) {
        console.log(`MOCK POST: ${url}`, payload);
        const [_, main, sub] = url.split('/');

        switch (main) {
            case 'school':
                if (sub === 'signin') {
                    if ((payload.userID === 'admin' && payload.password === '123') || (payload.userID === 'teacher' && payload.password === '123')) {
                        const user = this.data.staff.find((s: Staff) => s.role === payload.userID);
                        return { data: { success: true, user, token: `mock-token-${user._id}` } };
                    }
                    return { data: { success: false, error: 'Invalid credentials' } };
                }
                break;
            case 'students':
                if (sub === 'create') {
                    const newStudent: Student = {
                        _id: this.generateId(),
                        userID: this.generateUserID('ZEN', this.data.students.length),
                        ...payload,
                    };
                    this.data.students.push(newStudent);
                    this.save();
                    return { data: newStudent };
                }
                break;
            case 'teachers':
                if (sub === 'create') {
                    const newStaff: Staff = {
                        _id: this.generateId(),
                        userID: this.generateUserID('STF', this.data.staff.length),
                        ...payload,
                    };
                    this.data.staff.push(newStaff);
                    this.save();
                    return { data: newStaff };
                }
                break;
            case 'classes':
                 if (sub === 'create') {
                    const newClass: Class = { _id: this.generateId(), ...payload };
                    this.data.classes.push(newClass);
                    this.save();
                    return { data: newClass };
                }
                break;
             case 'courses':
                if (sub === 'create') {
                    const newCourse: Course = { _id: this.generateId(), ...payload };
                    this.data.courses.push(newCourse);
                    this.save();
                    return { data: newCourse };
                }
                break;
            case 'fees':
                if (sub === 'create') {
                    const newFee: FeeStructure = { _id: this.generateId(), totalAmount: payload.feeItems.reduce((acc: number, item: any) => acc + item.amount, 0), ...payload };
                    this.data.feeStructures.push(newFee);
                    this.save();
                    return { data: newFee };
                }
                break;
            case 'payrow':
                if(sub === 'add') {
                    const newPayrow: Payrow = { _id: this.generateId(), code: payload.name.toUpperCase(), ...payload };
                    this.data.payrows.push(newPayrow);
                    this.save();
                    return { data: newPayrow };
                }
                break;
            case 'deductions':
                if (sub === 'create') {
                    const person = this.data.staff.find((s: Staff) => s._id === payload.person);
                    const newDeduction: Deduction = { _id: this.generateId(), person: { _id: person._id, name: person.name, userID: person.userID }, ...payload };
                    this.data.deductions.push(newDeduction);
                    this.save();
                    return { data: newDeduction };
                }
                break;
             case 'year-groups':
                if (sub === 'create') {
                    const newGroup: YearGroup = { _id: this.generateId(), ...payload };
                    this.data.yearGroups.push(newGroup);
                    this.save();
                    return { data: newGroup };
                }
                break;
            case 'store':
                if(url.endsWith('/sales/create')) {
                     const newSale: Sale = { _id: this.generateId(), createdAt: new Date().toISOString(), ...payload };
                     this.data.storeSales.push(newSale);
                     this.save();
                     return { data: newSale };
                }
                if(url.endsWith('/items/create')) {
                    const newItem: StoreItem = { _id: this.generateId(), ...payload };
                    this.data.storeItems.push(newItem);
                    this.save();
                    return { data: newItem };
                }
                break;
            case 'homeworks':
                if(sub === 'upload') {
                    const newHomework: Homework = { _id: this.generateId(), ...payload };
                    this.data.homeworks.push(newHomework);
                    this.save();
                    return { data: newHomework };
                }
                break;
            default:
                return { data: { success: true, ...payload } };
        }
        return { data: { success: false, error: 'Not implemented' } };
    }

    async put(url: string, payload: any) {
        console.log(`MOCK PUT: ${url}`, payload);
        const [_, main, sub, id] = url.split('/');
        let dataArray;
        let findKey = '_id';

        switch (main) {
            case 'students':
                if (sub === 'update') {
                    dataArray = this.data.students;
                    findKey = 'userID';
                }
                break;
            case 'teachers':
                if (sub === 'update') {
                    dataArray = this.data.staff;
                    findKey = 'userID';
                }
                break;
            case 'classes':
                if (sub === 'update') dataArray = this.data.classes;
                break;
            case 'courses':
                if (sub === 'update') dataArray = this.data.courses;
                break;
             case 'fees':
                if (sub === 'update') {
                    payload.totalAmount = payload.feeItems.reduce((acc: number, item: any) => acc + item.amount, 0)
                    dataArray = this.data.feeStructures;
                }
                break;
             case 'payrow':
                if (sub === 'update') dataArray = this.data.payrows;
                break;
            case 'year-groups':
                if (sub === 'update') dataArray = this.data.yearGroups;
                break;
            case 'store':
                if (url.includes('/items/update')) {
                     dataArray = this.data.storeItems;
                }
                break;
            case 'homeworks':
                if(sub === 'update') dataArray = this.data.homeworks;
                break;
            case 'leave-applications':
                if(sub === 'update') dataArray = this.data.leaveApplications; // This is a mock, a real one would have id/status endpoint
                break;
            case 'sba':
                 if (sub === 'update') dataArray = this.data.sba;
                break;
            default:
                return { data: { success: true, ...payload } };
        }

        if (dataArray) {
            const index = dataArray.findIndex((item: any) => item[findKey] === id);
            if (index > -1) {
                dataArray[index] = { ...dataArray[index], ...payload };
                this.save();
                return { data: dataArray[index] };
            }
        }
        
        return { data: { success: false, error: 'Item not found' } };
    }

    async delete(url: string) {
        console.log(`MOCK DELETE: ${url}`);
        const [_, main, sub, id] = url.split('/');
        let dataArrayKey;
        let findKey = '_id';

        switch (main) {
            case 'students':
                if (sub === 'delete') { dataArrayKey = 'students'; findKey = 'userID'; }
                break;
            case 'teachers':
                 if (sub === 'delete') { dataArrayKey = 'staff'; findKey = 'userID'; }
                break;
            case 'classes':
                if (sub === 'delete') dataArrayKey = 'classes';
                break;
            case 'courses':
                 if (sub === 'delete') dataArrayKey = 'courses';
                break;
            case 'fees':
                if (sub === 'delete') dataArrayKey = 'feeStructures';
                break;
            case 'payrow':
                if (sub === 'delete') dataArrayKey = 'payrows';
                break;
            case 'deductions':
                if (sub === 'delete') dataArrayKey = 'deductions';
                break;
             case 'year-groups':
                if (sub === 'delete') dataArrayKey = 'yearGroups';
                break;
            case 'store':
                if (url.includes('/items/delete')) dataArrayKey = 'storeItems';
                break;
            case 'homeworks':
                 if (sub === 'delete') dataArrayKey = 'homeworks';
                break;
        }
        
        if (dataArrayKey) {
            const dataArray = this.data[dataArrayKey];
            const initialLength = dataArray.length;
            this.data[dataArrayKey] = dataArray.filter((item: any) => item[findKey] !== id);
            if (this.data[dataArrayKey].length < initialLength) {
                this.save();
                return { data: { success: true } };
            }
        }

        return { data: { success: false, error: 'Item not found' } };
    }
}

export const mockApi = new MockApiService();