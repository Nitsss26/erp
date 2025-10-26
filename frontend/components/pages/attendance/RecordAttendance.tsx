import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Class, Student } from '../../../types';

interface AttendanceRecord {
    attendee: string; // student._id
    status: 'present' | 'absent' | 'late' | 'leave';
    remarks?: string;
}

const RecordAttendance: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<Student[] & {name: string, userID: string}[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes');
                setClasses(response.data);
                if (response.data.length > 0) {
                    setSelectedClass(response.data[0]._id);
                }
            } catch (err) {
                setError('Failed to fetch classes.');
            }
        };
        fetchClasses();
    }, []);

    const fetchAttendanceData = useCallback(async () => {
        if (!selectedClass || !date) return;
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.get(`/attendance/class/${selectedClass}/${date}`);
            const { doc } = response.data;
            
            const studentList: any[] = doc.attendees.map((att: any) => ({
                _id: att.attendee,
                userID: att.userID,
                name: att.name,
            }));
            setStudents(studentList);
            
            const attendanceMap: Record<string, AttendanceRecord> = {};
            doc.attendees.forEach((att: any) => {
                attendanceMap[att.attendee] = {
                    attendee: att.attendee,
                    status: att.status,
                    remarks: att.remarks || ''
                };
            });
            setAttendance(attendanceMap);

        } catch (err) {
            setError('Failed to fetch attendance data. A new sheet will be created on save.');
            setStudents([]);
            setAttendance({});
        } finally {
            setLoading(false);
        }
    }, [selectedClass, date]);
    
    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...(prev[studentId] || {attendee: studentId}), status }
        }));
    };

    const handleSaveAttendance = async () => {
        if (!selectedClass || !date || Object.keys(attendance).length === 0) return;
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const payload = {
                classID: selectedClass,
                date,
                attendees: Object.values(attendance),
                academicYear: "2024-2025",
                term: "1",
                recordedBy: "mockadminid"
            };
            await api.post('/attendance/update', payload);
            setMessage('Attendance saved successfully!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save attendance.');
        } finally {
            setSaving(false);
        }
    };

    const statusConfig = {
        present: { label: 'Present', color: 'bg-green-600', hover: 'hover:bg-green-700' },
        absent: { label: 'Absent', color: 'bg-red-600', hover: 'hover:bg-red-700' },
        late: { label: 'Late', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
        leave: { label: 'Leave', color: 'bg-blue-500', hover: 'hover:bg-blue-600' }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Record Attendance</h2>
            {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4 p-3 bg-green-50 rounded-lg">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
                <div>
                    <label htmlFor="class" className="block text-sm font-medium text-[--text-secondary]">Class</label>
                    <select id="class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mt-1 block w-full p-2 border border-[--card-border] rounded-md bg-[--background] focus:outline-none focus:ring-1 focus:ring-[--primary]">
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-[--text-secondary]">Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full p-2 border border-[--card-border] rounded-md bg-[--background] focus:outline-none focus:ring-1 focus:ring-[--primary]" />
                </div>
                <button onClick={handleSaveAttendance} disabled={saving || loading} className="w-full bg-[--primary] text-white px-4 py-2 rounded-lg hover:bg-[--primary-hover] transition disabled:opacity-50 flex items-center justify-center">
                    {saving && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                    {saving ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>

            {loading ? <p className="text-center py-10">Loading students...</p> : (
                 <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                    <table className="w-full text-sm text-left text-[--text-secondary]">
                        <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border]`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{student.name} ({student.userID})</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {(['present', 'absent', 'late', 'leave'] as const).map(status => {
                                                const config = statusConfig[status];
                                                const isActive = attendance[student._id]?.status === status;
                                                return (
                                                    <button 
                                                        key={status} 
                                                        onClick={() => handleStatusChange(student._id, status)}
                                                        className={`px-3 py-1 text-xs rounded-full capitalize transition-all duration-200 ${isActive ? `${config.color} text-white shadow-md` : `bg-gray-200 text-gray-700 hover:bg-gray-300`}`}
                                                    >
                                                        {config.label}
                                                    </button>
                                                )
                                            })}
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

export default RecordAttendance;
