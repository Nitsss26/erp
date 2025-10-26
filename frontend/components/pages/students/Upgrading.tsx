import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Class } from '../../../types';
import { ArrowTrendingUpIcon, IdentificationIcon } from '../../Icons';

const Upgrading: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);
    const [gradLoading, setGradLoading] = useState(false);

    // State for promotion
    const [fromClass, setFromClass] = useState('');
    const [toClass, setToClass] = useState('');
    const [promoYear, setPromoYear] = useState('2024-2025');

    // State for graduation
    const [gradClass, setGradClass] = useState('');

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/classes');
            const activeClasses = response.data.filter((c: Class) => !c.isArchived);
            setClasses(activeClasses);
            if (activeClasses.length > 0) {
                setFromClass(activeClasses[0]._id);
                setToClass(activeClasses.length > 1 ? activeClasses[1]._id : activeClasses[0]._id);
                setGradClass(activeClasses[activeClasses.length - 1]._id);
            }
        } catch (err) {
            setError('Failed to fetch classes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handlePromote = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!fromClass || !toClass || !promoYear) {
            setError('Please select classes and academic year for promotion.');
            return;
        }
        if (fromClass === toClass) {
            setError('"From Class" and "To Class" cannot be the same.');
            return;
        }
        if (!window.confirm(`Are you sure you want to promote all students from ${classes.find(c=>c._id === fromClass)?.name} to ${classes.find(c=>c._id === toClass)?.name}? This action cannot be undone.`)) {
            return;
        }
        
        setPromoLoading(true);
        try {
            const res = await api.post('/students/upgrade/class', { currentclass: fromClass, nextclass: toClass, academicYear: promoYear });
            setMessage(res.data.message || 'Students promoted successfully!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to promote students.');
        } finally {
            setPromoLoading(false);
        }
    };

    const handleGraduate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!gradClass) {
            setError('Please select a class to graduate.');
            return;
        }
         if (!window.confirm(`Are you sure you want to graduate all students from ${classes.find(c=>c._id === gradClass)?.name}? This will mark them as graduated and archive the class. This action cannot be undone.`)) {
            return;
        }
        
        setGradLoading(true);
        try {
            await api.post('/students/upgrade/graduate', { currentclass: gradClass });
            setMessage('Class graduated successfully!');
            fetchClasses(); // Re-fetch classes to remove the archived one from the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to graduate class.');
        } finally {
            setGradLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}
            {message && <div className="p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">{message}</div>}
            
            <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
                <h2 className="text-xl font-semibold text-[--text-primary] mb-4 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-[--primary]"/>
                    Promote Class
                </h2>
                <p className="text-sm text-[--text-secondary] mb-6">Move all active students from one class to the next academic class.</p>
                <form onSubmit={handlePromote} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[--text-secondary]">From Class</label>
                            <select value={fromClass} onChange={e => setFromClass(e.target.value)} className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary] mt-1">
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[--text-secondary]">To Class</label>
                            <select value={toClass} onChange={e => setToClass(e.target.value)} className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary] mt-1">
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[--text-secondary]">For Academic Year</label>
                            <input value={promoYear} onChange={e => setPromoYear(e.target.value)} placeholder="e.g., 2024-2025" className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary] mt-1" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={promoLoading || loading} className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] transition disabled:opacity-50 flex items-center justify-center">
                            {promoLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            Promote Students
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
                <h2 className="text-xl font-semibold text-[--text-primary] mb-4 flex items-center gap-2">
                    <IdentificationIcon className="w-6 h-6 text-blue-600"/>
                    Graduate Class
                </h2>
                 <p className="text-sm text-[--text-secondary] mb-6">Mark all students in the selected class as 'Graduated' and archive the class.</p>
                <form onSubmit={handleGraduate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[--text-secondary]">Class to Graduate</label>
                            <select value={gradClass} onChange={e => setGradClass(e.target.value)} className="w-full p-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary] mt-1">
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={gradLoading || loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center">
                            {gradLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            Graduate Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upgrading;
