import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { CivicEmblem } from '../common/CivicEmblem';
import { Lock, Mail, UserCheck, AlertCircle, KeyRound } from 'lucide-react';

interface CouncillorLoginProps {
  onLoginSuccess?: () => void;
}

export const CouncillorLogin: React.FC<CouncillorLoginProps> = ({ onLoginSuccess }) => {
  const { lang, t } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = login(email, password, 'councillor');
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.error || t('invalidCredentials'));
    }
  };

  const handleQuickFill = (wardId: string) => {
    const user = DEMO_USERS.find(u => u.ward_id === wardId) || DEMO_USERS[1];
    setEmail(user.email);
    setPassword('Ward51@12345');
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
            {t('councillorLoginTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('councillorLoginSub')}
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
                placeholder="councillor.ward51@maduraisouth.gov.in"
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

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#0F2942] to-blue-800 hover:from-blue-950 hover:to-blue-900 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <UserCheck className="w-5 h-5 text-blue-300" />
            {t('btnLogin')}
          </button>
        </form>

        {/* Demo Fast Fill Helpers */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-center">
          <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
            {t('demoCredentialsHelp')}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('WARD_51')}
              className="text-[11px] text-blue-900 bg-blue-50 hover:bg-blue-100 font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3 text-blue-700" />
              Ward 51
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('WARD_52')}
              className="text-[11px] text-blue-900 bg-blue-50 hover:bg-blue-100 font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3 text-blue-700" />
              Ward 52
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('WARD_55')}
              className="text-[11px] text-blue-900 bg-blue-50 hover:bg-blue-100 font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3 text-blue-700" />
              Ward 55
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
