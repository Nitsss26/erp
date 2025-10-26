import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Student, Transaction } from '../../../types';
import { BellIcon } from '../../Icons';

const FeeBillReminder: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [unpaidStudents, setUnpaidStudents] = useState<Student[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [studentsRes, transactionsRes] = await Promise.all([
                api.get('/students'),
                api.get('/transactions/students')
            ]);
            setStudents(studentsRes.data || []);
            setTransactions(transactionsRes.data || []);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (students.length > 0) {
            const getStudentFeeStatus = (studentId: string) => {
                const payments = transactions.filter(t => t.studentID?._id === studentId && t.category === 'fees');
                const totalPaid = payments.reduce((sum, t) => sum + t.amount, 0);
                const totalFee = 5000; // Simplified flat fee
                return totalFee - totalPaid > 0;
            };

            const filtered = students.filter(s => getStudentFeeStatus(s._id));
            setUnpaidStudents(filtered);
        }
    }, [students, transactions]);

    const handleSendReminder = (studentId: string) => {
        // In a real app, this would trigger a backend API call to send an SMS or email.
        alert(`Reminder sent to student ID: ${studentId}`);
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Fee Bill Reminders</h2>
            <p className="text-sm text-[--text-secondary] mb-4">List of students with unpaid or partially paid fees.</p>
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Class</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaidStudents.map((student, index) => (
                                <tr key={student._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium">{student.name} {student.surname}</td>
                                    <td className="px-6 py-4">{student.classID?.name || 'N/A'}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Unpaid/Partial</span></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleSendReminder(student.userID)} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                                            <BellIcon className="w-4 h-4" /> Send Reminder
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {unpaidStudents.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10">All fees are settled!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FeeBillReminder;
