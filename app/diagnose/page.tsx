'use client';
import { useState, useEffect } from 'react';
import ImageCapture from '@/components/ImageCapture';
import AudioRecorder from '@/components/AudioRecorder';
import LocationBadge from '@/components/LocationBadge';
import LoadingOverlay from '@/components/LoadingOverlay';
import DiagnosisResult from '@/components/DiagnosisResult';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { useI18n } from '@/lib/i18n';
import { LocationData } from '@/types';
import { Phone, Microscope, Info, MapPin, Mic2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DiagnosePage() {
  const { t, language } = useI18n();
  const [imageBase64, setImageBase64] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [phone, setPhone] = useState<string>('');

  const { diagnose, result, progress, progressLabel, reset } = useDiagnosis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      toast.error(t('error_photo'));
      return;
    }
    const cleanPhone = phone.trim().replace(/\s/g, '');
    if (!/^\+91[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error(t('error_phone'));
      return;
    }

    await diagnose({
      imageBase64,
      mimeType,
      phone: cleanPhone,
      lat: location?.lat,
      lon: location?.lon,
      audioTranscript: transcript
    });

    if (progress === 'done') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-32">
      <LoadingOverlay progress={progress} label={progressLabel} />
      
      {!result ? (
        <div className="slide-up space-y-10">
          <header className="text-center">
            <h1 className="text-4xl font-black text-forest mb-3 font-malayalam leading-tight">{t('start_diagnosis')}</h1>
            <p className="text-gray-500 font-bold font-karla max-w-sm mx-auto opacity-60">Follow these 3 simple steps to get an AI treatment plan</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Image */}
            <section className="relative">
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-black shadow-lg">1</div>
                 <h2 className="text-xl font-black text-forest font-malayalam">{t('step_1_title')}</h2>
              </div>
              <ImageCapture onCapture={(base64, mime) => { setImageBase64(base64); setMimeType(mime); }} />
            </section>

            {/* Step 2: Voice or Text */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-black shadow-lg">2</div>
                 <h2 className="text-xl font-black text-forest font-malayalam">{t('step_2_title')}</h2>
              </div>
              <p className="text-xs text-forest/40 font-black mb-4 px-1 italic uppercase tracking-widest">
                 <Mic2 className="w-3 h-3 inline mr-1" /> {t('voice_desc')}
              </p>
              <AudioRecorder onTranscript={setTranscript} />
            </section>

            {/* Step 3: Location & Phone */}
            <section className="bg-warm-white p-6 md:p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-black shadow-lg">3</div>
                 <h2 className="text-xl font-black text-forest font-malayalam">{t('step_3_title')}</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-[2rem] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center space-x-3 text-forest">
                    <MapPin className="w-6 h-6 text-lime-dark" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-forest/30">{t('your_location')}</p>
                      <p className="text-sm font-black font-malayalam leading-tight">{t('weather_info')}</p>
                    </div>
                  </div>
                  <LocationBadge onLocation={setLocation} />
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-forest/10 group-focus-within:text-forest transition-colors">
                    <Phone className="w-full h-full" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder={t('phone_placeholder')} 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-16 pr-8 py-7 rounded-[2rem] border-2 border-gray-50 bg-white font-black text-xl focus:border-forest focus:ring-8 focus:ring-forest/5 outline-none transition-all placeholder-forest/10"
                  />
                </div>

                <div className="flex items-start space-x-3 px-6 py-4 bg-lime/10 rounded-2xl border border-lime/20">
                  <Info className="w-4 h-4 text-forest mt-0.5 shrink-0 opacity-40" />
                  <p className="text-[10px] font-bold text-forest/60 leading-relaxed uppercase tracking-tight">
                    {t('phone_privacy')}
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={!imageBase64 || progress !== 'idle'}
                className="w-full bg-forest text-white h-24 rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center space-x-4 hover:bg-leaf active:scale-95 disabled:opacity-50 disabled:grayscale transition-all group overflow-hidden relative border-8 border-forest/10"
              >
                <Microscope className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                <span className="font-malayalam tracking-tight">{t('analyze_btn')}</span>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer" />
              </button>
              <div className="mt-4 flex items-center justify-center space-x-2 text-forest/20 text-[10px] font-black uppercase tracking-[0.2em]">
                 <CheckCircle2 className="w-3 h-3" />
                 <span>High Speed AI Recognition</span>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <DiagnosisResult result={result} onSave={() => toast.success(t('save_success'))} />
      )}
    </div>
  );
}
