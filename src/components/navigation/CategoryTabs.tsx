/**
 * CategoryTabs - Reusable component for category tab navigation
 * Displays horizontal tabs with active state indicator
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';

interface CategoryTab<T extends string> {
  label: string;
  value: T;
}

interface CategoryTabsProps<T extends string> {
  tabs: readonly CategoryTab<T>[];
  activeTab: T;
  onTabPress: (tab: T) => void;
}

export const CategoryTabs = <T extends string>({
  tabs,
  activeTab,
  onTabPress,
}: CategoryTabsProps<T>) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors.divider,
          backgroundColor: theme.colors.background,
        },
      ]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onTabPress(tab.value)}
            activeOpacity={0.7}
            style={[
              styles.tab,
              {
                borderBottomColor: isActive ? theme.colors.primary : 'transparent',
                borderBottomWidth: isActive ? 2 : 0,
              },
            ]}>
            <Text
              variant="sm"
              weight={isActive ? 'semibold' : 'medium'}
              color={isActive ? 'textPrimary' : 'textSecondary'}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
  },
});

