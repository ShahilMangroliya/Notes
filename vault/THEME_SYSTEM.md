# Theme System Documentation

Complete guide to the theme system implementation in the Notes app.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Theme Colors](#theme-colors)
4. [Theme Provider](#theme-provider)
5. [Hooks](#hooks)
6. [Redux Integration](#redux-integration)
7. [Styled Components Integration](#styled-components-integration)
8. [Usage Examples](#usage-examples)
9. [API Reference](#api-reference)

---

## Overview

The theme system provides:
- ✅ Light and dark mode support
- ✅ System theme detection
- ✅ Persistent theme preferences (MMKV storage)
- ✅ Real-time theme switching
- ✅ Type-safe theme colors
- ✅ Styled-components integration
- ✅ Redux state management

---

## Architecture

```
┌─────────────────────────────────────────┐
│         ThemeProvider (App Level)        │
│  Wraps app with styled-components Theme │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼──────────┐
│  useThemeStore │  │  useColorScheme │
│  (Redux Hook)  │  │  (Combined Hook)│
└───────┬────────┘  └──────┬──────────┘
        │                   │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │   Redux Store     │
        │   (themeSlice)    │
        └───────────────────┘
                  │
        ┌─────────▼─────────┐
        │   MMKV Storage    │
        │  (Persistence)    │
        └───────────────────┘
```

### Key Components

1. **ThemeProvider** - Wraps app with styled-components ThemeProvider
2. **useThemeStore** - Redux hook for theme state management
3. **useColorScheme** - Combined hook for theme colors + management
4. **themeSlice** - Redux slice for theme state
5. **themeColors** - Color definitions (light/dark)

---

## Theme Colors

**Location**: `src/util/themeColors.ts`

### Color Palette

```typescript
interface ThemeColors {
  background: string;      // Main background color
  surface: string;         // Card/surface background
  text: string;           // Primary text color
  textSecondary: string;  // Secondary/muted text
  border: string;         // Border color
}
```

### Light Theme

```typescript
{
  background: '#FFFFFF',    // White
  surface: '#F5F5F5',      // Light gray
  text: '#000000',         // Black
  textSecondary: '#666666', // Medium gray
  border: '#E0E0E0',       // Light gray
}
```

### Dark Theme

```typescript
{
  background: '#121212',    // Dark gray
  surface: '#1E1E1E',      // Slightly lighter dark
  text: '#FFFFFF',         // White
  textSecondary: '#B0B0B0', // Light gray
  border: '#333333',       // Dark gray
}
```

### Usage

```typescript
import {getThemeColors, lightColors, darkColors} from '@/util/themeColors';

// Get colors based on dark mode
const colors = getThemeColors(isDark);

// Access specific colors
const bgColor = colors.background;
```

---

## Theme Provider

**Location**: `src/providers/ThemeProvider.tsx`

Wraps the app with styled-components `ThemeProvider` to make theme available throughout the component tree.

### Setup

```typescript
// App.tsx
import ThemeProvider from '@/providers/ThemeProvider';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* App content */}
      </ThemeProvider>
    </Provider>
  );
};
```

### How It Works

1. Uses `useThemeStore` to get current theme state
2. Calculates theme colors based on `isDarkMode`
3. Provides theme via styled-components `ThemeProvider`
4. Automatically updates when theme changes

---

## Hooks

### useThemeStore

**Location**: `src/hooks/useThemeStore.ts`

Main hook for theme state management. Connects to Redux store.

#### Returns

```typescript
{
  // State
  currentTheme: 'light' | 'dark' | 'system';
  isDark: boolean;
  systemPrefersDark: boolean;
  isInitialized: boolean;
  
  // Getters
  effectiveTheme: 'light' | 'dark';
  isDarkMode: boolean;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => void;
}
```

#### Features

- ✅ Loads theme from MMKV storage on mount
- ✅ Detects system theme preference
- ✅ Listens to system theme changes
- ✅ Persists theme selection
- ✅ Calculates effective theme (system → light/dark)

#### Usage

```typescript
import useThemeStore from '@/hooks/useThemeStore';

const MyComponent = () => {
  const {isDarkMode, setTheme, currentTheme} = useThemeStore();
  
  return (
    <View>
      <Text>Current theme: {currentTheme}</Text>
      <Button onPress={() => setTheme('dark')}>
        Switch to Dark
      </Button>
    </View>
  );
};
```

### useColorScheme

**Location**: `src/hooks/useColorScheme.ts`

Combined hook that provides both theme colors and management functions.

#### Returns

```typescript
{
  colors: ThemeColors;           // Theme color object
  isDark: boolean;               // Dark mode status
  setTheme: (theme) => void;     // Change theme
  currentTheme: ThemeMode;       // Current theme mode
}
```

#### Usage

```typescript
import {useColorScheme} from '@/hooks/useColorScheme';

const MyComponent = () => {
  const {colors, isDark, setTheme} = useColorScheme();
  
  return (
    <View style={{backgroundColor: colors.background}}>
      <Text style={{color: colors.text}}>
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </View>
  );
};
```

---

## Redux Integration

**Location**: `src/redux/themeSlice.ts`

### State Structure

```typescript
interface ThemeState {
  currentTheme: 'light' | 'dark' | 'system';
  systemPrefersDark: boolean;
  isInitialized: boolean;
}
```

### Actions

- `setTheme(theme: ThemeMode)` - Set theme mode
- `setSystemPrefersDark(isDark: boolean)` - Update system preference
- `setInitialized(isInitialized: boolean)` - Mark as initialized
- `initializeTheme({theme, systemPrefersDark})` - Initialize theme state

### Store Configuration

```typescript
// src/redux/store.ts
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});
```

### Typed Hooks

```typescript
// src/hooks/hooks.ts
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '@/redux/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

---

## Styled Components Integration

### Type Declaration

**Location**: `src/types/styled-components.d.ts`

```typescript
import 'styled-components/native';
import type {ThemeColors} from '@/util/themeColors';

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeColors {}
}
```

This makes TypeScript recognize the theme type in styled components.

### Using Theme in Styled Components

```typescript
import styled from 'styled-components/native';

const Container = styled.View`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

// TypeScript automatically knows theme type!
```

### Using useTheme Hook

```typescript
import {useTheme} from 'styled-components/native';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{backgroundColor: theme.background}}>
      <Text style={{color: theme.text}}>Hello</Text>
    </View>
  );
};
```

---

## Usage Examples

### Example 1: Basic Component with Theme

```typescript
import React from 'react';
import styled from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import StyledText from '@/components/Text';

const Home = () => {
  return (
    <SafeAreaContainer>
      <StyledText>Home Screen</StyledText>
    </SafeAreaContainer>
  );
};

export default Home;
```

### Example 2: Theme Toggle Button

```typescript
import React from 'react';
import {Button, ButtonText} from '@/components';
import useThemeStore from '@/hooks/useThemeStore';

const ThemeToggle = () => {
  const {currentTheme, setTheme, isDarkMode} = useThemeStore();
  
  const toggleTheme = () => {
    if (currentTheme === 'system') {
      setTheme(isDarkMode ? 'light' : 'dark');
    } else {
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  };
  
  return (
    <Button onPress={toggleTheme}>
      <ButtonText>
        {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
      </ButtonText>
    </Button>
  );
};
```

### Example 3: Custom Styled Component

```typescript
import styled from 'styled-components/native';

interface CardProps {
  $elevated?: boolean;
}

const ThemedCard = styled.View<CardProps>`
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px;
  
  ${props => props.$elevated && `
    shadow-color: #000;
    shadow-opacity: 0.1;
    elevation: 3;
  `}
`;

// Usage
<ThemedCard $elevated>
  <Text>Card content</Text>
</ThemedCard>
```

### Example 4: Accessing Theme in Regular Components

```typescript
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from 'styled-components/native';

const MyComponent = () => {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
};
```

---

## API Reference

### ThemeMode Type

```typescript
type ThemeMode = 'light' | 'dark' | 'system';
```

### ThemeColors Interface

```typescript
interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}
```

### Storage Key

```typescript
const THEME_STORAGE_KEY = 'notes.theme';
```

Stored in MMKV for persistence.

---

## Flow Diagram

```
App Start
    │
    ├─► ThemeProvider mounts
    │       │
    │       └─► useThemeStore() called
    │               │
    │               ├─► Check MMKV storage
    │               │   └─► Load saved theme or default to 'system'
    │               │
    │               ├─► Check system theme (Appearance.getColorScheme())
    │               │   └─► Update systemPrefersDark
    │               │
    │               └─► Dispatch initializeTheme action
    │                       │
    │                       └─► Redux state updated
    │                               │
    │                               └─► ThemeProvider re-renders with new theme
    │
    └─► System theme changes
            │
            └─► Appearance.addChangeListener fires
                    │
                    └─► Update systemPrefersDark in Redux
                            │
                            └─► Components re-render with new theme
```

---

## Best Practices

1. **Always use theme colors** - Never hardcode colors
2. **Use styled-components** - Prefer styled-components over StyleSheet for theme-aware styles
3. **Use hooks** - Use `useThemeStore` or `useColorScheme` instead of direct Redux access
4. **Type safety** - Let TypeScript infer theme types from DefaultTheme
5. **Persistence** - Theme preference is automatically persisted
6. **System theme** - Default to 'system' to respect user's device preference

---

## Troubleshooting

### Theme not updating

- Ensure `ThemeProvider` wraps your app
- Check Redux store is properly configured
- Verify `useThemeStore` is being called

### TypeScript errors with theme

- Ensure `src/types/styled-components.d.ts` exists
- Check theme type is properly exported from `themeColors.ts`

### Theme not persisting

- Verify MMKV storage is working
- Check `THEME_STORAGE_KEY` is correct
- Ensure `setTheme` is being called properly

---

*Last updated: 2024*


