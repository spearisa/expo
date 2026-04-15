import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { ROIBreakdown } from '@/utils/roi';
import { formatPercent, formatUSD } from '@/utils/format';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

type Props = {
  breakdown: ROIBreakdown;
  title?: string;
};

export function ROIStatsCard({ breakdown, title = 'Investment snapshot' }: Props) {
  return (
    <Card padded>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="analytics" size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="captionStrong">{title}</Text>
          <Text variant="caption" style={{ color: colors.textMuted }}>
            Best strategy:{' '}
            {breakdown.bestStrategy === 'shortTerm' ? 'Short-term rental' : 'Long-term rental'}
          </Text>
        </View>
        <View style={styles.roiPill}>
          <Text style={{ color: colors.success, fontWeight: '700' }}>
            {formatPercent(breakdown.roiPercent)}
          </Text>
          <Text variant="micro" style={{ color: colors.success, marginLeft: 4 }}>
            ROI
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Stat label="Cap rate" value={formatPercent(breakdown.capRate)} />
        <Stat
          label="Cash-on-cash"
          value={formatPercent(breakdown.cashOnCashReturn)}
        />
        <Stat
          label="Monthly net"
          value={formatUSD(
            breakdown.bestStrategy === 'shortTerm'
              ? breakdown.monthlyNetShortTerm
              : breakdown.monthlyNetLongTerm
          )}
        />
        <Stat
          label="Annual net"
          value={formatUSD(breakdown.bestAnnualNet)}
        />
        <Stat
          label="Payback"
          value={
            Number.isFinite(breakdown.paybackYears)
              ? `${breakdown.paybackYears} yrs`
              : '—'
          }
        />
        <Stat
          label="Cash invested"
          value={formatUSD(breakdown.cashInvested)}
        />
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="micro">{label}</Text>
      <Text variant="bodyStrong" style={{ marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    width: '50%',
    paddingVertical: spacing.sm,
  },
});
