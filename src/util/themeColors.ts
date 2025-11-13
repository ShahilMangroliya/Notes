export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
};

export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};
