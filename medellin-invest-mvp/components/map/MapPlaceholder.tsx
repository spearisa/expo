import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '@/theme';
import { Property } from '@/types';
import { formatUSD } from '@/utils/format';
import { Text } from '@/components/ui/Text';

type Props = {
  properties: Property[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

/**
 * Visual map placeholder. Until react-native-maps is integrated, this provides
 * a polished decorative basemap with positioned price markers projected from
 * coordinates so the screen still feels like a real map browser.
 *
 * Latitude range used for projection is roughly Medellín's metro area:
 *   lat 6.13 (south) — 6.27 (north)
 *   lng -75.62 (west) — -75.55 (east)
 */
const LAT_MIN = 6.13;
const LAT_MAX = 6.27;
const LNG_MIN = -75.62;
const LNG_MAX = -75.55;

export function MapPlaceholder({ properties, selectedId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://picsum.photos/seed/medellin-map/1200/2000' }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.tint} />
      <View style={styles.notice}>
        <Ionicons name="map-outline" size={14} color={colors.textInverse} />
        <Text style={{ color: colors.textInverse, fontSize: 11, fontWeight: '600', marginLeft: 6 }}>
          MAP PREVIEW · MEDELLÍN
        </Text>
      </View>
      {properties.map((p) => {
        const x =
          ((p.coordinates.longitude - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
        const y =
          ((LAT_MAX - p.coordinates.latitude) / (LAT_MAX - LAT_MIN)) * 100;
        const selected = p.id === selectedId;
        return (
          <Pressable
            key={p.id}
            onPress={() => onSelect(p.id)}
            style={[
              styles.marker,
              { left: `${Math.max(2, Math.min(94, x))}%`, top: `${Math.max(6, Math.min(82, y))}%` },
              selected && styles.markerSelected,
              shadow.md as any,
            ]}
          >
            <Text
              style={{
                color: selected ? colors.textInverse : colors.text,
                fontSize: 12,
                fontWeight: '700',
              }}
            >
              {formatUSD(p.price, true)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,27,43,0.32)',
  },
  notice: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    backgroundColor: 'rgba(14,27,43,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  marker: {
    position: 'absolute',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  markerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
});
