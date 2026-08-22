import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CivicEmblem } from './CivicEmblem';
import { Phone, Mail, ExternalLink, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#0F2942] text-slate-300 border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CivicEmblem className="w-10 h-10" />
              <div>
                <h3 className="font-bold text-white text-base">{t('appName')}</h3>
                <p className="text-xs text-blue-300 font-medium">{t('constituencyTitle')}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('footerDisclaimer')}
            </p>
            <div className="flex items-center space-x-2 text-xs text-blue-300 bg-blue-950/80 p-2 rounded-xl border border-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{lang === 'ta' ? 'அதிகாரப்பூர்வ தொகுதி போர்டல்' : 'Official Constituency Portal'}</span>
            </div>
          </div>

          {/* Col 2: Key Emergency Contacts */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-blue-900 pb-2">
              {lang === 'ta' ? 'அவசர தொடர்புகள்' : 'Emergency Helpline'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Corporation Control Room: <strong>1800-425-8888</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Water Supply Helpline: <strong>0452-2530521</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Streetlight Faults: <strong>0452-2530523</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@maduraisouthconnect.tn.gov.in</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Covered Localities */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-blue-900 pb-2">
              {lang === 'ta' ? 'முக்கிய பகுதிகள்' : 'Key Covered Areas'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Simmakkal & Meenakshi East</li>
              <li>• Thirumalai Nayakkar Mahal & Keelavasal</li>
              <li>• Kamarajar Salai & Munichalai</li>
              <li>• Mariamman Kovil Teppakulam & Anna Nagar</li>
              <li>• Anuppanadi Central & Villapuram Main</li>
            </ul>
          </div>

          {/* Col 4: Official Representative Portals */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-blue-900 pb-2">
              {lang === 'ta' ? 'அதிகாரப்பூர்வ உள்நுழைவு' : 'Official Access Portals'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {lang === 'ta' 
                ? 'வார்டு கவுன்சிலர்கள் மற்றும் எம்.எல்.ஏ அலுவலக நிர்வாக அணுகல்.'
                : 'Dedicated login access for Ward Councillors and MLA constituency team.'}
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('councillor')}
                className="w-full py-2.5 px-3.5 bg-blue-950 hover:bg-blue-900 text-blue-200 rounded-xl text-xs font-bold border border-blue-800 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  {t('roleCouncillor')} Portal (/councillor)
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('mla')}
                className="w-full py-2.5 px-3.5 bg-blue-950 hover:bg-blue-900 text-blue-200 rounded-xl text-xs font-bold border border-blue-800 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  {t('roleMla')} Portal (/mla)
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
              </button>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-blue-900 text-center text-xs text-slate-400">
          © 2026 192-Madurai South Assembly Constituency. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
