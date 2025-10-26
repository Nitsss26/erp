import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Student, Transaction, FeeStructure } from '../../../types';
import { SearchIcon, CurrencyDollarIcon, XIcon } from '../../Icons';

const FeeCollection: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [studentsRes, transactionsRes, feesRes] = await Promise.all([
                api.get('/students'),
                api.get('/transactions'),
                api.get('/fees')
            ]);
            setStudents(studentsRes.data || []);
            setTransactions(transactionsRes.data || []);
            setFeeStructures(feesRes.data || []);
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
                netAmount: parseFloat(paymentAmount),
                category: 'fees',
                type: 'income',
                paymentMethod: 'cash',
                description: `Fee payment for ${selectedStudent.name}`,
                academicYear: '2024-2025',
                term: '1'
            });
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to record payment.');
        }
    };

    const getStudentFeeStatus = (student: Student) => {
        const studentClassId = student.classID?._id;
        const feeStructure = feeStructures.find(fs => fs.applicableClasses.includes(studentClassId || ''));
        const totalFee = feeStructure?.totalAmount || 5000; // Default fee if not found

        const payments = transactions.filter(t => t.studentID?._id === student._id && t.category === 'fees');
        const totalPaid = payments.reduce((sum, t) => sum + t.amount, 0);
        
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
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Fee Collection</h2>
             <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--text-secondary]" />
                <input
                    type="text"
                    placeholder="Search students by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]"
                />
            </div>
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Fee Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Balance</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => {
                                const feeStatus = getStudentFeeStatus(student);
                                return (
                                <tr key={student._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{student.userID}</td>
                                    <td className="px-6 py-4">{student.name} {student.surname}</td>
                                    <td className="px-6 py-4">{student.classID?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${feeStatus.color}`}>
                                            {feeStatus.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold">₹{feeStatus.balance.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenModal(student)} className="text-[--primary] hover:text-[--primary-hover] font-semibold flex items-center gap-1 transition-colors">
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
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 transition-opacity">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">Record Payment for {selectedStudent.name}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handlePaymentSubmit}>
                            <label htmlFor="amount" className="block text-sm font-medium text-[--text-secondary]">Amount</label>
                            <div className="relative mt-1">
                                <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[--text-secondary]"/>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeCollection;
