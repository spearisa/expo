import { Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import { Broker } from '@/types';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/ui/Avatar';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

type Props = { broker: Broker };

export function ContactBrokerCard({ broker }: Props) {
  const openWhatsapp = () => {
    const cleaned = broker.whatsapp.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${cleaned}`).catch(() => {});
  };
  const openCall = () => {
    Linking.openURL(`tel:${broker.phone}`).catch(() => {});
  };

  return (
    <Card padded>
      <View style={styles.row}>
        <Avatar uri={broker.avatarUrl} name={broker.name} size={48} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text variant="bodyStrong">{broker.name}</Text>
          <Text variant="caption" numberOfLines={1}>
            {broker.agency ?? 'Direct seller'}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={colors.accent} />
            <Text variant="caption" style={{ marginLeft: 4 }}>
              {broker.rating.toFixed(1)} · {broker.reviewCount} reviews
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <SecondaryButton
          title="Call"
          icon="call-outline"
          onPress={openCall}
          variant="outline"
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="WhatsApp"
          icon="logo-whatsapp"
          onPress={openWhatsapp}
          fullWidth={false}
          style={{ flex: 1 }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
