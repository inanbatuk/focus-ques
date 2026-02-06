import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    const baseStyle = {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px', // Slightly less rounded
        boxShadow: 'var(--glass-shadow)',
        padding: 'var(--spacing-md)',
        color: 'var(--text-primary)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    return (
        <div
            className={`clean-card ${className}`}
            style={{ ...baseStyle, ...props.style }}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
