import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { BankAccount } from '../../../types';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, BanknotesIcon } from '../../Icons';

const Banking: React.FC = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [formData, setFormData] = useState<Partial<BankAccount>>({});

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/banking');
            setAccounts(response.data);
        } catch (err) {
            setError('Failed to fetch bank accounts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleOpenModal = (account: BankAccount | null = null) => {
        setEditingAccount(account);
        setFormData(account ? { ...account } : { bankName: '', accountName: '', accountNumber: '', branch: '', accountType: 'checking' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAccount) {
                await api.put(`/banking/update/${editingAccount._id}`, formData);
            } else {
                await api.post('/banking/create', formData);
            }
            fetchAccounts();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save account.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this bank account?')) {
            try {
                await api.delete(`/banking/delete/${id}`);
                fetchAccounts();
            } catch (err) {
                setError('Failed to delete account.');
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary] flex items-center gap-2">
                    <BanknotesIcon className="w-6 h-6"/>
                    Bank Account Management
                </h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Account
                </button>
            </div>
            {loading ? <p>Loading...</p> : error && !isModalOpen ? <p className="text-red-500">{error}</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map(acc => (
                        <div key={acc._id} className="p-5 border border-[--card-border] rounded-lg bg-[--table-row-even] transition hover:shadow-md hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-[--text-primary]">{acc.accountName}</h3>
                                    <p className="text-sm text-[--text-secondary]">{acc.bankName} - {acc.branch}</p>
                                </div>
                                 <span className={`capitalize text-xs px-2 py-1 rounded-full ${acc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                    {acc.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="font-mono text-md my-3 p-2 bg-white rounded-md text-center tracking-widest border border-dashed">{acc.accountNumber}</p>
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={() => handleOpenModal(acc)} className="text-blue-500 hover:text-blue-700" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(acc._id)} className="text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingAccount ? 'Edit Account' : 'New Bank Account'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <input name="accountName" value={formData.accountName || ''} onChange={handleChange} placeholder="Account Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                             <input name="bankName" value={formData.bankName || ''} onChange={handleChange} placeholder="Bank Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                             <input name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} placeholder="Account Number" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                             <input name="branch" value={formData.branch || ''} onChange={handleChange} placeholder="Branch" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                             <select name="accountType" value={formData.accountType || 'checking'} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                                 <option value="checking">Checking</option>
                                 <option value="savings">Savings</option>
                                 <option value="loan">Loan</option>
                                 <option value="other">Other</option>
                             </select>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banking;
