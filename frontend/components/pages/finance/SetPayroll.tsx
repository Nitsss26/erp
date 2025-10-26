import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, CurrencyRupeeIcon } from '../../Icons';
import type { Payrow } from '../../../types';

const SetPayroll: React.FC = () => {
    const [payrows, setPayrows] = useState<Payrow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayrow, setEditingPayrow] = useState<Payrow | null>(null);
    const [formData, setFormData] = useState<Partial<Payrow>>({});

    const fetchPayrows = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/payrow');
            setPayrows(response.data);
        } catch (err) {
            setError('Failed to fetch payroll structures.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPayrows() }, [fetchPayrows]);

    const handleOpenModal = (payrow: Payrow | null = null) => {
        setEditingPayrow(payrow);
        setFormData(payrow ? { ...payrow } : { name: '', basicSalary: 0, allowance: 0, bonus: 0 });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => setIsModalOpen(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'name' ? value : parseFloat(value) || 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPayrow) {
                await api.put(`/payrow/update/${editingPayrow._id}`, formData);
            } else {
                await api.post('/payrow/add', formData);
            }
            fetchPayrows();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save payroll structure.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this payroll structure?')) {
            try {
                await api.delete(`/payrow/delete/${id}`);
                fetchPayrows();
            } catch (err) {
                setError('Failed to delete structure.');
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Payroll Structures</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Structure
                </button>
            </div>
            {loading ? <p>Loading...</p> : error && !isModalOpen ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th className="px-6 py-3">Position Name</th>
                                <th className="px-6 py-3 text-right">Basic Salary</th>
                                <th className="px-6 py-3 text-right">Allowance</th>
                                <th className="px-6 py-3 text-right">Bonus</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrows.map((p, index) => (
                                <tr key={p._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{p.name}</td>
                                    <td className="px-6 py-4 text-right">₹{p.basicSalary.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">₹{p.allowance.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">₹{p.bonus.toFixed(2)}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(p)} className="text-blue-500 hover:text-blue-700" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-5 h-5"/></button>
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
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingPayrow ? 'Edit Structure' : 'New Payroll Structure'}</h3>
                             <button onClick={handleCloseModal}><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                           <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Position Name (e.g., Senior Teacher)" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                           <input name="basicSalary" type="number" value={formData.basicSalary || ''} onChange={handleChange} placeholder="Basic Salary" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                           <input name="allowance" type="number" value={formData.allowance || ''} onChange={handleChange} placeholder="Allowance" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                           <input name="bonus" type="number" value={formData.bonus || ''} onChange={handleChange} placeholder="Bonus" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                           <div className="flex justify-end gap-4 mt-6">
                               <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                               <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Structure</button>
                           </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetPayroll;
