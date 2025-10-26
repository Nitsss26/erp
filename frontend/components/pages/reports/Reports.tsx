import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import type { Student } from '../../../types';

interface ReportData {
    studentInfo: {
        name: string;
        userID: string;
        className: string;
    };
    schoolInfo: {
        name: string;
        logoUrl?: string;
    };
    academicPeriod: {
        year: string;
        term: string;
    };
    subjectResults: {
        courseName: string;
        classWorkScore: number;
        examScore: number;
        totalScore: number;
        grade: string;
        remarks: string;
        maxScore: number;
    }[];
    summary: {
        totalMarksObtained: number;
        totalMaxMarks: number;
        overallPercentage: number;
    };
}

const Reports: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [term, setTerm] = useState('1');
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/students');
                setStudents(response.data || []);
            } catch (err) {
                console.error("Failed to fetch students", err);
                setError("Could not load student list.");
            }
        };
        fetchStudents();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedStudent || !academicYear || !term) {
            setError("Please select a student, academic year, and term.");
            return;
        }
        setLoading(true);
        setError('');
        setReport(null);
        try {
            const response = await api.get(`/students/student/report/${selectedStudent}/${academicYear}/${term}`);
            setReport(response.data.report);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to generate report. No records may exist for the selected period.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
        <style>{`
            @media print {
                body {
                  background-color: #fff !important;
                }
                body * {
                    visibility: hidden;
                }
                #print-section, #print-section * {
                    visibility: visible;
                }
                #print-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    border: none !important;
                    box-shadow: none !important;
                }
                .no-print {
                    display: none;
                }
            }
        `}</style>
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border] no-print">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Generate Student Report</h2>
            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]">
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.userID} value={s.userID}>{s.name} {s.surname} ({s.userID})</option>)}
                </select>
                <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]">
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                </select>
                <select value={term} onChange={e => setTerm(e.target.value)} className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary]">
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                </select>
                <button onClick={handleGenerateReport} disabled={loading} className="w-full bg-[--primary] text-white px-4 py-2 rounded-lg hover:bg-[--primary-hover] transition disabled:opacity-50 flex items-center justify-center">
                    {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
        </div>

        {report && (
            <div className="mt-6">
                 <div className="flex justify-end mb-4 no-print">
                    <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Print Report</button>
                </div>
                <div id="print-section" ref={reportRef} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">{report.schoolInfo.name}</h1>
                        <p className="text-lg text-gray-600">Student Academic Report</p>
                    </header>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-8 text-sm">
                        <div><strong>Student:</strong> {report.studentInfo.name}</div>
                        <div><strong>Student ID:</strong> {report.studentInfo.userID}</div>
                        <div><strong>Class:</strong> {report.studentInfo.className}</div>
                        <div><strong>Academic Year:</strong> {report.academicPeriod.year}</div>
                        <div><strong>Term:</strong> {report.academicPeriod.term}</div>
                    </div>
                    <table className="w-full text-sm text-left text-gray-600 mb-6">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3 text-center">Class Work ({report.subjectResults[0]?.maxScore * 0.4})</th>
                                <th className="px-6 py-3 text-center">Exam ({report.subjectResults[0]?.maxScore * 0.6})</th>
                                <th className="px-6 py-3 text-center">Total ({report.subjectResults[0]?.maxScore})</th>
                                <th className="px-6 py-3 text-center">Grade</th>
                                <th className="px-6 py-3">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.subjectResults.map((res, i) => (
                                <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{res.courseName}</td>
                                    <td className="px-6 py-4 text-center">{res.classWorkScore}</td>
                                    <td className="px-6 py-4 text-center">{res.examScore}</td>
                                    <td className="px-6 py-4 text-center font-semibold text-gray-900">{res.totalScore}</td>
                                    <td className="px-6 py-4 text-center font-bold">{res.grade}</td>
                                    <td className="px-6 py-4">{res.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     <footer className="border-t-2 border-gray-300 pt-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-semibold text-gray-800">
                        <div>Total Marks: <span className="font-bold">{report.summary.totalMarksObtained} / {report.summary.totalMaxMarks}</span></div>
                        <div>Overall Percentage: <span className="font-bold">{report.summary.overallPercentage}%</span></div>
                    </footer>
                </div>
            </div>
        )}
        </>
    );
};

export default Reports;
