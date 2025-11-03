import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Get the saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

// Dynamic translation loader
const loadTranslation = async (language: string) => {
  switch (language) {
    case 'en':
      return (await import('./locales/en.json')).default;
    case 'es':
      return (await import('./locales/es.json')).default;
    case 'de':
      return (await import('./locales/de.json')).default;
    case 'ja':
      return (await import('./locales/ja.json')).default;
    case 'zh':
      return (await import('./locales/zh.json')).default;
    case 'hi':
      return (await import('./locales/hi.json')).default;
    default:
      return (await import('./locales/en.json')).default;
  }
};

// Initialize i18n with the saved language
export const initI18n = async () => {
  const translation = await loadTranslation(savedLanguage);
  
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        [savedLanguage]: {
          translation
        }
      },
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // React already escapes values
      }
    });

  // Custom language loader - loads translations on demand
  i18n.on('languageChanged', async (lng) => {
    if (!i18n.hasResourceBundle(lng, 'translation')) {
      const translation = await loadTranslation(lng);
      i18n.addResourceBundle(lng, 'translation', translation);
    }
  });
};

// Initialize immediately
initI18n();

export default i18n;
