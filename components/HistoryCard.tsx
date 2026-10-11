'use client';
import { DiagnosisRecord } from '@/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar } from 'lucide-react';
import { formatDateMalayalam } from '@/utils/formatters';
import SeverityBadge from './SeverityBadge';

export default function HistoryCard({ record }: { record: DiagnosisRecord }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={record.imageUrl} alt={record.crop} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 truncate">{record.crop}</h3>
            <div className="scale-75 origin-top-right">
              <SeverityBadge severity={record.severity} />
            </div>
          </div>
          <p className="text-sm text-forest font-bold lowercase">{record.malayalam_disease}</p>
          <div className="flex items-center space-x-3 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {formatDateMalayalam(record.timestamp)}</span>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {record.location.village}</span>
          </div>
        </div>
        <ChevronDown className={clsx("w-5 h-5 text-gray-400 transition-transform", isExpanded ? "rotate-180" : "")} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-warm-white border-t border-gray-100"
          >
            <div className="p-4 space-y-4">
               <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <p className="text-xs font-black text-gray-400 uppercase mb-2">ചികിത്സ പദ്ധതി</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{record.treatmentPlan}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function clsx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
