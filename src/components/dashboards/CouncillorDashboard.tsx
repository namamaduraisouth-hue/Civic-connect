import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { MADURAI_SOUTH_WARDS } from '../../data/maduraiSouthWards';
import { IssueStatus, CivicIssue } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  UserCheck, 
  Building2, 
  Upload, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const CouncillorDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { selectedWardFilter, setSelectedWardFilter } = useAuth();
  const { issues, updateIssueStatus } = useIssues();

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>('in_progress');
  const [assignedDept, setAssignedDept] = useState('Highways & Infrastructure Division');
  const [commentText, setCommentText] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80');

  const activeWard = MADURAI_SOUTH_WARDS.find(w => w.ward_id === selectedWardFilter) || MADURAI_SOUTH_WARDS[2];

  // Filter issues for selected ward
  const wardIssues = issues.filter(i => i.ward_id === selectedWardFilter);
  const highPriorityQueue = wardIssues.filter(i => i.priority_score >= 70 || i.severity === 'high');
  const pendingIssues = wardIssues.filter(i => i.status !== 'resolved');
  const resolvedIssues = wardIssues.filter(i => i.status === 'resolved');

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    updateIssueStatus(
      selectedIssue.issue_id,
      newStatus,
      `Councillor ${activeWard.councillor_name}`,
      commentText || `Status updated to ${newStatus.replace('_', ' ')}`,
      proofPhotoUrl,
      assignedDept
    );

    setModalOpen(false);
    setSelectedIssue(null);
    setCommentText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-[#0F2942] text-white p-8 rounded-2xl shadow-xl flex flex-wrap justify-between items-center gap-6 border-b-4 border-amber-500">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            Ward Representative Action Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {lang === 'ta' ? activeWard.name_ta : activeWard.name_en}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Councillor: <strong>{activeWard.councillor_name}</strong> | Contact: {activeWard.contact_phone}
          </p>
        </div>

        {/* Ward Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-3 rounded-xl border border-slate-700">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{t('selectWardFilter')}:</span>
          <select
            value={selectedWardFilter}
            onChange={(e) => setSelectedWardFilter(e.target.value)}
            className="bg-slate-900 text-xs font-bold text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {MADURAI_SOUTH_WARDS.map(w => (
              <option key={w.ward_id} value={w.ward_id}>
                {lang === 'ta' ? w.name_ta : w.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Total Ward Complaints</span>
          <span className="text-3xl font-extrabold text-slate-900">{wardIssues.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/40 shadow-sm">
          <span className="text-xs text-red-600 font-bold uppercase block mb-1">High Priority Queue</span>
          <span className="text-3xl font-extrabold text-red-900">{highPriorityQueue.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-xs text-amber-700 font-bold uppercase block mb-1">Pending Action</span>
          <span className="text-3xl font-extrabold text-amber-900">{pendingIssues.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-xs text-emerald-700 font-bold uppercase block mb-1">Resolved Issues</span>
          <span className="text-3xl font-extrabold text-emerald-900">{resolvedIssues.length}</span>
        </div>
      </div>

      {/* High Priority Queue List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            {t('highPriorityQueue')} ({highPriorityQueue.length})
          </h2>
          <span className="text-xs text-slate-500">Sorted by Priority Score (0 - 100)</span>
        </div>

        {highPriorityQueue.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No high priority issues pending in this ward.</p>
        ) : (
          <div className="space-y-3">
            {highPriorityQueue.map(issue => (
              <div key={issue.issue_id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex flex-wrap justify-between items-center gap-4 transition-all">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {issue.issue_id}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-100 text-red-800 rounded">
                      Priority: {issue.priority_score}/100
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Status: {issue.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{issue.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{issue.address}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedIssue(issue);
                    setModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  {t('btnUpdateStatus')}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION UPDATE MODAL */}
      {modalOpen && selectedIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              {t('modalUpdateTitle')} — {selectedIssue.issue_id}
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-amber-500"
                >
                  <option value="received">Received by Ward</option>
                  <option value="verified">Verified by Inspector</option>
                  <option value="assigned">Assigned to Department</option>
                  <option value="in_progress">Work In Progress</option>
                  <option value="resolved">Resolved (Complete)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('assignedOfficer')}</label>
                <input
                  type="text"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Remark / Action Comment</label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Describe action taken, department crew dispatched..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('uploadProofPhoto')}</label>
                <input
                  type="text"
                  value={proofPhotoUrl}
                  onChange={(e) => setProofPhotoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md"
                >
                  Save Status & Log Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
