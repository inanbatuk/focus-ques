import React from 'react';
import { useGame } from '../../context/GameContext';
import Card from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Clock, Trophy, Target, TrendingUp, Calendar, Zap } from 'lucide-react';

const AnalyticsDashboard = () => {
    const { history, xp, level } = useGame();

    // 1. Calculate Statistics
    const totalSessions = history.filter(h => h.type === 'SESSION').length;
    const totalQuests = history.filter(h => h.type === 'QUEST').length;

    // Calculate total focus time
    const totalFocusMinutes = history
        .filter(h => h.type === 'SESSION')
        .reduce((acc, curr) => acc + (curr.duration || 0), 0);

    const hours = Math.floor(totalFocusMinutes / 60);
    const minutes = totalFocusMinutes % 60;

    // 2. Prepare Chart Data (XP by Category)
    const categoryData = history.reduce((acc, curr) => {
        const cat = curr.category || 'General';
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += curr.xp || 0;
        return acc;
    }, {});

    const chartData = Object.keys(categoryData).map(key => ({
        name: key,
        value: categoryData[key]
    }));

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    const StatCard = ({ icon, value, label, color, gradient }) => (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            flex: 1,
            minWidth: '140px',
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '4px',
                background: gradient
            }} />
            <div style={{
                width: '48px', height: '48px',
                borderRadius: '16px',
                background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
                color: color
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1f2937', lineHeight: 1, marginBottom: '4px' }}>
                {value}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                {label}
            </div>
        </div>
    );

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={28} color="#4f46e5" />
                        Battle Report
                    </h2>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>Your hero's journey statistics</p>
                </div>
            </div>

            {/* Key Stats Row */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <StatCard
                    icon={<Clock size={24} />}
                    value={`${hours}h ${minutes}m`}
                    label="Focus Time"
                    color="#4f46e5"
                    gradient="linear-gradient(to right, #4f46e5, #818cf8)"
                />
                <StatCard
                    icon={<Target size={24} />}
                    value={totalQuests}
                    label="Quests Done"
                    color="#10b981"
                    gradient="linear-gradient(to right, #10b981, #34d399)"
                />
                <StatCard
                    icon={<Trophy size={24} />}
                    value={xp}
                    label="Total XP"
                    color="#f59e0b"
                    gradient="linear-gradient(to right, #f59e0b, #fbbf24)"
                />
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Chart Card */}
                <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #f3f4f6', background: 'white' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937' }}>XP Distribution</h3>
                    </div>
                    {chartData.length > 0 ? (
                        <div style={{ height: '300px', width: '100%', padding: '20px' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', padding: '12px' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ padding: '48px', textAlign: 'center', opacity: 0.6 }}>
                            <div style={{
                                width: '64px', height: '64px', background: '#f3f4f6', borderRadius: '50%', margin: '0 auto 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <PieChart size={32} opacity={0.4} />
                            </div>
                            <p style={{ color: '#6b7280' }}>No battle data recorded yet.</p>
                        </div>
                    )}
                </Card>

                {/* Recent Activity Card */}
                <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #f3f4f6', background: 'white' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937' }}>Quest Log</h3>
                    </div>
                    <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '12px' }}>
                        {history.length > 0 ? (
                            history.slice(0, 10).map((item, i) => (
                                <div key={i} style={{ // Use index as key if id might duplicate or be missing temporarily
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                    padding: '12px 16px',
                                    background: '#f9fafb',
                                    borderRadius: '12px',
                                    transition: 'transform 0.1s',
                                    cursor: 'default'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}
                                >
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: item.type === 'SESSION' ? '#e0e7ff' : '#dcfce7',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: item.type === 'SESSION' ? '#4f46e5' : '#16a34a'
                                        }}>
                                            {item.type === 'SESSION' ? <Zap size={16} /> : <Target size={16} />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                {new Date(item.timestamp).toLocaleDateString()} • {item.category || 'General'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontWeight: '700',
                                        color: item.type === 'SESSION' ? '#4f46e5' : '#10b981',
                                        background: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        +{item.xp} XP
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '48px', textAlign: 'center', opacity: 0.6 }}>
                                <div style={{
                                    width: '64px', height: '64px', background: '#f3f4f6', borderRadius: '50%', margin: '0 auto 16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Calendar size={32} opacity={0.4} />
                                </div>
                                <p style={{ color: '#6b7280' }}>A blank scroll... Begin your journey!</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
