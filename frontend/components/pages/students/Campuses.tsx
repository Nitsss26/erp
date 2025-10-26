import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, PencilIcon, TrashIcon, SearchIcon, BuildingOfficeIcon } from '../../Icons';

interface Campus {
    _id: string;
    name: string;
    location?: string;
    description?: string;
}

const Campuses: React.FC = () => {
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
    const [formData, setFormData] = useState<Partial<Campus>>({});
    const [searchTerm, setSearchTerm] = useState('');


    const fetchCampuses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/campuses');
            setCampuses(response.data);
        } catch (err) {
            setError('Failed to fetch campuses.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampuses();
    }, [fetchCampuses]);
    
    const handleOpenModal = (campus: Campus | null = null) => {
        setEditingCampus(campus);
        setFormData(campus ? { ...campus } : { name: '', location: '', description: '' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCampus(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCampus) {
                await api.put(`/campuses/update/${editingCampus._id}`, formData);
            } else {
                await api.post('/campuses/create', formData);
            }
            fetchCampuses();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save campus.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this campus? This may affect associated students and staff.')) {
            try {
                await api.delete(`/campuses/delete/${id}`);
                fetchCampuses();
            } catch (err) {
                setError('Failed to delete campus.');
            }
        }
    };
    
    const filteredCampuses = campuses.filter(campus => 
        campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (campus.location && campus.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary] flex items-center gap-2">
                    <BuildingOfficeIcon className="w-6 h-6"/> Campus Management
                </h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <PlusIcon className="w-5 h-5" /> Add Campus
                </button>
            </div>
             <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--text-secondary]" />
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]"
                />
            </div>
            
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Campus Name</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampuses.map((campus, index) => (
                                 <tr key={campus._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-semibold text-[--text-primary]">{campus.name}</td>
                                    <td className="px-6 py-4">{campus.location}</td>
                                    <td className="px-6 py-4 truncate max-w-sm">{campus.description}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(campus)} className="text-blue-500 hover:text-blue-700" title="Edit Campus"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(campus._id)} className="text-red-500 hover:text-red-700" title="Delete Campus"><TrashIcon className="w-5 h-5"/></button>
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
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingCampus ? 'Edit Campus' : 'Add New Campus'}</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Campus Name" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" required />
                            <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" />
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-[--card-border] rounded bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none" rows={3} />
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition">Save Campus</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Campuses;
