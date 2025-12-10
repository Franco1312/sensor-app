/**
 * AlertsScreen - Lista de alertas configuradas
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert as RNAlert, Switch } from 'react-native';
import { Screen, Header, ListItem } from '@/components/layout';
import { Text, Skeleton, EmptyState, Button, Card } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { useAlerts, useUpdateAlert, useDeleteAlert } from '@/hooks/useAlerts';
import { Alert } from '@/services/alerts-api';
import { useTranslation } from '@/i18n';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';
import { analytics } from '@/core/analytics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AlertsScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const { data: alerts = [], isLoading, refetch } = useAlerts(user?.id || null);
  const updateAlertMutation = useUpdateAlert();
  const deleteAlertMutation = useDeleteAlert();

  // Track screen view
  useScreenTracking(SCREEN_NAMES.ALERTS_LIST);

  // Track alerts screen viewed event
  useEffect(() => {
    analytics.trackAlertsScreenViewed();
  }, []);

  // Refrescar cuando la pantalla recibe foco (después de crear/editar)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleToggleActive = useCallback(
    async (alert: Alert) => {
      const newActiveState = !alert.isActive;
      
      try {
        await updateAlertMutation.mutateAsync({
          alertId: alert.id,
          request: { isActive: newActiveState },
        });
        
        // Track alert toggle (using legacy event for now)
        // TODO: Consider if we need a separate event for toggle vs create
        
        // Refrescar la lista inmediatamente después de actualizar
        await refetch();
      } catch (error) {
        RNAlert.alert(
          t('screens.alerts.error.title'),
          error instanceof Error ? error.message : t('screens.alerts.error.updateFailed')
        );
        // Refrescar incluso si hay error para asegurar estado consistente
        refetch();
      }
    },
    [updateAlertMutation, refetch, t]
  );

  const handleEdit = useCallback((alert: Alert) => {
    navigation.navigate('AlertForm', { alert, userId: user?.id || '' });
  }, [navigation, user?.id]);

  const handleDelete = useCallback(
    (alert: Alert) => {
      RNAlert.alert(
        t('screens.alerts.deleteConfirm.title'),
        t('screens.alerts.deleteConfirm.message', { name: alert.name }),
        [
          {
            text: t('components.button.cancel'),
            style: 'cancel',
          },
          {
            text: t('screens.alerts.deleteConfirm.confirm'),
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteAlertMutation.mutateAsync(alert.id);
                
                // Alert deletion tracked via screen view and user actions
              } catch (error) {
                RNAlert.alert(
                  t('screens.alerts.error.title'),
                  error instanceof Error ? error.message : t('screens.alerts.error.deleteFailed')
                );
              }
            },
          },
        ]
      );
    },
    [deleteAlertMutation, t]
  );

  const handleCreateNew = useCallback(() => {
    navigation.navigate('AlertForm', { alert: null, userId: user?.id || '' });
  }, [navigation, user?.id]);

  const getRuleDescription = useCallback((alert: Alert): string => {
    const ruleDescriptionMap: Record<Alert['ruleType'], (config: Alert['ruleConfig']) => string> = {
      VALUE_ABOVE_THRESHOLD: (config) =>
        t('screens.alerts.ruleDescriptions.valueAbove', { threshold: config.threshold }),
      VALUE_BELOW_THRESHOLD: (config) =>
        t('screens.alerts.ruleDescriptions.valueBelow', { threshold: config.threshold }),
      PERCENT_CHANGE_ABOVE_THRESHOLD: (config) =>
        t('screens.alerts.ruleDescriptions.percentChangeAbove', {
          threshold: config.threshold,
          window: config.window || '7d',
        }),
      PERCENT_CHANGE_BELOW_THRESHOLD: (config) =>
        t('screens.alerts.ruleDescriptions.percentChangeBelow', {
          threshold: config.threshold,
          window: config.window || '7d',
        }),
    };

    const descriptionFn = ruleDescriptionMap[alert.ruleType];
    return descriptionFn ? descriptionFn(alert.ruleConfig) : alert.ruleType;
  }, [t]);

  const renderAlertItem = useCallback(
    ({ item }: { item: Alert }) => {

      return (
        <Card style={{ marginBottom: theme.spacing.sm }}>
          <View style={styles.alertCardContent}>
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleContainer}>
                <Text variant="base" weight="semibold" numberOfLines={1}>
                  {item.name}
                </Text>
                {!item.isActive && (
                  <View style={[styles.inactiveBadge, { backgroundColor: theme.colors.surfaceSecondary }]}>
                    <Text variant="xs" color="textSecondary">
                      {t('screens.alerts.inactive')}
                    </Text>
                  </View>
                )}
              </View>
              <Switch
                value={item.isActive}
                onValueChange={() => handleToggleActive(item)}
                trackColor={{ 
                  false: isDarkMode ? theme.colors.neutral300 : theme.colors.border, 
                  true: theme.colors.primary 
                }}
                thumbColor={item.isActive 
                  ? theme.colors.surface 
                  : (isDarkMode ? theme.colors.neutral500 : theme.colors.surface)
                }
                ios_backgroundColor={isDarkMode ? theme.colors.neutral300 : theme.colors.border}
              />
            </View>

            <Text variant="sm" color="textSecondary" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
              {getRuleDescription(item)}
            </Text>

            <View style={styles.alertMeta}>
              <Text variant="xs" color="textSecondary">
                {t('screens.alerts.seriesCode')}: {item.seriesCode}
              </Text>
              {item.lastTriggeredAt && (
                <Text variant="xs" color="textSecondary">
                  {t('screens.alerts.lastTriggered')}: {new Date(item.lastTriggeredAt).toLocaleDateString()}
                </Text>
              )}
            </View>

            <View style={styles.alertActions}>
              <Button
                title={t('screens.alerts.edit')}
                variant="outline"
                size="sm"
                onPress={() => handleEdit(item)}
                style={{ flex: 1, marginRight: theme.spacing.xs }}
              />
              <Button
                title={t('screens.alerts.delete')}
                variant="outline"
                size="sm"
                onPress={() => handleDelete(item)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </Card>
      );
    },
    [theme, t, handleToggleActive, handleEdit, handleDelete, getRuleDescription]
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.sm }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`skeleton-${index}`} style={{ marginBottom: theme.spacing.sm }}>
              <View style={{ padding: theme.spacing.base }}>
                <Skeleton width="60%" height={16} style={{ marginBottom: theme.spacing.sm }} />
                <Skeleton width="100%" height={14} style={{ marginBottom: theme.spacing.xs }} />
                <Skeleton width="80%" height={14} />
              </View>
            </Card>
          ))}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.lg }}>
        <EmptyState
          title={t('screens.alerts.empty.title')}
          message={t('screens.alerts.empty.message')}
        />
      </View>
    );
  };

  return (
    <Screen scrollable={false}>
      <Header title={t('screens.alerts.title')} />

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.base }}>
        <View style={{ paddingVertical: theme.spacing.md }}>
          <Button
            title={t('screens.alerts.createNew')}
            variant="primary"
            onPress={handleCreateNew}
          />
        </View>

        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.xl,
          }}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  alertCardContent: {
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inactiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertMeta: {
    gap: 4,
    marginBottom: 12,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});

