/**
 * i18n Configuration
 * Internationalization setup using i18n-js and expo-localization
 */

import { I18n } from 'i18n-js';
import es from './translations/es.json';
import en from './translations/en.json';

// Create i18n instance
export const i18n = new I18n({
  es,
  en,
});

// Set default locale
i18n.defaultLocale = 'es';

// Try to get device locale, fallback to 'es'
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Localization = require('expo-localization');
  i18n.locale = Localization.locale?.split('-')[0] || 'es';
} catch {
  // If expo-localization is not available, use default
  i18n.locale = 'es';
}

// Enable fallback to default locale if translation is missing
i18n.enableFallback = true;

// Set missing translation handler (optional, for debugging)
// @ts-ignore - i18n-js types may not match exactly
i18n.missingTranslation = (scope: string): string => {
  console.warn(`Missing translation for: ${scope}`);
  return scope;
};

export default i18n;

