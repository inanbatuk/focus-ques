import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import QuestBoard from './components/features/QuestBoard';
import FocusTimer from './components/features/FocusTimer';
import LoginScreen from './components/features/LoginScreen';
import AnalyticsDashboard from './components/features/AnalyticsDashboard';
import OnboardingGuide from './components/layout/OnboardingGuide';

function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if this specific user has seen onboarding
      // Using a composite key so each user sees it once
      const hasSeen = localStorage.getItem(`fq_onboarding_seen_${user}`);
      if (!hasSeen) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem(`fq_onboarding_seen_${user}`, 'true');
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {currentView === 'home' ? (
          <>
            <FocusTimer />
            <QuestBoard />
          </>
        ) : (
          <AnalyticsDashboard />
        )}
      </Layout>
    </>
  );
}

export default App;
