import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';
import type { Course } from '../../../types';

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<Partial<Course>>({});

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (err) {
            setError('Failed to fetch courses.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);
    
    const handleOpenModal = (course: Course | null = null) => {
        setEditingCourse(course);
        setFormData(course ? { ...course } : { name: '', courseCode: '', type: 'Core' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.put(`/courses/update/${editingCourse._id}`, formData);
            } else {
                await api.post('/courses/create', formData);
            }
            fetchCourses();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save course.');
            console.error(err);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/delete/${id}`);
                fetchCourses();
            } catch (err) {
                setError('Failed to delete course.');
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Course Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" /> Add Course
                </button>
            </div>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Course Name</th>
                                <th scope="col" className="px-6 py-3">Course Code</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, index) => (
                                <tr key={course._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{course.name}</td>
                                    <td className="px-6 py-4">{course.courseCode}</td>
                                    <td className="px-6 py-4">{course.type}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(course)} className="text-blue-500 hover:text-blue-700" title="Edit Course"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(course._id)} className="text-red-500 hover:text-red-700" title="Delete Course"><TrashIcon className="w-5 h-5"/></button>
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
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                            <button onClick={handleCloseModal} className="text-[--text-secondary] hover:text-[--text-primary]"><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Course Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <input name="courseCode" value={formData.courseCode || ''} onChange={handleChange} placeholder="Course Code" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <select name="type" value={formData.type || 'Core'} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none">
                                <option value="Core">Core</option>
                                <option value="Elective">Elective</option>
                            </select>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
