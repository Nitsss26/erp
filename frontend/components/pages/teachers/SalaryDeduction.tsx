import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Staff, Deduction } from '../../../types';
import { PlusIcon, XIcon, ReceiptPercentIcon, TrashIcon } from '../../Icons';

const SalaryDeduction: React.FC = () => {
    const [deductions, setDeductions] = useState<Deduction[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ personType: 'teachers' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [deductionRes, staffRes] = await Promise.all([
                api.get('/deductions'),
                api.get('/teachers')
            ]);
            setDeductions(deductionRes.data);
            setStaff(staffRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const handleOpenModal = () => {
        setFormData({ name: '', amount: '', date: new Date().toISOString().split('T')[0], person: '', personType: 'teachers', academicYear: '2024-2025' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/deductions/create', formData);
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create deduction.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this deduction?')) {
            try {
                await api.delete(`/deductions/delete/${id}`);
                fetchData();
            } catch (err) {
                setError('Failed to delete deduction.');
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary] flex items-center gap-2">
                    <ReceiptPercentIcon className="w-6 h-6"/>
                    Salary Deductions & Fines
                </h2>
                <button onClick={handleOpenModal} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Deduction
                </button>
            </div>
            {loading ? <p>Loading...</p> : error && !isModalOpen ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th className="px-6 py-3">Staff Member</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deductions.map((d, index) => (
                                <tr key={d._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{d.person?.name} ({d.person?.userID})</td>
                                    <td className="px-6 py-4">{d.name}</td>
                                    <td className="px-6 py-4">{new Date(d.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-red-600">₹{d.amount.toFixed(2)}</td>
                                     <td className="px-6 py-4">
                                        <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:text-red-700" title="Delete Deduction"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">New Deduction/Fine</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select name="person" value={formData.person || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                                <option value="">Select Staff Member</option>
                                {staff.map(s => <option key={s._id} value={s._id}>{s.name} {s.surname} ({s.userID})</option>)}
                            </select>
                            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Reason for Deduction" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <input name="amount" type="number" value={formData.amount || ''} onChange={handleChange} placeholder="Amount" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <input name="date" type="date" value={formData.date || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Deduction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryDeduction;
