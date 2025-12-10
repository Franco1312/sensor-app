/**
 * AdMob Configuration
 * 
 * Production IDs configured:
 * - Android Banner: ca-app-pub-7882409545346008/3197151153
 * - iOS Banner: ca-app-pub-7882409545346008/7985717056
 */

import { Platform } from 'react-native';

export const AD_UNIT_IDS = {
  // Production Ad Unit IDs
  banner: {
    android: 'ca-app-pub-7882409545346008/3197151153',
    ios: 'ca-app-pub-7882409545346008/7985717056',
  },
  // Add more ad unit types as needed
  // interstitial: {
  //   android: 'YOUR_ANDROID_INTERSTITIAL_ID',
  //   ios: 'YOUR_IOS_INTERSTITIAL_ID',
  // },
  // rewarded: {
  //   android: 'YOUR_ANDROID_REWARDED_ID',
  //   ios: 'YOUR_IOS_REWARDED_ID',
  // },
} as const;

/**
 * Get the appropriate ad unit ID for the current platform
 */
export const getBannerAdUnitId = (): string => {
  if (Platform.OS === 'ios') {
    return AD_UNIT_IDS.banner.ios;
  }
  return AD_UNIT_IDS.banner.android;
};

