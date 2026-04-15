import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing } from '@/theme';
import { Property, PropertyFilter } from '@/types';
import { propertiesService } from '@/services/mock';
import { Text } from '@/components/ui/Text';
import { ListingPreviewCard } from '@/components/property/ListingPreviewCard';
import { MapPlaceholder } from '@/components/map/MapPlaceholder';
import { FilterSheet } from '@/components/forms/FilterSheet';

export default function MapScreen() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [filter, setFilter] = useState<PropertyFilter>({});
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    propertiesService.list(filter).then((list) => {
      setProperties(list);
      setSelectedId((prev) => (list.find((p) => p.id === prev) ? prev : list[0]?.id));
    });
  }, [filter]);

  const selected = properties.find((p) => p.id === selectedId);

  return (
    <View style={styles.container}>
      <MapPlaceholder
        properties={properties}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Top controls */}
      <SafeAreaView edges={['top']} style={styles.topBar} pointerEvents="box-none">
        <View style={styles.topInner}>
          <View style={styles.countPill}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text variant="captionStrong" style={{ marginLeft: 4 }}>
              {properties.length} results
            </Text>
          </View>
          <Pressable onPress={() => setFilterOpen(true)} style={[styles.iconBtn, shadow.md]}>
            <Ionicons name="options-outline" size={18} color={colors.text} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Bottom preview */}
      {selected && (
        <View style={styles.previewWrap}>
          <ListingPreviewCard property={selected} />
        </View>
      )}

      <FilterSheet
        visible={filterOpen}
        initial={filter}
        onClose={() => setFilterOpen(false)}
        onApply={setFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewWrap: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
  },
});
