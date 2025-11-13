import {useCallback, useEffect, useMemo} from 'react';
import {Appearance} from 'react-native';
import {useAppDispatch, useAppSelector} from './hooks';
import type {ThemeMode} from '@/redux/themeSlice';
import {
  initializeTheme as initTheme,
  setSystemPrefersDark,
  setTheme,
} from '@/redux/themeSlice';
import StorageHelper, {THEME_STORAGE_KEY} from '@/util/StorageHelper';

const useThemeStore = () => {
  const dispatch = useAppDispatch();
  const {currentTheme, systemPrefersDark, isInitialized} = useAppSelector(
    state => state.theme,
  );

  // Get system color scheme
  const getSystemColorScheme = useCallback((): 'light' | 'dark' | null => {
    const scheme = Appearance.getColorScheme();
    if (scheme === 'light' || scheme === 'dark') {
      return scheme;
    }
    return null;
  }, []);

  // Initialize system preference immediately on mount
  useEffect(() => {
    if (!isInitialized) {
      const systemColorScheme = getSystemColorScheme();
      const prefersDark = systemColorScheme === 'dark';
      dispatch(setSystemPrefersDark(prefersDark));
    }
  }, [dispatch, getSystemColorScheme, isInitialized]);

  // Initialize theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      if (isInitialized) {
        return;
      }

      try {
        const savedTheme = StorageHelper.getItem(
          THEME_STORAGE_KEY,
          'string',
        ) as ThemeMode | undefined;

        const theme: ThemeMode =
          savedTheme && ['light', 'dark', 'system'].includes(savedTheme)
            ? savedTheme
            : 'system';

        // Get initial system preference
        const systemColorScheme = getSystemColorScheme();
        const prefersDark = systemColorScheme === 'dark';

        dispatch(
          initTheme({
            theme,
            systemPrefersDark: prefersDark,
          }),
        );
      } catch (error) {
        console.error('Error initializing theme:', error);
        // Initialize with defaults
        const systemColorScheme = getSystemColorScheme();
        dispatch(
          initTheme({
            theme: 'system',
            systemPrefersDark: systemColorScheme === 'dark',
          }),
        );
      }
    };

    loadTheme();
  }, [dispatch, getSystemColorScheme, isInitialized]);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      dispatch(setSystemPrefersDark(colorScheme === 'dark'));
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  // Calculate effective theme
  const effectiveTheme = useMemo<'light' | 'dark'>(() => {
    if (currentTheme === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return currentTheme;
  }, [currentTheme, systemPrefersDark]);

  // Calculate if dark mode is active
  const isDarkMode = useMemo<boolean>(() => {
    if (currentTheme === 'system') {
      return systemPrefersDark;
    }
    return currentTheme === 'dark';
  }, [currentTheme, systemPrefersDark]);

  // Set theme
  const handleSetTheme = useCallback(
    (theme: ThemeMode) => {
      if (!['light', 'dark', 'system'].includes(theme)) {
        console.warn(`Invalid theme: ${theme}. Using 'system' instead.`);
        return;
      }

      dispatch(setTheme(theme));
      try {
        StorageHelper.setItem(THEME_STORAGE_KEY, theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    },
    [dispatch],
  );

  // Initialize theme (for compatibility with old API)
  const initializeTheme = useCallback(() => {
    if (!isInitialized) {
      const systemColorScheme = getSystemColorScheme();
      dispatch(
        initTheme({
          theme: currentTheme,
          systemPrefersDark: systemColorScheme === 'dark',
        }),
      );
    }
  }, [dispatch, isInitialized, currentTheme, getSystemColorScheme]);

  return {
    // State
    currentTheme,
    isDark: isDarkMode,
    systemPrefersDark,
    isInitialized,

    // Getters
    effectiveTheme,
    isDarkMode,

    // Actions
    setTheme: handleSetTheme,
    initializeTheme,
  };
};

export default useThemeStore;
