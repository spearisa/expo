import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { formatUSD } from '@/utils/format';
import { Text } from './Text';

type Props = {
  amount: number;
  size?: 'md' | 'lg' | 'xl';
  suffix?: string;
  inverse?: boolean;
};

export function PriceTag({ amount, size = 'lg', suffix, inverse }: Props) {
  const variant = size === 'xl' ? 'metricLg' : size === 'lg' ? 'metric' : 'h3';
  const color = inverse ? colors.textInverse : colors.text;
  return (
    <View style={styles.row}>
      <Text variant={variant} style={{ color }}>
        {formatUSD(amount)}
      </Text>
      {suffix && (
        <Text variant="caption" style={{ marginLeft: 4, color: inverse ? colors.textInverse : colors.textMuted }}>
          {suffix}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },
});
