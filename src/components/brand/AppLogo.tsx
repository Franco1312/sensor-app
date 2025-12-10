/**
 * AppLogo - Componente centralizado para el logo de la aplicación
 * 
 * Soporta light/dark mode automático y diferentes variantes de tamaño
 * para usar en splash screen, headers, y otras ubicaciones.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import LogoDark from '@/assets/logos/logo_econnexus_dark.svg';
import LogoLight from '@/assets/logos/logo_econnexus_light.svg';

export type AppLogoVariant = 'default' | 'splash' | 'compact';

export interface AppLogoProps {
  /**
   * Variante del logo que determina el tamaño por defecto
   * - 'default': Tamaño estándar para headers y pantallas comunes (80x80)
   * - 'splash': Tamaño grande para pantalla inicial (200x200)
   * - 'compact': Tamaño pequeño para íconos de barra o menús (40x40)
   */
  variant?: AppLogoVariant;
  
  /**
   * Tamaño personalizado del logo (ancho y alto)
   * Si se especifica, sobrescribe el tamaño de la variant
   */
  size?: number;
  
  /**
   * Estilo personalizado para el contenedor
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Padding horizontal del contenedor
   */
  paddingHorizontal?: number;
  
  /**
   * Padding vertical del contenedor
   */
  paddingVertical?: number;
}

/**
 * Tamaños por defecto según la variant
 */
const DEFAULT_SIZES: Record<AppLogoVariant, number> = {
  default: 80,
  splash: 280,
  compact: 40,
};

/**
 * Paddings por defecto según la variant
 */
const DEFAULT_PADDINGS: Record<AppLogoVariant, { horizontal: number; vertical: number }> = {
  default: { horizontal: 16, vertical: 16 },
  splash: { horizontal: 32, vertical: 32 },
  compact: { horizontal: 8, vertical: 8 },
};

/**
 * AppLogo Component
 * 
 * Renderiza el logo apropiado según el tema (light/dark mode)
 * y ajusta el tamaño según la variant especificada.
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  variant = 'default',
  size,
  style,
  paddingHorizontal,
  paddingVertical,
}) => {
  const { isDarkMode, theme } = useTheme();
  
  // Determinar el tamaño final
  const logoSize = size ?? DEFAULT_SIZES[variant];
  
  // Determinar los paddings
  const defaultPaddings = DEFAULT_PADDINGS[variant];
  const finalPaddingHorizontal = paddingHorizontal ?? defaultPaddings.horizontal;
  const finalPaddingVertical = paddingVertical ?? defaultPaddings.vertical;
  
  // Seleccionar el logo según el tema
  const LogoComponent = isDarkMode ? LogoDark : LogoLight;
  
  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: finalPaddingHorizontal,
          paddingVertical: finalPaddingVertical,
        },
        style,
      ]}>
      <View style={[styles.logoWrapper, { width: logoSize, height: logoSize }]}>
        <LogoComponent
          width={logoSize}
          height={logoSize}
          viewBox="0 0 1024 1024"
          preserveAspectRatio="xMidYMid meet"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    // Contenedor para el SVG que asegura el renderizado correcto
    alignItems: 'center',
    justifyContent: 'center',
  },
});

