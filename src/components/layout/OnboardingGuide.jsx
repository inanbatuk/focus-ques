import React, { useState } from 'react';
import { Sword, Timer, TrendingUp, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const STEPS = [
    {
        title: "Adventure Awaits",
        subtitle: "Welcome Hero",
        desc: "Transform your daily grind into an epic RPG journey. Every task is a monster, every minute focused is a strike.",
        icon: <Sword size={40} color="white" strokeWidth={2.5} />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    {
        title: "Choose Your Quests",
        subtitle: "Step 1",
        desc: "Create 'Quests' instead of to-dos. Assign difficulty levels. Slay the 'Hard' tasks for massive XP rewards.",
        icon: <CheckCircle size={40} color="white" strokeWidth={2.5} />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
        title: "Focus to Fight",
        subtitle: "Step 2",
        desc: "The Focus Timer is your weapon. Stay in the zone to deal damage. Distractions are enemy blocks—avoid them!",
        icon: <Timer size={40} color="white" strokeWidth={2.5} />,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
        title: "Become a Legend",
        subtitle: "Step 3",
        desc: "Level up, track your stats, and build disciplined habits. Your legend starts with the first step.",
        icon: <TrendingUp size={40} color="white" strokeWidth={2.5} />,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
];

const OnboardingGuide = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            handleSkip();
        }
    };

    const handleSkip = () => {
        setIsExiting(true);
        setTimeout(onComplete, 400);
    };

    const current = STEPS[step];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: isExiting ? 'fadeOut 0.4s forwards' : 'fadeIn 0.4s ease-out'
        }}>
            <div style={{
                position: 'relative',
                width: '90%',
                maxWidth: '380px',
                background: 'white',
                borderRadius: '32px',
                padding: '0',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: isExiting ? 'scaleDown 0.4s forwards' : 'scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformOrigin: 'center center'
            }}>
                {/* Header with Gradient */}
                <div style={{
                    height: '140px',
                    background: current.gradient,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.5s ease'
                }}>
                    {/* Skip Button */}
                    <button
                        onClick={handleSkip}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backdropFilter: 'blur(4px)',
                            cursor: 'pointer',
                            opacity: 0.9,
                            transition: 'all 0.2s',
                            zIndex: 20
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                    >
                        Skip
                    </button>

                    {/* Floating Bubbles Effect decoration */}
                    <div style={{ position: 'absolute', top: '10%', left: '10%', width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

                    {/* Icon Circle */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(-5deg)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                        {current.icon}
                    </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '32px 28px' }}>
                    <div style={{
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        letterSpacing: '0.1em',
                        color: '#9ca3af',
                        marginBottom: '8px',
                        opacity: 0.8
                    }}>
                        {current.subtitle}
                    </div>

                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        color: '#111827',
                        marginBottom: '12px',
                        lineHeight: '1.1'
                    }}>
                        {current.title}
                    </h2>

                    <p style={{
                        fontSize: '1.05rem',
                        color: '#4b5563',
                        lineHeight: '1.6',
                        marginBottom: '32px',
                        fontWeight: '500'
                    }}>
                        {current.desc}
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={handleNext}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: '#111827',
                            color: 'white',
                            borderRadius: '16px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {step === STEPS.length - 1 ? (
                            <>Begin Journey <Sparkles size={18} fill="yellow" /></>
                        ) : (
                            <>Continue <ArrowRight size={18} /></>
                        )}
                    </button>

                    {/* Progress Bar */}
                    <div style={{
                        marginTop: '24px',
                        display: 'flex',
                        gap: '6px',
                        justifyContent: 'center'
                    }}>
                        {STEPS.map((_, i) => (
                            <div key={i} style={{
                                width: '100%',
                                height: '4px',
                                borderRadius: '2px',
                                background: i <= step ? '#111827' : '#e5e7eb',
                                transition: 'background 0.3s ease'
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Global Keyframes in JS for self-containment */}
            <style>
                {`
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.8) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes scaleDown {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.9); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                `}
            </style>
        </div>
    );
};

export default OnboardingGuide;
