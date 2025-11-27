/**
 * Unified drawer navigation utilities
 */

import { NavigationState } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList } from '@/navigation/types';
import { ScreenType, NavigationTarget } from '@/types/navigation';

/**
 * Get the active screen from navigation state
 */
export const getActiveScreenFromState = (
  state: NavigationState | undefined
): ScreenType | null => {
  if (!state) return null;

  // Check Stack screens first (like Quotes)
  const stackRoute = state.routes.find((r: any) => r.name === 'Quotes');
  if (stackRoute) {
    return 'Quotes';
  }

  // Check MainTabs
  const mainTabsRoute = state.routes.find((r: any) => r.name === 'MainTabs');
  if (mainTabsRoute?.state && 'index' in mainTabsRoute.state) {
    const activeRoute = mainTabsRoute.state.routes[mainTabsRoute.state.index as number];
    return activeRoute?.name as keyof MainTabParamList;
  }

  return null;
};

/**
 * Get navigation target for a screen
 */
export const getNavigationTarget = (screen: ScreenType): NavigationTarget => {
  if (screen === 'Quotes') {
    return { type: 'stack', screen: 'Quotes' };
  }
  return { type: 'tab', screen: screen as keyof MainTabParamList };
};

