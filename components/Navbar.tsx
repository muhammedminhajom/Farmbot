'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Microscope, ClipboardList, Leaf, Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();

  const navItems = [
    { name: t('home'), path: '/', icon: Home, label: t('home') },
    { name: t('diagnose'), path: '/diagnose', icon: Microscope, label: t('diagnose') },
    { name: t('history'), path: '/history', icon: ClipboardList, label: t('history') },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-forest items-center px-6 hidden md:flex z-40 border-b border-forest/20 shadow-md">
        <Link href="/" className="flex items-center space-x-2 mr-10 group">
          <div className="p-1.5 bg-lime rounded-lg group-hover:rotate-12 transition-transform">
            <Leaf className="w-6 h-6 text-forest" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">FarmBot<span className="text-lime">.</span></span>
        </Link>
        <div className="flex space-x-6 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={clsx(
                "text-sm font-bold transition-colors",
                pathname === item.path ? "text-lime" : "text-white/70 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Top side language change */}
        <div className="flex items-center bg-forest-dark bg-opacity-50 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setLanguage('ml')}
            className={clsx(
              "px-3 py-1 text-[10px] font-black rounded-lg transition-all",
              language === 'ml' ? "bg-lime text-forest shadow-sm" : "text-white/50 hover:text-white"
            )}
          >
            മലയാളം
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={clsx(
              "px-3 py-1 text-[10px] font-black rounded-lg transition-all",
              language === 'en' ? "bg-lime text-forest shadow-sm" : "text-white/50 hover:text-white"
            )}
          >
            English
          </button>
        </div>
      </nav>

      {/* Mobile Top Header (Adding language switcher here too for 'top right') */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-forest flex md:hidden items-center justify-between px-6 z-40">
        <div className="flex items-center space-x-2">
           <Leaf className="w-5 h-5 text-lime" />
           <span className="text-xl font-black text-white">FarmBot</span>
        </div>
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/5">
          <button onClick={() => setLanguage('ml')} className={clsx("px-2 py-1 text-[8px] font-black rounded-md", language === 'ml' ? "bg-lime text-forest" : "text-white/50")}>ML</button>
          <button onClick={() => setLanguage('en')} className={clsx("px-2 py-1 text-[8px] font-black rounded-md", language === 'en' ? "bg-lime text-forest" : "text-white/50")}>EN</button>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex md:hidden z-40 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pt-2 pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className="flex-1 flex flex-col items-center justify-center space-y-1"
          >
            <div className={clsx(
              "p-2 rounded-2xl transition-all duration-300",
              pathname === item.path ? "bg-forest text-white scale-110 shadow-lg" : "text-gray-400"
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className={clsx(
              "text-[10px] font-black tracking-tight",
              pathname === item.path ? "text-forest" : "text-gray-400"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
