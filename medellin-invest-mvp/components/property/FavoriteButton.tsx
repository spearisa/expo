import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '@/theme';
import { useFavoritesStore } from '@/store/favorites';

type Props = {
  propertyId: string;
  size?: number;
  style?: ViewStyle;
  variant?: 'floating' | 'inline';
};

export function FavoriteButton({
  propertyId,
  size = 36,
  style,
  variant = 'floating',
}: Props) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(propertyId));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <Pressable
      onPress={() => toggle(propertyId)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
      style={({ pressed }) => [
        variant === 'floating' && styles.floating,
        { width: size, height: size, borderRadius: radius.full },
        variant === 'floating' && (shadow.sm as ViewStyle),
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size * 0.55}
        color={isFavorite ? colors.danger : variant === 'floating' ? colors.text : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floating: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
