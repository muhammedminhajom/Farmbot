'use client';

import { useState } from 'react';
import { DiagnosisProgress, DiagnosisRecord, AnalyzeRequest } from '@/types';
import toast from 'react-hot-toast';

export function useDiagnosis() {
  const [result, setResult] = useState<DiagnosisRecord | null>(null);
  const [progress, setProgress] = useState<DiagnosisProgress>('idle');
  const [error, setError] = useState<string | null>(null);

  const getProgressLabel = (p: DiagnosisProgress) => {
    switch(p) {
      case 'uploading': return "ചിത്രം അപ്ലോഡ് ചെയ്യുന്നു...";
      case 'analyzing': return "ഇല പരിശോധിക്കുന്നു...";
      case 'weather': return "കാലാവസ്ഥ ശേഖരിക്കുന്നു...";
      case 'generating': return "ചികിത്സ പദ്ധതി തയ്യാറാക്കുന്നു...";
      case 'saving': return "ഡേറ്റ സംരക്ഷിക്കുന്നു...";
      default: return "";
    }
  };

  const diagnose = async (params: AnalyzeRequest) => {
    setProgress('uploading');
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'വിശകലനം പരാജയപ്പെട്ടു');
        } else {
          // It's likely an HTML error page from the server
          throw new Error(`വിശകലനം പരാജയപ്പെട്ടു (പൊരുത്തക്കേട്: ${res.status})`);
        }
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data: DiagnosisRecord = await res.json();
        setResult(data);
        setProgress('done');
      } else {
        throw new Error("വിവരങ്ങൾ ലഭ്യമല്ല (സർവർ പിശക്)");
      }
    } catch (err: any) {
      setError(err.message || 'ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കൂ');
      setProgress('error');
      toast.error(err.message || 'ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കൂ');
    }
  };

  const reset = () => {
    setResult(null);
    setProgress('idle');
    setError(null);
  };

  return { diagnose, result, progress, progressLabel: getProgressLabel(progress), error, reset };
}
