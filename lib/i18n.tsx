'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ml';

interface i18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    diagnose: 'Diagnose',
    history: 'History',
    start: 'Get Started',
    analyze: 'Analyze Now',
    take_photo: 'Take Photo',
    voice_note: 'Disease Description',
    details: 'More Details',
    kerala_farmers: 'Kerala Farmers First',
    hero_title_1: 'AI Support For',
    hero_title_2: 'Your Farming',
    hero_desc: 'AI-powered crop disease diagnosis for Kerala farmers. Completely in Malayalam.',
    feature_1_title: 'Leaf Photo',
    feature_1_desc: 'Upload leaf photo, get instant AI diagnosis',
    feature_2_title: 'Voice Note',
    feature_2_desc: 'Describe in Malayalam, we understand',
    feature_3_title: 'Weather Plan',
    feature_3_desc: 'Treatment based on YOUR local weather',
    helpline: 'Krishi Bhavan Helpline',
    privacy: 'Privacy Policy',
    footer_tag: 'Made with ❤️ for Kerala Farmers',
    
    // Diagnose Page
    start_diagnosis: 'Start Your Diagnosis',
    step_1_title: 'Leaf Photo',
    step_2_title: 'Disease Symptoms',
    step_3_title: 'Location & Phone',
    voice_desc: 'You can speak or type the symptoms.',
    your_location: 'Your Location',
    weather_info: 'For accurate weather data',
    phone_placeholder: '+91 Phone Number',
    phone_privacy: 'Your phone number is used only to save your diagnosis history and show it to you later. It is kept private.',
    analyze_btn: 'Start Analysis Now',
    error_photo: 'Please take a leaf photo',
    error_phone: 'Please enter a valid phone number (+91 XXXXXXXXXX)',
    
    // Components
    press_to_record: 'Press to give voice message',
    analyzing_voice: 'Analyzing voice...',
    wait_moment: 'Please wait a moment',
    low_conf: 'Low Confidence',
    high_conf: 'High Confidence',
    re_record: 'Re-record',
    type_symptoms: 'Type symptoms here...',
    info_received: 'Information Received',
    info_success: 'Symptom info added. Press analyze button.',
    info_guide: 'Writing symptoms helps get better results.',
    fetch_location: 'Finding location...',
    location_not_found: 'Location unavailable (Retry)',
    add_location: 'Add Location',
    click_camera: 'Click to open camera',
    retake: 'Retake Photo',
    native_camera: 'Take Photo',
    live_camera: 'Live Camera',
    search_location: 'Type Village/District',
    manual_location: 'Location Added',
    
    // History Page
    view_history: 'View History',
    history_desc: 'Enter your phone number to see past results',
    no_history: 'No records found for this phone number.',
    loading_history: 'Fetching history...',
    
    // Result
    diagnosis_result: 'Diagnosis Result',
    crop: 'Crop',
    disease: 'Disease',
    confidence: 'Confidence',
    severity: 'Severity',
    treatment_plan: 'Treatment Plan',
    weather_alert: 'Weather Warning',
    save_success: 'History Saved Successfully',
  },
  ml: {
    home: 'ഹോം',
    diagnose: 'പരിശോധന',
    history: 'ചരിത്രം',
    start: 'ആരംഭിക്കുക',
    analyze: 'വിശകലനം',
    take_photo: 'ഫോട്ടോ എടുക്കുക',
    voice_note: 'രോഗവിവരങ്ങൾ',
    details: 'കൂടുതൽ വിവരങ്ങൾ',
    kerala_farmers: 'കേരളത്തിലെ കർഷകർക്ക് മുൻഗണന',
    hero_title_1: 'നിങ്ങളുടെ കൃഷിക്ക്',
    hero_title_2: 'AI സഹായം',
    hero_desc: 'കൃഷിയിലെ രോഗങ്ങൾ കണ്ടെത്താൻ മലയാളത്തിൽ തയ്യാറാക്കിയ AI സഹായം.',
    feature_1_title: 'ഇല ഫോട്ടോ',
    feature_1_desc: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക, ഉടൻ മറുപടി നേടുക',
    feature_2_title: 'ശബ്ദ കുറിപ്പ്',
    feature_2_desc: 'രോഗലക്ഷണങ്ങൾ മലയാളത്തിൽ പറയൂ',
    feature_3_title: 'കാലാവസ്ഥ പ്ലാൻ',
    feature_3_desc: 'നിങ്ങളുടെ നാട്ടിലെ കാലാവസ്ഥയ്ക്കനുസരിച്ച്',
    helpline: 'കൃഷി ഭവൻ ഹെൽപ്പ് ലൈൻ',
    privacy: 'പ്രൈവസി പോളിസി',
    footer_tag: 'കേരളത്തിലെ കർഷകർക്കായി തദ്ദേശീയമായി നിർമ്മിച്ചത് ❤️',

    // Diagnose Page
    start_diagnosis: 'പരിശോധന ആരംഭിക്കാം',
    step_1_title: 'ഇലയുടെ ഫോട്ടോ',
    step_2_title: 'രോഗവിവരങ്ങൾ',
    step_3_title: 'സ്ഥലവും നമ്പറും',
    voice_desc: 'രോഗത്തിന്റെ ലക്ഷണങ്ങൾ പറയുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യാം.',
    your_location: 'നിങ്ങളുടെ സ്ഥലം',
    weather_info: 'കൃത്യമായ കാലാവസ്ഥാ വിവരങ്ങൾക്ക്',
    phone_placeholder: '+91 ഫോൺ നമ്പർ',
    phone_privacy: 'ചരിത്രം സൂക്ഷിക്കാനും ഭാവിയിൽ കാണാനും ഫോൺ നമ്പർ ആവശ്യമാണ്. ഇത് മറ്റാർക്കും നൽകില്ല.',
    analyze_btn: 'വിശകലനം ആരംഭിക്കുക',
    error_photo: 'ഇലയുടെ ഫോട്ടോ എടുക്കുക',
    error_phone: 'ശരിയായ ഫോൺ നമ്പർ നൽകൂ (+91 XXXXXXXXXX)',

    // Components
    press_to_record: 'ശബ്ദ സന്ദേശം നൽകാൻ അമർത്തുക',
    analyzing_voice: 'ശബ്ദം വിശകലനം ചെയ്യുന്നു...',
    wait_moment: 'കുറച്ചു സമയം കാത്തിരിക്കൂ',
    low_conf: '⚠️ കുറഞ്ഞ ഉറപ്പ്',
    high_conf: '✅ ഉറപ്പുള്ളത്',
    re_record: 'വീണ്ടും റെക്കോർഡ് ചെയ്യുക',
    type_symptoms: 'രോഗലക്ഷണങ്ങൾ ഇവിടെ എഴുതുക...',
    info_received: 'ലഭിച്ച വിവരങ്ങൾ',
    info_success: 'വിവരങ്ങൾ ചേർത്തു. വിശകലനം ബട്ടൺ അമർത്തുക.',
    info_guide: 'ഇലയുടെ ലക്ഷണങ്ങൾ എഴുതിയാൽ കൃത്യമായ ഫലം ലഭിക്കും.',
    fetch_location: 'ലൊക്കേഷൻ കണ്ടെത്തുന്നു...',
    location_not_found: 'ലൊക്കേഷൻ ലഭ്യമല്ല (ശ്രമിക്കുക)',
    add_location: 'ലൊക്കേഷൻ ചേർക്കുക',
    click_camera: 'ക്യാമറ തുറക്കാൻ അമർത്തുക',
    retake: 'വീണ്ടും ഫോട്ടോ എടുക്കുക',
    native_camera: 'ഫോട്ടോ എടുക്കുക',
    live_camera: 'ക്യാമറ',
    search_location: 'സ്ഥലം എഴുതുക (ഉദാ: പാലക്കാട്)',
    manual_location: 'സ്ഥലം ചേർത്തു',

    // History Page
    view_history: 'ചരിത്രം കാണുക',
    history_desc: 'പഴയ പരിശോധനാ ഫലങ്ങൾ കാണാൻ ഫോൺ നമ്പർ നൽകുക',
    no_history: 'ഈ നമ്പറിൽ പരിശോധനാ വിവരങ്ങൾ ലഭ്യമല്ല.',
    loading_history: 'ചരിത്രം കണ്ടെത്തുന്നു...',

    // Result
    diagnosis_result: 'പരിശോധനാ ഫലം',
    crop: 'വിള',
    disease: 'രോഗം',
    confidence: 'ഉറപ്പ്',
    severity: 'കാഠിന്യം',
    treatment_plan: 'ചികിൽസാ രീതി',
    weather_alert: 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
    save_success: 'ചരിത്രം സൂക്ഷിച്ചു',
  }
};

const i18nContext = createContext<i18nContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ml');

  useEffect(() => {
    const saved = localStorage.getItem('farmbot_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ml')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmbot_lang', lang);
  };

  const t = (key: string) => {
    const res = translations[language][key] || key;
    return res;
  };

  return (
    <i18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </i18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(i18nContext);
  if (!context) throw new Error('useI18n must be used within LanguageProvider');
  return context;
}
