import React, { useState, useEffect } from 'react';
import { IdentificationIcon } from '../../Icons';
import api from '../../../services/api';
import type { Class, Student } from '../../../types';

const AdmitCard: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/classes').then(res => setClasses(res.data));
    }, []);

    const handleGenerate = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            const response = await api.get(`/students/class/${selectedClass}`);
            setStudents(response.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="space-y-6">
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Generate Admit Cards</h2>
            <div className="flex items-end gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Select Class</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full p-2 border rounded mt-1 bg-[--background]">
                        <option value="">-- Select Class --</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={!selectedClass || loading} className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] disabled:opacity-50">
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </div>
        {students.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {students.map(student => (
                    <div key={student._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center relative">
                         <div className="absolute top-4 right-4 w-24 h-24 bg-gray-200 border">
                            <span className="text-xs text-gray-500 flex items-center justify-center h-full">Photo</span>
                         </div>
                         <h3 className="text-lg font-bold text-gray-800">Zenith International School</h3>
                         <p className="text-sm text-gray-500">Admit Card - Mid-Term Exam 2024</p>
                         <div className="text-left mt-6 space-y-2">
                            <p><strong>Name:</strong> {student.name} {student.surname}</p>
                            <p><strong>Student ID:</strong> {student.userID}</p>
                            <p><strong>Class:</strong> {student.classID?.name}</p>
                         </div>
                    </div>
                ))}
             </div>
        )}
    </div>
  );
};

export default AdmitCard;
