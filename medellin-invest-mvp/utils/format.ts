/**
 * Currency, percent, and date formatting helpers.
 * Centralized so all screens render numbers consistently.
 */

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const usdFormatterCompact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 1,
});

export const formatUSD = (value: number, compact = false) => {
  if (!Number.isFinite(value)) return '—';
  return compact ? usdFormatterCompact.format(value) : usdFormatter.format(value);
};

export const formatPercent = (value: number, fractionDigits = 1) => {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(fractionDigits)}%`;
};

export const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatSqm = (value: number) => `${formatNumber(value)} m²`;

export const formatRelativeDate = (iso: string) => {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffDays = Math.round((now - then) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.round(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.round(diffDays / 30)} months ago`;
  return `${Math.round(diffDays / 365)} years ago`;
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
