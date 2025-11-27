/**
 * InfoModal - Custom modal component following app design
 */

import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text, Button } from '../atoms';
import { Card } from './Card';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from '@/i18n';

export interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, title, message }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
          <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalContent}>
              <Text variant="lg" weight="bold" style={{ marginBottom: theme.spacing.md }}>
                {title}
              </Text>
              <Text variant="base" color="textSecondary" style={{ marginBottom: theme.spacing.lg, lineHeight: 22 }}>
                {message}
              </Text>
              <View style={styles.modalButtonContainer}>
                <Button
                  title={t('components.button.understood')}
                  variant="primary"
                  onPress={onClose}
                />
              </View>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '85%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 0,
  },
  modalContent: {
    padding: 20,
  },
  modalButtonContainer: {
    alignItems: 'center',
  },
});

