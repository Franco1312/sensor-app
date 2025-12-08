/**
 * AlertFormModal - Modal para crear/editar alertas
 */

import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, StyleSheet, Pressable, Alert as RNAlert, Dimensions } from 'react-native';
import { Text, Button, Input, Card } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { useCreateAlert, useUpdateAlert } from '@/hooks/useAlerts';
import { Alert, RuleType, CreateAlertRequest, UpdateAlertRequest } from '@/services/alerts-api';
import { useTranslation } from '@/i18n';

interface AlertFormModalProps {
  visible: boolean;
  alert: Alert | null;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RULE_TYPES: { value: RuleType; label: string }[] = [
  { value: 'VALUE_ABOVE_THRESHOLD', label: 'Valor mayor que' },
  { value: 'VALUE_BELOW_THRESHOLD', label: 'Valor menor que' },
  { value: 'PERCENT_CHANGE_ABOVE_THRESHOLD', label: 'Cambio % mayor que' },
  { value: 'PERCENT_CHANGE_BELOW_THRESHOLD', label: 'Cambio % menor que' },
];


export const AlertFormModal: React.FC<AlertFormModalProps> = ({
  visible,
  alert,
  userId,
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const createAlertMutation = useCreateAlert();
  const updateAlertMutation = useUpdateAlert();

  const [name, setName] = useState('');
  const [seriesCode, setSeriesCode] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('VALUE_ABOVE_THRESHOLD');
  const [threshold, setThreshold] = useState('');
  const [window, setWindow] = useState('7d');
  const [isActive, setIsActive] = useState(true);

  const isEditing = !!alert;

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
    }
  }, [alert, visible]);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      RNAlert.alert(t('screens.alerts.error.title'), t('screens.alerts.error.nameRequired'));
      return;
    }
    if (!seriesCode.trim()) {
      RNAlert.alert(t('screens.alerts.error.title'), t('screens.alerts.error.seriesCodeRequired'));
      return;
    }
    if (!threshold.trim() || isNaN(Number(threshold))) {
      RNAlert.alert(t('screens.alerts.error.title'), t('screens.alerts.error.thresholdRequired'));
      return;
    }

    const ruleConfig = {
      threshold: Number(threshold),
      ...(ruleType.includes('PERCENT_CHANGE') && { window }),
    };

    try {
      if (isEditing) {
        const updateRequest: UpdateAlertRequest = {
          name: name.trim(),
          isActive,
          ruleType,
          ruleConfig,
        };
        await updateAlertMutation.mutateAsync({
          alertId: alert.id,
          request: updateRequest,
        });
      } else {
        const createRequest: CreateAlertRequest = {
          userId,
          name: name.trim(),
          seriesCode: seriesCode.trim(),
          dataSource: 'projections-consumer', // Default, will be obtained from API later
          ruleType,
          ruleConfig,
        };
        await createAlertMutation.mutateAsync(createRequest);
      }
      onSuccess();
    } catch (error) {
      RNAlert.alert(
        t('screens.alerts.error.title'),
        error instanceof Error ? error.message : t('screens.alerts.error.saveFailed')
      );
    }
  };

  const requiresWindow = ruleType.includes('PERCENT_CHANGE');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}
        onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Card 
            variant="elevated"
            padding="none"
            style={styles.modalCard}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View style={styles.modalContent}>
                <Text variant="lg" weight="bold" style={styles.title}>
                  {isEditing ? t('screens.alerts.editAlert') : t('screens.alerts.createAlert')}
                </Text>

                <Input
                  label={t('screens.alerts.form.name')}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('screens.alerts.form.namePlaceholder')}
                  containerStyle={styles.inputContainer}
                />

                <View style={styles.sectionContainer}>
                  <Text variant="sm" weight="medium" style={styles.sectionLabel}>
                    {t('screens.alerts.form.ruleType')}
                  </Text>
                  <View style={styles.optionsContainer}>
                    {RULE_TYPES.map((rule, index) => (
                      <View key={rule.value} style={styles.ruleTypeButtonWrapper}>
                        <Button
                          title={rule.label}
                          variant={ruleType === rule.value ? 'primary' : 'outline'}
                          size="sm"
                          onPress={() => setRuleType(rule.value)}
                          style={styles.ruleTypeButton}
                        />
                      </View>
                    ))}
                  </View>
                </View>

                <Input
                  label={t('screens.alerts.form.seriesCode')}
                  value={seriesCode}
                  onChangeText={setSeriesCode}
                  placeholder={t('screens.alerts.form.seriesCodePlaceholder')}
                  containerStyle={styles.inputContainer}
                  editable={!isEditing}
                />

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

                <View style={styles.modalButtonContainer}>
                  <Button
                    title={t('components.button.cancel')}
                    variant="outline"
                    onPress={onClose}
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
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: Math.min(500, SCREEN_WIDTH - 40),
    maxHeight: '85%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: '85%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  ruleTypeButtonWrapper: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 8,
  },
  ruleTypeButton: {
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  switch: {
    minWidth: 100,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
  },
});

