import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Check if there's a persisted session
        const lastUser = localStorage.getItem('fq_last_user');
        if (lastUser) {
            setUser(lastUser);
        }
    }, []);

    const getAuthDb = () => {
        return JSON.parse(localStorage.getItem('fq_auth_db')) || {};
    };

    const login = (username, password) => {
        setAuthError(null);
        if (!username || !password) {
            setAuthError("Username and password required");
            return false;
        }

        const db = getAuthDb();
        if (db[username] && db[username] === password) {
            setUser(username);
            localStorage.setItem('fq_last_user', username);
            return true;
        } else {
            setAuthError("Invalid username or password");
            return false;
        }
    };

    const register = (username, password) => {
        setAuthError(null);
        if (!username || !password) {
            setAuthError("Username and password required");
            return false;
        }

        const db = getAuthDb();
        const lowerUsername = username.toLowerCase();

        // Check for duplicate (case-insensitive)
        const userExists = Object.keys(db).some(k => k.toLowerCase() === lowerUsername);

        if (userExists) {
            setAuthError("Username already taken (try another)");
            return false;
        }

        // Save new user
        db[username] = password;
        localStorage.setItem('fq_auth_db', JSON.stringify(db));

        // Auto login
        setUser(username);
        localStorage.setItem('fq_last_user', username);
        return true;
    };

    const guestLogin = () => {
        setAuthError(null);
        setUser('Guest');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fq_last_user');
        setAuthError(null);
    };

    return (
        <AuthContext.Provider value={{ user, authError, login, register, guestLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
