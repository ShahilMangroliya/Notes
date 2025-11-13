import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

/**
 * Props for Button component
 */
export interface ButtonProps {
  /** Button variant style */
  $variant?: 'primary' | 'secondary' | 'outline';
  /** Disabled state */
  $disabled?: boolean;
  /** Full width button */
  $fullWidth?: boolean;
  /** Button size */
  $size?: 'small' | 'medium' | 'large';
}

/**
 * Themed Button component with multiple variants and states
 *
 * @example
 * ```tsx
 * <Button $variant="primary" onPress={handlePress}>
 *   <ButtonText>Click me</ButtonText>
 * </Button>
 * <Button $variant="secondary" $fullWidth $disabled>
 *   <ButtonText>Disabled</ButtonText>
 * </Button>
 * ```
 */
export const Button = styled(TouchableOpacity).attrs<ButtonProps>(props => ({
  activeOpacity: props.$disabled ? 1 : 0.7,
  disabled: props.$disabled,
  accessibilityRole: 'button',
  accessibilityState: {disabled: props.$disabled},
}))<ButtonProps>`
  background-color: ${props => {
    if (props.$disabled) return props.theme.surface;
    if (props.$variant === 'outline' || props.$variant === 'secondary') {
      return props.theme.surface;
    }
    return props.theme.background;
  }};
  border: 1px solid
    ${props =>
      props.$variant === 'outline' ? props.theme.border : 'transparent'};
  border-radius: 8px;
  padding: ${props => {
    if (props.$size === 'small') return '8px 16px';
    if (props.$size === 'large') return '16px 32px';
    return '12px 24px';
  }};
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  ${props => props.$fullWidth && 'width: 100%;'}
`;

export default Button;
