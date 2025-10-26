import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { LeaveApplication } from '../../../types';
import { CheckBadgeIcon, XCircleIcon } from '../../Icons';

const LeaveManagement: React.FC = () => {
    const [applications, setApplications] = useState<LeaveApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/leave-applications');
            setApplications(response.data);
        } catch (err) {
            setError('Failed to fetch leave applications.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        try {
            // In a real app, this would also involve a PUT request
            // For mock, we just update the state
            setApplications(apps => apps.map(app => app._id === id ? { ...app, status } : app));
            // Example of how the API call would look:
            // await api.put(`/leave-applications/${id}/status`, { status });
            // fetchApplications();
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredApplications = applications.filter(app => filter === 'all' || app.status === filter);

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Leave Management</h2>
            
            <div className="mb-4">
                <div className="flex space-x-2">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${filter === f ? 'bg-[--primary] text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <p>Loading applications...</p> : error ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Applicant</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Dates</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map((app, index) => (
                                <tr key={app._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{app.applicant.name} ({app.applicant.userID})</td>
                                    <td className="px-6 py-4 capitalize">{app.applicantType.slice(0, -1)}</td>
                                    <td className="px-6 py-4">{new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{app.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {app.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusUpdate(app._id, 'approved')} className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1"><CheckBadgeIcon className="w-5 h-5"/>Approve</button>
                                                <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><XCircleIcon className="w-5 h-5"/>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {filteredApplications.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">No applications found for this filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
