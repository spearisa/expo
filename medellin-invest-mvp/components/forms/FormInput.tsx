import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';
import { Text } from '@/components/ui/Text';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightAdornment?: string;
  containerStyle?: ViewStyle;
};

export function FormInput({
  label,
  error,
  helper,
  leftIcon,
  rightAdornment,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text variant="captionStrong" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          error && styles.fieldError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={colors.textMuted}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textSubtle}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {rightAdornment && (
          <Text variant="caption" style={{ marginLeft: spacing.sm }}>
            {rightAdornment}
          </Text>
        )}
      </View>
      {(error || helper) && (
        <Text
          variant="caption"
          style={{
            marginTop: 4,
            color: error ? colors.danger : colors.textMuted,
          }}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  fieldFocused: { borderColor: colors.primary },
  fieldError: { borderColor: colors.danger },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
  },
});
