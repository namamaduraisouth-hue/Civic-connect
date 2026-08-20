import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIssues } from '../../context/IssueContext';
import { MADURAI_SOUTH_WARDS } from '../../data/maduraiSouthWards';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Map, PieChart, ShieldAlert } from 'lucide-react';

export const MlaDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { issues } = useIssues();

  const totalReported = issues.length;
  const totalResolved = issues.filter(i => i.status === 'resolved').length;
  const resolutionRate = totalReported > 0 ? Math.round((totalResolved / totalReported) * 100) : 82;

  // Category counts
  const categoryCounts = issues.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-[#0F2942] text-white p-8 rounded-2xl shadow-xl border-b-4 border-purple-500">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          Assembly Oversight & Analytics
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {t('mlaTitle')}
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          {t('mlaSub')}
        </p>
      </div>

      {/* Assembly KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">{t('resolutionRateCard')}</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{resolutionRate}%</span>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ +5.2% improvement this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">{t('avgDaysCard')}</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">2.4 Days</span>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Target turnaround: &lt; 3.0 days</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">{t('topCategoryCard')}</span>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 capitalize">Road Damage</span>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">38% of total assembly complaints</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Wards</span>
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">12 Wards</span>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Wards 49 through 60 online</p>
        </div>
      </div>

      {/* Ward Performance Metric Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          {t('wardPerformanceTable')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 uppercase text-[10px] text-slate-500 font-bold border-b">
              <tr>
                <th className="p-3">{t('colWard')}</th>
                <th className="p-3">Councillor</th>
                <th className="p-3">{t('colTotal')}</th>
                <th className="p-3">{t('colResolved')}</th>
                <th className="p-3">{t('colPending')}</th>
                <th className="p-3">{t('colRate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MADURAI_SOUTH_WARDS.map(w => {
                const wRate = Math.round((w.resolved_issues / w.total_issues) * 100);
                return (
                  <tr key={w.ward_id} className="hover:bg-slate-50 font-medium">
                    <td className="p-3 font-bold text-slate-900">
                      {lang === 'ta' ? w.name_ta : w.name_en}
                    </td>
                    <td className="p-3 text-slate-600">{w.councillor_name}</td>
                    <td className="p-3 font-bold text-slate-800">{w.total_issues}</td>
                    <td className="p-3 text-emerald-700 font-bold">{w.resolved_issues}</td>
                    <td className="p-3 text-amber-700 font-bold">{w.total_issues - w.resolved_issues}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600" style={{ width: `${wRate}%` }} />
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

      {/* Constituency Interactive Overview Map */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" />
          Madurai South Assembly Complaint Distribution
        </h2>
        <ConstituencyMap
          issues={issues}
          heightClass="h-[420px]"
          interactive={false}
          showBoundaryOnly={true}
        />
      </div>

    </div>
  );
};
