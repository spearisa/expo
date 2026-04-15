import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Property } from '@/types';
import { formatPercent, formatUSD } from '@/utils/format';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

type Props = {
  property: Property;
};

/**
 * Compact at-a-glance investment card used at the top of the property detail screen.
 */
export function InvestmentSummaryCard({ property }: Props) {
  return (
    <Card padded style={styles.card}>
      <View style={styles.row}>
        <Item
          icon="trending-up"
          label="Estimated ROI"
          value={formatPercent(property.estimatedROI)}
          tone="success"
        />
        <Divider />
        <Item
          icon="pricetag-outline"
          label="Cap rate"
          value={formatPercent(property.estimatedCapRate)}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        {property.shortTermCapable && (
          <>
            <Item
              icon="moon-outline"
              label="Nightly est."
              value={formatUSD(property.nightlyRateEstimate)}
            />
            <Divider />
          </>
        )}
        <Item
          icon="home-outline"
          label="Long-term rent"
          value={`${formatUSD(property.monthlyLongTermRent)}/mo`}
        />
      </View>
    </Card>
  );
}

function Item({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tone?: 'success';
}) {
  return (
    <View style={styles.item}>
      <Ionicons
        name={icon}
        size={16}
        color={tone === 'success' ? colors.success : colors.textMuted}
      />
      <Text variant="micro" style={{ marginTop: 4 }}>
        {label}
      </Text>
      <Text
        variant="bodyStrong"
        style={{
          marginTop: 2,
          color: tone === 'success' ? colors.success : colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.vDivider} />;
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  item: { flex: 1, alignItems: 'flex-start' },
  vDivider: { width: 1, backgroundColor: colors.divider, marginHorizontal: spacing.md },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md, borderRadius: radius.full },
});
