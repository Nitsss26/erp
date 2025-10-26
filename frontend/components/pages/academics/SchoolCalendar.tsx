import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from '../../Icons';
import type { CalendarEvent } from '../../../types';

const SchoolCalendar: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<CalendarEvent>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/calendar/upcoming');
            setEvents(response.data);
        } catch (err) {
            setError('Failed to fetch calendar events.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleOpenModal = (date?: Date) => {
        setFormData({
            date: (date || new Date()).toISOString().split('T')[0],
            type: 'Event'
        });
        setIsModalOpen(true);
        setError('');
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/calendar/create', formData);
            fetchEvents();
            handleCloseModal();
        } catch(err: any) {
            setError(err.response?.data?.error || "Failed to save event");
        }
    };
    
    const getEventTypeColor = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'Exam': return 'bg-red-100 text-red-800';
            case 'Holiday': return 'bg-green-100 text-green-800';
            case 'Event': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center px-4 py-3">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-6 h-6" /></button>
            <h2 className="text-lg font-bold text-[--text-primary]">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-6 h-6" /></button>
        </div>
    );

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return <div className="grid grid-cols-7 text-center text-sm font-semibold text-[--text-secondary]">{days.map(day => <div key={day} className="py-2">{day}</div>)}</div>;
    };

    const renderCells = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        if (monthEnd.getDay() !== 6) {
          endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
        }
        
        const rows = [];
        let day = new Date(startDate);

        while (day <= endDate) {
            const weekRow = [];
            for (let i = 0; i < 7; i++) {
                const cloneDay = new Date(day);
                const eventsOnDay = events.filter(e => new Date(e.date).toDateString() === cloneDay.toDateString());
                weekRow.push(
                    <div
                        key={day.toString()}
                        className={`border border-[--card-border] p-2 h-32 flex flex-col cursor-pointer transition-colors hover:bg-orange-50/50 ${day.getMonth() !== currentDate.getMonth() ? 'bg-[--table-row-even] text-[--text-secondary]' : 'bg-[--card]'}`}
                        onClick={() => handleOpenModal(cloneDay)}
                    >
                        <span className={`font-medium self-end ${new Date().toDateString() === cloneDay.toDateString() ? 'text-white bg-[--primary] rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{day.getDate()}</span>
                        <div className="flex-1 overflow-y-auto text-xs mt-1 space-y-1">
                            {eventsOnDay.map(e => <div key={e._id} className={`px-1 py-0.5 rounded ${getEventTypeColor(e.type)} truncate`}>{e.title}</div>)}
                        </div>
                    </div>
                );
                day.setDate(day.getDate() + 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{weekRow}</div>);
        }
        return <div>{rows}</div>;
    };


    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary]">School Calendar</h2>
                <button onClick={() => handleOpenModal()} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
                    <PlusIcon className="w-5 h-5" /> Add Event
                </button>
            </div>
            
            <div className="calendar border border-[--card-border] rounded-lg">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[--card-border]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[--text-primary]">Add New Event</h3>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <input name="title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Event Title" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                             <textarea name="description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                             <input name="date" type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border border-[--card-border] rounded bg-[--background]" required />
                             <select name="type" value={formData.type || 'Event'} onChange={e => setFormData({...formData, type: e.target.value as CalendarEvent['type']})} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                                 <option value="Event">Event</option>
                                 <option value="Holiday">Holiday</option>
                                 <option value="Exam">Exam</option>
                                 <option value="Other">Other</option>
                             </select>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolCalendar;
