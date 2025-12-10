/**
 * AdBanner - Componente de banner publicitario
 * Usa Google AdMob para mostrar anuncios
 * 
 * To remove ads: Delete this component and remove from imports
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getBannerAdUnitId } from '@/constants/ads';
import {
  isAdMobAvailable,
  getAdMobComponents,
  getDefaultBannerSize,
} from '@/services/ads';
import { analytics } from '@/core/analytics';

interface AdBannerProps {
  /**
   * Tamaño del banner
   * @default BannerAdSize.BANNER
   */
  size?: any; // BannerAdSize type from react-native-google-mobile-ads
  /**
   * ID de la unidad de anuncio personalizada
   * Si no se proporciona, usa el ID por defecto
   */
  adUnitId?: string;
  /**
   * Estilo personalizado para el contenedor
   */
  style?: object;
  /**
   * Margen vertical
   * @default 'md'
   */
  marginVertical?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Placement identifier for analytics
   * @default 'unknown'
   */
  placement?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  size,
  adUnitId,
  style,
  marginVertical = 'md',
  placement = 'unknown',
}) => {
  const { theme } = useTheme();
  const [adUnitIdToUse, setAdUnitIdToUse] = useState<string>('');

  const adMobAvailable = isAdMobAvailable();
  const adMobComponents = getAdMobComponents();
  const defaultSize = getDefaultBannerSize();

  useEffect(() => {
    if (!adMobAvailable || !adMobComponents) return;

    // Usar ID personalizado si se proporciona, sino usar el ID de producción por defecto
    if (adUnitId) {
      setAdUnitIdToUse(adUnitId);
    } else {
      setAdUnitIdToUse(getBannerAdUnitId());
    }
  }, [adUnitId, adMobAvailable, adMobComponents]);

  const marginStyles = {
    none: 0,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
  };

  // Si AdMob no está disponible (Expo Go), no renderizar nada
  if (!adMobAvailable || !adMobComponents) {
    return null;
  }

  const { BannerAd } = adMobComponents;

  return (
    <View
      style={[
        styles.container,
        {
          marginVertical: marginStyles[marginVertical],
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          overflow: 'hidden',
        },
        style,
      ]}>
      <BannerAd
        unitId={adUnitIdToUse}
        size={size || defaultSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Ad loaded successfully');
          // Track ad impression
          analytics.trackAdImpression({
            placement,
            ad_format: 'banner',
            ad_unit_id: adUnitIdToUse,
          });
        }}
        onAdFailedToLoad={(error: any) => {
          console.warn('Ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

