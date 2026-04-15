import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadow, spacing } from '@/theme';
import { Property } from '@/types';
import { formatPercent, formatUSD } from '@/utils/format';
import { Text } from '@/components/ui/Text';
import { MetricBadge } from '@/components/ui/MetricBadge';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  property: Property;
  style?: ViewStyle;
  compact?: boolean;
};

export function PropertyCard({ property, style, compact }: Props) {
  const router = useRouter();
  const onPress = () => router.push(`/property/${property.id}`);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow.sm as ViewStyle,
        pressed && { opacity: 0.92 },
        style,
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: property.coverImage }}
          style={[styles.image, compact && { height: 140 }]}
          contentFit="cover"
          transition={150}
        />
        <View style={styles.imageTopRow}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {property.featured && <MetricBadge label="Featured" tone="accent" size="sm" />}
            {property.source === 'owner' && (
              <MetricBadge label="Owner direct" tone="info" size="sm" />
            )}
          </View>
          <FavoriteButton propertyId={property.id} />
        </View>
        <View style={styles.priceChip}>
          <Text variant="bodyStrong" style={{ color: colors.textInverse }}>
            {formatUSD(property.price)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text variant="caption" numberOfLines={1} style={{ flex: 1 }}>
            {property.neighborhood} · {property.city}
          </Text>
          <View style={styles.roiPill}>
            <Ionicons name="trending-up" size={12} color={colors.success} />
            <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
              {formatPercent(property.estimatedROI)} ROI
            </Text>
          </View>
        </View>
        <Text variant="title" numberOfLines={2} style={{ marginTop: 4 }}>
          {property.title}
        </Text>
        <View style={styles.statsRow}>
          <Stat icon="bed-outline" value={`${property.bedrooms} bd`} />
          <Stat icon="water-outline" value={`${property.bathrooms} ba`} />
          <Stat icon="resize-outline" value={`${property.squareMeters} m²`} />
          {property.parking > 0 && <Stat icon="car-outline" value={`${property.parking}`} />}
        </View>
      </View>
    </Pressable>
  );
}

function Stat({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text variant="caption" style={{ marginLeft: 4 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrap: { position: 'relative' },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceAlt,
  },
  imageTopRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceChip: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  body: { padding: spacing.lg, gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  stat: { flexDirection: 'row', alignItems: 'center' },
});
