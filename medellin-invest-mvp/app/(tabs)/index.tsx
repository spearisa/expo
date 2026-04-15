import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme';
import { Property } from '@/types';
import { propertiesService } from '@/services/mock';
import { NEIGHBORHOODS } from '@/constants/neighborhoods';
import { useAuthStore } from '@/store/auth';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { FeaturedPropertyCard } from '@/components/property/FeaturedPropertyCard';
import { PropertyCard } from '@/components/property/PropertyCard';
import { NeighborhoodCard } from '@/components/property/NeighborhoodCard';
import { ListingPreviewCard } from '@/components/property/ListingPreviewCard';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [featured, setFeatured] = useState<Property[]>([]);
  const [topRoi, setTopRoi] = useState<Property[]>([]);
  const [shortTerm, setShortTerm] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      propertiesService.featured(),
      propertiesService.topROI(4),
      propertiesService.shortTermOpportunities(4),
    ]).then(([f, t, s]) => {
      if (cancelled) return;
      setFeatured(f);
      setTopRoi(t);
      setShortTerm(s);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen scroll padded={false} background="bg">
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="caption">Welcome back,</Text>
          <Text variant="h1">{user.name.split(' ')[0]} 👋</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.bell}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      {/* Search entry */}
      <Pressable
        onPress={() => router.push('/(tabs)/explore')}
        style={({ pressed }) => [styles.searchBar, pressed && { opacity: 0.9 }]}
      >
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <Text variant="body" style={{ marginLeft: spacing.sm, color: colors.textMuted, flex: 1 }}>
          Search neighborhoods, listings…
        </Text>
        <View style={styles.filterChip}>
          <Ionicons name="options-outline" size={16} color={colors.textInverse} />
        </View>
      </Pressable>

      {/* Quick stats */}
      <View style={styles.stats}>
        <Stat label="Listings" value="612" />
        <Stat label="Avg ROI" value="9.4%" tone="success" />
        <Stat label="Markets" value="5" />
      </View>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Featured carousel */}
          <View style={styles.section}>
            <View style={styles.sectionPadded}>
              <SectionHeader
                title="Featured properties"
                subtitle="Hand-picked investment opportunities"
                actionLabel="See all"
                onActionPress={() => router.push('/(tabs)/explore')}
              />
            </View>
            <FlatList
              data={featured}
              keyExtractor={(p) => p.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
              renderItem={({ item }) => <FeaturedPropertyCard property={item} />}
            />
          </View>

          {/* Neighborhoods */}
          <View style={styles.section}>
            <View style={styles.sectionPadded}>
              <SectionHeader
                title="Browse by neighborhood"
                actionLabel="Explore map"
                onActionPress={() => router.push('/(tabs)/map')}
              />
            </View>
            <FlatList
              data={NEIGHBORHOODS}
              keyExtractor={(n) => n.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
              renderItem={({ item }) => (
                <NeighborhoodCard
                  neighborhood={item}
                  onPress={() => router.push('/(tabs)/explore')}
                />
              )}
            />
          </View>

          {/* Top investment opportunities */}
          <View style={[styles.section, styles.sectionPadded]}>
            <SectionHeader
              title="Top investment opportunities"
              subtitle="Highest projected ROI"
              actionLabel="See all"
              onActionPress={() => router.push('/(tabs)/explore')}
            />
            <View style={{ gap: spacing.lg }}>
              {topRoi.slice(0, 3).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </View>
          </View>

          {/* Short-term rentals */}
          <View style={[styles.section, styles.sectionPadded]}>
            <SectionHeader
              title="Short-term rental opportunities"
              subtitle="Top nightly rate performers"
            />
            <View style={{ gap: spacing.md }}>
              {shortTerm.slice(0, 3).map((p) => (
                <ListingPreviewCard key={p.id} property={p} />
              ))}
            </View>
          </View>

          {/* CTA */}
          <View style={[styles.section, styles.sectionPadded]}>
            <Pressable
              onPress={() => router.push('/listings/create')}
              style={({ pressed }) => [styles.cta, pressed && { opacity: 0.92 }]}
            >
              <View style={{ flex: 1 }}>
                <Text variant="captionStrong" style={{ color: colors.accent }}>
                  FOR BROKERS & OWNERS
                </Text>
                <Text variant="h3" style={{ color: colors.textInverse, marginTop: 4 }}>
                  Post your property in under 5 minutes
                </Text>
                <Text variant="caption" style={{ color: colors.textInverse, opacity: 0.85, marginTop: 6 }}>
                  Reach qualified investors searching for ROI in Medellín.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={22} color={colors.textInverse} />
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <View style={styles.statBox}>
      <Text
        variant="metric"
        style={{ color: tone === 'success' ? colors.success : colors.text }}
      >
        {value}
      </Text>
      <Text variant="caption">{label}</Text>
    </View>
  );
}

const HORIZ = spacing.xl;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZ,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    marginHorizontal: HORIZ,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChip: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: HORIZ,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: { marginTop: spacing['2xl'] },
  sectionPadded: { paddingHorizontal: HORIZ },
  hList: { paddingHorizontal: HORIZ },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
