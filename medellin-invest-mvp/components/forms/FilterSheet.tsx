import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { PropertyFilter, PropertyType } from '@/types';
import { NEIGHBORHOODS } from '@/constants/neighborhoods';
import { PROPERTY_TYPES } from '@/constants/propertyTypes';
import { Text } from '@/components/ui/Text';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FormInput } from './FormInput';
import { FormToggle } from './FormToggle';

type Props = {
  visible: boolean;
  initial: PropertyFilter;
  onClose: () => void;
  onApply: (filter: PropertyFilter) => void;
};

export function FilterSheet({ visible, initial, onClose, onApply }: Props) {
  const [filter, setFilter] = useState<PropertyFilter>(initial);

  const toggleNeighborhood = (name: string) => {
    setFilter((f) => {
      const list = f.neighborhoods ?? [];
      return {
        ...f,
        neighborhoods: list.includes(name)
          ? list.filter((n) => n !== name)
          : [...list, name],
      };
    });
  };
  const togglePropertyType = (t: PropertyType) => {
    setFilter((f) => {
      const list = f.propertyTypes ?? [];
      return {
        ...f,
        propertyTypes: list.includes(t)
          ? list.filter((x) => x !== t)
          : [...list, t],
      };
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text variant="h2">Filters</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: spacing['3xl'] }}>
            {/* Price */}
            <Text variant="h3" style={{ marginBottom: spacing.md }}>
              Price (USD)
            </Text>
            <View style={styles.priceRow}>
              <FormInput
                containerStyle={{ flex: 1, marginBottom: 0 }}
                label="Min"
                keyboardType="number-pad"
                value={filter.minPrice ? String(filter.minPrice) : ''}
                onChangeText={(t) =>
                  setFilter((f) => ({ ...f, minPrice: t ? Number(t) : undefined }))
                }
                placeholder="0"
              />
              <FormInput
                containerStyle={{ flex: 1, marginBottom: 0 }}
                label="Max"
                keyboardType="number-pad"
                value={filter.maxPrice ? String(filter.maxPrice) : ''}
                onChangeText={(t) =>
                  setFilter((f) => ({ ...f, maxPrice: t ? Number(t) : undefined }))
                }
                placeholder="1,000,000"
              />
            </View>

            {/* Neighborhoods */}
            <Text variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
              Neighborhood
            </Text>
            <View style={styles.chipWrap}>
              {NEIGHBORHOODS.map((n) => {
                const selected = filter.neighborhoods?.includes(n.name);
                return (
                  <Pressable
                    key={n.id}
                    onPress={() => toggleNeighborhood(n.name)}
                    style={[styles.chip, selected && styles.chipOn]}
                  >
                    <Text
                      variant="captionStrong"
                      style={{ color: selected ? colors.textInverse : colors.text }}
                    >
                      {n.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Property type */}
            <Text variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
              Property type
            </Text>
            <View style={styles.chipWrap}>
              {PROPERTY_TYPES.map((t) => {
                const selected = filter.propertyTypes?.includes(t.value);
                return (
                  <Pressable
                    key={t.value}
                    onPress={() => togglePropertyType(t.value)}
                    style={[styles.chip, selected && styles.chipOn]}
                  >
                    <Text
                      variant="captionStrong"
                      style={{ color: selected ? colors.textInverse : colors.text }}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Bedrooms / bathrooms */}
            <Text variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
              Min bedrooms / bathrooms
            </Text>
            <View style={styles.priceRow}>
              <FormInput
                containerStyle={{ flex: 1, marginBottom: 0 }}
                label="Bedrooms"
                keyboardType="number-pad"
                value={filter.minBedrooms ? String(filter.minBedrooms) : ''}
                onChangeText={(t) =>
                  setFilter((f) => ({ ...f, minBedrooms: t ? Number(t) : undefined }))
                }
                placeholder="Any"
              />
              <FormInput
                containerStyle={{ flex: 1, marginBottom: 0 }}
                label="Bathrooms"
                keyboardType="number-pad"
                value={filter.minBathrooms ? String(filter.minBathrooms) : ''}
                onChangeText={(t) =>
                  setFilter((f) => ({ ...f, minBathrooms: t ? Number(t) : undefined }))
                }
                placeholder="Any"
              />
            </View>

            {/* Min ROI */}
            <FormInput
              containerStyle={{ marginTop: spacing.lg }}
              label="Minimum ROI %"
              keyboardType="decimal-pad"
              value={filter.minROI != null ? String(filter.minROI) : ''}
              onChangeText={(t) =>
                setFilter((f) => ({ ...f, minROI: t ? Number(t) : undefined }))
              }
              placeholder="e.g. 8"
              rightAdornment="%"
            />

            {/* Toggles */}
            <FormToggle
              label="Furnished only"
              value={filter.furnished === true}
              onValueChange={(v) => setFilter((f) => ({ ...f, furnished: v ? true : undefined }))}
            />
            <FormToggle
              label="Short-term rental capable"
              value={!!filter.shortTermCapable}
              onValueChange={(v) => setFilter((f) => ({ ...f, shortTermCapable: v || undefined }))}
            />
            <FormToggle
              label="Long-term rental capable"
              value={!!filter.longTermCapable}
              onValueChange={(v) => setFilter((f) => ({ ...f, longTermCapable: v || undefined }))}
            />
            <FormToggle
              label="Owner direct only"
              value={filter.source === 'owner'}
              onValueChange={(v) => setFilter((f) => ({ ...f, source: v ? 'owner' : undefined }))}
            />
          </ScrollView>

          <View style={styles.footer}>
            <SecondaryButton
              title="Reset"
              onPress={() => setFilter({})}
              variant="outline"
              fullWidth={false}
            />
            <PrimaryButton
              title="Apply filters"
              onPress={() => {
                onApply(filter);
                onClose();
              }}
              fullWidth={false}
              style={{ flex: 1, marginLeft: spacing.md }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  priceRow: { flexDirection: 'row', gap: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  footer: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
