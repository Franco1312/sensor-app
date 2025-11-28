/**
 * PlansScreen - Subscription plans screen
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import { PlanCard, PlanFeature } from '@/components/features/plans';
import { Text } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PlansScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handleFreePlanPress = useCallback(() => {
    // TODO: Handle free plan activation
    // For now, navigate to MainTabs
    navigation.replace('MainTabs');
  }, [navigation]);

  const handlePremiumPlanPress = useCallback(() => {
    // TODO: Handle premium plan activation
    // For now, navigate to MainTabs
    navigation.replace('MainTabs');
  }, [navigation]);

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
          { paddingBottom: theme.spacing.xl, paddingTop: theme.spacing.base },
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
    marginBottom: 32,
    lineHeight: 22,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    marginBottom: 0,
  },
});

