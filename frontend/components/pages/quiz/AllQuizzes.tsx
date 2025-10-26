import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Class, Course, Quiz, Question } from '../../../types';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from '../../Icons';

const AllQuizzes: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [quizFormData, setQuizFormData] = useState<any>({});

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [managingQuiz, setManagingQuiz] = useState<Quiz | null>(null);
    const [questionFormData, setQuestionFormData] = useState<Partial<Question>>({ options: ['', '', '', ''] });


    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [quizRes, classRes, courseRes] = await Promise.all([
                api.get('/quiz'),
                api.get('/classes'),
                api.get('/courses'),
            ]);
            setQuizzes(quizRes.data);
            setClasses(classRes.data);
            setCourses(courseRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const handleOpenQuizModal = (quiz: Quiz | null = null) => {
        setEditingQuiz(quiz);
        setQuizFormData(quiz ? { ...quiz, classID: quiz.classID?._id, courseID: quiz.courseID?._id } : { title: '', description: '', classID: '', courseID: '', totalTime: 15 });
        setIsQuizModalOpen(true);
    };
    const handleCloseQuizModal = () => setIsQuizModalOpen(false);

    const handleQuizSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingQuiz) {
                await api.put(`/quiz/${editingQuiz._id}`, quizFormData);
            } else {
                await api.post('/quiz/create', quizFormData);
            }
            fetchData();
            handleCloseQuizModal();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save quiz.');
        }
    };
    
    const handleOpenQuestionModal = (quiz: Quiz) => {
        setManagingQuiz(quiz);
        setQuestionFormData({ question: '', options: ['', '', '', ''], answer: '' });
        setIsQuestionModalOpen(true);
    };
    const handleCloseQuestionModal = () => setIsQuestionModalOpen(false);
    
    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!managingQuiz) return;
        try {
            await api.post(`/quiz/${managingQuiz._id}/add-question`, questionFormData);
            const updatedQuizzes = await api.get('/quiz'); // Refetch to update question list
            setQuizzes(updatedQuizzes.data);
            const updatedManagingQuiz = updatedQuizzes.data.find((q: Quiz) => q._id === managingQuiz._id);
            if (updatedManagingQuiz) {
              setManagingQuiz(updatedManagingQuiz);
            }
            setQuestionFormData({ question: '', options: ['', '', '', ''], answer: '' }); // Reset form
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add question.');
        }
    };
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(questionFormData.options || [])];
        newOptions[index] = value;
        setQuestionFormData({...questionFormData, options: newOptions});
    }

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">Quiz Management</h2>
                <button onClick={() => handleOpenQuizModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Create Quiz
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map(quiz => (
                        <div key={quiz._id} className="p-4 border border-[--card-border] rounded-lg bg-[--table-row-even] flex flex-col justify-between transition hover:shadow-md">
                            <div>
                                <h3 className="font-bold text-lg text-[--text-primary]">{quiz.title}</h3>
                                <p className="text-sm text-[--text-secondary]">{quiz.classID?.name} - {quiz.courseID?.name}</p>
                                <p className="text-sm my-2">{quiz.questions.length} Questions</p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button onClick={() => handleOpenQuizModal(quiz)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleOpenQuestionModal(quiz)} className="text-green-600 hover:text-green-800 font-semibold text-sm">Manage Questions</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Quiz Create/Edit Modal */}
            {isQuizModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[--card-border]">
                        <h3 className="text-xl font-semibold mb-4 text-[--text-primary]">{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h3>
                        <form onSubmit={handleQuizSubmit} className="space-y-4">
                           <input name="title" value={quizFormData.title || ''} onChange={e => setQuizFormData({...quizFormData, title: e.target.value})} placeholder="Quiz Title" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                           <textarea name="description" value={quizFormData.description || ''} onChange={e => setQuizFormData({...quizFormData, description: e.target.value})} placeholder="Description" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                           <select name="classID" value={quizFormData.classID || ''} onChange={e => setQuizFormData({...quizFormData, classID: e.target.value})} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                               <option value="">Select Class</option>
                               {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                           </select>
                           <select name="courseID" value={quizFormData.courseID || ''} onChange={e => setQuizFormData({...quizFormData, courseID: e.target.value})} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                               <option value="">Select Course</option>
                               {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                           </select>
                           <input name="totalTime" type="number" value={quizFormData.totalTime || ''} onChange={e => setQuizFormData({...quizFormData, totalTime: e.target.value})} placeholder="Total Time (minutes)" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                           <div className="flex justify-end gap-4 mt-6">
                               <button type="button" onClick={handleCloseQuizModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                               <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Quiz</button>
                           </div>
                        </form>
                    </div>
                 </div>
            )}

             {/* Question Management Modal */}
            {isQuestionModalOpen && managingQuiz && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[--card-border]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-[--text-primary]">Manage Questions for {managingQuiz.title}</h3>
                             <button onClick={handleCloseQuestionModal}><XIcon className="w-6 h-6"/></button>
                        </div>
                        <div className="mb-6 max-h-48 overflow-y-auto pr-2">
                            <h4 className="font-semibold mb-2">Existing Questions ({managingQuiz.questions.length})</h4>
                            <ul className="list-decimal list-inside text-sm space-y-2">
                                {managingQuiz.questions.map((q, i) => <li key={i}>{q.question} <span className="text-green-600 font-semibold ml-2">(Answer: {q.answer})</span></li>)}
                            </ul>
                        </div>
                        <hr className="my-6 border-[--card-border]"/>
                        <h4 className="font-semibold mb-4 text-[--text-primary]">Add New Question</h4>
                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                           <textarea name="question" value={questionFormData.question || ''} onChange={e => setQuestionFormData({...questionFormData, question: e.target.value})} placeholder="Question text" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                           <div className="grid grid-cols-2 gap-4">
                            {(questionFormData.options || []).map((opt, i) => (
                               <input key={i} value={opt} onChange={e => handleOptionChange(i, e.target.value)} placeholder={`Option ${i+1}`} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required/>
                            ))}
                           </div>
                           <select name="answer" value={questionFormData.answer || ''} onChange={e => setQuestionFormData({...questionFormData, answer: e.target.value})} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required>
                                <option value="">Select Correct Answer</option>
                                {(questionFormData.options || []).filter(o => o).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                           </select>

                           <div className="flex justify-end gap-4 mt-6">
                               <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Add Question</button>
                           </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default AllQuizzes;
