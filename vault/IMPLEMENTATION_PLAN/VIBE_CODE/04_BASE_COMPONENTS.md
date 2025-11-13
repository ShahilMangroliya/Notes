# Vibe Code Guide - Part 4: Base Components

## Task: Create Reusable Base Components

Create fundamental UI components following the existing pattern from the codebase.

## Component 1: IconButton

### File: `src/components/IconButton/IconButton.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';

export interface IconButtonProps {
  icon: string | React.ReactNode;
  onPress: () => void;
  $variant?: 'primary' | 'secondary' | 'ghost';
  $size?: 'small' | 'medium' | 'large';
  $active?: boolean;
  $disabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  $variant = 'primary',
  $size = 'medium',
  $active = false,
  $disabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <StyledButton
      onPress={onPress}
      $variant={$variant}
      $size={$size}
      $active={$active}
      $disabled={$disabled}
      disabled={$disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled: $disabled, selected: $active}}
    >
      {typeof icon === 'string' ? (
        <IconText $size={$size}>{icon}</IconText>
      ) : (
        icon
      )}
    </StyledButton>
  );
};

const StyledButton = styled.TouchableOpacity<{
  $variant: 'primary' | 'secondary' | 'ghost';
  $size: 'small' | 'medium' | 'large';
  $active: boolean;
  $disabled: boolean;
}>`
  background-color: ${props => {
    if (props.$disabled) return props.theme.border;
    if (props.$active) return props.theme.background;
    if (props.$variant === 'ghost') return 'transparent';
    return props.theme.surface;
  }};
  padding: ${props => {
    if (props.$size === 'small') return '6px';
    if (props.$size === 'large') return '14px';
    return '10px';
  }};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$disabled ? 0.5 : 1};
`;

const IconText = styled.Text<{$size: 'small' | 'medium' | 'large'}>`
  font-size: ${props => {
    if (props.$size === 'small') return '16px';
    if (props.$size === 'large') return '28px';
    return '20px';
  }};
  color: ${props => props.theme.text};
`;

export default IconButton;
```

### File: `src/components/IconButton/index.ts`

```typescript
export {IconButton, default} from './IconButton';
export type {IconButtonProps} from './IconButton';
```

## Component 2: Slider

### File: `src/components/Slider/Slider.tsx`

```typescript
import React from 'react';
import {Slider as RNSlider} from '@react-native-community/slider';
import styled from 'styled-components/native';

export interface SliderProps {
  $value: number;
  onValueChange: (value: number) => void;
  $min?: number;
  $max?: number;
  $step?: number;
  label?: string;
  $showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  $value,
  onValueChange,
  $min = 0,
  $max = 100,
  $step = 1,
  label,
  $showValue = true,
}) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <SliderRow>
        <StyledSlider
          value={$value}
          onValueChange={onValueChange}
          minimumValue={$min}
          maximumValue={$max}
          step={$step}
          minimumTrackTintColor={(theme: any) => theme.text}
          maximumTrackTintColor={(theme: any) => theme.border}
          thumbTintColor={(theme: any) => theme.text}
        />
        {$showValue && <ValueLabel>{$value}</ValueLabel>}
      </SliderRow>
    </Container>
  );
};

const Container = styled.View`
  margin: 8px 0;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const SliderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const StyledSlider = styled(RNSlider)`
  flex: 1;
  height: 40px;
`;

const ValueLabel = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
  min-width: 40px;
  text-align: right;
`;

export default Slider;
```

### File: `src/components/Slider/index.ts`

```typescript
export {Slider, default} from './Slider';
export type {SliderProps} from './Slider';
```

## Component 3: ColorPicker

### File: `src/components/ColorPicker/ColorPicker.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import {NOTE_COLORS} from '@/types/note';

export interface ColorPickerProps {
  $selectedColor: string;
  onColorSelect: (color: string) => void;
  colors?: readonly string[];
  $variant?: 'compact' | 'full';
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  $selectedColor,
  onColorSelect,
  colors = NOTE_COLORS,
  $variant = 'compact',
  label,
}) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 8}}
      >
        {colors.map(color => (
          <ColorButton
            key={color}
            onPress={() => onColorSelect(color)}
            $color={color}
            $selected={$selectedColor === color}
            $size={$variant === 'compact' ? 32 : 44}
            accessibilityRole="button"
            accessibilityLabel={`Select color ${color}`}
            accessibilityState={{selected: $selectedColor === color}}
          >
            {$selectedColor === color && <Checkmark>✓</Checkmark>}
          </ColorButton>
        ))}
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  margin: 8px 0;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const ColorButton = styled.TouchableOpacity<{
  $color: string;
  $selected: boolean;
  $size: number;
}>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: ${props => props.$size / 2}px;
  background-color: ${props => props.$color};
  border-width: ${props => props.$selected ? 3 : 1}px;
  border-color: ${props => props.$selected ? props.theme.text : props.theme.border};
  align-items: center;
  justify-content: center;
`;

const Checkmark = styled.Text`
  font-size: 18px;
  color: #000;
  font-weight: bold;
`;

export default ColorPicker;
```

### File: `src/components/ColorPicker/index.ts`

```typescript
export {ColorPicker, default} from './ColorPicker';
export type {ColorPickerProps} from './ColorPicker';
```

## Component 4: FAB (Floating Action Button)

