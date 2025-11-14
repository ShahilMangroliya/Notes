export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  errorBackground: string;
  warning: string;
  success: string;
  primary: string;
}

export const lightColors: ThemeColors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  error: '#FF3B30',
  errorBackground: '#FF3B3015',
  warning: '#FF9500',
  success: '#34C759',
  primary: '#007AFF',
};

export const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#98989D',
  border: '#38383A',
  error: '#FF453A',
  errorBackground: '#FF453A20',
  warning: '#FF9F0A',
  success: '#30D158',
  primary: '#0A84FF',
};

export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};
