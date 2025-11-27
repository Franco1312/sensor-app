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
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
      ]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onTabPress(tab.value)}
            style={[
              styles.tab,
              {
                borderBottomColor: isActive ? theme.colors.primary : 'transparent',
                borderBottomWidth: isActive ? 3 : 0,
              },
            ]}>
            <Text
              variant="sm"
              weight="bold"
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
    paddingTop: 16,
    paddingBottom: 13,
  },
});

