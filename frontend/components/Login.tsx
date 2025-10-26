import React, { useState } from 'react';
import api from '../services/api';
import type { User } from '../types';
import { BookOpenIcon, EyeIcon, EyeOffIcon } from './Icons';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userID, setUserID] = useState('admin');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/school/signin', { userID, password });
      if (response.data.success) {
        onLogin(response.data.user, response.data.token);
      } else {
        setError(response.data.error || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] to-[#F9F3EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg border-4 border-orange-100">
            <BookOpenIcon className="w-10 h-10 text-[--primary]" />
          </div>
          <h1 className="text-3xl font-bold text-[--text-primary]">School ERP</h1>
          <p className="text-[--text-secondary] mt-2">Admin & Staff Portal</p>
        </div>

        <div className="bg-[--card] rounded-xl shadow-xl p-8 border border-[--card-border]">
          <h2 className="text-2xl font-bold text-[--text-primary] mb-6 text-center">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[--text-secondary] mb-2">User ID</label>
              <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="Enter your user ID"
                className="w-full px-4 py-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-secondary] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-[--card-border] rounded-lg bg-[--background] focus:outline-none focus:ring-2 focus:ring-[--primary] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-secondary] hover:text-[--text-primary]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[--primary] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[--primary-hover] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
