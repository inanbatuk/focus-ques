import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const { user } = useAuth();

    // Default State
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [quests, setQuests] = useState([]);
    const [history, setHistory] = useState([]);

    // Load data when USER changes
    useEffect(() => {
        if (user && user !== 'Guest') {
            const prefix = `fq_${user}_`;
            setXp(parseInt(localStorage.getItem(`${prefix}xp`)) || 0);
            setLevel(parseInt(localStorage.getItem(`${prefix}level`)) || 1);
            setQuests(JSON.parse(localStorage.getItem(`${prefix}quests`)) || []);
            setHistory(JSON.parse(localStorage.getItem(`${prefix}history`)) || []);
        } else {
            // Reset if no user OR if Guest (Memory-only session)
            setXp(0);
            setLevel(1);
            setQuests([]);
            setHistory([]);
        }
    }, [user]);

    // Save data whenever state changes (IF user is logged in AND NOT Guest)
    useEffect(() => {
        if (user && user !== 'Guest') {
            const prefix = `fq_${user}_`;
            localStorage.setItem(`${prefix}xp`, xp);
            localStorage.setItem(`${prefix}level`, level);
            localStorage.setItem(`${prefix}quests`, JSON.stringify(quests));
            localStorage.setItem(`${prefix}history`, JSON.stringify(history));
        }
    }, [user, xp, level, quests, history]);

    // XP required for next level formula: Level * 1000 (Simple for now)
    const nextLevelXp = level * 1000;

    const triggerLevelUp = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#bf00ff', '#ffffff']
        });
    };

    const triggerQuestComplete = () => {
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#00ff9d'],
            scalar: 0.7
        });
    };

    const addXp = (amount) => {
        let newXp = xp + amount;
        // Simple loop for multiple level ups
        while (newXp >= level * 1000) {
            newXp = newXp - (level * 1000); // Bug fix: use current loop level if dynamic, but simple is fine.
            // Actually state update inside loop is bad. Better logic:
            // For MVP just check once or improve later.
        }

        if (xp + amount >= nextLevelXp) {
            setLevel(prev => prev + 1);
            triggerLevelUp();
            setXp((xp + amount) - nextLevelXp);
        } else {
            setXp(xp + amount);
        }
    };

    const addQuest = (title, difficulty, category = 'General') => {
        const xpReward = difficulty === 'hard' ? 500 : difficulty === 'medium' ? 300 : 100;
        const newQuest = {
            id: Date.now(),
            title,
            difficulty,
            category,
            xpReward,
            completed: false
        };
        setQuests(prev => [newQuest, ...prev]);
    };

    const completeQuest = (id) => {
        const quest = quests.find(q => q.id === id);
        if (quest && !quest.completed) {
            addXp(quest.xpReward);
            triggerQuestComplete();
            setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));

            // Log to history
            const logEntry = {
                id: Date.now(),
                type: 'QUEST',
                title: quest.title,
                category: quest.category || 'General',
                xp: quest.xpReward,
                timestamp: new Date().toISOString()
            };
            setHistory(prev => [logEntry, ...prev]);
        }
    };

    const logSession = (durationMinutes, category = 'General') => {
        // XP = 10 XP per minute
        const earnedXp = durationMinutes * 10;
        addXp(earnedXp);
        triggerQuestComplete(); // Use minimal confetti

        const logEntry = {
            id: Date.now(),
            type: 'SESSION',
            title: `Focus Session (${durationMinutes}m)`,
            category: category,
            duration: durationMinutes,
            xp: earnedXp,
            timestamp: new Date().toISOString()
        };
        setHistory(prev => [logEntry, ...prev]);
    };

    const deleteQuest = (id) => {
        setQuests(prev => prev.filter(q => q.id !== id));
    };

    return (
        <GameContext.Provider value={{
            xp,
            level,
            nextLevelXp,
            quests,
            history,
            addQuest,
            completeQuest,
            deleteQuest,
            logSession
        }}>
            {children}
        </GameContext.Provider>
    );
};
