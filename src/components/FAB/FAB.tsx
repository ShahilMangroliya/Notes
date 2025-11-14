import React from 'react';
import styled from 'styled-components/native';

/**
 * Props for FAB component
 */
export interface FABProps {
  /** Icon or content to display */
  children: React.ReactNode;
  /** Press handler */
  onPress: () => void;
  /** Position from bottom */
  $bottom?: number;
  /** Position from right */
  $right?: number;
  /** Position from left */
  $left?: number;
  /** FAB size */
  $size?: 'small' | 'medium' | 'large';
  /** Disabled state */
  $disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const StyledFAB = styled.TouchableOpacity<FABProps>`
  position: absolute;
  bottom: ${props => (props.$bottom !== undefined ? `${props.$bottom}px` : '24px')};
  right: ${props => (props.$right !== undefined ? `${props.$right}px` : props.$left === undefined ? '24px' : 'auto')};
  left: ${props => (props.$left !== undefined ? `${props.$left}px` : 'auto')};
  width: ${props => {
    if (props.$size === 'small') return '48px';
    if (props.$size === 'large') return '64px';
    return '56px';
  }};
  height: ${props => {
    if (props.$size === 'small') return '48px';
    if (props.$size === 'large') return '64px';
    return '56px';
  }};
  border-radius: ${props => {
    if (props.$size === 'small') return '24px';
    if (props.$size === 'large') return '32px';
    return '28px';
  }};
  background-color: ${props => props.theme.primary};
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px;
  elevation: 8;
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
`;

/**
 * Floating Action Button (FAB) component
 *
 * @example
 * ```tsx
 * <FAB
 *   onPress={handleCreateNote}
 *   accessibilityLabel="Create new note"
 * >
 *   <PlusIcon />
 * </FAB>
 *
 * <FAB
 *   $size="large"
 *   $bottom={80}
 *   $right={16}
 *   onPress={handleSave}
 * >
 *   <SaveIcon />
 * </FAB>
 * ```
 */
export const FAB: React.FC<FABProps> = ({
  children,
  onPress,
  $disabled = false,
  accessibilityLabel,
  ...props
}) => {
  return (
    <StyledFAB
      onPress={onPress}
      disabled={$disabled}
      activeOpacity={$disabled ? 1 : 0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled: $disabled}}
      $disabled={$disabled}
      {...props}
    >
      {children}
    </StyledFAB>
  );
};

export default FAB;
