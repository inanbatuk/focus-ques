import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, currentView, onNavigate }) => {
    return (
        <div className="app-container">
            <Navbar currentView={currentView} onNavigate={onNavigate} />
            <main style={{ flex: 1, padding: 'var(--spacing-sm) 0' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
