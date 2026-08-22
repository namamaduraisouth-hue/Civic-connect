import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CivicEmblem } from '../common/CivicEmblem';
import { Lock, Mail, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

interface MlaLoginProps {
  onLoginSuccess?: () => void;
}

export const MlaLogin: React.FC<MlaLoginProps> = ({ onLoginSuccess }) => {
  const { lang, t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = login(email, password, 'mla');
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.error || t('invalidCredentials'));
    }
  };

  const handleQuickFill = () => {
    setEmail('mla@maduraisouth.gov.in');
    setPassword('Mla@12345');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-blue-100 shadow-2xl p-8 space-y-6">
        
        {/* Emblem & Header */}
        <div className="text-center space-y-2">
          <CivicEmblem className="w-14 h-14 mx-auto mb-2" />
          <div className="text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-200">
            {t('constituencyTitle')}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {t('mlaLoginTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('mlaLoginSub')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-300 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline"
            >
              {t('forgotPassword')}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#0F2942] to-blue-800 hover:from-blue-950 hover:to-blue-900 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <ShieldCheck className="w-5 h-5 text-blue-300" />
            {t('btnLogin')}
          </button>
        </form>

        {/* Demo Fast Fill Helper */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs text-slate-600 hover:text-blue-900 font-semibold flex items-center justify-center gap-1 mx-auto bg-blue-50/60 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-700" />
            {t('quickLoginMla')}
          </button>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-blue-100 text-xs">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              {t('forgotPassword')}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'ta'
                ? 'கடவுச்சொல் மீட்டமைக்க, உங்கள் அதிகாரப்பூர்வ மதுரை தெற்கு சட்டமன்ற தொகுதி நிர்வாகியை தொடர்பு கொள்ளவும்.'
                : 'To reset your MLA portal password, please contact the Assembly Constituency IT Nodal Officer.'}
            </p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-[11px] font-mono text-blue-950">
              support@maduraisouthconnect.tn.gov.in
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 bg-[#0F2942] text-white font-bold rounded-lg"
              >
                {t('cancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
