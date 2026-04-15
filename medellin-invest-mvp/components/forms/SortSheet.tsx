import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { SortOption } from '@/types';
import { SORT_LABELS } from '@/constants/amenities';
import { Text } from '@/components/ui/Text';

type Props = {
  visible: boolean;
  value: SortOption;
  onClose: () => void;
  onChange: (value: SortOption) => void;
};

const ORDER: SortOption[] = ['newest', 'priceAsc', 'priceDesc', 'bestRoi', 'highestNightly'];

export function SortSheet({ visible, value, onClose, onChange }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.handle} />
          <Text variant="h3" style={{ marginBottom: spacing.md }}>
            Sort by
          </Text>
          {ORDER.map((opt) => {
            const selected = opt === value;
            return (
              <Pressable
                key={opt}
                onPress={() => {
                  onChange(opt);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { backgroundColor: colors.surfaceAlt },
                ]}
              >
                <Text variant="body" style={{ flex: 1 }}>
                  {SORT_LABELS[opt]}
                </Text>
                {selected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
});
