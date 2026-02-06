import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = ({ currentView, onNavigate }) => {
    const { level, xp, nextLevelXp } = useGame();
    const { user, logout } = useAuth();

    return (
        <nav style={{
            marginBottom: 'var(--spacing-lg)',
            paddingBottom: 'var(--spacing-md)',
            borderBottom: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎯</span> FocusQuest
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hello, {user}</span>

                    <Button
                        variant={currentView === 'analytics' ? 'primary' : 'secondary'}
                        onClick={() => onNavigate(currentView === 'analytics' ? 'home' : 'analytics')}
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        title="View Analytics"
                    >
                        {currentView === 'analytics' ? '🏠 Home' : '📊 Stats'}
                    </Button>

                    <div style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--glass-border)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--accent-secondary)'
                    }}>
                        Level {level}
                    </div>
                    <Button variant="secondary" onClick={logout} style={{ padding: '8px' }} title="Logout">
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>
            <ProgressBar value={xp} max={nextLevelXp} height="8px" color="var(--accent-secondary)" />
        </nav>
    );
};

export default Navbar;
