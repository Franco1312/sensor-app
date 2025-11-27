/**
 * useTranslation Hook
 * Hook to access translations in components
 */

import { useMemo } from 'react';
import { i18n } from '../config';

export const useTranslation = () => {
  const t = useMemo(
    () => (key: string, params?: Record<string, string | number>) => {
      return i18n.t(key, params);
    },
    []
  );

  const locale = useMemo(() => i18n.locale, []);

  const changeLocale = (newLocale: string) => {
    i18n.locale = newLocale;
  };

  return {
    t,
    locale,
    changeLocale,
  };
};

