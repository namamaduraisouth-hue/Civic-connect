import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIssues } from '../../context/IssueContext';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ThumbsUp, 
  ShieldCheck, 
  AlertTriangle
} from 'lucide-react';
import { IssueStatus } from '../../types';

interface IssueTrackerProps {
  initialSearchId?: string;
}

export const IssueTracker: React.FC<IssueTrackerProps> = ({ initialSearchId = '' }) => {
  const { lang, t } = useLanguage();
  const { getIssueById, verifyIssueResolution, upvoteIssue, issues } = useIssues();

  const [searchId, setSearchId] = useState(initialSearchId || (issues[0]?.issue_id || 'MS-2026-001001'));
  const [activeIssue, setActiveIssue] = useState(getIssueById(searchId) || issues[0]);

  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  useEffect(() => {
    if (initialSearchId) {
      setSearchId(initialSearchId);
      const found = getIssueById(initialSearchId);
      if (found) setActiveIssue(found);
    }
  }, [initialSearchId, issues]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = getIssueById(searchId);
    if (found) {
      setActiveIssue(found);
    }
  };

  const timelineSteps: { status: IssueStatus; labelEn: string; labelTa: string }[] = [
    { status: 'NEW', labelEn: 'New Report', labelTa: 'புதிய புகார்' },
    { status: 'SEEN', labelEn: 'Acknowledged', labelTa: 'பார்வையிடப்பட்டது' },
    { status: 'WORKING', labelEn: 'In Progress', labelTa: 'செயலில் உள்ளது' },
    { status: 'COMPLETED', labelEn: 'Completed', labelTa: 'நிறைவுற்றது' }
  ];

  const getStepState = (stepStatus: IssueStatus) => {
    if (!activeIssue) return 'pending';
    const statusOrder: IssueStatus[] = ['NEW', 'SEEN', 'WORKING', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(activeIssue.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex > stepIndex || activeIssue.status === 'COMPLETED') return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header & Search Bar - WHITE + NAVY BLUE */}
      <div className="bg-gradient-to-r from-[#0F2942] via-blue-900 to-[#1E40AF] text-white p-8 rounded-3xl shadow-xl mb-8 border-b-4 border-blue-500">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t('trackPageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mb-6">
          {t('trackPageSub')}
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={t('trackInputPlaceholder')}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 font-mono font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {t('btnTrack')}
          </button>
        </form>
      </div>

      {/* Main Content */}
      {!activeIssue ? (
        <div className="bg-white rounded-3xl p-12 border border-blue-100 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">{t('issueNotFound')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'ta' 
              ? 'தயவுசெய்து புகார் எண்ணை சரிபார்க்கவும் (எ.கா: MS-2026-001001).' 
              : 'Please verify the Issue ID format (e.g., MS-2026-001001) or browse the Public Dashboard.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Issue Header Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md border border-blue-200">
                    {activeIssue.issue_id}
                  </span>
                  <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    activeIssue.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : activeIssue.status === 'WORKING'
                      ? 'bg-blue-200 text-blue-900 border border-blue-400'
                      : activeIssue.status === 'SEEN'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}>
                    {lang === 'ta' 
                      ? activeIssue.status === 'NEW' ? t('statusNew') : activeIssue.status === 'SEEN' ? t('statusSeen') : activeIssue.status === 'WORKING' ? t('statusWorking') : t('statusCompleted')
                      : activeIssue.status}
                  </span>
                  {activeIssue.citizen_verified && (
                    <span className="text-[11px] font-bold bg-blue-900 text-white px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Citizen Verified
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">{activeIssue.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => upvoteIssue(activeIssue.issue_id)}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-4 h-4 text-blue-600" />
                  <span>Support ({activeIssue.upvotes_count})</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {activeIssue.description}
            </p>

            {/* Evidence Photos */}
            {activeIssue.photos && activeIssue.photos.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">
                  {t('evidenceSectionTitle')}:
                </span>
                <div className="flex flex-wrap gap-3">
                  {activeIssue.photos.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Evidence"
                      className="w-28 h-24 object-cover rounded-xl border border-slate-300 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div>
                <span className="text-slate-500 font-bold uppercase block mb-1">Ward & Area</span>
                <p className="font-bold text-slate-900">{activeIssue.ward_name}</p>
                <p className="text-slate-500 text-[11px]">{activeIssue.address}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase block mb-1">Assigned Department</span>
                <p className="font-semibold text-blue-900">
                  {activeIssue.assigned_to || 'Ward Field Operations'}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase block mb-1">Reported On</span>
                <p className="font-semibold text-slate-900">
                  {new Date(activeIssue.created_at).toLocaleDateString()} at {new Date(activeIssue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* RESOLUTION TIMELINE STEPS (4 MAIN STATES) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-700" />
              {t('statusTimelineTitle')}
            </h3>

            {/* Horizontal Timeline bar for desktop */}
            <div className="hidden sm:grid grid-cols-4 gap-2 mb-8 relative">
              <div className="absolute top-4 left-0 w-full h-1 bg-slate-200 -z-0" />
              {timelineSteps.map((s, idx) => {
                const state = getStepState(s.status);
                return (
                  <div key={s.status} className="relative z-10 text-center flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                      state === 'completed'
                        ? 'bg-blue-800 text-white ring-4 ring-blue-100'
                        : state === 'current'
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {state === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-bold mt-2 ${
                      state === 'current' ? 'text-blue-900 font-extrabold' : 'text-slate-600'
                    }`}>
                      {lang === 'ta' ? s.labelTa : s.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Detailed Timeline Events Feed */}
            <div className="space-y-4 border-l-2 border-blue-200 pl-4 ml-2">
              {activeIssue.timeline.map((event, idx) => (
                <div key={idx} className="relative pb-4">
                  <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        {event.new_status || 'UPDATE'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium ml-2">
                        by {event.user_name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {event.message && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      "{event.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CITIZEN VERIFICATION SECTION (TRIGGERED WHEN COMPLETED) */}
          {activeIssue.status === 'COMPLETED' && (
            <div className="bg-blue-50/70 border-2 border-blue-400 p-6 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-700 shrink-0" />
                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-blue-950">
                    {t('verificationTitle')}
                  </h3>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Your feedback ensures official ward accountability in Madurai South Assembly Constituency.
                  </p>
                </div>
              </div>

              {activeIssue.citizen_verified ? (
                <div className="bg-blue-100 text-blue-950 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-700" />
                  {t('verifiedSuccessText')}
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => verifyIssueResolution(activeIssue.issue_id, true)}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t('btnFixed')}
                  </button>
                  <button
                    onClick={() => setReopenModalOpen(true)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {t('btnStillProblem')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REOPEN MODAL */}
          {reopenModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Reopen Issue Complaint
                </h3>
                <p className="text-xs text-slate-600">
                  {t('reopenReasonPrompt')}
                </p>
                <textarea
                  rows={3}
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="e.g. Water is still leaking from the main pipe..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setReopenModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      verifyIssueResolution(activeIssue.issue_id, false, reopenReason);
                      setReopenModalOpen(false);
                      setReopenReason('');
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md"
                  >
                    {t('btnConfirmReopen')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Location Map View */}
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-md">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-700" />
              Location Map Verification
            </h3>
            <ConstituencyMap
              centerLat={activeIssue.latitude}
              centerLng={activeIssue.longitude}
              selectedLat={activeIssue.latitude}
              selectedLng={activeIssue.longitude}
              interactive={false}
              heightClass="h-[300px]"
            />
          </div>

        </div>
      )}

    </div>
  );
};
