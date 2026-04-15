import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { useFavoritesStore } from '@/store/favorites';
import { MOCK_PROPERTIES } from '@/services/mock';
import { formatPercent, formatUSD } from '@/utils/format';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PropertyCard } from '@/components/property/PropertyCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const ids = useFavoritesStore((s) => s.ids);

  const items = useMemo(
    () => MOCK_PROPERTIES.filter((p) => ids.includes(p.id)),
    [ids]
  );

  const totalValue = items.reduce((sum, p) => sum + p.price, 0);
  const avgRoi = items.length
    ? items.reduce((s, p) => s + p.estimatedROI, 0) / items.length
    : 0;
  const avgNightly = items.length
    ? items.filter((p) => p.shortTermCapable).reduce((s, p) => s + p.nightlyRateEstimate, 0) /
      Math.max(1, items.filter((p) => p.shortTermCapable).length)
    : 0;

  if (items.length === 0) {
    return (
      <Screen>
        <Header count={0} />
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          description="Tap the heart on any listing to save it here for later analysis."
          actionLabel="Browse listings"
          onActionPress={() => router.push('/(tabs)/explore')}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <Header count={items.length} />
        <Card padded style={{ marginTop: spacing.lg }}>
          <Text variant="captionStrong" style={{ marginBottom: spacing.md }}>
            Saved portfolio
          </Text>
          <View style={styles.summary}>
            <Stat label="Properties" value={String(items.length)} />
            <Divider />
            <Stat label="Total value" value={formatUSD(totalValue, true)} />
            <Divider />
            <Stat label="Avg ROI" value={formatPercent(avgRoi)} tone="success" />
            {avgNightly > 0 && (
              <>
                <Divider />
                <Stat label="Avg nightly" value={formatUSD(avgNightly)} />
              </>
            )}
          </View>
        </Card>
      </View>

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function Header({ count }: { count: number }) {
  return (
    <View>
      <Text variant="h1">Saved</Text>
      <Text variant="caption">{count} saved properties</Text>
    </View>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="micro">{label}</Text>
      <Text
        variant="bodyStrong"
        style={{ marginTop: 2, color: tone === 'success' ? colors.success : colors.text }}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ width: 1, backgroundColor: colors.divider, marginHorizontal: spacing.md }} />;
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  summary: { flexDirection: 'row', alignItems: 'center' },
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['3xl'] },
});
