import styled from 'styled-components/native';

/**
 * Props for ButtonText component
 */
export interface ButtonTextProps {
  /** Button variant to match parent Button */
  $variant?: 'primary' | 'secondary' | 'outline';
  /** Disabled state */
  $disabled?: boolean;
}

/**
 * Themed ButtonText component that matches Button variants
 *
 * @example
 * ```tsx
 * <Button $variant="primary">
 *   <ButtonText $variant="primary">Click me</ButtonText>
 * </Button>
 * ```
 */
export const ButtonText = styled.Text<ButtonTextProps>`
  color: ${props => {
    if (props.$disabled) return props.theme.textSecondary;
    if (props.$variant === 'secondary' || props.$variant === 'outline') {
      return props.theme.text;
    }
    return props.theme.text;
  }};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

export default ButtonText;
