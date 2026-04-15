import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { FormInput } from '@/components/forms/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Screen scroll keyboardAvoiding>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Text variant="display">Reset password</Text>
        <Text variant="body" style={{ color: colors.textMuted, marginTop: 4 }}>
          We'll email you a link to reset your password.
        </Text>
      </View>

      {submitted ? (
        <View style={{ marginTop: spacing.xl }}>
          <View style={styles.success}>
            <Ionicons name="mail-open-outline" size={28} color={colors.success} />
          </View>
          <Text variant="h3" align="center" style={{ marginTop: spacing.md }}>
            Check your inbox
          </Text>
          <Text variant="body" align="center" style={{ color: colors.textMuted, marginTop: 4 }}>
            If an account exists for <Text variant="bodyStrong">{email}</Text>, you'll receive a reset link shortly.
          </Text>
          <SecondaryButton
            title="Back to sign in"
            variant="outline"
            style={{ marginTop: spacing.xl }}
            onPress={() => router.replace('/auth/login')}
          />
        </View>
      ) : (
        <View style={{ marginTop: spacing.xl }}>
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon="mail-outline"
            placeholder="you@example.com"
          />
          <PrimaryButton
            title="Send reset link"
            onPress={() => setSubmitted(true)}
            style={{ marginTop: spacing.md }}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'flex-end', paddingTop: spacing.sm },
  success: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
