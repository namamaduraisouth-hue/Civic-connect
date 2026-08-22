import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { MADURAI_SOUTH_WARDS } from '../../data/maduraiSouthWards';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { CivicIssue } from '../../types';
import { IssueDetailModal } from './IssueDetailModal';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Map, 
  Search, 
  Eye, 
  Hammer, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const MlaDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { issues, refreshIssues, loading } = useIssues();

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalReported = issues.length;
  const countNew = issues.filter(i => i.status === 'NEW').length;
  const countSeen = issues.filter(i => i.status === 'SEEN').length;
  const countWorking = issues.filter(i => i.status === 'WORKING').length;
  const countCompleted = issues.filter(i => i.status === 'COMPLETED').length;

  const resolutionRate = totalReported > 0 ? Math.round((countCompleted / totalReported) * 100) : 85;

  const filteredIssues = issues.filter(issue => {
    if (wardFilter !== 'all' && issue.ward_id !== wardFilter) return false;
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
      
      {/* Header Banner - WHITE + NAVY BLUE */}
      <div className="bg-gradient-to-r from-[#0F2942] via-blue-900 to-[#1E40AF] text-white p-6 sm:p-8 rounded-3xl shadow-xl border-b-4 border-blue-500 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            192-Madurai South Assembly Constituency Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('mlaTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Representative: <strong>M. Boominathan (MLA)</strong> | Constituency Office Portal
          </p>
        </div>

        <button
          onClick={() => refreshIssues()}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {lang === 'ta' ? 'புதுப்பி' : 'Refresh Data'}
        </button>
      </div>

      {/* Assembly 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* NEW */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'NEW' ? 'all' : 'NEW')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'NEW' ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusNew')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countNew}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">New reports across 12 wards</p>
        </div>

        {/* SEEN */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'SEEN' ? 'all' : 'SEEN')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'SEEN' ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusSeen')}</span>
            <Eye className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countSeen}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Acknowledged & inspected</p>
        </div>

        {/* WORKING */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'WORKING' ? 'all' : 'WORKING')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'WORKING' ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusWorking')}</span>
            <Hammer className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countWorking}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Under active execution</p>
        </div>

        {/* COMPLETED */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'all' : 'COMPLETED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            statusFilter === 'COMPLETED' ? 'bg-blue-100/80 border-blue-600 ring-2 ring-blue-400' : 'bg-white border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-extrabold uppercase text-blue-900">{t('statusCompleted')}</span>
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-3xl font-extrabold text-blue-950">{countCompleted}</span>
          <p className="text-[11px] text-blue-700 mt-1 font-semibold">Resolution rate: {resolutionRate}%</p>
        </div>

      </div>

      {/* Ward Performance Metric Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-700" />
            {t('wardPerformanceTable')}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">12 Assembly Wards</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-blue-50/50 uppercase text-[10px] text-blue-900 font-bold border-b border-blue-100">
              <tr>
                <th className="p-3">{t('colWard')}</th>
                <th className="p-3">Councillor</th>
                <th className="p-3">{t('colTotal')}</th>
                <th className="p-3 text-blue-800">{t('statusNew')}</th>
                <th className="p-3 text-blue-700">{t('statusWorking')}</th>
                <th className="p-3 text-blue-900">{t('statusCompleted')}</th>
                <th className="p-3">{t('colRate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MADURAI_SOUTH_WARDS.map(w => {
                const wIssues = issues.filter(i => i.ward_id === w.ward_id);
                const wNew = wIssues.filter(i => i.status === 'NEW').length;
                const wWorking = wIssues.filter(i => i.status === 'WORKING' || i.status === 'SEEN').length;
                const wComp = wIssues.filter(i => i.status === 'COMPLETED').length;
                const wTotal = wIssues.length;
                const wRate = wTotal > 0 ? Math.round((wComp / wTotal) * 100) : 80;

                return (
                  <tr key={w.ward_id} className="hover:bg-blue-50/30 font-medium transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      {lang === 'ta' ? w.name_ta : w.name_en}
                    </td>
                    <td className="p-3 text-slate-600">{w.councillor_name}</td>
                    <td className="p-3 font-bold text-slate-900">{wTotal}</td>
                    <td className="p-3 text-blue-700 font-bold">{wNew}</td>
                    <td className="p-3 text-blue-800 font-bold">{wWorking}</td>
                    <td className="p-3 text-blue-900 font-bold">{wComp}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${wRate}%` }} />
                        </div>
                        <span className="font-bold text-slate-900">{wRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEARCH, FILTER & ALL CONSTITUENCY ISSUES QUEUE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              {t('allConstituencyIssues')} ({filteredIssues.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ta' ? 'அனைத்து வார்டு புகார்கள், குடிமக்கள் விவரங்கள் மற்றும் மேலாண்மை' : 'Constituency-wide complaints with citizen info, status controls & deletion'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">{t('allWards')}</option>
              {MADURAI_SOUTH_WARDS.map(w => (
                <option key={w.ward_id} value={w.ward_id}>
                  {lang === 'ta' ? w.name_ta : w.name_en}
                </option>
              ))}
            </select>

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

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all constituency issues by ID, title, citizen name, location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Issues List Grid */}
        {filteredIssues.length === 0 ? (
          <p className="text-xs text-slate-500 py-10 text-center font-medium">
            {t('noIssuesConstituency')}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map(issue => (
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

                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {issue.ward_name?.split('-')[0] || issue.ward_id}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center text-slate-700">
                  <span className="font-semibold">👤 {issue.citizen_name || 'Citizen'}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{issue.citizen_phone || 'Private'}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">{new Date(issue.created_at).toLocaleDateString()}</span>
                  <span className="text-blue-700 font-extrabold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {lang === 'ta' ? 'விவரங்கள்' : 'View & Manage'}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Constituency Interactive Map */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-700" />
          Madurai South Assembly Spatial Distribution ({issues.length} Total Complaints)
        </h2>
        <ConstituencyMap
          issues={issues}
          heightClass="h-[400px]"
          interactive={false}
          showBoundaryOnly={true}
        />
      </div>

      {/* UNIFIED ISSUE DETAIL MODAL (With MLA Deletion Permission) */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onStatusUpdated={() => {
            // Updated in context
          }}
          onIssueDeleted={() => {
            setSelectedIssue(null);
          }}
        />
      )}

    </div>
  );
};
