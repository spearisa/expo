import { StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  tone?: Tone;
  size?: 'sm' | 'md';
  style?: ViewStyle;
};

const TONE: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceAlt, fg: colors.text },
  accent: { bg: colors.accentSoft, fg: '#7B5F1A' },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  info: { bg: colors.infoSoft, fg: colors.info },
};

export function MetricBadge({ icon, label, tone = 'neutral', size = 'md', style }: Props) {
  const t = TONE[tone];
  const padV = size === 'sm' ? 4 : 6;
  const padH = size === 'sm' ? 8 : 10;
  const fontSize = size === 'sm' ? 11 : 12;
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: t.bg, paddingVertical: padV, paddingHorizontal: padH },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={fontSize + 2} color={t.fg} style={{ marginRight: 4 }} />}
      <Text style={{ color: t.fg, fontSize, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
  },
});
