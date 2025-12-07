/**
 * PlansScreen - Subscription plans screen
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import { PlanCard, PlanFeature } from '@/components/features/plans';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { RootStackParamList } from '@/navigation/types';
import { upgradePlan, downgradePlan } from '@/services/auth-api';
import { useAuth } from '@/context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PlansScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleFreePlanPress = useCallback(async () => {
    if (user?.plan === 'FREE') {
    navigation.replace('MainTabs');
      return;
    }

    setLoading('FREE');
    try {
      await downgradePlan({ planCode: 'FREE' });
      await refreshUser();
      Alert.alert(
        t('components.common.success'),
        t('screens.plans.success.downgrade'),
        [
          {
            text: t('components.common.ok'),
            onPress: () => navigation.replace('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.plans.errors.downgradeFailed');
      Alert.alert(t('components.common.error'), errorMessage);
    } finally {
      setLoading(null);
    }
  }, [navigation, user, refreshUser, t]);

  const handlePremiumPlanPress = useCallback(async () => {
    if (user?.plan === 'PREMIUM') {
    navigation.replace('MainTabs');
      return;
    }

    setLoading('PREMIUM');
    try {
      await upgradePlan({ planCode: 'PREMIUM' });
      await refreshUser();
      Alert.alert(
        t('components.common.success'),
        t('screens.plans.success.upgrade'),
        [
          {
            text: t('components.common.ok'),
            onPress: () => navigation.replace('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : t('screens.plans.errors.upgradeFailed');
      Alert.alert(t('components.common.error'), errorMessage);
    } finally {
      setLoading(null);
    }
  }, [navigation, user, refreshUser, t]);

  const freePlanFeatures: PlanFeature[] = [
    { text: t('screens.plans.free.features.cotizaciones') },
    { text: t('screens.plans.free.features.ultimosValores') },
    { text: t('screens.plans.free.features.graficos') },
    { text: t('screens.plans.free.features.noticias') },
    { text: t('screens.plans.free.features.favoritos') },
    { text: t('screens.plans.free.features.alerta') },
    { text: t('screens.plans.free.features.actualizaciones') },
  ];

  const premiumPlanFeatures: PlanFeature[] = [
    { text: t('screens.plans.premium.features.alertas') },
    { text: t('screens.plans.premium.features.historial') },
    { text: t('screens.plans.premium.features.exportar') },
    { text: t('screens.plans.premium.features.actualizaciones') },
    { text: t('screens.plans.premium.features.indicadores') },
    { text: t('screens.plans.premium.features.experiencia') },
  ];

  return (
    <Screen scrollable={false}>
      <Header title={t('screens.plans.title')} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: theme.spacing.lg, paddingTop: theme.spacing.sm },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Intro Text */}
        <Text variant="base" color="textSecondary" style={styles.introText}>
          {t('screens.plans.intro')}
        </Text>

        {/* Plans Container */}
        <View style={styles.plansContainer}>
          {/* Premium Plan */}
          <PlanCard
            name={t('screens.plans.premium.name')}
            description={t('screens.plans.premium.description')}
            isPremium
            badgeLabel={t('screens.plans.premium.badge')}
            features={premiumPlanFeatures}
            buttonText={t('screens.plans.premium.button')}
            buttonSecondaryText={t('screens.plans.premium.buttonSecondary')}
            onButtonPress={handlePremiumPlanPress}
            buttonLoading={loading === 'PREMIUM'}
            buttonDisabled={loading !== null}
            style={styles.planCard}
          />

          {/* Free Plan */}
          <PlanCard
            name={t('screens.plans.free.name')}
            description={t('screens.plans.free.description')}
            badgeLabel={t('screens.plans.free.badge')}
            features={freePlanFeatures}
            buttonText={t('screens.plans.free.button')}
            onButtonPress={handleFreePlanPress}
            buttonLoading={loading === 'FREE'}
            buttonDisabled={loading !== null}
            style={styles.planCard}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
  },
  introText: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    marginBottom: 0,
  },
});

