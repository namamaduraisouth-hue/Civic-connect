import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CivicEmblem } from './CivicEmblem';
import { 
  PlusCircle, 
  Search, 
  Map, 
  LayoutDashboard, 
  BarChart3,
  Home,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Lock
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { lang, setLang, t } = useLanguage();
  const { role, user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentTab('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F2942] text-white shadow-lg border-b border-blue-900">
      {/* Top Banner - WHITE + NAVY BLUE */}
      <div className="bg-[#0B1E30] text-blue-200 text-xs py-1.5 px-4 flex justify-between items-center border-b border-blue-950">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-bold tracking-wide text-white">{t('constituencyTitle')}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline text-blue-200 text-[11px] font-medium">{t('tagline')}</span>
          
          {/* Strict Language Switcher Button (DEFAULT TAMIL) */}
          <div className="flex items-center bg-blue-950/80 rounded-lg p-0.5 border border-blue-800">
            <button
              onClick={() => setLang('ta')}
              className={`px-2.5 py-0.5 text-xs rounded-md font-bold transition-all ${
                lang === 'ta' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 text-xs rounded-md font-bold transition-all ${
                lang === 'en' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <CivicEmblem className="w-10 h-10 transform group-hover:scale-105 transition-transform" />
            <div>
              <div className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
                {t('appName')}
              </div>
              <p className="text-[11px] text-blue-300 font-medium tracking-wide">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentTab === 'home' ? 'bg-blue-600 text-white shadow' : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              <Home className="w-4 h-4" />
              {t('navHome')}
            </button>

            <button
              onClick={() => handleNavClick('report')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md ${
                currentTab === 'report' 
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {t('navReportIssue')}
            </button>

            <button
              onClick={() => handleNavClick('track')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentTab === 'track' ? 'bg-blue-600 text-white shadow' : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('navTrackIssue')}
            </button>

            <button
              onClick={() => handleNavClick('public')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentTab === 'public' ? 'bg-blue-600 text-white shadow' : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              <Map className="w-4 h-4" />
              {t('navPublicDashboard')}
            </button>

            {/* Authenticated Councillor Tab */}
            {role === 'councillor' && (
              <button
                onClick={() => handleNavClick('councillor')}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
                  currentTab === 'councillor' ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('navCouncillorDashboard')}
              </button>
            )}

            {/* Authenticated MLA Tab */}
            {role === 'mla' && (
              <button
                onClick={() => handleNavClick('mla')}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
                  currentTab === 'mla' ? 'bg-blue-500 text-white shadow-md' : 'text-blue-200 hover:bg-blue-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {t('navMlaDashboard')}
              </button>
            )}
          </nav>

          {/* User Auth Status / Representative Badge */}
          <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-blue-900">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    {user?.name?.split('(')[0] || user?.role?.toUpperCase()}
                  </div>
                  <span className="text-[10px] text-blue-300 block font-mono">
                    {user?.role === 'mla' ? 'MLA Office' : user?.ward_id}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 bg-blue-950/80 hover:bg-red-900/60 text-blue-200 hover:text-red-200 rounded-xl transition-colors border border-blue-800"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleNavClick('councillor')}
                  className="px-2.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-200 rounded-lg text-[11px] font-bold border border-blue-800 transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-blue-400" />
                  {t('roleCouncillor')}
                </button>
                <button
                  onClick={() => handleNavClick('mla')}
                  className="px-2.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-200 rounded-lg text-[11px] font-bold border border-blue-800 transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-blue-400" />
                  {t('roleMla')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F2942] border-b border-blue-900 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-blue-100 hover:bg-blue-900 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('navHome')}
          </button>
          <button
            onClick={() => handleNavClick('report')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {t('navReportIssue')}
          </button>
          <button
            onClick={() => handleNavClick('track')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-blue-100 hover:bg-blue-900 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {t('navTrackIssue')}
          </button>
          <button
            onClick={() => handleNavClick('public')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-blue-100 hover:bg-blue-900 flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            {t('navPublicDashboard')}
          </button>

          {role === 'councillor' && (
            <button
              onClick={() => handleNavClick('councillor')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-blue-100 bg-blue-900/60 border border-blue-700 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              {t('navCouncillorDashboard')}
            </button>
          )}

          {role === 'mla' && (
            <button
              onClick={() => handleNavClick('mla')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-blue-100 bg-blue-900/60 border border-blue-700 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {t('navMlaDashboard')}
            </button>
          )}

          {/* Mobile Auth footer */}
          <div className="pt-3 border-t border-blue-900 flex justify-between items-center text-xs">
            {isAuthenticated ? (
              <div className="flex justify-between items-center w-full">
                <span className="text-blue-100 font-bold">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-800 text-white rounded-lg font-bold"
                >
                  {t('btnLogout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleNavClick('councillor')}
                  className="flex-1 py-1.5 text-center bg-blue-950 text-blue-200 rounded-lg font-bold border border-blue-800"
                >
                  {t('roleCouncillor')} Portal
                </button>
                <button
                  onClick={() => handleNavClick('mla')}
                  className="flex-1 py-1.5 text-center bg-blue-950 text-blue-200 rounded-lg font-bold border border-blue-800"
                >
                  {t('roleMla')} Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
