import React from 'react';
import { translations } from '../i18n/translations';
import type { LangType } from '../types';

export const LangContext = React.createContext<{
  lang: LangType;
  setLang: (l: LangType) => void;
  t: typeof translations.en;
}>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export const useLang = () => React.useContext(LangContext);
