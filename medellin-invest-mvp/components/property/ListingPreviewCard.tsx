import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadow, spacing } from '@/theme';
import { Property } from '@/types';
import { formatPercent, formatUSD } from '@/utils/format';
import { Text } from '@/components/ui/Text';

type Props = { property: Property };

/**
 * Compact preview used by the map bottom sheet and "similar properties" lists.
 */
export function ListingPreviewCard({ property }: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/property/${property.id}`)}
      style={({ pressed }) => [
        styles.card,
        shadow.md as ViewStyle,
        pressed && { opacity: 0.92 },
      ]}
    >
      <Image source={{ uri: property.coverImage }} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <Text variant="caption" numberOfLines={1}>
          {property.neighborhood}
        </Text>
        <Text variant="title" numberOfLines={2}>
          {property.title}
        </Text>
        <View style={styles.row}>
          <Text variant="bodyStrong">{formatUSD(property.price)}</Text>
          <View style={styles.roi}>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: 120, height: 120, backgroundColor: colors.surfaceAlt },
  body: { flex: 1, padding: spacing.md, gap: 4, justifyContent: 'space-between' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  roi: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
});
