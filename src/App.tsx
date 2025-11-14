import {NavigationContainer} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from '@/navigation/Navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {store} from '@/redux/store';
import ThemeProvider from '@/providers/ThemeProvider';
import useThemeStore from '@/hooks/useThemeStore';
import {getThemeColors} from '@/util/themeColors';

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

const AppContent = () => {
  const {isDarkMode} = useThemeStore();
  const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.gestureHandler}>
          <NavigationContainer
            theme={{
              dark: isDarkMode,
              colors: {
                primary: colors.text,
                background: colors.background,
                card: colors.surface,
                text: colors.text,
                border: colors.border,
                notification: colors.text,
              },
              fonts: {
                regular: {
                  fontFamily: 'System',
                  fontWeight: '400',
                },
                medium: {
                  fontFamily: 'System',
                  fontWeight: '500',
                },
                bold: {
                  fontFamily: 'System',
                  fontWeight: '700',
                },
                heavy: {
                  fontFamily: 'System',
                  fontWeight: '800',
                },
              },
            }}
          >
            <Navigation />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
