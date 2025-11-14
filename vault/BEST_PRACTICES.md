# React Native Notes App - Best Practices

This document outlines the coding standards, architectural patterns, and best practices for the Notes React Native application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [React Native Patterns](#react-native-patterns)
4. [Styled Components](#styled-components)
5. [State Management (Redux)](#state-management-redux)
6. [File Organization](#file-organization)
7. [Naming Conventions](#naming-conventions)
8. [Import/Export Patterns](#importexport-patterns)
9. [Code Style](#code-style)
10. [Performance](#performance)
11. [Accessibility](#accessibility)
12. [Testing](#testing)

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   └── index.ts
│   └── index.ts         # Central export
├── screens/             # Screen components
│   └── ScreenName/
│       ├── ScreenName.tsx
│       └── styles.ts    # Legacy styles (if needed)
├── navigation/          # Navigation configuration
├── hooks/               # Custom React hooks
├── redux/               # Redux store and slices
├── providers/           # Context providers
├── util/                # Utility functions
├── types/               # TypeScript type definitions
└── assets/              # Images, fonts, etc.
```

### Directory Rules

- **Components**: Reusable, theme-aware styled components
- **Screens**: Full-screen components that use navigation
- **Hooks**: Custom hooks with `use` prefix
- **Redux**: Store configuration and feature slices
- **Util**: Pure utility functions (no React dependencies)
- **Types**: Global type definitions and module augmentations

---

## TypeScript Guidelines

### Type Safety

✅ **DO:**

- Always define explicit types for function parameters and return values
- Use `interface` for object shapes
- Use `type` for unions, intersections, and aliases
- Export types alongside components/hooks
- Use `as const` for literal types

```typescript
// ✅ Good
export interface ButtonProps {
  $variant?: 'primary' | 'secondary';
  $disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({$variant, $disabled}) => {
  // ...
};
```

❌ **DON'T:**

- Use `any` type
- Use implicit `any`
- Skip type definitions for props

```typescript
// ❌ Bad
const Button = ({variant, disabled}: any) => {
  // ...
};
```

### Type Inference

- Let TypeScript infer types when obvious
- Use explicit types for public APIs
- Use `ReturnType` and `Parameters` utility types

```typescript
// ✅ Good
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## React Native Patterns

### Component Structure

✅ **DO:**

- Use functional components with hooks
- Keep components small and focused
- Extract logic into custom hooks
- Use React.memo for expensive components

```typescript
// ✅ Good
const Home: React.FC = () => {
  const {isDarkMode} = useThemeStore();

  return (
    <SafeAreaContainer>
      <StyledText>Home</StyledText>
    </SafeAreaContainer>
  );
};

export default Home;
```

### Hooks Best Practices

✅ **DO:**

- Prefix custom hooks with `use`
- Return objects from hooks for flexibility
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive computations
- Clean up subscriptions in `useEffect`

```typescript
// ✅ Good
export const useThemeStore = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.theme);

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      dispatch(setThemeAction(theme));
    },
    [dispatch],
  );

  return {theme, setTheme};
};
```

### Performance

- Use `React.memo` for components that re-render frequently
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions in dependency arrays
- Avoid inline object/array creation in render

---

## Styled Components

### Transient Props

✅ **ALWAYS** use `$` prefix for styled-components props to avoid React Native warnings:

```typescript
// ✅ Good
interface ButtonProps {
  $variant?: 'primary' | 'secondary';
  $disabled?: boolean;
}

const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${props =>
    props.$variant === 'primary'
      ? props.theme.background
      : props.theme.surface};
`;
```

❌ **DON'T** use regular props (they get passed to native components):

```typescript
// ❌ Bad
interface ButtonProps {
  variant?: 'primary'; // Will cause React Native warning
}
```

### Theme Integration

- Always use `props.theme` for colors
- Declare theme types in `src/types/styled-components.d.ts`
- Use `useTheme()` hook when needed outside styled components

```typescript
// ✅ Good
const Container = styled.View`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

// ✅ Good - in regular components
const MyComponent = () => {
  const theme = useTheme();
  return <View style={{backgroundColor: theme.background}} />;
};
```

### Component Organization

- One styled component per file
- Export both named and default exports
- Create index.ts for barrel exports
- Document with JSDoc comments

### Icon Usage

✅ **DO:**

- Use the `Icon` component from `@/components/Icon`
- Use type-safe `AntDesignIconName` for icon names
- Use theme colors for icon colors
- Import icon names type when needed

```typescript
// ✅ Good - Type-safe icons
import {Icon} from '@/components/Icon';
import {useTheme} from 'styled-components/native';

const theme = useTheme();
<Icon name="arrow-left" size={24} color={theme.text} />
<Icon name="search" size={18} color={theme.textSecondary} />
```

❌ **DON'T:**

- Don't use emoji or text characters as icons
- Don't use hardcoded icon names without type checking
- Don't use styled Text components for icons

```typescript
// ❌ Bad - Using emoji
<Text>←</Text>
<Text>🔍</Text>

// ❌ Bad - No type safety
const iconName: string = 'home';  // No autocomplete/validation
<Icon name={iconName} />
```

**Icon Resources:**

- See `vault/ANTDESIGN_ICONS.md` for complete icon list
- Use `AntDesignIconName` type for autocomplete
- All icons are theme-aware and accessible

---

## State Management (Redux)

### Redux Toolkit Patterns

✅ **DO:**

- Use `createSlice` for reducers
- Use `PayloadAction` for typed actions
- Export action creators and reducer
- Use typed hooks (`useAppDispatch`, `useAppSelector`)

```typescript
// ✅ Good
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const {setTheme} = themeSlice.actions;
export default themeSlice.reducer;
```

### Store Structure

- One slice per feature/domain
- Keep slices focused and small
- Use TypeScript for all state types
- Export store types for hooks

```typescript
// ✅ Good
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## File Organization

### Component Files

```
ComponentName/
├── ComponentName.tsx    # Main component
├── ComponentName.test.tsx  # Tests (if needed)
└── index.ts             # Exports
```

### Export Pattern

```typescript
// ComponentName.tsx
export const ComponentName = styled.View`...`;
export default ComponentName;

// index.ts
export {ComponentName, default} from './ComponentName';
export type {ComponentNameProps} from './ComponentName';
```

### Screen Files

```
ScreenName/
├── ScreenName.tsx       # Screen component
└── styles.ts            # Legacy styles (if needed, prefer styled-components)
```

---

## Naming Conventions

### Files and Directories

- **Components**: PascalCase (`Button.tsx`, `SafeAreaContainer.tsx`)
- **Hooks**: camelCase with `use` prefix (`useThemeStore.ts`)
- **Utils**: PascalCase (`StorageHelper.ts`, `themeColors.ts`)
- **Types**: kebab-case for declaration files (`styled-components.d.ts`)
- **Directories**: Match file naming (PascalCase for components)

### Variables and Functions

- **Components**: PascalCase (`const Button = ...`)
- **Hooks**: camelCase with `use` prefix (`const useThemeStore = ...`)
- **Functions**: camelCase (`const getThemeColors = ...`)
- **Constants**: UPPER_SNAKE_CASE (`const THEME_STORAGE_KEY = ...`)
- **Types/Interfaces**: PascalCase (`interface ButtonProps`)

### Props

- **Styled Components**: `$` prefix for transient props (`$variant`, `$disabled`)
- **Regular Props**: camelCase (`onPress`, `isLoading`)

---

## Import/Export Patterns

### Path Aliases

✅ **ALWAYS** use `@/` alias instead of relative paths:

```typescript
// ✅ Good
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useThemeStore from '@/hooks/useThemeStore';
import {ThemeColors} from '@/util/themeColors';

// ❌ Bad
import SafeAreaContainer from '../../components/SafeAreaContainer';
import useThemeStore from '../hooks/useThemeStore';
```

### Import Order

1. React and React Native
2. Third-party libraries
3. Internal imports (using `@/` alias)
4. Types (with `type` keyword)
5. Relative imports (only if alias not available)

```typescript
// ✅ Good
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useThemeStore from '@/hooks/useThemeStore';
import type {ThemeColors} from '@/util/themeColors';
```

### Export Patterns

- Use named exports for multiple exports
- Use default export for single main export
- Re-export from index files for cleaner imports

```typescript
// ✅ Good - Component file
export const Button = styled.View`...`;
export default Button;

// ✅ Good - Index file
export {Button, default} from './Button';
export type {ButtonProps} from './Button';
```

---

## Code Style

### Prettier Configuration

- Single quotes
- Trailing commas
- No bracket spacing
- Arrow parens: avoid

### Code Formatting

- Maximum line length: 100 characters (soft limit)
- Use meaningful variable names
- Add comments for complex logic
- Use JSDoc for public APIs

### Component Patterns

```typescript
// ✅ Good - Functional component with hooks
const Home: React.FC = () => {
  const {isDarkMode} = useThemeStore();

  return (
    <SafeAreaContainer>
      <StyledText>Home</StyledText>
    </SafeAreaContainer>
  );
};

export default Home;
```

---

## Performance

### Optimization Strategies

1. **Memoization**

   - Use `React.memo` for expensive components
   - Use `useMemo` for expensive calculations
   - Use `useCallback` for functions in dependencies

2. **List Rendering**

   - Use `FlatList` for long lists
   - Implement `keyExtractor` properly
   - Use `getItemLayout` when possible

3. **Image Optimization**

   - Use appropriate image formats
   - Implement lazy loading
   - Cache images appropriately

4. **Bundle Size**
   - Use tree-shaking
   - Code split when appropriate
   - Remove unused dependencies

---

## Accessibility

### Best Practices

✅ **DO:**

- Add `accessibilityRole` to interactive elements
- Use `accessibilityLabel` for screen readers
- Set `accessibilityState` for component states
- Test with screen readers

```typescript
// ✅ Good
<Button
  accessibilityRole="button"
  accessibilityLabel="Save note"
  accessibilityState={{disabled: isDisabled}}
  onPress={handleSave}
>
  <ButtonText>Save</ButtonText>
</Button>
```

### Semantic HTML

- Use appropriate components (`TouchableOpacity` for buttons)
- Provide meaningful labels
- Support keyboard navigation
- Test with accessibility tools

---

## Testing

### Test Structure

- Unit tests for utilities
- Component tests for UI
- Integration tests for flows
- E2E tests for critical paths

### Testing Patterns

```typescript
// ✅ Good - Component test
describe('Button', () => {
  it('renders correctly', () => {
    const {getByText} = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const {getByText} = render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Additional Guidelines

### Error Handling

- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors appropriately
- Handle edge cases

### Async Operations

- Use async/await for readability
- Handle loading states
- Handle error states
- Clean up subscriptions

### Security

- Never commit secrets
- Validate user input
- Sanitize data
- Use secure storage for sensitive data

### Documentation

- Add JSDoc comments for public APIs
- Document complex logic
- Keep README updated
- Document breaking changes

---

## Checklist for New Code

Before submitting code, ensure:

- [ ] TypeScript types are defined
- [ ] Uses `@/` path aliases
- [ ] Follows naming conventions
- [ ] Styled components use `$` prefix for props
- [ ] Components are properly exported
- [ ] JSDoc comments for public APIs
- [ ] No console.logs in production code
- [ ] Accessibility props added where needed
- [ ] Error handling implemented
- [ ] Code formatted with Prettier
- [ ] No linting errors

---

## Resources

- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Styled Components Docs](https://styled-components.com)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

_Last updated: 2024_
