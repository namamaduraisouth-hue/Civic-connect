import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { ReportIssueWizard } from './components/report/ReportIssueWizard';
import { IssueTracker } from './components/tracking/IssueTracker';
import { PublicDashboard } from './components/dashboards/PublicDashboard';
import { CouncillorDashboard } from './components/dashboards/CouncillorDashboard';
import { MlaDashboard } from './components/dashboards/MlaDashboard';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [trackedIssueId, setTrackedIssueId] = useState<string>('');

  const handleNavigateToTrack = (issueId: string) => {
    setTrackedIssueId(issueId);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentTab={currentTab} setCurrentTab={handleNavChange} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage 
            onNavigate={handleNavChange} 
            onSelectTrackIssue={handleNavigateToTrack} 
          />
        )}
        {currentTab === 'report' && (
          <ReportIssueWizard 
            onSuccessNavigateTrack={handleNavigateToTrack} 
          />
        )}
        {currentTab === 'track' && (
          <IssueTracker 
            initialSearchId={trackedIssueId} 
          />
        )}
        {currentTab === 'public' && (
          <PublicDashboard 
            onSelectTrackIssue={handleNavigateToTrack} 
          />
        )}
        {currentTab === 'councillor' && (
          <CouncillorDashboard />
        )}
        {currentTab === 'mla' && (
          <MlaDashboard />
        )}
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <IssueProvider>
          <AppContent />
        </IssueProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
