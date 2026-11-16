import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { th, en, zh, TranslationDictionary } from '@coffee-shop/shared';

export type Language = 'th' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('porto_coffee_lang') as Language;
      if (saved && ['th', 'en', 'zh'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load language from localStorage', e);
    }
    return 'th'; // Default to Thai as specified
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('porto_coffee_lang', lang);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
  };

  const t = language === 'th' ? th : language === 'zh' ? zh : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
