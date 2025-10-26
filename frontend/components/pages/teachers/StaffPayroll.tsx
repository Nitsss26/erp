import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Staff, Payrow, Deduction } from '../../../types';
import { BanknotesIcon } from '../../Icons';

const StaffPayroll: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [payrows, setPayrows] = useState<Payrow[]>([]);
    const [deductions, setDeductions] = useState<Deduction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [staffRes, payrowRes, deductionRes] = await Promise.all([
                api.get('/teachers'),
                api.get('/payrow'),
                api.get('/deductions')
            ]);
            setStaff(staffRes.data);
            setPayrows(payrowRes.data);
            setDeductions(deductionRes.data);
        } catch (err) {
            setError('Failed to load payroll data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const calculatePayroll = (member: Staff) => {
        const payrow = payrows.find(p => p.name === member.position);
        const gross = (payrow?.basicSalary || 0) + (payrow?.allowance || 0) + (payrow?.bonus || 0);
        
        const staffDeductions = deductions.filter(d => d.person._id === member._id && new Date(d.date).getMonth() + 1 === month && new Date(d.date).getFullYear() === year);
        const totalDeductions = staffDeductions.reduce((sum, d) => sum + d.amount, 0);

        return { gross, totalDeductions, net: gross - totalDeductions };
    };

    if (loading) return <p>Loading...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[--text-primary] flex items-center gap-2">
                    <BanknotesIcon className="w-6 h-6"/>
                    Staff Payroll Summary for {new Date(year, month-1).toLocaleString('default', { month: 'long' })} {year}
                </h2>
            </div>
             <div className="overflow-x-auto rounded-lg border border-[--card-border]">
                <table className="w-full text-sm text-left text-[--text-secondary]">
                    <thead className="text-xs text-[--text-primary] uppercase bg-[--table-header]">
                        <tr>
                            <th className="px-6 py-3">Staff Member</th>
                            <th className="px-6 py-3 text-right">Gross Salary</th>
                            <th className="px-6 py-3 text-right">Deductions</th>
                            <th className="px-6 py-3 text-right">Net Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((member, index) => {
                            const payroll = calculatePayroll(member);
                            return (
                                <tr key={member._id} className={`${index % 2 === 0 ? 'bg-[--table-row-even]' : 'bg-[--card]'} border-b border-[--card-border] hover:bg-orange-100/50`}>
                                    <td className="px-6 py-4 font-medium text-[--text-primary]">{member.name} {member.surname}</td>
                                    <td className="px-6 py-4 text-right">₹{payroll.gross.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right text-red-600">₹{payroll.totalDeductions.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600">₹{payroll.net.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffPayroll;
