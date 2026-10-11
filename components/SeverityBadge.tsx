'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function SeverityBadge({ severity }: { severity: 'mild' | 'moderate' | 'severe' }) {
  const map = {
    mild: { bg: 'bg-mild text-yellow-800', label: 'സൗമ്യം' },
    moderate: { bg: 'bg-moderate text-orange-800', label: 'മിതമായത്' },
    severe: { bg: 'bg-severe text-red-800', label: 'ഗുരുതരം' },
  };

  const { bg, label } = map[severity] || map.mild;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={clsx('px-3 py-1 rounded-full text-sm font-bold shadow-sm', bg)}
    >
      {label}
    </motion.span>
  );
}
