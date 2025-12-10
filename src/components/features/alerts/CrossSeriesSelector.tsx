/**
 * CrossSeriesSelector - Componente selector para series cruzadas (brechas)
 * Aparece dinámicamente cuando la serie seleccionada tiene crossSeriesOptions
 */

import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { CrossSeriesOption } from '@/services/alerts-api';

interface CrossSeriesSelectorProps {
  label: string;
  value: string | null; // relatedSeriesCode + operation (formato: "seriesCode:operation")
  crossOptions: CrossSeriesOption[];
  onSelect: (relatedSeriesCode: string, operation: string) => void;
  disabled?: boolean;
  containerStyle?: any;
}

export const CrossSeriesSelector: React.FC<CrossSeriesSelectorProps> = ({
  label,
  value,
  crossOptions,
  onSelect,
  disabled = false,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = value
    ? crossOptions.find(
        (opt) => `${opt.relatedSeriesCode}:${opt.operation}` === value
      )
    : null;

  const handleSelect = (option: CrossSeriesOption) => {
    onSelect(option.relatedSeriesCode, option.operation);
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    if (disabled || crossOptions.length === 0) return;
    setModalVisible(true);
  };

  const getOperationLabel = (operation: string): string => {
    switch (operation) {
      case 'SPREAD_PCT':
        return 'Brecha %';
      case 'SPREAD_ABS':
        return 'Brecha Absoluta';
      case 'RATIO':
        return 'Ratio';
      default:
        return operation;
    }
  };

  if (crossOptions.length === 0) {
    return null;
  }

  return (
    <>
      <View style={containerStyle}>
        {label && (
          <Text
            variant="sm"
            weight="medium"
            style={{
              marginBottom: theme.spacing.xs,
              color: theme.colors.textPrimary,
            }}>
            {label}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleOpenModal}
          disabled={disabled}
          activeOpacity={0.7}>
          <View
            style={[
              styles.selectorButton,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                opacity: disabled ? 0.5 : 1,
              },
            ]}>
            <Text
              variant="base"
              color={selectedOption ? 'textPrimary' : 'textSecondary'}
              numberOfLines={1}
              style={{ flex: 1 }}>
              {selectedOption
                ? `${selectedOption.relatedDisplayName} (${getOperationLabel(selectedOption.operation)})`
                : 'Seleccionar serie cruzada'}
            </Text>
            <Text variant="base" color="textSecondary">▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}
          onPress={() => setModalVisible(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <View
                style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <Text variant="lg" weight="bold">
                  Seleccionar Serie Cruzada
                </Text>
                <Button
                  title="Cerrar"
                  variant="ghost"
                  size="sm"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              {crossOptions.length > 0 && (
                <FlatList
                  data={crossOptions}
                  keyExtractor={(item) => `${item.relatedSeriesCode}:${item.operation}`}
                  renderItem={({ item }) => {
                    const isSelected =
                      value === `${item.relatedSeriesCode}:${item.operation}`;
                    return (
                      <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        style={[
                          styles.listItem,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.primary + '20'
                              : 'transparent',
                            borderBottomColor: theme.colors.border,
                          },
                        ]}>
                        <View style={{ flex: 1 }}>
                          <Text
                            variant="base"
                            weight={isSelected ? 'semibold' : undefined}
                            color={isSelected ? 'primary' : 'textPrimary'}>
                            {item.relatedDisplayName}
                          </Text>
                          <Text variant="sm" color="textSecondary" style={{ marginTop: 4 }}>
                            {getOperationLabel(item.operation)}
                            {item.description && ` • ${item.description}`}
                          </Text>
                        </View>
                        {isSelected && <Text variant="sm" color="primary">✓</Text>}
                      </TouchableOpacity>
                    );
                  }}
                  style={styles.list}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={true}
                />
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  list: {
    flex: 1,
    maxHeight: 500,
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    minHeight: 56,
  },
});

