import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIssues } from '../../context/IssueContext';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { AddressAutocomplete } from './AddressAutocomplete';
import { validateMaduraiSouthLocation, ValidationResult } from '../../utils/geoValidation';
import { IssueCategory, IssueSeverity, IssueEvidence } from '../../types';
import { uploadEvidencePhoto } from '../../utils/supabaseClient';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Copy,
  Info,
  User,
  Phone,
  Mail,
  Home,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportIssueWizardProps {
  onSuccessNavigateTrack: (issueId: string) => void;
}

export const ReportIssueWizard: React.FC<ReportIssueWizardProps> = ({ onSuccessNavigateTrack }) => {
  const { lang, t } = useLanguage();
  const { addIssue } = useIssues();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Step 1: Issue Details & Citizen Info
  const [category, setCategory] = useState<IssueCategory>('road_damage');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [dateNoticed, setDateNoticed] = useState(new Date().toISOString().split('T')[0]);
  const [timeNoticed, setTimeNoticed] = useState('10:00');

  // Citizen Contact Details
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenAddress, setCitizenAddress] = useState('');

  // Step 2: Location (Default inside Madurai South - Simmakkal / Kamarajar Salai)
  const [latitude, setLatitude] = useState<number>(9.9152);
  const [longitude, setLongitude] = useState<number>(78.1300);
  const [address, setAddress] = useState<string>('Kamarajar Salai Main Road, Ward 52, Madurai South - 625009');
  const [valResult, setValResult] = useState<ValidationResult>(() => validateMaduraiSouthLocation(9.9152, 78.1300));

  // Step 3: Photos & Geotag (COMPULSORY PHOTO REQUIREMENT)
  const [photos, setPhotos] = useState<string[]>([]);
  const [evidenceItems, setEvidenceItems] = useState<IssueEvidence[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Step 4: Final Submission State
  const [submittedIssueId, setSubmittedIssueId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const categoriesList: { id: IssueCategory; labelKey: keyof typeof import('../../i18n/translations').translations.en }[] = [
    { id: 'road_damage', labelKey: 'catRoadDamage' },
    { id: 'drainage', labelKey: 'catDrainage' },
    { id: 'street_lights', labelKey: 'catStreetLights' },
    { id: 'garbage', labelKey: 'catGarbage' },
    { id: 'water', labelKey: 'catWater' },
    { id: 'other', labelKey: 'catOther' }
  ];

  // Address Selected Callback from AddressAutocomplete
  const handleAddressSelected = (selected: {
    address: string;
    latitude: number;
    longitude: number;
    ward_id: string;
    ward_name: string;
    validation: ValidationResult;
  }) => {
    setAddress(selected.address);
    setLatitude(selected.latitude);
    setLongitude(selected.longitude);
    setValResult(selected.validation);
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPhotoError(null);
    const newPhotos: string[] = [];
    const newEvidence: IssueEvidence[] = [];

    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const file = files[i];
      const res = await uploadEvidencePhoto(file, 'draft', i + 1);
      if (res.url) {
        newPhotos.push(res.url);
        newEvidence.push({
          id: `ev-${Date.now()}-${i}`,
          issue_id: '',
          file_url: res.url,
          file_type: 'image',
          latitude: latitude,
          longitude: longitude,
          captured_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_exif_verified: false
        });
      }
    }

    setPhotos(prev => [...prev, ...newPhotos].slice(0, 3));
    setEvidenceItems(prev => [...prev, ...newEvidence].slice(0, 3));
  };

  // Add standard demo photo helper
  const handleAddSamplePhoto = () => {
    const sampleUrls = [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
    ];
    const picked = sampleUrls[photos.length % sampleUrls.length];
    setPhotos(prev => [...prev, picked]);
    setEvidenceItems(prev => [
      ...prev,
      {
        id: `ev-${Date.now()}`,
        issue_id: '',
        file_url: picked,
        file_type: 'image',
        latitude: latitude,
        longitude: longitude,
        captured_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        is_exif_verified: true
      }
    ]);
    setPhotoError(null);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== index));
    setEvidenceItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!citizenName.trim()) {
      alert(lang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.' : 'Please enter your full name.');
      return false;
    }
    if (!citizenPhone.trim() || citizenPhone.trim().length < 8) {
      alert(lang === 'ta' ? 'தயவுசெய்து செல்லுபடியாகும் தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter a valid phone number.');
      return false;
    }
    if (!title.trim()) {
      setTitle(`${t(categoriesList.find(c => c.id === category)?.labelKey || 'catOther')} report`);
    }
    return true;
  };

  // Step 2 Validation (Location must be inside Madurai South)
  const validateStep2 = () => {
    if (!valResult.isValid) {
      alert(lang === 'ta' ? 'தயவுசெய்து மதுரை தெற்கு தொகுதிக்குள் உள்ள சரியான முகவரியை தேர்வு செய்யவும்.' : 'Please select an address within Madurai South constituency.');
      return false;
    }
    return true;
  };

  // Step 3 Validation: Photo is strictly Compulsory
  const validateStep3 = () => {
    if (photos.length === 0) {
      setPhotoError(t('photoCompulsoryRequired'));
      return false;
    }
    setPhotoError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!valResult.isValid) return;
    if (photos.length === 0) {
      setStep(3);
      setPhotoError(t('photoCompulsoryRequired'));
      return;
    }

    try {
      setSubmitting(true);
      const created = await addIssue({
        category,
        title: title || `${t(categoriesList.find(c => c.id === category)?.labelKey || 'catOther')} at ${valResult.detectedWard.name_en}`,
        description: description || "Civic report submitted via Madurai South Connect citizen platform.",
        citizen_name: citizenName || "Citizen Reporter",
        citizen_phone: citizenPhone || "9842000000",
        citizen_email: citizenEmail,
        citizen_address: citizenAddress || address,
        latitude,
        longitude,
        address,
        ward_id: valResult.detectedWard.ward_id,
        ward_name: lang === 'ta' ? valResult.detectedWard.name_ta : valResult.detectedWard.name_en,
        photos,
        evidence_items: evidenceItems,
        severity,
        priority_score: severity === 'high' ? 85 : severity === 'medium' ? 60 : 35
      });

      setSubmittedIssueId(created.issue_id);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedIssueId) {
      navigator.clipboard.writeText(submittedIssueId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Wizard Header Banner - WHITE + NAVY BLUE */}
      <div className="bg-gradient-to-r from-[#0F2942] via-blue-900 to-[#1E40AF] text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 border-b-4 border-blue-500">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          {t('constituencyTitle')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t('reportTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-blue-100">
          {t('reportSub')}
        </p>
      </div>

      {/* Progress Steps Header */}
      {!submittedIssueId && (
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
          {[
            { num: 1, label: t('step1Title') },
            { num: 2, label: t('step2Title') },
            { num: 3, label: t('step3Title') },
            { num: 4, label: t('step4Title') }
          ].map((s) => (
            <div 
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num);
                else if (s.num === 2 && validateStep1()) setStep(2);
                else if (s.num === 3 && validateStep1() && validateStep2()) setStep(3);
              }}
              className={`flex items-center space-x-2 cursor-pointer transition-all ${
                step === s.num 
                  ? 'text-blue-700 font-extrabold border-b-2 border-blue-600 pb-1' 
                  : step > s.num 
                  ? 'text-blue-900 font-medium' 
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num 
                  ? 'bg-blue-600 text-white shadow' 
                  : step > s.num 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">{s.label.split('.')[1]}</span>
            </div>
          ))}
        </div>
      )}

      {/* SUBMISSION SUCCESS VIEW */}
      {submittedIssueId ? (
        <div className="bg-white rounded-3xl p-8 border border-blue-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border-2 border-blue-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{t('submitSuccessTitle')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{t('submitSuccessSub')}</p>
          </div>

          <div className="bg-blue-50/60 border-2 border-dashed border-blue-400 p-5 rounded-2xl inline-block max-w-sm w-full">
            <span className="text-xs text-blue-800 font-bold block uppercase tracking-wider mb-1">Issue Tracking ID</span>
            <div className="text-2xl font-mono font-extrabold text-blue-950 tracking-wider flex items-center justify-center gap-3">
              <span>{submittedIssueId}</span>
              <button 
                onClick={handleCopyId}
                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-sans font-medium flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-blue-700" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : t('copyIdBtn')}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-950 p-4 rounded-2xl text-xs text-left max-w-md mx-auto space-y-2 border border-blue-200">
            <p className="font-bold flex items-center gap-1.5 text-blue-900">
              <Info className="w-4 h-4 text-blue-600" />
              What happens next?
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Assigned to <strong>{valResult.detectedWard.name_en}</strong> councillor office.</li>
              <li>Ward field inspector will perform site verification.</li>
              <li>You can check real-time progress using your tracking ID anytime.</li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => onSuccessNavigateTrack(submittedIssueId)}
              className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              {t('trackMyIssueBtn')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedIssueId(null);
                setStep(1);
                setTitle('');
                setDescription('');
                setPhotos([]);
                setEvidenceItems([]);
              }}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all"
            >
              {t('reportAnotherBtn')}
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Form Body */
        <div className="bg-white rounded-3xl border border-blue-100 shadow-md p-6 sm:p-8">
          
          {/* STEP 1: Details & Citizen Info */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                  {t('categoryLabel')} *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoriesList.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl text-left border text-xs font-bold transition-all flex items-center gap-2.5 ${
                        category === cat.id 
                          ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-sm ring-2 ring-blue-500/30' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${category === cat.id ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <span>{t(cat.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
                  {t('issueTitleLabel')} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('issueTitlePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
                  {t('descriptionLabel')} *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              {/* Severity & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
                    {t('severityLabel')}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="low">{t('sevLow')}</option>
                    <option value="medium">{t('sevMedium')}</option>
                    <option value="high">{t('sevHigh')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
                    {t('dateNoticedLabel')}
                  </label>
                  <input
                    type="date"
                    value={dateNoticed}
                    onChange={(e) => setDateNoticed(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
                    {t('timeNoticedLabel')}
                  </label>
                  <input
                    type="time"
                    value={timeNoticed}
                    onChange={(e) => setTimeNoticed(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* CITIZEN CONTACT INFORMATION SECTION */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('citizenInfoSection')} *
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('citizenPrivacyNote')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('citizenNameLabel')} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder={t('citizenNamePlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('citizenPhoneLabel')} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder={t('citizenPhonePlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('citizenEmailLabel')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder={t('citizenEmailPlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('citizenAddressLabel')}
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={citizenAddress}
                        onChange={(e) => setCitizenAddress(e.target.value)}
                        placeholder={t('citizenAddressPlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-7 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm"
                >
                  {t('nextButton')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Address Autocomplete (NO MANUAL MAP CLICK REQUIRED) */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {lang === 'ta' 
                  ? 'முகவரியைத் தேடி தேர்வு செய்யவும். வரைபடம் தானாகவே சரியான இடத்தைக் காட்டும்.' 
                  : 'Search and select an address from suggestions. The map will automatically locate and verify the constituency boundary.'}
              </p>

              {/* Dedicated Address Autocomplete Component */}
              <AddressAutocomplete
                initialAddress={address}
                initialLat={latitude}
                initialLng={longitude}
                onSelectAddress={handleAddressSelected}
              />

              {/* Automatic Location Preview & Boundary Validation Map */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    {lang === 'ta' ? 'தானியங்கி வரைபட முன்னோட்டம்' : 'Automatic Location Preview Map'}
                  </span>
                  <span className="text-[11px] text-blue-900 font-mono">
                    {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                  </span>
                </div>

                <ConstituencyMap
                  centerLat={latitude}
                  centerLng={longitude}
                  selectedLat={latitude}
                  selectedLng={longitude}
                  interactive={false}
                  heightClass="h-[320px]"
                />
              </div>

              {/* Selected Location Metadata Card */}
              <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Selected Address</span>
                  <p className="font-extrabold text-slate-900 text-sm">{address}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">{t('detectedWardLabel')}</span>
                  <div className="font-bold text-blue-950 bg-white p-2.5 rounded-xl border border-blue-200">
                    {lang === 'ta' ? valResult.detectedWard.name_ta : valResult.detectedWard.name_en}
                    <span className="block text-[11px] text-blue-700 font-normal mt-0.5">
                      Councillor: {valResult.detectedWard.councillor_name} ({valResult.detectedWard.contact_phone})
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="button"
                  disabled={!valResult.isValid}
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className={`px-6 py-3 font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm ${
                    valResult.isValid 
                      ? 'bg-blue-700 hover:bg-blue-800 text-white' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {t('nextButton')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Evidence Upload (PHOTO IS STRICTLY COMPULSORY) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    {t('uploadPhotoLabel')}
                  </label>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {t('photoCompulsoryNotice')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  {lang === 'ta' 
                    ? 'புகார் பதிவு செய்ய குறைந்தது ஒரு நேரடி புகைப்பட சான்று கட்டாயமாகும்.' 
                    : 'At least one photo evidence is mandatory to prevent duplicate or false complaints.'}
                </p>

                {photoError && (
                  <div className="bg-red-50 border border-red-300 p-3 rounded-xl flex items-center gap-2 text-xs text-red-900 font-bold mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{photoError}</span>
                  </div>
                )}

                {/* Upload Box */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-3xl p-8 text-center bg-blue-50/30 hover:bg-blue-50/60 transition-all cursor-pointer space-y-3"
                >
                  <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{t('dragDropText')}</p>
                    <p className="text-xs text-blue-700 font-semibold mt-1">
                      {t('btnSelectFile')}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">{t('privacyNote')}</p>
                </div>

                {/* Quick Add Sample Photo Demo Helper */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    + {lang === 'ta' ? 'மாதிரி புகைப்படம் சேர்க்கவும் (Sample Photo)' : 'Add Sample Evidence Photo'}
                  </button>
                </div>
              </div>

              {/* Photo Previews with Geotag Metadata */}
              {photos.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-slate-700 block">
                    Attached Evidence Photos ({photos.length}/3):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {photos.map((p, idx) => (
                      <div key={idx} className="bg-slate-50 p-2 rounded-2xl border border-slate-200 space-y-2">
                        <div className="relative h-32 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm group">
                          <img src={p} alt="Evidence photo" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                            Photo {idx + 1}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono bg-white p-1.5 rounded border border-slate-200">
                          <span className="font-bold block text-blue-900">Geotag Coords:</span>
                          {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                  className={`px-7 py-3 font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm ${
                    photos.length > 0
                      ? 'bg-blue-700 hover:bg-blue-800 text-white'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Review
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Final Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2">
                {t('reviewSummaryTitle')}
              </h3>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                
                {/* Citizen Info Review */}
                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 space-y-1">
                  <span className="text-[11px] font-extrabold uppercase text-blue-900 block">
                    Citizen Reporter:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-800 font-semibold">
                    <div>Name: {citizenName}</div>
                    <div>Phone: {citizenPhone}</div>
                    <div>Email: {citizenEmail || 'N/A'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">Category</span>
                    <p className="font-semibold text-slate-900 text-sm">
                      {t(categoriesList.find(c => c.id === category)?.labelKey || 'catOther')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">Severity</span>
                    <span className={`inline-block px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                      severity === 'high' ? 'bg-red-100 text-red-800' : severity === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {severity}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Title</span>
                  <p className="font-semibold text-slate-900">{title}</p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Description</span>
                  <p className="text-slate-700 leading-relaxed">{description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">Location & Ward</span>
                    <p className="font-bold text-blue-900">{valResult.detectedWard.name_en}</p>
                    <p className="text-slate-600">{address}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">Attached Photos</span>
                    <p className="text-blue-900 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      {photos.length} Geotagged Photo(s) Attached
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="button"
                  disabled={submitting || photos.length === 0 || !valResult.isValid}
                  onClick={handleSubmit}
                  className={`px-8 py-3.5 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 ${
                    photos.length > 0 && valResult.isValid && !submitting
                      ? 'bg-blue-700 hover:bg-blue-800 text-white hover:shadow-xl'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{lang === 'ta' ? 'பதிவு செய்யப்படுகிறது...' : 'Submitting to Supabase...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t('confirmSubmitBtn')}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
