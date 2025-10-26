import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Transaction } from '../../../types';
// FIX: Add ArrowUpCircleIcon and ArrowDownCircleIcon to imports
import { CurrencyDollarIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '../../Icons';

const FinancialRecord: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/transactions');
            setTransactions(response.data || []);
        } catch (err) {
            setError('Failed to fetch financial records.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = transactions.filter(t => filter === 'all' || t.type === filter);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Financial Records</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <p className="text-sm text-green-700 flex items-center gap-2"><ArrowUpCircleIcon className="w-5 h-5"/> Total Income</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2"><ArrowDownCircleIcon className="w-5 h-5"/> Total Expense</p>
                    <p className="text-2xl font-bold text-red-800">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="text-sm text-blue-700 flex items-center gap-2"><CurrencyDollarIcon className="w-5 h-5"/> Net Balance</p>
                    <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalIncome - totalExpense)}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex space-x-2">
                    {(['all', 'income', 'expense'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm rounded-lg capitalize transition ${filter === f ? 'bg-[--primary] text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <p>Loading records...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t, index) => (
                                <tr key={t._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4">{new Date(t.transactionDate || t.createdAt!).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{t.description}</td>
                                    <td className="px-6 py-4 capitalize">{t.category.replace('_', ' ')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FinancialRecord;