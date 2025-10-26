import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { Staff, Payrow, Deduction } from '../../../types';
import { BanknotesIcon } from '../../Icons';

const SalaryPayment: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [payrows, setPayrows] = useState<Payrow[]>([]);
    const [deductions, setDeductions] = useState<Deduction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [payslip, setPayslip] = useState<{ gross: number, totalDeductions: number, net: number } | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

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
            if (staffRes.data.length > 0) {
                setSelectedStaffId(staffRes.data[0]._id);
            }
        } catch (err) {
            setError('Failed to load necessary data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedStaffId) {
            const member = staff.find(s => s._id === selectedStaffId);
            if (member) {
                const payrow = payrows.find(p => p.name === member.position);
                const gross = (payrow?.basicSalary || 0) + (payrow?.allowance || 0) + (payrow?.bonus || 0);
                
                const staffDeductions = deductions.filter(d => d.person._id === selectedStaffId && new Date(d.date).getMonth() + 1 === month && new Date(d.date).getFullYear() === year);
                const totalDeductions = staffDeductions.reduce((sum, d) => sum + d.amount, 0);

                setPayslip({ gross, totalDeductions, net: gross - totalDeductions });
            }
        } else {
            setPayslip(null);
        }
    }, [selectedStaffId, month, year, staff, payrows, deductions]);

    const handleRecordPayment = async () => {
        if (!selectedStaffId || !payslip) {
            setError('Please select a staff member and ensure payslip is calculated.');
            return;
        }
        setError('');
        setMessage('');
        setPaymentLoading(true);
        try {
            const member = staff.find(s => s._id === selectedStaffId);
            const transactionPayload = {
                amount: payslip.gross,
                netAmount: payslip.net,
                category: 'payroll',
                type: 'expense',
                description: `Salary for ${member?.name} ${member?.surname} for ${month}/${year}`,
                teacherID: selectedStaffId,
                paymentMethod: 'bank_transfer',
                academicYear: `${year}-${year+1}`,
                month: month.toString(),
            };
            await api.post('/transactions/create', transactionPayload);
            setMessage('Salary payment recorded successfully.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to record payment.');
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-4 flex items-center gap-2">
                <BanknotesIcon className="w-6 h-6"/>
                Record Salary Payment
            </h2>
            {error && <p className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{error}</p>}
            {message && <p className="p-3 bg-green-100 text-green-700 rounded-md mb-4">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border border-[--card-border] rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-[--text-secondary]">Select Staff</label>
                    <select value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)} className="w-full p-2 border border-[--card-border] rounded bg-[--background] mt-1">
                        {staff.map(s => <option key={s._id} value={s._id}>{s.name} {s.surname} ({s.userID})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[--text-secondary]">Month</label>
                    <input type="number" value={month} onChange={e => setMonth(Number(e.target.value))} placeholder="Month (1-12)" className="w-full p-2 border border-[--card-border] rounded bg-[--background] mt-1" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-[--text-secondary]">Year</label>
                    <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} placeholder="Year" className="w-full p-2 border border-[--card-border] rounded bg-[--background] mt-1" />
                </div>
            </div>

            {payslip && selectedStaffId && (
                <div className="p-6 border-2 border-dashed border-[--card-border] rounded-xl bg-[--background] space-y-4 max-w-md mx-auto">
                    <h3 className="font-bold text-lg text-center text-[--text-primary]">Payslip for {staff.find(s=>s._id === selectedStaffId)?.name}</h3>
                    <p className="text-center text-sm text-[--text-secondary] -mt-2">{new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</p>
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[--text-secondary]">Gross Salary:</span> 
                            <span className="font-semibold text-[--text-primary]">₹{payslip.gross.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-600">
                            <span className="text-sm">Deductions:</span> 
                            <span className="font-semibold">- ₹{payslip.totalDeductions.toFixed(2)}</span>
                        </div>
                    </div>
                    <hr className="border-[--card-border] my-2"/>
                    <div className="flex justify-between items-center font-bold text-xl text-green-700">
                        <span>Net Salary:</span> 
                        <span>₹{payslip.net.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-end pt-4">
                        <button onClick={handleRecordPayment} disabled={paymentLoading} className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center">
                             {paymentLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            Record Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryPayment;
