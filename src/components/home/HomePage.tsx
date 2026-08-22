import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIssues } from '../../context/IssueContext';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectTrackIssue: (issueId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectTrackIssue }) => {
  const { lang, t } = useLanguage();
  const { issues, communityGroups } = useIssues();

  return (
    <div className="space-y-12 pb-12">
      
      {/* HERO BANNER - WHITE + NAVY BLUE */}
      <section className="relative bg-gradient-to-br from-[#0F2942] via-blue-950 to-[#1E40AF] text-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-blue-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#60A5FA_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              192-Madurai South Assembly Constituency
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {t('heroTitle')}
            </h1>

            <p className="text-base md:text-lg text-blue-100 max-w-2xl leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigate('report')}
                className="px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-2xl shadow-xl hover:shadow-blue-600/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5" />
                {t('ctaReportNow')}
              </button>

              <button
                onClick={() => onNavigate('track')}
                className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base rounded-2xl transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <Search className="w-5 h-5 text-blue-300" />
                {t('ctaTrackIssue')}
              </button>
            </div>
          </div>

          {/* Map Preview Card */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/15 shadow-2xl">
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-300" />
                Live Geo-Boundary Map
              </span>
              <span className="text-[11px] text-blue-200 font-bold bg-blue-900/80 px-2.5 py-0.5 rounded-full border border-blue-700">
                Assembly 192 Active
              </span>
            </div>
            <ConstituencyMap
              issues={issues}
              heightClass="h-[300px]"
              interactive={false}
              showBoundaryOnly={true}
            />
          </div>
        </div>
      </section>

      {/* STATS METRICS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-950 block">{issues.length + 320}</span>
            <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">{t('statsReported')}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 block">{issues.filter(i => i.status === 'COMPLETED').length + 284}</span>
            <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">{t('statsResolved')}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-900 block">12 Wards</span>
            <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">{t('statsActiveWards')}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-800 block">2.4 Days</span>
            <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">{t('statsAvgTime')}</span>
          </div>
        </div>
      </section>

      {/* HIGH PRIORITY COMMUNITY GROUPS */}
      {communityGroups.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-700" />
                  {t('communityGroupsTitle')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{t('communityGroupsSub')}</p>
              </div>
              <button
                onClick={() => onNavigate('public')}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                {t('viewAllPublic')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communityGroups.slice(0, 3).map(grp => (
                <div key={grp.group_id} className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100 hover:border-blue-500 space-y-3 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded">
                      {grp.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                      Priority: {grp.priority_score}/100
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">{grp.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{grp.location_name}</p>

                  <div className="pt-3 border-t border-blue-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-900">👥 {grp.total_reports} Complaints</span>
                    <button
                      onClick={() => onSelectTrackIssue(grp.primary_issue_id)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors"
                    >
                      Track Group
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECENT CIVIC REPORTS LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('recentIssuesTitle')}
            </h2>
            <button
              onClick={() => onNavigate('public')}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              {t('viewAllPublic')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.slice(0, 6).map(issue => (
              <div key={issue.issue_id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
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

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{issue.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>
                <p className="text-[11px] text-blue-900 font-semibold">{issue.ward_name}</p>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onSelectTrackIssue(issue.issue_id)}
                    className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                  >
                    View Timeline
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
