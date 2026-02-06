import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Check, Trash2 } from 'lucide-react';

const QuestItem = ({ quest, onComplete, onDelete }) => {
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'easy': return 'var(--accent-success)';
            case 'medium': return 'var(--accent-warning)';
            case 'hard': return 'var(--accent-danger)';
            default: return 'var(--text-secondary)';
        }
    };

    const difficultyColor = getDifficultyColor(quest.difficulty);

    return (
        <Card
            className="quest-item"
            style={{
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${difficultyColor}`,
                opacity: quest.completed ? 0.5 : 1
            }}
        >
            <div style={{ flex: 1 }}>
                <h4 style={{
                    textDecoration: quest.completed ? 'line-through' : 'none',
                    color: quest.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                }}>
                    {quest.title}
                </h4>
                <span style={{
                    fontSize: '0.75rem',
                    color: difficultyColor,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    display: 'inline-block'
                }}>
                    {quest.difficulty} (+{quest.xpReward} XP)
                </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {!quest.completed && (
                    <Button
                        variant="success"
                        style={{ padding: '8px', borderRadius: '50%' }}
                        onClick={() => onComplete(quest.id)}
                        title="Complete Quest"
                    >
                        <Check size={18} />
                    </Button>
                )}
                <Button
                    variant="secondary"
                    style={{ padding: '8px', borderRadius: '50%', color: 'var(--text-secondary)' }}
                    onClick={() => onDelete(quest.id)}
                    title="Abandon Quest"
                >
                    <Trash2 size={18} />
                </Button>
            </div>
        </Card>
    );
};

export default QuestItem;
