



import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
// FIX: removed .ts extension from import
import type { Student, Transaction } from '../../../types';
// FIX: removed .tsx extension from import
import { SearchIcon, CurrencyDollarIcon, XIcon } from '../../Icons';

const FeeCollection: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [studentsRes, transactionsRes] = await Promise.all([
                api.get('/students'),
                api.get('/transactions/students')
            ]);
            setStudents(studentsRes.data.students || studentsRes.data);
            setTransactions(transactionsRes.data.transactions || []);
        } catch (err) {
            setError('Failed to fetch finance data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        setPaymentAmount('');
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !paymentAmount) return;
        try {
            await api.post('/transactions/create', {
                studentID: selectedStudent._id,
                amount: parseFloat(paymentAmount),
                category: 'fees',
                type: 'income',
                paymentMethod: 'cash',
                description: `Fee payment for ${selectedStudent.name}`,
                academicYear: '2024-2025', // Should be dynamic
                term: '1' // Should be dynamic
            });
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to record payment.');
        }
    };

    const getStudentFeeStatus = (studentId: string) => {
        // This is a simplified logic. A real app would have more complex fee calculation.
        const payments = transactions.filter(t => t.studentID?._id === studentId && t.category === 'fees');
        const totalPaid = payments.reduce((sum, t) => sum + t.amount, 0);
        
        // Assuming a flat fee of 5000 for simplicity
        const totalFee = 5000;
        const balance = totalFee - totalPaid;

        if (balance <= 0) return { status: 'Paid', balance: 0, color: 'bg-green-100 text-green-800' };
        if (totalPaid > 0) return { status: 'Partial', balance, color: 'bg-yellow-100 text-yellow-800' };
        return { status: 'Unpaid', balance, color: 'bg-red-100 text-red-800' };
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.surname && student.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.userID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fee Collection</h2>
             <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search students by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Fee Status</th>
                                <th scope="col" className="px-6 py-3">Balance</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => {
                                const feeStatus = getStudentFeeStatus(student._id);
                                return (
                                <tr key={student._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.userID}</td>
                                    <td className="px-6 py-4">{student.name} {student.surname}</td>
                                    <td className="px-6 py-4">{student.classID?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${feeStatus.color}`}>
                                            {feeStatus.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">₹{feeStatus.balance.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenModal(student)} className="text-orange-500 hover:text-orange-700 font-semibold flex items-center gap-1">
                                            <CurrencyDollarIcon className="w-4 h-4" /> Collect
                                        </button>
                                    </td>
                                </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                </div>
            )}
             {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Record Payment for {selectedStudent.name}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handlePaymentSubmit}>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                                placeholder="Enter amount"
                                required
                            />
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Save Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeCollection;