import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';
import type { Student, Prefect } from '../../../types';

const Prefects: React.FC = () => {
    const [prefects, setPrefects] = useState<Prefect[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrefect, setEditingPrefect] = useState<Prefect | null>(null);
    const [formData, setFormData] = useState<Partial<Prefect>>({});

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [prefectsRes, studentsRes] = await Promise.all([
                api.get('/prefects'),
                api.get('/students')
            ]);
            setPrefects(prefectsRes.data);
            setStudents(studentsRes.data || []);
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

    const handleOpenModal = (prefect: Prefect | null = null) => {
        setEditingPrefect(prefect);
        setFormData(prefect ? { ...prefect } : { startYear: new Date().getFullYear().toString() });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPrefect) {
                await api.put(`/prefects/update/${editingPrefect._id}`, formData);
            } else {
                await api.post('/prefects/add', formData);
            }
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save prefect.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this prefect?')) {
            try {
                await api.delete(`/prefects/delete/${id}`);
                fetchData();
            } catch (err) {
                setError('Failed to delete prefect.');
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Prefects Management</h2>
                 <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Prefect
                </button>
            </div>
            
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3">Position</th>
                                <th scope="col" className="px-6 py-3">Term</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prefects.map((p, index) => (
                                <tr key={p._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{p.name}</td>
                                    <td className="px-6 py-4">{p.userID}</td>
                                    <td className="px-6 py-4">{p.position}</td>
                                    <td className="px-6 py-4">{p.startYear} - {p.endYear}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(p)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
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
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingPrefect ? 'Edit Prefect' : 'Add New Prefect'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select name="userID" value={formData.userID || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required disabled={!!editingPrefect}>
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s.userID} value={s.userID}>{s.name} {s.surname} ({s.userID})</option>)}
                            </select>
                            <input name="position" value={formData.position || ''} onChange={handleChange} placeholder="Position (e.g., Head Boy)" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                             <div className="grid grid-cols-2 gap-4">
                                <input name="startYear" value={formData.startYear || ''} onChange={handleChange} placeholder="Start Year" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <input name="endYear" value={formData.endYear || ''} onChange={handleChange} placeholder="End Year" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Prefect</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prefects;
