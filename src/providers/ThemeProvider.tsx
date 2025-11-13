import React, {useMemo} from 'react';
import {ThemeProvider as StyledThemeProvider} from 'styled-components/native';
import useThemeStore from '@/hooks/useThemeStore';
import {getThemeColors} from '@/util/themeColors';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const {isDarkMode} = useThemeStore();
  const theme = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);

  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;

