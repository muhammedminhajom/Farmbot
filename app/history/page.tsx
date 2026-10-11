'use client';
import { useState } from 'react';
import { DiagnosisRecord } from '@/types';
import HistoryCard from '@/components/HistoryCard';
import { Search, History, Loader2, Phone, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { t, language } = useI18n();
  const [phone, setPhone] = useState('');
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s/g, '');
    if (!/^\+91[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error(t('error_phone'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/history?phone=${encodeURIComponent(cleanPhone)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRecords(data);
      setHasSearched(true);
    } catch (e) {
      toast.error(language === 'ml' ? "വിവരങ്ങൾ ലഭ്യമല്ല" : "History not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 pb-32">
      <header className="mb-12 text-center animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-forest/5 px-4 py-2 rounded-full text-forest mb-4 border border-forest/10">
          <History className="w-4 h-4 text-lime-dark" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('history')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-forest mb-3 font-malayalam leading-tight">{t('view_history')}</h1>
        <p className="text-gray-500 font-bold font-karla max-w-sm mx-auto opacity-60 italic">{t('history_desc')}</p>
      </header>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm mb-12 slide-up transition-all hover:shadow-md">
        <form onSubmit={fetchHistory} className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-forest/10 group-focus-within:text-forest transition-colors">
              <Phone className="w-full h-full" />
            </div>
            <input 
              type="tel" 
              placeholder={t('phone_placeholder')} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/50 font-black text-xl focus:border-forest focus:ring-8 focus:ring-forest/5 focus:bg-white outline-none transition-all placeholder-forest/10"
            />
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto bg-forest text-white px-10 py-6 rounded-[2.5rem] font-black flex items-center justify-center space-x-3 shadow-2xl hover:bg-leaf transition-all active:scale-95 disabled:opacity-50 border-8 border-forest/10"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            <span className="text-lg font-malayalam">{t('view_history')}</span>
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-50 rounded-[2.5rem] border border-gray-100" />
            ))}
          </div>
        ) : hasSearched && records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-up">
            {records.map(record => (
              <HistoryCard key={record.id} record={record} />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-24 px-10 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 slide-up">
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-gray-100">
               <History className="w-12 h-12 text-gray-200" />
               <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm -translate-y-2 translate-x-2">
                 <Search className="w-4 h-4 text-gray-300" />
               </div>
            </div>
            <h3 className="text-2xl font-black text-gray-300 font-malayalam tracking-tight leading-tight">{t('no_history')}</h3>
            <p className="text-gray-300 text-sm mt-4 font-black uppercase tracking-[0.2em]">{language === 'ml' ? 'ആദ്യ പരിശോധന ആരംഭിക്കൂ' : 'Start your first diagnosis'}</p>
            <Link href="/diagnose" className="mt-8 inline-flex items-center space-x-2 bg-white text-forest px-8 py-3 rounded-2xl text-xs font-black border border-gray-100 shadow-sm hover:scale-105 transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('start_diagnosis')}</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
