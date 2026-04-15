import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

type Props = {
  label?: string;
  inline?: boolean;
};

export function LoadingState({ label = 'Loading…', inline }: Props) {
  return (
    <View style={[styles.container, inline && styles.inline]}>
      <ActivityIndicator color={colors.primary} />
      <Text variant="caption" style={{ marginTop: spacing.sm }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  inline: { paddingVertical: spacing.lg },
});
