import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { CivicIssue, IssueStatus } from '../../types';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  Hammer, 
  Trash2, 
  AlertTriangle,
  Camera,
  ShieldCheck,
  Building2,
  Clock,
  Loader2
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: CivicIssue;
  onClose: () => void;
  onStatusUpdated?: () => void;
  onIssueDeleted?: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onStatusUpdated,
  onIssueDeleted
}) => {
  const { lang, t } = useLanguage();
  const { role, user } = useAuth();
  const { updateIssueStatus, deleteIssue } = useIssues();

  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(issue.status);
  const [actionRemark, setActionRemark] = useState('');
  const [assignedDept, setAssignedDept] = useState(issue.assigned_to || 'Ward Field Operations Unit');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const isMla = role === 'mla';

  const handleStatusChange = async (newStatus: IssueStatus) => {
    setSubmitting(true);
    setFeedbackMsg(null);

    const userName = user?.name || (isMla ? 'MLA Office' : 'Ward Councillor');
    const userRole = isMla ? 'mla' : 'councillor';

    const res = await updateIssueStatus(
      issue.issue_id,
      newStatus,
      userName,
      userRole,
      actionRemark || `Status transitioned to ${newStatus}.`,
      undefined,
      assignedDept
    );

    setSubmitting(false);
    if (res.success) {
      setSelectedStatus(newStatus);
      setFeedbackMsg(t('statusUpdatedSuccess'));
      if (onStatusUpdated) onStatusUpdated();
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleDeleteIssue = async () => {
    if (!isMla) return;

    setSubmitting(true);
    const userName = user?.name || 'M. Boominathan (MLA)';
    const res = await deleteIssue(issue.issue_id, 'mla', userName);
    setSubmitting(false);

    if (res.success) {
      setDeleteConfirmOpen(false);
      if (onIssueDeleted) onIssueDeleted();
      onClose();
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'SEEN':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'WORKING':
        return 'bg-blue-200 text-blue-950 border-blue-400';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden">
        
        {/* Header - White + Navy Blue */}
        <div className="bg-[#0F2942] text-white p-5 sm:p-6 flex justify-between items-center border-b border-blue-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold bg-blue-600 px-2.5 py-0.5 rounded text-white tracking-wider">
                {issue.issue_id}
              </span>
              <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(issue.status)}`}>
                {lang === 'ta' 
                  ? issue.status === 'NEW' ? t('statusNew') : issue.status === 'SEEN' ? t('statusSeen') : issue.status === 'WORKING' ? t('statusWorking') : t('statusCompleted')
                  : issue.status}
              </span>
              <span className="text-xs text-blue-200 font-semibold uppercase">
                {issue.category.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">
              {issue.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-700">
          
          {feedbackMsg && (
            <div className="bg-blue-50 border border-blue-300 p-3 rounded-xl text-blue-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-700" />
              {feedbackMsg}
            </div>
          )}

          {/* CITIZEN DETAILS SECTION (Authorized Only) */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 text-blue-950">
                <User className="w-4 h-4 text-blue-700" />
                {t('citizenDetailsTitle')}
              </h3>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                Verified Authorized View
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('citizenNameLabel')}</span>
                <p className="font-extrabold text-slate-900 text-sm">{issue.citizen_name || 'Anonymous Citizen'}</p>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('citizenPhoneLabel')}</span>
                <p className="font-bold text-blue-900 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <a href={`tel:${issue.citizen_phone}`} className="hover:underline">{issue.citizen_phone || 'N/A'}</a>
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('citizenEmailLabel')}</span>
                <p className="font-medium text-slate-800 truncate">
                  {issue.citizen_email || 'Not provided'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('citizenAddressLabel')}</span>
                <p className="font-semibold text-slate-800 line-clamp-2">
                  {issue.citizen_address || issue.address}
                </p>
              </div>
            </div>
          </div>

          {/* ISSUE DETAILS & MAP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Issue Info */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                  {t('issueDetailsTitle')}
                </h4>

                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('descriptionLabel')}</span>
                  <p className="text-slate-800 leading-relaxed font-normal bg-white p-3 rounded-xl border border-slate-200">
                    {issue.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('severityLabel')}</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded font-extrabold uppercase text-[10px] ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-800' : issue.severity === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('detectedWardLabel')}</span>
                    <p className="font-extrabold text-blue-900">{issue.ward_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-0.5">{t('dateNoticedLabel')}</span>
                    <p className="font-semibold text-slate-700">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-0.5">Assigned Department</span>
                    <p className="font-bold text-slate-800">{issue.assigned_to || 'Ward Operations'}</p>
                  </div>
                </div>
              </div>

              {/* Photo Evidence with Geotag */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Camera className="w-3.5 h-3.5 text-blue-700" />
                  {t('evidenceSectionTitle')} ({issue.photos?.length || 0})
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {issue.photos?.map((url, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="h-32 rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm relative group bg-black">
                        <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                          Photo {idx + 1}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        GPS: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Map & Action History */}
            <div className="space-y-4">
              {/* Map */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    Verified Location
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold">{issue.address}</p>

                <ConstituencyMap
                  centerLat={issue.latitude}
                  centerLng={issue.longitude}
                  selectedLat={issue.latitude}
                  selectedLng={issue.longitude}
                  interactive={false}
                  heightClass="h-[180px]"
                />
              </div>

              {/* Action History / Timeline */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  {t('historySectionTitle')}
                </h4>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {issue.timeline && issue.timeline.map((act, idx) => (
                    <div key={act.id || idx} className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-900">
                          {act.user_name} ({act.user_role})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(act.created_at).toLocaleDateString()} {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-50 text-blue-900 rounded border border-blue-200">
                          {act.new_status}
                        </span>
                        <p className="text-slate-600 text-[11px]">{act.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* STATUS UPDATE CONTROLS SECTION */}
          <div className="bg-[#0F2942] text-white p-5 rounded-2xl border border-blue-900 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-blue-900 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Hammer className="w-4 h-4 text-blue-300" />
                {t('btnUpdateStatus')}
              </h3>
              <span className="text-[11px] text-blue-200">
                {lang === 'ta' ? 'அதிகாரப்பூர்வ நிலை மாற்றம் மற்றும் குறிப்புகள்' : 'Official Action Workflow Transition'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-100 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  {t('actionRemarksLabel')}
                </label>
                <textarea
                  rows={2}
                  value={actionRemark}
                  onChange={(e) => setActionRemark(e.target.value)}
                  placeholder={t('actionRemarksPlaceholder')}
                  className="w-full px-3 py-2 bg-slate-800 text-white placeholder-slate-400 rounded-xl border border-slate-700 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-blue-100 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  {t('assignedOfficer')}
                </label>
                <input
                  type="text"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-blue-400 focus:outline-none mb-3"
                />

                {/* 3 Main Action State Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusChange('SEEN')}
                    className={`py-2 px-2 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      selectedStatus === 'SEEN'
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300 shadow'
                        : 'bg-slate-800 hover:bg-blue-600 text-blue-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t('btnMarkSeen')}
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusChange('WORKING')}
                    className={`py-2 px-2 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      selectedStatus === 'WORKING'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow'
                        : 'bg-slate-800 hover:bg-blue-600 text-blue-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    {t('btnMarkWorking')}
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusChange('COMPLETED')}
                    className={`py-2 px-2 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      selectedStatus === 'COMPLETED'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow'
                        : 'bg-slate-800 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('btnMarkCompleted')}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3 border-t border-slate-200">
          <div>
            {/* ONLY MLA CAN DELETE */}
            {isMla ? (
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                {t('btnDeleteIssue')}
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 italic">
                {lang === 'ta' ? 'கவுன்சிலர் தளம்: நீக்குதல் அனுமதி எம்.எல்.ஏ அலுவலகத்திற்கு மட்டுமே.' : 'Ward Portal: Delete permission restricted to MLA office.'}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0F2942] hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              {t('cancelBtn')}
            </button>
          </div>
        </div>

      </div>

      {/* MLA DELETE CONFIRMATION MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-red-700">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('deleteModalTitle')}
                </h3>
                <p className="text-slate-500 font-mono text-[11px]">{issue.issue_id}</p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed font-semibold">
              {t('deleteModalPrompt')}
            </p>

            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-900 text-[11px]">
              ⚠️ <strong>{lang === 'ta' ? 'கவனம்' : 'Audit Notice'}:</strong> {lang === 'ta' ? 'இந்த நடவடிக்கை தணிக்கைப் பதிவேட்டில் பதிவு செய்யப்படும்.' : 'This action is logged with your MLA credentials in the audit trail.'}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                {t('cancelBtn')}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteIssue}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {t('btnConfirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
