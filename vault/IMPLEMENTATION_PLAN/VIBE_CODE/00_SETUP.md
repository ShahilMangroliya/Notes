# Vibe Code Guide - Part 0: Project Setup

## Context for AI Model

You are working on a React Native Notes application. This file contains the setup instructions.

## Project Information

- **Framework**: React Native 0.82.1
- **Language**: TypeScript (strict mode, no `any` types)
- **State Management**: Redux Toolkit
- **Styling**: styled-components/native
- **Storage**: react-native-mmkv
- **Path Alias**: `@/` maps to `src/`

## Critical Rules

1. **ALWAYS use `@/` path alias** - NEVER use relative paths like `../../`
2. **ALWAYS use `$` prefix for styled-components props** - e.g., `$variant`, `$disabled`
3. **NEVER use `any` type** - Always define explicit types
4. **ALWAYS use typed Redux hooks** - Import from `@/hooks/hooks`, not from `react-redux`
5. **ALWAYS add accessibility props** - `accessibilityLabel`, `accessibilityRole`, etc.

## Dependencies to Install

```bash
# Core drawing and export
npm install @shopify/react-native-skia
npm install react-native-svg
npm install react-native-share
npm install react-native-html-to-pdf
npm install react-native-blob-util
npm install react-native-view-shot

# Voice features
npm install @react-native-voice/voice
npm install react-native-tts

# Utilities
npm install uuid
npm install --save-dev @types/uuid

# iOS setup
cd ios
bundle install
bundle exec pod install
cd ..
```

## Platform Configuration

### iOS: `ios/Notes/Info.plist`

Add these permissions:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for voice input</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for voice input</string>
```

### Android: `android/app/src/main/AndroidManifest.xml`

Add these permissions:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Existing Theme System

The app already has a complete theme system:

- Theme mode: `'light' | 'dark' | 'system'`
- Theme colors: `background`, `surface`, `text`, `textSecondary`, `border`
- Access via: `props.theme.background` in styled-components
- Hook: `useThemeStore()` from `@/hooks/useThemeStore`

## Example of Correct Patterns

### ✅ Correct Import Pattern
```typescript
import SafeAreaContainer from '@/components/SafeAreaContainer';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import type {Note} from '@/types/note';
```

### ❌ Wrong Import Pattern
```typescript
import SafeAreaContainer from '../../components/SafeAreaContainer';
import {useDispatch, useSelector} from 'react-redux';
```

### ✅ Correct Styled Component
```typescript
interface ButtonProps {
  $variant?: 'primary' | 'secondary';
  $disabled?: boolean;
}

const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${props =>
    props.$variant === 'primary' ? props.theme.background : props.theme.surface
  };
  opacity: ${props => props.$disabled ? 0.5 : 1};
`;

// Usage
<Button $variant="primary" $disabled={false} />
```

### ❌ Wrong Styled Component
```typescript
const Button = styled.TouchableOpacity<{variant: string}>`
  background-color: #fff;  // Wrong: hardcoded color
`;

<Button variant="primary" />  // Wrong: no $ prefix
```

### ✅ Correct Redux Usage
```typescript
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(state => state.notes.notes);

  // ...
};
```

### ✅ Correct TypeScript
```typescript
export interface ComponentProps {
  onPress: () => void;
  title: string;
  count?: number;
}

export const Component: React.FC<ComponentProps> = ({onPress, title, count = 0}) => {
  // ...
};
```

## Storage Pattern

```typescript
import StorageHelper from '@/util/StorageHelper';

// Get item
const value = StorageHelper.getItem('notes.list', 'string');

// Set item
StorageHelper.setItem('notes.list', JSON.stringify(data));

// Remove item
StorageHelper.removeItem('notes.list');
```

## Component Export Pattern

```typescript
// ComponentName.tsx
export const ComponentName = styled.View`...`;
export default ComponentName;

// index.ts
export {ComponentName, default} from './ComponentName';
export type {ComponentNameProps} from './ComponentName';
```

## Ready for Next Steps

Once setup is complete, proceed to:
- Part 1: Type Definitions
- Part 2: Redux Slices
- Part 3: Components

**REMEMBER**: Follow these patterns EXACTLY in all code generation.
