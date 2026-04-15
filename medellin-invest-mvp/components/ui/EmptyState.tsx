import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  icon = 'sparkles-outline',
  title,
  description,
  actionLabel,
  onActionPress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text variant="h3" align="center">
        {title}
      </Text>
      {description && (
        <Text variant="body" align="center" style={{ color: colors.textMuted, marginTop: spacing.xs, maxWidth: 300 }}>
          {description}
        </Text>
      )}
      {actionLabel && (
        <View style={{ marginTop: spacing.lg, alignSelf: 'stretch', paddingHorizontal: spacing.xl }}>
          <PrimaryButton title={actionLabel} onPress={onActionPress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
});
