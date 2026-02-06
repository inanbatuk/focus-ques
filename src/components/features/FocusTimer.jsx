import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useGame } from '../../context/GameContext';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const FocusTimer = () => {
    const [focusDuration, setFocusDuration] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(focusDuration);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);
    const { logSession } = useGame();

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            handleComplete();
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(focusDuration);
    };

    const handleComplete = () => {
        // Play success sound
        const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"); // Happy "Ding"
        sound.volume = 0.5;
        sound.play().catch(e => console.log("Audio play failed", e));

        // Log session correctly for stats (minutes)
        const durationMin = Math.floor(focusDuration / 60);
        logSession(durationMin, "General");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Circular Progress Math
    const size = 320;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = timeLeft / focusDuration;
    const dashOffset = circumference - progress * circumference;

    return (
        <Card className="focus-timer" style={{
            marginBottom: '40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: isActive ? '0 20px 60px -10px rgba(79, 70, 229, 0.15)' : '0 20px 40px -10px rgba(0,0,0,0.05)',
            transition: 'all 0.5s ease',
            position: 'relative',
            overflow: 'visible'
        }}>
            {/* Ambient Background Glow when active */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(255,255,255,0) 70%)',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1s ease',
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', width: size, height: size, marginBottom: '24px' }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: isActive ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' : 'none', transition: 'filter 0.5s' }}>

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>

                    {/* Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress with Gradient */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>

                {/* Inner Text Block */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        fontSize: '5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1,
                        letterSpacing: '-3px',
                        marginBottom: '4px'
                    }}>
                        {formatTime(timeLeft)}
                    </h2>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isActive ? 'rgba(99, 102, 241, 0.1)' : '#f3f4f6',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease'
                    }}>
                        <Zap size={14} fill={isActive ? "#6366f1" : "none"} color={isActive ? "#6366f1" : "#9ca3af"} />
                        <span style={{
                            color: isActive ? '#4f46e5' : '#6b7280',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {isActive ? "Focus Turn" : "Ready"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <button
                    onClick={toggleTimer}
                    style={{
                        minWidth: '180px',
                        padding: '18px 32px',
                        background: isActive ? 'white' : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                        color: isActive ? '#1f2937' : 'white',
                        border: isActive ? '1px solid #e5e7eb' : 'none',
                        borderRadius: '24px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: isActive ? 'none' : '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {isActive ? <><Pause size={24} /> Pause</> : <><Play size={24} fill="white" /> Start Focus</>}
                </button>

                <button
                    onClick={resetTimer}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '20px',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        color: '#6b7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
                >
                    <RotateCcw size={22} />
                </button>
            </div>

            {/* Segmented Duration Control - Appears clearly below controls when not active */}
            {!isActive && (
                <div style={{
                    marginTop: '32px',
                    background: '#f3f4f6',
                    padding: '6px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    gap: '4px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    {[1, 15, 25, 45, 60].map(min => (
                        <button
                            key={min}
                            onClick={() => {
                                setFocusDuration(min * 60);
                                setTimeLeft(min * 60);
                            }}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '16px',
                                border: 'none',
                                background: focusDuration === min * 60 ? 'white' : 'transparent',
                                color: focusDuration === min * 60 ? '#111827' : '#6b7280',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: focusDuration === min * 60 ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                minWidth: '60px'
                            }}
                        >
                            {min}m
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default FocusTimer;
