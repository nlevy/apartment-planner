import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Currency } from '../i18n/types';

interface LocaleContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleState {
  language: Language;
  currency: Currency;
}

const STORAGE_KEY = 'apate2-locale';

const getInitialLocale = (): LocaleState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        language: parsed.language || 'he',
        currency: parsed.currency || 'ILS',
      };
    } catch (e) {
      console.error('Failed to parse saved locale:', e);
    }
  }

  return {
    language: 'he',
    currency: 'ILS',
  };
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<LocaleState>(getInitialLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locale));

    // Update HTML attributes
    document.documentElement.lang = locale.language;
    document.documentElement.dir = locale.language === 'he' ? 'rtl' : 'ltr';

    // Update page title
    const titles = {
      he: 'מתכנן קניית ומכירת דירה',
      en: 'Apartment Financial Planner',
    };
    document.title = titles[locale.language];
  }, [locale]);

  const setLanguage = (language: Language) => {
    setLocale((prev) => ({ ...prev, language }));
  };

  const setCurrency = (currency: Currency) => {
    setLocale((prev) => ({ ...prev, currency }));
  };

  const value: LocaleContextType = {
    language: locale.language,
    currency: locale.currency,
    setLanguage,
    setCurrency,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
