import React, { useState, useEffect } from 'react';
import { PageView, User, RoadmapResponse } from './types';
import { api, getStoredUser, clearAuthSession, getToken } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [scores, setScores] = useState<Record<string, number>>({
    DSA: 60,
    Programming: 65,
    SQL: 55,
    Git: 60,
    'CS Fundamentals': 55
  });
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Restore authenticated session & saved roadmap on mount
  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();

    if (user && token) {
      setCurrentUser(user);

      // Fetch saved roadmap if available
      api.getSavedRoadmap()
        .then((res) => {
          if (res.targetRole) {
            setTargetRole(res.targetRole);
          }
          if (res.scores) {
            setScores(res.scores);
          }
          if (res.roadmap && res.roadmap.length > 0) {
            setRoadmapData({
              source: 'gemini',
              gaps: [],
              roadmap: res.roadmap
            });
          }
        })
        .catch(() => {
          // Silent fallback on initial mount if server unpopulated
        });
    }
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setCurrentView('landing');
    setNotification('You have been signed out.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setNotification(`Welcome back, ${user.name || user.email}!`);
    setTimeout(() => setNotification(null), 4000);

    // If no role set, guide them to role selection, otherwise go to dashboard
    if (roadmapData) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('roles');
    }
  };

  const handleStartFlow = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentView('roles');
    }
  };

  const handleSelectRole = (role: string) => {
    setTargetRole(role);
  };

  const handleContinueToAssessment = () => {
    setCurrentView('assessment');
  };

  const handleSubmitAssessmentScores = async (calculatedScores: Record<string, number>) => {
    setScores(calculatedScores);
    setIsLoadingRoadmap(true);

    try {
      const result = await api.generateRoadmap(targetRole, calculatedScores);
      setRoadmapData(result);
      setCurrentView('dashboard');
      setNotification('🎉 AI Roadmap generated successfully based on your diagnostic gaps!');
      setTimeout(() => setNotification(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate roadmap';
      setNotification(`⚠ ${msg}`);
      // Even if API fails, create a resilient local view
      setCurrentView('dashboard');
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleRefreshRoadmap = async () => {
    setIsLoadingRoadmap(true);
    try {
      const result = await api.generateRoadmap(targetRole, scores);
      setRoadmapData(result);
      setNotification('Roadmap regenerated and synchronized with Gemini!');
      setTimeout(() => setNotification(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Regeneration failed';
      setNotification(`⚠ ${msg}`);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleScoresUpdated = (updatedScores: Record<string, number>, logMessage: string) => {
    setScores(updatedScores);
    setNotification(logMessage);
    setTimeout(() => setNotification(null), 6000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-brand-teal selection:text-navy-950">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        targetRole={targetRole}
      />

      {/* Global Notification Banner */}
      {notification && (
        <div className="w-full bg-navy-900 border-b border-brand-teal/30 px-4 py-2.5 text-xs text-center font-medium text-brand-teal flex items-center justify-center gap-2 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStart={handleStartFlow}
            setCurrentView={setCurrentView}
            isLoggedIn={!!currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'roles' && (
          <RoleSelectionPage
            selectedRole={targetRole}
            onSelectRole={handleSelectRole}
            onContinue={handleContinueToAssessment}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentPage
            targetRole={targetRole}
            onSubmitScores={handleSubmitAssessmentScores}
            isLoading={isLoadingRoadmap}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            targetRole={targetRole}
            scores={scores}
            roadmapData={roadmapData}
            onGoToRoadmap={() => setCurrentView('roadmap')}
            onRetakeAssessment={() => setCurrentView('assessment')}
          />
        )}

        {currentView === 'roadmap' && (
          <RoadmapPage
            targetRole={targetRole}
            scores={scores}
            roadmapData={roadmapData}
            user={currentUser}
            onRefreshRoadmap={handleRefreshRoadmap}
            onScoresUpdated={handleScoresUpdated}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
