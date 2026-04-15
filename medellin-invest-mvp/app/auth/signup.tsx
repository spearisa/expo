import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { UserRole } from '@/types';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  return (
    <Screen scroll keyboardAvoiding>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Text variant="display">Create your account</Text>
        <Text variant="body" style={{ color: colors.textMuted, marginTop: 4 }}>
          Discover and analyze investment properties in Medellín.
        </Text>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <FormSelect
          label="I am a"
          options={[
            { value: 'buyer', label: 'Buyer / Investor' },
            { value: 'broker', label: 'Broker / Owner' },
          ]}
          value={role}
          onChange={(v) => setRole(v as UserRole)}
          scrollable={false}
        />

        <FormInput
          label="Full name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
          placeholder="Alex Morgan"
        />
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          leftIcon="mail-outline"
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon="lock-closed-outline"
          placeholder="Minimum 8 characters"
          helper="Use at least 8 characters with a number and symbol."
        />

        <PrimaryButton
          title="Create account"
          icon="arrow-forward"
          iconPosition="right"
          style={{ marginTop: spacing.lg }}
          onPress={() => router.replace('/(tabs)')}
        />

        <Text variant="caption" align="center" style={{ marginTop: spacing.lg, color: colors.textSubtle }}>
          By signing up you agree to our Terms and Privacy Policy.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Text variant="caption">Already have an account?</Text>
        <Pressable onPress={() => router.replace('/auth/login')} hitSlop={8}>
          <Text variant="captionStrong" style={{ color: colors.primary, marginLeft: 4 }}>
            Sign in
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'flex-end', paddingTop: spacing.sm },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['3xl'],
  },
});
