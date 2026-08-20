import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIssues } from '../../context/IssueContext';
import { MADURAI_SOUTH_WARDS } from '../../data/maduraiSouthWards';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { IssueCategory, IssueStatus } from '../../types';
import { MapPin, Filter, Users, ThumbsUp, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface PublicDashboardProps {
  onSelectTrackIssue: (issueId: string) => void;
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({ onSelectTrackIssue }) => {
  const { lang, t } = useLanguage();
  const { issues, communityGroups, upvoteIssue } = useIssues();

  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredIssues = issues.filter(issue => {
    if (selectedWard !== 'all' && issue.ward_id !== selectedWard) return false;
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="civic-gradient-header text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          {t('publicTitle')}
        </h1>
        <p className="text-xs md:text-sm text-slate-200">
          {t('publicSub')}
        </p>
      </div>

      {/* Community Clustered Issue Highlight Section */}
      {communityGroups.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {t('communityGroupsTitle')}
              </h2>
              <p className="text-xs text-slate-500">{t('communityGroupsSub')}</p>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full">
              {communityGroups.length} Active Clusters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityGroups.slice(0, 4).map(grp => (
              <div key={grp.group_id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 space-y-3 transition-all">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                      {grp.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{grp.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Score: {grp.priority_score}/100
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-blue-700 font-bold">
                    <Users className="w-3.5 h-3.5" />
                    {grp.total_reports} Residents Affected
                  </span>
                  <span>📷 {grp.total_photos} Photos</span>
                </div>

                <div className="pt-2 border-t flex justify-between items-center text-xs">
                  <span className="text-slate-500 text-[11px] truncate max-w-[200px]">{grp.location_name}</span>
                  <button
                    onClick={() => onSelectTrackIssue(grp.primary_issue_id)}
                    className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Public Map:
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 font-semibold text-slate-800"
          >
            <option value="all">{t('allWards')}</option>
            {MADURAI_SOUTH_WARDS.map(w => (
              <option key={w.ward_id} value={w.ward_id}>
                {lang === 'ta' ? w.name_ta : w.name_en}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 font-semibold text-slate-800"
          >
            <option value="all">{t('allCategories')}</option>
            <option value="road_damage">{t('catRoadDamage')}</option>
            <option value="drainage">{t('catDrainage')}</option>
            <option value="street_lights">{t('catStreetLights')}</option>
            <option value="garbage">{t('catGarbage')}</option>
            <option value="water">{t('catWater')}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 font-semibold text-slate-800"
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Public Interactive Map */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Live Interactive Complaint Map ({filteredIssues.length} Shown)
        </h2>
        <ConstituencyMap
          issues={filteredIssues}
          heightClass="h-[450px]"
          interactive={false}
          showBoundaryOnly={true}
        />
      </div>

      {/* Public Issue Cards List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recent Constituency Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map(issue => (
            <div key={issue.issue_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {issue.issue_id}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {issue.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{issue.title}</h3>
              <p className="text-xs text-slate-500">{issue.address}</p>

              <div className="pt-2 border-t flex justify-between items-center text-xs">
                <button
                  onClick={() => upvoteIssue(issue.issue_id)}
                  className="text-slate-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                  Upvote ({issue.upvotes_count})
                </button>
                <button
                  onClick={() => onSelectTrackIssue(issue.issue_id)}
                  className="px-3 py-1 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Track Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
