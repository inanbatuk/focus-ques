import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [quests, setQuests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user progress and quests from Supabase
    useEffect(() => {
        if (authLoading) return;

        const loadUserData = async () => {
            if (!user || user.email === 'guest@focusquest.app') {
                // Guest mode: reset to defaults
                setXp(0);
                setLevel(1);
                setQuests([]);
                setHistory([]);
                setLoading(false);
                return;
            }

            try {
                // Load user progress
                const { data: progressData, error: progressError } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (progressError && progressError.code !== 'PGRST116') {
                    console.error('Error loading progress:', progressError);
                } else if (progressData) {
                    setXp(progressData.xp || 0);
                    setLevel(progressData.level || 1);
                }

                // Load quests
                const { data: questsData, error: questsError } = await supabase
                    .from('quests')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (questsError) {
                    console.error('Error loading quests:', questsError);
                } else {
                    setQuests(questsData || []);
                }

                // Load focus sessions for history
                const { data: sessionsData, error: sessionsError } = await supabase
                    .from('focus_sessions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (sessionsError) {
                    console.error('Error loading sessions:', sessionsError);
                } else {
                    // Convert to history format
                    const sessionHistory = (sessionsData || []).map(session => ({
                        id: session.id,
                        type: 'SESSION',
                        title: `Focus Session (${session.duration_minutes}m)`,
                        category: session.category || 'General',
                        duration: session.duration_minutes,
                        xp: session.duration_minutes * 10,
                        timestamp: session.created_at
                    }));

                    // Combine with completed quests
                    const completedQuests = (questsData || [])
                        .filter(q => q.completed)
                        .map(q => ({
                            id: q.id,
                            type: 'QUEST',
                            title: q.title,
                            category: q.category || 'General',
                            xp: q.xp_reward,
                            timestamp: q.completed_at || q.created_at
                        }));

                    const combined = [...sessionHistory, ...completedQuests]
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    setHistory(combined);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();

        // Subscribe to real-time changes
        if (user && user.email !== 'guest@focusquest.app') {
            const questsSubscription = supabase
                .channel('quests_changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'quests',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setQuests(prev => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setQuests(prev => prev.map(q => q.id === payload.new.id ? payload.new : q));
                    } else if (payload.eventType === 'DELETE') {
                        setQuests(prev => prev.filter(q => q.id !== payload.old.id));
                    }
                })
                .subscribe();

            return () => {
                questsSubscription.unsubscribe();
            };
        }
    }, [user, authLoading]);

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

    const updateProgress = async (newXp, newLevel) => {
        if (!user || user.email === 'guest@focusquest.app') return;

        try {
            const { error } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    xp: newXp,
                    level: newLevel,
                    updated_at: new Date().toISOString()
                });

            if (error) console.error('Error updating progress:', error);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const addXp = async (amount) => {
        let newXp = xp + amount;
        let newLevel = level;

        if (newXp >= nextLevelXp) {
            newLevel = level + 1;
            newXp = newXp - nextLevelXp;
            triggerLevelUp();
        }

        setXp(newXp);
        setLevel(newLevel);
        await updateProgress(newXp, newLevel);
    };

    const addQuest = async (title, difficulty, category = 'General') => {
        const xpReward = difficulty === 'hard' ? 500 : difficulty === 'medium' ? 300 : 100;

        if (!user || user.email === 'guest@focusquest.app') {
            // Guest mode: local only
            const newQuest = {
                id: Date.now(),
                title,
                difficulty,
                category,
                xp_reward: xpReward,
                completed: false
            };
            setQuests(prev => [newQuest, ...prev]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('quests')
                .insert({
                    user_id: user.id,
                    title,
                    category,
                    xp_reward: xpReward,
                    completed: false
                })
                .select()
                .single();

            if (error) throw error;
            // Real-time subscription will handle adding to state
        } catch (error) {
            console.error('Error adding quest:', error);
        }
    };

    const completeQuest = async (id) => {
        const quest = quests.find(q => q.id === id);
        if (!quest || quest.completed) return;

        await addXp(quest.xp_reward);
        triggerQuestComplete();

        if (!user || user.email === 'guest@focusquest.app') {
            // Guest mode: local only
            setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
            const logEntry = {
                id: Date.now(),
                type: 'QUEST',
                title: quest.title,
                category: quest.category || 'General',
                xp: quest.xp_reward,
                timestamp: new Date().toISOString()
            };
            setHistory(prev => [logEntry, ...prev]);
            return;
        }

        try {
            const { error } = await supabase
                .from('quests')
                .update({
                    completed: true,
                    completed_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            // Update total quests completed
            await supabase
                .from('user_progress')
                .update({
                    total_quests_completed: supabase.rpc('increment', { row_id: user.id })
                })
                .eq('user_id', user.id);

            // Real-time subscription will handle updating state
        } catch (error) {
            console.error('Error completing quest:', error);
        }
    };

    const logSession = async (durationMinutes, category = 'General') => {
        const earnedXp = durationMinutes * 10;
        await addXp(earnedXp);
        triggerQuestComplete();

        if (!user || user.email === 'guest@focusquest.app') {
            // Guest mode: local only
            const logEntry = {
                id: Date.now(),
                type: 'SESSION',
                title: `Focus Session (${durationMinutes}m)`,
                category,
                duration: durationMinutes,
                xp: earnedXp,
                timestamp: new Date().toISOString()
            };
            setHistory(prev => [logEntry, ...prev]);
            return;
        }

        try {
            const { error } = await supabase
                .from('focus_sessions')
                .insert({
                    user_id: user.id,
                    duration_minutes: durationMinutes,
                    category
                });

            if (error) throw error;

            // Add to local history immediately
            const logEntry = {
                id: Date.now(),
                type: 'SESSION',
                title: `Focus Session (${durationMinutes}m)`,
                category,
                duration: durationMinutes,
                xp: earnedXp,
                timestamp: new Date().toISOString()
            };
            setHistory(prev => [logEntry, ...prev]);
        } catch (error) {
            console.error('Error logging session:', error);
        }
    };

    const deleteQuest = async (id) => {
        if (!user || user.email === 'guest@focusquest.app') {
            // Guest mode: local only
            setQuests(prev => prev.filter(q => q.id !== id));
            return;
        }

        try {
            const { error } = await supabase
                .from('quests')
                .delete()
                .eq('id', id);

            if (error) throw error;
            // Real-time subscription will handle removing from state
        } catch (error) {
            console.error('Error deleting quest:', error);
        }
    };

    return (
        <GameContext.Provider value={{
            xp,
            level,
            nextLevelXp,
            quests,
            history,
            loading,
            addQuest,
            completeQuest,
            deleteQuest,
            logSession
        }}>
            {!loading && children}
        </GameContext.Provider>
    );
};
