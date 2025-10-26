import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Notice } from '../../../types';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';

const NoticeBoard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [formData, setFormData] = useState<any>({ target: { roles: ['all'] }});

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch upcoming/active notices
            const response = await api.get('/notification/upcoming');
            setNotices(response.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const handleOpenModal = (notice: Notice | null = null) => {
        setEditingNotice(notice);
        const targetRoles = notice?.target?.roles || ['all'];
        setFormData(notice ? { ...notice, target: { roles: targetRoles } } : { title: '', description: '', target: { roles: ['all'] }, expiryDate: '' });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingNotice) {
                await api.put(`/notification/update/${editingNotice._id}`, formData);
            } else {
                await api.post('/notification/create', formData);
            }
            fetchData();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save notice.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await api.delete(`/notification/delete/${id}`);
                fetchData();
            } catch (err) {
                setError('Failed to delete notice.');
            }
        }
    };
    

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[--text-primary]">Notice Board</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Notice
                </button>
            </div>

            {loading ? <p>Loading notices...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="space-y-4">
                    {notices.length > 0 ? notices.map(notice => (
                        <div key={notice._id} className="p-5 border border-[--card-border] rounded-lg bg-[--table-row-even] relative group">
                            <h3 className="font-bold text-lg text-[--text-primary]">{notice.title}</h3>
                            <p className="text-sm text-[--text-secondary] mb-2">Published on: {new Date(notice.publishDate).toLocaleDateString()}</p>
                            <p className="text-[--text-primary] whitespace-pre-wrap">{notice.description}</p>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(notice)} className="text-blue-500 hover:text-blue-700" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(notice._id)} className="text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-[--text-secondary] py-10">No active notices found.</p>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-[--card-border]">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h3>
                            <button onClick={handleCloseModal} className="text-[--text-secondary] hover:text-[--text-primary]"><XIcon className="w-6 h-6"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Title" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required/>
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" rows={5} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                            <div>
                                <label className="text-sm text-[--text-secondary]">Expiry Date (Optional)</label>
                                <input name="expiryDate" type="date" value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''} onChange={handleChange} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Notice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
