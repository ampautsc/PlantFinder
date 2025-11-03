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

// Initialize i18n - called immediately on module load
loadTranslation(savedLanguage).then((translation) => {
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
      try {
        const translation = await loadTranslation(lng);
        i18n.addResourceBundle(lng, 'translation', translation);
      } catch (error) {
        console.error(`Failed to load translation for language ${lng}:`, error);
      }
    }
  });
}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
});

export default i18n;
