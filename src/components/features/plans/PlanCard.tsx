/**
 * PlanCard - Reusable card component for displaying subscription plans
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '@/design-system/components';
import { Text, Button, Badge } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';

export interface PlanFeature {
  text: string;
}

export interface PlanCardProps {
  /**
   * Plan name/title
   */
  name: string;
  /**
   * Plan description/subtitle
   */
  description: string;
  /**
   * Whether this is the premium/featured plan
   */
  isPremium?: boolean;
  /**
   * Badge label (e.g., "Gratuito", "Recomendado")
   */
  badgeLabel?: string;
  /**
   * List of features included in the plan
   */
  features: PlanFeature[];
  /**
   * Button text
   */
  buttonText: string;
  /**
   * Button secondary text (e.g., "Probar 7 días gratis")
   */
  buttonSecondaryText?: string;
  /**
   * Callback when button is pressed
   */
  onButtonPress?: () => void;
  /**
   * Whether the button is disabled
   */
  buttonDisabled?: boolean;
  /**
   * Whether the button is loading
   */
  buttonLoading?: boolean;
  /**
   * Custom card style
   */
  style?: ViewStyle;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  name,
  description,
  isPremium = false,
  badgeLabel,
  features,
  buttonText,
  buttonSecondaryText,
  onButtonPress,
  buttonDisabled = false,
  buttonLoading = false,
  style,
}) => {
  const { theme } = useTheme();

  const cardStyle = [
    styles.card,
    {
      borderColor: isPremium ? theme.colors.primary : theme.colors.border,
      borderWidth: isPremium ? 2 : 1,
    },
    style,
  ];

  return (
    <Card variant="outlined" padding="lg" style={cardStyle}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {badgeLabel && (
            <View style={styles.badgeContainer}>
              <Badge
                label={badgeLabel}
                variant={isPremium ? 'primary' : 'neutral'}
                size="sm"
              />
            </View>
          )}
          <Text variant="xl" weight="bold" style={styles.title}>
            {name}
          </Text>
        </View>
        <Text variant="base" color="textSecondary" style={styles.description}>
          {description}
        </Text>
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View
              style={[
                styles.featureBullet,
                {
                  backgroundColor: isPremium
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                },
              ]}
            />
            <Text variant="base" color="textSecondary" style={styles.featureText}>
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={buttonText}
          variant={isPremium ? 'primary' : 'outline'}
          size="lg"
          onPress={onButtonPress}
          disabled={buttonDisabled}
          loading={buttonLoading}
          style={styles.button}
        />
        {buttonSecondaryText && (
          <Text variant="sm" color="textSecondary" style={styles.buttonSecondaryText}>
            {buttonSecondaryText}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 500,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    marginBottom: 8,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    lineHeight: 20,
  },
  featuresContainer: {
    flex: 1,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  buttonSecondaryText: {
    marginTop: 8,
    textAlign: 'center',
  },
});

