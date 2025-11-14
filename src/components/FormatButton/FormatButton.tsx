import React from 'react';
import styled from 'styled-components/native';

/**
 * Props for FormatButton component
 */
export interface FormatButtonProps {
  /** Icon or text to display */
  children: React.ReactNode;
  /** Active state */
  $active?: boolean;
  /** Disabled state */
  $disabled?: boolean;
  /** Press handler */
  onPress: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const Button = styled.TouchableOpacity<{$active?: boolean; $disabled?: boolean}>`
  background-color: ${props =>
    props.$active ? props.theme.text : props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 8px 12px;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  min-width: 40px;
`;

const Content = styled.Text<{$active?: boolean}>`
  color: ${props => (props.$active ? props.theme.surface : props.theme.text)};
  font-size: 16px;
  font-weight: 600;
`;

/**
 * FormatButton component for text formatting actions
 *
 * @example
 * ```tsx
 * <FormatButton
 *   $active={isBold}
 *   onPress={toggleBold}
 *   accessibilityLabel="Bold"
 * >
 *   B
 * </FormatButton>
 * ```
 */
export const FormatButton: React.FC<FormatButtonProps> = ({
  children,
  $active = false,
  $disabled = false,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <Button
      $active={$active}
      $disabled={$disabled}
      onPress={onPress}
      disabled={$disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{selected: $active, disabled: $disabled}}
    >
      <Content $active={$active}>{children}</Content>
    </Button>
  );
};

export default FormatButton;
