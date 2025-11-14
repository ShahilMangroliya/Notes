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
  border-radius: 6px;
  padding: 8px 12px;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  min-width: 40px;
  min-height: 36px;
`;

const Content = styled.Text<{$active?: boolean}>`
  color: ${props => (props.$active ? props.theme.surface : props.theme.text)};
  font-size: 15px;
  font-weight: ${props => (props.$active ? '600' : '500')};
`;

/**
 * FormatButton component for text formatting actions
 * Supports both text and icon children
 *
 * @example
 * ```tsx
 * <FormatButton
 *   $active={isBold}
 *   onPress={toggleBold}
 *   accessibilityLabel="Bold"
 * >
 *   <Icon name="bold" size={16} color={theme.text} />
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
  // Check if children is a string (text) or React element (icon)
  const isText = typeof children === 'string';

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
      {isText ? (
        <Content $active={$active}>{children}</Content>
      ) : (
        children
      )}
    </Button>
  );
};

export default FormatButton;
