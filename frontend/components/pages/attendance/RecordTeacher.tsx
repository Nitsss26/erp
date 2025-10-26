import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Staff } from '../../../types';

interface AttendanceRecord {
    attendee: string; // staff._id
    status: 'present' | 'absent' | 'late' | 'leave';
    remarks?: string;
}

const RecordTeacherAttendance: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAttendanceData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Backend doesn't have a direct "get teacher attendance for date" route,
            // so we fetch all staff and then check if a record exists. This is a simplified approach.
            const staffRes = await api.get('/teachers');
            setStaff(staffRes.data);
            
            // Create a default 'present' status for all staff
            const initialAttendance: Record<string, AttendanceRecord> = {};
            staffRes.data.forEach((member: Staff) => {
                initialAttendance[member._id] = { attendee: member._id, status: 'present' };
            });
            setAttendance(initialAttendance);
        } catch (err) {
            setError('Failed to fetch staff data.');
            setStaff([]);
            setAttendance({});
        } finally {
            setLoading(false);
        }
    }, [date]);
    
    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const handleStatusChange = (staffId: string, status: AttendanceRecord['status']) => {
        setAttendance(prev => ({
            ...prev,
            [staffId]: { ...(prev[staffId] || {attendee: staffId}), status }
        }));
    };

    const handleSaveAttendance = async () => {
        if (Object.keys(attendance).length === 0) return;
        try {
            const payload = {
                date,
                attendees: Object.values(attendance),
                attendeeType: "teachers", // Crucial for the backend model
                academicYear: "2024-2025", // Placeholder
                term: "1", // Placeholder
                recordedBy: JSON.parse(localStorage.getItem('user') || '{}')._id // Logged in admin
            };
            // Note: classID is not required for teacher attendance
            await api.post('/attendance/update', payload);
            alert('Teacher attendance saved successfully!');
        } catch (err) {
            setError('Failed to save attendance.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Teacher Attendance</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
                </div>
                <div className="flex items-end">
                    <button onClick={handleSaveAttendance} className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">Save Attendance</button>
                </div>
            </div>

            {loading ? <p>Loading staff...</p> : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Staff Name</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map(member => (
                                <tr key={member._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{member.name} {member.surname}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {(['present', 'absent', 'late', 'leave'] as const).map(status => (
                                                <button 
                                                    key={status} 
                                                    onClick={() => handleStatusChange(member._id, status)}
                                                    className={`px-3 py-1 text-xs rounded-full capitalize ${attendance[member._id]?.status === status ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecordTeacherAttendance;
