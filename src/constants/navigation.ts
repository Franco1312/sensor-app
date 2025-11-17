/**
 * Navigation constants - Configuration for navigation behavior
 */

import { MainTabParamList } from '@/navigation/types';

/**
 * Screens that have their own internal swipe navigation
 * These screens should disable the main tab swipe
 */
export const SCREENS_WITH_INTERNAL_SWIPE: Array<keyof MainTabParamList> = ['Quotes'];

/**
 * Navigation timing constants
 */
export const NAVIGATION_TIMING = {
  SYNC_DELAY: 50, // ms - Delay for syncing PagerView with navigation
  NAVIGATION_RESET: 200, // ms - Time to reset navigation flag
} as const;

