/**
 * DrawerMenuList - Component for rendering menu items list
 */

import React from 'react';
import { View } from 'react-native';
import { DrawerMenuItem } from './DrawerMenuItem';
import { DrawerSubItem } from './DrawerSubItem';
import { ScreenType } from '@/types/navigation';

export interface DrawerMenuItemConfig {
  label: string;
  screen: ScreenType;
  icon: 'home' | 'profile' | 'indicators' | 'quotes';
  expandable?: boolean;
  subItems?: Array<{ label: string; value: string }>;
}

interface DrawerMenuListProps {
  items: DrawerMenuItemConfig[];
  activeScreen: ScreenType | null;
  expandedItems: Set<string>;
  getCurrentCategory: (screen: ScreenType) => string | null;
  onMenuItemPress: (item: DrawerMenuItemConfig) => void;
  onSubItemPress: (screen: ScreenType, categoryValue: string) => void;
}

export const DrawerMenuList: React.FC<DrawerMenuListProps> = ({
  items,
  activeScreen,
  expandedItems,
  getCurrentCategory,
  onMenuItemPress,
  onSubItemPress,
}) => {
  const isItemActive = (item: DrawerMenuItemConfig): boolean => {
    return activeScreen === item.screen;
  };

  const hasActiveSubItem = (item: DrawerMenuItemConfig): boolean => {
    if (!item.expandable || !item.subItems || activeScreen !== item.screen) {
      return false;
    }

    const currentCategory = getCurrentCategory(item.screen);
    return item.subItems.some(subItem => currentCategory === subItem.value);
  };

  const isSubItemActive = (
    item: DrawerMenuItemConfig,
    subItem: { label: string; value: string }
  ): boolean => {
    if (activeScreen !== item.screen) {
      return false;
    }

    const currentCategory = getCurrentCategory(item.screen);
    return currentCategory === subItem.value;
  };

  return (
    <View>
      {items.map((item, index) => {
        const isActive = isItemActive(item);
        const isExpanded = expandedItems.has(item.label);
        const hasSubItems = item.expandable && item.subItems && item.subItems.length > 0;
        const hasActiveSub = hasActiveSubItem(item);

        return (
          <View key={index}>
            <DrawerMenuItem
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              isExpanded={isExpanded}
              hasSubItems={hasSubItems}
              hasActiveSubItem={hasActiveSub}
              onPress={() => onMenuItemPress(item)}
            />

            {/* Sub-items */}
            {hasSubItems && isExpanded && (
              <View>
                {item.subItems!.map((subItem, subIndex) => (
                  <DrawerSubItem
                    key={subIndex}
                    label={subItem.label}
                    isActive={isSubItemActive(item, subItem)}
                    onPress={() => onSubItemPress(item.screen, subItem.value)}
                  />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

