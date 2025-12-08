/**
 * SeriesSelector - Componente selector de series con modal
 */

import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from '@/design-system/components';
import { useTheme } from '@/theme/ThemeProvider';
import { SeriesMetadataItem } from '@/services/projections-consumer-api';

interface SeriesSelectorProps {
  label: string;
  value: string; // internal_series_code
  seriesList: SeriesMetadataItem[];
  onSelect: (seriesCode: string) => void;
  disabled?: boolean;
  containerStyle?: any;
  loading?: boolean;
  error?: string | null;
}

export const SeriesSelector: React.FC<SeriesSelectorProps> = ({
  label,
  value,
  seriesList,
  onSelect,
  disabled = false,
  containerStyle,
  loading = false,
  error = null,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedSeries = seriesList.find(s => s.internal_series_code === value);
  
  // Helper function to get display title (fallback to internal_series_code if title is null)
  const getDisplayTitle = (item: SeriesMetadataItem): string => {
    return item.title || item.internal_series_code
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSelect = (series: SeriesMetadataItem) => {
    onSelect(series.internal_series_code);
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    if (disabled || loading) return;
    setModalVisible(true);
  };

  const isValidItem = (item: SeriesMetadataItem | null | undefined): item is SeriesMetadataItem => {
    return !!item?.internal_series_code;
  };

  return (
    <>
      <View style={containerStyle}>
        {label && (
          <Text variant="sm" weight="medium" style={{ marginBottom: theme.spacing.xs, color: theme.colors.textPrimary }}>
            {label}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleOpenModal}
          disabled={disabled || loading}
          activeOpacity={0.7}>
          <View style={[
            styles.selectorButton,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              opacity: disabled || loading ? 0.5 : 1,
            }
          ]}>
            <Text
              variant="base"
              color={selectedSeries ? 'textPrimary' : 'textSecondary'}
              numberOfLines={1}
              style={{ flex: 1 }}>
              {loading ? 'Cargando...' : selectedSeries ? getDisplayTitle(selectedSeries) : 'Seleccionar serie'}
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
          <Pressable onPress={(e) => e.stopPropagation()} style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <Text variant="lg" weight="bold">
                  Seleccionar Serie
                </Text>
                <Button
                  title="Cerrar"
                  variant="ghost"
                  size="sm"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              {loading && (
                <View style={styles.centerContent}>
                  <Text variant="base" color="textSecondary">
                    Cargando series...
                  </Text>
                </View>
              )}
              {error && (
                <View style={styles.centerContent}>
                  <Text variant="base" color="error">
                    Error: {error}
                  </Text>
                </View>
              )}
              {!loading && !error && seriesList.length === 0 && (
                <View style={styles.centerContent}>
                  <Text variant="base" color="textSecondary">
                    No hay series disponibles
                  </Text>
                </View>
              )}
              {!loading && !error && seriesList.length > 0 && (
                <FlatList
                  data={seriesList}
                  keyExtractor={(item) => item.internal_series_code}
                  renderItem={({ item }) => {
                    if (!isValidItem(item)) return null;
                    
                    const isSelected = value === item.internal_series_code;
                    return (
                      <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        style={[
                          styles.listItem,
                          {
                            backgroundColor: isSelected ? theme.colors.primary + '20' : 'transparent',
                            borderBottomColor: theme.colors.border,
                          }
                        ]}>
                        <Text
                          variant="base"
                          weight={isSelected ? 'semibold' : undefined}
                          color={isSelected ? 'primary' : 'textPrimary'}>
                          {getDisplayTitle(item)}
                        </Text>
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
  centerContent: {
    padding: 20,
    alignItems: 'center',
  },
});

