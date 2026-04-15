import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'outline' | 'ghost' | 'soft';
  tone?: 'neutral' | 'accent' | 'danger';
  style?: ViewStyle | ViewStyle[];
};

export function SecondaryButton({
  title,
  onPress,
  loading,
  disabled,
  size = 'md',
  fullWidth = true,
  icon,
  variant = 'outline',
  tone = 'neutral',
  style,
}: Props) {
  const isInactive = disabled || loading;

  const toneColor =
    tone === 'accent'
      ? colors.accent
      : tone === 'danger'
        ? colors.danger
        : colors.text;

  const variantStyle: ViewStyle =
    variant === 'outline'
      ? {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: tone === 'neutral' ? colors.borderStrong : toneColor,
        }
      : variant === 'soft'
        ? {
            backgroundColor:
              tone === 'accent'
                ? colors.accentSoft
                : tone === 'danger'
                  ? colors.dangerSoft
                  : colors.surfaceAlt,
          }
        : { backgroundColor: 'transparent' };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={isInactive ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        sizes[size],
        variantStyle,
        fullWidth && styles.full,
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
        style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={toneColor} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={toneColor}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text variant="bodyStrong" style={{ color: toneColor }}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  full: { alignSelf: 'stretch' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
});

const sizes = StyleSheet.create({
  sm: { paddingVertical: 10, paddingHorizontal: 14 },
  md: { paddingVertical: 14, paddingHorizontal: 18 },
  lg: { paddingVertical: 16, paddingHorizontal: 20 },
});
