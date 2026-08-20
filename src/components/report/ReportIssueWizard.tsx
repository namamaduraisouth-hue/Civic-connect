import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIssues } from '../../context/IssueContext';
import { ConstituencyMap } from '../map/ConstituencyMap';
import { validateMaduraiSouthLocation, getAddressFromCoords } from '../../utils/geoValidation';
import { IssueCategory, IssueSeverity } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Upload, 
  FileText, 
  Navigation, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Copy,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportIssueWizardProps {
  onSuccessNavigateTrack: (issueId: string) => void;
}

export const ReportIssueWizard: React.FC<ReportIssueWizardProps> = ({ onSuccessNavigateTrack }) => {
  const { lang, t } = useLanguage();
  const { addIssue } = useIssues();

  const [step, setStep] = useState<number>(1);

  // Form Step 1: Details
  const [category, setCategory] = useState<IssueCategory>('road_damage');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [dateNoticed, setDateNoticed] = useState(new Date().toISOString().split('T')[0]);
  const [timeNoticed, setTimeNoticed] = useState('10:00');

  // Form Step 2: Location (Default inside Madurai South near Kamarajar Salai)
  const [latitude, setLatitude] = useState<number>(9.9152);
  const [longitude, setLongitude] = useState<number>(78.1300);
  const [address, setAddress] = useState<string>('Kamarajar Salai Main Road, Ward 51, Madurai South');
  const [addressQuery, setAddressQuery] = useState<string>('');

  // Form Step 3: Evidence Photos
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  ]);

  // Form Step 4: Final Submission State
  const [submittedIssueId, setSubmittedIssueId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Location Validation
  const valResult = validateMaduraiSouthLocation(latitude, longitude);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(getAddressFromCoords(lat, lng));
  };

  const handleUseGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationUpdate(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback location inside Madurai South if GPS disabled
          handleLocationUpdate(9.9180, 78.1250);
        }
      );
    } else {
      handleLocationUpdate(9.9180, 78.1250);
    }
  };

  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressQuery.trim()) return;
    // Map preset landmark search queries to coordinates
    const q = addressQuery.toLowerCase();
    if (q.includes('simmakkal')) handleLocationUpdate(9.9280, 78.1170);
    else if (q.includes('teppakulam')) handleLocationUpdate(9.9142, 78.1538);
    else if (q.includes('mahal')) handleLocationUpdate(9.9152, 78.1238);
    else if (q.includes('anuppanadi')) handleLocationUpdate(9.9075, 78.1512);
    else if (q.includes('villapuram')) handleLocationUpdate(9.8995, 78.1215);
    else if (q.includes('tallakulam') || q.includes('mattuthavani') || q.includes('outside')) handleLocationUpdate(9.9900, 78.1200); // Outside constituency
    else handleLocationUpdate(9.9150, 78.1300);
  };

  const categoriesList: { id: IssueCategory; labelKey: keyof typeof import('../../i18n/translations').translations.en }[] = [
    { id: 'road_damage', labelKey: 'catRoadDamage' },
    { id: 'drainage', labelKey: 'catDrainage' },
    { id: 'street_lights', labelKey: 'catStreetLights' },
    { id: 'garbage', labelKey: 'catGarbage' },
    { id: 'water', labelKey: 'catWater' },
    { id: 'other', labelKey: 'catOther' }
  ];

  const handleSubmit = () => {
    if (!valResult.isValid) return;

    const created = addIssue({
      category,
      title: title || `${t(categoriesList.find(c => c.id === category)?.labelKey || 'catOther')} at ${valResult.detectedWard.name_en}`,
      description: description || "Civic report submitted via Madurai South Connect mobile platform.",
      photos,
      latitude,
      longitude,
      address,
      ward_id: valResult.detectedWard.ward_id,
      ward_name: lang === 'ta' ? valResult.detectedWard.name_ta : valResult.detectedWard.name_en,
      priority_score: severity === 'high' ? 85 : severity === 'medium' ? 60 : 35,
      severity
    });

    setSubmittedIssueId(created.issue_id);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
      
      {/* Wizard Header Banner */}
      <div className="civic-gradient-header text-white p-6 rounded-2xl shadow-lg mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          {t('reportTitle')}
        </h1>
        <p className="text-sm text-slate-200">
          {t('reportSub')}
        </p>
      </div>

      {/* Progress Steps Header */}
      {!submittedIssueId && (
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {[
            { num: 1, label: t('step1Title') },
            { num: 2, label: t('step2Title') },
            { num: 3, label: t('step3Title') },
            { num: 4, label: t('step4Title') }
          ].map((s) => (
            <div 
              key={s.num}
              onClick={() => {
                // Only allow navigating back or forwards if previous step valid
                if (s.num < step || (s.num === 2 && title.length > 0)) setStep(s.num);
              }}
              className={`flex items-center space-x-2 cursor-pointer transition-all ${
                step === s.num 
                  ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-1' 
                  : step > s.num 
                  ? 'text-emerald-600 font-medium' 
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num 
                  ? 'bg-blue-600 text-white' 
                  : step > s.num 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs font-medium">{s.label.split('.')[1]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Submission Success View */}
      {submittedIssueId ? (
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{t('submitSuccessTitle')}</h2>
            <p className="text-sm text-slate-600 mt-1">{t('submitSuccessSub')}</p>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-emerald-400 p-4 rounded-xl inline-block max-w-sm w-full">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">Issue Tracking ID</span>
            <div className="text-2xl font-mono font-bold text-blue-900 tracking-wider flex items-center justify-center gap-3">
              <span>{submittedIssueId}</span>
              <button 
                onClick={handleCopyId}
                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-xs font-sans font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : t('copyIdBtn')}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-xs text-left max-w-md mx-auto space-y-2 border border-blue-200">
            <p className="font-semibold flex items-center gap-1.5">
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
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
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
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              {t('reportAnotherBtn')}
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Form Body */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 md:p-8">
          
          {/* STEP 1: Issue Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('categoryLabel')} *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoriesList.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-xl text-left border text-xs font-bold transition-all flex items-center gap-2.5 ${
                        category === cat.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm ring-2 ring-blue-500/30' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${category === cat.id ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <span>{t(cat.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('issueTitleLabel')} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('issueTitlePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('descriptionLabel')} *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!title.trim()) setTitle(`${t(categoriesList.find(c => c.id === category)?.labelKey || 'catOther')} report`);
                    setStep(2);
                  }}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {t('nextButton')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Map Validation */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t('locationInstruction')}
              </p>

              {/* Quick Preset Landmarks & Address search */}
              <div className="space-y-3">
                <form onSubmit={handleAddressSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={addressQuery}
                    onChange={(e) => setAddressQuery(e.target.value)}
                    placeholder={t('addressSearchPlaceholder')}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Search
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-500 font-semibold py-1">Quick Select:</span>
                  {[
                    { name: 'Simmakkal', lat: 9.9280, lng: 78.1170 },
                    { name: 'Thirumalai Nayakkar Mahal', lat: 9.9152, lng: 78.1238 },
                    { name: 'Kamarajar Salai', lat: 9.9205, lng: 78.1352 },
                    { name: 'Teppakulam', lat: 9.9142, lng: 78.1538 },
                    { name: 'Anuppanadi', lat: 9.9075, lng: 78.1512 },
                    { name: 'Villapuram', lat: 9.8995, lng: 78.1215 },
                    { name: 'Tallakulam (Outside test)', lat: 9.9900, lng: 78.1200 }
                  ].map(lm => (
                    <button
                      key={lm.name}
                      type="button"
                      onClick={() => handleLocationUpdate(lm.lat, lm.lng)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 rounded-md font-medium text-[11px] border border-slate-200"
                    >
                      {lm.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleUseGps}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[11px] flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    {t('btnUseGps')}
                  </button>
                </div>
              </div>

              {/* Interactive Map */}
              <ConstituencyMap
                centerLat={latitude}
                centerLng={longitude}
                selectedLat={latitude}
                selectedLng={longitude}
                onLocationSelect={handleLocationUpdate}
                heightClass="h-[340px]"
              />

              {/* Selected Location Metadata Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Selected Address</span>
                  <p className="font-semibold text-slate-900">{address}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">{t('detectedWardLabel')}</span>
                  <div className="font-bold text-blue-900 bg-blue-100/70 p-2 rounded-lg border border-blue-200">
                    {lang === 'ta' ? valResult.detectedWard.name_ta : valResult.detectedWard.name_en}
                    <span className="block text-[11px] text-blue-700 font-normal mt-0.5">
                      Councillor: {valResult.detectedWard.councillor_name} ({valResult.detectedWard.contact_phone})
                    </span>
                  </div>
                </div>
              </div>

              {/* STRICT CONSTITUENCY BOUNDARY VALIDATION ALERT */}
              {valResult.isValid ? (
                /* INSIDE ALERT */
                <div className="bg-emerald-50 border-2 border-emerald-500/80 p-4 rounded-xl flex items-center gap-3 text-emerald-900 shadow-sm">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm md:text-base">
                      {t('locationInsideSuccess')}
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {lang === 'ta' 
                        ? 'உங்கள் புகார் 192-மதுரை தெற்கு சட்டமன்ற தொகுதி கவுன்சிலருக்கு அனுப்பப்படும்.'
                        : 'Your issue report will be assigned to the Ward Councillor for Assembly 192.'}
                    </p>
                  </div>
                </div>
              ) : (
                /* OUTSIDE ALERT (DISABLE SUBMISSION) */
                <div className="bg-red-50 border-2 border-red-500 p-5 rounded-xl space-y-2 text-red-950 shadow-md">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base text-red-900">
                        {t('locationOutsideWarningTitle')}
                      </h4>
                      <p className="text-xs font-semibold text-red-800 mt-1">
                        {t('locationOutsideWarningSub')}
                      </p>
                      <p className="text-xs text-red-700 mt-2 font-mono bg-red-100 p-2 rounded border border-red-200">
                        {t('locationOutsideSubmitDisabled')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  onClick={() => setStep(3)}
                  className={`px-6 py-3 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
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

          {/* STEP 3: Evidence Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('uploadPhotoLabel')}
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50 transition-all cursor-pointer">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">{t('dragDropText')}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{t('privacyNote')}</p>
                </div>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase text-slate-600 block mb-2">Attached Evidence Photos:</span>
                  <div className="flex flex-wrap gap-4">
                    {photos.map((p, idx) => (
                      <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm group">
                        <img src={p} alt="Evidence photo" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">Photo {idx + 1}</span>
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
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
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
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
                {t('reviewSummaryTitle')}
              </h3>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
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
                      severity === 'high' ? 'bg-red-100 text-red-800' : severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
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
                    <span className="text-slate-500 font-bold uppercase block mb-1">Constituency Status</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {valResult.constituencyNameEn}
                    </span>
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
                  onClick={handleSubmit}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {t('confirmSubmitBtn')}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
