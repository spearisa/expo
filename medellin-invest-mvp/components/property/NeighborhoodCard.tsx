import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, spacing } from '@/theme';
import { Neighborhood } from '@/types';
import { formatUSD } from '@/utils/format';
import { Text } from '@/components/ui/Text';

type Props = {
  neighborhood: Neighborhood;
  width?: number;
  onPress?: () => void;
};

export function NeighborhoodCard({ neighborhood, width = 180, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && { opacity: 0.92 },
      ]}
    >
      <Image source={{ uri: neighborhood.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.scrim} />
      <View style={styles.body}>
        <Text variant="title" style={{ color: colors.textInverse }}>
          {neighborhood.name}
        </Text>
        <Text variant="caption" style={{ color: colors.textInverse, opacity: 0.85, marginTop: 2 }}>
          {neighborhood.listingCount} listings · {formatUSD(neighborhood.averagePricePerSqm)}/m²
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  image: { width: '100%', height: '100%' },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,27,43,0.42)',
  },
  body: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
});
