import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { typography, TypographyVariant, colors } from '@/theme';

type Props = RNTextProps & {
  variant?: TypographyVariant;
  color?: keyof typeof colors;
  align?: TextStyle['textAlign'];
};

export function Text({
  variant = 'body',
  color,
  align,
  style,
  ...rest
}: Props) {
  const styles: TextStyle[] = [typography[variant]];
  if (color) styles.push({ color: colors[color] });
  if (align) styles.push({ textAlign: align });
  if (style) styles.push(style as TextStyle);
  return <RNText {...rest} style={styles} />;
}
