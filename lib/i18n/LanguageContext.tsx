'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { dictionaries, Lang } from './dictionaries';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('bg');

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getPath(dictionaries[lang], key) ?? getPath(dictionaries.bg, key);
      let result = typeof value === 'string' ? value : key;
      if (vars) {
        for (const [varKey, varValue] of Object.entries(vars)) {
          result = result.replaceAll(`{${varKey}}`, String(varValue));
        }
      }
      return result;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
