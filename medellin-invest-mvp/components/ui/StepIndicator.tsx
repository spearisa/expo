import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

type Props = {
  steps: string[];
  current: number; // 0-based
};

export function StepIndicator({ steps, current }: Props) {
  return (
    <View>
      <View style={styles.row}>
        {steps.map((_, i) => {
          const state =
            i < current ? 'done' : i === current ? 'active' : 'upcoming';
          return (
            <View
              key={i}
              style={[
                styles.bar,
                state === 'done' && { backgroundColor: colors.primary },
                state === 'active' && { backgroundColor: colors.primary },
                state === 'upcoming' && { backgroundColor: colors.border },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.labelRow}>
        <Text variant="micro" style={{ color: colors.textMuted }}>
          Step {current + 1} of {steps.length}
        </Text>
        <Text variant="captionStrong">{steps[current]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: radius.full },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
