import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import {
  ROIInputs,
  ROI_DISCLAIMER,
  calculateROI,
  defaultInputsFromProperty,
} from '@/utils/roi';
import { Property } from '@/types';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { FormInput } from '@/components/forms/FormInput';
import { FormToggle } from '@/components/forms/FormToggle';
import { ROIStatsCard } from './ROIStatsCard';
import { ROIComparisonCard } from './ROIComparisonCard';

type Props = { property: Property };

/**
 * Interactive ROI calculator. Seeds inputs from the listing and lets the user
 * tweak nightly rate, occupancy, expenses and financing assumptions live.
 */
export function ROICalculator({ property }: Props) {
  const [inputs, setInputs] = useState<ROIInputs>(() => defaultInputsFromProperty(property));
  const [financingEnabled, setFinancingEnabled] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState('30');
  const [interestPct, setInterestPct] = useState('7.5');
  const [termYears, setTermYears] = useState('20');

  const breakdown = useMemo(() => {
    const financing = financingEnabled
      ? {
          downPaymentRatio: Math.max(0.05, Math.min(1, Number(downPaymentPct) / 100 || 0.3)),
          interestRate: Math.max(0, Number(interestPct) / 100 || 0),
          termYears: Math.max(1, Number(termYears) || 20),
        }
      : undefined;
    return calculateROI({ ...inputs, financing });
  }, [inputs, financingEnabled, downPaymentPct, interestPct, termYears]);

  const update = <K extends keyof ROIInputs>(key: K, value: string) => {
    const num = Number(value);
    setInputs((s) => ({ ...s, [key]: Number.isFinite(num) ? num : 0 }));
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <Card padded>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="calculator-outline" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">ROI calculator</Text>
            <Text variant="caption">Adjust assumptions and see returns update live.</Text>
          </View>
        </View>

        <Text variant="captionStrong" style={styles.section}>
          Purchase
        </Text>
        <FormInput
          label="Purchase price"
          keyboardType="number-pad"
          value={String(inputs.purchasePrice)}
          onChangeText={(t) => update('purchasePrice', t)}
          leftIcon="cash-outline"
          rightAdornment="USD"
        />

        <Text variant="captionStrong" style={styles.section}>
          Short-term rental
        </Text>
        <View style={styles.row}>
          <FormInput
            containerStyle={{ flex: 1, marginBottom: spacing.lg }}
            label="Nightly rate"
            keyboardType="number-pad"
            value={String(inputs.nightlyRate)}
            onChangeText={(t) => update('nightlyRate', t)}
            rightAdornment="USD"
          />
          <FormInput
            containerStyle={{ flex: 1, marginBottom: spacing.lg }}
            label="Occupancy"
            keyboardType="decimal-pad"
            value={String(Math.round((inputs.occupancyRate || 0) * 100))}
            onChangeText={(t) =>
              setInputs((s) => ({ ...s, occupancyRate: Math.max(0, Math.min(100, Number(t) || 0)) / 100 }))
            }
            rightAdornment="%"
          />
        </View>
        <FormInput
          label="Cleaning cost per stay"
          keyboardType="number-pad"
          value={String(inputs.cleaningCostPerStay)}
          onChangeText={(t) => update('cleaningCostPerStay', t)}
          rightAdornment="USD"
        />

        <Text variant="captionStrong" style={styles.section}>
          Long-term rental
        </Text>
        <FormInput
          label="Monthly rent"
          keyboardType="number-pad"
          value={String(inputs.longTermMonthlyRent)}
          onChangeText={(t) => update('longTermMonthlyRent', t)}
          rightAdornment="USD"
        />

        <Text variant="captionStrong" style={styles.section}>
          Monthly expenses
        </Text>
        <View style={styles.row}>
          <FormInput
            containerStyle={{ flex: 1, marginBottom: spacing.lg }}
            label="HOA"
            keyboardType="number-pad"
            value={String(inputs.hoaMonthly)}
            onChangeText={(t) => update('hoaMonthly', t)}
          />
          <FormInput
            containerStyle={{ flex: 1, marginBottom: spacing.lg }}
            label="Utilities"
            keyboardType="number-pad"
            value={String(inputs.utilitiesMonthly)}
            onChangeText={(t) => update('utilitiesMonthly', t)}
          />
        </View>
        <View style={styles.row}>
          <FormInput
            containerStyle={{ flex: 1, marginBottom: spacing.lg }}
            label="Management"
            keyboardType="number-pad"
            value={String(inputs.managementMonthly)}
            onChangeText={(t) => update('managementMonthly', t)}
          />
          <FormInput
            containerStyle={{ flex: 1, marginBottom: spacing.lg }}
            label="Maintenance"
            keyboardType="number-pad"
            value={String(inputs.maintenanceReserveMonthly)}
            onChangeText={(t) => update('maintenanceReserveMonthly', t)}
          />
        </View>

        <Text variant="captionStrong" style={styles.section}>
          Financing
        </Text>
        <FormToggle
          label="Use financing"
          description="Apply a mortgage to your purchase"
          value={financingEnabled}
          onValueChange={setFinancingEnabled}
        />
        {financingEnabled && (
          <View style={{ marginTop: spacing.md }}>
            <View style={styles.row}>
              <FormInput
                containerStyle={{ flex: 1, marginBottom: spacing.lg }}
                label="Down payment"
                keyboardType="decimal-pad"
                value={downPaymentPct}
                onChangeText={setDownPaymentPct}
                rightAdornment="%"
              />
              <FormInput
                containerStyle={{ flex: 1, marginBottom: spacing.lg }}
                label="Interest rate"
                keyboardType="decimal-pad"
                value={interestPct}
                onChangeText={setInterestPct}
                rightAdornment="%"
              />
            </View>
            <FormInput
              label="Loan term"
              keyboardType="number-pad"
              value={termYears}
              onChangeText={setTermYears}
              rightAdornment="years"
            />
          </View>
        )}
      </Card>

      <ROIStatsCard breakdown={breakdown} title="Live calculation" />
      <ROIComparisonCard breakdown={breakdown} />

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
        <Text variant="caption" style={{ flex: 1, marginLeft: 6 }}>
          {ROI_DISCLAIMER}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginTop: spacing.sm, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
});
