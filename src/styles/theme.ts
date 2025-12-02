export const theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F7F5F9',
    surfaceAlt: '#F2F0F5',
    text: '#1A1A1A',
    textMuted: '#666666',
    accent: '#4A006E',
    accentLight: '#E5D7EC',
    accentFaint: '#F2E8F8',
    border: '#DDDDDD',
    danger: '#D32F2F',
  },
  spacing: (m: number) => m * 4,
  radius: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    pill: 999,
  },
  fonts: {
    title: 24,
    body: 16,
    small: 13,
  },
};

export type Theme = typeof theme;
