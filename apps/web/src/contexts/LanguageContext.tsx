'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LangCode } from '@/lib/i18n/translations';

interface LanguageContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextType>({ lang: 'uz', setLang: () => {} });

const VALID_LANGS: LangCode[] = ['uz', 'ru', 'en', 'ky', 'tg', 'kk', 'hy', 'az', 'tr'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('uz');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('staffflow_lang') as LangCode;
      if (saved && VALID_LANGS.includes(saved)) setLangState(saved);
    } catch {}
  }, []);

  const setLang = (newLang: LangCode) => {
    setLangState(newLang);
    try { localStorage.setItem('staffflow_lang', newLang); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
