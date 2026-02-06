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
        const userRecord = db[username];

        if (!userRecord) {
            setAuthError("User not found");
            return false;
        }

        // Handle legacy string passwords vs new object storage
        const storedPassword = typeof userRecord === 'string' ? userRecord : userRecord.password;

        if (storedPassword === password) {
            setUser(username);
            localStorage.setItem('fq_last_user', username);
            return true;
        } else {
            setAuthError("Invalid password");
            return false;
        }
    };

    const register = (username, password, securityQuestion, securityAnswer) => {
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

        // Save new user with security question
        db[username] = {
            password,
            question: securityQuestion || "What is your favorite color?", // Default if missing
            answer: securityAnswer ? securityAnswer.toLowerCase() : "blue"
        };

        localStorage.setItem('fq_auth_db', JSON.stringify(db));

        // Auto login
        setUser(username);
        localStorage.setItem('fq_last_user', username);
        return true;
    };

    const resetPassword = (username, securityAnswer, newPassword) => {
        setAuthError(null);
        const db = getAuthDb();
        const userRecord = db[username];

        if (!userRecord) {
            setAuthError("User not found");
            return false;
        }

        if (typeof userRecord === 'string') {
            setAuthError("Security question not set for this account (Legacy user).");
            return false;
        }

        if (userRecord.answer !== securityAnswer.toLowerCase()) {
            setAuthError("Incorrect security answer.");
            return false;
        }

        // Update password
        db[username] = { ...userRecord, password: newPassword };
        localStorage.setItem('fq_auth_db', JSON.stringify(db));
        return true;
    };

    const getSecurityQuestion = (username) => {
        const db = getAuthDb();
        const userRecord = db[username];
        if (!userRecord || typeof userRecord === 'string') return null;
        return userRecord.question;
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
        <AuthContext.Provider value={{ user, authError, login, register, guestLogin, logout, resetPassword, getSecurityQuestion }}>
            {children}
        </AuthContext.Provider>
    );
};
