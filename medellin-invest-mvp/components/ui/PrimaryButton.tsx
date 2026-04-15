import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';
import { Text } from './Text';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
};

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  size = 'md',
  fullWidth = true,
  icon,
  iconPosition = 'left',
  style,
}: Props) {
  const isInactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={isInactive ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        sizes[size],
        fullWidth && styles.full,
        isInactive && styles.disabled,
        pressed && !isInactive && styles.pressed,
        style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textInverse} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={18} color={colors.textInverse} style={{ marginRight: spacing.sm }} />
          )}
          <Text variant="bodyStrong" style={{ color: colors.textInverse }}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={18} color={colors.textInverse} style={{ marginLeft: spacing.sm }} />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  full: { alignSelf: 'stretch' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88 },
});

const sizes = StyleSheet.create({
  sm: { paddingVertical: 10, paddingHorizontal: 14 },
  md: { paddingVertical: 14, paddingHorizontal: 18 },
  lg: { paddingVertical: 16, paddingHorizontal: 20 },
});
