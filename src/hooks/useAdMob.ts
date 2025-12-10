/**
 * useAdMob - Hook for AdMob initialization
 * 
 * Handles AdMob initialization on app startup.
 * Returns loading state and error if any.
 * 
 * To remove: Delete this file and remove the hook call from App.tsx
 */

import { useEffect, useState } from 'react';
import { initializeAdMob, isAdMobAvailable } from '@/services/ads';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only initialize if AdMob is available
    if (!isAdMobAvailable()) {
      console.log('[useAdMob] AdMob not available, skipping initialization');
      return;
    }

    initializeAdMob()
      .then(() => {
        setIsInitialized(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsInitialized(false);
      });
  }, []);

  return {
    isInitialized,
    error,
    isAvailable: isAdMobAvailable(),
  };
};

