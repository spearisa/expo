import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { ROIBreakdown } from '@/utils/roi';
import { formatUSD } from '@/utils/format';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

type Props = { breakdown: ROIBreakdown };

export function ROIComparisonCard({ breakdown }: Props) {
  const stWins = breakdown.bestStrategy === 'shortTerm';
  return (
    <Card padded>
      <Text variant="captionStrong" style={{ marginBottom: spacing.md }}>
        Short-term vs. Long-term
      </Text>

      <Strategy
        title="Short-term rental"
        icon="calendar-outline"
        annualNet={breakdown.annualNetShortTerm}
        monthlyNet={breakdown.monthlyNetShortTerm}
        gross={breakdown.annualGrossShortTerm}
        winner={stWins}
      />
      <View style={styles.divider} />
      <Strategy
        title="Long-term rental"
        icon="home-outline"
        annualNet={breakdown.annualNetLongTerm}
        monthlyNet={breakdown.monthlyNetLongTerm}
        gross={breakdown.annualGrossLongTerm}
        winner={!stWins}
      />
    </Card>
  );
}

function Strategy({
  title,
  icon,
  annualNet,
  monthlyNet,
  gross,
  winner,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  annualNet: number;
  monthlyNet: number;
  gross: number;
  winner: boolean;
}) {
  return (
    <View style={styles.strategy}>
      <View style={styles.head}>
        <Ionicons name={icon} size={16} color={colors.text} />
        <Text variant="bodyStrong" style={{ marginLeft: 6 }}>
          {title}
        </Text>
        {winner && (
          <View style={styles.bestPill}>
            <Ionicons name="trophy" size={11} color={colors.accent} />
            <Text style={{ fontSize: 11, fontWeight: '700', marginLeft: 4, color: '#7B5F1A' }}>
              BEST
            </Text>
          </View>
        )}
      </View>
      <View style={styles.metrics}>
        <Metric label="Annual net" value={formatUSD(annualNet)} highlight={winner} />
        <Metric label="Monthly net" value={formatUSD(monthlyNet)} />
        <Metric label="Gross / yr" value={formatUSD(gross)} />
      </View>
    </View>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.metric}>
      <Text variant="micro">{label}</Text>
      <Text variant="bodyStrong" style={{ marginTop: 2, color: highlight ? colors.success : colors.text }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strategy: { gap: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center' },
  bestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  metric: { flex: 1 },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
});
