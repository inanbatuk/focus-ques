import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import { ArrowRight, UserPlus, LogIn, User, Lock, Sparkles, ShieldCheck } from 'lucide-react';

const LoginScreen = () => {
    const { login, register, guestLogin, authError } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation visual feedback could be added here
        if (isRegister) {
            register(formData.username, formData.password);
        } else {
            login(formData.username, formData.password);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 10%, #e0e7ff 0%, #f3f4f6 100%)',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '500px',
                height: '500px',
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                filter: 'blur(100px)',
                opacity: 0.1,
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: 'white', borderRadius: '24px',
                        margin: '0 auto 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.2)',
                        transform: 'rotate(-5deg)'
                    }}>
                        <Sparkles size={40} color="#4f46e5" fill="#e0e7ff" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', marginBottom: '8px', letterSpacing: '-1px' }}>
                        FocusQuest
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Gamify your productivity journey.</p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '32px',
                    padding: '40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.8)'
                }}>
                    {/* Toggle Switch */}
                    <div style={{
                        display: 'flex',
                        background: '#f3f4f6',
                        padding: '6px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '6px', left: '6px', bottom: '6px', width: 'calc(50% - 6px)',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            transform: isRegister ? 'translateX(100%)' : 'translateX(0)',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                        <button
                            onClick={() => setIsRegister(false)}
                            style={{
                                flex: 1, padding: '10px',
                                border: 'none', background: 'transparent',
                                fontSize: '0.95rem', fontWeight: '700',
                                color: !isRegister ? '#111827' : '#6b7280',
                                cursor: 'pointer', position: 'relative', zIndex: 1,
                                transition: 'color 0.3s'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsRegister(true)}
                            style={{
                                flex: 1, padding: '10px',
                                border: 'none', background: 'transparent',
                                fontSize: '0.95rem', fontWeight: '700',
                                color: isRegister ? '#111827' : '#6b7280',
                                cursor: 'pointer', position: 'relative', zIndex: 1,
                                transition: 'color 0.3s'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <User size={20} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    style={{
                                        width: '100%', padding: '16px 16px 16px 48px',
                                        borderRadius: '16px', border: 'none',
                                        background: 'white',
                                        fontSize: '1rem', fontWeight: '500',
                                        color: '#1f2937', outline: 'none',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={e => e.target.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.1)'}
                                    onBlur={e => e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)'}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    style={{
                                        width: '100%', padding: '16px 16px 16px 48px',
                                        borderRadius: '16px', border: 'none',
                                        background: 'white',
                                        fontSize: '1rem', fontWeight: '500',
                                        color: '#1f2937', outline: 'none',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={e => e.target.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.1)'}
                                    onBlur={e => e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)'}
                                />
                            </div>
                        </div>

                        {authError && (
                            <div style={{
                                padding: '10px', borderRadius: '12px',
                                background: '#fee2e2', color: '#dc2626',
                                fontSize: '0.9rem', textAlign: 'center', fontWeight: '500',
                                border: '1px solid #fecaca'
                            }}>
                                {authError}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                marginTop: '10px',
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                borderRadius: '16px',
                                border: 'none',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {isRegister ? <><ShieldCheck size={20} /> Create Hero Account</> : <><LogIn size={20} /> Enter Realm</>}
                        </button>
                    </form>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <p style={{ color: '#9ca3af', marginBottom: '12px', fontSize: '0.9rem' }}>Just passing through?</p>
                        <button
                            onClick={guestLogin}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#6b7280',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px'
                            }}
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
