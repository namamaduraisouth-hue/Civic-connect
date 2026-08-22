import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { MADURAI_SOUTH_WARDS } from '../../data/maduraiSouthWards';
import { IssueStatus, CivicIssue } from '../../types';
import { IssueDetailModal } from './IssueDetailModal';
import { 
  Building2, 
  Filter, 
  UserCheck, 
  ArrowUpRight, 
  Eye, 
  Hammer, 
  CheckCircle2,
  Search,
  RefreshCw
} from 'lucide-react';

export const CouncillorDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { user, selectedWardFilter, setSelectedWardFilter } = useAuth();
  const { issues, refreshIssues, loading } = useIssues();

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeWard = MADURAI_SOUTH_WARDS.find(w => w.ward_id === selectedWardFilter) || MADURAI_SOUTH_WARDS[2];

  // Filter issues for selected ward
  const wardIssues = issues.filter(i => i.ward_id === selectedWardFilter);

  // Status Counts
  const countNew = wardIssues.filter(i => i.status === 'NEW').length;
  const countSeen = wardIssues.filter(i => i.status === 'SEEN').length;
  const countWorking = wardIssues.filter(i => i.status === 'WORKING').length;
  const countCompleted = wardIssues.filter(i => i.status === 'COMPLETED').length;

  const filteredWardIssues = wardIssues.filter(issue => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.issue_id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.address.toLowerCase().includes(q) ||
        issue.citizen_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Dashboard Top Banner - WHITE + NAVY BLUE */}
      <div className="bg-gradient-to-r from-[#0F2942] via-blue-900 to-[#1E40AF] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-6 border-b-4 border-blue-500">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            {t('councillorTitle')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'ta' ? activeWard.name_ta : activeWard.name_en}
          </h1>
          <p className="text-xs text-blue-100 mt-1">
            Councillor: <strong>{user?.name || activeWard.councillor_name}</strong> | Contact: {user?.phone || activeWard.contact_phone}
          </p>
        </div>

        {/* Ward Selector Dropdown & Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshIssues()}
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl transition-all"
            title="Refresh Ward Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-blue-400/30">
            <Filter className="w-4 h-4 text-blue-300" />
            <span className="text-xs font-semibold text-blue-100">{t('selectWardFilter')}:</span>
            <select
              value={selectedWardFilter}
              onChange={(e) => setSelectedWardFilter(e.target.value)}
              className="bg-slate-800 text-xs font-bold text-white border border-slate-700 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {MADURAI_SOUTH_WARDS.map(w => (
                <option key={w.ward_id} value={w.ward_id}>
                  {lang === 'ta' ? w.name_ta : w.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* NEW ISSUES */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'NEW' ? 'all' : 'NEW')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'NEW' 
              ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusNew')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countNew}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Awaiting initial review</p>
        </div>

        {/* SEEN ISSUES */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'SEEN' ? 'all' : 'SEEN')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'SEEN' 
              ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusSeen')}</span>
            <Eye className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countSeen}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Acknowledged by Councillor</p>
        </div>

        {/* WORKING ISSUES */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'WORKING' ? 'all' : 'WORKING')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'WORKING' 
              ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusWorking')}</span>
            <Hammer className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countWorking}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Action & field repairs underway</p>
        </div>

        {/* COMPLETED ISSUES */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'all' : 'COMPLETED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'COMPLETED' 
              ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusCompleted')}</span>
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countCompleted}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Resolved ward complaints</p>
        </div>

      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-wrap justify-between items-center gap-4 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, citizen name, address..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="NEW">{t('statusNew')}</option>
            <option value="SEEN">{t('statusSeen')}</option>
            <option value="WORKING">{t('statusWorking')}</option>
            <option value="COMPLETED">{t('statusCompleted')}</option>
          </select>
        </div>
      </div>

      {/* WARD ISSUES LIST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            {t('allWardIssues')} ({filteredWardIssues.length})
          </h2>
          <span className="text-xs text-slate-500">
            {lang === 'ta' ? 'விவரங்களை பார்க்க கிளிக் செய்யவும்' : 'Click an issue to view full details & update action status'}
          </span>
        </div>

        {filteredWardIssues.length === 0 ? (
          <p className="text-xs text-slate-500 py-10 text-center font-medium">
            {t('noIssuesInWard')}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWardIssues.map(issue => (
              <div 
                key={issue.issue_id} 
                onClick={() => setSelectedIssue(issue)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/20 space-y-3 transition-all cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                      {issue.issue_id}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      issue.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                      issue.status === 'SEEN' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      issue.status === 'WORKING' ? 'bg-blue-200 text-blue-900' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {lang === 'ta' 
                        ? issue.status === 'NEW' ? t('statusNew') : issue.status === 'SEEN' ? t('statusSeen') : issue.status === 'WORKING' ? t('statusWorking') : t('statusCompleted')
                        : issue.status}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {issue.severity}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{issue.description}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center text-slate-700 font-medium">
                  <span>👤 {issue.citizen_name || 'Citizen'} ({issue.citizen_phone || 'Private'})</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 text-[11px] truncate max-w-[200px]">{issue.address}</span>
                  <span className="text-blue-700 font-extrabold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {t('btnUpdateStatus')}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UNIFIED ISSUE DETAIL MODAL (Opens for viewing details & updating status, NO delete for Councillor) */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onStatusUpdated={() => {
            // Updated in context
          }}
        />
      )}

    </div>
  );
};
