import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';
import type { StoreItem } from '../../../types';

const Inventory: React.FC = () => {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
    const [formData, setFormData] = useState<Partial<StoreItem>>({});

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/store/items');
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch inventory.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchItems() }, [fetchItems]);
    
    const handleOpenModal = (item: StoreItem | null = null) => {
        setEditingItem(item);
        setFormData(item ? { ...item } : { name: '', sku: '', category: 'Uniform', sellingPrice: 0, stockQuantity: 0, lowStockThreshold: 10 });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? parseFloat(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/store/items/update/${editingItem._id}`, formData);
            } else {
                await api.post('/store/items/create', formData);
            }
            fetchItems();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save item.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/store/items/delete/${id}`);
                fetchItems();
            } catch (err) {
                setError('Failed to delete item.');
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Store Inventory</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Item
                </button>
            </div>
            
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th className="px-6 py-3">Item Name</th>
                                <th className="px-6 py-3">SKU</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Price</th>
                                <th className="px-6 py-3 text-center">Stock</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item._id} className={`border-b border-[--card-border] ${item.stockQuantity <= item.lowStockThreshold ? 'bg-red-50 hover:bg-red-100' : `${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} hover:bg-orange-100/50`}`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{item.name}</td>
                                    <td className="px-6 py-4">{item.sku}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4 text-right">₹{item.sellingPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center font-semibold">{item.stockQuantity}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[--card-border]">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Item Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="SKU (e.g., UNI-BLZ-M)" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="category" value={formData.category || ''} onChange={handleChange} placeholder="Category" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="sellingPrice" type="number" step="0.01" value={formData.sellingPrice || ''} onChange={handleChange} placeholder="Selling Price" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="stockQuantity" type="number" value={formData.stockQuantity || ''} onChange={handleChange} placeholder="Stock Quantity" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="lowStockThreshold" type="number" value={formData.lowStockThreshold || ''} onChange={handleChange} placeholder="Low Stock Threshold" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
