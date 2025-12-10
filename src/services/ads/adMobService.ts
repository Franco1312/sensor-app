/**
 * AdMob Service - Centralized AdMob logic
 * 
 * This service conditionally loads AdMob only when available (not in Expo Go).
 * To remove AdMob completely, delete this file and remove imports from:
 * - App.tsx
 * - src/components/common/AdBanner.tsx
 * - package.json (react-native-google-mobile-ads)
 */

let mobileAds: any = null;
let BannerAd: any = null;
let BannerAdSize: any = null;

// Try to load AdMob module (will fail silently in Expo Go)
try {
  const adsModule = require('react-native-google-mobile-ads');
  mobileAds = adsModule.default;
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
} catch (error) {
  // AdMob not available (likely running in Expo Go)
  console.log('[AdMob] Module not available - running in Expo Go or module not installed');
}

/**
 * Check if AdMob is available
 */
export const isAdMobAvailable = (): boolean => {
  return !!(mobileAds && BannerAd && BannerAdSize);
};

/**
 * Initialize AdMob
 * Returns a promise that resolves when initialization is complete
 */
export const initializeAdMob = async (): Promise<void> => {
  if (!isAdMobAvailable()) {
    console.log('[AdMob] Skipping initialization - not available');
    return;
  }

  try {
    const adapterStatuses = await mobileAds().initialize();
    console.log('[AdMob] Initialized successfully:', adapterStatuses);
  } catch (error) {
    console.error('[AdMob] Initialization error:', error);
    throw error;
  }
};

/**
 * Get AdMob components (returns null if not available)
 */
export const getAdMobComponents = () => {
  if (!isAdMobAvailable()) {
    return null;
  }

  return {
    BannerAd,
    BannerAdSize,
  };
};

/**
 * Get default banner size
 */
export const getDefaultBannerSize = (): any => {
  const components = getAdMobComponents();
  return components?.BannerAdSize?.BANNER || null;
};

