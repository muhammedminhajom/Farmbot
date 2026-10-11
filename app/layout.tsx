import type { Metadata, Viewport } from 'next';
import { Karla, Noto_Sans_Malayalam } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/lib/i18n';

const karla = Karla({ 
  subsets: ['latin'], 
  weight: ['400', '500', '700'],
  variable: '--font-karla',
});

const notoMalayalam = Noto_Sans_Malayalam({ 
  subsets: ['malayalam'], 
  weight: ['400', '700'],
  variable: '--font-noto-malayalam'
});

export const metadata: Metadata = {
  title: 'FarmBot (ഫാംബോട്ട്)',
  description: 'AI-powered crop disease diagnosis for Kerala farmers',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FarmBot',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#1B4332',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ml" className={`${karla.variable} ${notoMalayalam.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-warm-white pb-24 md:pt-16 md:pb-0">
        <LanguageProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)] overflow-x-hidden">
            {children}
          </main>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1B4332',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '12px',
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
