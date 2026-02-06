import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    let bg = 'var(--accent-primary)';
    let color = '#ffffff';
    let border = 'none';
    // Removed glowing box shadows for cleaner look

    if (variant === 'secondary') {
        bg = 'transparent';
        color = 'var(--text-secondary)';
        border = '1px solid var(--glass-border)';
    } else if (variant === 'danger') {
        bg = '#fee2e2'; // Light red bg
        color = 'var(--accent-danger)'; // Dark red text
    } else if (variant === 'success') {
        bg = 'var(--accent-success)';
        color = '#ffffff';
    }

    const style = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: border,
        background: bg,
        color: color,
        fontWeight: '600',
        fontSize: '0.95rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        ...props.style
    };

    return (
        <button
            className={`btn ${className}`}
            style={style}
            onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
