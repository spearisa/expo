import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadow, spacing } from '@/theme';
import { Text } from '@/components/ui/Text';

type Props = {
  title: string;
  subtitle?: string;
  rightAction?: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap };
};

export function DashboardHeader({ title, subtitle, rightAction }: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={[styles.iconBtn, shadow.sm]} hitSlop={8}>
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text variant="h2">{title}</Text>
        {subtitle && (
          <Text variant="caption" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightAction && (
        <Pressable onPress={rightAction.onPress} style={styles.action} hitSlop={8}>
          {rightAction.icon && (
            <Ionicons name={rightAction.icon} size={16} color={colors.textInverse} style={{ marginRight: 4 }} />
          )}
          <Text variant="captionStrong" style={{ color: colors.textInverse }}>
            {rightAction.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
});
