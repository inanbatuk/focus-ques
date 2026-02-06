import React from 'react';

const ProgressBar = ({ value, max, color = 'var(--accent-secondary)', label, height = '8px' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div style={{ width: '100%', margin: '8px 0' }}>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{label}</span>
                    <span>{value} / {max}</span>
                </div>
            )}
            <div style={{
                height: height,
                background: 'var(--bg-secondary)',
                borderRadius: '99px',
                overflow: 'hidden',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                    borderRadius: '99px',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
            </div>
        </div>
    );
};

export default ProgressBar;
