import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CivicEmblem } from './CivicEmblem';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#0F2942] text-slate-300 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CivicEmblem className="w-10 h-10" />
              <div>
                <h3 className="font-bold text-white text-base">{t('appName')}</h3>
                <p className="text-xs text-amber-400 font-medium">{t('constituencyTitle')}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerDisclaimer')}
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 p-2 rounded border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lang === 'ta' ? 'அதிகாரப்பூர்வ தொகுதி போர்டல்' : 'Official Constituency Portal'}</span>
            </div>
          </div>

          {/* Col 2: Key Emergency Contacts */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              {lang === 'ta' ? 'அவசர தொடர்புகள்' : 'Emergency Helpline'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Corporation Control Room: <strong>1800-425-8888</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Water Supply Helpline: <strong>0452-2530521</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Streetlight Faults: <strong>0452-2530523</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@maduraisouthconnect.tn.gov.in</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Landmarks Covered */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              {lang === 'ta' ? 'முக்கிய பகுதிகள்' : 'Key Covered Areas'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Simmakkal & Meenakshi East</li>
              <li>• Thirumalai Nayakkar Mahal</li>
              <li>• Kamarajar Salai & Munichalai</li>
              <li>• Mariamman Kovil Teppakulam</li>
              <li>• Anuppanadi & Villapuram</li>
            </ul>
          </div>

          {/* Col 4: Transparency Commitment */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              {lang === 'ta' ? 'வெளிப்படைத்தன்மை' : 'Transparency Promise'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {lang === 'ta' 
                ? 'ஒவ்வொரு புகாரும் வரைபட சரிபார்ப்புடன் பதிவு செய்யப்பட்டு கவுன்சிலர் மற்றும் எம்.எல்.ஏ அலுவலக கண்காணிப்பில் வைக்கப்படுகிறது.'
                : 'Every complaint is geo-validated against 192-Madurai South boundaries and directly logged for councillor and MLA oversight.'}
            </p>
            <span className="text-[11px] text-slate-500 block">
              {t('footerRights')}
            </span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 192-Madurai South Assembly Constituency. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
