import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadow, spacing } from '@/theme';
import { Property } from '@/types';
import { formatPercent, formatUSD } from '@/utils/format';
import { Text } from '@/components/ui/Text';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  property: Property;
  width?: number;
};

/**
 * Hero-style card optimized for the home screen carousel.
 */
export function FeaturedPropertyCard({ property, width = 300 }: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/property/${property.id}`)}
      style={({ pressed }) => [
        styles.card,
        { width },
        shadow.md as ViewStyle,
        pressed && { opacity: 0.94 },
      ]}
    >
      <Image
        source={{ uri: property.coverImage }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.scrim} />
      <View style={styles.topRow}>
        <View style={styles.featuredPill}>
          <Ionicons name="star" size={12} color={colors.accent} />
          <Text style={{ color: colors.textInverse, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
            FEATURED
          </Text>
        </View>
        <FavoriteButton propertyId={property.id} />
      </View>
      <View style={styles.body}>
        <Text variant="caption" style={{ color: colors.textInverse, opacity: 0.85 }}>
          {property.neighborhood} · {property.city}
        </Text>
        <Text variant="h2" style={{ color: colors.textInverse, marginTop: 4 }} numberOfLines={2}>
          {property.title}
        </Text>
        <View style={styles.bottom}>
          <Text variant="metric" style={{ color: colors.textInverse }}>
            {formatUSD(property.price)}
          </Text>
          <View style={styles.roiPill}>
            <Ionicons name="trending-up" size={12} color={colors.primary} />
            <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
              {formatPercent(property.estimatedROI)} ROI
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 360,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  image: { width: '100%', height: '100%' },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,27,43,0.45)',
  },
  topRow: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14,27,43,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  body: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  roiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
});
