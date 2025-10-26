import React, { useState, useEffect, useCallback } from 'react';
import type { Staff } from '../../../types';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, SearchIcon } from '../../Icons';

const AllStaff: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [formData, setFormData] = useState<Partial<Staff>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStaff = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers');
            setStaff(response.data);
        } catch (err) {
            setError('Failed to fetch staff.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);
    
    const handleOpenModal = (member: Staff | null = null) => {
        setEditingStaff(member);
        setFormData(member ? { ...member } : { name: '', surname: '', email: '', role: 'teacher', mobilenumber: '' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                await api.put(`/teachers/update/${editingStaff.userID}`, formData);
            } else {
                await api.post('/teachers/create', formData);
            }
            fetchStaff();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save staff member.');
        }
    };
    
    const handleDelete = async (userID: string) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.delete(`/teachers/delete/${userID}`);
                fetchStaff();
            } catch (err) {
                setError('Failed to delete staff member.');
            }
        }
    };
    
    const filteredStaff = staff.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.surname && member.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        member.userID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Staff Management</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" /> Add Staff
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
                            {[...Array(5)].map((_, j) => <div key={j}></div>)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Staff ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Phone</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((member, index) => (
                                <tr key={member._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{member.userID}</td>
                                    <td className="px-6 py-4">{member.name} {member.surname}</td>
                                    <td className="px-6 py-4 capitalize">{member.role}</td>
                                    <td className="px-6 py-4">{member.mobilenumber}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:text-blue-700" title="Edit Staff"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(member.userID)} className="text-red-500 hover:text-red-700" title="Delete Staff"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 transition-opacity">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                            <button onClick={handleCloseModal} className="text-[--text-secondary] hover:text-[--text-primary]"><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="First Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required/>
                                <input name="surname" value={formData.surname || ''} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required/>
                                <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required/>
                                <input name="mobilenumber" value={formData.mobilenumber || ''} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required/>
                                 <select name="role" value={formData.role || 'teacher'} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none">
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                    <option value="support-staff">Support Staff</option>
                                </select>
                                <input name="qualifications" value={formData.qualifications || ''} onChange={handleChange} placeholder="Qualifications" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"/>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllStaff;
