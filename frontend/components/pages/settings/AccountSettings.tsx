import React, { useState } from 'react';
import api from '../../../services/api';
import type { User } from '../../../types';

const AccountSettings: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                setError("Could not identify user. Please log in again.");
                setLoading(false);
                return;
            }
            
            // This is a mock API call, in a real app it would be a POST to /school/change/password/:id
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (oldPassword !== '123') { // Mock check
              throw new Error("Wrong old password");
            }

            setSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border] max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-[--text-primary] mb-6">Account Settings</h2>
            
            <div className="p-6 border border-[--card-border] rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>
                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 bg-green-50 p-3 rounded-lg">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[--text-secondary]">Old Password</label>
                        <input 
                            type="password"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-[--card-border] rounded-md bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[--text-secondary]">New Password</label>
                        <input 
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-[--card-border] rounded-md bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[--text-secondary]">Confirm New Password</label>
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-[--card-border] rounded-md bg-[--background] focus:ring-1 focus:ring-[--primary] focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover] disabled:opacity-50 flex items-center justify-center">
                            {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;
