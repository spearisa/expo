import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme';
import { Text } from './Text';
import { initials } from '@/utils/format';

type Props = {
  uri?: string;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 40 }: Props) {
  const radiusVal = radius.full;
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radiusVal, backgroundColor: colors.surfaceAlt }}
        contentFit="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radiusVal },
      ]}
    >
      <Text variant="bodyStrong" style={{ color: colors.textInverse, fontSize: size * 0.4 }}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
