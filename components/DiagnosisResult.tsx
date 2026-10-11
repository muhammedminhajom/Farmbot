'use client';
import { DiagnosisRecord } from '@/types';
import SeverityBadge from './SeverityBadge';
import WeatherCard from './WeatherCard';
import { motion } from 'framer-motion';
import { Save, RefreshCcw, Leaf, Cloud, ShieldAlert, Calendar, AlertCircle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';

export default function DiagnosisResult({ result, onSave }: { result: DiagnosisRecord; onSave: () => void }) {
  const { t, language } = useI18n();
  const sections = result.treatmentPlan.split(/\d\.\s/).filter(s => s.trim().length > 0);
  
  const icons = [
    <Leaf key="leaf" className="w-5 h-5 text-forest" />,
    <Cloud key="cloud" className="w-5 h-5 text-forest" />,
    <ShieldAlert key="shield" className="w-5 h-5 text-forest" />,
    <Calendar key="calendar" className="w-5 h-5 text-forest" />,
    <AlertCircle key="alert" className="w-5 h-5 text-forest" />,
    <PhoneCall key="phone" className="w-5 h-5 text-forest" />
  ];

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-6 pb-32"
    >
      <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-forest via-lime to-forest opacity-50" />
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-50">
          <div>
             <div className="inline-flex items-center space-x-2 bg-forest/5 px-3 py-1 rounded-full text-forest text-[10px] font-black uppercase tracking-widest mb-2 border border-forest/5">
                <CheckCircle2 className="w-3 h-3 text-lime-dark" />
                <span>{t('diagnosis_result')}</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-forest font-malayalam tracking-tight leading-tight">
               {language === 'en' ? result.crop : result.crop}
             </h2>
             <h3 className="text-xl md:text-2xl font-black text-forest/40 font-malayalam leading-tight mt-1">
               {result.malayalam_disease}
               {language === 'en' && <span className="text-xs text-forest/30 ml-2 block italic mt-1 font-karla font-medium">({result.disease})</span>}
             </h3>
          </div>
          <SeverityBadge severity={result.severity} />
        </header>

        <div className="space-y-3 mb-12 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 shadow-inner">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-forest/40">{t('confidence')}</span>
            <span className="text-xl font-black text-forest leading-none">{result.confidence}%</span>
          </div>
          <div className="w-full h-4 bg-white/70 rounded-full overflow-hidden border border-gray-50 shadow-inner p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              className={clsx(
                "h-full rounded-full transition-all duration-1000",
                result.confidence > 80 ? "bg-forest" : result.confidence > 60 ? "bg-lime-dark" : "bg-red-500"
              )}
            />
          </div>
        </div>

        <WeatherCard weather={result.weather} forecast={result.forecast} />

        <div className="mt-12 space-y-6">
          <h4 className="text-sm font-black text-forest/40 uppercase tracking-[0.3em] mb-4 flex items-center">
             <div className="w-8 h-px bg-forest/10 mr-3" />
             {t('treatment_plan')}
          </h4>
          {sections.map((text, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border-2 border-transparent hover:border-lime/20 transition-all shadow-sm hover:shadow-md slide-up">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center shadow-inner border border-forest/5 group-hover:scale-110 transition-transform">
                   {icons[i] || <Leaf className="w-6 h-6 text-forest" />}
                </div>
                <h4 className="font-black text-lg md:text-xl text-forest font-malayalam leading-tight">
                   {text.split('\n')[0].replace(/^[^\w\s]*\s*/, '')}
                </h4>
              </div>
              <div className="text-forest/70 font-medium whitespace-pre-wrap leading-relaxed text-sm md:text-base pl-1 underline-offset-4 decoration-lime/20 decoration-2">
                {text.split('\n').slice(1).join('\n').trim()}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pb-4">
          <button 
            type="button"
            onClick={() => { onSave(); toast.success(t('save_success')); }}
            className="group flex items-center justify-center space-x-3 py-6 bg-forest text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-leaf transition-all active:scale-95 border-8 border-forest/10 shadow-forest/20"
          >
            <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-malayalam">{t('save_success').split(' ')[0]}</span>
          </button>
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="group flex items-center justify-center space-x-3 py-6 bg-white text-forest rounded-[2rem] font-black text-lg shadow-xl hover:bg-gray-50 transition-all active:scale-95 border-4 border-gray-100"
          >
            <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
            <span className="font-malayalam tracking-tight">{language === 'ml' ? 'വീണ്ടും' : 'Restart'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function clsx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
