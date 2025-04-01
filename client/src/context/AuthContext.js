import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/auth/profile`, { withCredentials: true });
                setUser(res.data);
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, { withCredentials: true });
        setUser(res.data.user);
    };

    const logout = async () => {
        await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    const refreshAccessToken = async () => {
        try {
            const res = await axios.post(`${apiUrl}/api/auth/refresh-token`, {}, { withCredentials: true });
            setUser(res.data.user);
            setSessionTimeout(false);
        } catch (error) {
            setUser(null);
            setSessionTimeout(true);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refreshAccessToken();
        }, 5 * 60 * 1000); // Refresh token every 5 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, sessionTimeout }}>
            {children}
            {sessionTimeout && <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'red', color: 'white', padding: '10px' }}>Session expired! Please log in again.</div>}
        </AuthContext.Provider>
    );
};

export default AuthContext;