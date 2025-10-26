import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Homework, Class, Course, Staff } from '../../../types';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';

const HomeworkPage: React.FC = () => {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
    const [formData, setFormData] = useState<any>({});

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [hwRes, classRes, courseRes, teacherRes] = await Promise.all([
                api.get('/homeworks'),
                api.get('/classes'),
                api.get('/courses'),
                api.get('/teachers'),
            ]);
            setHomeworks(hwRes.data);
            setClasses(classRes.data);
            setCourses(courseRes.data);
            setTeachers(teacherRes.data.filter((t: Staff) => t.role === 'teacher'));
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

    const handleOpenModal = (hw: Homework | null = null) => {
        setEditingHomework(hw);
        setFormData(hw ? {
            ...hw,
            classID: hw.classID?._id || '',
            courseID: hw.courseID?._id || '',
            teacherID: hw.teacherID?._id || '',
            dueDate: new Date(hw.dueDate).toISOString().split('T')[0]
        } : { title: '', description: '', dueDate: '', classID: '', courseID: '', teacherID: '', academicYear: '2024-2025' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHomework(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingHomework) {
                await api.put(`/homeworks/update/${editingHomework._id}`, formData);
            } else {
                await api.post('/homeworks/upload', formData);
            }
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save homework.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this homework?')) {
            try {
                await api.delete(`/homeworks/delete/${id}`);
                fetchData();
            } catch (err) {
                setError('Failed to delete homework.');
            }
        }
    };

    if (error && !isModalOpen) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Homework Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Homework
                </button>
            </div>
            
            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {homeworks.map((hw, index) => (
                                <tr key={hw._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{hw.title}</td>
                                    <td className="px-6 py-4">{hw.classID?.name}</td>
                                    <td className="px-6 py-4">{hw.courseID?.name}</td>
                                    <td className="px-6 py-4">{new Date(hw.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(hw)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(hw._id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-lg w-full max-w-2xl border border-[--card-border] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingHomework ? 'Edit Homework' : 'Add New Homework'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Title" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" rows={3} required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="dueDate" type="date" value={formData.dueDate || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                                <select name="classID" value={formData.classID || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <select name="courseID" value={formData.courseID || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <select name="teacherID" value={formData.teacherID || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                                    <option value="">Select Teacher</option>
                                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name} {t.surname}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Homework</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkPage;
