'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Mic, CloudLightning, ArrowRight, Leaf } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] md:min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-forest pattern-bg">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-10 -right-10 w-64 h-64 bg-lime/20 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-20 -left-10 w-80 h-80 bg-lime-dark/10 rounded-full blur-3xl"
        />

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="z-10"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-lime mb-6 border border-white/10">
            <Leaf className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">{t('kerala_farmers')} 🌿</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-[1.1] font-malayalam">
            {t('hero_title_1')} <br /><span className="text-lime">{t('hero_title_2')}</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-md mx-auto mb-10 leading-relaxed font-karla">
            {t('hero_desc')}
          </p>

          <Link href="/diagnose" className="inline-flex items-center space-x-3 bg-lime text-forest px-10 py-5 rounded-2xl text-xl font-black shadow-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all group">
            <span>{t('start')}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-white"
        >
          <div className="w-1 h-10 rounded-full bg-white/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 40] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute top-0 left-0 right-0 h-1/2 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Camera className="w-8 h-8" />} 
            title={t('feature_1_title')} 
            desc={t('feature_1_desc')}
          />
          <FeatureCard 
            icon={<Mic className="w-8 h-8" />} 
            title={t('feature_2_title')} 
            desc={t('feature_2_desc')}
          />
          <FeatureCard 
            icon={<CloudLightning className="w-8 h-8" />} 
            title={t('feature_3_title')} 
            desc={t('feature_3_desc')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-warm-white text-center">
        <p className="text-forest font-black mb-4">FarmBot.</p>
        <div className="flex justify-center space-x-6 text-sm font-bold text-gray-500 mb-8 font-malayalam">
          <Link href="#" className="hover:text-forest">{t('helpline')}</Link>
          <Link href="#" className="hover:text-forest">{t('privacy')}</Link>
        </div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
          {t('footer_tag')}
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-warm-white border border-gray-100 shadow-sm flex flex-col items-start"
    >
      <div className="mb-6 p-4 bg-lime rounded-2xl text-forest shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-forest mb-2 font-malayalam">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed font-karla">{desc}</p>
    </motion.div>
  );
}
