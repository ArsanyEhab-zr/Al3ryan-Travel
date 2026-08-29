import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.js';
import en from './locales/en.js';
import fr from './locales/fr.js';
import it from './locales/it.js';
import de from './locales/de.js';
import ru from './locales/ru.js';

const defaultLang = localStorage.getItem('al3ryan_lang') || 'ar';

// Initialize direction and lang attributes on page load
document.documentElement.dir = defaultLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = defaultLang;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
      fr: { translation: fr },
      it: { translation: it },
      de: { translation: de },
      ru: { translation: ru }
    },
    lng: defaultLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
