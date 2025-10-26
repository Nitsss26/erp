import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import type { User } from './types';
import { setAuthToken, mockApi } from './services/api';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize mock data on first load
        mockApi.init();

        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken);
        }
        setLoading(false);
    }, []);

    const handleLogin = (loggedInUser: User, authToken: string) => {
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', authToken);
        setUser(loggedInUser);
        setToken(authToken);
        setAuthToken(authToken);
    };

    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setAuthToken(null);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[--background]">
                <div className="w-16 h-16 border-4 border-[--primary] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {token && user ? (
                <Layout user={user} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
