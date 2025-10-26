import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Sale } from '../../../types';

const SalesRecord: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSales = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/store/sales');
            setSales(response.data);
        } catch (err) {
            setError('Failed to fetch sales records.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSales() }, [fetchSales]);

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Store Sales Records</h2>
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3 text-center">Total Items</th>
                                <th className="px-6 py-3 text-right">Total Amount</th>
                                <th className="px-6 py-3">Sold By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale, index) => (
                                <tr key={sale._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4">{new Date(sale.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{sale.customer?.name || 'Walk-in'}</td>
                                    <td className="px-6 py-4 text-center">{sale.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                                    <td className="px-6 py-4 text-right font-semibold">₹{sale.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{sale.soldBy?.name || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SalesRecord;
