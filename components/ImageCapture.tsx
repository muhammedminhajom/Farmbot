'use client';
import { useState, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, Upload, Trash2, CheckCircle2, Scan } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import toast from 'react-hot-toast';

export default function ImageCapture({ onCapture }: { onCapture: (base64: string, mime: string) => void }) {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'native'>('camera');
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error(language === 'ml' ? "ക്യാമറ ലഭ്യമായില്ല. ഗാലറി ഉപയോഗിക്കുക." : "Camera not available. Please use Gallery.");
      setActiveTab('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    processImage(dataUrl);
    stopCamera();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      processImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (dataUrl: string) => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const compressed = await imageCompression(blob as File, { maxSizeMB: 1, maxWidthOrHeight: 1024 });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64 = result.split(',')[1];
        onCapture(base64, compressed.type);
      };
      reader.readAsDataURL(compressed);
    } catch (e) {
      toast.error(language === 'ml' ? "ചിത്രം പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല" : "Failed to process image");
    }
  };

  const retake = () => {
    setPreview(null);
    onCapture('', '');
    if (activeTab === 'camera') startCamera();
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden slide-up">
      {!preview && (
        <div className="flex bg-gray-50/30 p-1">
          <button 
            type="button"
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex justify-center items-center space-x-2 transition-all rounded-2xl ${activeTab === 'camera' ? 'text-forest bg-white shadow-sm' : 'text-gray-400 hover:text-forest'}`}
            onClick={() => { setActiveTab('camera'); startCamera(); }}
          >
            <Camera className="w-4 h-4" /><span>{language === 'ml' ? 'ക്യാമറ' : 'Live Camera'}</span>
          </button>
          <button 
            type="button"
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex justify-center items-center space-x-2 transition-all rounded-2xl ${activeTab === 'native' ? 'text-forest bg-white shadow-sm' : 'text-gray-400 hover:text-forest'}`}
            onClick={() => { setActiveTab('native'); stopCamera(); }}
          >
            <Scan className="w-4 h-4" /><span>{language === 'ml' ? 'ഫോട്ടോ എടുക്കുക' : 'Take Photo'}</span>
          </button>
          <button 
            type="button"
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex justify-center items-center space-x-2 transition-all rounded-2xl ${activeTab === 'upload' ? 'text-forest bg-white shadow-sm' : 'text-gray-400 hover:text-forest'}`}
            onClick={() => { setActiveTab('upload'); stopCamera(); }}
          >
            <Upload className="w-4 h-4" /><span>{language === 'ml' ? 'ഗാലറി' : 'Gallery'}</span>
          </button>
        </div>
      )}

      <div className="p-6 flex flex-col items-center justify-center min-h-[350px]">
        {preview ? (
          <div className="relative w-full rounded-[2rem] overflow-hidden aspect-video bg-black flex items-center justify-center fade-in border-4 border-white shadow-2xl">
            <img src={preview} alt="Leaf preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button type="button" onClick={retake} className="p-3 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-lime text-forest font-black rounded-xl flex items-center shadow-lg space-x-2">
              <CheckCircle2 className="w-5 h-5"/>
              <span className="text-[10px] uppercase">{language === 'ml' ? 'ചിത്രം റെഡി' : 'Image Ready'}</span>
            </div>
          </div>
        ) : activeTab === 'camera' ? (
          <div className="relative w-full rounded-[2rem] overflow-hidden aspect-video bg-gray-900 border-4 border-dashed border-gray-100 group hover:border-forest/20 transition-colors">
            <video ref={videoRef} autoPlay playsInline onClick={handleCapture} className="w-full h-full object-cover cursor-pointer" />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button 
                type="button" 
                onClick={handleCapture} 
                className="w-20 h-20 rounded-full bg-white border-8 border-forest/5 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group-hover:border-forest/10"
              >
                <div className="w-12 h-12 rounded-full border-4 border-forest/1 bg-forest shadow-inner" />
              </button>
            </div>
          </div>
        ) : activeTab === 'native' ? (
          <label className="w-full cursor-pointer group flex flex-col items-center justify-center p-10 bg-forest rounded-[2rem] border-8 border-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all outline-none">
             <div className="w-24 h-24 bg-lime rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-transform">
                <Camera className="w-12 h-12 text-forest" />
             </div>
             <h3 className="text-white text-2xl font-black font-malayalam leading-tight mb-2">{language === 'ml' ? 'ക്യാമറ തുറക്കുക' : 'Open Native Camera'}</h3>
             <p className="text-white/60 text-sm font-bold uppercase tracking-widest">{t('take_photo')}</p>
             <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
          </label>
        ) : (
          <label className="w-full cursor-pointer h-full min-h-[250px] flex flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-gray-100 bg-gray-50/50 hover:bg-lime/10 hover:border-forest/20 transition-all">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-gray-100">
               <Upload className="w-8 h-8 text-forest" />
            </div>
            <span className="text-forest font-black font-malayalam text-lg">{language === 'ml' ? 'ഗാലറിയിൽ നിന്ന് ചേർക്കുക' : 'Select From Gallery'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        )}
      </div>
    </div>
  );
}
