/**
 * AlertFormScreen - Pantalla completa para crear/editar alertas
 * Refactorizado para usar configuraciones dinámicas de /alert-configs
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Alert as RNAlert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Screen } from '@/components/layout';
import { Text, Button, Input } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useCreateAlert, useUpdateAlert, useAlertConfigs } from '@/hooks/useAlerts';
import { Alert, RuleType, CreateAlertRequest, UpdateAlertRequest, AlertSeriesFrontendConfig } from '@/services/alerts-api';
import { useTranslation } from '@/i18n';
import { SeriesSelector, CrossSeriesSelector } from '@/components/features/alerts';
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';
import { analytics } from '@/core/analytics';

type AlertFormRouteProp = RouteProp<RootStackParamList, 'AlertForm'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RULE_TYPE_LABELS: Record<RuleType, string> = {
  VALUE_ABOVE_THRESHOLD: 'Valor mayor que',
  VALUE_BELOW_THRESHOLD: 'Valor menor que',
  PERCENT_CHANGE_ABOVE_THRESHOLD: 'Cambio % mayor que',
  PERCENT_CHANGE_BELOW_THRESHOLD: 'Cambio % menor que',
};

export const AlertFormScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<AlertFormRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { alert, userId } = route.params;

  const createAlertMutation = useCreateAlert();
  const updateAlertMutation = useUpdateAlert();
  const { data: alertConfigs, isLoading: configsLoading, error: configsError } = useAlertConfigs();

  // Track screen view
  useScreenTracking(SCREEN_NAMES.ALERT_FORM, {
    is_editing: isEditing ? 'true' : 'false',
  });

  const [name, setName] = useState('');
  const [seriesCode, setSeriesCode] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('VALUE_ABOVE_THRESHOLD');
  const [threshold, setThreshold] = useState('');
  const [window, setWindow] = useState('7d');
  const [isActive, setIsActive] = useState(true);
  const [crossSeriesValue, setCrossSeriesValue] = useState<string | null>(null);

  const isEditing = !!alert;

  // Obtener la serie seleccionada de las configuraciones
  const selectedSeriesConfig = useMemo(() => {
    if (!alertConfigs || !seriesCode) return null;
    return alertConfigs.find(config => config.seriesCode === seriesCode);
  }, [alertConfigs, seriesCode]);

  // Obtener ruleTypes disponibles para la serie seleccionada
  const availableRuleTypes = useMemo(() => {
    if (!selectedSeriesConfig) return [];
    return selectedSeriesConfig.supportedRuleTypes;
  }, [selectedSeriesConfig]);

  // Verificar si la serie seleccionada soporta cruces
  const hasCrossSeriesOptions = useMemo(() => {
    return selectedSeriesConfig?.crossSeriesOptions && selectedSeriesConfig.crossSeriesOptions.length > 0;
  }, [selectedSeriesConfig]);

  // Resetear ruleType si no está soportado por la serie seleccionada
  useEffect(() => {
    if (selectedSeriesConfig && !selectedSeriesConfig.supportedRuleTypes.includes(ruleType)) {
      setRuleType(selectedSeriesConfig.supportedRuleTypes[0] || 'VALUE_ABOVE_THRESHOLD');
    }
  }, [selectedSeriesConfig, ruleType]);

  // Resetear crossSeriesValue cuando cambia la serie
  useEffect(() => {
    setCrossSeriesValue(null);
  }, [seriesCode]);

  useEffect(() => {
    if (alert) {
      setName(alert.name);
      setSeriesCode(alert.seriesCode);
      setRuleType(alert.ruleType);
      setThreshold(alert.ruleConfig.threshold.toString());
      setWindow(alert.ruleConfig.window || '7d');
      setIsActive(alert.isActive);
    } else {
      // Reset form
      setName('');
      setSeriesCode('');
      setRuleType('VALUE_ABOVE_THRESHOLD');
      setThreshold('');
      setWindow('7d');
      setIsActive(true);
      setCrossSeriesValue(null);
    }
  }, [alert]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? t('screens.alerts.editAlert') : t('screens.alerts.createAlert'),
    });
  }, [isEditing, navigation, t]);

  const validateForm = (): string | null => {
    if (!name.trim()) return t('screens.alerts.error.nameRequired');
    if (!seriesCode.trim()) return t('screens.alerts.error.seriesCodeRequired');
    
    // Validar que el ruleType está soportado
    if (selectedSeriesConfig && !selectedSeriesConfig.supportedRuleTypes.includes(ruleType)) {
      return `Tipo de regla no soportado para esta serie`;
    }
    
    if (!threshold.trim() || isNaN(Number(threshold))) {
      return t('screens.alerts.error.thresholdRequired');
    }
    return null;
  };

  const buildRuleConfig = () => ({
    threshold: Number(threshold),
    ...(ruleType.includes('PERCENT_CHANGE') && { window }),
  });

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      RNAlert.alert(t('screens.alerts.error.title'), validationError);
      return;
    }

    if (!selectedSeriesConfig) {
      RNAlert.alert(t('screens.alerts.error.title'), 'Serie no encontrada en las configuraciones');
      return;
    }

    const ruleConfig = buildRuleConfig();

    try {
      if (isEditing) {
        await updateAlertMutation.mutateAsync({
          alertId: alert.id,
          request: {
            name: name.trim(),
            isActive,
            ruleType,
            ruleConfig,
          },
        });
      } else {
        await createAlertMutation.mutateAsync({
          userId,
          name: name.trim(),
          seriesCode: seriesCode.trim(),
          dataSource: selectedSeriesConfig.dataSource as any, // Usar dataSource de la configuración
          ruleType,
          ruleConfig,
        });
        
        // Track alert creation
        analytics.trackAlertCreated({
          series_code: seriesCode.trim(),
          condition_type: ruleType,
          threshold: ruleConfig.threshold,
        });
      }
      navigation.goBack();
    } catch (error) {
      RNAlert.alert(
        t('screens.alerts.error.title'),
        error instanceof Error ? error.message : t('screens.alerts.error.saveFailed')
      );
    }
  };

  const handleCrossSeriesSelect = (relatedSeriesCode: string, operation: string) => {
    setCrossSeriesValue(`${relatedSeriesCode}:${operation}`);
  };

  const requiresWindow = ruleType.includes('PERCENT_CHANGE');

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Input
            label={t('screens.alerts.form.name')}
            value={name}
            onChangeText={setName}
            placeholder={t('screens.alerts.form.namePlaceholder')}
            containerStyle={styles.inputContainer}
          />

          <SeriesSelector
            label={t('screens.alerts.form.seriesCode')}
            value={seriesCode}
            seriesList={alertConfigs || []}
            onSelect={setSeriesCode}
            disabled={isEditing}
            containerStyle={styles.inputContainer}
            loading={configsLoading}
            error={configsError?.message || null}
          />

          {selectedSeriesConfig && (
            <View style={styles.sectionContainer}>
            <Text variant="sm" weight="medium" style={styles.sectionLabel}>
              {t('screens.alerts.form.ruleType')}
            </Text>
            <View style={styles.optionsContainer}>
              {availableRuleTypes.map((rule) => (
                <View key={rule} style={styles.ruleTypeButtonWrapper}>
                  <Button
                    title={RULE_TYPE_LABELS[rule]}
                    variant={ruleType === rule ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => setRuleType(rule)}
                    style={styles.ruleTypeButton}
                  />
                </View>
              ))}
            </View>
          </View>
          )}

          {hasCrossSeriesOptions && selectedSeriesConfig && (
            <CrossSeriesSelector
              label="Serie Cruzada (Brecha)"
              value={crossSeriesValue}
              crossOptions={selectedSeriesConfig.crossSeriesOptions}
              onSelect={handleCrossSeriesSelect}
              disabled={isEditing}
              containerStyle={styles.inputContainer}
            />
          )}

          <Input
            label={t('screens.alerts.form.threshold')}
            value={threshold}
            onChangeText={setThreshold}
            placeholder={t('screens.alerts.form.thresholdPlaceholder')}
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />

          {requiresWindow && (
            <Input
              label={t('screens.alerts.form.window')}
              value={window}
              onChangeText={setWindow}
              placeholder="7d, 2w, 1m"
              containerStyle={styles.inputContainer}
            />
          )}

          {isEditing && (
            <View style={styles.switchContainer}>
              <Text variant="sm" weight="medium">
                {t('screens.alerts.form.isActive')}
              </Text>
              <View style={styles.switch}>
                <Button
                  title={isActive ? t('screens.alerts.active') : t('screens.alerts.inactive')}
                  variant={isActive ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setIsActive(!isActive)}
                />
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={t('components.button.cancel')}
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.actionButton}
            />
            <Button
              title={isEditing ? t('components.button.save') : t('screens.alerts.create')}
              variant="primary"
              onPress={handleSubmit}
              loading={createAlertMutation.isPending || updateAlertMutation.isPending}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  ruleTypeButtonWrapper: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 12,
  },
  ruleTypeButton: {
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  switch: {
    minWidth: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
  },
});
