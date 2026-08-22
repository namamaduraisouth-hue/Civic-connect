import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { ReportIssueWizard } from './components/report/ReportIssueWizard';
import { IssueTracker } from './components/tracking/IssueTracker';
import { PublicDashboard } from './components/dashboards/PublicDashboard';
import { CouncillorDashboard } from './components/dashboards/CouncillorDashboard';
import { MlaDashboard } from './components/dashboards/MlaDashboard';
import { MlaLogin } from './components/auth/MlaLogin';
import { CouncillorLogin } from './components/auth/CouncillorLogin';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const pathToTab = (pathname: string): string => {
  const clean = pathname.toLowerCase().replace(/\/$/, '');
  if (clean === '/report') return 'report';
  if (clean === '/track') return 'track';
  if (clean === '/public') return 'public';
  if (clean === '/councillor') return 'councillor';
  if (clean === '/mla') return 'mla';
  return 'home';
};

const tabToPath = (tab: string): string => {
  if (tab === 'report') return '/report';
  if (tab === 'track') return '/track';
  if (tab === 'public') return '/public';
  if (tab === 'councillor') return '/councillor';
  if (tab === 'mla') return '/mla';
  return '/';
};

export const AppContent: React.FC = () => {
  const { lang, t } = useLanguage();
  const { role, isAuthenticated, isMla, isCouncillor } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>(() => {
    return pathToTab(window.location.pathname);
  });
  const [trackedIssueId, setTrackedIssueId] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(pathToTab(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavChange = (tab: string) => {
    setCurrentTab(tab);
    const path = tabToPath(tab);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTrack = (issueId: string) => {
    setTrackedIssueId(issueId);
    handleNavChange('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentTab={currentTab} setCurrentTab={handleNavChange} />

      <main className="flex-1">
        {/* HOME ROUTE (/) */}
        {currentTab === 'home' && (
          <HomePage 
            onNavigate={handleNavChange} 
            onSelectTrackIssue={handleNavigateToTrack} 
          />
        )}

        {/* REPORT ISSUE ROUTE (/report) */}
        {currentTab === 'report' && (
          <ReportIssueWizard 
            onSuccessNavigateTrack={handleNavigateToTrack} 
          />
        )}

        {/* TRACK ISSUE ROUTE (/track) */}
        {currentTab === 'track' && (
          <IssueTracker 
            initialSearchId={trackedIssueId} 
          />
        )}

        {/* PUBLIC DASHBOARD ROUTE (/public) */}
        {currentTab === 'public' && (
          <PublicDashboard 
            onSelectTrackIssue={handleNavigateToTrack} 
          />
        )}

        {/* COUNCILLOR ROUTE (/councillor) */}
        {currentTab === 'councillor' && (
          isAuthenticated && isCouncillor ? (
            <CouncillorDashboard />
          ) : (
            <CouncillorLogin onLoginSuccess={() => setCurrentTab('councillor')} />
          )
        )}

        {/* MLA ROUTE (/mla) */}
        {currentTab === 'mla' && (
          isAuthenticated && isMla ? (
            <MlaDashboard />
          ) : isAuthenticated && isCouncillor ? (
            /* Unauthorized Councillor attempting MLA Access */
            <div className="min-h-[70vh] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border-2 border-red-500 shadow-2xl">
                <ShieldAlert className="w-16 h-16 text-red-600 mx-auto" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  {t('unauthorizedTitle')}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t('unauthorizedMlaMsg')}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleNavChange('councillor')}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    Go to Councillor Portal
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <MlaLogin onLoginSuccess={() => setCurrentTab('mla')} />
          )
        )}
      </main>

      <Footer onNavigate={handleNavChange} />
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

