import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CivicEmblem } from './CivicEmblem';
import { MADURAI_SOUTH_WARDS } from '../../data/maduraiSouthWards';
import { 
  Globe, 
  UserCheck, 
  Menu, 
  X, 
  PlusCircle, 
  Search, 
  Map, 
  LayoutDashboard, 
  BarChart3,
  Home
} from 'lucide-react';
import { Role } from '../../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { lang, setLang, t } = useLanguage();
  const { role, setRole, selectedWardFilter, setSelectedWardFilter } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rolesList: { id: Role; labelEn: string; labelTa: string }[] = [
    { id: 'citizen', labelEn: 'Citizen', labelTa: 'குடிமகன்' },
    { id: 'councillor', labelEn: 'Councillor', labelTa: 'கவுன்சிலர்' },
    { id: 'mla', labelEn: 'MLA Office', labelTa: 'எம்.எல்.ஏ அலுவலகம்' },
  ];

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F2942] text-white shadow-lg border-b border-amber-600/30">
      {/* Top Banner */}
      <div className="bg-slate-900/80 text-amber-400 text-xs py-1 px-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide">{t('constituencyTitle')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-slate-300">{t('tagline')}</span>
          {/* Language Switcher Button */}
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 text-xs rounded font-medium transition-all ${
                lang === 'en' 
                  ? 'bg-blue-600 text-white font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`px-2.5 py-0.5 text-xs rounded font-medium transition-all ${
                lang === 'ta' 
                  ? 'bg-blue-600 text-white font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
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
              <p className="text-[11px] text-amber-400/90 font-medium tracking-wide">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'home' ? 'bg-blue-600/30 text-blue-200 border border-blue-400/40' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              {t('navHome')}
            </button>

            <button
              onClick={() => handleNavClick('report')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 shadow-md ${
                currentTab === 'report' 
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {t('navReportIssue')}
            </button>

            <button
              onClick={() => handleNavClick('track')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'track' ? 'bg-blue-600/30 text-blue-200 border border-blue-400/40' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('navTrackIssue')}
            </button>

            <button
              onClick={() => handleNavClick('public')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'public' ? 'bg-blue-600/30 text-blue-200 border border-blue-400/40' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              {t('navPublicDashboard')}
            </button>

            {role === 'councillor' && (
              <button
                onClick={() => handleNavClick('councillor')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'councillor' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40' : 'text-amber-300 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('navCouncillorDashboard')}
              </button>
            )}

            {role === 'mla' && (
              <button
                onClick={() => handleNavClick('mla')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'mla' ? 'bg-purple-600/30 text-purple-200 border border-purple-400/40' : 'text-purple-300 hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {t('navMlaDashboard')}
              </button>
            )}
          </nav>

          {/* Role Switcher */}
          <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-700">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value as Role;
                setRole(newRole);
                if (newRole === 'councillor') setCurrentTab('councillor');
                else if (newRole === 'mla') setCurrentTab('mla');
              }}
              className="bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {rolesList.map(r => (
                <option key={r.id} value={r.id}>
                  {t('switchRole')}: {lang === 'ta' ? r.labelTa : r.labelEn}
                </option>
              ))}
            </select>

            {role === 'councillor' && (
              <select
                value={selectedWardFilter}
                onChange={(e) => setSelectedWardFilter(e.target.value)}
                className="bg-amber-900/60 text-xs font-semibold text-amber-200 border border-amber-700/60 rounded-md px-2 py-1.5"
              >
                {MADURAI_SOUTH_WARDS.map(w => (
                  <option key={w.ward_id} value={w.ward_id}>
                    {lang === 'ta' ? w.name_ta : w.name_en}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('navHome')}
          </button>
          <button
            onClick={() => handleNavClick('report')}
            className="w-full text-left px-3 py-2.5 rounded-md text-sm font-bold bg-emerald-600 text-white flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {t('navReportIssue')}
          </button>
          <button
            onClick={() => handleNavClick('track')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {t('navTrackIssue')}
          </button>
          <button
            onClick={() => handleNavClick('public')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            {t('navPublicDashboard')}
          </button>
          <button
            onClick={() => handleNavClick('councillor')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-amber-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t('navCouncillorDashboard')}
          </button>
          <button
            onClick={() => handleNavClick('mla')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-purple-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {t('navMlaDashboard')}
          </button>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold">{t('switchRole')}:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-slate-800 text-xs text-white border border-slate-700 rounded px-2 py-1"
            >
              {rolesList.map(r => (
                <option key={r.id} value={r.id}>
                  {lang === 'ta' ? r.labelTa : r.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
