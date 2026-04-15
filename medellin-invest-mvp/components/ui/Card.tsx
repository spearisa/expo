import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  elevated?: boolean;
  bordered?: boolean;
  onPress?: () => void;
};

export function Card({
  children,
  style,
  padded = true,
  elevated = false,
  bordered = true,
  onPress,
}: Props) {
  const styles: ViewStyle[] = [base.card];
  if (padded) styles.push(base.padded);
  if (elevated) styles.push(shadow.md as ViewStyle);
  if (bordered) styles.push(base.bordered);
  if (style) styles.push(...(Array.isArray(style) ? style : [style]));

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...styles, pressed && base.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={styles}>{children}</View>;
}

const base = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
  },
  padded: { padding: spacing.xl },
  bordered: { borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.85 },
});
