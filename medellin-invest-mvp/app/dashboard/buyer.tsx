import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme';
import { Inquiry, Property } from '@/types';
import { propertiesService, userService } from '@/services/mock';
import { useFavoritesStore } from '@/store/favorites';
import { useAuthStore } from '@/store/auth';
import { calculateROI, defaultInputsFromProperty } from '@/utils/roi';
import { formatPercent, formatRelativeDate, formatUSD } from '@/utils/format';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { MetricBadge } from '@/components/ui/MetricBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROIComparisonCard } from '@/components/roi/ROIComparisonCard';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function BuyerDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const [saved, setSaved] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([propertiesService.list(), userService.inquiries()]).then(
      ([all, inq]) => {
        setSaved(all.filter((p) => favoriteIds.includes(p.id)));
        setInquiries(inq);
        setLoading(false);
      }
    );
  }, [favoriteIds]);

  const totalSavedValue = saved.reduce((s, p) => s + p.price, 0);
  const avgRoi = saved.length
    ? saved.reduce((s, p) => s + p.estimatedROI, 0) / saved.length
    : 0;

  const featured = saved[0];
  const featuredBreakdown = featured
    ? calculateROI(defaultInputsFromProperty(featured))
    : null;

  return (
    <Screen scroll>
      <DashboardHeader title="Buyer Dashboard" subtitle="Your investment activity" />

      {/* Profile summary */}
      <Card padded>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar uri={user.avatarUrl} name={user.name} size={48} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text variant="bodyStrong">{user.name}</Text>
            <Text variant="caption">Member since {formatRelativeDate(user.joinedAt)}</Text>
          </View>
          <MetricBadge label="Buyer" tone="info" />
        </View>
      </Card>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* KPI grid */}
          <View style={styles.grid}>
            <KPI icon="heart" label="Saved" value={String(saved.length)} />
            <KPI icon="cash-outline" label="Portfolio value" value={formatUSD(totalSavedValue, true)} />
            <KPI
              icon="trending-up"
              label="Avg ROI"
              value={formatPercent(avgRoi)}
              tone="success"
            />
            <KPI icon="chatbubbles-outline" label="Inquiries" value={String(inquiries.length)} />
          </View>

          {/* Featured ROI snapshot */}
          {featured && featuredBreakdown && (
            <View style={{ marginTop: spacing.xl }}>
              <SectionHeader
                title="ROI snapshot"
                subtitle={featured.title}
                actionLabel="Open"
                onActionPress={() => router.push(`/property/${featured.id}`)}
              />
              <ROIComparisonCard breakdown={featuredBreakdown} />
            </View>
          )}

          {/* Saved properties summary */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader
              title="Saved properties"
              actionLabel="See all"
              onActionPress={() => router.push('/(tabs)/favorites')}
            />
            {saved.length === 0 ? (
              <EmptyState
                icon="heart-outline"
                title="No saved properties"
                description="Save a listing to compare ROI side-by-side."
                actionLabel="Browse listings"
                onActionPress={() => router.push('/(tabs)/explore')}
              />
            ) : (
              <View style={{ gap: spacing.md }}>
                {saved.slice(0, 3).map((p) => (
                  <SavedRow
                    key={p.id}
                    property={p}
                    onPress={() => router.push(`/property/${p.id}`)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Inquiries */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title="Inquiry history" />
            {inquiries.length === 0 ? (
              <EmptyState
                icon="chatbubble-outline"
                title="No inquiries yet"
                description="Contact a broker from any listing to start a conversation."
              />
            ) : (
              <View style={{ gap: spacing.md }}>
                {inquiries.map((i) => (
                  <InquiryRow
                    key={i.id}
                    inquiry={i}
                    onPress={() => router.push(`/property/${i.propertyId}`)}
                  />
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </Screen>
  );
}

function KPI({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tone?: 'success';
}) {
  return (
    <View style={styles.kpi}>
      <View
        style={[
          styles.kpiIcon,
          tone === 'success' && { backgroundColor: colors.successSoft },
        ]}
      >
        <Ionicons name={icon} size={16} color={tone === 'success' ? colors.success : colors.text} />
      </View>
      <Text variant="caption" style={{ marginTop: spacing.sm }}>
        {label}
      </Text>
      <Text
        variant="metric"
        style={{ marginTop: 2, color: tone === 'success' ? colors.success : colors.text }}
      >
        {value}
      </Text>
    </View>
  );
}

function SavedRow({ property, onPress }: { property: Property; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.savedRow}>
      <Image source={{ uri: property.coverImage }} style={styles.savedImage} contentFit="cover" />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {property.title}
        </Text>
        <Text variant="caption">{property.neighborhood}</Text>
        <View style={styles.savedFooter}>
          <Text variant="bodyStrong">{formatUSD(property.price)}</Text>
          <View style={styles.roiPill}>
            <Ionicons name="trending-up" size={12} color={colors.success} />
            <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
              {formatPercent(property.estimatedROI)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function InquiryRow({ inquiry, onPress }: { inquiry: Inquiry; onPress: () => void }) {
  const tone =
    inquiry.status === 'replied' ? 'success' : inquiry.status === 'pending' ? 'warning' : 'neutral';
  const label =
    inquiry.status === 'replied' ? 'Replied' : inquiry.status === 'pending' ? 'Pending' : 'Closed';
  return (
    <Pressable onPress={onPress} style={styles.inquiryRow}>
      <Image source={{ uri: inquiry.propertyImage }} style={styles.inquiryImage} contentFit="cover" />
      <View style={{ flex: 1, marginLeft: spacing.md, gap: 4 }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {inquiry.propertyTitle}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {inquiry.message}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 }}>
          <MetricBadge label={label} tone={tone as 'success' | 'warning' | 'neutral'} size="sm" />
          <Text variant="caption">{formatRelativeDate(inquiry.sentAt)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  kpi: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedImage: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  savedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  roiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  inquiryRow: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inquiryImage: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
});
