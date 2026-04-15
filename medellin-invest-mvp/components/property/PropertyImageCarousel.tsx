import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, spacing } from '@/theme';
import { Text } from '@/components/ui/Text';

type Props = {
  images: string[];
  height?: number;
};

export function PropertyImageCarousel({ images, height = 320 }: Props) {
  const [index, setIndex] = useState(0);
  const widthRef = useRef(Dimensions.get('window').width);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / widthRef.current);
    if (i !== index) setIndex(i);
  };

  return (
    <View style={{ height, backgroundColor: colors.surfaceAlt }}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: widthRef.current, height }}
            contentFit="cover"
            transition={150}
          />
        )}
      />
      <View style={styles.counter}>
        <Text style={{ color: colors.textInverse, fontSize: 12, fontWeight: '600' }}>
          {index + 1} / {images.length}
        </Text>
      </View>
      <View style={styles.dots} pointerEvents="none">
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(14,27,43,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  dots: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: { backgroundColor: colors.surface, width: 18 },
});
