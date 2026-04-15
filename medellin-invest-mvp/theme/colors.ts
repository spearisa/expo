/**
 * Premium proptech color palette.
 * Neutral base with a deep navy primary and warm gold accent for ROI/highlights.
 */
export const colors = {
  // Brand
  primary: '#0E1B2B',
  primaryMuted: '#1B2A3D',
  accent: '#C8A45C', // gold — ROI highlights
  accentSoft: '#F5EBD3',

  // Semantic
  success: '#1F8B5C',
  successSoft: '#E2F4EB',
  warning: '#C2761F',
  warningSoft: '#FBEFD9',
  danger: '#B53A3A',
  dangerSoft: '#FBE6E6',
  info: '#2F6BB1',
  infoSoft: '#E5EFFA',

  // Neutrals
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F4F7',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  divider: '#EEF0F3',

  // Text
  text: '#0E1B2B',
  textMuted: '#5B6573',
  textSubtle: '#8A93A0',
  textInverse: '#FFFFFF',

  // Overlay
  overlay: 'rgba(14, 27, 43, 0.55)',
  scrim: 'rgba(14, 27, 43, 0.18)',

  // Tab colors
  tabActive: '#0E1B2B',
  tabInactive: '#8A93A0',
} as const;

export type ColorKey = keyof typeof colors;
