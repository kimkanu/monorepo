import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import * as localeEn from './locales/en';
import * as localeKo from './locales/ko';

const en = { ...localeEn };
const ko = { ...localeKo };

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    detection: { order: ['path', 'navigator'] },
    resources: {
      en,
      ko,
    },
    fallbackLng: 'ko',
    ns: ['page'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
