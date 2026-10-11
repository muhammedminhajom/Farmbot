'use client';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Mic, Square, Loader2, Edit3, CheckCircle, Keyboard, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function AudioRecorder({ onTranscript }: { onTranscript: (t: string) => void }) {
  const { isRecording, duration, waveformData, start, stop, audioBase64, reset } = useAudioRecorder();
  const { language, t } = useI18n();
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptData, setTranscriptData] = useState<{text: string, lowConf: boolean} | null>(null);
  const [editableText, setEditableText] = useState("");

  useEffect(() => {
    if (audioBase64) {
      handleTranscribe(audioBase64);
    }
  }, [audioBase64]);

  const handleTranscribe = async (base64: string) => {
    setTranscribing(true);
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64, encoding: 'WEBM_OPUS' })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTranscriptData({ text: data.transcript, lowConf: data.lowConfidence });
      setEditableText(data.transcript);
      onTranscript(data.transcript);
      if (data.lowConfidence) toast(language === 'ml' ? "വരികൾ തിരുത്താവുന്നതാണ്" : "You can edit the text", { icon: '✍️' });
    } catch (e) {
      toast.error(language === 'ml' ? "ശബ്ദം തിരിച്ചറിയാൻ കഴിഞ്ഞില്ല" : "Voice recognition failed");
    } finally {
      setTranscribing(false);
    }
  };

  const handleManualChange = (val: string) => {
    setEditableText(val);
    onTranscript(val);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 slide-up">
      <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-6 self-center w-fit mx-auto border border-gray-100">
        <button 
          type="button"
          onClick={() => setMode('voice')}
          className={clsx(
            "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
            mode === 'voice' ? "bg-forest text-white shadow-md scale-105" : "text-gray-400 hover:text-forest"
          )}
        >
          <Mic className="w-4 h-4" />
          <span>{language === 'ml' ? 'ശബ്ദം' : 'Voice'}</span>
        </button>
        <button 
          type="button"
          onClick={() => setMode('text')}
          className={clsx(
            "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
            mode === 'text' ? "bg-forest text-white shadow-md scale-105" : "text-gray-400 hover:text-forest"
          )}
        >
          <Keyboard className="w-4 h-4" />
          <span>{language === 'ml' ? 'ടൈപ്പ് ചെയ്യുക' : 'Type'}</span>
        </button>
      </div>

      {mode === 'voice' ? (
        <div className="space-y-6">
          {!isRecording && !transcribing && !transcriptData && (
            <div className="flex flex-col items-center py-6">
              <button 
                type="button"
                onClick={start}
                className="group relative w-20 h-20 rounded-full bg-forest text-white flex items-center justify-center hover:scale-110 transition-all shadow-2xl active:scale-95 border-8 border-forest/10"
              >
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full border-4 border-lime animate-ping opacity-20 pointer-events-none" />
              </button>
              <p className="mt-4 text-sm text-gray-500 font-bold font-malayalam">{t('press_to_record')}</p>
            </div>
          )}

          {isRecording && (
            <div className="flex flex-col items-center py-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="text-2xl font-black font-mono text-red-500 animate-pulse">
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex space-x-1.5 h-12 items-center">
                  {waveformData.slice(0, 30).map((v, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-red-500 rounded-full transition-all duration-75" 
                      style={{ height: `${Math.max(4, v * 100)}%`, opacity: 0.3 + (v * 0.7) }} 
                    />
                  ))}
                </div>
              </div>
              <button 
                type="button"
                onClick={stop}
                className="w-18 h-18 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-xl hover:bg-red-600 border-8 border-red-50"
              >
                <Square className="w-7 h-7 fill-white" />
              </button>
            </div>
          )}

          {transcribing && (
            <div className="flex flex-col items-center py-10 scale-up">
              <div className="relative mb-6">
                 <Loader2 className="w-16 h-16 text-forest animate-spin" />
                 <Mic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-forest/40" />
              </div>
              <p className="text-base text-forest font-black font-malayalam animate-pulse text-center">
                {t('analyzing_voice')}<br/>
                <span className="text-xs text-forest/60 font-medium">{t('wait_moment')}</span>
              </p>
            </div>
          )}

          {transcriptData && (
            <div className="fade-in space-y-4">
              <div className={clsx(
                "p-5 rounded-2xl border-2 transition-colors",
                transcriptData.lowConf ? "border-yellow-200 bg-yellow-50/50" : "border-lime-200 bg-lime-50/10"
              )}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-forest/40 flex items-center">
                    {transcriptData.lowConf ? t('low_conf') : t('high_conf')}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => { setTranscriptData(null); reset(); }} 
                    className="text-[10px] text-red-600 font-black uppercase hover:underline"
                  >
                    {t('re_record')}
                  </button>
                </div>
                <textarea 
                  value={editableText}
                  onChange={(e) => handleManualChange(e.target.value)}
                  placeholder={t('type_symptoms')}
                  className="w-full bg-transparent border-none focus:ring-0 text-forest text-lg font-bold resize-none leading-relaxed min-h-[100px] placeholder-forest/20"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="fade-in">
          <div className="bg-sky/5 p-5 rounded-2xl border-2 border-sky-100 focus-within:border-sky-400 transition-colors">
            <div className="flex items-center space-x-2 mb-3 text-sky-700/60 font-black text-[10px] uppercase tracking-widest">
              <MessageSquare className="w-3 h-3" />
              <span>{language === 'ml' ? 'വിവരങ്ങൾ ടൈപ്പ് ചെയ്യുക' : 'Type Symptoms'}</span>
            </div>
            <textarea 
              value={editableText}
              onChange={(e) => handleManualChange(e.target.value)}
              placeholder={t('type_symptoms')}
              className="w-full bg-transparent border-none focus:ring-0 text-forest text-lg font-bold resize-none leading-relaxed min-h-[150px] placeholder-forest/10 font-malayalam"
            />
          </div>
          <div className="mt-4 p-4 bg-lime-50/20 rounded-2xl flex items-start space-x-3 border border-lime-100/30">
             <CheckCircle className="w-5 h-5 text-lime-dark mt-0.5" />
             <div>
               <p className="text-xs font-black text-forest font-malayalam">{t('info_received')}</p>
               <p className="text-[11px] text-forest/60 font-medium leading-relaxed mt-1">
                 {editableText ? t('info_success') : t('info_guide')}
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
