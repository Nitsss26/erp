import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, CalendarIcon } from '../../Icons';
import type { YearGroup } from '../../../types';

const YearGroups: React.FC = () => {
    const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<YearGroup | null>(null);
    const [formData, setFormData] = useState<Partial<YearGroup>>({});

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/year-groups');
            setYearGroups(response.data);
        } catch (err) {
            setError('Failed to fetch year groups.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleOpenModal = (group: YearGroup | null = null) => {
        setEditingGroup(group);
        setFormData(group ? { ...group } : { name: '', year: new Date().getFullYear().toString() });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGroup(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await api.put(`/year-groups/update/${editingGroup._id}`, formData);
            } else {
                await api.post('/year-groups/create', formData);
            }
            fetchGroups();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save year group.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this year group?')) {
            try {
                await api.delete(`/year-groups/delete/${id}`);
                fetchGroups();
            } catch (err) {
                setError('Failed to delete year group.');
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary] flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6"/> Year Group Management
                </h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Year Group
                </button>
            </div>

            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Group Name</th>
                                <th scope="col" className="px-6 py-3">Year</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearGroups.map((group, index) => (
                                 <tr key={group._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{group.name}</td>
                                    <td className="px-6 py-4">{group.year}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(group)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(group._id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
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
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingGroup ? 'Edit Year Group' : 'New Year Group'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Group Name (e.g., 2024 Seniors)" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <input name="year" value={formData.year || ''} onChange={handleChange} placeholder="Year (e.g., 2024)" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Group</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearGroups;