### File: `src/components/FAB/FAB.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';

export interface FABProps {
  onPress: () => void;
  icon: React.ReactNode;
  $position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  $size?: 'small' | 'medium' | 'large';
  label?: string;
  accessibilityLabel: string;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  $position = 'bottom-right',
  $size = 'medium',
  label,
  accessibilityLabel,
}) => {
  return (
    <Container $position={$position}>
      <Button
        onPress={onPress}
        $size={$size}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {icon}
        {label && <Label>{label}</Label>}
      </Button>
    </Container>
  );
};

const Container = styled.View<{$position: 'bottom-right' | 'bottom-center' | 'bottom-left'}>`
  position: absolute;
  bottom: 24px;
  ${props => {
    if (props.$position === 'bottom-center') return 'left: 50%; transform: translateX(-50%);';
    if (props.$position === 'bottom-left') return 'left: 24px;';
    return 'right: 24px;';
  }}
`;

const Button = styled.TouchableOpacity<{$size: 'small' | 'medium' | 'large'}>`
  width: ${props => {
    if (props.$size === 'small') return '48px';
    if (props.$size === 'large') return '72px';
    return '56px';
  }};
  height: ${props => {
    if (props.$size === 'small') return '48px';
    if (props.$size === 'large') return '72px';
    return '56px';
  }};
  border-radius: ${props => {
    if (props.$size === 'small') return '24px';
    if (props.$size === 'large') return '36px';
    return '28px';
  }};
  background-color: ${props => props.theme.background};
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const Label = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.text};
  margin-top: 4px;
`;

export default FAB;
```

### File: `src/components/FAB/index.ts`

```typescript
export {FAB, default} from './FAB';
export type {FABProps} from './FAB';
```

## Component 5: Modal

### File: `src/components/Modal/Modal.tsx`

```typescript
import React from 'react';
import {Modal as RNModal, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';

export interface ModalProps {
  $visible: boolean;
  onClose: () => void;
  $variant?: 'center' | 'bottom-sheet';
  $dismissOnBackdrop?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  $visible,
  onClose,
  $variant = 'center',
  $dismissOnBackdrop = true,
  children,
}) => {
  return (
    <RNModal
      visible={$visible}
      transparent
      animationType={$variant === 'bottom-sheet' ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={$dismissOnBackdrop ? onClose : undefined}>
        <Backdrop>
          <TouchableWithoutFeedback>
            <Content $variant={$variant}>
              {children}
            </Content>
          </TouchableWithoutFeedback>
        </Backdrop>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const Content = styled.View<{$variant: 'center' | 'bottom-sheet'}>`
  background-color: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 24px;
  ${props => props.$variant === 'center' ? `
    max-width: 90%;
    width: 400px;
  ` : `
    width: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    position: absolute;
    bottom: 0;
  `}
`;

export default Modal;
```

### File: `src/components/Modal/index.ts`

```typescript
export {Modal, default} from './Modal';
export type {ModalProps} from './Modal';
```

## Component 6: ConfirmDialog

### File: `src/components/ConfirmDialog/ConfirmDialog.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import ButtonText from '@/components/Button/ButtonText';

export interface ConfirmDialogProps {
  $visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  $confirmText?: string;
  $cancelText?: string;
  $destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  $visible,
  title,
  message,
  onConfirm,
  onCancel,
  $confirmText = 'Confirm',
  $cancelText = 'Cancel',
  $destructive = false,
}) => {
  return (
    <Modal $visible={$visible} onClose={onCancel}>
      <Title>{title}</Title>
      <Message>{message}</Message>
      <ButtonRow>
        <StyledButton onPress={onCancel}>
          <ButtonText>{$cancelText}</ButtonText>
        </StyledButton>
        <StyledButton onPress={onConfirm} $variant="primary">
          <ButtonText $destructive={$destructive}>{$confirmText}</ButtonText>
        </StyledButton>
      </ButtonRow>
    </Modal>
  );
};

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 12px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 24px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
`;

const StyledButton = styled(Button)`
  min-width: 100px;
`;

export default ConfirmDialog;
```

### File: `src/components/ConfirmDialog/index.ts`

```typescript
export {ConfirmDialog, default} from './ConfirmDialog';
export type {ConfirmDialogProps} from './ConfirmDialog';
```

## Update: `src/components/index.ts`

Add exports for all new components:

```typescript
// Existing exports
export {default as SafeAreaContainer} from './SafeAreaContainer';
export {default as Container} from './Container';
export {default as Text} from './Text';
export {default as Card} from './Card';
export {default as Button} from './Button';
export {default as ButtonText} from './Button/ButtonText';

// New exports
export {default as IconButton} from './IconButton';
export {default as Slider} from './Slider';
export {default as ColorPicker} from './ColorPicker';
export {default as FAB} from './FAB';
export {default as Modal} from './Modal';
export {default as ConfirmDialog} from './ConfirmDialog';
```

## Verification Checklist

- [ ] All components use transient props with `$` prefix
- [ ] All components use `@/` imports
- [ ] All components have proper TypeScript types
- [ ] All interactive components have accessibility props
- [ ] All components use theme colors
- [ ] Styled-components follow existing pattern
- [ ] index.ts files created for all components
- [ ] No `any` types used
- [ ] TypeScript compiles without errors

## Next Step

Proceed to **Part 5: Home Screen Implementation**.
