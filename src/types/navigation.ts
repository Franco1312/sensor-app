/**
 * Navigation types and configuration
 */

import { MainTabParamList } from '@/navigation/types';

export type ScreenType = keyof MainTabParamList | 'Quotes' | 'Alerts';

export type NavigationTarget = 
  | { type: 'tab'; screen: keyof MainTabParamList }
  | { type: 'stack'; screen: 'Quotes' | 'Alerts' };

export interface CategoryConfig {
  getCurrent: () => string | null;
  setCurrent: (value: string) => void;
}

export interface DrawerItemNavigationConfig {
  screen: ScreenType;
  navigationTarget: NavigationTarget;
  categoryConfig?: CategoryConfig;
}

