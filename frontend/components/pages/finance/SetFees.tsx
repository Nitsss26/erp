import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { FeeStructure, Class } from '../../../types';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';

const SetFees: React.FC = () => {
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
    const [formData, setFormData] = useState<Partial<FeeStructure> & { feeItems: { name: string, amount: number }[] }>({ feeItems: [{ name: '', amount: 0 }] });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [feesRes, classesRes] = await Promise.all([
                api.get('/fees'),
                api.get('/classes')
            ]);
            setFeeStructures(feesRes.data);
            setClasses(classesRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleOpenModal = (structure: FeeStructure | null = null) => {
        setEditingStructure(structure);
        setFormData(structure ? { ...structure, feeItems: structure.feeItems || [{ name: '', amount: 0 }] } : { name: '', academicYear: '2024-2025', term: '1', applicableClasses: [], feeItems: [{ name: '', amount: 0 }] });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStructure(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, applicableClasses: selectedOptions });
    };

    const handleItemChange = (index: number, field: 'name' | 'amount', value: string) => {
        const newItems = [...(formData.feeItems || [])];
        newItems[index] = { ...newItems[index], [field]: field === 'amount' ? parseFloat(value) || 0 : value };
        setFormData({ ...formData, feeItems: newItems });
    };

    const addItem = () => {
        setFormData({ ...formData, feeItems: [...(formData.feeItems || []), { name: '', amount: 0 }] });
    };

    const removeItem = (index: number) => {
        const newItems = (formData.feeItems || []).filter((_, i) => i !== index);
        setFormData({ ...formData, feeItems: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStructure) {
                await api.put(`/fees/update/${editingStructure._id}`, formData);
            } else {
                await api.post('/fees/create', formData);
            }
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save fee structure.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this fee structure?')) {
            try {
                await api.delete(`/fees/delete/${id}`);
                fetchData();
            } catch (err) {
                setError('Failed to delete fee structure.');
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Fee Structure Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Structure
                </button>
            </div>
            {loading ? <p>Loading...</p> : error && !isModalOpen ? <p className="text-red-500">{error}</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feeStructures.map(fs => (
                        <div key={fs._id} className="p-4 border border-[--card-border] rounded-lg bg-[--table-row-even] transition hover:shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-[--text-primary]">{fs.name}</h3>
                                    <p className="text-sm text-[--text-secondary]">{fs.academicYear} - Term {fs.term}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(fs)} className="text-blue-500 hover:text-blue-700" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(fs._id)} className="text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                            <ul className="text-sm mt-2 space-y-1">
                                {fs.feeItems.map((item, i) => <li key={i} className="flex justify-between"><span>{item.name}</span><span>₹{item.amount.toFixed(2)}</span></li>)}
                            </ul>
                            <p className="text-lg font-bold my-2 text-right border-t pt-2 mt-2">₹{fs.totalAmount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[--card-border]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{editingStructure ? 'Edit Fee Structure' : 'New Fee Structure'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Structure Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] md:col-span-3" required />
                                <input name="academicYear" value={formData.academicYear || ''} onChange={handleChange} placeholder="Academic Year" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="term" value={formData.term || ''} onChange={handleChange} placeholder="Term" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <select multiple value={formData.applicableClasses} onChange={handleClassChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background] md:col-span-3 h-24">
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <h4 className="font-semibold mt-4 mb-2">Fee Items</h4>
                                {formData.feeItems && formData.feeItems.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-center">
                                        <input value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} placeholder="Item Name" className="flex-1 p-2 border border-[--card-border] rounded bg-[--background]" />
                                        <input type="number" value={item.amount} onChange={e => handleItemChange(index, 'amount', e.target.value)} placeholder="Amount" className="w-32 p-2 border border-[--card-border] rounded bg-[--background]" />
                                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <button type="button" onClick={addItem} className="text-sm text-blue-500 hover:text-blue-700">+ Add Item</button>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Structure</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default SetFees;
