import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { FormInput } from '@/components/forms/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Screen scroll keyboardAvoiding>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.brand}>
        <View style={styles.logo}>
          <Ionicons name="business" size={22} color={colors.textInverse} />
        </View>
        <Text variant="display" style={{ marginTop: spacing.lg }}>
          Welcome back
        </Text>
        <Text variant="body" style={{ color: colors.textMuted, marginTop: 4 }}>
          Sign in to track your Medellín investment opportunities.
        </Text>
      </View>

      <View style={{ marginTop: spacing['2xl'] }}>
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          leftIcon="mail-outline"
        />
        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="••••••••"
          leftIcon="lock-closed-outline"
          rightAdornment={showPassword ? 'Hide' : 'Show'}
          onSubmitEditing={() => setShowPassword((s) => !s)}
        />

        <Pressable onPress={() => router.push('/auth/forgot-password')} hitSlop={8}>
          <Text variant="captionStrong" style={{ color: colors.primary, alignSelf: 'flex-end' }}>
            Forgot password?
          </Text>
        </Pressable>

        <PrimaryButton
          title="Sign in"
          icon="arrow-forward"
          iconPosition="right"
          style={{ marginTop: spacing.xl }}
          onPress={() => router.replace('/(tabs)')}
        />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text variant="caption" style={{ marginHorizontal: spacing.md }}>
            or continue with
          </Text>
          <View style={styles.line} />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <SecondaryButton
            title="Apple"
            icon="logo-apple"
            variant="outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={() => router.replace('/(tabs)')}
          />
          <SecondaryButton
            title="Google"
            icon="logo-google"
            variant="outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <Text variant="caption">Don't have an account?</Text>
        <Pressable onPress={() => router.replace('/auth/signup')} hitSlop={8}>
          <Text variant="captionStrong" style={{ color: colors.primary, marginLeft: 4 }}>
            Create one
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'flex-end', paddingTop: spacing.sm },
  brand: { alignItems: 'flex-start', marginTop: spacing['2xl'] },
  logo: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['3xl'],
  },
});
