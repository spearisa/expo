import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Text } from '@/components/ui/Text';

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  label?: string;
  options: Option<T>[];
  value?: T | null;
  onChange: (value: T) => void;
  error?: string;
  scrollable?: boolean;
};

/**
 * Chip-style select; works well for short option sets in a mobile form
 * (property type, neighborhood, etc.).
 */
export function FormSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  scrollable = true,
}: Props<T>) {
  const chips = options.map((opt) => {
    const selected = opt.value === value;
    return (
      <Pressable
        key={opt.value}
        onPress={() => onChange(opt.value)}
        style={({ pressed }) => [
          styles.chip,
          selected && styles.chipSelected,
          pressed && { opacity: 0.85 },
        ]}
      >
        {selected && (
          <Ionicons name="checkmark" size={14} color={colors.textInverse} style={{ marginRight: 4 }} />
        )}
        <Text
          variant="captionStrong"
          style={{ color: selected ? colors.textInverse : colors.text }}
        >
          {opt.label}
        </Text>
      </Pressable>
    );
  });

  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label && (
        <Text variant="captionStrong" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      )}
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {chips}
        </ScrollView>
      ) : (
        <View style={[styles.row, styles.wrap]}>{chips}</View>
      )}
      {error && (
        <Text variant="caption" style={{ marginTop: 4, color: colors.danger }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  wrap: { flexWrap: 'wrap', rowGap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
