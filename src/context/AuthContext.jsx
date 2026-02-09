import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        setAuthError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    const register = async (email, password, username) => {
        setAuthError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) throw error;

            // Check if email confirmation is required
            if (data?.user && !data.session) {
                setAuthError("Please check your email to confirm your account.");
                return false;
            }

            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    const resetPassword = async (email) => {
        setAuthError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });

            if (error) throw error;
            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    const guestLogin = () => {
        setAuthError(null);
        setUser({ email: 'guest@focusquest.app', user_metadata: { username: 'Guest' } });
    };

    const logout = async () => {
        setAuthError(null);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const value = {
        user,
        authError,
        loading,
        login,
        register,
        guestLogin,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
