import React, { useState, useEffect, useCallback } from 'react';
import type { Student, Class } from '../../../types';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, SearchIcon } from '../../Icons';

const AllStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<Partial<Student> & { class?: string }>({});
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            const [studentsRes, classesRes] = await Promise.all([
                api.get('/students'),
                api.get('/classes'),
            ]);
            setStudents(studentsRes.data || []);
            setClasses(classesRes.data || []);
        } catch (err) {
            setError('Failed to fetch students.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);
    
    const handleOpenModal = (student: Student | null = null) => {
        setEditingStudent(student);
        setFormData(student ? { ...student, class: student.classID?._id || '' } : { name: '', surname: '', email: '', mobilenumber: '', class: '', dateofBirth: '', physicalAddress: '', enrollmentStatus: 'active', guardian: [{ name: '', mobile: '', relationship: '' }] });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (formData.guardian) {
            const updatedGuardians = [...formData.guardian];
            updatedGuardians[index] = { ...updatedGuardians[index], [e.target.name]: e.target.value };
            setFormData({ ...formData, guardian: updatedGuardians });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, classID: formData.class };

            if (editingStudent) {
                await api.put(`/students/update/${editingStudent.userID}`, payload);
            } else {
                await api.post('/students/create', payload);
            }
            fetchStudents();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save student.');
            console.error(err);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/delete/${id}`);
                fetchStudents();
            } catch (err) {
                setError('Failed to delete student.');
                console.error(err);
            }
        }
    };
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.surname && student.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.userID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Student Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" /> Add Student
                </button>
            </div>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--text-secondary]" />
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]"
                />
            </div>
            
            {loading ? (
                <div className="table-skeleton">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton-row animate-pulse">
                            {[...Array(6)].map((_, j) => <div key={j}></div>)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Phone</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{student.userID}</td>
                                    <td className="px-6 py-4">{student.name} {student.surname}</td>
                                    <td className="px-6 py-4">{student.classID?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{student.mobilenumber}</td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${student.enrollmentStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {student.enrollmentStatus}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(student)} className="text-blue-500 hover:text-blue-700" title="Edit Student"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(student.userID)} className="text-red-500 hover:text-red-700" title="Delete Student"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 transition-opacity">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                            <button onClick={handleCloseModal} className="text-[--text-secondary] hover:text-[--text-primary]"><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="First Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required/>
                                <input name="surname" value={formData.surname || ''} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required/>
                                <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                                <select name="class" value={formData.class || ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none">
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <input name="dateofBirth" type="date" value={formData.dateofBirth ? new Date(formData.dateofBirth).toISOString().split('T')[0] : ''} onChange={handleChange} placeholder="Date of Birth" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                                <input name="mobilenumber" value={formData.mobilenumber || ''} onChange={handleChange} placeholder="Phone" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                                <input name="physicalAddress" value={formData.physicalAddress || ''} onChange={handleChange} placeholder="Address" className="w-full p-2 border border-[--card-border] rounded bg-[--background] md:col-span-2 focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                            </div>
                             <div>
                                <h4 className="font-semibold mt-4 mb-2 text-[--text-primary]">Guardian Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input name="name" value={formData.guardian?.[0]?.name || ''} onChange={(e) => handleGuardianChange(e, 0)} placeholder="Guardian Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                                    <input name="mobile" value={formData.guardian?.[0]?.mobile || ''} onChange={(e) => handleGuardianChange(e, 0)} placeholder="Guardian Mobile" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                                    <input name="relationship" value={formData.guardian?.[0]?.relationship || ''} onChange={(e) => handleGuardianChange(e, 0)} placeholder="Relationship" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllStudents;
