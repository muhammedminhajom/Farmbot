'use client';
import { DiagnosisProgress } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function LoadingOverlay({ progress, label }: { progress: DiagnosisProgress; label: string }) {
  if (progress === 'idle' || progress === 'done' || progress === 'error') return null;

  const steps: DiagnosisProgress[] = ['uploading', 'analyzing', 'weather', 'generating', 'saving'];
  const currentIndex = steps.indexOf(progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/90 backdrop-blur-md">
      <div className="flex flex-col items-center px-10 text-center">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 3 }}
          className="bg-lime p-6 rounded-full mb-8 shadow-2xl"
        >
          <Leaf className="w-12 h-12 text-forest" />
        </motion.div>
        
        <h2 className="text-2xl font-black text-white mb-6 font-malayalam">{label}</h2>

        <div className="flex space-x-3 mb-4">
          {steps.map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                scale: i === currentIndex ? 1.5 : 1,
                backgroundColor: i <= currentIndex ? '#86EFAC' : '#2D6B50'
              }}
              className="w-3 h-3 rounded-full shadow-sm"
            />
          ))}
        </div>
        
        <p className="text-lime/60 text-xs font-bold uppercase tracking-[0.2em]">FarmBot AI Processing</p>
      </div>
    </div>
  );
}
