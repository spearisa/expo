import { TextStyle } from 'react-native';

export const fontFamily = {
  // System fonts; can be swapped for Inter / Sora when assets are added.
  regular: undefined,
  medium: undefined,
  semibold: undefined,
  bold: undefined,
} as const;

const base = {
  color: '#0E1B2B',
  includeFontPadding: false,
} satisfies Partial<TextStyle>;

export const typography = {
  display: { ...base, fontSize: 32, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { ...base, fontSize: 26, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { ...base, fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { ...base, fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  title: { ...base, fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  body: { ...base, fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyStrong: { ...base, fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  caption: { ...base, fontSize: 13, lineHeight: 18, fontWeight: '400' as const, color: '#5B6573' },
  captionStrong: { ...base, fontSize: 13, lineHeight: 18, fontWeight: '600' as const, color: '#5B6573' },
  micro: { ...base, fontSize: 11, lineHeight: 14, fontWeight: '600' as const, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#8A93A0' },
  metric: { ...base, fontSize: 22, lineHeight: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  metricLg: { ...base, fontSize: 28, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.4 },
} as const;

export type TypographyVariant = keyof typeof typography;
