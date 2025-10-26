import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import type { Student } from '../../../types';

interface AttendanceLog {
    date: string;
    className: string;
    status: 'present' | 'absent' | 'late' | 'leave';
    remarks?: string;
}

const StudentsHistory: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [attendance, setAttendance] = useState<AttendanceLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/students');
                setStudents(response.data.students || response.data);
            } catch (err) {
                setError('Failed to fetch students.');
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!selectedStudent) return;
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`/attendance/user/${selectedStudent}`);
                setAttendance(response.data.attendance);
            } catch (err: any) {
                setError(err.response?.data?.error || 'No attendance records found.');
                setAttendance([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [selectedStudent]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'leave': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Attendance History</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Select Student</label>
                <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full md:w-1/2 p-2 border rounded mt-1">
                    <option value="">-- Select a Student --</option>
                    {students.map(s => <option key={s.userID} value={s.userID}>{s.name} {s.surname} ({s.userID})</option>)}
                </select>
            </div>
            
            {loading ? <p>Loading history...</p> : error ? <p className="text-red-500">{error}</p> : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((log, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{log.remarks || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentsHistory;
