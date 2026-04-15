import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme';
import { Property } from '@/types';
import { propertiesService, MOCK_BROKER } from '@/services/mock';
import { useAuthStore } from '@/store/auth';
import { formatRelativeDate, formatUSD } from '@/utils/format';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { MetricBadge } from '@/components/ui/MetricBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

// Mock leads/views — generated from properties for a realistic demo.
const seededLeads = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `lead-${i}`,
    name: ['Maria Vargas', 'Daniel Park', 'Lucía Romero', 'Sam Chen'][i % 4],
    propertyId: '',
    sentAt: new Date(Date.now() - (i + 1) * 36e5).toISOString(),
  }));

export default function BrokerDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the mock broker id since the seeded auth user is a buyer.
  // Until we wire real auth, this lets the demo render real broker listings.
  useEffect(() => {
    propertiesService
      .myListings(MOCK_BROKER.id === user.id ? user.id : 'b-001')
      .then((data) => {
        setListings(data);
        setLoading(false);
      });
  }, [user.id]);

  const totalViews = listings.length * 184; // mocked metric
  const activeLeads = Math.min(8, listings.length * 2);
  const totalValue = listings.reduce((s, p) => s + p.price, 0);

  return (
    <Screen scroll>
      <DashboardHeader
        title="Broker Dashboard"
        subtitle="Track your listings & leads"
        rightAction={{
          label: 'New listing',
          icon: 'add',
          onPress: () => router.push('/listings/create'),
        }}
      />

      {/* Profile summary */}
      <Card padded>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar uri={user.avatarUrl} name={user.name} size={48} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text variant="bodyStrong">{user.name}</Text>
            <Text variant="caption">
              {user.agency ?? 'Independent'} · Member since {formatRelativeDate(user.joinedAt)}
            </Text>
          </View>
          <MetricBadge label="Broker" tone="accent" />
        </View>
      </Card>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* KPIs */}
          <View style={styles.grid}>
            <KPI icon="document-text-outline" label="Active listings" value={String(listings.length)} />
            <KPI icon="eye-outline" label="Total views" value={String(totalViews)} />
            <KPI icon="people-outline" label="Active leads" value={String(activeLeads)} tone="success" />
            <KPI icon="cash-outline" label="Portfolio value" value={formatUSD(totalValue, true)} />
          </View>

          {/* CTAs */}
          <View style={[styles.row, { marginTop: spacing.xl }]}>
            <PrimaryButton
              title="Add listing"
              icon="add"
              onPress={() => router.push('/listings/create')}
              fullWidth={false}
              style={{ flex: 1 }}
            />
            <SecondaryButton
              title="Edit existing"
              icon="create-outline"
              variant="outline"
              onPress={() => router.push('/listings/edit')}
              fullWidth={false}
              style={{ flex: 1 }}
            />
          </View>

          {/* Active listings */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader
              title="Active listings"
              actionLabel="View all"
              onActionPress={() => router.push('/(tabs)/explore')}
            />
            {listings.length === 0 ? (
              <EmptyState
                icon="document-outline"
                title="No listings yet"
                description="Add your first listing to start receiving leads."
                actionLabel="Add listing"
                onActionPress={() => router.push('/listings/create')}
              />
            ) : (
              <View style={{ gap: spacing.md }}>
                {listings.map((p) => (
                  <ListingRow
                    key={p.id}
                    property={p}
                    onPress={() => router.push(`/property/${p.id}`)}
                    onEdit={() => router.push('/listings/edit')}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Leads */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title="Recent leads" />
            <View style={{ gap: spacing.sm }}>
              {seededLeads(activeLeads).map((lead) => (
                <View key={lead.id} style={styles.leadRow}>
                  <Avatar name={lead.name} size={36} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text variant="bodyStrong">{lead.name}</Text>
                    <Text variant="caption">
                      Asked about “{listings[0]?.title ?? 'a listing'}”
                    </Text>
                  </View>
                  <Text variant="caption">{formatRelativeDate(lead.sentAt)}</Text>
                </View>
              ))}
            </View>
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

function ListingRow({
  property,
  onPress,
  onEdit,
}: {
  property: Property;
  onPress: () => void;
  onEdit: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.listingRow}>
      <Image source={{ uri: property.coverImage }} style={styles.listingImage} contentFit="cover" />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {property.title}
        </Text>
        <Text variant="caption">{property.neighborhood}</Text>
        <View style={styles.listingFooter}>
          <Text variant="bodyStrong">{formatUSD(property.price)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <MetricBadge icon="eye-outline" label={`${184} views`} size="sm" />
            <Pressable onPress={onEdit} hitSlop={6} style={styles.editBtn}>
              <Ionicons name="create-outline" size={16} color={colors.text} />
            </Pressable>
          </View>
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
  row: { flexDirection: 'row', gap: spacing.md },
  listingRow: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listingImage: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
