import {useTheme} from 'styled-components/native';
import useThemeStore from './useThemeStore';
import type {ThemeColors} from '@/util/themeColors';

export interface ColorScheme {
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme: 'light' | 'dark' | 'system';
}

/**
 * Hook to access theme colors and theme management functions
 * @returns ColorScheme object with colors, isDark, setTheme, and currentTheme
 */
export const useColorScheme = (): ColorScheme => {
  const theme = useTheme();
  const {isDarkMode, setTheme, currentTheme} = useThemeStore();

  return {
    colors: theme,
    isDark: isDarkMode,
    setTheme,
    currentTheme,
  };
};
