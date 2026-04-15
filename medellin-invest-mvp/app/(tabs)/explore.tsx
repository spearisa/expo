import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/theme';
import { PropertyFilter, SortOption } from '@/types';
import { SORT_LABELS } from '@/constants/amenities';
import { useProperties } from '@/hooks/useProperties';
import { Text } from '@/components/ui/Text';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PropertyCard } from '@/components/property/PropertyCard';
import { FormInput } from '@/components/forms/FormInput';
import { FilterSheet } from '@/components/forms/FilterSheet';
import { SortSheet } from '@/components/forms/SortSheet';

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PropertyFilter>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageSize, setPageSize] = useState(6);

  const { data, loading, error, refetch } = useProperties(filter, sort, search);
  const visible = useMemo(() => data.slice(0, pageSize), [data, pageSize]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const activeFilterCount =
    (filter.minPrice ? 1 : 0) +
    (filter.maxPrice ? 1 : 0) +
    (filter.neighborhoods?.length ? 1 : 0) +
    (filter.propertyTypes?.length ? 1 : 0) +
    (filter.minBedrooms ? 1 : 0) +
    (filter.minBathrooms ? 1 : 0) +
    (filter.furnished ? 1 : 0) +
    (filter.shortTermCapable ? 1 : 0) +
    (filter.longTermCapable ? 1 : 0) +
    (filter.source ? 1 : 0) +
    (filter.minROI != null ? 1 : 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="h1">Explore</Text>
        <Text variant="caption">{data.length} properties in Medellín</Text>
      </View>

      <View style={styles.controls}>
        <View style={{ flex: 1 }}>
          <FormInput
            placeholder="Search title, neighborhood…"
            value={search}
            onChangeText={setSearch}
            leftIcon="search"
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={[styles.iconBtn, activeFilterCount > 0 && styles.iconBtnActive]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? colors.textInverse : colors.text}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={{ color: colors.textInverse, fontSize: 10, fontWeight: '700' }}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <Pressable onPress={() => setSortOpen(true)} style={styles.sortRow}>
        <Ionicons name="swap-vertical" size={14} color={colors.textMuted} />
        <Text variant="caption" style={{ marginLeft: 6 }}>
          Sort by:{' '}
          <Text variant="captionStrong">{SORT_LABELS[sort]}</Text>
        </Text>
      </Pressable>

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : loading && data.length === 0 ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState
          icon="search"
          title="No properties match"
          description="Try adjusting your search or filters to see more listings."
          actionLabel="Clear filters"
          onActionPress={() => {
            setFilter({});
            setSearch('');
          }}
        />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={
            visible.length < data.length ? (
              <Pressable
                onPress={() => setPageSize((s) => s + 6)}
                style={styles.loadMore}
              >
                <Text variant="bodyStrong">Load more</Text>
                <Ionicons name="chevron-down" size={16} color={colors.text} />
              </Pressable>
            ) : (
              <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
                <Text variant="caption">You've reached the end</Text>
              </View>
            )
          }
        />
      )}

      <FilterSheet
        visible={filterOpen}
        initial={filter}
        onClose={() => setFilterOpen(false)}
        onApply={setFilter}
      />
      <SortSheet
        visible={sortOpen}
        value={sort}
        onClose={() => setSortOpen(false)}
        onChange={setSort}
      />
    </SafeAreaView>
  );
}

const HORIZ = spacing.xl;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: HORIZ,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: HORIZ,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZ,
    paddingVertical: spacing.md,
  },
  list: {
    paddingHorizontal: HORIZ,
    paddingBottom: spacing['3xl'],
  },
  loadMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
