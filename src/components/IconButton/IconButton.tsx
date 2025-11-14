import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

/**
 * Props for IconButton component
 */
export interface IconButtonProps {
  /** Icon element to display */
  children: React.ReactNode;
  /** Button variant style */
  $variant?: 'default' | 'primary' | 'secondary';
  /** Button size */
  $size?: 'small' | 'medium' | 'large';
  /** Disabled state */
  $disabled?: boolean;
  /** Circular button shape */
  $circular?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Press handler */
  onPress?: () => void;
}

/**
 * Themed IconButton component for icon-based actions
 *
 * @example
 * ```tsx
 * <IconButton
 *   onPress={handleDelete}
 *   accessibilityLabel="Delete note"
 * >
 *   <DeleteIcon />
 * </IconButton>
 *
 * <IconButton
 *   $variant="primary"
 *   $size="large"
 *   $circular
 *   onPress={handleAdd}
 * >
 *   <PlusIcon />
 * </IconButton>
 * ```
 */
const StyledIconButton = styled(TouchableOpacity).attrs<IconButtonProps>(
  props => ({
    activeOpacity: props.$disabled ? 1 : 0.6,
    disabled: props.$disabled,
    accessibilityRole: 'button',
    accessibilityState: {disabled: props.$disabled},
    accessibilityLabel: props.accessibilityLabel,
  }),
)<IconButtonProps>`
  background-color: ${props => {
    if (props.$disabled) return props.theme.surface;
    if (props.$variant === 'primary') return props.theme.background;
    if (props.$variant === 'secondary') return props.theme.surface;
    return 'transparent';
  }};
  border-radius: ${props => {
    const size =
      props.$size === 'small' ? 20 : props.$size === 'large' ? 28 : 24;
    return props.$circular ? `${size}px` : '8px';
  }};
  padding: ${props => {
    if (props.$size === 'small') return '6px';
    if (props.$size === 'large') return '14px';
    return '10px';
  }};
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  ${props =>
    props.$variant === 'default' && !props.$disabled
      ? `border: 1px solid ${props.theme.border};`
      : ''}
`;

export const IconButton: React.FC<IconButtonProps> = props => {
  return <StyledIconButton {...props}>{props.children}</StyledIconButton>;
};

export default IconButton;
