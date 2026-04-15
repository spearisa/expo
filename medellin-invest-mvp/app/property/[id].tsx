import { useEffect, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing } from '@/theme';
import { Property } from '@/types';
import { propertiesService } from '@/services/mock';
import { propertyTypeLabel } from '@/constants/propertyTypes';
import { formatPercent, formatRelativeDate, formatSqm, formatUSD } from '@/utils/format';
import { Text } from '@/components/ui/Text';
import { LoadingState } from '@/components/ui/LoadingState';
import { Card } from '@/components/ui/Card';
import { MetricBadge } from '@/components/ui/MetricBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { PropertyImageCarousel } from '@/components/property/PropertyImageCarousel';
import { ContactBrokerCard } from '@/components/property/ContactBrokerCard';
import { ListingPreviewCard } from '@/components/property/ListingPreviewCard';
import { FavoriteButton } from '@/components/property/FavoriteButton';
import { InvestmentSummaryCard } from '@/components/roi/InvestmentSummaryCard';
import { ROICalculator } from '@/components/roi/ROICalculator';

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [property, setProperty] = useState<Property | undefined>();
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([propertiesService.byId(id), propertiesService.similar(id, 3)]).then(
      ([p, s]) => {
        setProperty(p);
        setSimilar(s);
        setLoading(false);
      }
    );
  }, [id]);

  if (loading || !property) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  const openWhatsapp = () => {
    const msg = encodeURIComponent(`Hi! I'm interested in "${property.title}".`);
    Linking.openURL(`https://wa.me/${property.broker.whatsapp.replace(/\D/g, '')}?text=${msg}`).catch(
      () => {}
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <PropertyImageCarousel images={property.images} />

        {/* Floating header controls */}
        <SafeAreaView edges={['top']} style={styles.topBar} pointerEvents="box-none">
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} style={[styles.iconBtn, shadow.md]}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable style={[styles.iconBtn, shadow.md]} onPress={() => {}}>
                <Ionicons name="share-outline" size={18} color={colors.text} />
              </Pressable>
              <FavoriteButton propertyId={property.id} size={42} variant="floating" />
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          {/* Title */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.sm }}>
                {property.featured && <MetricBadge label="Featured" tone="accent" size="sm" />}
                {property.shortTermCapable && (
                  <MetricBadge label="Short-term capable" tone="info" size="sm" icon="moon-outline" />
                )}
                {property.longTermCapable && (
                  <MetricBadge label="Long-term capable" tone="success" size="sm" icon="home-outline" />
                )}
                {property.source === 'owner' && (
                  <MetricBadge label="Owner direct" tone="neutral" size="sm" />
                )}
              </View>
              <Text variant="h1">{property.title}</Text>
              <View style={styles.location}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text variant="caption" style={{ marginLeft: 4 }}>
                  {property.address} · {property.neighborhood}
                </Text>
              </View>
            </View>
          </View>

          <Text variant="metricLg" style={{ marginTop: spacing.lg }}>
            {formatUSD(property.price)}
          </Text>
          <Text variant="caption">
            Listed {formatRelativeDate(property.listedAt)} · {propertyTypeLabel(property.propertyType)}
          </Text>

          {/* Key stats */}
          <View style={styles.statsGrid}>
            <KeyStat icon="bed-outline" label="Beds" value={String(property.bedrooms)} />
            <KeyStat icon="water-outline" label="Baths" value={String(property.bathrooms)} />
            <KeyStat icon="resize-outline" label="Area" value={formatSqm(property.squareMeters)} />
            <KeyStat icon="car-outline" label="Parking" value={String(property.parking)} />
            <KeyStat
              icon={property.furnished ? 'checkmark-circle' : 'remove-circle-outline'}
              label="Furnished"
              value={property.furnished ? 'Yes' : 'No'}
            />
          </View>

          {/* Investment summary */}
          <View style={{ marginTop: spacing.xl }}>
            <InvestmentSummaryCard property={property} />
          </View>

          {/* Description */}
          <Section title="About this property">
            <Text variant="body" style={{ color: colors.textMuted, lineHeight: 22 }}>
              {property.description}
            </Text>
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <View style={styles.amenityWrap}>
              {property.amenities.map((a) => (
                <View key={a} style={styles.amenityChip}>
                  <Ionicons name="checkmark" size={14} color={colors.success} />
                  <Text variant="captionStrong" style={{ marginLeft: 6 }}>
                    {a}
                  </Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Short-term estimate */}
          {property.shortTermCapable && (
            <Section title="Short-term rental estimate">
              <Card padded>
                <RowMetric label="Nightly rate" value={formatUSD(property.nightlyRateEstimate)} />
                <RowMetric label="Occupancy" value={formatPercent(property.occupancyRateEstimate * 100, 0)} />
                <RowMetric
                  label="Monthly gross"
                  value={formatUSD(property.nightlyRateEstimate * property.occupancyRateEstimate * 30)}
                  bold
                />
              </Card>
            </Section>
          )}

          {/* Long-term estimate */}
          {property.longTermCapable && (
            <Section title="Long-term rental estimate">
              <Card padded>
                <RowMetric label="Monthly rent" value={formatUSD(property.monthlyLongTermRent)} />
                <RowMetric label="Annual gross" value={formatUSD(property.monthlyLongTermRent * 12)} bold />
              </Card>
            </Section>
          )}

          {/* Location */}
          <Section title="Location">
            <Card padded={false}>
              <View style={styles.mapPreview}>
                <Ionicons name="map-outline" size={28} color={colors.primary} />
                <Text variant="captionStrong" style={{ marginTop: 6 }}>
                  {property.neighborhood}, Medellín
                </Text>
                <Text variant="caption">
                  {property.coordinates.latitude.toFixed(4)}, {property.coordinates.longitude.toFixed(4)}
                </Text>
              </View>
              <View style={{ padding: spacing.md }}>
                <SecondaryButton
                  title="Open in Map"
                  icon="navigate-outline"
                  variant="outline"
                  onPress={() => router.push('/(tabs)/map')}
                />
              </View>
            </Card>
          </Section>

          {/* Broker */}
          <Section title="Listed by">
            <ContactBrokerCard broker={property.broker} />
          </Section>

          {/* ROI calculator */}
          <Section title="Investment analysis" subtitle="Tweak the assumptions to model your returns">
            <ROICalculator property={property} />
          </Section>

          {/* Similar */}
          {similar.length > 0 && (
            <Section title="Similar properties">
              <View style={{ gap: spacing.md }}>
                {similar.map((p) => (
                  <ListingPreviewCard key={p.id} property={p} />
                ))}
              </View>
            </Section>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.bottomInner}>
          <View style={{ flex: 1 }}>
            <Text variant="caption">Asking price</Text>
            <Text variant="h3">{formatUSD(property.price)}</Text>
          </View>
          <PrimaryButton
            title="WhatsApp"
            icon="logo-whatsapp"
            onPress={openWhatsapp}
            fullWidth={false}
            size="md"
            style={{ paddingHorizontal: spacing.xl }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text variant="h3">{title}</Text>
      {subtitle && (
        <Text variant="caption" style={{ marginTop: 2 }}>
          {subtitle}
        </Text>
      )}
      <View style={{ marginTop: spacing.md }}>{children}</View>
    </View>
  );
}

function KeyStat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.keyStat}>
      <Ionicons name={icon} size={18} color={colors.text} />
      <Text variant="bodyStrong" style={{ marginTop: 4 }}>
        {value}
      </Text>
      <Text variant="micro">{label}</Text>
    </View>
  );
}

function RowMetric({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.rowMetric}>
      <Text variant="body" style={{ color: colors.textMuted }}>
        {label}
      </Text>
      <Text variant={bold ? 'bodyStrong' : 'body'}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  location: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  keyStat: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  amenityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  rowMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  mapPreview: {
    height: 160,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  bottomInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
