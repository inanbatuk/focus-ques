import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import QuestItem from './QuestItem';
import Button from '../ui/Button';
import { Plus, Target, Ghost } from 'lucide-react';

const QuestBoard = () => {
    const { quests, addQuest, completeQuest, deleteQuest } = useGame();
    const [newQuestTitle, setNewQuestTitle] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [category, setCategory] = useState('General');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newQuestTitle.trim()) {
            addQuest(newQuestTitle, difficulty, category);
            setNewQuestTitle('');
        }
    };

    const activeQuests = quests.filter(q => !q.completed);
    const completedQuests = quests.filter(q => q.completed);

    return (
        <div className="quest-board">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={24} color="var(--accent-primary)" />
                    Mission Control
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'white', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    Active: {activeQuests.length}
                </span>
            </div>

            <form
                onSubmit={handleAdd}
                style={{
                    marginBottom: '32px',
                    background: 'white',
                    padding: '12px',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '12px'
                }}
            >
                <div style={{ flex: '10 1 250px' }}>
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newQuestTitle}
                        onChange={(e) => setNewQuestTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '10px',
                            outline: 'none',
                            fontSize: '1rem',
                            background: '#f9fafb',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.borderColor = 'var(--accent-primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = '#f9fafb';
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                        flex: '1 1 120px',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="General">📂 General</option>
                    <option value="Math">📐 Math</option>
                    <option value="Coding">💻 Coding</option>
                    <option value="Reading">📚 Reading</option>
                    <option value="Sport">🏃 Sport</option>
                </select>

                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{
                        flex: '1 1 140px',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    <option value="easy">Easy (100 XP)</option>
                    <option value="medium">Medium (300 XP)</option>
                    <option value="hard">Hard (500 XP)</option>
                </select>

                <Button type="submit" style={{
                    flex: '1 1 120px',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                }}>
                    <Plus size={18} />
                    <span>Add</span>
                </Button>
            </form>

            <div className="quest-list" style={{ minHeight: '200px' }}>
                {activeQuests.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(243,244,246,0.5) 100%)',
                        border: '2px dashed #e5e7eb',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: '#f3f4f6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ghost size={32} color="#9ca3af" />
                        </div>
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>All Quiet on the Front</p>
                            <p style={{ color: '#6b7280', maxWidth: '300px', margin: '0 auto', fontSize: '0.95rem' }}>
                                Your quest log is empty. Use the mission control above to assign new objectives.
                            </p>
                        </div>
                    </div>
                ) : (
                    activeQuests.map(quest => (
                        <QuestItem
                            key={quest.id}
                            quest={quest}
                            onComplete={completeQuest}
                            onDelete={deleteQuest}
                        />
                    ))
                )}
            </div>

            {completedQuests.length > 0 && (
                <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Completed Quests</span>
                        <span>{completedQuests.length}</span>
                    </h4>
                    <div style={{ opacity: 0.7 }}>
                        {completedQuests.map(quest => (
                            <QuestItem
                                key={quest.id}
                                quest={quest}
                                onComplete={() => { }}
                                onDelete={deleteQuest}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestBoard;
