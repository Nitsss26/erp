import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, CurrencyRupeeIcon, TruckIcon } from '../../Icons';

interface TransportFee {
    _id: string;
    uniqueId: string;
    village: string;
    amount: number;
}

const Transport: React.FC = () => {
    const [fees, setFees] = useState<TransportFee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState<TransportFee | null>(null);
    const [formData, setFormData] = useState<Partial<TransportFee>>({});

    const fetchFees = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/transport/all-fees');
            setFees(response.data);
        } catch (err) {
            setError('Failed to fetch transport fees.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFees();
    }, [fetchFees]);
    
    const handleOpenModal = (fee: TransportFee | null = null) => {
        setEditingFee(fee);
        setFormData(fee ? { ...fee } : { village: '', amount: 0 });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFee(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFee) {
                await api.put(`/transport/update-fees/${editingFee.uniqueId}`, formData);
            } else {
                await api.post('/transport/add-fees', formData);
            }
            fetchFees();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save transport fee.');
        }
    };
    
    const handleDelete = async (uniqueId: string) => {
        if (window.confirm('Are you sure you want to delete this transport route?')) {
            try {
                await api.delete(`/transport/remove-fees/${uniqueId}`);
                fetchFees();
            } catch (err) {
                setError('Failed to delete transport fee.');
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary] flex items-center gap-2">
                    <TruckIcon className="w-6 h-6"/> Transport Fee Management
                </h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" /> Add Route
                </button>
            </div>
            
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Route / Village</th>
                                <th scope="col" className="px-6 py-3 text-right">Fee Amount</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.map((fee, index) => (
                                <tr key={fee._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{fee.village}</td>
                                    <td className="px-6 py-4 text-right font-semibold">₹{fee.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(fee)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(fee.uniqueId)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 transition-opacity">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingFee ? 'Edit Transport Fee' : 'Add New Route'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="village" value={formData.village || ''} onChange={handleChange} placeholder="Village/Route Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <div className="relative">
                                <CurrencyRupeeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[--text-secondary]"/>
                                <input name="amount" type="number" value={formData.amount || ''} onChange={handleChange} placeholder="Fee Amount" className="w-full p-2 pl-10 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Fee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transport;
