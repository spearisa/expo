import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme';
import { useAuthStore } from '@/store/auth';
import { useFavoritesStore } from '@/store/favorites';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

type RowItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress?: () => void;
  destructive?: boolean;
  badge?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const favoritesCount = useFavoritesStore((s) => s.ids.length);

  const dashboardItems: RowItem[] = [
    {
      icon: 'analytics-outline',
      label: 'Buyer dashboard',
      description: 'Saved properties, inquiries, ROI snapshots',
      onPress: () => router.push('/dashboard/buyer'),
    },
    {
      icon: 'briefcase-outline',
      label: 'Broker dashboard',
      description: 'Active listings, leads, performance',
      onPress: () => router.push('/dashboard/broker'),
    },
  ];

  const accountItems: RowItem[] = [
    {
      icon: 'heart-outline',
      label: 'My saved properties',
      badge: String(favoritesCount),
      onPress: () => router.push('/(tabs)/favorites'),
    },
    {
      icon: 'document-text-outline',
      label: 'My listings',
      onPress: () => router.push('/dashboard/broker'),
    },
    {
      icon: 'chatbubbles-outline',
      label: 'My inquiries',
      onPress: () => router.push('/dashboard/buyer'),
    },
    {
      icon: 'add-circle-outline',
      label: 'Post a property',
      onPress: () => router.push('/listings/create'),
    },
  ];

  const settingsItems: RowItem[] = [
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'language-outline', label: 'Language', description: 'English' },
    { icon: 'shield-checkmark-outline', label: 'Privacy & security' },
    { icon: 'help-circle-outline', label: 'Help & support' },
  ];

  return (
    <Screen scroll>
      <Text variant="h1">Profile</Text>

      {/* Profile summary card */}
      <Card padded style={{ marginTop: spacing.lg }}>
        <View style={styles.row}>
          <Avatar uri={user.avatarUrl} name={user.name} size={64} />
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <Text variant="h3">{user.name}</Text>
            <Text variant="caption">{user.email}</Text>
            <View style={styles.rolePill}>
              <Ionicons
                name={user.role === 'broker' ? 'briefcase' : 'home'}
                size={12}
                color={colors.primary}
              />
              <Text variant="captionStrong" style={{ marginLeft: 4 }}>
                {user.role === 'broker' ? 'Broker' : 'Buyer / Investor'}
              </Text>
            </View>
          </View>
        </View>
        <SecondaryButton
          title="Edit profile"
          icon="pencil-outline"
          variant="outline"
          style={{ marginTop: spacing.lg }}
          onPress={() => {}}
        />
      </Card>

      <Section title="Dashboards" items={dashboardItems} />
      <Section title="Account" items={accountItems} />
      <Section title="Settings" items={settingsItems} />

      <SecondaryButton
        title="Log out"
        icon="log-out-outline"
        tone="danger"
        variant="soft"
        style={{ marginTop: spacing.xl }}
        onPress={() => {
          signOut();
          router.push('/auth/login');
        }}
      />

      <Text variant="caption" align="center" style={{ marginTop: spacing.xl, color: colors.textSubtle }}>
        Medellín Invest · v0.1.0
      </Text>
    </Screen>
  );
}

function Section({ title, items }: { title: string; items: RowItem[] }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text variant="captionStrong" style={{ marginBottom: spacing.sm, color: colors.textMuted }}>
        {title.toUpperCase()}
      </Text>
      <Card padded={false}>
        {items.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.item,
              i < items.length - 1 && styles.itemBorder,
              pressed && { backgroundColor: colors.surfaceAlt },
            ]}
          >
            <View
              style={[
                styles.itemIcon,
                item.destructive && { backgroundColor: colors.dangerSoft },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={item.destructive ? colors.danger : colors.text}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                variant="bodyStrong"
                style={item.destructive ? { color: colors.danger } : undefined}
              >
                {item.label}
              </Text>
              {item.description && (
                <Text variant="caption" style={{ marginTop: 2 }}>
                  {item.description}
                </Text>
              )}
            </View>
            {item.badge && (
              <View style={styles.badge}>
                <Text variant="captionStrong">{item.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rolePill: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    minWidth: 24,
    paddingHorizontal: 8,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
