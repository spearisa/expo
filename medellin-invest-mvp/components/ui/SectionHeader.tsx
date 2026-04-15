import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text variant="h3">{title}</Text>
        {subtitle && (
          <Text variant="caption" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {actionLabel && (
        <Pressable onPress={onActionPress} style={styles.action} hitSlop={8}>
          <Text variant="captionStrong" style={{ color: colors.primary }}>
            {actionLabel}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
