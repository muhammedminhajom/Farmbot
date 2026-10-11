'use client';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, Loader2, Search, X, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function LocationBadge({ onLocation }: { onLocation: (loc: any) => void }) {
  const { location, loading, error, requestLocation } = useGeolocation();
  const { t, language } = useI18n();
  const [isSearching, setIsSearching] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  useEffect(() => {
    if (location) onLocation(location);
  }, [location, onLocation]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLocation.trim()) {
      const loc = { lat: 10.8505, lon: 76.2711, village: manualLocation, district: 'Kerala' }; // Default Kerala center if unknown
      onLocation(loc);
      setIsSearching(false);
      // We don't update the hook's location state, but we notify the parent
      toast.success(language === 'ml' ? "സ്ഥലം ചേർത്തു" : "Location added");
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center space-x-2 px-6 py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-400 border border-gray-100 shadow-inner min-w-[150px] justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-forest" />
        <span>{t('fetch_location')}</span>
      </div>
    );
  }

  if (location && !isSearching) {
    return (
      <div 
        onClick={() => setIsSearching(true)}
        className="inline-flex items-center space-x-3 px-6 py-4 bg-lime-100 text-forest rounded-2xl text-xs font-black border border-lime-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer max-w-full"
      >
        <div className="relative flex h-4 w-4 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-30"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-forest"></span>
        </div>
        <span className="uppercase tracking-tight truncate">
           <MapPin className="w-3 h-3 inline mr-1 mb-0.5" />
           {location.village || location.district}, {language === 'ml' ? 'കേരളം' : 'Kerala'}
        </span>
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
           <Search className="w-3 h-3" />
        </div>
      </div>
    );
  }

  if (isSearching) {
    return (
      <form onSubmit={handleManualSubmit} className="flex items-center space-x-2 animate-fade-in w-full md:w-auto">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/30" />
          <input 
            autoFocus
            type="text" 
            placeholder={language === 'ml' ? 'സ്ഥലം എഴുതുക (ഉദാ: പാലക്കാട്)' : 'Type Village/District'}
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-forest/20 bg-white font-bold text-sm focus:border-forest outline-none transition-all shadow-lg"
          />
        </div>
        <button type="submit" className="p-4 bg-forest text-white rounded-2xl shadow-xl hover:bg-leaf transition-all shrink-0">
          <Check className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => setIsSearching(false)} className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all shrink-0">
          <X className="w-5 h-5" />
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={requestLocation}
        className={clsx(
          "inline-flex flex-row items-center space-x-2 px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-wider",
          "border-4 border-forest/10 text-forest bg-white hover:bg-forest hover:text-white hover:border-forest transition-all shadow-sm active:scale-95 shrink-0",
          error ? "border-red-400 text-red-600 bg-red-50/50" : ""
        )}
      >
        <MapPin className="w-5 h-5 opacity-40 shrink-0" />
        <span className="shrink-0">{error ? t('location_not_found') : t('add_location')}</span>
      </button>
      
      <button 
        type="button"
        onClick={() => setIsSearching(true)}
        className="p-5 bg-white border-4 border-forest/10 text-forest rounded-2xl hover:bg-forest hover:text-white transition-all shadow-sm active:scale-95"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}

import toast from 'react-hot-toast';
