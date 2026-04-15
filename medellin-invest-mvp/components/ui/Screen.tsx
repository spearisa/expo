import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: 'bg' | 'surface';
  edges?: Edge[];
  contentContainerStyle?: ViewStyle;
  keyboardAvoiding?: boolean;
  refreshControl?: React.ReactElement;
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  background = 'bg',
  edges = ['top', 'left', 'right'],
  contentContainerStyle,
  keyboardAvoiding = false,
  refreshControl,
}: Props) {
  const bg = background === 'surface' ? colors.surface : colors.bg;

  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[
        padded && styles.padded,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, padded && styles.padded, contentContainerStyle]}>
      {children}
    </View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: bg }]} edges={edges}>
      {wrapped}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
});
