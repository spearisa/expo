import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';
import { SecondaryButton } from './SecondaryButton';

type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load this content. Check your connection and try again.',
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
      </View>
      <Text variant="h3" align="center">
        {title}
      </Text>
      <Text variant="body" align="center" style={{ color: colors.textMuted, marginTop: 4, maxWidth: 320 }}>
        {description}
      </Text>
      {onRetry && (
        <View style={{ marginTop: spacing.lg, alignSelf: 'stretch', paddingHorizontal: spacing.xl }}>
          <SecondaryButton title="Try again" onPress={onRetry} icon="refresh" />
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
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
});
