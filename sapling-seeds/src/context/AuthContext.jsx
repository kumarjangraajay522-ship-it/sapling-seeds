import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user_data');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse user data:", error);
            return null;
        }
    });
    const [token, setToken] = useState(localStorage.getItem('user_token') || null);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('user_token', data.token);
                    localStorage.setItem('user_data', JSON.stringify(data.user));
                    return { success: true };
                }
                return { success: false, message: data.message };
            }
            return { success: false, message: "Server returned an invalid response. Please check backend." };
        } catch (error) {
            return { success: false, message: "Server connection failed." };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_token');
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        // Trigger storage event for other components if needed
        window.dispatchEvent(new Event('storage'));
    };

    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
