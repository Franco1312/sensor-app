/**
 * InfoModal - Custom modal component following app design
 */

import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Card, AppText, AppButton } from '@/components/common';
import { useTheme } from '@/theme/ThemeProvider';
import { LABELS } from '@/constants/labels';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, title, message }) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalContent}>
              <AppText variant="lg" weight="bold" style={{ marginBottom: theme.spacing.md }}>
                {title}
              </AppText>
              <AppText variant="base" color="textSecondary" style={{ marginBottom: theme.spacing.lg, lineHeight: 22 }}>
                {message}
              </AppText>
              <View style={styles.modalButtonContainer}>
                <AppButton
                  title={LABELS.UNDERSTOOD}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

