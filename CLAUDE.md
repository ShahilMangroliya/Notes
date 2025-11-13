# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Notes application built with TypeScript, Redux Toolkit for state management, styled-components for styling, React Navigation for routing, and MMKV for persistent storage.

**Tech Stack:**
- React Native 0.82.1
- TypeScript (strict mode)
- Redux Toolkit (@reduxjs/toolkit)
- styled-components/native
- React Navigation v7 (native-stack)
- MMKV (react-native-mmkv) for storage
- react-native-reanimated, react-native-worklets
- Node.js >= 20

## Common Commands

### Development
```bash
# Start Metro bundler
npm start

# Start with cache cleared
npm run cs

# Clear watchman cache only
npm run c

# Run on Android
npm run android

# Run on iOS (requires iOS setup)
npm run ios

# Setup ADB reverse for Android development
npm run adb
```

### iOS Setup (First time or after native dependency changes)
```bash
bundle install
bundle exec pod install
```

### Testing & Quality
```bash
# Run tests
npm test

# Lint code
npm run lint
```

### Build Notes
- Console logs are automatically removed in production builds via `babel-plugin-transform-remove-console`
- Path alias `@/` is configured via `babel-plugin-module-resolver`

## Code Architecture

### Path Aliases
**CRITICAL:** Always use `@/` alias for imports, never relative paths.

```typescript
// ✅ Correct
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useThemeStore from '@/hooks/useThemeStore';

// ❌ Wrong
import SafeAreaContainer from '../../components/SafeAreaContainer';
```

Configured in:
- `tsconfig.json`: `"@/*": ["src/*"]`
- `babel.config.js`: `alias: {'@': './src'}`

### Directory Structure

```
src/
├── components/        # Reusable UI components (styled-components)
├── screens/          # Screen components for navigation
├── navigation/       # React Navigation configuration
├── hooks/            # Custom React hooks (useThemeStore, etc.)
├── redux/            # Redux store, slices
├── providers/        # React Context providers (ThemeProvider)
├── util/             # Pure utility functions (StorageHelper, themeColors)
├── types/            # TypeScript type definitions
└── assets/           # Static assets
```

### State Management (Redux)

**Store Location:** `src/redux/store.ts`

**Current Slices:**
- `themeSlice`: Theme mode management ('light' | 'dark' | 'system')

**Typed Hooks:** Use these instead of plain `useDispatch`/`useSelector`:
```typescript
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
```

**Adding a New Slice:**
1. Create slice in `src/redux/featureSlice.ts` using `createSlice`
2. Export actions and reducer
3. Add reducer to store in `src/redux/store.ts`
4. Use `PayloadAction<T>` for typed actions

### Storage (MMKV)

**Wrapper:** `src/util/StorageHelper.ts`

```typescript
import StorageHelper, {THEME_STORAGE_KEY} from '@/util/StorageHelper';

// Get item (specify type)
const theme = StorageHelper.getItem(THEME_STORAGE_KEY, 'string');

// Set item
StorageHelper.setItem(THEME_STORAGE_KEY, 'dark');

// Remove item
StorageHelper.removeItem(key);

// Clear all
StorageHelper.clear();
```

Supported types: `'boolean' | 'string' | 'number' | 'arrayBuffer'`

### Theme System

**Architecture:**
- Theme mode stored in Redux (`src/redux/themeSlice.ts`)
- Theme colors defined in `src/util/themeColors.ts`
- Theme types declared in `src/types/styled-components.d.ts`
- Theme provider wraps app in `src/providers/ThemeProvider.tsx`

**Theme Hook:**
```typescript
import useThemeStore from '@/hooks/useThemeStore';

const {currentTheme, isDarkMode, setTheme} = useThemeStore();
setTheme('dark' | 'light' | 'system');
```

**In Styled Components:**
```typescript
const Container = styled.View`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;
```

**Available Theme Colors:**
- `background`, `surface`, `text`, `textSecondary`, `border`

### Navigation

**Navigator:** React Navigation v7 Native Stack
**Configuration:** `src/navigation/Navigation.tsx`

**Current Routes:**
- `Home`: Home screen
- `CreateNote`: Note creation screen

**Screen Structure:**
```
screens/
└── ScreenName/
    ├── ScreenName.tsx
    └── styles.ts  # (legacy, prefer styled-components)
```

## Critical Code Patterns

### Styled Components with Transient Props

**CRITICAL:** Always use `$` prefix for styled-component props to avoid React Native warnings.

```typescript
// ✅ Correct
interface ButtonProps {
  $variant?: 'primary' | 'secondary';
  $disabled?: boolean;
}

const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${props =>
    props.$variant === 'primary' ? props.theme.background : props.theme.surface
  };
`;

// Usage
<Button $variant="primary" $disabled={false} />

// ❌ Wrong - causes React Native warnings
interface ButtonProps {
  variant?: 'primary';  // Missing $ prefix
}
```

### TypeScript Strictness

**NEVER use `any` type.** Always define explicit types:

```typescript
// ✅ Correct
export interface ComponentProps {
  onPress: () => void;
  title: string;
}

export const Component: React.FC<ComponentProps> = ({onPress, title}) => {
  // ...
};

// ❌ Wrong
const Component = ({onPress, title}: any) => { /* ... */ };
```

### Component Export Pattern

```typescript
// ComponentName.tsx
export const ComponentName = styled.View`...`;
export default ComponentName;

// index.ts
export {ComponentName, default} from './ComponentName';
export type {ComponentNameProps} from './ComponentName';
```

### Custom Hooks Pattern

```typescript
import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';

export const useFeature = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => state.feature.value);

  const handleAction = useCallback(() => {
    // Implementation
  }, [dispatch]);

  return {value, handleAction};
};
```

## Naming Conventions

- **Files:**
  - Components: PascalCase (`Button.tsx`)
  - Hooks: camelCase (`useThemeStore.ts`)
  - Utils: PascalCase (`StorageHelper.ts`)
- **Variables:**
  - Components: PascalCase (`const Button = ...`)
  - Hooks: camelCase with `use` prefix (`const useThemeStore = ...`)
  - Constants: UPPER_SNAKE_CASE (`const THEME_STORAGE_KEY = ...`)
- **Styled Component Props:** `$` prefix (`$variant`, `$disabled`)

## Import Order

1. React and React Native
2. Third-party libraries
3. Internal imports (using `@/` alias)
4. Types (with `type` keyword)

```typescript
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useThemeStore from '@/hooks/useThemeStore';
import type {ThemeColors} from '@/util/themeColors';
```

## Performance Guidelines

- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions in dependency arrays
- Avoid inline object/array creation in render
- Use `FlatList` for long lists with proper `keyExtractor`

## Accessibility

Always add accessibility props to interactive elements:

```typescript
<Button
  accessibilityRole="button"
  accessibilityLabel="Save note"
  accessibilityState={{disabled: isDisabled}}
  onPress={handleSave}
>
  <ButtonText>Save</ButtonText>
</Button>
```

## Additional Resources

Comprehensive documentation is available in the `vault/` directory:
- `vault/BEST_PRACTICES.md`: Detailed coding standards
- `vault/COMPONENTS.md`: Component documentation
- `vault/THEME_SYSTEM.md`: Theme system details
- `vault/FEATURES.md`: Feature documentation
