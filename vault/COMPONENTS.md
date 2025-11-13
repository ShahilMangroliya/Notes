# Components Documentation

Complete guide to all reusable components in the Notes app.

## Table of Contents

1. [Overview](#overview)
2. [Component List](#component-list)
3. [Component Details](#component-details)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)

---

## Overview

All components are:
- ✅ Theme-aware (automatically use theme colors)
- ✅ Type-safe (full TypeScript support)
- ✅ Accessible (proper accessibility props)
- ✅ Documented (JSDoc comments)
- ✅ Reusable (follow DRY principles)

**Location**: `src/components/`

---

## Component List

1. **Container** - Basic themed container
2. **SafeAreaContainer** - Safe area aware container
3. **StyledText** - Themed text component
4. **Button** - Themed button with variants
5. **ButtonText** - Text component for buttons
6. **Card** - Themed card component

---

## Component Details

### Container

**Location**: `src/components/Container/`

Basic container with theme background and full flex.

#### Props

```typescript
interface ContainerProps {
  $padding?: number;  // Padding in pixels
  $margin?: number;   // Margin in pixels
}
```

#### Usage

```typescript
import {Container} from '@/components';

<Container $padding={16} $margin={8}>
  <Text>Content</Text>
</Container>
```

---

### SafeAreaContainer

**Location**: `src/components/SafeAreaContainer/`

Container that respects device safe areas (notches, status bars, etc.).

#### Props

```typescript
interface SafeAreaContainerProps {
  $edges?: ('top' | 'bottom' | 'left' | 'right')[];  // Edges to apply safe area
  $padding?: number;  // Padding in pixels
}
```

#### Usage

```typescript
import SafeAreaContainer from '@/components/SafeAreaContainer';

// All edges (default)
<SafeAreaContainer>
  <Text>Content</Text>
</SafeAreaContainer>

// Specific edges
<SafeAreaContainer $edges={['top', 'bottom']}>
  <Text>Content</Text>
</SafeAreaContainer>
```

---

### StyledText

**Location**: `src/components/Text/`

Themed text component with styling options.

#### Props

```typescript
interface StyledTextProps {
  $secondary?: boolean;              // Use secondary text color
  $align?: 'left' | 'center' | 'right';  // Text alignment
  $weight?: 'normal' | 'bold' | '600' | '700';  // Font weight
}
```

#### Usage

```typescript
import {StyledText} from '@/components';

// Primary text
<StyledText>Hello World</StyledText>

// Secondary text
<StyledText $secondary>Muted text</StyledText>

// Styled text
<StyledText $align="center" $weight="bold">
  Bold Centered Text
</StyledText>
```

---

### Button

**Location**: `src/components/Button/`

Themed button component with multiple variants and states.

#### Props

```typescript
interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'outline';  // Button style
  $disabled?: boolean;     // Disabled state
  $fullWidth?: boolean;    // Full width button
  $size?: 'small' | 'medium' | 'large';  // Button size
}
```

#### Accessibility

Automatically includes:
- `accessibilityRole="button"`
- `accessibilityState` for disabled state
- `activeOpacity` for touch feedback

#### Usage

```typescript
import {Button, ButtonText} from '@/components';

// Primary button
<Button $variant="primary" onPress={handlePress}>
  <ButtonText $variant="primary">Click me</ButtonText>
</Button>

// Secondary button
<Button $variant="secondary" $fullWidth>
  <ButtonText $variant="secondary">Secondary</ButtonText>
</Button>

// Disabled button
<Button $disabled>
  <ButtonText $disabled>Disabled</ButtonText>
</Button>

// Large outline button
<Button $variant="outline" $size="large">
  <ButtonText $variant="outline">Large</ButtonText>
</Button>
```

---

### ButtonText

**Location**: `src/components/Button/ButtonText.tsx`

Text component designed for buttons. Matches button variants.

#### Props

```typescript
interface ButtonTextProps {
  $variant?: 'primary' | 'secondary' | 'outline';  // Match parent Button
  $disabled?: boolean;  // Disabled state
}
```

#### Usage

```typescript
import {ButtonText} from '@/components';

<ButtonText $variant="primary">Button Label</ButtonText>
```

---

### Card

**Location**: `src/components/Card/`

Themed card component with customizable spacing and elevation.

#### Props

```typescript
interface CardProps {
  $padding?: number;   // Padding (default: 16)
  $margin?: number;    // Margin (default: 8)
  $radius?: number;    // Border radius (default: 12)
  $elevated?: boolean; // Show shadow/elevation
}
```

#### Usage

```typescript
import {Card} from '@/components';

// Basic card
<Card>
  <StyledText>Card content</StyledText>
</Card>

// Elevated card with custom padding
<Card $elevated $padding={24} $radius={16}>
  <StyledText>Elevated card</StyledText>
</Card>
```

---

## Usage Examples

### Example 1: Screen Layout

```typescript
import React from 'react';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import {Card, StyledText, Button, ButtonText} from '@/components';

const HomeScreen = () => {
  return (
    <SafeAreaContainer>
      <Card $elevated>
        <StyledText $weight="bold">Welcome</StyledText>
        <StyledText $secondary>
          This is a themed card component
        </StyledText>
        <Button $variant="primary" $fullWidth>
          <ButtonText $variant="primary">Get Started</ButtonText>
        </Button>
      </Card>
    </SafeAreaContainer>
  );
};
```

### Example 2: Form Layout

```typescript
import React from 'react';
import {Container, Card, StyledText, Button, ButtonText} from '@/components';

const FormScreen = () => {
  return (
    <Container $padding={16}>
      <Card $margin={0} $padding={20}>
        <StyledText $weight="bold" $align="center">
          Create Account
        </StyledText>
        
        {/* Form fields */}
        
        <Button $variant="primary" $fullWidth $size="large">
          <ButtonText $variant="primary">Submit</ButtonText>
        </Button>
      </Card>
    </Container>
  );
};
```

### Example 3: List Item

```typescript
import React from 'react';
import {Card, StyledText} from '@/components';

const NoteItem = ({title, content}) => {
  return (
    <Card $margin={8} $padding={12}>
      <StyledText $weight="bold">{title}</StyledText>
      <StyledText $secondary>{content}</StyledText>
    </Card>
  );
};
```

---

## Best Practices

### 1. Use Transient Props

✅ **DO:**
```typescript
<Button $variant="primary" $disabled={false}>
```

❌ **DON'T:**
```typescript
<Button variant="primary" disabled={false}>  // Causes React Native warning
```

### 2. Combine Components

✅ **DO:**
```typescript
<SafeAreaContainer>
  <Card $elevated>
    <StyledText>Content</StyledText>
  </Card>
</SafeAreaContainer>
```

### 3. Use Theme Colors

✅ **DO:**
```typescript
// Components automatically use theme
<Container>  // Uses theme.background
  <StyledText>  // Uses theme.text
    Hello
  </StyledText>
</Container>
```

❌ **DON'T:**
```typescript
// Don't hardcode colors
<View style={{backgroundColor: '#FFFFFF'}}>
```

### 4. Import from Index

✅ **DO:**
```typescript
import {Button, Card, StyledText} from '@/components';
```

❌ **DON'T:**
```typescript
import Button from '@/components/Button/Button';
```

### 5. Accessibility

All interactive components include accessibility props. For custom components:

```typescript
<Button
  accessibilityRole="button"
  accessibilityLabel="Save note"
  accessibilityState={{disabled: isDisabled}}
  onPress={handleSave}
>
```

---

## Component Architecture

### File Structure

```
ComponentName/
├── ComponentName.tsx    # Main component
├── index.ts             # Exports
└── ComponentName.test.tsx  # Tests (optional)
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

---

## Creating New Components

### Template

```typescript
import React from 'react';
import styled from 'styled-components/native';

/**
 * Props for ComponentName
 */
export interface ComponentNameProps {
  $prop?: string;
}

/**
 * Component description
 * 
 * @example
 * ```tsx
 * <ComponentName $prop="value">
 *   Content
 * </ComponentName>
 * ```
 */
export const ComponentName = styled.View<ComponentNameProps>`
  background-color: ${props => props.theme.background};
  /* Add styles */
`;

export default ComponentName;
```

### Checklist

- [ ] Use `$` prefix for transient props
- [ ] Add TypeScript interface for props
- [ ] Add JSDoc documentation
- [ ] Use theme colors
- [ ] Export from index.ts
- [ ] Add accessibility props if interactive
- [ ] Test with light and dark themes

---

*Last updated: 2024*


