# Features Documentation

Complete overview of all features and implementations in the Notes app.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Theme System](#theme-system)
3. [Component Library](#component-library)
4. [State Management](#state-management)
5. [Navigation](#navigation)
6. [Storage](#storage)
7. [Path Aliases](#path-aliases)
8. [TypeScript Configuration](#typescript-configuration)
9. [Build Configuration](#build-configuration)

---

## Project Setup

### Tech Stack

- **React Native**: 0.82.1
- **React**: 19.1.1
- **TypeScript**: 5.8.3
- **Redux Toolkit**: 2.10.1
- **Styled Components**: 6.1.19
- **React Navigation**: 7.1.19
- **MMKV**: 4.0.0 (Storage)

### Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation setup
├── hooks/              # Custom React hooks
├── redux/              # Redux store and slices
├── providers/          # Context providers
├── util/               # Utility functions
├── types/              # TypeScript definitions
└── assets/             # Static assets
```

---

## Theme System

### Implementation

Complete theme system with:
- Light and dark mode support
- System theme detection
- Persistent theme preferences
- Real-time theme switching
- Styled-components integration

### Files

- `src/util/themeColors.ts` - Color definitions
- `src/providers/ThemeProvider.tsx` - Theme provider
- `src/hooks/useThemeStore.ts` - Theme state hook
- `src/hooks/useColorScheme.ts` - Combined theme hook
- `src/redux/themeSlice.ts` - Redux slice
- `src/types/styled-components.d.ts` - Type declarations

### Features

✅ Three theme modes: `light`, `dark`, `system`  
✅ Automatic system theme detection  
✅ MMKV persistence  
✅ Redux state management  
✅ Styled-components integration  
✅ Type-safe theme colors  

**See**: [THEME_SYSTEM.md](./THEME_SYSTEM.md) for detailed documentation

---

## Component Library

### Available Components

1. **Container** - Basic themed container
2. **SafeAreaContainer** - Safe area aware container
3. **StyledText** - Themed text with styling options
4. **Button** - Themed button with variants
5. **ButtonText** - Button text component
6. **Card** - Themed card with elevation

### Features

✅ All components are theme-aware  
✅ Type-safe with TypeScript  
✅ Accessible (proper accessibility props)  
✅ Documented with JSDoc  
✅ Use transient props (`$` prefix)  
✅ Follow React Native best practices  

**See**: [COMPONENTS.md](./COMPONENTS.md) for detailed documentation

---

## State Management

### Redux Toolkit

Using Redux Toolkit for state management.

#### Store Configuration

**Location**: `src/redux/store.ts`

```typescript
export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Typed Hooks

**Location**: `src/hooks/hooks.ts`

```typescript
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

#### Current Slices

- **themeSlice** - Theme state management

### Usage

```typescript
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.theme);
  
  // Use theme state
};
```

---

## Navigation

### Setup

**Location**: `src/navigation/Navigation.tsx`

Using React Navigation v7 with native stack navigator.

### Configuration

- Native stack navigator
- Theme-aware navigation
- Status bar styling
- Header configuration

### Screens

- **Home** - Main screen
- **CreateNote** - Note creation screen

### Theme Integration

Navigation automatically uses theme colors:

```typescript
<NavigationContainer
  theme={{
    dark: isDarkMode,
    colors: {
      background: colors.background,
      // ... other colors
    },
  }}
>
```

---

## Storage

### MMKV

Using `react-native-mmkv` for fast, synchronous storage.

**Location**: `src/util/StorageHelper.ts`

### API

```typescript
import StorageHelper from '@/util/StorageHelper';

// Get item
const value = StorageHelper.getItem(key, 'string');

// Set item
StorageHelper.setItem(key, value);

// Remove item
StorageHelper.removeItem(key);

// Clear all
StorageHelper.clear();
```

### Supported Types

- `boolean`
- `string`
- `number`
- `arrayBuffer`

### Usage

Currently used for:
- Theme preference persistence (`notes.theme`)

---

## Path Aliases

### Configuration

Path aliases configured to use `@/` instead of relative paths.

#### TypeScript

**Location**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### Babel

**Location**: `babel.config.js`

```javascript
[
  'module-resolver',
  {
    root: ['./src'],
    alias: {
      '@': './src',
    },
  },
]
```

### Usage

```typescript
// ✅ Good
import Component from '@/components/Component';
import useHook from '@/hooks/useHook';

// ❌ Bad
import Component from '../../components/Component';
```

**See**: [vault/PATH_ALIAS_SETUP.md](./PATH_ALIAS_SETUP.md) for detailed setup

---

## TypeScript Configuration

### Setup

**Location**: `tsconfig.json`

- Extends React Native TypeScript config
- Path aliases configured
- Strict type checking

### Type Declarations

**Location**: `src/types/`

- `styled-components.d.ts` - Styled-components theme types

### Best Practices

- No `any` types
- Explicit type definitions
- Interface for object shapes
- Type for unions/intersections
- Export types alongside components

---

## Build Configuration

### Babel

**Location**: `babel.config.js`

- React Native preset
- Module resolver for path aliases
- React Native worklets plugin
- Console removal in production

### Metro

**Location**: `metro.config.js`

- Default React Native configuration
- Extensible for custom needs

### Prettier

**Location**: `.prettierrc.js`

- Single quotes
- Trailing commas
- No bracket spacing
- Arrow parens: avoid

---

## App Structure

### Entry Point

**Location**: `src/App.tsx`

```typescript
<Provider store={store}>
  <ThemeProvider>
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  </ThemeProvider>
</Provider>
```

### Provider Hierarchy

1. Redux Provider
2. Theme Provider (styled-components)
3. SafeAreaProvider
4. NavigationContainer

---

## Development Workflow

### Scripts

```json
{
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "start": "react-native start",
  "lint": "eslint .",
  "test": "jest",
  "cs": "watchman watch-del-all && npm start -- --reset-cache"
}
```

### Code Quality

- ESLint configured
- Prettier for formatting
- TypeScript for type safety
- Best practices enforced

---

## Future Enhancements

### Planned Features

- [ ] Notes CRUD operations
- [ ] Search functionality
- [ ] Categories/Tags
- [ ] Rich text editing
- [ ] Image attachments
- [ ] Sync functionality
- [ ] Export/Import
- [ ] Settings screen

### Technical Improvements

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Analytics

---

## Documentation Files

- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Coding standards
- [THEME_SYSTEM.md](./THEME_SYSTEM.md) - Theme documentation
- [COMPONENTS.md](./COMPONENTS.md) - Components guide
- [PATH_ALIAS_SETUP.md](./PATH_ALIAS_SETUP.md) - Path alias setup
- [FEATURES.md](./FEATURES.md) - This file

---

## Quick Reference

### Import Patterns

```typescript
// Components
import {Button, Card} from '@/components';

// Hooks
import useThemeStore from '@/hooks/useThemeStore';
import {useColorScheme} from '@/hooks/useColorScheme';

// Utils
import StorageHelper from '@/util/StorageHelper';
import {getThemeColors} from '@/util/themeColors';

// Redux
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
```

### Common Patterns

```typescript
// Theme-aware component
const MyComponent = () => {
  const {isDarkMode} = useThemeStore();
  return <Container>...</Container>;
};

// Styled component
const StyledView = styled.View`
  background-color: ${props => props.theme.background};
`;

// Redux action
const dispatch = useAppDispatch();
dispatch(setTheme('dark'));
```

---

*Last updated: 2024*


