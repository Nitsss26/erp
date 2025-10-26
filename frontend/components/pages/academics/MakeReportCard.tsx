import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Class, Course, SBA, StudentScore } from '../../../types';

const MakeReportCard: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [term, setTerm] = useState('1');
    const [sba, setSba] = useState<SBA | null>(null);
    const [scores, setScores] = useState<StudentScore[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [classRes, courseRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/courses'),
                ]);
                setClasses(classRes.data);
                setCourses(courseRes.data);
                if (classRes.data.length > 0) setSelectedClass(classRes.data[0]._id);
                if (courseRes.data.length > 0) setSelectedCourse(courseRes.data[0]._id);
            } catch (err) {
                setError('Failed to fetch initial data.');
            }
        };
        fetchInitialData();
    }, []);

    const fetchSBAData = useCallback(async () => {
        if (!selectedClass || !selectedCourse || !academicYear || !term) return;
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.get(`/sba/${selectedClass}/${selectedCourse}/${academicYear}/${term}`);
            setSba(response.data.doc);
            setScores(response.data.doc.scores.map((s: any) => ({
                ...s,
                studentID: {
                    _id: s.studentID,
                    name: s.name.split(' ')[0],
                    surname: s.name.split(' ')[1] || '',
                    userID: s.userID,
                }
            })));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch student scores. A new sheet will be created on save.');
            setSba(null);
            setScores([]);
        } finally {
            setLoading(false);
        }
    }, [selectedClass, selectedCourse, academicYear, term]);

    const handleScoreChange = (studentId: string, field: 'classWorkScore' | 'examScore', value: string) => {
        const numericValue = Number(value);
        setScores(prevScores => prevScores.map(score => {
            if (score.studentID._id === studentId) {
                const newScore = { ...score, [field]: numericValue };
                newScore.totalScore = (newScore.classWorkScore || 0) + (newScore.examScore || 0);
                return newScore;
            }
            return score;
        }));
    };

    const handleSaveScores = async () => {
        if (!sba) return;
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const payload = {
                ...sba,
                scores: scores.map(s => ({
                    studentID: s.studentID._id,
                    classWorkScore: s.classWorkScore,
                    examScore: s.examScore,
                })),
            };
            await api.put(`/sba/update/${sba._id}`, payload);
            setMessage('Scores saved successfully!');
        } catch (err) {
            setError('Failed to save scores.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Enter Student Scores</h2>
            {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4 p-3 bg-green-50 rounded-lg">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 items-end">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                </select>
                <select value={term} onChange={e => setTerm(e.target.value)} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                </select>
                <button onClick={fetchSBAData} disabled={loading} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center">
                    {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                    {loading ? 'Fetching...' : 'Fetch Scores'}
                </button>
            </div>
            
            {sba && (
                <>
                    <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                        <table className="w-full text-sm text-left text-[--text-secondary]">
                            <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                                <tr>
                                    <th className="px-6 py-3">Student</th>
                                    <th className="px-6 py-3">Classwork ({sba.maxClassWorkScore})</th>
                                    <th className="px-6 py-3">Exam ({sba.maxExamScore})</th>
                                    <th className="px-6 py-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((score, index) => (
                                    <tr key={score.studentID._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border]`}>
                                        <td className="px-6 py-2 font-medium text-[--text-primary]">{score.studentID.name} {score.studentID.surname}</td>
                                        <td className="px-6 py-2">
                                            <input type="number" value={score.classWorkScore} onChange={e => handleScoreChange(score.studentID._id, 'classWorkScore', e.target.value)} className="w-24 p-1 border border-[--card-border] rounded bg-[--background] text-center" />
                                        </td>
                                        <td className="px-6 py-2">
                                            <input type="number" value={score.examScore} onChange={e => handleScoreChange(score.studentID._id, 'examScore', e.target.value)} className="w-24 p-1 border border-[--card-border] rounded bg-[--background] text-center" />
                                        </td>
                                        <td className="px-6 py-2 font-semibold text-[--text-primary] text-center">{score.totalScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button onClick={handleSaveScores} disabled={saving} className="bg-[--primary] text-white px-6 py-2 rounded-lg hover:bg-[--primary-hover] transition disabled:opacity-50 flex items-center justify-center">
                            {saving && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {saving ? 'Saving...' : 'Save Scores'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MakeReportCard;
