import React, { useState, useEffect, useCallback } from 'react';
import type { Class, Staff } from '../../../types';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';

const Classes: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [formData, setFormData] = useState<Partial<Class> & { teacher?: string }>({});

    const fetchClasses = useCallback(async () => {
        try {
            setLoading(true);
            const [classesRes, teachersRes] = await Promise.all([
              api.get('/classes'),
              api.get('/teachers')
            ]);
            setClasses(classesRes.data);
            setTeachers(teachersRes.data.filter((t: Staff) => t.role === 'teacher'));
        } catch (err) {
            setError('Failed to fetch classes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);
    
    const handleOpenModal = (cls: Class | null = null) => {
        setEditingClass(cls);
        setFormData(cls ? { ...cls, teacher: cls.teacherID?._id } : { name: '', classCode: '', academicYear: new Date().getFullYear().toString(), isArchived: false });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClass(null);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, teacherID: formData.teacher };

            if (editingClass) {
                await api.put(`/classes/update/${editingClass._id}`, payload);
            } else {
                await api.post('/classes/create', payload);
            }
            fetchClasses();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save class.');
            console.error(err);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await api.delete(`/classes/delete/${id}`);
                fetchClasses();
            } catch (err) {
                setError('Failed to delete class.');
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Class Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" /> Add Class
                </button>
            </div>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Class Name</th>
                                <th scope="col" className="px-6 py-3">Class Code</th>
                                <th scope="col" className="px-6 py-3">Academic Year</th>
                                <th scope="col" className="px-6 py-3">Class Teacher</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls, index) => (
                                <tr key={cls._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{cls.name}</td>
                                    <td className="px-6 py-4">{cls.classCode}</td>
                                    <td className="px-6 py-4">{cls.academicYear}</td>
                                    <td className="px-6 py-4">{cls.teacherID?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${!cls.isArchived ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                        {!cls.isArchived ? 'Active' : 'Archived'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(cls)} className="text-blue-500 hover:text-blue-700" title="Edit Class"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(cls._id)} className="text-red-500 hover:text-red-700" title="Delete Class"><TrashIcon className="w-5 h-5"/></button>
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
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
                            <button onClick={handleCloseModal} className="text-[--text-secondary] hover:text-[--text-primary]"><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Class Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <input name="classCode" value={formData.classCode || ''} onChange={handleChange} placeholder="Class Code" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <input name="academicYear" value={formData.academicYear || ''} onChange={handleChange} placeholder="Academic Year" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <select name="teacher" value={formData.teacher || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none">
                                <option value="">Assign Class Teacher</option>
                                {teachers.map(t => <option key={t._id} value={t._id}>{t.name} {t.surname}</option>)}
                            </select>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Classes;
